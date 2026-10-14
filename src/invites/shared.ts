// Shared between the browser (src/invites/*) and the Netlify functions
// (netlify/functions/invites-*.ts). Keep it dependency-free.

export const THEME_IDS = [
  'ivory', 'waxseal', 'blacktie', 'vellum', 'garden', 'blush', 'emerald', 'midnight', 'deco', 'tile', 'minimal', 'kraft', 'boho',
  // occasion designs with hand-drawn illustrations
  'couple', 'chapel', 'arbor', 'beach', 'barn', 'passport', 'city', 'renewal',
  // designs for every other kind of celebration
  'balloons', 'cake', 'confetti', 'neon', 'gradcap', 'nursery', 'ring', 'crown', 'mitzvah', 'sunset', 'house', 'winter', 'cheers', 'launch', 'polaroid',
] as const;
export const MUSIC_IDS = ['', 'canon', 'bridal', 'chimes'] as const;
export type MusicId = (typeof MUSIC_IDS)[number];
export const FIGURES = ['bride-groom', 'two-brides', 'two-grooms'] as const;
export type Figures = (typeof FIGURES)[number];
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
  opening: 'sketch' | 'envelope' | 'fade'; // how the guest page opens
  music: MusicId; // '' = none; synthesized in the browser, never autoplayed
  figures: Figures; // who is drawn on the Bride & Groom design
  showCross: boolean; // church design: show a cross (host's choice)
  ogVersion?: number; // link-preview image version (0/undefined = none yet)
  type?: EventType; // what is being celebrated (missing = wedding, every event made before types existed)
  details?: EventDetails; // per-type extras: age, school, event name...
  photos?: PhotoRef[]; // up to 8; the first one is the main photo
  photoLayout?: number; // which arrangement of the photos ("Shuffle layout")
  layout?: CardLayout | null; // "Customize my card" edits (null/undefined = the design as made)
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
  addedBy?: string; // ownerHash of the host who added them ('' = replied on the shared link)
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
  url?: string; // the invitation link
}

