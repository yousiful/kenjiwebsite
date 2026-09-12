import type { Handler, HandlerEvent } from '@netlify/functions';

/**
 * AI Call Center offer page (/ai-callcenter) -> GoHighLevel.
 * Deliberately separate from ghl-lead.ts: that function fires the webinar
 * inbound webhook (access-link automation, session_time field) which would
 * send the wrong automated messages to a lead from this offer. This one
 * only upserts the contact with an honest source + tag, no workflow fired.
 *
 * Netlify env var: GHL_PIT (Private Integration Token, already set for the
 * existing ghl-lead.ts function -- reused here). Optional: GHL_LOCATION_ID.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const DEFAULT_LOCATION_ID = 'q5L4ttbBMHNxieXIcTVJ';

interface LeadPayload {
  first_name?: string;
  email?: string;
  phone?: string;
  interest?: string; // which CTA they clicked: 'call-center' | 'ads-addon' | 'closer-addon'
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
  const interest = (payload.interest || 'call-center').trim();

  if (!email && !phone) {
    return json(400, { error: 'email or phone required' });
  }

  const token = process.env.GHL_PIT;
  if (!token) return json(502, { error: 'GHL not configured' });
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
      body: JSON.stringify({
        locationId,
        firstName,
        email,
        phone,
        source: 'ai-callcenter-offer-page',
        tags: ['ai-callcenter-lead', `interest-${interest}`, 'not-contacted-yet'],
      }),
    });
    const data: any = await r.json().catch(() => ({}));
    if (!r.ok) return json(502, { error: 'GHL upsert failed', detail: data });
    return json(200, { ok: true, id: (data && data.contact && data.contact.id) || null });
  } catch (err) {
    return json(502, { error: 'GHL request failed' });
  }
};
