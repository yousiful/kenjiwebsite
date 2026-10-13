import type { HandlerEvent } from '@netlify/functions';
import { connectLambda, getStore } from '@netlify/blobs';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

// Shared server helpers for invites-auth.ts and invites-api.ts.
// Storage is the Netlify Blobs store "invites" (one JSON per key, see the spec).

export function invitesStore(event: HandlerEvent) {
  connectLambda(event as unknown as Parameters<typeof connectLambda>[0]);
  // Strong reads when the runtime supports them (a host adds a guest and immediately
  // lists guests); `netlify dev` has no uncached edge URL, so fall back there.
  let strong = false;
  try {
    const raw = process.env.NETLIFY_BLOBS_CONTEXT || '';
    strong = !!JSON.parse(Buffer.from(raw, 'base64').toString('utf8')).uncachedEdgeURL;
  } catch {
    strong = false;
  }
  return getStore(strong ? { name: 'invites', consistency: 'strong' } : { name: 'invites' });
}

export function secret(): string {
  const s = process.env.INVITES_SECRET;
  if (!s || s.length < 32) throw new Error('INVITES_SECRET is not set');
  return s;
}

export const hmac = (data: string) => createHmac('sha256', secret()).update(data).digest('base64url');
export const randomId = (bytes: number) => randomBytes(bytes).toString('base64url');

export const emailHash = (email: string) => hmac('email:' + email.trim().toLowerCase()).slice(0, 32);
export const ownerHashFor = (email: string) => hmac('owner:' + email.trim().toLowerCase()).slice(0, 32);

const SESSION_DAYS = 180;

export function makeToken(email: string): string {
  const payload = Buffer.from(
    JSON.stringify({ o: ownerHashFor(email), m: email.trim().toLowerCase(), x: Date.now() + SESSION_DAYS * 86400000 })
  ).toString('base64url');
  return `${payload}.${hmac('session:' + payload)}`;
}

export function readToken(event: HandlerEvent): { ownerHash: string; email: string } | null {
  const h = event.headers.authorization || event.headers.Authorization || '';
  const m = /^Bearer\s+([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)$/.exec(h);
  if (!m) return null;
  const expected = Buffer.from(hmac('session:' + m[1]));
  const given = Buffer.from(m[2]);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const p = JSON.parse(Buffer.from(m[1], 'base64url').toString('utf8'));
    if (typeof p.o !== 'string' || typeof p.x !== 'number' || p.x < Date.now()) return null;
    return { ownerHash: p.o, email: String(p.m || '') };
  } catch {
    return null;
  }
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
