import type { Handler, HandlerEvent } from '@netlify/functions';
import crypto from 'crypto';

/**
 * Webinar registration -> GoHighLevel.
 * The registration page (/webinar1) POSTs { first_name, email, phone, source,
 * session_time } here. Server-side we do three things:
 *   1. Fire the GHL Inbound Webhook trigger -> runs your Workflow (creates the
 *      contact + sends the access link / reminders).
 *   2. Upsert the contact via the API as a safety net so the contact
 *      always exists even if the workflow isn't wired to create contacts yet.
 *      Tagging is intentionally left to the GHL workflow, not done here.
 *   3. Fire the matching Meta CAPI event server-side (Lead / CompleteRegistration),
 *      same event_id the client-side pixel used so Meta dedupes the two. This is
 *      the real fix for browser-pixel data loss (ad blockers, ITP, iOS) -- the
 *      lead is counted the moment the server receives the POST, not dependent on
 *      the visitor's browser successfully firing fbq(). Added 2026-09-24 after
 *      confirming ghl-purchase-sync.ts covers Purchase server-side but nothing
 *      covered Lead. Value on the initial Lead event (7.81 USD) is a real number,
 *      not a guess -- computed from actual GHL/Stripe revenue attributed back to
 *      webinar-sourced contacts over a 90-day cohort ($125 revenue / 16 leads).
 *      Re-derive periodically as more cohort data accumulates.
 *
 * Netlify env var: GHL_PIT (Private Integration Token). Optional: GHL_LOCATION_ID.
 * Also uses META_PIXEL_ID, META_CAPI_TOKEN (already set, shared with ghl-purchase-sync.ts).
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const DEFAULT_LOCATION_ID = 'q5L4ttbBMHNxieXIcTVJ';
const META_API_VERSION = 'v21.0';
const WEBINAR_LEAD_VALUE = 7.81; // USD, real 90-day cohort avg, see note above
// Inbound Webhook trigger URL (not a secret — it only ingests leads).
const INBOUND_WEBHOOK =
  'https://services.leadconnectorhq.com/hooks/q5L4ttbBMHNxieXIcTVJ/webhook-trigger/84c1af07-2fe8-4ba4-8a0c-11b35bddce74';

const sha256 = (v: string) => crypto.createHash('sha256').update(v.trim().toLowerCase()).digest('hex');

interface LeadPayload {
  first_name?: string;
  email?: string;
  phone?: string;
  source?: string;
  session_time?: string;
  readiness?: string; // qualifying-survey answer, passed through to the webhook only
  fbc?: string;
  fbp?: string;
  event_id?: string;
  capi_event?: 'Lead' | 'CompleteRegistration';
}

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let payload: LeadPayload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  const firstName = (payload.first_name || '').trim();
  const email = (payload.email || '').trim();
  const phone = (payload.phone || '').trim();
  const source = payload.source || '1 Ad Away Challenge Registration';
  // No tags applied here on purpose — the GHL workflow (triggered by the
  // inbound webhook below) already handles tagging on its own.

  if (!email && !phone) {
    return json(400, { error: 'email or phone required' });
  }

  // 1) Fire the GHL Inbound Webhook -> runs the Workflow (contact + access-link automation)
  const fireWebhook = fetch(INBOUND_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName,
      first_name: firstName,
      email,
      phone,
      source,
      session_time: payload.session_time || '',
      readiness: payload.readiness || '',
    }),
  })
    .then((r) => r.ok)
    .catch(() => false);

  // 2) Upsert via API as a safety net (guarantees the contact exists)
  const upsert = (async () => {
    const token = process.env.GHL_PIT;
    if (!token) return { ok: false, id: null as string | null };
    const locationId = process.env.GHL_LOCATION_ID || DEFAULT_LOCATION_ID;
    try {
      const r = await fetch(`${GHL_BASE}/contacts/upsert`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Version: GHL_VERSION,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ locationId, firstName, email, phone, source }),
      });
      const data: any = await r.json().catch(() => ({}));
      return { ok: r.ok, id: (data && data.contact && data.contact.id) || null };
    } catch {
      return { ok: false, id: null as string | null };
    }
  })();

  // 3) Fire Meta CAPI server-side, same event_id the client pixel used (dedup).
  //    Fire-and-forget -- never block or fail the lead response on this.
  const fireCapi = (async () => {
    const pixelId = process.env.META_PIXEL_ID;
    const capiToken = process.env.META_CAPI_TOKEN;
    if (!pixelId || !capiToken) return;

    const clientIp =
      event.headers['x-nf-client-connection-ip'] ||
      event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      '';
    const userAgent = event.headers['user-agent'] || '';

    const userData: Record<string, unknown> = {
      client_ip_address: clientIp,
      client_user_agent: userAgent,
    };
    if (email) userData.em = [sha256(email)];
    if (phone) userData.ph = [sha256(phone.replace(/^\+/, ''))];
    if (payload.fbc) userData.fbc = payload.fbc;
    if (payload.fbp) userData.fbp = payload.fbp;

    const eventName = payload.capi_event || 'Lead';
    const capiPayload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: payload.event_id,
          action_source: 'website',
          event_source_url: 'https://kenjiai.com/webinar1',
          user_data: userData,
          custom_data:
            eventName === 'Lead'
              ? { value: WEBINAR_LEAD_VALUE, currency: 'USD', content_name: source }
              : { content_name: source },
        },
      ],
    };

    try {
      await fetch(`https://graph.facebook.com/${META_API_VERSION}/${pixelId}/events?access_token=${capiToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(capiPayload),
      });
    } catch {
      /* best-effort, never blocks the lead response */
    }
  })();

  const [webhookOk, upsertRes] = await Promise.all([fireWebhook, upsert, fireCapi]);

  if (!webhookOk && !upsertRes.ok) {
    return json(502, { error: 'Both GHL webhook and upsert failed' });
  }
  return json(200, { ok: true, webhook: webhookOk, upsert: upsertRes.ok, id: upsertRes.id });
};
