import type { Handler, HandlerEvent } from '@netlify/functions';
import { connectLambda, getStore } from '@netlify/blobs';
import crypto from 'crypto';
import { stripe } from './_vidgen/stripe';

/**
 * BMF Fitness welcome page (kenjiai.com/bmf/welcome).
 *
 * GET ?session_id=cs_... checks the Stripe Checkout session is paid and is a BMF one, then once
 * per session (Netlify Blobs):
 *   - upserts the buyer into BRENTEN'S GHL location (not ours) and adds tags "bmf protein fix $9"
 *     plus "bmf kickstart $27" / "bmf starter $47" per bump, and a note with the amounts.
 *   - sends a server-side Meta Purchase to HIS pixel with event_id = session id (the page fires
 *     the same event_id, so Meta counts it once).
 *   Returns { paid, value, bumps, first_name, last_name, email, phone } so the survey is prefilled.
 *
 * POST { session_id, answers, name, email, phone, notReady } is the 90-Day Grind application:
 *   upsert again, tag "bmf grind applicant" (plus "bmf not ready" on the not-ready path) and add
 *   the answers as a note. Only accepted for a paid BMF session.
 *
 * Tags and notes only. Never workflow enrollment, never SMS/email through the API.
 * Env: STRIPE_SECRET_KEY, BMF_GHL_PIT (his location PIT), BMF_META_TOKEN (his CAPI token).
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const BMF_LOCATION_ID = '7SedyQeyOPPnx5D7vRNe';
const BMF_PIXEL_ID = '2263283320889296';
const BUMP_TAGS: Record<string, string> = { kickstart: 'bmf kickstart $27', starter: 'bmf starter $47' };
const BUMP_LABELS: Record<string, string> = { kickstart: '14-Day Kickstart $27', starter: '30-Day Starter $47' };
const sha256 = (v: string) => crypto.createHash('sha256').update(v.trim().toLowerCase()).digest('hex');

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body),
});

function store(event: HandlerEvent) {
  connectLambda(event as unknown as Parameters<typeof connectLambda>[0]);
  return getStore('bmf-confirmed');
}

/** Upsert into Brenten's location, add tags (added, never replaced), add a note. */
async function toGhl(c: { name: string; email: string; phone: string }, tags: string[], note: string) {
  const token = process.env.BMF_GHL_PIT;
  if (!token) return 'no BMF_GHL_PIT';
  const headers = { Authorization: `Bearer ${token}`, Version: GHL_VERSION, 'Content-Type': 'application/json', Accept: 'application/json' };
  const [firstName, ...rest] = c.name.trim().split(/\s+/);
  const r = await fetch(`${GHL_BASE}/contacts/upsert`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      locationId: BMF_LOCATION_ID,
      firstName: firstName || undefined,
      lastName: rest.join(' ') || undefined,
      email: c.email || undefined,
      phone: c.phone || undefined,
      source: 'kenjiai.com/bmf',
    }),
  });
  const data = await r.json().catch(() => ({}));
  const contactId = data?.contact?.id;
  if (!r.ok || !contactId) return `upsert ${r.status}`;
  const t = await fetch(`${GHL_BASE}/contacts/${contactId}/tags`, { method: 'POST', headers, body: JSON.stringify({ tags }) });
  await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, { method: 'POST', headers, body: JSON.stringify({ body: note }) }).catch(() => null);
  return t.ok ? 'ok' : `tags ${t.status}`;
}

