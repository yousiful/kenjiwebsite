import type { Handler, HandlerEvent } from '@netlify/functions';

/**
 * Life insurance agency sign-up (/agency) -> GoHighLevel.
 * Collects what the upline needs to start a new associate: legal name, contact,
 * home address, licensed or not, and for licensed agents their NPN / license details.
 * SSN and date of birth are NOT collected here; the carrier's own secure
 * application asks for those after the Zoom.
 *
 * Netlify env var: GHL_PIT (shared with the other ghl-*.ts functions). Optional: GHL_LOCATION_ID.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const DEFAULT_LOCATION_ID = 'q5L4ttbBMHNxieXIcTVJ';

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

const s = (v: unknown, max = 200) => String(v ?? '').trim().slice(0, max);

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  let p: Record<string, unknown>;
  try {
    p = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }
  if (s(p.company)) return json(200, { ok: true }); // honeypot

  const firstName = s(p.first_name, 60);
  const lastName = s(p.last_name, 60);
  const email = s(p.email, 120);
  const phone = s(p.phone, 30);
  if (!firstName || !lastName || !email || !phone) return json(400, { error: 'name, email and phone are required' });
  if (p.consent !== true) return json(400, { error: 'consent required' });

  const token = process.env.GHL_PIT;
  if (!token) return json(502, { error: 'GHL not configured' });
  const locationId = process.env.GHL_LOCATION_ID || DEFAULT_LOCATION_ID;

  const licensed = p.licensed === 'yes';
  const tags = ['agency-recruit', licensed ? 'agency-licensed' : 'agency-non-licensed'];
  const headers = { Authorization: `Bearer ${token}`, Version: GHL_VERSION, 'Content-Type': 'application/json', Accept: 'application/json' };

  try {
    const r = await fetch(`${GHL_BASE}/contacts/upsert`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        locationId, firstName, lastName, email, phone,
        address1: s(p.address1, 160) || undefined,
        city: s(p.city, 80) || undefined,
        state: s(p.state, 40) || undefined,
        postalCode: s(p.zip, 12) || undefined,
        source: 'agency-page',
        tags,
      }),
    });
    const data: any = await r.json().catch(() => ({}));
    if (!r.ok) return json(502, { error: 'GHL upsert failed', detail: data });

    const cid = data?.contact?.id;
    if (cid) {
      const lines = [
        'Life insurance agency sign-up (kenjiai.com/agency)',
        `Legal name: ${[firstName, s(p.middle_name, 60), lastName].filter(Boolean).join(' ')}${s(p.suffix, 10) ? ' ' + s(p.suffix, 10) : ''}`,
        s(p.preferred_name, 60) && `Goes by: ${s(p.preferred_name, 60)}`,
        `Email: ${email} | Mobile: ${phone}`,
        `Home address: ${[s(p.address1, 160), s(p.address2, 80), s(p.city, 80), s(p.state, 40), s(p.zip, 12)].filter(Boolean).join(', ')}`,
        `Licensed: ${licensed ? 'YES' : 'NO'}`,
        ...(licensed
          ? [
              `NPN: ${s(p.npn, 20) || 'not given'}`,
              `Resident license state: ${s(p.license_state, 40) || 'not given'} | License #: ${s(p.license_number, 40) || 'not given'} | Expires: ${s(p.license_exp, 20) || 'not given'}`,
              `Other licensed states: ${s(p.other_states, 200) || 'none'}`,
              `Years licensed: ${s(p.years_licensed, 20) || 'not given'}`,
              `Currently contracted with another agency or carrier: ${s(p.contracted, 10) || 'not given'}${s(p.contracted_with, 120) ? ' (' + s(p.contracted_with, 120) + ')' : ''}`,
              `E&O coverage: ${s(p.eo, 10) || 'not given'} | AML training done: ${s(p.aml, 10) || 'not given'}`,
            ]
          : [
              `Pre-licensing course: ${s(p.prelicense, 40) || 'not given'}`,
            ]),
        `Employment now: ${s(p.employment, 60) || 'not given'} | Hours per week: ${s(p.hours, 20) || 'not given'}`,
        `Referred by: ${s(p.referred_by, 120) || 'nobody named'}`,
        s(p.notes, 1000) && `Notes: ${s(p.notes, 1000)}`,
        'SSN and date of birth NOT collected; they go in the official secure application after the Zoom.',
      ].filter(Boolean);
      await fetch(`${GHL_BASE}/contacts/${cid}/notes`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ body: lines.join('\n') }),
      }).catch(() => {});
    }
    return json(200, { ok: true, licensed });
  } catch (e) {
    return json(502, { error: 'GHL request failed' });
  }
};
