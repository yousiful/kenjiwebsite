// Shared between the browser (src/invites/*) and the Netlify functions
// (netlify/functions/invites-*.ts). Keep it dependency-free.

export const THEME_IDS = ['ivory', 'garden', 'minimal', 'blush', 'midnight', 'kraft', 'boho', 'emerald'] as const;
export type ThemeId = (typeof THEME_IDS)[number];

export interface SubEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM or ''
  venueName: string;
  address: string;
  notes: string;
}

export interface InviteEvent {
  id: string;
  coupleNames: [string, string];
  title: string;
  date: string;
  time: string;
  timezone: string;
  venueName: string;
  address: string;
  theme: ThemeId;
  accent: string; // '' = theme default
  photo: boolean;
  photoVersion: number;
  personalMessage: string;
  rsvpBy: string;
  defaultSeats: number;
  openLinkEnabled: boolean;
  openCode: string;
  subEvents: SubEvent[];
  createdAt: string;
  updatedAt: string;
}

export type GuestStatus = 'invited' | 'opened' | 'yes' | 'no';

export interface Guest {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  seats: number;
  status: GuestStatus;
  partySize: number;
  partyNames: string;
  note: string;
  openedAt: string;
  respondedAt: string;
  sentAt: string;
  sentVia: string;
  fromOpenLink?: boolean;
  createdAt: string;
  updatedAt: string;
}

export const LIMITS = {
  name: 60,
  venue: 120,
  address: 200,
  message: 400,
  notes: 300,
  partyNames: 300,
  note: 500,
  subEvents: 12,
  guests: 1000,
  maxSeats: 20,
};

export const SUB_EVENT_PRESETS = [
  'Engagement party',
  'Bridal shower',
  'Bachelor party',
  'Bachelorette party',
  'Rehearsal dinner',
  'Welcome drinks',
  'After-party',
  'Brunch',
];

export const isDate = (s: unknown): s is string => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s + 'T00:00:00Z'));
export const isTime = (s: unknown): s is string => typeof s === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(s);
export const isEmail = (s: string) => /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/.test(s);

/** Keeps digits and a leading +. Returns '' if it doesn't look like a phone number. */
export function cleanPhone(raw: string): string {
  const s = String(raw || '').trim();
  const plus = s.startsWith('+');
  const digits = s.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) return '';
  return (plus ? '+' : '') + digits;
}

export function formatPhone(p: string): string {
  if (!p) return '';
  const d = p.replace(/\D/g, '');
  if (d.length === 10 && !p.startsWith('+')) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  if (d.length === 11 && d.startsWith('1')) return `+1 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  return p;
}

export interface ParsedGuestLine {
  line: number;
  raw: string;
  name: string;
  phone: string;
  email: string;
  seats: number;
  error?: string;
}

/**
 * Paste format, one guest per line: "Name, phone or email, seats".
 * Forgiving: commas, tabs or semicolons; phone and email can both be present
 * and in any order; seats is optional (defaults to 1).
 */
export function parseGuestList(text: string, defaultSeats = 1): ParsedGuestLine[] {
  const out: ParsedGuestLine[] = [];
  String(text || '').split(/\r?\n/).forEach((rawLine, i) => {
    const raw = rawLine.trim();
    if (!raw) return;
    const parts = raw.split(/[,;\t]/).map((p) => p.trim()).filter(Boolean);
    let name = '';
    let phone = '';
    let email = '';
    let seats = defaultSeats;
    for (const part of parts) {
      if (!email && part.includes('@') && isEmail(part.toLowerCase())) email = part.toLowerCase();
      else if (/^\d{1,2}$/.test(part) && Number(part) >= 1 && Number(part) <= LIMITS.maxSeats) seats = Number(part);
      else if (!phone && cleanPhone(part)) phone = cleanPhone(part);
      else if (!name) name = part.slice(0, LIMITS.name);
    }
    const row: ParsedGuestLine = { line: i + 1, raw, name, phone, email, seats };
    if (!name) row.error = 'Missing a name';
    out.push(row);
  });
  return out;
}

/** Minutes east of UTC for a timezone at a given instant. */
function tzOffsetMinutes(utcMs: number, timeZone: string): number {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
    }).formatToParts(new Date(utcMs));
    const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
    const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour') % 24, get('minute'), get('second'));
    return Math.round((asUtc - utcMs) / 60000);
  } catch {
    return 0;
  }
}

/** Wall-clock date+time in a timezone -> UTC milliseconds. */
export function zonedToUtc(date: string, time: string, timeZone: string): number {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = (time || '00:00').split(':').map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  let utc = guess - tzOffsetMinutes(guess, timeZone) * 60000;
  utc = guess - tzOffsetMinutes(utc, timeZone) * 60000;
  return utc;
}

/** Today's date (YYYY-MM-DD) in a timezone. */
export function todayIn(timeZone: string, now = Date.now()): string {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(now));
  } catch {
    return new Date(now).toISOString().slice(0, 10);
  }
}

export function daysBetween(fromDate: string, toDate: string): number {
  return Math.round((Date.parse(toDate + 'T00:00:00Z') - Date.parse(fromDate + 'T00:00:00Z')) / 86400000);
}

const pad = (n: number) => String(n).padStart(2, '0');
const icsStamp = (ms: number) => {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
};
const icsDate = (date: string) => date.replace(/-/g, '');
const nextDay = (date: string) => new Date(Date.parse(date + 'T00:00:00Z') + 86400000).toISOString().slice(0, 10);

export interface CalItem {
  uid: string;
  title: string;
  date: string;
  time: string;
  timezone: string;
  location: string;
  details: string;
  hours: number;
}

/** Start/end for Google Calendar's `dates` param. */
export function googleCalendarUrl(it: CalItem): string {
  let dates: string;
  if (it.time) {
    const start = zonedToUtc(it.date, it.time, it.timezone);
    dates = `${icsStamp(start)}/${icsStamp(start + it.hours * 3600000)}`;
  } else {
    dates = `${icsDate(it.date)}/${icsDate(nextDay(it.date))}`;
  }
  const q = new URLSearchParams({ action: 'TEMPLATE', text: it.title, dates, details: it.details, location: it.location });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}

const icsEscape = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (c) => '\\' + c);

export function buildIcs(it: CalItem): string {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//KenjiAI//Kenji Invites//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT'];
  lines.push(`UID:${it.uid}@kenjiai.com`, `DTSTAMP:${icsStamp(Date.now())}`);
  if (it.time) {
    const start = zonedToUtc(it.date, it.time, it.timezone);
    lines.push(`DTSTART:${icsStamp(start)}`, `DTEND:${icsStamp(start + it.hours * 3600000)}`);
  } else {
    lines.push(`DTSTART;VALUE=DATE:${icsDate(it.date)}`, `DTEND;VALUE=DATE:${icsDate(nextDay(it.date))}`);
  }
  lines.push(`SUMMARY:${icsEscape(it.title)}`);
  if (it.location) lines.push(`LOCATION:${icsEscape(it.location)}`);
  if (it.details) lines.push(`DESCRIPTION:${icsEscape(it.details)}`);
  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.join('\r\n') + '\r\n';
}
