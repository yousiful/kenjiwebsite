import type { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import crypto from 'crypto';
import { stripe } from './_vidgen/stripe';

/**
 * Freedom Club welcome page (kenjiai.com/freedom/welcome) -> GET ?session_id=cs_...
 * Checks the Stripe Checkout session really is paid, then (once per session, Netlify Blobs):
 *   - upserts the buyer into the KenjiAI GHL location with tags "freedom club member" and "freedom club web $7",
 *     plus a note. Tags only, no workflow enrollment.
 *     Yousif's own GHL workflow on "freedom club member" grants community access.
 *   - sends a server-side Meta Purchase with event_id = session id (the page fires the same
 *     event_id client-side, so Meta counts it once).
 * Returns { paid, value, first_name } for the page.
 * Env: STRIPE_SECRET_KEY, GHL_PIT, optional GHL_LOCATION_ID, META_PIXEL_ID, META_CAPI_TOKEN.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const DEFAULT_LOCATION_ID = 'q5L4ttbBMHNxieXIcTVJ';
const sha256 = (v: string) => crypto.createHash('sha256').update(v.trim().toLowerCase()).digest('hex');

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body),
});

async function tagInGhl(name: string, email: string, phone: string, sessionId: string, subId: string) {
  const token = process.env.GHL_PIT;
  if (!token) return 'no GHL_PIT';
  const headers = { Authorization: `Bearer ${token}`, Version: GHL_VERSION, 'Content-Type': 'application/json', Accept: 'application/json' };
  const [firstName, ...rest] = name.trim().split(/\s+/);
  const r = await fetch(`${GHL_BASE}/contacts/upsert`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      locationId: process.env.GHL_LOCATION_ID || DEFAULT_LOCATION_ID,
      firstName: firstName || undefined,
      lastName: rest.join(' ') || undefined,
      email: email || undefined,
      phone: phone || undefined,
      source: 'kenjiai.com/freedom',
      tags: ['freedom club member', 'freedom club web $7'],
    }),
  });
  const data = await r.json().catch(() => ({}));
  const contactId = data?.contact?.id;
  if (!r.ok || !contactId) return `upsert ${r.status}`;
  const note = `Joined Freedom Club at $7/month on kenjiai.com/freedom (Stripe, not the GHL order form).\nStripe checkout ${sessionId}, subscription ${subId}.`;
  await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, { method: 'POST', headers, body: JSON.stringify({ body: note }) }).catch(() => null);
  return 'ok';
}

async function capiPurchase(sessionId: string, value: number, email: string, phone: string, fbp: string, fbc: string, ip: string, ua: string) {
  const pixel = process.env.META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!pixel || !token) return;
  const user_data: Record<string, unknown> = { client_ip_address: ip, client_user_agent: ua };
  if (email) user_data.em = [sha256(email)];
  if (phone) user_data.ph = [sha256(phone.replace(/\D/g, ''))];
  if (fbp) user_data.fbp = fbp;
  if (fbc) user_data.fbc = fbc;
  await fetch(`https://graph.facebook.com/v21.0/${pixel}/events?access_token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: [{
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: sessionId,
        event_source_url: 'https://kenjiai.com/freedom/welcome',
        action_source: 'website',
        user_data,
        custom_data: { value, currency: 'USD', content_name: 'Freedom Club' },
      }],
    }),
  }).catch(() => null);
}

export const handler: Handler = async (event) => {
  const sessionId = event.queryStringParameters?.session_id || '';
  if (!/^cs_(live|test)_[A-Za-z0-9]+$/.test(sessionId)) return json(400, { error: 'bad session_id' });
  if (!process.env.STRIPE_SECRET_KEY) return json(503, { error: 'not connected' });

  let s;
  try {
    s = await stripe('GET', `checkout/sessions/${sessionId}`);
  } catch (e) {
    console.error('[freedom-confirm] stripe', e instanceof Error ? e.message : e);
    return json(404, { paid: false });
  }
  const paid = s.status === 'complete' && (s.payment_status === 'paid' || s.payment_status === 'no_payment_required');
  if (!paid || s.metadata?.offer !== 'freedom-club') return json(200, { paid: false });

  const value = (s.amount_total ?? 700) / 100;
  const d = s.customer_details || {};
  const name = String(d.name || '');
  const email = String(d.email || '');
  const phone = String(d.phone || '');

  const store = getStore('freedom-confirmed');
  if (!(await store.get(sessionId))) {
    const ghl = await tagInGhl(name, email, phone, sessionId, String(s.subscription || '')).catch((e) => `threw ${e}`);
    if (ghl !== 'ok') console.error('[freedom-confirm] ghl', ghl);
    await capiPurchase(
      sessionId, value, email, phone, String(s.metadata?.fbp || ''), String(s.metadata?.fbc || ''),
      event.headers['x-nf-client-connection-ip'] || '', event.headers['user-agent'] || '',
    );
    // Only remember it once GHL took it, so a refresh retries a failed tag. Meta dedupes the
    // repeat Purchase on event_id.
    if (ghl === 'ok') await store.set(sessionId, JSON.stringify({ at: new Date().toISOString() }));
  }

  return json(200, { paid: true, value, first_name: name.split(/\s+/)[0] || '' });
};