/** "Sarah & James's Wedding" from the two names (first names only). */
export function weddingTitle(names: [string, string]): string {
  const f = (n: string) => n.trim().split(/\s+/)[0] || n;
  return `${f(names[0])} & ${f(names[1])}'s Wedding`;
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
  // ctz shows the times in the event's own timezone
  const q = new URLSearchParams({ action: 'TEMPLATE', text: it.title, dates, details: it.details, location: it.location, ctz: it.timezone });
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
  if (it.url) lines.push(`URL:${it.url}`);
  // reminder the day before
  lines.push('BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${icsEscape(it.title)} is tomorrow`, 'TRIGGER:-P1D', 'END:VALARM');
  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.join('\r\n') + '\r\n';
}

// ================= kinds of celebration =================

export const EVENT_TYPES = [
  'wedding', 'birthday', 'graduation', 'baby', 'bridal', 'engagement', 'anniversary', 'quince', 'mitzvah',
  'retirement', 'housewarming', 'holiday', 'business', 'reunion', 'custom',
] as const;
export type EventType = (typeof EVENT_TYPES)[number];
export const DETAIL_KEYS = ['age', 'school', 'classYear', 'years', 'eventName', 'company', 'hostedBy', 'milestone', 'tagline'] as const;
export type DetailKey = (typeof DETAIL_KEYS)[number];
export type EventDetails = Partial<Record<DetailKey, string>>;
export const DETAIL_MAX = 80;

export interface TypeDef {
  label: string;
  hint: string;
  /** the wizard's "who" step, as a question */
  question: string;
  help: string;
  /** names required: 2 (a couple), 1 (one person, or 1-2 with `secondName`), 0 (the event has a name instead) */
  names: 0 | 1 | 2;
  secondName?: boolean;
  nameLabels: [string, string];
  namePlaceholders: [string, string];
  fields: DetailKey[];
  /** example text for the detail fields */
  eg: EventDetails;
  /** "any time before the {noun}" */
  noun: string;
  /** timeline title for the main event */
  mainLabel: string;
  /** guest-page wording says "the couple" rather than "the host" */
  couple: boolean;
  subPresets: string[];
}

export const MILESTONES: Partial<Record<EventType, string[]>> = {
  quince: ['Quinceañera', 'Sweet 16', 'Sweet 15'],
  mitzvah: ['Bar Mitzvah', 'Bat Mitzvah', "B'nai Mitzvah"],
};

const PARTY_PRESETS = ['Welcome drinks', 'Dinner', 'After-party', 'Brunch the next day'];

export const TYPES: Record<EventType, TypeDef> = {
  wedding: { label: 'Wedding', hint: 'Two people getting married', question: 'Whose wedding is it?', help: 'Type the names of the two people getting married. These go at the top of the invitation.', names: 2, nameLabels: ['First person getting married', 'Second person getting married'], namePlaceholders: ['e.g. Sarah Johnson', 'e.g. James Smith'], fields: [], eg: {}, noun: 'wedding', mainLabel: 'The wedding', couple: true, subPresets: SUB_EVENT_PRESETS },
  birthday: { label: 'Birthday', hint: 'Any age, any kind of party', question: 'Whose birthday is it?', help: "Type the birthday person's name. Add their age if you'd like it on the card.", names: 1, nameLabels: ["Birthday person's name", ''], namePlaceholders: ['e.g. Maya', ''], fields: ['age', 'tagline', 'hostedBy'], eg: { age: 'e.g. 40', tagline: 'e.g. Dinner, cake and dancing', hostedBy: 'e.g. her family' }, noun: 'party', mainLabel: 'The birthday party', couple: false, subPresets: ['Dinner', 'Cake and toasts', 'After-party', 'Brunch the next day'] },
  graduation: { label: 'Graduation', hint: 'Caps, diplomas and a party', question: 'Who is graduating?', help: "Type the graduate's name, and the school and year if you'd like them on the card.", names: 1, nameLabels: ["Graduate's name", ''], namePlaceholders: ['e.g. Jordan Lee', ''], fields: ['school', 'classYear', 'tagline'], eg: { school: 'e.g. Lincoln High School', classYear: 'e.g. 2027', tagline: 'e.g. Come celebrate with us' }, noun: 'celebration', mainLabel: 'The graduation party', couple: false, subPresets: ['Graduation ceremony', 'Dinner', 'Open house', 'After-party'] },
  baby: { label: 'Baby shower', hint: 'Welcome a new little one', question: 'Who is the baby shower for?', help: "Type the parent-to-be's name. You can add a second parent too.", names: 1, secondName: true, nameLabels: ['Parent-to-be', 'Second parent (you can skip this)'], namePlaceholders: ['e.g. Ana', 'e.g. Luis'], fields: ['tagline', 'hostedBy'], eg: { tagline: "e.g. It's a girl!", hostedBy: 'e.g. Aunt Rosa' }, noun: 'shower', mainLabel: 'The baby shower', couple: false, subPresets: ['Gender reveal', 'Brunch', 'Games and gifts'] },
  bridal: { label: 'Bridal shower', hint: 'Showering the bride-to-be', question: 'Who is the bridal shower for?', help: "Type the bride-to-be's name.", names: 1, nameLabels: ['Bride-to-be', ''], namePlaceholders: ['e.g. Sarah', ''], fields: ['tagline', 'hostedBy'], eg: { tagline: 'e.g. Brunch and bubbly', hostedBy: 'e.g. the bridesmaids' }, noun: 'shower', mainLabel: 'The bridal shower', couple: false, subPresets: ['Brunch', 'Tea party', 'Bachelorette party'] },
  engagement: { label: 'Engagement party', hint: 'Celebrating a new engagement', question: 'Who got engaged?', help: 'Type the names of the two people who got engaged.', names: 2, nameLabels: ['First person', 'Second person'], namePlaceholders: ['e.g. Sarah', 'e.g. James'], fields: ['tagline', 'hostedBy'], eg: { tagline: 'e.g. She said yes!', hostedBy: "e.g. Sarah's parents" }, noun: 'party', mainLabel: 'The engagement party', couple: true, subPresets: PARTY_PRESETS },
  anniversary: { label: 'Anniversary', hint: 'Years of love, celebrated', question: 'Whose anniversary is it?', help: 'Type both names, and how many years if you would like that on the card.', names: 2, nameLabels: ['First person', 'Second person'], namePlaceholders: ['e.g. Mary', 'e.g. Tom'], fields: ['years', 'tagline', 'hostedBy'], eg: { years: 'e.g. 50', tagline: 'e.g. Fifty years and still dancing', hostedBy: 'e.g. their children' }, noun: 'celebration', mainLabel: 'The anniversary party', couple: true, subPresets: ['Renewal of vows', 'Dinner', 'Family brunch'] },
  quince: { label: 'Quinceañera or Sweet 16', hint: 'A milestone birthday', question: 'Who is celebrating?', help: 'Type the name of the birthday girl or boy and pick the celebration.', names: 1, nameLabels: ['Name', ''], namePlaceholders: ['e.g. Sofia', ''], fields: ['milestone', 'tagline', 'hostedBy'], eg: { tagline: 'e.g. Mis XV años', hostedBy: 'e.g. her parents' }, noun: 'celebration', mainLabel: 'The celebration', couple: false, subPresets: ['Mass', 'Reception', 'After-party'] },
  mitzvah: { label: 'Bar or Bat Mitzvah', hint: 'A milestone of faith and family', question: 'Whose celebration is it?', help: 'Type the name and pick Bar or Bat Mitzvah.', names: 1, nameLabels: ['Name', ''], namePlaceholders: ['e.g. Noah', ''], fields: ['milestone', 'tagline', 'hostedBy'], eg: { tagline: 'e.g. Called to the Torah', hostedBy: 'e.g. the Cohen family' }, noun: 'celebration', mainLabel: 'The service', couple: false, subPresets: ['Kiddush luncheon', 'Reception', 'Party'] },
  retirement: { label: 'Retirement', hint: 'Cheers to the next chapter', question: 'Who is retiring?', help: "Type the name of the person retiring. You can add a line like 'After 32 wonderful years'.", names: 1, nameLabels: ['Name of the person retiring', ''], namePlaceholders: ['e.g. Linda Park', ''], fields: ['tagline', 'hostedBy'], eg: { tagline: 'e.g. After 32 wonderful years at Acme', hostedBy: 'e.g. the whole team' }, noun: 'party', mainLabel: 'The retirement party', couple: false, subPresets: ['Dinner', 'Toasts', 'After-party'] },
  housewarming: { label: 'Housewarming', hint: 'Show off the new place', question: 'Whose new home is it?', help: "Type your name or your family's name. You can add a second name too.", names: 1, secondName: true, nameLabels: ['Your name, or your family name', 'Second name (you can skip this)'], namePlaceholders: ['e.g. The Garcias', 'e.g. Sam'], fields: ['tagline'], eg: { tagline: 'e.g. Food, drinks and a tour' }, noun: 'party', mainLabel: 'The housewarming', couple: false, subPresets: ['Open house', 'Dinner', 'Backyard barbecue'] },
  holiday: { label: 'Holiday party', hint: "Season's greetings and good cheer", question: 'What is the party called?', help: 'Give your party a name, like Holiday Party or Friendsgiving.', names: 0, nameLabels: ['', ''], namePlaceholders: ['', ''], fields: ['eventName', 'hostedBy', 'tagline'], eg: { eventName: 'e.g. Holiday Party', hostedBy: 'e.g. the Millers', tagline: 'e.g. Cocoa, cookies and carols' }, noun: 'party', mainLabel: 'The party', couple: false, subPresets: ['Gift exchange', 'Dinner', 'Caroling'] },
  business: { label: 'Business or launch event', hint: 'Launches, openings, galas and more', question: 'What is the event called?', help: 'Give your event a name, and add your company if you like.', names: 0, nameLabels: ['', ''], namePlaceholders: ['', ''], fields: ['eventName', 'company', 'tagline'], eg: { eventName: 'e.g. The Spring Launch', company: 'e.g. Bright Co.', tagline: 'e.g. Drinks, demos and good company' }, noun: 'event', mainLabel: 'The event', couple: false, subPresets: ['Welcome reception', 'Keynote', 'Networking hour', 'Dinner'] },
  reunion: { label: 'Reunion', hint: 'Family, class or friends, together again', question: 'What is the reunion called?', help: 'For example: Johnson Family Reunion, or Class of 2006, 20 Years.', names: 0, nameLabels: ['', ''], namePlaceholders: ['', ''], fields: ['eventName', 'hostedBy', 'tagline'], eg: { eventName: 'e.g. Johnson Family Reunion', hostedBy: 'e.g. Aunt Carol', tagline: 'e.g. Bring your old photos' }, noun: 'reunion', mainLabel: 'The reunion', couple: false, subPresets: ['Welcome night', 'Picnic', 'Dinner', 'Farewell brunch'] },
  custom: { label: 'Something else', hint: 'Any other celebration', question: 'What are you celebrating?', help: "Give it a name, like Summer BBQ or Grandma's 90th. Add a line under it if you like.", names: 0, nameLabels: ['', ''], namePlaceholders: ['', ''], fields: ['eventName', 'tagline', 'hostedBy'], eg: { eventName: 'e.g. Summer BBQ', tagline: 'e.g. Burgers, games and sunshine', hostedBy: 'e.g. the Lees' }, noun: 'celebration', mainLabel: 'The celebration', couple: false, subPresets: PARTY_PRESETS },
};

export const DETAIL_LABELS: Record<DetailKey, string> = {
  age: 'Turning how old? (you can skip this)',
  school: 'School (you can skip this)',
  classYear: 'Class of (you can skip this)',
  years: 'How many years together? (you can skip this)',
  eventName: 'Name of the event',
  company: 'Company or organization (you can skip this)',
  hostedBy: 'Hosted by (you can skip this)',
  milestone: 'Which celebration?',
  tagline: 'A short line for the card (you can skip this)',
};

export const typeOf = (ev: { type?: string }): EventType => (EVENT_TYPES.includes(ev.type as EventType) ? (ev.type as EventType) : 'wedding');

/** 1 -> "1st", 22 -> "22nd", 40 -> "40th" */
export function ordinal(n: number): string {
  const s = n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th';
  return `${n}${s}`;
}
const firstName = (n: string) => n.trim().split(/\s+/)[0] || n.trim();
/** "Maya's", "The Garcias'" */
const possessive = (n: string) => (/s$/i.test(n) ? `${n}'` : `${n}'s`);
const num = (s?: string) => { const n = Math.round(Number(String(s || '').replace(/[^\d]/g, ''))); return n > 0 && n < 200 ? n : 0; };

export interface Wording {
  /** calendar, link preview and browser-tab title */
  title: string;
  /** small line above the names ('' = the design's own wording, weddings) */
  intro: string;
  /** the big line(s): names, or the event's name */
  heads: string[];
  /** joins two heads ('' = the design's own) */
  amp: string;
  /** a line under the names: "40th Birthday", "Class of 2027" */
  sub: string;
  /** the host's own short line */
  request: string;
  /** "Hosted by ..." */
  byline: string;
  /** "the couple" or "the host" */
  host: string;
  noun: string;
  mainLabel: string;
  initials: string;
}

/** Everything a card, calendar entry or link preview says about the event, by type. */
export function eventWording(ev: { coupleNames: [string, string]; type?: string; details?: EventDetails }): Wording {
  const type = typeOf(ev);
  const def = TYPES[type];
  const d = ev.details || {};
  const [a0, b0] = ev.coupleNames || ['', ''];
  const a = (a0 || '').trim();
  const b = (b0 || '').trim();
  const fa = firstName(a);
  const fb = firstName(b);
  const pair = b ? `${fa} & ${fb}` : fa;
  const base: Wording = {
    title: '', intro: '', heads: b ? [a, b] : [a], amp: '&', sub: '', request: (d.tagline || '').trim(), byline: d.hostedBy ? `Hosted by ${d.hostedBy.trim()}` : '',
    host: def.couple ? 'the couple' : 'the host', noun: def.noun, mainLabel: def.mainLabel, initials: '',
  };
  const named = (fallback: string) => (d.eventName || '').trim() || fallback;
  switch (type) {
    case 'wedding':
      Object.assign(base, { title: weddingTitle([a, b]), heads: [a, b], amp: '', request: '', byline: '' });
      break;
    case 'birthday': {
      const age = num(d.age);
      Object.assign(base, { title: `${possessive(fa)} ${age ? `${ordinal(age)} ` : ''}Birthday`, intro: 'Please join us to celebrate', heads: [a], sub: age ? `${ordinal(age)} Birthday` : 'Birthday' });
      break;
    }
    case 'graduation': {
      const cls = (d.classYear || '').trim();
      Object.assign(base, { title: `${possessive(fa)} Graduation`, intro: 'Please join us to celebrate the graduation of', heads: [a], sub: [(d.school || '').trim(), cls ? `Class of ${cls}` : ''].filter(Boolean).join(', ') });
      break;
    }
    case 'baby':
      Object.assign(base, { title: `Baby Shower for ${pair}`, intro: 'Please join us for a baby shower honoring' });
      break;
    case 'bridal':
      Object.assign(base, { title: `Bridal Shower for ${fa}`, intro: 'Please join us for a bridal shower honoring', heads: [a], sub: 'Bride to be' });
      break;
    case 'engagement':
      Object.assign(base, { title: `${fa} & ${possessive(fb)} Engagement Party`, intro: 'Please join us to celebrate the engagement of', heads: [a, b] });
      break;
    case 'anniversary': {
      const y = num(d.years);
      Object.assign(base, { title: `${fa} & ${possessive(fb)} ${y ? `${ordinal(y)} ` : ''}Anniversary`, intro: 'Please join us to celebrate the anniversary of', heads: [a, b], sub: y ? `${y} years of love` : '' });
      break;
    }
    case 'quince': {
      const m = (d.milestone || '').trim() || 'Quinceañera';
      Object.assign(base, { title: `${possessive(fa)} ${m}`, intro: 'Please join us to celebrate', heads: [a], sub: m, mainLabel: `The ${m}` });
      break;
    }
    case 'mitzvah': {
      const m = (d.milestone || '').trim() || 'Bar Mitzvah';
      Object.assign(base, { title: `${possessive(fa)} ${m}`, intro: `Please join us to celebrate the ${m} of`, heads: [a] });
      break;
    }
    case 'retirement':
      Object.assign(base, { title: `${possessive(fa)} Retirement Party`, intro: 'Please join us to celebrate the retirement of', heads: [a] });
      break;
    case 'housewarming':
      Object.assign(base, { title: `${b ? `${fa} & ${possessive(fb)}` : possessive(a)} Housewarming`, intro: 'Come see our new home', sub: 'Housewarming Party' });
      break;
    case 'holiday':
      Object.assign(base, { title: named('Holiday Party'), intro: "You're invited to", heads: [named('Holiday Party')] });
      break;
    case 'business': {
      const co = (d.company || '').trim();
      Object.assign(base, { title: named('Our Event'), intro: co ? `${co} invites you to` : "You're invited to", heads: [named('Our Event')], byline: '' });
      break;
    }
    case 'reunion':
      Object.assign(base, { title: named('Reunion'), intro: 'Please join us for', heads: [named('Reunion')] });
      break;
    default:
      Object.assign(base, { title: named('Celebration'), intro: "You're invited to", heads: [named('Celebration')] });
  }
  base.title = base.title.slice(0, 120);
  base.initials = base.heads.filter(Boolean).slice(0, 2).map((h) => h.replace(/^the\s+/i, '').trim().charAt(0).toUpperCase()).join('');
  return base;
}

/** What's missing before an event of this type can be saved ('' = fine). */
export function namesError(type: EventType, names: [string, string], details: EventDetails = {}): string {
  const def = TYPES[type];
  if (def.names === 2 && (!names[0].trim() || !names[1].trim())) return 'Please type both names.';
  if (def.names === 1 && !names[0].trim()) return 'Please type the name.';
  if (def.names === 0 && !(details.eventName || '').trim()) return 'Please type a name for the event.';
  return '';
}

export function cleanDetails(v: unknown): EventDetails {
  const out: EventDetails = {};
  if (!v || typeof v !== 'object') return out;
  for (const k of DETAIL_KEYS) {
    const raw = (v as Record<string, unknown>)[k];
    if (typeof raw !== 'string') continue;
    const s = raw.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, DETAIL_MAX);
    if (s) out[k] = s;
  }
  if (out.age && !/^\d{1,3}$/.test(out.age)) delete out.age;
  if (out.years && !/^\d{1,3}$/.test(out.years)) delete out.years;
  if (out.classYear) out.classYear = out.classYear.slice(0, 12);
  return out;
}

