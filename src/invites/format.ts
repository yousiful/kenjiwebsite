import { daysBetween, todayIn } from './shared';
import type { ThemeId } from './shared';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty'];
const ORD_ONES = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth'];

export function parts(date: string) {
  const [y, m, d] = date.split('-').map(Number);
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return { y, m, d, weekday: DAYS[dow], month: MONTHS[m - 1], monthShort: MONTHS[m - 1].slice(0, 3) };
}

const words = (n: number) => (n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : ''));
function ordinalWords(n: number) {
  if (n < 20) return ORD_ONES[n];
  if (n % 10 === 0) return TENS[n / 10].replace(/y$/, 'ieth');
  return `${TENS[Math.floor(n / 10)]}-${ORD_ONES[n % 10]}`;
}
const yearWords = (y: number) => (y >= 2000 && y < 2100 ? `two thousand ${y % 100 ? words(y % 100) : ''}`.trim() : String(y));

/** "Saturday, June 12, 2027" */
export function longDate(date: string): string {
  if (!date) return '';
  const p = parts(date);
  return `${p.weekday}, ${p.month} ${p.d}, ${p.y}`;
}
/** "Sat, Jun 12" */
export function shortDate(date: string): string {
  if (!date) return '';
  const p = parts(date);
  return `${p.weekday.slice(0, 3)}, ${p.monthShort} ${p.d}`;
}
/** "Saturday, the twelfth of June" / "two thousand twenty-seven" */
export function formalDate(date: string): { line1: string; line2: string } {
  const p = parts(date);
  return { line1: `${p.weekday}, the ${ordinalWords(p.d)} of ${p.month}`, line2: yearWords(p.y) };
}

/** "4:30 PM" */
export function clockTime(time: string): string {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}
/** "half past four in the afternoon" style, kept simple: "four thirty in the afternoon" */
export function formalTime(time: string): string {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const h12 = h % 12 || 12;
  const mins = m === 0 ? "o'clock" : m < 10 ? `oh ${words(m)}` : words(m);
  const part = h < 12 ? 'in the morning' : h < 17 ? 'in the afternoon' : 'in the evening';
  return `${words(h12)} ${mins} ${part}`.replace(/^./, (c) => c.toUpperCase());
}

export function daysToGo(date: string, timezone: string): number | null {
  if (!date) return null;
  return daysBetween(todayIn(timezone), date);
}

export function countdownText(date: string, timezone: string): string {
  const n = daysToGo(date, timezone);
  if (n === null) return '';
  if (n > 1) return `${n.toLocaleString()} days to go`;
  if (n === 1) return 'Tomorrow is the day';
  if (n === 0) return 'Today is the day';
  return 'Thank you for celebrating with us';
}

