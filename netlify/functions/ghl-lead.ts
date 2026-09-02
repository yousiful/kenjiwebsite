import type { Handler, HandlerEvent } from '@netlify/functions';

/**
 * Webinar registration -> GoHighLevel.
 * The registration page (/webinar1) POSTs { first_name, email, phone, source,
 * session_time } here. Server-side we do two things:
 *   1. Fire the GHL Inbound Webhook trigger -> runs your Workflow (creates the
 *      contact + sends the access link / reminders).
 *   2. Upsert the contact via the API as a safety net so the contact
 *      always exists even if the workflow isn't wired to create contacts yet.
 *      Tagging is intentionally left to the GHL workflow, not done here.
 * The Private Integration Token is never exposed to the browser.
 *
 * Netlify env var: GHL_PIT (Private Integration Token). Optional: GHL_LOCATION_ID.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const DEFAULT_LOCATION_ID = 'q5L4ttbBMHNxieXIcTVJ';
// Inbound Webhook trigger URL (not a secret — it only ingests leads).
const INBOUND_WEBHOOK =
  'https://services.leadconnectorhq.com/hooks/q5L4ttbBMHNxieXIcTVJ/webhook-trigger/84c1af07-2fe8-4ba4-8a0c-11b35bddce74';

interface LeadPayload {
  first_name?: string;
  email?: string;
  phone?: string;
  source?: string;
  session_time?: string;
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
  const source = payload.source || 'ADmaxing Webinar Registration';
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

  const [webhookOk, upsertRes] = await Promise.all([fireWebhook, upsert]);

  if (!webhookOk && !upsertRes.ok) {
    return json(502, { error: 'Both GHL webhook and upsert failed' });
  }
  return json(200, { ok: true, webhook: webhookOk, upsert: upsertRes.ok, id: upsertRes.id });
};
