import type { Config } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import crypto from 'crypto';

/**
 * Runs every 15 minutes. Fixes the real gap found 2026-08-30/31: a purchase
 * pixel event only fired on the order confirmation page, three pages past
 * checkout on the GHL-native funnel -- so any customer whose browser
 * doesn't complete that full redirect chain pays successfully but is never
 * counted. Meta's delivery algorithm was starved of real conversion signal
 * for days because of this, not because sales weren't happening.
 *
 * This decouples tracking from the page journey entirely: poll GHL's
 * payment records directly for new succeeded transactions and fire a
 * Purchase event server-side, straight off the real payment event. A
 * customer who pays is counted, whether or not they ever see the
 * confirmation page.
 *
 * **Second real bug found and fixed 2026-09-26**: this function sent
 * `event_name: 'OrderFormPurchase'`, a non-standard custom event name, not
 * Meta's actual `Purchase` standard event -- confirmed via the pixel's own
 * /stats endpoint, which showed real `OrderFormPurchase` events landing but
 * zero events ever named `Purchase`. That's very likely the deeper reason
 * behind the recurring "Meta shows 0 purchases despite real sales" pattern
 * documented multiple times this account's history -- a custom-named event
 * doesn't feed standard purchase reporting/optimization no matter how
 * correct the rest of the payload (fbc/fbp/value/hashed PII) is. Renamed to
 * the real `Purchase` standard event. If a confirmation-page pixel fire
 * still exists inside GHL's own page builder for this funnel (not visible
 * to this repo, no public API to check it), it may still be firing the old
 * `OrderFormPurchase` name -- worth a manual check in GHL if this doesn't
 * fully resolve the pattern.
 *
 * Dedup via Netlify Blobs (one key per GHL transaction _id) so a
 * transaction already sent here is never double-fired, including for ones
 * that DO also reach the confirmation page and fire a client-side pixel --
 * Meta dedupes on event_id if a client-side pixel ever sends the same
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
  entitySourceName?: string;
  entitySourceSubType?: string;
  chargeSnapshot?: { description?: string };
}

/**
 * Third real bug, found 2026-10-02: this function used to send EVERY succeeded
 * GHL transaction as a Purchase. In a real 3-day window that was 37 events
 * (28 recurring "Manual Payment" charges, 8 $7 subscription renewals, 1 real
 * new buyer) against 40 Purchase events on the pixel, so Meta was optimizing
 * the low-ticket ad sets toward existing clients paying bills, and reporting
 * "4 purchases" on days with zero new sales.
 *
 * Only a NEW low-ticket order-form purchase counts now:
 * - source is one of the low-ticket funnels (LOW_TICKET_FUNNELS, overridable via env),
 * - not a "Manual Payment" (GHL billing, never an ad conversion),
 * - not a subscription renewal: GHL renewal charges carry a Stripe description
 *   "Invoice XXXX-000N"; the first charge carries the product name instead.
 */
const LOW_TICKET_FUNNELS = (process.env.LOW_TICKET_FUNNEL_MATCH || '#1 All Offers In 1 funnel|#1 NEW CLIENTs HERO')
  .split('|')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

const isNewLowTicketPurchase = (t: GhlTransaction) => {
  const source = (t.entitySourceName || '').trim().toLowerCase();
  const description = (t.chargeSnapshot?.description || '').trim();
  if (!source || source.startsWith('manual')) return false;
  if (/^invoice\b/i.test(description)) return false;
  return LOW_TICKET_FUNNELS.some((f) => source.startsWith(f));
};

interface GhlAttribution {
  fbc?: string;
  fbp?: string;
  ip?: string;
  userAgent?: string;
}

