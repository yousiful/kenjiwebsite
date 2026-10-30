import type { Handler, HandlerEvent } from '@netlify/functions';
import { connectLambda, getStore } from '@netlify/blobs';
import { createHash, randomUUID } from 'node:crypto';

/**
 * Funding Finder match alerts (kenjiai.com/funding).
 *
 * POST JSON {name, email, phone?, businessType?, state?, types[]} saves the visitor's
 * preferences in the "funding-alerts" Blobs store (key sub/<sha256(email)>) and adds the
 * contact to KenjiAI's GHL with the tag "funding finder" plus one tag per funding type.
 * A visitor can type anyone's email, so an EXISTING contact only ever gets tags added;
 * its name, phone and other fields are never changed. No workflow enrollment.
 * At most 5 sign-ups per IP per hour.
 *
 * GET ?u=<hash>&t=<token> (link in every digest email) shows an Unsubscribe button that
 * POSTs back here form-encoded, so email link scanners can't unsubscribe anyone.
 *
 * The weekly digest (C:\Users\y_you\tools-crew\funding\digest.mjs) reads the store with
 * the Netlify CLI and is disabled until Yousif approves it.
 *
 * Netlify env var: GHL_PIT (shared with the other ghl-*.ts functions). Optional: GHL_LOCATION_ID.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const DEFAULT_LOCATION_ID = 'q5L4ttbBMHNxieXIcTVJ';
const TYPES: Record<string, string> = { grant: 'grant', loan: 'loan', rbf: 'revenue-based financing', equity: 'equity investment', competition: 'competition' };
const STATES = new Set('AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA PR RI SC SD TN TX UT VT VA WA WV WI WY'.split(' '));

const json = (statusCode: number, body: unknown) => ({ statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const page = (statusCode: number, inner: string) => ({
  statusCode,
  headers: { 'Content-Type': 'text/html; charset=utf-8' },
  body: `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Funding Finder</title><body style="font-family:system-ui,sans-serif;background:#111827;color:#e5e7eb;display:grid;place-items:center;min-height:100vh;margin:0;padding:16px"><div style="max-width:520px">${inner}<p><a style="color:#93c5fd" href="https://kenjiai.com/funding">Back to the Funding Finder</a></p></div></body>`,
});
const msg = (statusCode: number, text: string) => page(statusCode, `<h1 style="font-size:22px">${text}</h1>`);
const s = (v: unknown, max = 200) => String(v ?? '').trim().slice(0, max);
const hashEmail = (email: string) => createHash('sha256').update(email.toLowerCase()).digest('hex').slice(0, 32);

function store(event: HandlerEvent) {
  connectLambda(event as unknown as Parameters<typeof connectLambda>[0]);
  return getStore('funding-alerts');
}

export interface FundingSubscriber {
  name: string;
  email: string;
  phone: string;
  businessType: string;
  state: string;
  types: string[];
  token: string;
  ghlContactId: string | null;
  unsubscribed: boolean;
  createdAt: string;
  updatedAt: string;
}

async function unsubscribe(event: HandlerEvent, u: string, t: string) {
  if (!u || !t) return msg(400, 'That unsubscribe link is incomplete.');
  const st = store(event);
  const rec = (await st.get(`sub/${u}`, { type: 'json' })) as FundingSubscriber | null;
  if (!rec || rec.token !== t) return msg(404, 'We could not find that subscription.');
  if (!rec.unsubscribed) await st.setJSON(`sub/${u}`, { ...rec, unsubscribed: true, updatedAt: new Date().toISOString() });
  return msg(200, 'You are unsubscribed. You will not get any more Funding Finder emails.');
}

async function rateLimited(event: HandlerEvent) {
  const ip = s(event.headers['x-nf-client-connection-ip'] || event.headers['x-forwarded-for'], 80).split(',')[0].trim() || 'unknown';
  const key = `rl/${createHash('sha256').update(ip).digest('hex').slice(0, 24)}/${new Date().toISOString().slice(0, 13)}`;
  const st = store(event);
  const n = Number((await st.get(key)) || 0);
  if (n >= 5) return true;
  await st.set(key, String(n + 1));
  return false;
}

async function ghl(path: string, token: string, method: string, body?: unknown) {
  const r = await fetch(`${GHL_BASE}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, Version: GHL_VERSION, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data: any = await r.json().catch(() => ({}));
  if (!r.ok) console.error(`funding-alerts: GHL ${method} ${path} ${r.status}`, JSON.stringify(data).slice(0, 300));
  return { ok: r.ok, data };
}

/** Existing contact (matched by email): only ADD tags. New contact: create it, then add the phone. */
async function syncGhl(token: string, f: { firstName: string; lastName: string; email: string; phone: string; state: string; tags: string[] }) {
  const locationId = process.env.GHL_LOCATION_ID || DEFAULT_LOCATION_ID;
  const found = await ghl('/contacts/search', token, 'POST', { locationId, pageLimit: 1, filters: [{ field: 'email', operator: 'eq', value: f.email }] });
  if (!found.ok) return null;
  const existing = found.data?.contacts?.[0]?.id as string | undefined;
  if (existing) {
    await ghl(`/contacts/${existing}/tags`, token, 'POST', { tags: f.tags });
    return existing;
  }
  const made = await ghl('/contacts/', token, 'POST', {
    locationId, firstName: f.firstName, lastName: f.lastName || undefined, email: f.email,
    state: f.state || undefined, source: 'kenjiai.com/funding', tags: f.tags,
  });
  const id = (made.data?.contact?.id as string | undefined) || null;
  if (id && f.phone) await ghl(`/contacts/${id}`, token, 'PUT', { phone: f.phone });
  return id;
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'GET') {
    const u = s(event.queryStringParameters?.u, 40).replace(/[^a-f0-9]/g, '');
    const t = s(event.queryStringParameters?.t, 60).replace(/[^a-zA-Z0-9-]/g, '');
    if (!u || !t) return msg(400, 'That unsubscribe link is incomplete.');
    return page(200, `<form method="post"><h1 style="font-size:22px">Stop Funding Finder emails?</h1><input type="hidden" name="u" value="${u}"><input type="hidden" name="t" value="${t}"><button style="background:#2563eb;color:#fff;border:0;border-radius:10px;padding:12px 18px;font-size:16px;cursor:pointer">Unsubscribe</button></form>`);
  }
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const raw = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : event.body || '';
  if (String(event.headers['content-type'] || '').includes('application/x-www-form-urlencoded')) {
    const q = new URLSearchParams(raw);
    return unsubscribe(event, s(q.get('u'), 40), s(q.get('t'), 60));
  }

  let p: Record<string, unknown>;
  try { p = JSON.parse(raw || '{}'); } catch { return json(400, { error: 'Invalid request' }); }
  if (!p || typeof p !== 'object' || Array.isArray(p)) return json(400, { error: 'Invalid request' });
  if (s(p.website)) return json(200, { ok: true }); // honeypot

  const name = s(p.name, 80);
  const email = s(p.email, 120).toLowerCase();
  const phone = s(p.phone, 30);
  const businessType = s(p.businessType, 80);
  const state = STATES.has(s(p.state, 2).toUpperCase()) ? s(p.state, 2).toUpperCase() : '';
  const types = Array.isArray(p.types) ? [...new Set(p.types.map((x) => s(x, 20)).filter((x) => x in TYPES))] : [];
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: 'Add your name and a valid email.' });
  if (!types.length) return json(400, { error: 'Pick at least one kind of funding.' });
  if (await rateLimited(event)) return json(429, { error: 'Too many sign-ups from this connection. Try again in an hour.' });

  const [firstName, ...rest] = name.split(/\s+/);
  const tags = ['funding finder', ...types.map((t) => `funding finder ${TYPES[t]}`)];

  let ghlContactId: string | null = null;
  const token = process.env.GHL_PIT;
  if (token) {
    try {
      ghlContactId = await syncGhl(token, { firstName, lastName: rest.join(' '), email, phone, state, tags });
    } catch (e) {
      console.error('funding-alerts: GHL request failed', String(e));
    }
  } else {
    console.error('funding-alerts: GHL_PIT not set');
  }

  const st = store(event);
  const key = `sub/${hashEmail(email)}`;
  const prev = (await st.get(key, { type: 'json' })) as FundingSubscriber | null;
  const now = new Date().toISOString();
  const rec: FundingSubscriber = {
    name, email, phone, businessType, state, types,
    token: prev?.token || randomUUID(),
    ghlContactId: ghlContactId || prev?.ghlContactId || null,
    // Someone who unsubscribed stays unsubscribed; a form post or autofill can't undo it.
    unsubscribed: prev?.unsubscribed === true,
    createdAt: prev?.createdAt || now,
    updatedAt: now,
  };
  await st.setJSON(key, rec);
  return json(200, { ok: true });
};
