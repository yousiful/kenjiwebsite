import type { HandlerEvent, HandlerResponse } from '@netlify/functions';
import { asV2, invitesStore, makeHostKey, ipHash, readToken, json, fail, parseBody, str } from './_invites/common';
import { isEmail } from '../../src/invites/shared';

/**
 * Kenji Invites host identity. There is no sign-in: the browser asks for a private
 * host key once and keeps it (localStorage, plus a "private link" the host can save).
 *
 * op=new   -> {key}        rate-limited per IP (20 an hour). Nothing about the key is stored;
 *                          events keep only a hash derived from it.
 * op=lead  {email}         optional, needs the host key. Upserts the email into KenjiAI's GHL
 *                          tagged "kenji invites user". No workflow enrollment, no email sent.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const DEFAULT_LOCATION_ID = 'q5L4ttbBMHNxieXIcTVJ';
const KEYS_PER_IP_PER_HOUR = 20;

async function saveLead(email: string): Promise<{ ok: boolean; status?: number }> {
  const token = process.env.GHL_PIT;
  const locationId = process.env.GHL_LOCATION_ID || DEFAULT_LOCATION_ID;
  if (!token) return { ok: false };
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json', Version: '2021-07-28' };
  // Upsert without tags (tags on upsert can replace a contact's existing tags), then add ours.
  const up = await fetch(`${GHL_BASE}/contacts/upsert`, { method: 'POST', headers, body: JSON.stringify({ locationId, email, source: 'Kenji Invites' }) });
  const data = (await up.json().catch(() => ({}))) as { contact?: { id?: string } };
  const id = data?.contact?.id;
  if (!up.ok || !id) return { ok: false, status: up.status };
  const tag = await fetch(`${GHL_BASE}/contacts/${id}/tags`, { method: 'POST', headers, body: JSON.stringify({ tags: ['kenji invites user'] }) });
  return { ok: tag.ok, status: tag.status };
}

const handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  if (event.httpMethod !== 'POST') return fail(405, 'Method not allowed');
  const op = event.queryStringParameters?.op;
  const store = invitesStore();

  if (op === 'new') {
    const key = `rl-key/${ipHash(event)}`;
    const now = Date.now();
    const rec = ((await store.get(key, { type: 'json' })) as { t: number[] } | null) || { t: [] };
    const recent = rec.t.filter((x) => now - x < 3600000);
    if (recent.length >= KEYS_PER_IP_PER_HOUR) return fail(429, 'Too many new invitations from this connection. Please try again in an hour.');
    await store.setJSON(key, { t: [...recent, now] });
    return json(200, { key: makeHostKey() });
  }

  if (op === 'lead') {
    if (!readToken(event)) return fail(401, 'Something went wrong. Please reload the page.');
    const body = parseBody(event);
    const email = str(body?.email, 200).toLowerCase();
    if (!isEmail(email)) return fail(400, 'Please check your email address. It should look like name@example.com.');
    // Local `netlify dev` runs never touch the real CRM.
    if (process.env.NETLIFY_DEV === 'true') return json(200, { ok: true, saved: false, dev: true });
    try {
      const r = await saveLead(email);
      if (!r.ok) console.error('[invites-auth] lead not saved', r.status);
      return json(200, { ok: true, saved: r.ok });
    } catch (e) {
      console.error('[invites-auth] lead threw', e);
      return json(200, { ok: true, saved: false });
    }
  }

  return fail(400, 'Unknown request');
};

// Netlify Functions v2 (needed for strongly consistent Blobs reads); same URL.
export default asV2(handler);
