import type { Handler, HandlerEvent } from '@netlify/functions';
import { connectLambda, getStore } from '@netlify/blobs';
import { createHash, randomUUID } from 'node:crypto';

/**
 * Funding Finder match alerts (kenjiai.com/funding).
 *
 * POST {name, email, phone?, businessType?, state?, types[]} saves the visitor's
 * preferences in the "funding-alerts" Blobs store (key sub/<sha256(email)>) and upserts
 * the contact in KenjiAI's GHL with the tag "funding finder" plus one tag per funding
 * type. No workflow enrollment. The weekly digest (C:\Users\y_you\tools-crew\funding\digest.mjs)
 * reads the store with the Netlify CLI and is disabled until Yousif approves it.
 *
 * GET ?u=<hash>&t=<token> unsubscribes (link at the bottom of every digest email).
 *
 * Netlify env var: GHL_PIT (shared with the other ghl-*.ts functions). Optional: GHL_LOCATION_ID.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const DEFAULT_LOCATION_ID = 'q5L4ttbBMHNxieXIcTVJ';
const TYPES: Record<string, string> = { grant: 'grant', loan: 'loan', rbf: 'revenue-based financing', equity: 'equity investment', competition: 'competition' };
const STATES = new Set('AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA PR RI SC SD TN TX UT VT VA WA WV WI WY'.split(' '));

const json = (statusCode: number, body: unknown) => ({ statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const html = (statusCode: number, msg: string) => ({
  statusCode,
  headers: { 'Content-Type': 'text/html; charset=utf-8' },
  body: `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Funding Finder</title><body style="font-family:system-ui,sans-serif;background:#111827;color:#e5e7eb;display:grid;place-items:center;min-height:100vh;margin:0;padding:16px"><div style="max-width:520px"><h1 style="font-size:22px">${msg}</h1><p><a style="color:#93c5fd" href="https://kenjiai.com/funding">Back to the Funding Finder</a></p></div></body>`,
});
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

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'GET') {
    const u = s(event.queryStringParameters?.u, 40);
    const t = s(event.queryStringParameters?.t, 60);
    if (!u || !t) return html(400, 'That unsubscribe link is incomplete.');
    const st = store(event);
    const rec = (await st.get(`sub/${u}`, { type: 'json' })) as FundingSubscriber | null;
    if (!rec || rec.token !== t) return html(404, 'We could not find that subscription.');
    if (!rec.unsubscribed) await st.setJSON(`sub/${u}`, { ...rec, unsubscribed: true, updatedAt: new Date().toISOString() });
    return html(200, 'You are unsubscribed. You will not get any more Funding Finder emails.');
  }
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  let p: Record<string, unknown>;
  try { p = JSON.parse(event.body || '{}'); } catch { return json(400, { error: 'Invalid request' }); }
  if (s(p.website)) return json(200, { ok: true }); // honeypot

  const name = s(p.name, 80);
  const email = s(p.email, 120).toLowerCase();
  const phone = s(p.phone, 30);
  const businessType = s(p.businessType, 80);
  const state = STATES.has(s(p.state, 2).toUpperCase()) ? s(p.state, 2).toUpperCase() : '';
  const types = Array.isArray(p.types) ? [...new Set(p.types.map((x) => s(x, 20)).filter((x) => x in TYPES))] : [];
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: 'Add your name and a valid email.' });
  if (!types.length) return json(400, { error: 'Pick at least one kind of funding.' });

  const [firstName, ...rest] = name.split(/\s+/);
  const lastName = rest.join(' ');
  const tags = ['funding finder', ...types.map((t) => `funding finder ${TYPES[t]}`)];

  let ghlContactId: string | null = null;
  const token = process.env.GHL_PIT;
  if (token) {
    try {
      const r = await fetch(`${GHL_BASE}/contacts/upsert`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, Version: GHL_VERSION, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          locationId: process.env.GHL_LOCATION_ID || DEFAULT_LOCATION_ID,
          firstName, lastName: lastName || undefined, email,
          phone: phone || undefined,
          state: state || undefined,
          source: 'kenjiai.com/funding',
          tags,
        }),
      });
      const data: any = await r.json().catch(() => ({}));
      if (r.ok) ghlContactId = data?.contact?.id || null;
      else console.error('funding-alerts: GHL upsert failed', r.status, JSON.stringify(data).slice(0, 300));
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
    unsubscribed: false,
    createdAt: prev?.createdAt || now,
    updatedAt: now,
  };
  await st.setJSON(key, rec);
  return json(200, { ok: true });
};
