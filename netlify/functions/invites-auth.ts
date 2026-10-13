import type { HandlerEvent, HandlerResponse } from '@netlify/functions';
import { randomInt, timingSafeEqual } from 'node:crypto';
import { asV2, invitesStore, emailHash, hmac, makeToken, json, fail, parseBody, str } from './_invites/common';
import { isEmail } from '../../src/invites/shared';

/**
 * Kenji Invites host sign-in: email -> 6-digit code -> session token.
 *
 * op=send   {email}        emails a code through KenjiAI's GHL (GHL_PIT + GHL_LOCATION_ID)
 * op=verify {email, code}  returns {token, email}
 *
 * Only a hash of the code is stored (login/<emailHash>), it expires in 10 minutes,
 * allows 5 tries, and an address can be sent at most 5 codes an hour.
 * GHL is used only to deliver this one email: the contact is upserted and tagged
 * "kenji invites user", and is never enrolled in a workflow.
 * INVITES_DEV_CODES=1 (local `netlify dev` only, never on Netlify) skips GHL and
 * returns the code in the response so the E2E test can sign in.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const DEFAULT_LOCATION_ID = 'q5L4ttbBMHNxieXIcTVJ';
const CODE_TTL_MS = 10 * 60 * 1000;
const MAX_TRIES = 5;
const MAX_SENDS_PER_HOUR = 5;
const RESEND_GAP_MS = 25 * 1000;

interface LoginRecord {
  codeHash: string;
  exp: number;
  tries: number;
  sends: number[];
}

const codeHash = (email: string, code: string) => hmac(`code:${email}:${code}`);

function emailHtml(code: string): string {
  const digits = code.split('').join('&#8202;');
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f7f2ea;">
<div style="max-width:520px;margin:0 auto;padding:32px 20px;font-family:Georgia,'Times New Roman',serif;color:#2a211c;">
  <p style="font-size:20px;line-height:1.5;margin:0 0 16px;">Hello,</p>
  <p style="font-size:20px;line-height:1.5;margin:0 0 24px;">Here is your code to sign in to Kenji Invites:</p>
  <p style="font-size:44px;letter-spacing:10px;font-weight:bold;margin:0 0 24px;padding:18px 0;text-align:center;background:#ffffff;border:1px solid #e5d9c8;border-radius:12px;color:#5e2430;">${digits}</p>
  <p style="font-size:18px;line-height:1.5;margin:0 0 8px;">Type these 6 numbers on the sign-in page. The code works for 10 minutes.</p>
  <p style="font-size:16px;line-height:1.5;color:#6b5d52;margin:24px 0 0;">If you didn't ask for this, you can ignore this email. Nobody can sign in without the code.</p>
  <p style="font-size:16px;line-height:1.5;color:#6b5d52;margin:16px 0 0;">Kenji Invites, kenjiai.com/invites</p>
</div></body></html>`;
}

async function sendViaGhl(email: string, code: string): Promise<{ ok: boolean; status?: number; detail?: unknown }> {
  const token = process.env.GHL_PIT;
  const locationId = process.env.GHL_LOCATION_ID || DEFAULT_LOCATION_ID;
  if (!token) return { ok: false, detail: 'GHL_PIT not set' };
  const base = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' };

  // Upsert without tags (tags on upsert can replace a contact's existing tags), then add ours.
  const up = await fetch(`${GHL_BASE}/contacts/upsert`, {
    method: 'POST',
    headers: { ...base, Version: '2021-07-28' },
    body: JSON.stringify({ locationId, email, source: 'Kenji Invites' }),
  });
  const upData = (await up.json().catch(() => ({}))) as { contact?: { id?: string } };
  const contactId = upData?.contact?.id;
  if (!up.ok || !contactId) return { ok: false, status: up.status, detail: upData };

  await fetch(`${GHL_BASE}/contacts/${contactId}/tags`, {
    method: 'POST',
    headers: { ...base, Version: '2021-07-28' },
    body: JSON.stringify({ tags: ['kenji invites user'] }),
  }).catch(() => null);

  const msg = await fetch(`${GHL_BASE}/conversations/messages`, {
    method: 'POST',
    headers: { ...base, Version: '2021-04-15' },
    body: JSON.stringify({
      type: 'Email',
      contactId,
      subject: `Your Kenji Invites code: ${code}`,
      html: emailHtml(code),
    }),
  });
  const msgData = (await msg.json().catch(() => ({}))) as { messageId?: string; emailMessageId?: string; conversationId?: string };
  if (!msg.ok) return { ok: false, status: msg.status, detail: msgData };
  return { ok: true, status: msg.status, detail: { messageId: msgData?.messageId, emailMessageId: msgData?.emailMessageId, conversationId: msgData?.conversationId } };
}

const handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  if (event.httpMethod !== 'POST') return fail(405, 'Method not allowed');
  const op = event.queryStringParameters?.op;
  const body = parseBody(event);
  if (!body) return fail(400, 'Something went wrong. Please try again.');

  const email = str(body.email, 200).toLowerCase();
  if (!isEmail(email)) return fail(400, 'Please check your email address. It should look like name@example.com.');

  const store = invitesStore();
  const key = `login/${emailHash(email)}`;
  const now = Date.now();

  if (op === 'send') {
    const rec = ((await store.get(key, { type: 'json' })) as LoginRecord | null) || { codeHash: '', exp: 0, tries: 0, sends: [] };
    const sends = (rec.sends || []).filter((t) => now - t < 3600000);
    if (sends.length >= MAX_SENDS_PER_HOUR) {
      return fail(429, 'We have sent several codes already. Please check your email (and the spam folder), or try again in an hour.');
    }
    if (sends.length && now - sends[sends.length - 1] < RESEND_GAP_MS) {
      return fail(429, 'A code is on its way. Please wait 30 seconds before asking for another one.');
    }
    const code = String(randomInt(0, 1000000)).padStart(6, '0');
    const next: LoginRecord = { codeHash: codeHash(email, code), exp: now + CODE_TTL_MS, tries: 0, sends: [...sends, now] };

    // NETLIFY_DEV is set only by `netlify dev`, so this can't switch on in production.
    const dev = process.env.INVITES_DEV_CODES === '1' && process.env.NETLIFY_DEV === 'true';
    if (dev) {
      await store.setJSON(key, next);
      return json(200, { ok: true, devCode: code });
    }

    let result: Awaited<ReturnType<typeof sendViaGhl>>;
    try {
      result = await sendViaGhl(email, code);
    } catch (e) {
      result = { ok: false, detail: String(e) };
    }
    if (!result.ok) {
      console.error('[invites-auth] GHL send failed', result.status, JSON.stringify(result.detail).slice(0, 500));
      return fail(502, "We couldn't send the email just now. Please try again in a minute.");
    }
    console.log('[invites-auth] code sent', result.status, JSON.stringify(result.detail));
    await store.setJSON(key, next);
    return json(200, { ok: true, sent: true, ghl: { status: result.status, ...(result.detail as object) } });
  }

  if (op === 'verify') {
    const code = str(body.code, 12).replace(/\D/g, '');
    if (code.length !== 6) return fail(400, 'The code is 6 numbers. Please check it and try again.');
    const rec = (await store.get(key, { type: 'json' })) as LoginRecord | null;
    if (!rec || !rec.codeHash || rec.exp < now) return fail(400, 'That code has expired. Please ask for a new one.');
    if (rec.tries >= MAX_TRIES) return fail(429, 'Too many tries with this code. Please ask for a new one.');
    const a = Buffer.from(codeHash(email, code));
    const b = Buffer.from(rec.codeHash);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      await store.setJSON(key, { ...rec, tries: rec.tries + 1 });
      const left = MAX_TRIES - rec.tries - 1;
      return fail(400, left > 0 ? `That code doesn't match. Please check the numbers and try again (${left} ${left === 1 ? 'try' : 'tries'} left).` : 'That code doesn\'t match. Please ask for a new one.');
    }
    await store.setJSON(key, { ...rec, codeHash: '', exp: 0, tries: 0 });
    return json(200, { ok: true, token: makeToken(email), email });
  }

  return fail(400, 'Unknown request');
};

// Netlify Functions v2 (needed for strongly consistent Blobs reads); same URL and ops.
export default asV2(handler);
