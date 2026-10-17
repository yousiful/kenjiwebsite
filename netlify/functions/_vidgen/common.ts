import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Context } from '@netlify/functions';

// Shared server helpers for the vidgen-* functions (Kenji Studio, kenjiai.com/video-generation).
// All vidgen functions are Netlify Functions v2 (Request in, Response out), like invites.

export const SITE = 'https://kenjiai.com';

export const json = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  });

/** Friendly error for the person using the page. */
export const fail = (status: number, error: string, extra: Record<string, unknown> = {}) => json(status, { error, ...extra });

export const notConnected = (what: 'generation' | 'billing' | 'database' | 'sign-in') => {
  const msg = {
    generation: 'Generation not connected yet. We are finishing setup, please check back soon.',
    billing: 'Billing is not connected yet. We are finishing setup, please check back soon.',
    database: 'Kenji Studio is not connected yet. We are finishing setup, please check back soon.',
    'sign-in': 'Sign-in is not connected yet. We are finishing setup, please check back soon.',
  }[what];
  return fail(503, msg, { notConnected: what });
};

// strips control characters people can't see or type
// eslint-disable-next-line no-control-regex
export const str = (v: unknown, max: number) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);

export async function readJson(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const v = JSON.parse((await req.text()) || '{}');
    return v && typeof v === 'object' && !Array.isArray(v) ? v : null;
  } catch {
    return null;
  }
}

export function sessionSecret(): string | null {
  const s = process.env.VIDGEN_SESSION_SECRET || '';
  return s.length >= 32 ? s : null;
}

export const hmacWith = (secret: string, data: string) => createHmac('sha256', secret).update(data).digest('base64url');

export function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Signs a small JSON payload: base64url(json).hmac. Used for the session and OAuth state cookies. */
export function sign(payload: Record<string, unknown>, secret: string, purpose: string): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${hmacWith(secret, purpose + ':' + body)}`;
}

export function unsign<T>(token: string, secret: string, purpose: string): T | null {
  const i = token.lastIndexOf('.');
  if (i <= 0) return null;
  const body = token.slice(0, i);
  if (!safeEqual(token.slice(i + 1), hmacWith(secret, purpose + ':' + body))) return null;
  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as T;
  } catch {
    return null;
  }
}

export function readCookie(req: Request, name: string): string {
  const raw = req.headers.get('cookie') || '';
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return '';
}

export function cookie(name: string, value: string, maxAgeSec: number): string {
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAgeSec}`;
}

export const SESSION_COOKIE = 'vg_session';
export const STATE_COOKIE = 'vg_oauth';
const SESSION_DAYS = 30;

export interface Session { uid: string }

export function makeSessionCookie(uid: string, secret: string): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_DAYS * 86400;
  return cookie(SESSION_COOKIE, sign({ u: uid, e: exp }, secret, 'session'), SESSION_DAYS * 86400);
}
export const clearSessionCookie = () => cookie(SESSION_COOKIE, '', 0);

export function readSession(req: Request): Session | null {
  const secret = sessionSecret();
  if (!secret) return null;
  const tok = readCookie(req, SESSION_COOKIE);
  if (!tok) return null;
  const p = unsign<{ u: string; e: number }>(tok, secret, 'session');
  if (!p || typeof p.u !== 'string' || typeof p.e !== 'number' || p.e < Date.now() / 1000) return null;
  return { uid: p.u };
}

/**
 * Basic CSRF guard for state-changing calls: the session cookie is SameSite=Lax,
 * and on top of that a POST must come from our own pages (Origin matches host).
 */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true; // same-origin fetches from older browsers can omit it; SameSite=Lax still applies
  try {
    return new URL(origin).host === new URL(req.url).host;
  } catch {
    return false;
  }
}

/** The public URL of this deploy, for webhooks and background calls. */
export function siteUrl(context?: Context): string {
  const u = context?.site?.url || process.env.URL || SITE;
  return u.replace(/\/+$/, '');
}

/** HMAC of the client IP (Netlify sets x-nf-client-connection-ip). The raw IP is never stored. */
export function ipHash(req: Request, context?: Context): string {
  const ip = context?.ip || req.headers.get('x-nf-client-connection-ip') || (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  return hmacWith(sessionSecret() || 'vidgen-ip', 'ip:' + ip).slice(0, 32);
}

/** Same-site relative path inside the studio only (used for the OAuth "next" target). Anything else becomes /video-generation. */
export function safeNext(v: string | null | undefined): string {
  const fallback = '/video-generation';
  if (!v || typeof v !== 'string' || v.length > 200) return fallback;
  // eslint-disable-next-line no-control-regex
  if (!v.startsWith('/') || v.startsWith('//') || v.includes('\\') || /[\u0000-\u001f]/.test(v)) return fallback;
  try {
    const u = new URL(v, SITE);
    if (u.origin !== SITE) return fallback;
    if (!/^\/video-generation(\/(library|billing|terms))?$/.test(u.pathname)) return fallback;
    if (!/^(\?[a-z0-9=&_-]*)?$/i.test(u.search)) return fallback;
    return u.pathname + u.search;
  } catch {
    return fallback;
  }
}

export const isUuid = (v: unknown): v is string => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
