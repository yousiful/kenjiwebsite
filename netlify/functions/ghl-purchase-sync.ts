import type { Config } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import crypto from 'crypto';

/**
 * Runs every 15 minutes. Fixes the real gap found 2026-08-30/31: the
 * OrderFormPurchase pixel event only fires on the order confirmation page,
 * three pages past checkout on the GHL-native funnel -- so any customer
 * whose browser doesn't complete that full redirect chain pays successfully
 * but is never counted. Meta's delivery algorithm was starved of real
 * conversion signal for days because of this, not because sales weren't
 * happening.
 *
 * This decouples tracking from the page journey entirely: poll GHL's
 * payment records directly for new succeeded transactions and fire the
 * OrderFormPurchase event server-side, straight off the real payment
 * event. A customer who pays is counted, whether or not they ever see the
 * confirmation page.
 *
 * Dedup via Netlify Blobs (one key per GHL transaction _id) so a
 * transaction already sent here is never double-fired, including for ones
 * that DO also reach the confirmation page and fire the client-side pixel
 * -- Meta dedupes on event_id if the client-side pixel ever sends the same
 * transaction id, but the store here is the first line of defense so this
 * function itself never re-sends on its own re-runs.
 *
 * Env vars: GHL_PIT, GHL_LOCATION_ID, META_PIXEL_ID, META_CAPI_TOKEN.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const META_API_VERSION = 'v21.0';
const DEFAULT_LOCATION_ID = 'q5L4ttbBMHNxieXIcTVJ';
// Meta CAPI rejects events older than 7 days -- no point fetching further back.
const LOOKBACK_MS = 6 * 24 * 60 * 60 * 1000; // 6 days, leaves a safety margin under the 7-day hard limit

const sha256 = (v: string) => crypto.createHash('sha256').update(v.trim().toLowerCase()).digest('hex');

interface GhlTransaction {
  _id: string;
  status: string;
  contactId: string;
  contactName?: string;
  contactEmail?: string;
  amount: number;
  currency: string;
  createdAt: string;
}

interface GhlContact {
  contact?: {
    phone?: string;
    attributionSource?: { fbc?: string; fbp?: string };
  };
}

export default async () => {
  const ghlToken = process.env.GHL_PIT;
  const pixelId = process.env.META_PIXEL_ID;
  const capiToken = process.env.META_CAPI_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID || DEFAULT_LOCATION_ID;

  if (!ghlToken || !pixelId || !capiToken) {
    console.error('ghl-purchase-sync: missing GHL_PIT, META_PIXEL_ID, or META_CAPI_TOKEN');
    return new Response('not configured', { status: 500 });
  }

  const store = getStore('purchase-sync-processed');

  const txRes = await fetch(
    `${GHL_BASE}/payments/transactions?altId=${locationId}&altType=location&limit=50`,
    { headers: { Authorization: `Bearer ${ghlToken}`, Version: GHL_VERSION } }
  );
  if (!txRes.ok) {
    console.error('ghl-purchase-sync: GHL transactions fetch failed', txRes.status);
    return new Response('ghl fetch failed', { status: 502 });
  }
  const txData = (await txRes.json()) as { data?: GhlTransaction[] };
  const cutoff = Date.now() - LOOKBACK_MS;

  const candidates = (txData.data || []).filter((t) => {
    if (t.status !== 'succeeded') return false;
    const created = new Date(t.createdAt).getTime();
    return created >= cutoff;
  });

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const t of candidates) {
    const blobKey = `txn-${t._id}`;
    const already = await store.get(blobKey);
    if (already) {
      skipped++;
      continue;
    }

    // Pull phone + fbc/fbp for match quality. Best-effort -- an email-only
    // match is still useful to Meta, don't fail the whole event over it.
    let phone: string | undefined;
    let fbc: string | undefined;
    let fbp: string | undefined;
    try {
      const cRes = await fetch(`${GHL_BASE}/contacts/${t.contactId}`, {
        headers: { Authorization: `Bearer ${ghlToken}`, Version: GHL_VERSION },
      });
      if (cRes.ok) {
        const cData = (await cRes.json()) as GhlContact;
        phone = cData.contact?.phone;
        fbc = cData.contact?.attributionSource?.fbc;
        fbp = cData.contact?.attributionSource?.fbp;
      }
    } catch {
      /* best-effort, proceed without it */
    }

    const userData: Record<string, unknown> = {};
    if (t.contactEmail) userData.em = [sha256(t.contactEmail)];
    if (phone) userData.ph = [sha256(phone.replace(/^\+/, ''))];
    if (fbc) userData.fbc = fbc;
    if (fbp) userData.fbp = fbp;

    const eventTime = Math.floor(new Date(t.createdAt).getTime() / 1000);
    const payload = {
      data: [
        {
          event_name: 'OrderFormPurchase',
          event_time: eventTime,
          event_id: t._id,
          action_source: 'website',
          event_source_url: 'https://freedom.kenjiai.com/',
          user_data: userData,
          custom_data: { value: t.amount, currency: (t.currency || 'usd').toUpperCase() },
        },
      ],
    };

    try {
      const capiRes = await fetch(
        `https://graph.facebook.com/${META_API_VERSION}/${pixelId}/events?access_token=${capiToken}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      if (capiRes.ok) {
        await store.set(blobKey, JSON.stringify({ sentAt: new Date().toISOString(), amount: t.amount }));
        sent++;
      } else {
        const errBody = await capiRes.text();
        console.error('ghl-purchase-sync: CAPI send failed for', t._id, errBody);
        failed++;
      }
    } catch (err) {
      console.error('ghl-purchase-sync: CAPI request threw for', t._id, err);
      failed++;
    }
  }

  const summary = `ghl-purchase-sync: ${sent} sent, ${skipped} already processed, ${failed} failed (checked ${candidates.length} succeeded transactions in the last 6 days)`;
  console.log(summary);
  return new Response(summary, { status: 200 });
};

export const config: Config = {
  schedule: '*/15 * * * *',
};
