import type { HandlerEvent, HandlerResponse } from '@netlify/functions';
import { asV2, invitesStore, makeHostKey, ipHash, readToken, ownerHashForKey, encryptText, decryptText, usPhone, phoneHash, json, fail, parseBody, str } from './_invites/common';
import { isEmail } from '../../src/invites/shared';

/**
 * Kenji Invites host identity. There is no sign-in: the browser asks for a private
 * host key once and keeps it (localStorage, plus a "private link" the host can save).
 *
 * op=new   -> {key}        rate-limited per IP (20 an hour). Nothing about the key is stored;
 *                          events keep only a hash derived from it.
 * op=lead  {email}         optional, needs the host key. Upserts the email into KenjiAI's GHL
 *                          tagged "kenji invites user". No workflow enrollment, no email sent.
 * op=save-phone {phone}    needs the host key. Saves the key ENCRYPTED (AES-256-GCM) under a hash
 *                          of the phone (up to 5 hosts per phone) and texts the private link.
 * op=find  {phone}         public. Texts the private link(s) saved to that phone. Always answers
 *                          with the same neutral message so it never reveals which numbers exist.
 * Texts go through KenjiAI's GHL (contact upsert + SMS message, never a workflow).
 * INVITES_SMS_MODE=off (and every `netlify dev` run) skips the real send.
 * Limits: 3 texts per phone and 10 per IP per hour; 20 new host keys per IP per hour.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const DEFAULT_LOCATION_ID = 'q5L4ttbBMHNxieXIcTVJ';
const KEYS_PER_IP_PER_HOUR = 20;
const TEXTS_PER_PHONE_PER_HOUR = 3;
const TEXTS_PER_IP_PER_HOUR = 10;
const MAX_HOSTS_PER_PHONE = 5;
const NEUTRAL = 'If that number is saved, a text is on its way. It can take a minute to arrive.';
const LIMITED = "You've asked for a few texts already. Please wait an hour and try again.";
const CANT_TEXT = "We couldn't text that number. Please check it and try again.";

type Store = ReturnType<typeof invitesStore>;
interface RecoveryRecord { hosts: { o: string; k: string; at: string }[] }

/** Counts one attempt; true when over the hourly limit. */
async function limited(store: Store, key: string, max: number): Promise<boolean> {
  const now = Date.now();
  const rec = ((await store.get(key, { type: 'json' })) as { t: number[] } | null) || { t: [] };
  const recent = rec.t.filter((x) => now - x < 3600000);
  if (recent.length >= max) return true;
  await store.setJSON(key, { t: [...recent, now] });
  return false;
}

const siteUrl = () => (process.env.NETLIFY_DEV === 'true' && process.env.URL) || 'https://kenjiai.com';
const manageUrl = (key: string) => `${siteUrl()}/invites/manage#k=${key}`;

function smsText(keys: string[]): string {
  if (keys.length === 1) return `Kenji Invites: here's your private link to manage your invitations: ${manageUrl(keys[0])} Keep it private. Reply STOP to opt out.`;
  return `Kenji Invites: here are your private links to manage your invitations: ${keys.map(manageUrl).join(' ')} Keep them private. Reply STOP to opt out.`;
}

const smsOff = () => process.env.NETLIFY_DEV === 'true' || process.env.INVITES_SMS_MODE === 'off';

type SendResult = { ok: boolean; dnd?: boolean; mock?: boolean; status?: number; detail?: unknown };