// ================= photos =================

export const MAX_PHOTOS = 8;
/** One uploaded photo. fx/fy = the focus point (0-1) that crops keep in view. */
export interface PhotoRef { id: string; v: number; fx: number; fy: number; w: number; h: number }

/** Reorders photos and updates focus points; it never adds a photo (uploads do that). */
export function cleanPhotos(v: unknown, known: PhotoRef[]): PhotoRef[] {
  if (!Array.isArray(v)) return known;
  const byId = new Map(known.map((p) => [p.id, p]));
  const out: PhotoRef[] = [];
  const f = (x: unknown, d: number) => { const n = Number(x); return Number.isFinite(n) ? Math.min(1, Math.max(0, Math.round(n * 1000) / 1000)) : d; };
  for (const raw of v as Record<string, unknown>[]) {
    const k = byId.get(String(raw?.id || ''));
    if (!k || out.some((p) => p.id === k.id)) continue;
    out.push({ ...k, fx: f(raw.fx, k.fx), fy: f(raw.fy, k.fy) });
  }
  return out;
}

// ================= "Customize my card" =================

export const EL_IDS = ['art', 'photos', 'intro', 'names', 'sub', 'request', 'byline', 'divider', 'date', 'where', 'message', 'decor'] as const;
export type ElId = (typeof EL_IDS)[number];
/** x/y move the element from where the design puts it (in % of the card's width); s = size */
export interface ElStyle { x?: number; y?: number; s?: number; hide?: boolean; text?: string; color?: string; align?: 'left' | 'center' | 'right'; z?: number }
/** A sticker placed on the card: centre x/y and width in % of the card's width. */
export interface Sticker { id: string; k: string; x: number; y: number; w: number; r?: number; z?: number; c?: string }
export interface CardLayout { els?: Partial<Record<ElId, ElStyle>>; stickers?: Sticker[]; bg?: string; fonts?: string }
export const MAX_STICKERS = 12;
export const TEXT_MIN_SCALE = 0.8;
export const EDITABLE_TEXT: ElId[] = ['intro', 'sub', 'request', 'byline'];

