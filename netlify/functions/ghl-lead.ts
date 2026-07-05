import type { Handler, HandlerEvent } from '@netlify/functions';

/**
 * Webinar registration -> GoHighLevel.
 * The registration page (/webinar1) POSTs { first_name, email, phone, source,
 * session_time } here. We upsert a contact in GHL server-side so the Private
 * Integration Token is NEVER exposed to the browser.
 *
 * Required Netlify env var:
 *   GHL_PIT           - GoHighLevel Private Integration Token (secret)
 * Optional:
 *   GHL_LOCATION_ID   - defaults to the KenjiAI location (not secret; already
 *                       used client-side elsewhere on the site)
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const DEFAULT_LOCATION_ID = 'q5L4ttbBMHNxieXIcTVJ';

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

  const token = process.env.GHL_PIT;
  const locationId = process.env.GHL_LOCATION_ID || DEFAULT_LOCATION_ID;

  if (!token) {
    return json(500, { error: 'GHL not configured (set GHL_PIT env var in Netlify)' });
  }

  let payload: LeadPayload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  const email = (payload.email || '').trim();
  const phone = (payload.phone || '').trim();
  if (!email && !phone) {
    return json(400, { error: 'email or phone required' });
  }

  const contact = {
    locationId,
    firstName: (payload.first_name || '').trim(),
    email,
    phone,
    source: payload.source || 'ADmaxing Webinar Registration',
    tags: ['admaxing-webinar', 'webinar-registrant'],
  };

  try {
    // upsert = create-or-update by email/phone, avoids duplicate-contact errors
    const resp = await fetch(`${GHL_BASE}/contacts/upsert`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Version: GHL_VERSION,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(contact),
    });

    const result = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      return json(502, { error: 'GHL upsert failed', status: resp.status, detail: result });
    }
    return json(200, { ok: true, id: result?.contact?.id ?? null });
  } catch {
    return json(502, { error: 'Upstream GHL request failed' });
  }
};
