import type { HandlerEvent, HandlerResponse } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

// Shared server helpers for invites-auth.ts and invites-api.ts.
// Storage is the Netlify Blobs store "invites" (one JSON per key, see the spec).
//
// Both functions run as Netlify Functions v2 (default export taking a Request):
// only v2 gets the uncached edge URL that strong consistency needs. With the old
// Lambda-style handler + connectLambda, reads were eventually consistent in
// production, so a host listing guests right after a write saw stale (empty) data.

export function invitesStore() {
  // `netlify dev`'s local blob sandbox has no uncached edge URL.
  if (process.env.NETLIFY_DEV === 'true') return getStore({ name: 'invites' });
  return getStore({ name: 'invites', consistency: 'strong' });
}

/** Wraps a Lambda-style handler as a v2 function so the ops and URLs stay the same. */
export function asV2(handler: (event: HandlerEvent) => Promise<HandlerResponse>) {
  return async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    const headers: Record<string, string> = {};
    req.headers.forEach((v, k) => { headers[k] = v; });
    const event = {
      httpMethod: req.method,
      headers,
      multiValueHeaders: {},
      queryStringParameters: Object.fromEntries(url.searchParams),
      multiValueQueryStringParameters: {},
      path: url.pathname,
      rawUrl: req.url,
      rawQuery: url.search.slice(1),
      body: req.method === 'GET' || req.method === 'HEAD' ? null : await req.text(),
      isBase64Encoded: false,
    } as unknown as HandlerEvent;
    const r = await handler(event);
    const body = r.isBase64Encoded ? Buffer.from(r.body || '', 'base64') : r.body || null;
    return new Response(body, { status: r.statusCode, headers: (r.headers || {}) as Record<string, string> });
  };
}

export function secret(): string {
  const s = process.env.INVITES_SECRET;
  if (!s || s.length < 32) throw new Error('INVITES_SECRET is not set');
  return s;
}

export const hmac = (data: string) => createHmac('sha256', secret()).update(data).digest('base64url');
export const randomId = (bytes: number) => randomBytes(bytes).toString('base64url');

// Host identity is a private key the browser keeps (no accounts, no sign-in).
// Key = 32 random bytes (base64url) + "." + an HMAC tag, so the server can check a
// key without storing it. Events store only ownerHash = HMAC(key secret), never the key.
export function makeHostKey(): string {
  const raw = randomBytes(32).toString('base64url');
  return `${raw}.${hmac('hostkey:' + raw).slice(0, 22)}`;
}

const KEY_RE = /^([A-Za-z0-9_-]{43})\.([A-Za-z0-9_-]{22})$/;

export function ownerHashForKey(key: string): string | null {
  const m = KEY_RE.exec(key);
  if (!m) return null;
  const expected = Buffer.from(hmac('hostkey:' + m[1]).slice(0, 22));
  const given = Buffer.from(m[2]);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  return hmac('owner:' + m[1]).slice(0, 32);
}

export function readToken(event: HandlerEvent): { ownerHash: string } | null {
  const h = event.headers.authorization || event.headers.Authorization || '';
  const m = /^Bearer\s+(\S+)$/.exec(h);
  const ownerHash = m ? ownerHashForKey(m[1]) : null;
  return ownerHash ? { ownerHash } : null;
}

/** Client IP (Netlify sets x-nf-client-connection-ip), hashed before it is stored anywhere. */
export function ipHash(event: HandlerEvent): string {
  const ip = event.headers['x-nf-client-connection-ip'] || String(event.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  return hmac('ip:' + ip).slice(0, 24);
}

export const json = (statusCode: number, body: unknown, extra: Record<string, string> = {}) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extra },
  body: JSON.stringify(body),
});

/** Friendly error for the person using the page. */
export const fail = (statusCode: number, error: string) => json(statusCode, { error });

export function parseBody(event: HandlerEvent): Record<string, unknown> | null {
  try {
    const raw = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : event.body || '{}';
    const v = JSON.parse(raw || '{}');
    return v && typeof v === 'object' && !Array.isArray(v) ? v : null;
  } catch {
    return null;
  }
}

// strips control characters people can't see or type
// eslint-disable-next-line no-control-regex
export const str = (v: unknown, max: number) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);

// ---------- recovery by text (host keys encrypted at rest) ----------
const recoveryKey = () => createHash('sha256').update('kenji-invites-recovery:' + secret()).digest();

/** AES-256-GCM, key derived from INVITES_SECRET. Output: iv.tag.ciphertext (base64url). */
export function encryptText(plain: string): string {
  const iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', recoveryKey(), iv);
  const enc = Buffer.concat([c.update(plain, 'utf8'), c.final()]);
  return [iv, c.getAuthTag(), enc].map((b) => b.toString('base64url')).join('.');
}

export function decryptText(box: string): string | null {
  try {
    const [iv, tag, enc] = box.split('.').map((p) => Buffer.from(p, 'base64url'));
    const d = createDecipheriv('aes-256-gcm', recoveryKey(), iv);
    d.setAuthTag(tag);
    return Buffer.concat([d.update(enc), d.final()]).toString('utf8');
  } catch {
    return null;
  }
}

/** US/Canada numbers only (NANP). Returns +1XXXXXXXXXX or ''. */
export function usPhone(raw: unknown): string {
  let d = String(raw ?? '').replace(/\D/g, '');
  if (d.length === 11 && d.startsWith('1')) d = d.slice(1);
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(d)) return '';
  return '+1' + d;
}

export const phoneHash = (e164: string) => hmac('phone:' + e164).slice(0, 32);