async function capiPurchase(sessionId: string, value: number, email: string, phone: string, fbp: string, fbc: string, ip: string, ua: string) {
  const token = process.env.BMF_META_TOKEN;
  if (!token) return;
  const user_data: Record<string, unknown> = { client_ip_address: ip, client_user_agent: ua };
  if (email) user_data.em = [sha256(email)];
  if (phone) user_data.ph = [sha256(phone.replace(/\D/g, ''))];
  if (fbp) user_data.fbp = fbp;
  if (fbc) user_data.fbc = fbc;
  await fetch(`https://graph.facebook.com/v21.0/${BMF_PIXEL_ID}/events?access_token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: [{
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: sessionId,
        event_source_url: 'https://kenjiai.com/bmf/welcome',
        action_source: 'website',
        user_data,
        custom_data: { value, currency: 'USD', content_name: 'BMF 7-Day Protein Fix' },
      }],
    }),
  }).catch(() => null);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function paidSession(sessionId: string): Promise<any | null> {
  const s = await stripe('GET', `checkout/sessions/${sessionId}`);
  const paid = s.status === 'complete' && s.payment_status === 'paid';
  return paid && s.metadata?.client === 'bmf_fitness' ? s : null;
}

const clean = (v: unknown, max = 200) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);

export const handler: Handler = async (event) => {
  const isPost = event.httpMethod === 'POST';
  let body: Record<string, unknown> = {};
  if (isPost) {
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return json(400, { error: 'Bad JSON' });
    }
  }
  const sessionId = String((isPost ? body.session_id : event.queryStringParameters?.session_id) || '');
  if (!/^cs_(live|test)_[A-Za-z0-9]+$/.test(sessionId)) return json(400, { error: 'bad session_id' });
  if (!process.env.STRIPE_SECRET_KEY) return json(503, { error: 'not connected' });

  let s;
  try {
    s = await paidSession(sessionId);
  } catch (e) {
    console.error('[bmf-confirm] stripe', e instanceof Error ? e.message : e);
    return json(404, { paid: false });
  }
  if (!s) return json(200, { paid: false });

  const bumps = String(s.metadata?.bumps || '').split(',').filter((b) => b in BUMP_TAGS);
  const value = (s.amount_total ?? 900) / 100;
  const d = s.customer_details || {};
  const buyer = { name: String(d.name || ''), email: String(d.email || ''), phone: String(d.phone || '') };
  const blobs = store(event);

  if (isPost) {
    const a = (body.answers && typeof body.answers === 'object' ? body.answers : {}) as Record<string, unknown>;
    const notReady = body.notReady === true;
    const contact = { name: clean(body.name, 80) || buyer.name, email: clean(body.email, 120) || buyer.email, phone: clean(body.phone, 30) || buyer.phone };
    const key = `apply/${sessionId}`;
    if (await blobs.get(key)) return json(200, { ok: true, repeat: true });
    const note = [
      '90-Day BMF Grind application (kenjiai.com/bmf/welcome)',
      `Main goal: ${clean(a.goal)}`,
      `Age: ${clean(a.age)}`,
      `Days a week: ${clean(a.days)}`,
      `Trains at: ${clean(a.where)}`,
      `What got in the way before: ${clean(a.blocker)}`,
      `How soon: ${clean(a.soon)}`,
      `Ready to invest ($500/mo or $750 for 90 days): ${clean(a.invest)}`,
      `Name: ${contact.name} | Email: ${contact.email} | Phone: ${contact.phone}`,
      notReady ? 'Routed to: thank-you + Instagram (not ready / just looking)' : 'Routed to: booking calendar',
    ].join('\n');
    const tags = ['bmf grind applicant', ...(notReady ? ['bmf not ready'] : [])];
    const ghl = await toGhl(contact, tags, note).catch((e) => `threw ${e}`);
    if (ghl !== 'ok') {
      console.error('[bmf-confirm] apply ghl', ghl);
      return json(502, { ok: false });
    }
    await blobs.set(key, JSON.stringify({ at: new Date().toISOString(), notReady }));
    return json(200, { ok: true });
  }

  if (!(await blobs.get(sessionId))) {
    const lines = [`BMF 7-Day Protein Fix $9`, ...bumps.map((b) => BUMP_LABELS[b])];
    const note = `Bought on kenjiai.com/bmf: ${lines.join(' + ')}. Total paid $${value.toFixed(2)}.\n` +
      (bumps.length ? 'Bump buyer: text them within 24 hours to set up their app.\n' : '') +
      `Charged through KenjiAI's Stripe (statement: MEDIA-TRAF* BMFFITNESS), checkout ${sessionId}.`;
    const ghl = await toGhl(buyer, ['bmf protein fix $9', ...bumps.map((b) => BUMP_TAGS[b])], note).catch((e) => `threw ${e}`);
    if (ghl !== 'ok') console.error('[bmf-confirm] ghl', ghl);
    await capiPurchase(
      sessionId, value, buyer.email, buyer.phone, String(s.metadata?.fbp || ''), String(s.metadata?.fbc || ''),
      event.headers['x-nf-client-connection-ip'] || '', event.headers['user-agent'] || '',
    );
    // Only remember it once GHL took it, so a refresh retries a failed tag. Meta dedupes the
    // repeat Purchase on event_id.
    if (ghl === 'ok') await blobs.set(sessionId, JSON.stringify({ at: new Date().toISOString(), bumps }));
  }

  const [first, ...last] = buyer.name.trim().split(/\s+/);
  return json(200, { paid: true, value, bumps, first_name: first || '', last_name: last.join(' '), email: buyer.email, phone: buyer.phone });
};
