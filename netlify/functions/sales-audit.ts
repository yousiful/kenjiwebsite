import type { Handler, HandlerEvent } from '@netlify/functions';

/**
 * Sales call audit deck (kenjiai.com/audit) lead capture.
 *
 * The rep types the prospect's details during the call. POST JSON
 * {team, rep, firstName, lastName, email, phone, business, audit:{now, goal, value, gapMonth, leaks, checks[]}}
 * finds the GHL contact by email (then phone). New contact: created with the details.
 * Existing contact: only tags are added, so a typo never overwrites a real record.
 * Either way the audit numbers go on the contact as a note. Tags: "sales audit" and
 * "audit rep <name>". No workflow enrollment.
 *
 * Only the team can post: the deck link carries ?team=<AUDIT_TEAM_CODE>.
 * Netlify env vars: GHL_PIT (shared with the other ghl-*.ts functions), AUDIT_TEAM_CODE.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const DEFAULT_LOCATION_ID = 'q5L4ttbBMHNxieXIcTVJ';

const json = (statusCode: number, body: unknown) => ({ statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const s = (v: unknown, max = 200) => String(v ?? '').trim().slice(0, max);
const n = (v: unknown) => { const x = Number(v); return Number.isFinite(x) && x >= 0 ? Math.round(x) : 0; };

async function ghl(path: string, token: string, method: string, body?: unknown) {
  const r = await fetch(`${GHL_BASE}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, Version: GHL_VERSION, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data: any = await r.json().catch(() => ({}));
  if (!r.ok) console.error(`sales-audit: GHL ${method} ${path} ${r.status}`, JSON.stringify(data).slice(0, 300));
  return { ok: r.ok, data };
}

async function find(token: string, locationId: string, field: 'email' | 'phone', value: string) {
  if (!value) return undefined;
  const r = await ghl('/contacts/search', token, 'POST', { locationId, pageLimit: 1, filters: [{ field, operator: 'eq', value }] });
  return r.data?.contacts?.[0]?.id as string | undefined;
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  const code = process.env.AUDIT_TEAM_CODE;
  const token = process.env.GHL_PIT;
  if (!code || !token) return json(500, { error: 'The deck is not set up yet (missing env vars).' });

  let p: Record<string, any>;
  try { p = JSON.parse((event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : event.body) || '{}'); }
  catch { return json(400, { error: 'Invalid request' }); }
  if (s(p.team, 80) !== code) return json(403, { error: 'Open the deck from your team link to save leads.' });

  const rep = s(p.rep, 40).toLowerCase().replace(/[^a-z ]/g, '').trim();
  const firstName = s(p.firstName, 60);
  const lastName = s(p.lastName, 60);
  const email = s(p.email, 120).toLowerCase();
  const phone = s(p.phone, 30);
  const business = s(p.business, 120);
  if (!firstName) return json(400, { error: 'Add at least a first name.' });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: 'That email looks off.' });
  if (!email && phone.replace(/\D/g, '').length < 10) return json(400, { error: 'Add an email or a full phone number.' });

  const locationId = process.env.GHL_LOCATION_ID || DEFAULT_LOCATION_ID;
  const tags = ['sales audit', ...(rep ? [`audit rep ${rep}`] : [])];
  try {
    let id = (await find(token, locationId, 'email', email)) || (await find(token, locationId, 'phone', phone));
    const existed = !!id;
    if (id) {
      await ghl(`/contacts/${id}/tags`, token, 'POST', { tags });
    } else {
      const made = await ghl('/contacts/', token, 'POST', {
        locationId, firstName, lastName: lastName || undefined, email: email || undefined, phone: phone || undefined,
        companyName: business || undefined, source: 'kenjiai.com/audit', tags,
      });
      id = made.data?.contact?.id;
      if (!id) return json(502, { error: 'GHL did not save the contact. Try again.' });
    }

    const a = p.audit || {};
    const checks: string[] = Array.isArray(a.checks) ? a.checks.slice(0, 4).map((c: unknown) => s(c, 160)) : [];
    const lines = [
      `Sales call audit${rep ? ` (rep: ${rep})` : ''}, ${new Date().toISOString().slice(0, 10)}`,
      business && `Business: ${business}`,
      `Clients a month now: ${n(a.now)}. Goal: ${n(a.goal)}. One client is worth $${n(a.value).toLocaleString('en-US')}.`,
      `Gap: $${n(a.gapMonth).toLocaleString('en-US')} a month ($${(n(a.gapMonth) * 12).toLocaleString('en-US')} a year). Leaks found: ${n(a.leaks)} of 4.`,
      ...checks,
    ].filter(Boolean);
    await ghl(`/contacts/${id}/notes`, token, 'POST', { body: lines.join('\n') });
    return json(200, { ok: true, existed });
  } catch (e) {
    console.error('sales-audit: failed', String(e));
    return json(502, { error: 'Could not reach GHL. Try again.' });
  }
};
