import type { HandlerEvent, HandlerResponse } from '@netlify/functions';
import { timingSafeEqual } from 'node:crypto';
import { asV2, invitesStore, fail } from './_invites/common';
import type { HostRecord } from './invites-auth';

/**
 * Kenji Invites admin export (for Yousif's own text/email campaigns).
 *   GET /.netlify/functions/invites-admin?op=export
 *   Authorization: Bearer <INVITES_ADMIN_KEY>
 * Returns a CSV of hosts who left their own email and/or phone in the app:
 * email, phone, created date, invitations, guests, consent to updates (+ timestamps).
 * Never includes any guest's details.
 */

const csvCell = (v: unknown) => {
  let s = String(v ?? '');
  if (/^[=@]/.test(s)) s = "'" + s;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

function authorized(event: HandlerEvent): boolean {
  const want = process.env.INVITES_ADMIN_KEY || '';
  if (want.length < 32) return false;
  const h = event.headers.authorization || '';
  const given = /^Bearer\s+(\S+)$/.exec(h)?.[1] || '';
  const a = Buffer.from(given);
  const b = Buffer.from(want);
  return a.length === b.length && timingSafeEqual(a, b);
}

const handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  if (event.httpMethod !== 'GET') return fail(405, 'Method not allowed');
  if (!authorized(event)) return fail(401, 'Not allowed');
  if (event.queryStringParameters?.op !== 'export') return fail(400, 'Unknown request');

  const store = invitesStore();
  const { blobs } = await store.list({ prefix: 'hosts/' });
  const rows: string[][] = [['email', 'phone', 'created', 'invitations', 'guests', 'consent_to_email_updates', 'consent_email_at', 'consent_to_text_updates', 'consent_text_at', 'source']];
  for (const b of blobs) {
    const ownerHash = b.key.slice('hosts/'.length);
    const h = (await store.get(b.key, { type: 'json' })) as HostRecord | null;
    if (!h || (!h.email && !h.phone)) continue;
    const ev = await store.list({ prefix: `owners/${ownerHash}/` });
    const ids = ev.blobs.map((x) => x.key.split('/').pop() as string);
    const counts = await Promise.all(ids.map(async (id) => (await store.list({ prefix: `guests/${id}/` })).blobs.length));
    rows.push([
      h.email, h.phone, (h.createdAt || '').slice(0, 10), String(ids.length), String(counts.reduce((a, c) => a + c, 0)),
      h.consentEmail ? 'yes' : 'no', h.consentEmailAt || '', h.consentSms ? 'yes' : 'no', h.consentSmsAt || '', h.source || '',
    ]);
  }
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="kenji-invites-hosts.csv"', 'Cache-Control': 'no-store' },
    body: '﻿' + rows.map((r) => r.map(csvCell).join(',')).join('\r\n'),
  };
};

export default asV2(handler);