/** Sends one SMS through GHL. Never enrolls anyone in a workflow. */
async function sendSms(phone: string, message: string): Promise<SendResult> {
  if (smsOff()) {
    console.log('[invites-auth] SMS send is off (mock)', phone.slice(0, -4) + '****');
    return { ok: true, mock: true };
  }
  const token = process.env.GHL_PIT;
  const locationId = process.env.GHL_LOCATION_ID || DEFAULT_LOCATION_ID;
  if (!token) return { ok: false, detail: 'GHL_PIT not set' };
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json', Version: '2021-07-28' };
  const up = await fetch(`${GHL_BASE}/contacts/upsert`, { method: 'POST', headers, body: JSON.stringify({ locationId, phone, source: 'Kenji Invites' }) });
  const data = (await up.json().catch(() => ({}))) as { contact?: { id?: string; dnd?: boolean; dndSettings?: { SMS?: { status?: string } } } };
  const c = data?.contact;
  if (!up.ok || !c?.id) return { ok: false, status: up.status, detail: data };
  if (c.dnd === true || c.dndSettings?.SMS?.status === 'active') return { ok: false, dnd: true };
  // separate tag call so existing tags are never overwritten
  await fetch(`${GHL_BASE}/contacts/${c.id}/tags`, { method: 'POST', headers, body: JSON.stringify({ tags: ['kenji invites user'] }) }).catch(() => null);
  const msg = await fetch(`${GHL_BASE}/conversations/messages`, { method: 'POST', headers: { ...headers, Version: '2021-04-15' }, body: JSON.stringify({ type: 'SMS', contactId: c.id, message }) });
  const md = await msg.json().catch(() => ({}));
  if (!msg.ok) return { ok: false, status: msg.status, detail: md, dnd: /dnd|opt.?out|unsubscrib/i.test(JSON.stringify(md)) };
  return { ok: true, status: msg.status, detail: { messageId: (md as { messageId?: string }).messageId } };
}

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

  if (op === 'save-phone' || op === 'find') {
    const body = parseBody(event);
    const phone = usPhone(body?.phone);
    let hostKey = '';
    let owner = '';
    if (op === 'save-phone') {
      const m = /^Bearer\s+(\S+)$/.exec(event.headers.authorization || '');
      hostKey = m ? m[1] : '';
      owner = hostKey ? ownerHashForKey(hostKey) || '' : '';
      if (!owner) return fail(401, 'Something went wrong. Please reload the page.');
    }
    if (!phone) return fail(400, 'Please type a US or Canada mobile number, like (555) 123-4567.');
    const ph = phoneHash(phone);
    if ((await limited(store, `rl-sms-ip/${ipHash(event)}`, TEXTS_PER_IP_PER_HOUR)) || (await limited(store, `rl-sms-phone/${ph}`, TEXTS_PER_PHONE_PER_HOUR))) {
      return op === 'find' ? json(200, { ok: true, message: NEUTRAL }) : fail(429, LIMITED);
    }
    const recKey = `recovery/${ph}`;
    const rec = ((await store.get(recKey, { type: 'json' })) as RecoveryRecord | null) || { hosts: [] };
    const dev = process.env.NETLIFY_DEV === 'true';

    if (op === 'save-phone') {
      const others = rec.hosts.filter((h) => h.o !== owner);
      const next: RecoveryRecord = { hosts: [...others, { o: owner, k: encryptText(hostKey), at: new Date().toISOString() }].slice(-MAX_HOSTS_PER_PHONE) };
      const text = smsText([hostKey]);
      const r: SendResult = await sendSms(phone, text).catch((e) => ({ ok: false, detail: String(e) }));
      if (!r.ok) {
        console.error('[invites-auth] save-phone SMS failed', r.status, JSON.stringify(r.detail || '').slice(0, 300));
        return fail(400, r.dnd ? "We can't text that number." : CANT_TEXT);
      }
      await store.setJSON(recKey, next);
      return json(200, { ok: true, saved: true, mock: !!r.mock, ...(dev ? { devText: text } : {}) });
    }

    // find: the same answer whether or not the number is saved
    const keys = rec.hosts.map((h) => decryptText(h.k)).filter((k): k is string => !!k && !!ownerHashForKey(k));
    let devText = '';
    let mock = false;
    if (keys.length) {
      devText = smsText(keys);
      const r: SendResult = await sendSms(phone, devText).catch(() => ({ ok: false }));
      mock = !!r.mock;
      if (!r.ok) console.error('[invites-auth] find SMS not sent', r.status, r.dnd ? 'dnd' : '');
    }
    return json(200, { ok: true, message: NEUTRAL, ...(dev ? { devText, mock } : {}) });
  }

  return fail(400, 'Unknown request');
};

// Netlify Functions v2 (needed for strongly consistent Blobs reads); same URL.
export default asV2(handler);
