import { randomUUID } from 'node:crypto';
import { STATE_COOKIE, cookie, makeSessionCookie, readCookie, safeEqual, safeNext, sessionSecret, unsign } from './_vidgen/common';
import { readyDb, upsertUser } from './_vidgen/db';

/**
 * Kenji Studio sign-in, step 2: Google redirects here with ?code&state.
 * Registered redirect URI: https://kenjiai.com/.netlify/functions/vidgen-auth-callback
 * We check the signed state cookie, exchange the code (with the PKCE verifier) server-side,
 * read the verified profile from Google's userinfo endpoint, create or update the user
 * (trial credits once per Google account), then set the signed session cookie.
 */

const back = (path: string, cookies: string[] = []) => {
  const h = new Headers({ Location: path, 'Cache-Control': 'no-store' });
  for (const c of cookies) h.append('Set-Cookie', c);
  return new Response(null, { status: 302, headers: h });
};

export default async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const clearState = cookie(STATE_COOKIE, '', 0);
  const secret = sessionSecret();
  if (!secret || !process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) return back('/video-generation?signin=unavailable', [clearState]);
  if (url.searchParams.get('error')) return back('/video-generation?signin=cancelled', [clearState]);

  const st = unsign<{ s: string; v: string; ru: string; r: string; e: number }>(readCookie(req, STATE_COOKIE), secret, 'oauth');
  const code = url.searchParams.get('code') || '';
  const state = url.searchParams.get('state') || '';
  if (!st || !code || !state || !safeEqual(st.s, state) || st.e < Date.now() / 1000) return back('/video-generation?signin=expired', [clearState]);

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: st.ru,
        grant_type: 'authorization_code',
        code_verifier: st.v,
      }),
      signal: AbortSignal.timeout(8000),
    });
    const tok = (await tokenRes.json().catch(() => ({}))) as { access_token?: string; error?: string };
    if (!tokenRes.ok || !tok.access_token) {
      console.error('vidgen oauth token exchange failed', tokenRes.status, tok.error);
      return back('/video-generation?signin=failed', [clearState]);
    }
    const infoRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${tok.access_token}` },
      signal: AbortSignal.timeout(8000),
    });
    const info = (await infoRes.json().catch(() => ({}))) as { sub?: string; email?: string; email_verified?: boolean; name?: string; picture?: string };
    if (!infoRes.ok || !info.sub || !info.email || info.email_verified === false) return back('/video-generation?signin=failed', [clearState]);

    const db = await readyDb();
    if (!db) return back('/video-generation?signin=unavailable', [clearState]);
    const { id } = await upsertUser(
      db,
      { sub: String(info.sub), email: String(info.email).slice(0, 200), name: String(info.name || '').slice(0, 120), picture: String(info.picture || '').slice(0, 500) },
      randomUUID(),
    );
    return back(safeNext(st.r), [clearState, makeSessionCookie(id, secret)]);
  } catch (e) {
    console.error('vidgen oauth callback', e);
    return back('/video-generation?signin=failed', [clearState]);
  }
};
