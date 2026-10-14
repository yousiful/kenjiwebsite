import type { HandlerEvent, HandlerResponse } from '@netlify/functions';
import { asV2, invitesStore, makeHostKey, ipHash, readToken, usPhone, json, fail, parseBody, str } from './_invites/common';
import { isEmail } from '../../src/invites/shared';

/**
 * Kenji Invites host identity and host contact details. There is no sign-in: the
 * browser asks for a private host key once and keeps it (localStorage, plus a private
 * link the host saves by texting or emailing it to themselves from their own phone).
 *
 * op=new      -> {key}   rate-limited per IP (20 an hour). Events keep only a hash of the key.
 * op=profile  {email?, phone?, consentEmail?, consentSms?, source?}   needs the host key.
 *             Saves the host's own optional contact details in Blobs (hosts/<ownerHash>) so
 *             Yousif can export them later (invites-admin?op=export).
 *
 * Nothing here talks to any CRM: no GHL contacts, tags, emails or texts.
 */

const KEYS_PER_IP_PER_HOUR = 20;

export interface HostRecord {
  email: string;
  phone: string;
  consentEmail: boolean;
  consentEmailAt: string;
  consentSms: boolean;
  consentSmsAt: string;
  source: string;
  createdAt: string;
  updatedAt: string;
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

  if (op === 'profile') {
    const owner = readToken(event);
    if (!owner) return fail(401, 'Something went wrong. Please reload the page.');
    const body = parseBody(event) || {};
    const now = new Date().toISOString();
    const key = `hosts/${owner.ownerHash}`;
    const cur = (await store.get(key, { type: 'json' })) as HostRecord | null;
    const next: HostRecord = cur || { email: '', phone: '', consentEmail: false, consentEmailAt: '', consentSms: false, consentSmsAt: '', source: '', createdAt: now, updatedAt: now };

    if ('email' in body) {
      const email = str(body.email, 200).toLowerCase();
      if (email && !isEmail(email)) return fail(400, 'Please check your email address. It should look like name@example.com.');
      next.email = email;
      // giving the email in "Your email (optional, so we can send you tips and updates)" is the opt-in
      const consent = !!email && body.consentEmail !== false;
      if (consent !== next.consentEmail) next.consentEmailAt = now;
      next.consentEmail = consent;
    }
    if ('phone' in body) {
      const phone = usPhone(body.phone);
      if (body.phone && !phone) return fail(400, 'Please type a US or Canada mobile number, like (555) 123-4567.');
      next.phone = phone;
      const consent = !!phone && body.consentSms === true;
      if (consent !== next.consentSms) next.consentSmsAt = now;
      next.consentSms = consent;
    }
    if (!next.source) next.source = str(body.source, 40);
    next.updatedAt = now;
    await store.setJSON(key, next);
    return json(200, { ok: true });
  }

  return fail(400, 'Unknown request');
};

// Netlify Functions v2 (needed for strongly consistent Blobs reads); same URL.
export default asV2(handler);
