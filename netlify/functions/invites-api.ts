import type { HandlerEvent, HandlerResponse } from '@netlify/functions';
import { asV2, invitesStore, readToken, randomId, json, fail, parseBody, str } from './_invites/common';
import {
  THEME_IDS, LIMITS, isDate, isTime, isEmail, cleanPhone, parseGuestList, todayIn, buildIcs,
  type InviteEvent, type Guest, type SubEvent, type ThemeId,
} from '../../src/invites/shared';

/**
 * Kenji Invites API (kenjiai.com/invites). Storage: Netlify Blobs store "invites".
 *   events/<eventId>                 event JSON
 *   owners/<ownerHash>/<eventId>     empty marker, lists a host's events by prefix
 *   guests/<eventId>/<guestId>       one JSON per guest so RSVPs never overwrite each other
 *   codes/<code>                     {eventId, guestId} or {eventId, open:true}
 *   photos/<eventId>                 resized JPEG bytes
 *   rl/<code>                        RSVP write timestamps (rate limit)
 *
 * Host ops need `Authorization: Bearer <token>` from invites-auth and must own the event.
 * Guest ops are public and keyed by the unguessable personal code.
 * Messages to guests are sent from the host's own phone/email, never from here.
 */

type Store = ReturnType<typeof invitesStore>;
type Owner = { ownerHash: string };
type StoredEvent = InviteEvent & { ownerHash: string };

const SITE = 'https://kenjiai.com';
const MAX_PHOTO_BYTES = 3 * 1024 * 1024;
const RSVP_WRITES_PER_HOUR = 20;

const nowIso = () => new Date().toISOString();
const bool = (v: unknown) => v === true || v === 'true' || v === 1;
const int = (v: unknown, min: number, max: number, dflt: number) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : dflt;
};

function validTz(tz: string): string {
  if (!tz) return 'America/New_York';
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return tz;
  } catch {
    return 'America/New_York';
  }
}

function cleanSubEvents(v: unknown): SubEvent[] {
  if (!Array.isArray(v)) return [];
  return (v as Record<string, unknown>[]).slice(0, LIMITS.subEvents).map((s) => ({
    id: /^[A-Za-z0-9_-]{4,24}$/.test(String(s?.id || '')) ? String(s.id) : randomId(6),
    title: str(s?.title, LIMITS.name) || 'Celebration',
    date: isDate(s?.date) ? s.date : '',
    time: isTime(s?.time) ? s.time : '',
    venueName: str(s?.venueName, LIMITS.venue),
    address: str(s?.address, LIMITS.address),
    notes: str(s?.notes, LIMITS.notes),
  }));
}

/** Applies the editable fields present in `b` onto `ev`. Returns an error message or ''. */
function applyEventFields(ev: StoredEvent, b: Record<string, unknown>): string {
  if ('coupleNames' in b) {
    const n = Array.isArray(b.coupleNames) ? b.coupleNames : [];
    const a = str(n[0], LIMITS.name);
    const c = str(n[1], LIMITS.name);
    if (!a || !c) return 'Please type both names.';
    ev.coupleNames = [a, c];
    ev.title = `${a} & ${c}`;
  }
  if ('date' in b) {
    if (b.date && !isDate(b.date)) return 'Please pick the wedding date again.';
    ev.date = (b.date as string) || '';
  }
  if ('time' in b) {
    if (b.time && !isTime(b.time)) return 'Please pick the time again.';
    ev.time = (b.time as string) || '';
  }
  if ('timezone' in b) ev.timezone = validTz(str(b.timezone, 64));
  if ('venueName' in b) ev.venueName = str(b.venueName, LIMITS.venue);
  if ('address' in b) ev.address = str(b.address, LIMITS.address);
  if ('theme' in b) {
    if (!THEME_IDS.includes(b.theme as ThemeId)) return 'Please pick a design.';
    ev.theme = b.theme as ThemeId;
  }
  if ('accent' in b) ev.accent = /^#[0-9a-fA-F]{6}$/.test(String(b.accent || '')) ? String(b.accent) : '';
  if ('personalMessage' in b) ev.personalMessage = str(b.personalMessage, LIMITS.message);
  if ('rsvpBy' in b) {
    if (b.rsvpBy && !isDate(b.rsvpBy)) return 'Please pick the reply-by date again.';
    ev.rsvpBy = (b.rsvpBy as string) || '';
  }
  if ('defaultSeats' in b) ev.defaultSeats = int(b.defaultSeats, 1, LIMITS.maxSeats, 2);
  if ('openLinkEnabled' in b) ev.openLinkEnabled = bool(b.openLinkEnabled);
  if ('subEvents' in b) ev.subEvents = cleanSubEvents(b.subEvents);
  return '';
}

