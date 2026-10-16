import { createHash, randomBytes } from 'node:crypto';
import { SITE, STATE_COOKIE, cookie, sessionSecret, sign } from './_vidgen/common';

/**
 * Kenji Studio sign-in, step 1: redirect to Google (OAuth 2.0 authorization code flow
 * with PKCE). A signed, 10-minute HttpOnly cookie carries the state, the PKCE verifier,
 * the redirect URI and where to send the person afterwards.
 * Env: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, VIDGEN_SESSION_SECRET.
 */

const CALLBACK_PATH = '/.netlify/functions/vidgen-auth-callback';

/** Production always uses https://kenjiai.com/...; deploy previews and netlify dev use their own origin. */
export function callbackUrl(origin: string): string {
  const host = new URL(origin).host;
  if (host === 'kenjiai.com' || host === 'www.kenjiai.com') return SITE + CALLBACK_PATH;
  return origin + CALLBACK_PATH;
}

export const safeReturn = (v: string | null) =>
  v && /^\/video-generation(\/[a-z-]*)?(\?[a-z0-9=&_-]*)?$/i.test(v) ? v : '/video-generation';

export default async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const secret = sessionSecret();
  if (!secret || !process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return new Response(null, { status: 302, headers: { Location: '/video-generation?signin=unavailable' } });
  }
  const redirectUri = callbackUrl(url.origin);
  const state = randomBytes(24).toString('base64url');
  const verifier = randomBytes(48).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  const payload = { s: state, v: verifier, ru: redirectUri, r: safeReturn(url.searchParams.get('return')), e: Math.floor(Date.now() / 1000) + 600 };

  const google = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  google.search = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    prompt: 'select_account',
  }).toString();

  return new Response(null, {
    status: 302,
    headers: { Location: google.toString(), 'Set-Cookie': cookie(STATE_COOKIE, sign(payload, secret, 'oauth'), 600), 'Cache-Control': 'no-store' },
  });
};