const clampN = (v: unknown, lo: number, hi: number): number | undefined => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, Math.round(n * 100) / 100)) : undefined;
};
const isHex = (v: unknown): v is string => typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v);
const TEXT_ELS: ElId[] = ['intro', 'names', 'sub', 'request', 'byline', 'date', 'where', 'message'];
export const isTextEl = (id: ElId) => TEXT_ELS.includes(id);

/** Keeps only well-formed layout data, with every number inside its safe range. */
export function cleanLayout(v: unknown): CardLayout | null {
  if (!v || typeof v !== 'object') return null;
  const src = v as Record<string, unknown>;
  const out: CardLayout = {};
  const els = src.els && typeof src.els === 'object' ? (src.els as Record<string, Record<string, unknown>>) : {};
  const outEls: Partial<Record<ElId, ElStyle>> = {};
  for (const id of EL_IDS) {
    const e = els[id];
    if (!e || typeof e !== 'object') continue;
    const st: ElStyle = {};
    const x = clampN(e.x, -60, 60); if (x) st.x = x;
    const y = clampN(e.y, -220, 220); if (y) st.y = y;
    const s = clampN(e.s, isTextEl(id) ? TEXT_MIN_SCALE : 0.4, 2.5); if (s !== undefined && s !== 1) st.s = s;
    if (e.hide === true) st.hide = true;
    if (typeof e.text === 'string' && EDITABLE_TEXT.includes(id)) st.text = e.text.replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, 160);
    if (isHex(e.color)) st.color = e.color;
    if (e.align === 'left' || e.align === 'right' || e.align === 'center') st.align = e.align;
    const z = clampN(e.z, -5, 20); if (z) st.z = Math.round(z);
    if (Object.keys(st).length) outEls[id] = st;
  }
  if (Object.keys(outEls).length) out.els = outEls;
  if (Array.isArray(src.stickers)) {
    const list = (src.stickers as Record<string, unknown>[]).slice(0, MAX_STICKERS).flatMap((s) => {
      const k = String(s?.k || '');
      if (!/^[a-z0-9-]{2,24}$/.test(k)) return [];
      const st: Sticker = {
        id: /^[A-Za-z0-9_-]{3,16}$/.test(String(s.id || '')) ? String(s.id) : Math.random().toString(36).slice(2, 9),
        k, x: clampN(s.x, 0, 100) ?? 50, y: clampN(s.y, 0, 260) ?? 20, w: clampN(s.w, 4, 80) ?? 18,
      };
      const r = clampN(s.r, -180, 180); if (r) st.r = r;
      const z = clampN(s.z, -5, 20); if (z) st.z = Math.round(z);
      if (isHex(s.c)) st.c = s.c;
      return [st];
    });
    if (list.length) out.stickers = list;
  }
  if (typeof src.bg === 'string' && /^(photo:[A-Za-z0-9_-]{4,16}|[a-z]{2,16})$/.test(src.bg)) out.bg = src.bg;
  if (typeof src.fonts === 'string' && /^[a-z]{2,16}$/.test(src.fonts)) out.fonts = src.fonts;
  return Object.keys(out).length ? out : null;
}