function publicEvent(ev: StoredEvent) {
  return {
    id: ev.id, coupleNames: ev.coupleNames, title: ev.title, date: ev.date, time: ev.time, timezone: ev.timezone,
    venueName: ev.venueName, address: ev.address, theme: ev.theme, accent: ev.accent, photo: ev.photo,
    photoVersion: ev.photoVersion, personalMessage: ev.personalMessage, rsvpBy: ev.rsvpBy, defaultSeats: ev.defaultSeats,
    subEvents: ev.subEvents,
  };
}

function hostEvent(ev: StoredEvent): InviteEvent {
  const rest: Partial<StoredEvent> = { ...ev };
  delete rest.ownerHash;
  return rest as InviteEvent;
}

async function loadOwned(store: Store, owner: Owner, id: unknown): Promise<StoredEvent | null> {
  if (typeof id !== 'string' || !/^[A-Za-z0-9_-]{8,32}$/.test(id)) return null;
  const ev = (await store.get(`events/${id}`, { type: 'json' })) as StoredEvent | null;
  if (!ev || ev.ownerHash !== owner.ownerHash) return null;
  return ev;
}

async function listGuests(store: Store, eventId: string): Promise<Guest[]> {
  const { blobs } = await store.list({ prefix: `guests/${eventId}/` });
  const all = await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' }) as Promise<Guest | null>));
  return all.filter((g): g is Guest => !!g).sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
}

function summarize(guests: Guest[]) {
  const s = { invited: guests.length, opened: 0, coming: 0, notComing: 0, noAnswer: 0, peopleComing: 0, sent: 0 };
  for (const g of guests) {
    if (g.openedAt || g.status === 'yes' || g.status === 'no') s.opened++;
    if (g.status === 'yes') { s.coming++; s.peopleComing += g.partySize || 1; }
    else if (g.status === 'no') s.notComing++;
    else s.noAnswer++;
    if (g.sentAt) s.sent++;
  }
  return s;
}

function newGuest(f: { name: string; phone: string; email: string; seats: number }): Guest {
  const t = nowIso();
  return {
    id: randomId(9), code: randomId(12), name: f.name, phone: f.phone, email: f.email, seats: f.seats,
    status: 'invited', partySize: 0, partyNames: '', note: '', openedAt: '', respondedAt: '', sentAt: '', sentVia: '',
    createdAt: t, updatedAt: t,
  };
}

async function saveNewGuest(store: Store, eventId: string, g: Guest) {
  await store.setJSON(`guests/${eventId}/${g.id}`, g);
  await store.setJSON(`codes/${g.code}`, { eventId, guestId: g.id });
}