interface GhlContact {
  contact?: {
    phone?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    attributionSource?: GhlAttribution;
    lastAttributionSource?: GhlAttribution;
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

  const recent = (txData.data || []).filter((t) => {
    if (t.status !== 'succeeded') return false;
    const created = new Date(t.createdAt).getTime();
    return created >= cutoff;
  });
  const candidates = recent.filter(isNewLowTicketPurchase);
  const ignored = recent.length - candidates.length;

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

    // Pull every real match-quality field GHL actually has on file. Best-effort
    // throughout -- a thinner match is still useful to Meta, don't fail the
    // whole event over a missing field.
    //
    // Fixed 2026-09-27: this used to send only em/ph/fbc/fbp, and EMQ (Event
    // Match Quality) came back 4/10 once the event-name fix above got it
    // scored at all. `client_ip_address` and `client_user_agent` -- the two
    // fields Meta's own CAPI docs call the biggest single lever for
    // server-side "website" events -- were never sent, even though GHL has
    // both on file at `attributionSource.ip`/`attributionSource.userAgent`
    // (confirmed via a live contact pull). Also added fn/ln/ct/st/zp/country
    // (all on the base contact record) and a hashed external_id (the GHL
    // contactId) so Meta can still link repeat events for the same person
    // when the PII fields don't align. Prefer `lastAttributionSource` over
    // `attributionSource` for fbc/fbp/ip/userAgent -- the most recent session
    // is closer in time to the actual purchase than the contact's first-ever
    // touch, especially for a repeat visitor.
    let phone: string | undefined;
    let firstName: string | undefined;
    let lastName: string | undefined;
    let city: string | undefined;
    let state: string | undefined;
    let postalCode: string | undefined;
    let country: string | undefined;
    let fbc: string | undefined;
    let fbp: string | undefined;
    let clientIp: string | undefined;
    let clientUserAgent: string | undefined;
    try {
      const cRes = await fetch(`${GHL_BASE}/contacts/${t.contactId}`, {
        headers: { Authorization: `Bearer ${ghlToken}`, Version: GHL_VERSION },
      });
      if (cRes.ok) {
        const cData = (await cRes.json()) as GhlContact;
        const c = cData.contact;
        phone = c?.phone;
        firstName = c?.firstName;
        lastName = c?.lastName;
        city = c?.city;
        state = c?.state;
        postalCode = c?.postalCode;
        country = c?.country;
        const attr = c?.lastAttributionSource || c?.attributionSource;
        fbc = attr?.fbc;
        fbp = attr?.fbp;
        clientIp = attr?.ip;
        clientUserAgent = attr?.userAgent;
      }
    } catch {
      /* best-effort, proceed without it */
    }

    const userData: Record<string, unknown> = {};
    if (t.contactEmail) userData.em = [sha256(t.contactEmail)];
    if (phone) userData.ph = [sha256(phone.replace(/^\+/, ''))];
    if (firstName) userData.fn = [sha256(firstName)];
    if (lastName) userData.ln = [sha256(lastName)];
    if (city) userData.ct = [sha256(city.replace(/[^a-zA-Z]/g, ''))];
    // Note: Meta's spec wants a 2-letter state code -- if GHL has the full
    // state name on file instead, this still hashes cleanly and gives Meta
    // partial signal, just not as tight a match as a proper abbreviation.
    if (state) userData.st = [sha256(state.replace(/[^a-zA-Z]/g, ''))];
    if (postalCode) userData.zp = [sha256(postalCode.split('-')[0].trim())];
    if (country) userData.country = [sha256(country)];
    if (fbc) userData.fbc = fbc;
    if (fbp) userData.fbp = fbp;
    if (clientIp) userData.client_ip_address = clientIp;
    if (clientUserAgent) userData.client_user_agent = clientUserAgent;
    userData.external_id = [sha256(t.contactId)];

    const eventTime = Math.floor(new Date(t.createdAt).getTime() / 1000);
    const payload = {
      data: [
        {
          event_name: 'Purchase',
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

  const summary = `ghl-purchase-sync: ${sent} sent, ${skipped} already processed, ${failed} failed, ${ignored} ignored as renewals/manual/non-low-ticket (checked ${recent.length} succeeded transactions in the last 6 days)`;
  console.log(summary);
  return new Response(summary, { status: 200 });
};

export const config: Config = {
  schedule: '*/15 * * * *',
};