export const isIOSDevice = () =>
  typeof navigator !== 'undefined' && (/iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
export const isAndroidDevice = () => typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

/** Apple Maps on iPhone/iPad, Google Maps everywhere else. */
export const mapsUrl = (venue: string, address: string) => {
  const q = encodeURIComponent([venue, address].filter(Boolean).join(', '));
  return isIOSDevice() ? `https://maps.apple.com/?q=${q}` : `https://www.google.com/maps/search/?api=1&query=${q}`;
};

export function browserTimezone(): string {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York'; } catch { return 'America/New_York'; }
}

// ---------- fonts (loaded only on the guest page, the wizard preview and the landing previews) ----------
const FAMILIES: Record<string, string> = {
  cormorant: 'Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500',
  pinyon: 'Pinyon+Script',
  greatvibes: 'Great+Vibes',
  lora: 'Lora:ital,wght@0,400;0,500;0,600;1,400',
  playfair: 'Playfair+Display:ital,wght@0,400;0,500;1,400',
  montserrat: 'Montserrat:wght@400;500;600',
  parisienne: 'Parisienne',
  cinzel: 'Cinzel:wght@400;500;600',
  alexbrush: 'Alex+Brush',
  josefin: 'Josefin+Sans:wght@400;600',
  cinzeldeco: 'Cinzel+Decorative:wght@400;700',
  poiret: 'Poiret+One',
  dancing: 'Dancing+Script:wght@500;700',
  quicksand: 'Quicksand:wght@500;600',
  abril: 'Abril+Fatface',
  bodoni: 'Bodoni+Moda:ital,wght@0,500;0,600;1,500',
};
export const THEME_FONTS: Record<ThemeId, string[]> = {
  ivory: ['cormorant', 'pinyon'],
  garden: ['greatvibes', 'lora'],
  minimal: ['playfair', 'montserrat'],
  blush: ['parisienne', 'cormorant'],
  midnight: ['cinzel', 'playfair', 'cormorant'],
  kraft: ['alexbrush', 'josefin', 'lora'],
  boho: ['cormorant', 'josefin'],
  emerald: ['pinyon', 'cinzel', 'cormorant'],
  waxseal: ['pinyon', 'cormorant'],
  blacktie: ['pinyon', 'cinzel', 'cormorant'],
  vellum: ['parisienne', 'cormorant'],
  tile: ['greatvibes', 'playfair', 'cormorant'],
  deco: ['cinzeldeco', 'poiret', 'cormorant'],
  couple: ['pinyon', 'cormorant'],
  chapel: ['pinyon', 'cinzel', 'cormorant'],
  arbor: ['greatvibes', 'lora'],
  beach: ['parisienne', 'cormorant', 'josefin'],
  barn: ['alexbrush', 'josefin', 'lora'],
  passport: ['playfair', 'montserrat', 'greatvibes'],
  city: ['playfair', 'montserrat', 'parisienne'],
  renewal: ['pinyon', 'cormorant'],
  balloons: ['dancing', 'quicksand'],
  cake: ['abril', 'montserrat', 'lora'],
  confetti: ['abril', 'montserrat'],
  neon: ['dancing', 'montserrat'],
  gradcap: ['playfair', 'cinzel', 'cormorant'],
  nursery: ['greatvibes', 'quicksand'],
  ring: ['pinyon', 'cormorant'],
  crown: ['greatvibes', 'cinzel', 'cormorant'],
  mitzvah: ['cinzel', 'cormorant'],
  sunset: ['dancing', 'josefin', 'lora'],
  house: ['alexbrush', 'josefin', 'lora'],
  winter: ['pinyon', 'cinzel', 'cormorant'],
  cheers: ['greatvibes', 'cinzel', 'cormorant'],
  launch: ['bodoni', 'montserrat'],
  polaroid: ['dancing', 'josefin', 'lora'],
};

/** Google Fonts stylesheet URL for a set of font keys. */
export const fontCssUrl = (keys: string[]) => `https://fonts.googleapis.com/css2?${keys.filter((k) => FAMILIES[k]).map((k) => `family=${FAMILIES[k]}`).join('&')}&display=swap`;

const loaded = new Map<string, Promise<void>>();
export function loadFonts(keys: string[]): Promise<void> {
  if (typeof document === 'undefined') return Promise.resolve();
  const need = keys.filter((k) => FAMILIES[k] && !loaded.has(k));
  if (need.length) {
    if (!document.querySelector('link[data-kv-preconnect]')) {
      for (const href of ['https://fonts.googleapis.com', 'https://fonts.gstatic.com']) {
        const pc = document.createElement('link');
        pc.rel = 'preconnect';
        pc.href = href;
        if (href.includes('gstatic')) pc.crossOrigin = 'anonymous';
        pc.setAttribute('data-kv-preconnect', '');
        document.head.appendChild(pc);
      }
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontCssUrl(need);
    const css = new Promise<void>((res) => { link.onload = () => res(); link.onerror = () => res(); });
    document.head.appendChild(link);
    // the stylesheet only declares the fonts; ask for each family so the files actually load
    const fam = (k: string) => decodeURIComponent(FAMILIES[k].split(':')[0].replace(/\+/g, ' '));
    need.forEach((k) => loaded.set(k, css.then(() => document.fonts.load(`1em "${fam(k)}"`)).then(() => undefined, () => undefined)));
  }
  return Promise.all(keys.filter((k) => loaded.has(k)).map((k) => loaded.get(k))).then(() => undefined);
}
export const loadThemeFonts = (themes: ThemeId[], extra: string[] = []) => loadFonts([...new Set([...themes.flatMap((t) => THEME_FONTS[t] || []), ...extra])]);