function csvCell(v: unknown): string {
  let s = String(v ?? '');
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const STATUS_WORDS: Record<string, string> = { invited: 'No answer yet', opened: 'Opened, no answer yet', yes: 'Coming', no: 'Not coming' };

async function rateLimited(store: Store, code: string): Promise<boolean> {
  const key = `rl/${code}`;
  const now = Date.now();
  const rec = ((await store.get(key, { type: 'json' })) as { t: number[] } | null) || { t: [] };
  const recent = rec.t.filter((x) => now - x < 3600000);
  if (recent.length >= RSVP_WRITES_PER_HOUR) return true;
  await store.setJSON(key, { t: [...recent, now] });
  return false;
}

function detectImage(buf: Buffer): string {
  if (buf[0] === 0xff && buf[1] === 0xd8) return 'image/jpeg';
  if (buf[0] === 0x89 && buf[1] === 0x50) return 'image/png';
  if (buf.slice(0, 4).toString() === 'RIFF' && buf.slice(8, 12).toString() === 'WEBP') return 'image/webp';
  return '';
}

/** Answers can change until the end of the wedding day (in the event's timezone). */
const canChange = (ev: StoredEvent) => !ev.date || todayIn(ev.timezone) <= ev.date;

async function resolveCode(store: Store, code: unknown) {
  if (typeof code !== 'string' || !/^[A-Za-z0-9_-]{12,32}$/.test(code)) return null;
  const c = (await store.get(`codes/${code}`, { type: 'json' })) as { eventId: string; guestId?: string; open?: boolean } | null;
  if (!c) return null;
  const ev = (await store.get(`events/${c.eventId}`, { type: 'json' })) as StoredEvent | null;
  if (!ev) return null;
  if (c.open) {
    if (!ev.openLinkEnabled || ev.openCode !== code) return null;
    return { ev, guest: null as Guest | null, open: true };
  }
  const guest = (await store.get(`guests/${c.eventId}/${c.guestId}`, { type: 'json' })) as Guest | null;
  if (!guest) return null;
  return { ev, guest, open: false };
}

function guestView(g: Guest) {
  return { name: g.name, seats: g.seats, status: g.status, partySize: g.partySize, partyNames: g.partyNames, note: g.note, respondedAt: g.respondedAt };
}

function readRsvp(b: Record<string, unknown>, seats: number): { attending: boolean; partySize: number; partyNames: string; note: string } | string {
  if (typeof b.attending !== 'boolean') return 'Please tap Yes or No first.';
  const attending = b.attending;
  let partySize = 0;
  if (attending) {
    partySize = Math.round(Number(b.partySize));
    if (!Number.isFinite(partySize) || partySize < 1) return 'Please tell us how many people are coming, counting you.';
    if (partySize > seats) return `Your invitation is for up to ${seats} ${seats === 1 ? 'person' : 'people'}. Please choose ${seats} or fewer.`;
  }
  return { attending, partySize, partyNames: attending ? str(b.partyNames, LIMITS.partyNames) : '', note: str(b.note, LIMITS.note) };
}

const handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  const op = event.queryStringParameters?.op || '';
  const q = event.queryStringParameters || {};
  const method = event.httpMethod;
  let store: Store;
  try {
    store = invitesStore();
  } catch (e) {
    console.error('[invites-api] store', e);
    return fail(500, 'Something went wrong on our side. Please try again.');
  }

  try {
    // ---------- public: photo and calendar files ----------
    if (method === 'GET' && op === 'photo') {
      if (!/^[A-Za-z0-9_-]{8,32}$/.test(q.e || '')) return { statusCode: 404, body: '' };
      const data = (await store.get(`photos/${q.e}`, { type: 'arrayBuffer' })) as ArrayBuffer | null;
      if (!data) return { statusCode: 404, body: '' };
      const buf = Buffer.from(data);
      return {
        statusCode: 200,
        headers: { 'Content-Type': detectImage(buf) || 'image/jpeg', 'Cache-Control': 'public, max-age=31536000, immutable' },
        body: buf.toString('base64'),
        isBase64Encoded: true,
      };
    }

    if (method === 'GET' && op === 'ics') {
      const r = await resolveCode(store, q.code);
      if (!r) return { statusCode: 404, body: 'Not found' };
      const { ev } = r;
      const link = `${SITE}/i/${q.code}`;
      const sub = q.sub && q.sub !== 'main' ? ev.subEvents.find((s) => s.id === q.sub) : null;
      if (q.sub && q.sub !== 'main' && !sub) return { statusCode: 404, body: 'Not found' };
      const item = sub
        ? { uid: `${ev.id}-${sub.id}`, title: `${sub.title}: ${ev.title}`, date: sub.date || ev.date, time: sub.time, timezone: ev.timezone, location: [sub.venueName, sub.address].filter(Boolean).join(', '), details: [sub.notes, `Invitation: ${link}`].filter(Boolean).join('\n'), hours: 3 }
        : { uid: ev.id, title: `Wedding of ${ev.title}`, date: ev.date, time: ev.time, timezone: ev.timezone, location: [ev.venueName, ev.address].filter(Boolean).join(', '), details: `Invitation: ${link}`, hours: 5 };
      if (!item.date) return { statusCode: 404, body: 'No date yet' };
      const fname = (sub ? sub.title : 'wedding').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'event';
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': `attachment; filename="${fname}.ics"`, 'Cache-Control': 'no-store' },
        body: buildIcs(item),
      };
    }

    // ---------- public: guest invitation ----------
    if (method === 'GET' && op === 'invite') {
      const r = await resolveCode(store, q.code);
      if (!r) return fail(404, "We couldn't find this invitation. Please check the link you were sent.");
      let { guest } = r;
      if (guest && !guest.openedAt && q.preview !== '1') {
        const t = nowIso();
        guest = { ...guest, openedAt: t, status: guest.status === 'invited' ? 'opened' : guest.status, updatedAt: t };
        await store.setJSON(`guests/${r.ev.id}/${guest.id}`, guest);
      }
      return json(200, { event: publicEvent(r.ev), guest: guest ? guestView(guest) : null, open: r.open, canChange: canChange(r.ev), openSeats: r.open ? r.ev.defaultSeats : undefined });
    }

    if (method === 'POST' && (op === 'rsvp' || op === 'open-rsvp')) {
      const b = parseBody(event);
      if (!b) return fail(400, 'Something went wrong. Please try again.');
      const r = await resolveCode(store, b.code);
      if (!r) return fail(404, "We couldn't find this invitation. Please check the link you were sent.");
      if (!canChange(r.ev)) return fail(400, 'This celebration has already happened, so answers are closed.');
      if (await rateLimited(store, String(b.code))) return fail(429, "You've saved a lot of changes in a short time. Please wait a little and try again.");
      const t = nowIso();

      if (op === 'rsvp') {
        if (!r.guest) return fail(400, 'Please fill in your name first.');
        const a = readRsvp(b, r.guest.seats);
        if (typeof a === 'string') return fail(400, a);
        const g: Guest = { ...r.guest, status: a.attending ? 'yes' : 'no', partySize: a.partySize, partyNames: a.partyNames, note: a.note, respondedAt: t, updatedAt: t, openedAt: r.guest.openedAt || t };
        await store.setJSON(`guests/${r.ev.id}/${g.id}`, g);
        return json(200, { ok: true, guest: guestView(g) });
      }

      // open shared link: creates a guest record for this person
      if (!r.open) return fail(400, 'Something went wrong. Please try again.');
      const name = str(b.name, LIMITS.name);
      if (!name) return fail(400, 'Please type your name.');
      const email = str(b.email, 200).toLowerCase();
      const phone = cleanPhone(str(b.phone, 30));
      if (email && !isEmail(email)) return fail(400, 'Please check your email address.');
      if (!email && !phone) return fail(400, 'Please add your phone number or email, so the couple can reach you.');
      const a = readRsvp(b, r.ev.defaultSeats);
      if (typeof a === 'string') return fail(400, a);
      const { blobs } = await store.list({ prefix: `guests/${r.ev.id}/` });
      if (blobs.length >= LIMITS.guests) return fail(400, 'This invitation is full. Please contact the couple directly.');
      const g = newGuest({ name, phone, email, seats: r.ev.defaultSeats });
      Object.assign(g, { status: a.attending ? 'yes' : 'no', partySize: a.partySize, partyNames: a.partyNames, note: a.note, respondedAt: t, openedAt: t, fromOpenLink: true });
      await saveNewGuest(store, r.ev.id, g);
      return json(200, { ok: true, code: g.code, guest: guestView(g) });
    }

    // ---------- host ----------
    const owner = readToken(event);
    if (!owner) return fail(401, 'Please sign in again.');

    if (method === 'GET' && op === 'events') {
      const { blobs } = await store.list({ prefix: `owners/${owner.ownerHash}/` });
      const ids = blobs.map((b) => b.key.split('/').pop() as string);
      const events = await Promise.all(ids.map(async (id) => {
        const ev = await loadOwned(store, owner, id);
        if (!ev) return null;
        return { ...hostEvent(ev), summary: summarize(await listGuests(store, id)) };
      }));
      return json(200, { events: events.filter(Boolean).sort((a, b) => (a!.createdAt < b!.createdAt ? 1 : -1)) });
    }

    if (method === 'GET' && op === 'event') {
      const ev = await loadOwned(store, owner, q.id);
      if (!ev) return fail(404, "We couldn't find that invitation.");
      const guests = await listGuests(store, ev.id);
      return json(200, { event: hostEvent(ev), guests, summary: summarize(guests) });
    }

    if (method === 'GET' && op === 'csv') {
      const ev = await loadOwned(store, owner, q.id);
      if (!ev) return fail(404, "We couldn't find that invitation.");
      const guests = await listGuests(store, ev.id);
      const rows = [['Name', 'Phone', 'Email', 'Invited for (people)', 'Answer', 'People coming', 'Their names', 'Note', 'Opened', 'Answered', 'Sent', 'Personal link']];
      for (const g of guests) {
        rows.push([g.name, g.phone, g.email, String(g.seats), STATUS_WORDS[g.status] || g.status, g.status === 'yes' ? String(g.partySize) : '0', g.partyNames, g.note, g.openedAt.slice(0, 10), g.respondedAt.slice(0, 10), g.sentAt ? `${g.sentAt.slice(0, 10)} (${g.sentVia})` : '', `${SITE}/i/${g.code}`]);
      }
      const fname = ev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'guests';
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${fname}-guests.csv"`, 'Cache-Control': 'no-store' },
        body: '﻿' + rows.map((r) => r.map(csvCell).join(',')).join('\r\n'),
      };
    }

    if (method !== 'POST') return fail(405, 'Method not allowed');
    const b = parseBody(event);
    if (!b) return fail(400, 'Something went wrong. Please try again.');

    if (op === 'create-event') {
      const { blobs } = await store.list({ prefix: `owners/${owner.ownerHash}/` });
      if (blobs.length >= 25) return fail(400, 'You have a lot of invitations already. Please delete one you no longer need first.');
      const t = nowIso();
      const ev: StoredEvent = {
        id: randomId(12), ownerHash: owner.ownerHash, coupleNames: ['', ''], title: '', date: '', time: '', timezone: 'America/New_York',
        venueName: '', address: '', theme: 'ivory', accent: '', photo: false, photoVersion: 0, personalMessage: '', rsvpBy: '',
        defaultSeats: 2, openLinkEnabled: false, openCode: '', subEvents: [], createdAt: t, updatedAt: t,
      };
      const err = applyEventFields(ev, b);
      if (err) return fail(400, err);
      if (!ev.title) return fail(400, 'Please type both names.');
      await store.setJSON(`events/${ev.id}`, ev);
      await store.set(`owners/${owner.ownerHash}/${ev.id}`, '');
      return json(200, { event: hostEvent(ev) });
    }

    const ev = await loadOwned(store, owner, b.id);
    if (!ev) return fail(404, "We couldn't find that invitation.");

    if (op === 'update-event') {
      const err = applyEventFields(ev, b);
      if (err) return fail(400, err);
      if (ev.openLinkEnabled && !ev.openCode) {
        ev.openCode = randomId(12);
        await store.setJSON(`codes/${ev.openCode}`, { eventId: ev.id, open: true });
      }
      ev.updatedAt = nowIso();
      await store.setJSON(`events/${ev.id}`, ev);
      return json(200, { event: hostEvent(ev) });
    }

    if (op === 'delete-event') {
      const guests = await listGuests(store, ev.id);
      await Promise.all(guests.flatMap((g) => [store.delete(`guests/${ev.id}/${g.id}`), store.delete(`codes/${g.code}`), store.delete(`rl/${g.code}`)]));
      if (ev.openCode) await store.delete(`codes/${ev.openCode}`);
      await store.delete(`photos/${ev.id}`);
      await store.delete(`owners/${owner.ownerHash}/${ev.id}`);
      await store.delete(`events/${ev.id}`);
      return json(200, { ok: true });
    }

    if (op === 'photo-upload') {
      const data = String(b.data || '').replace(/^data:image\/[a-z]+;base64,/, '');
      const buf = Buffer.from(data, 'base64');
      if (!buf.length) return fail(400, "We couldn't read that photo. Please try another one.");
      if (buf.length > MAX_PHOTO_BYTES) return fail(400, 'That photo is too large. Please choose a smaller one.');
      if (!detectImage(buf)) return fail(400, 'Please choose a photo (JPG or PNG).');
      await store.set(`photos/${ev.id}`, buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer);
      ev.photo = true;
      ev.photoVersion = (ev.photoVersion || 0) + 1;
      ev.updatedAt = nowIso();
      await store.setJSON(`events/${ev.id}`, ev);
      return json(200, { event: hostEvent(ev) });
    }

    if (op === 'photo-delete') {
      await store.delete(`photos/${ev.id}`);
      ev.photo = false;
      ev.updatedAt = nowIso();
      await store.setJSON(`events/${ev.id}`, ev);
      return json(200, { event: hostEvent(ev) });
    }

    if (op === 'add-guests') {
      const incoming: { name: string; phone: string; email: string; seats: number }[] = [];
      const problems: string[] = [];
      if (typeof b.text === 'string') {
        for (const row of parseGuestList(b.text, ev.defaultSeats)) {
          if (row.error) problems.push(`Line ${row.line} ("${row.raw.slice(0, 40)}"): ${row.error.toLowerCase()}`);
          else incoming.push({ name: row.name, phone: row.phone, email: row.email, seats: row.seats });
        }
      }
      if (Array.isArray(b.guests)) {
        for (const g of b.guests.slice(0, 500) as Record<string, unknown>[]) {
          const name = str(g?.name, LIMITS.name);
          const email = str(g?.email, 200).toLowerCase();
          const phoneRaw = str(g?.phone, 30);
          const phone = cleanPhone(phoneRaw);
          if (!name) { problems.push('Please type a name.'); continue; }
          if (email && !isEmail(email)) { problems.push(`${name}: please check the email address.`); continue; }
          if (phoneRaw && !phone) { problems.push(`${name}: please check the phone number.`); continue; }
          incoming.push({ name, phone, email, seats: int(g?.seats, 1, LIMITS.maxSeats, ev.defaultSeats) });
        }
      }
      if (!incoming.length) return fail(400, problems[0] || 'Please add at least one guest.');
      const { blobs } = await store.list({ prefix: `guests/${ev.id}/` });
      if (blobs.length + incoming.length > LIMITS.guests) return fail(400, `An invitation can have up to ${LIMITS.guests} guests.`);
      const created = incoming.map((f) => newGuest(f));
      await Promise.all(created.map((g) => saveNewGuest(store, ev.id, g)));
      return json(200, { added: created, problems });
    }

    if (op === 'update-guest' || op === 'delete-guest' || op === 'mark-sent') {
      if (typeof b.guestId !== 'string' || !/^[A-Za-z0-9_-]{6,32}$/.test(b.guestId)) return fail(400, "We couldn't find that guest.");
      const key = `guests/${ev.id}/${b.guestId}`;
      const g = (await store.get(key, { type: 'json' })) as Guest | null;
      if (!g) return fail(404, "We couldn't find that guest.");

      if (op === 'delete-guest') {
        await Promise.all([store.delete(key), store.delete(`codes/${g.code}`), store.delete(`rl/${g.code}`)]);
        return json(200, { ok: true });
      }
      if (op === 'mark-sent') {
        const via = ['text', 'email', 'copy', 'share', 'qr'].includes(String(b.via)) ? String(b.via) : 'other';
        const next = { ...g, sentAt: nowIso(), sentVia: via, updatedAt: nowIso() };
        await store.setJSON(key, next);
        return json(200, { guest: next });
      }

      const next: Guest = { ...g };
      if ('name' in b) { const n = str(b.name, LIMITS.name); if (!n) return fail(400, 'Please type a name.'); next.name = n; }
      if ('email' in b) { const e = str(b.email, 200).toLowerCase(); if (e && !isEmail(e)) return fail(400, 'Please check the email address.'); next.email = e; }
      if ('phone' in b) { const raw = str(b.phone, 30); const p = cleanPhone(raw); if (raw && !p) return fail(400, 'Please check the phone number.'); next.phone = p; }
      if ('seats' in b) next.seats = int(b.seats, 1, LIMITS.maxSeats, g.seats);
      // The host can record an answer a guest gave them by phone or in person.
      if ('answer' in b) {
        const ans = String(b.answer);
        if (ans === 'yes') { next.status = 'yes'; next.partySize = int(b.partySize, 1, next.seats, Math.min(next.seats, g.partySize || 1)); next.respondedAt = nowIso(); }
        else if (ans === 'no') { next.status = 'no'; next.partySize = 0; next.respondedAt = nowIso(); }
        else if (ans === 'none') { next.status = g.openedAt ? 'opened' : 'invited'; next.partySize = 0; next.respondedAt = ''; }
      }
      if (next.status === 'yes' && next.partySize > next.seats) next.partySize = next.seats;
      next.updatedAt = nowIso();
      await store.setJSON(key, next);
      return json(200, { guest: next });
    }

    return fail(400, 'Unknown request');
  } catch (e) {
    console.error('[invites-api]', op, e);
    return fail(500, 'Something went wrong on our side. Please try again.');
  }
};

// Netlify Functions v2 (needed for strongly consistent Blobs reads); same URL and ops.
export default asV2(handler);
