import { memo, useId, type CSSProperties, type ReactNode } from 'react';
import {
  eventWording, typeOf, isTextEl,
  type CardLayout, type ElId, type EventDetails, type EventType, type Figures, type ThemeId,
} from './shared';
import { formalDate, formalTime, longDate, clockTime, parts } from './format';
import {
  FoilDefs, Flourish, CornerFiligree, FloralCluster, Eucalyptus, BohoArches, DecoCorner, MonogramFrame, Stars,
  GARDEN_PALETTE, BLUSH_PALETTE, ROSE_GOLD_STOPS,
} from './ornaments';
import { DECKLE, WaxSeal, PressedFlowers, TileBand, Constellation, TwineBow, DecoSunburst } from './ornaments2';
import { CoupleIllustration, ChapelWindow, Bells, Arbor, BeachTop, BeachBottom, BarnScene, CityHall, Rings, Plane } from './ornaments3';
import {
  Balloons, Cake, ConfettiField, NeonSpark, GradCap, Laurel, Nursery, DiamondRing, Tiara, StarOfDavid, SunsetBand, House,
  PineCorner, Snowflake, Champagne, LaunchShapes, PolaroidStack,
} from './ornaments4';
import { StickerArt } from './stickers';
import './card.css';

export interface CardPhoto { id: string; src: string; full: string; fx: number; fy: number }

export interface CardData {
  coupleNames: [string, string];
  date: string;
  time: string;
  venueName: string;
  address: string;
  personalMessage: string;
  theme: ThemeId;
  accent?: string;
  /** one photo (events from before multi-photo, and simple previews) */
  photoUrl?: string;
  /** every photo, main first; wins over photoUrl */
  photos?: CardPhoto[];
  photoLayout?: number;
  figures?: Figures;
  showCross?: boolean;
  /** when set, the venue and address on the card open this maps link */
  mapHref?: string;
  type?: EventType;
  details?: EventDetails;
  layout?: CardLayout | null;
}

type DateStyle = 'formal' | 'columns' | 'numeric' | 'plain';
interface ThemeDef { name: string; intro: string; request: string; dateStyle: DateStyle; swatch: [string, string]; amp: string; deckle?: boolean; foil?: boolean }

const PARTY_INTRO = "You're invited";
export const THEMES: Record<ThemeId, ThemeDef> = {
  ivory: { name: 'Classic Ivory & Gold', intro: 'Together with their families', request: 'request the honour of your presence at the celebration of their marriage', dateStyle: 'formal', swatch: ['#fbf6ea', '#b8913f'], amp: 'and', foil: true },
  garden: { name: 'Garden Watercolor Florals', intro: 'Please join us for the wedding of', request: '', dateStyle: 'plain', swatch: ['#fffdf9', '#e59a9c'], amp: '&', deckle: true },
  minimal: { name: 'Modern Minimal', intro: 'We are getting married', request: '', dateStyle: 'numeric', swatch: ['#ffffff', '#111111'], amp: '&' },
  blush: { name: 'Romantic Blush Script', intro: 'With joy in their hearts', request: 'invite you to celebrate their wedding', dateStyle: 'plain', swatch: ['#f7e6e1', '#b9786a'], amp: '&', deckle: true, foil: true },
  midnight: { name: 'Midnight Navy & Gold', intro: 'The pleasure of your company is requested at the marriage of', request: '', dateStyle: 'columns', swatch: ['#101c36', '#d8b866'], amp: '&', foil: true },
  kraft: { name: 'Rustic Greenery Kraft', intro: 'Together with their families', request: 'invite you to celebrate their wedding', dateStyle: 'columns', swatch: ['#c9a77c', '#56705f'], amp: '&', deckle: true },
  boho: { name: 'Boho Terracotta Arches', intro: 'Join us to celebrate the wedding of', request: '', dateStyle: 'columns', swatch: ['#f3e5d3', '#c8693f'], amp: '&' },
  emerald: { name: 'Elegant Emerald', intro: 'Together with their families', request: 'request the honour of your presence at their wedding', dateStyle: 'formal', swatch: ['#0f3a2e', '#d8b866'], amp: 'and', foil: true },
  waxseal: { name: 'Wax Seal Monogram', intro: 'Together with their families', request: 'request the pleasure of your company at their wedding', dateStyle: 'formal', swatch: ['#f6f0e3', '#7d1f2a'], amp: 'and', deckle: true },
  blacktie: { name: 'Black Tie Engraved', intro: 'The honour of your presence is requested at the marriage of', request: '', dateStyle: 'formal', swatch: ['#fbfaf6', '#111111'], amp: 'and' },
  vellum: { name: 'Vellum & Pressed Flowers', intro: 'Please join us to celebrate the marriage of', request: '', dateStyle: 'plain', swatch: ['#fbfaf5', '#9a8bbb'], amp: '&', deckle: true },
  tile: { name: 'Mediterranean Tile', intro: 'Together with their families', request: 'invite you to celebrate their wedding', dateStyle: 'columns', swatch: ['#fbf8f1', '#1f3f8f'], amp: '&' },
  deco: { name: 'Art Deco Gilded', intro: 'You are cordially invited to the wedding of', request: '', dateStyle: 'columns', swatch: ['#121212', '#d8b866'], amp: '&', foil: true },
  couple: { name: 'Bride & Groom', intro: 'Together with their families', request: 'invite you to celebrate their wedding', dateStyle: 'plain', swatch: ['#fbf7f0', '#2b2a33'], amp: '&' },
  chapel: { name: 'Church & Chapel', intro: 'Together with their families', request: 'request the honour of your presence at the celebration of their marriage', dateStyle: 'formal', swatch: ['#fbf6ea', '#8e2b3c'], amp: 'and', foil: true },
  arbor: { name: 'Garden Ceremony', intro: 'Please join us in the garden for the wedding of', request: '', dateStyle: 'plain', swatch: ['#fbf8f0', '#6f8a6c'], amp: '&', deckle: true },
  beach: { name: 'Beach Wedding', intro: 'Join us by the sea for the wedding of', request: '', dateStyle: 'plain', swatch: ['#fdf6ee', '#5fa2a9'], amp: '&' },
  barn: { name: 'Rustic Barn', intro: 'Together with their families', request: 'invite you to celebrate their wedding in the country', dateStyle: 'columns', swatch: ['#efe4d2', '#7a3b2e'], amp: '&', deckle: true },
  passport: { name: 'Destination Boarding Pass', intro: 'Boarding pass to the wedding of', request: '', dateStyle: 'plain', swatch: ['#f6f1e6', '#1f2f57'], amp: '&' },
  city: { name: 'City Hall Elopement', intro: 'Join us in the city to celebrate the wedding of', request: '', dateStyle: 'numeric', swatch: ['#f6ede8', '#3a3a3d'], amp: '&' },
  renewal: { name: 'Vow Renewal', intro: 'Please join us for the vow renewal of', request: '', dateStyle: 'formal', swatch: ['#faf5ec', '#b8913f'], amp: 'and', foil: true },
  // every other kind of celebration
  balloons: { name: 'Balloon Bouquet', intro: PARTY_INTRO, request: '', dateStyle: 'plain', swatch: ['#fff9f2', '#f08a76'], amp: '&' },
  cake: { name: 'Birthday Cake', intro: PARTY_INTRO, request: '', dateStyle: 'columns', swatch: ['#fdf0ee', '#c2546a'], amp: '&' },
  confetti: { name: 'Confetti Pop', intro: PARTY_INTRO, request: '', dateStyle: 'numeric', swatch: ['#ffffff', '#f08a76'], amp: '&' },
  neon: { name: 'Neon Night', intro: PARTY_INTRO, request: '', dateStyle: 'plain', swatch: ['#1a1430', '#ff5fc8'], amp: '&' },
  gradcap: { name: 'Cap & Diploma', intro: PARTY_INTRO, request: '', dateStyle: 'columns', swatch: ['#14213d', '#d8b866'], amp: '&', foil: true },
  nursery: { name: 'Moon & Clouds', intro: PARTY_INTRO, request: '', dateStyle: 'plain', swatch: ['#eef4f6', '#7fa7c9'], amp: '&' },
  ring: { name: 'Diamond Ring', intro: PARTY_INTRO, request: '', dateStyle: 'formal', swatch: ['#fbf1ec', '#b8913f'], amp: '&', foil: true },
  crown: { name: 'Tiara & Roses', intro: PARTY_INTRO, request: '', dateStyle: 'plain', swatch: ['#fbeef0', '#c27a8a'], amp: '&', foil: true },
  mitzvah: { name: 'Star of David', intro: PARTY_INTRO, request: '', dateStyle: 'columns', swatch: ['#16244a', '#c0c8d8'], amp: '&', foil: true },
  sunset: { name: 'Sunset Horizon', intro: PARTY_INTRO, request: '', dateStyle: 'plain', swatch: ['#fdf5ec', '#e08a62'], amp: '&' },
  house: { name: 'Home Sweet Home', intro: PARTY_INTRO, request: '', dateStyle: 'plain', swatch: ['#fbf7f0', '#c06a45'], amp: '&', deckle: true },
  winter: { name: 'Evergreen & Gold', intro: PARTY_INTRO, request: '', dateStyle: 'formal', swatch: ['#123828', '#d8b866'], amp: '&', foil: true },
  cheers: { name: 'Champagne Toast', intro: PARTY_INTRO, request: '', dateStyle: 'formal', swatch: ['#f8f0e2', '#b8913f'], amp: '&', foil: true },
  launch: { name: 'Modern Launch', intro: PARTY_INTRO, request: '', dateStyle: 'numeric', swatch: ['#ffffff', '#14254f'], amp: '&' },
  polaroid: { name: 'Snapshots', intro: PARTY_INTRO, request: '', dateStyle: 'plain', swatch: ['#f2efe9', '#3d3a35'], amp: '&' },
};

/** "What kind of wedding?" groups for the design step. First design in each list is the picture tile. */
export const OCCASIONS: { id: string; name: string; hint: string; themes: ThemeId[] }[] = [
  { id: 'couple', name: 'Bride & Groom', hint: 'An illustrated couple: bride and groom, two brides or two grooms', themes: ['couple'] },
  { id: 'church', name: 'Church or chapel', hint: 'Stained glass, bells, and a cross only if you want one', themes: ['chapel', 'ivory', 'waxseal'] },
  { id: 'garden', name: 'Garden or outdoors', hint: 'Flowers, greenery and a floral arch', themes: ['arbor', 'garden', 'vellum', 'blush'] },
  { id: 'beach', name: 'Beach', hint: 'Sunset, sea and shells', themes: ['beach', 'tile'] },
  { id: 'barn', name: 'Rustic barn', hint: 'Barn, string lights, kraft paper', themes: ['barn', 'kraft', 'boho'] },
  { id: 'destination', name: 'Destination', hint: 'A boarding pass to your wedding', themes: ['passport', 'tile', 'midnight'] },
  { id: 'city', name: 'City hall or elopement', hint: 'City skyline and courthouse steps', themes: ['city', 'minimal', 'deco'] },
  { id: 'renewal', name: 'Vow renewal', hint: 'Golden rings for a love that lasts', themes: ['renewal', 'ivory', 'emerald'] },
  { id: 'classic', name: 'Classic and elegant', hint: 'Timeless stationery: gold foil, wax seals, black tie', themes: ['ivory', 'waxseal', 'blacktie', 'emerald', 'midnight', 'deco', 'minimal', 'vellum', 'garden', 'blush', 'tile', 'kraft', 'boho'] },
];
export const occasionOf = (t: ThemeId) => (OCCASIONS.find((o) => o.themes[0] === t) || OCCASIONS.find((o) => o.themes.includes(t)) || OCCASIONS[OCCASIONS.length - 1]).id;

/** The designs offered for each kind of celebration; the first is the default. */
export const DESIGNS_FOR: Record<EventType, ThemeId[]> = {
  wedding: ['ivory', 'couple', 'chapel', 'arbor', 'beach', 'barn', 'passport', 'city', 'renewal', 'waxseal', 'blacktie', 'emerald', 'midnight', 'deco', 'minimal', 'vellum', 'garden', 'blush', 'tile', 'kraft', 'boho'],
  birthday: ['balloons', 'cake', 'confetti', 'neon', 'cheers', 'deco', 'minimal'],
  graduation: ['gradcap', 'confetti', 'midnight', 'minimal', 'emerald'],
  baby: ['nursery', 'balloons', 'garden', 'vellum', 'blush'],
  bridal: ['blush', 'ring', 'garden', 'vellum', 'cheers'],
  engagement: ['ring', 'cheers', 'blush', 'midnight', 'minimal', 'deco'],
  anniversary: ['renewal', 'cheers', 'ivory', 'emerald', 'deco'],
  quince: ['crown', 'balloons', 'neon', 'blush', 'deco'],
  mitzvah: ['mitzvah', 'midnight', 'deco', 'confetti', 'minimal'],
  retirement: ['sunset', 'cheers', 'confetti', 'emerald', 'minimal'],
  housewarming: ['house', 'kraft', 'boho', 'garden', 'minimal'],
  holiday: ['winter', 'cheers', 'midnight', 'emerald', 'deco'],
  business: ['launch', 'blacktie', 'minimal', 'deco', 'cheers', 'neon'],
  reunion: ['polaroid', 'sunset', 'confetti', 'kraft', 'neon'],
  custom: ['confetti', 'cheers', 'minimal', 'garden', 'balloons', 'sunset', 'neon', 'midnight', 'deco', 'ivory'],
};
export const defaultTheme = (type: EventType): ThemeId => DESIGNS_FOR[type][0];

export const ACCENTS = [
  { name: 'Gold', value: '#a8822f' },
  { name: 'Rose', value: '#b4626a' },
  { name: 'Sage', value: '#5f7d65' },
  { name: 'Navy', value: '#22365e' },
  { name: 'Burgundy', value: '#7a2638' },
  { name: 'Terracotta', value: '#b5552f' },
  { name: 'Plum', value: '#6a3d6e' },
  { name: 'Charcoal', value: '#2f2f33' },
];

/** Font pairings a host can pick in "Customize my card" (keys are format.ts font keys). */
export const PAIRINGS: Record<string, { name: string; keys: string[]; script: string; serif: string; caps: string }> = {
  classic: { name: 'Classic script', keys: ['pinyon', 'cormorant'], script: "'Pinyon Script', cursive", serif: "'Cormorant Garamond', serif", caps: "'Cormorant Garamond', serif" },
  romantic: { name: 'Romantic', keys: ['greatvibes', 'lora'], script: "'Great Vibes', cursive", serif: "'Lora', serif", caps: "'Lora', serif" },
  elegant: { name: 'Engraved capitals', keys: ['cinzel', 'cormorant'], script: "'Cinzel', serif", serif: "'Cormorant Garamond', serif", caps: "'Cinzel', serif" },
  modern: { name: 'Modern', keys: ['playfair', 'montserrat'], script: "'Playfair Display', serif", serif: "'Playfair Display', serif", caps: "'Montserrat', sans-serif" },
  playful: { name: 'Playful', keys: ['dancing', 'quicksand'], script: "'Dancing Script', cursive", serif: "'Quicksand', sans-serif", caps: "'Quicksand', sans-serif" },
  bold: { name: 'Bold', keys: ['abril', 'lora', 'montserrat'], script: "'Abril Fatface', serif", serif: "'Lora', serif", caps: "'Montserrat', sans-serif" },
  deco: { name: 'Art deco', keys: ['cinzeldeco', 'poiret', 'cormorant'], script: "'Cinzel Decorative', serif", serif: "'Cormorant Garamond', serif", caps: "'Poiret One', sans-serif" },
};
const PLAYFUL_THEMES: ThemeId[] = ['balloons', 'cake', 'confetti', 'neon', 'nursery', 'polaroid', 'house', 'sunset'];
const SLEEK_THEMES: ThemeId[] = ['deco', 'midnight', 'launch', 'minimal', 'city', 'blacktie', 'gradcap', 'mitzvah'];
/** Four pairings that suit a design. */
export function pairingsFor(theme: ThemeId): string[] {
  if (PLAYFUL_THEMES.includes(theme)) return ['playful', 'bold', 'modern', 'romantic'];
  if (SLEEK_THEMES.includes(theme)) return ['modern', 'elegant', 'deco', 'bold'];
  return ['classic', 'romantic', 'elegant', 'modern'];
}

/** Curated backgrounds for "Customize my card". `dark` switches the ink to light. */
export const BACKGROUNDS: Record<string, { name: string; css: string; dark?: boolean }> = {
  cream: { name: 'Warm cream', css: 'radial-gradient(120% 90% at 50% 38%, #fffcf4 0%, #f3ead6 100%)' },
  white: { name: 'Bright white', css: 'radial-gradient(120% 90% at 50% 40%, #ffffff 0%, #f6f5f1 100%)' },
  blush: { name: 'Soft blush', css: 'radial-gradient(110% 80% at 50% 40%, #fdf3ef 0%, #f2d8d1 100%)' },
  sage: { name: 'Sage green', css: 'radial-gradient(110% 80% at 50% 40%, #f5f8f1 0%, #dfe8d8 100%)' },
  sky: { name: 'Sky blue', css: 'radial-gradient(110% 80% at 50% 40%, #f4f9fc 0%, #d9e8f1 100%)' },
  lilac: { name: 'Lilac', css: 'radial-gradient(110% 80% at 50% 40%, #f8f5fc 0%, #e4dcf0 100%)' },
  navy: { name: 'Midnight navy', css: 'radial-gradient(110% 80% at 50% 35%, #1d3056 0%, #101c36 60%, #0a1328 100%)', dark: true },
  forest: { name: 'Deep green', css: 'radial-gradient(110% 80% at 50% 32%, #1c5947 0%, #0f3a2e 58%, #0a2a21 100%)', dark: true },
  black: { name: 'Black lacquer', css: 'radial-gradient(120% 80% at 50% 30%, #1d1b18 0%, #121110 60%, #0a0a09 100%)', dark: true },
};

function nameScale(n: string): number {
  const len = n.length;
  if (len <= 7) return 1;
  if (len <= 10) return 0.9;
  if (len <= 14) return 0.8;
  if (len <= 20) return 0.7;
  if (len <= 26) return 0.62;
  return 0.54;
}

type ElProps = { 'data-el'?: string; style?: CSSProperties; className?: string };

function DateBlock({ style, date, time, el }: { style: DateStyle; date: string; time: string; el: ElProps }) {
  const cls = (c: string) => [c, el.className].filter(Boolean).join(' ');
  if (!date) return <p data-el={el['data-el']} style={el.style} className={cls('kc-date kc-date--plain')}>Date to come</p>;
  const p = parts(date);
  if (style === 'formal') {
    const f = formalDate(date);
    return (
      <div data-el={el['data-el']} style={el.style} className={cls('kc-date kc-date--formal')}>
        <p>{f.line1}</p>
        <p>{f.line2}</p>
        {time && <p className="kc-time">{formalTime(time).replace(/^./, (c) => c.toLowerCase()).replace(/^/, 'at ')}</p>}
      </div>
    );
  }
  if (style === 'columns') {
    return (
      <div data-el={el['data-el']} style={el.style} className={cls('kc-date kc-date--columns')}>
        <p className="kc-month">{p.month}</p>
        <div className="kc-cols">
          <span className="kc-col">{p.weekday}</span>
          <span className="kc-day">{p.d}</span>
          <span className="kc-col">{time ? clockTime(time) : p.y}</span>
        </div>
        <p className="kc-year">{p.y}</p>
      </div>
    );
  }
  if (style === 'numeric') {
    return (
      <div data-el={el['data-el']} style={el.style} className={cls('kc-date kc-date--numeric')}>
        <p className="kc-num">
          {String(p.m).padStart(2, '0')}<span className="kc-dot" aria-hidden="true" />{String(p.d).padStart(2, '0')}<span className="kc-dot" aria-hidden="true" />{String(p.y).slice(2)}
        </p>
        <p className="kc-small">{p.weekday}, {p.month} {p.d}, {p.y}</p>
        {time && <p className="kc-small">{clockTime(time)}</p>}
      </div>
    );
  }
  return (
    <div data-el={el['data-el']} style={el.style} className={cls('kc-date kc-date--plain')}>
      <p>{longDate(date)}</p>
      {time && <p className="kc-time">at {clockTime(time)}</p>}
    </div>
  );
}

const Pin = () => (
  <svg className="kc-pin" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-5.8-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.2-6.5 11-6.5 11z M12 12.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8z" fill="currentColor" fillRule="evenodd" /></svg>
);

const initial = (s: string, d: string) => (s.trim().replace(/^the\s+/i, '') || d).charAt(0).toUpperCase();

/** Destination design: the invitation laid out as a premium boarding pass. */
function BoardingPass({ data, a, b, t, photo }: { data: CardData; a: string; b: string; t: ThemeDef; photo: CardPhoto | null }) {
  const p = data.date ? parts(data.date) : null;
  const code = (s: string) => (s.replace(/[^A-Za-z]/g, '').slice(0, 3) || 'LUV').toUpperCase();
  return (
    <div className="kc-body kc-bp">
      <div className="kc-bp-head">
        <Plane className="kc-bp-plane" />
        <span>Boarding pass</span>
        <span className="kc-bp-class">First class</span>
      </div>
      <div className="kc-bp-route" aria-hidden="true">
        <span>{code(a)}</span><i /><Plane className="kc-bp-plane2" /><i /><span>{code(b)}</span>
      </div>
      {photo && (
        <figure className="kc-photo" data-el="photos">
          <img src={photo.src} alt={`${a} and ${b}`} loading="eager" decoding="async" style={photo.id === 'legacy' ? undefined : { objectPosition: `${photo.fx * 100}% ${photo.fy * 100}%` }} />
        </figure>
      )}
      <p className="kc-intro" data-el="intro">{t.intro}</p>
      <h1 className="kc-names" data-el="names">
        <span className="kc-name">{a || 'Your name'}</span>
        <span className="kc-amp">{t.amp}</span>
        <span className="kc-name">{b || 'Their name'}</span>
      </h1>
      <dl className="kc-bp-grid">
        <div><dt>Date</dt><dd>{p ? `${p.monthShort} ${p.d}, ${p.y}` : 'To come'}</dd></div>
        <div><dt>Boarding</dt><dd>{data.time ? clockTime(data.time) : 'To come'}</dd></div>
        <div className="kc-bp-wide"><dt>Destination</dt><dd>{data.venueName || 'To come'}</dd></div>
        {data.address && <div className="kc-bp-wide"><dt>Address</dt><dd>{data.mapHref ? <a className="kc-maplink" href={data.mapHref} target="_blank" rel="noopener noreferrer" data-testid="card-map"><Pin />{data.address}</a> : data.address}</dd></div>}
        {p && <div><dt>Day</dt><dd>{p.weekday}</dd></div>}
        <div><dt>Seat</dt><dd>With us</dd></div>
      </dl>
      {data.personalMessage && <p className="kc-message" data-el="message">{data.personalMessage}</p>}
      <div className="kc-bp-stub" aria-hidden="true">
        <div className="kc-bp-barcode">{Array.from({ length: 34 }, (_, i) => <i key={i} style={{ width: `${[1, 2, 1, 3, 1, 2][i % 6] * 0.42}cqi` }} />)}</div>
        <span>Admit with love</span>
      </div>
    </div>
  );
}

// ---------- photo arrangements: [columns, rows, areas] per photo count, several each ----------
type Arr = [string, string, string[]];
export const PHOTO_LAYOUTS: Record<number, Arr[]> = {
  2: [['1fr 1fr', '46cqi', ['a b']], ['1.7fr 1fr', '40cqi', ['a b']], ['1fr', '32cqi 32cqi', ['a', 'b']]],
  3: [['1.4fr 1fr', '23cqi 23cqi', ['a b', 'a c']], ['1fr 1fr', '36cqi 24cqi', ['a a', 'b c']], ['1fr 1.3fr 1fr', '40cqi', ['b a c']]],
  4: [['1fr 1fr', '30cqi 30cqi', ['a b', 'c d']], ['1fr 1fr 1fr', '38cqi 21cqi', ['a a a', 'b c d']], ['1.6fr 1fr', '16cqi 16cqi 16cqi', ['a b', 'a c', 'a d']]],
  5: [['1fr 1fr 1fr', '19cqi 19cqi 22cqi', ['a a b', 'a a c', 'd e e']], ['1fr 1fr', '34cqi 21cqi 21cqi', ['a a', 'b c', 'd e']], ['1fr 1fr 1fr 1fr', '36cqi 20cqi', ['a a a a', 'b c d e']]],
  6: [['1fr 1fr 1fr', '19cqi 19cqi 22cqi', ['a a b', 'a a c', 'd e f']], ['1fr 1fr 1fr', '25cqi 25cqi', ['a b c', 'd e f']], ['1fr 1fr 1fr 1fr 1fr', '34cqi 15cqi', ['a a a a a', 'b c d e f']]],
  7: [['1fr 1fr 1fr 1fr', '17cqi 17cqi 19cqi', ['a a b c', 'a a d e', 'f f g g']], ['1fr 1fr 1fr', '30cqi 19cqi 19cqi', ['a a a', 'b c d', 'e f g']]],
  8: [['1fr 1fr 1fr 1fr', '17cqi 17cqi 19cqi', ['a a b c', 'a a d e', 'f g h h']], ['1fr 1fr 1fr', '30cqi 19cqi 19cqi', ['a a b', 'c d e', 'f g h']]],
};
export const layoutCount = (n: number) => (PHOTO_LAYOUTS[Math.min(8, n)] || []).length;

function Collage({ photos, variant, alt, el }: { photos: CardPhoto[]; variant: number; alt: string; el: ElProps }) {
  const list = photos.slice(0, 8);
  const opts = PHOTO_LAYOUTS[list.length];
  const v = variant % opts.length;
  const [cols, rows, areas] = opts[v];
  return (
    <div
      data-el={el['data-el']}
      className={['kc-collage', el.className].filter(Boolean).join(' ')}
      data-n={list.length}
      data-v={v}
      style={{ ...el.style, gridTemplateColumns: cols, gridTemplateRows: rows, gridTemplateAreas: areas.map((a) => `"${a}"`).join(' ') }}
    >
      {list.map((p, i) => (
        <figure key={p.id} className={`kc-ph${i === 0 ? ' kc-ph--main' : ''}`} style={{ gridArea: 'abcdefgh'[i] }}>
          <img src={p.src} alt={i === 0 ? alt : ''} loading="eager" decoding="async" style={{ objectPosition: `${p.fx * 100}% ${p.fy * 100}%` }} />
        </figure>
      ))}
    </div>
  );
}

/** The design's in-card illustration (null for designs without one). */
function artFor(theme: ThemeId, gid: string, data: CardData, hasPhoto: boolean, ia: string, ib: string): ReactNode {
  switch (theme) {
    case 'midnight': return <Constellation gid={gid} className="kc-constellation" />;
    case 'couple': return <CoupleIllustration figures={data.figures || 'bride-groom'} className="kc-couple" />;
    case 'chapel': return <ChapelWindow gid={gid} showCross={!!data.showCross} className="kc-chapel" />;
    case 'barn': return <BarnScene className="kc-barn" />;
    case 'city': return <CityHall gid={gid} className="kc-city" />;
    case 'renewal': return <Rings gid={gid} className="kc-rings" />;
    case 'deco': return <DecoSunburst gid={gid} className="kc-sunburst" />;
    case 'waxseal': return hasPhoto ? null : <WaxSeal gid={`${gid}w`} a={ia} b={ib} className="kc-seal" />;
    case 'emerald': case 'blacktie': return hasPhoto ? null : <MonogramFrame gid={gid} a={ia} b={ib} className="kc-monogram" />;
    case 'balloons': return <Balloons gid={gid} className="kc-art kc-balloons" />;
    case 'cake': return <Cake gid={gid} className="kc-art kc-cake" />;
    case 'neon': return <NeonSpark className="kc-art kc-neonspark" />;
    case 'gradcap': return <GradCap gid={gid} className="kc-art kc-gradcap" />;
    case 'nursery': return <Nursery gid={gid} className="kc-art kc-nursery" />;
    case 'ring': return <DiamondRing gid={gid} className="kc-art kc-ring" />;
    case 'crown': return <Tiara gid={gid} className="kc-art kc-tiara" />;
    case 'mitzvah': return <StarOfDavid gid={gid} className="kc-art kc-star" />;
    case 'house': return <House className="kc-art kc-house" />;
    case 'cheers': return <Champagne gid={gid} className="kc-art kc-champagne" />;
    case 'polaroid': return hasPhoto ? null : <PolaroidStack className="kc-art kc-polaroids" />;
    default: return null;
  }
}

/** The design's divider between the names and the date. */
function dividerFor(theme: ThemeId, gid: string): ReactNode {
  if (['ivory', 'emerald', 'blush', 'waxseal', 'chapel', 'renewal', 'ring', 'crown', 'winter', 'cheers'].includes(theme)) return <Flourish gid={gid} className="kc-flourish" />;
  if (['garden', 'vellum', 'blacktie', 'couple', 'arbor', 'beach', 'nursery', 'mitzvah', 'house', 'sunset', 'polaroid', 'balloons'].includes(theme)) return <div className="kc-rule" aria-hidden="true" />;
  if (theme === 'gradcap') return <Laurel gid={gid} className="kc-laurel" />;
  return null;
}

/**
 * One invitation card, built to read like a photographed piece of stationery.
 * All sizes are container units, so the same card renders as a thumbnail, the live
 * preview or the full guest invitation. `minText` floors body text (18px for guests).
 * `editable` marks every element so "Customize my card" can select and move it.
 */
function InvitationCardInner({ data, minText = 0, className = '', editable = false }: { data: CardData; minText?: number; className?: string; editable?: boolean }) {
  const raw = useId();
  const gid = 'kc' + raw.replace(/[^a-zA-Z0-9]/g, '');
  const theme: ThemeId = THEMES[data.theme] ? data.theme : 'ivory';
  const t = THEMES[theme];
  const type = typeOf(data);
  const wedding = type === 'wedding';
  const w = eventWording(data);
  const [a, b] = data.coupleNames;
  const L = data.layout || null;
  const els = L?.els || {};
  const shown = (id: ElId) => !els[id]?.hide;
  const photos: CardPhoto[] = data.photos && data.photos.length ? data.photos : data.photoUrl ? [{ id: 'legacy', src: data.photoUrl, full: data.photoUrl, fx: 0.5, fy: 0.5 }] : [];
  const hasPhoto = photos.length > 0 && shown('photos');
  // the big line(s): weddings show both names; other events their honoree(s) or the event's name
  const heads = wedding ? [a || 'Your name', b || 'Their name'] : w.heads.map((h, i) => h || (i === 0 ? (w.title || 'Your celebration') : '')).filter(Boolean);
  const ia = initial(heads[0] || '', 'A');
  const ib = heads[1] ? initial(heads[1], 'B') : '';
  const scale = Math.min(...heads.map(nameScale));
  const bg = L?.bg ? (L.bg.startsWith('photo:') ? null : BACKGROUNDS[L.bg] || null) : null;
  const bgPhoto = L?.bg?.startsWith('photo:') ? photos.find((p) => `photo:${p.id}` === L.bg) || null : null;
  const pair = L?.fonts ? PAIRINGS[L.fonts] : null;
  const style = {
    '--kc-min': `${minText}px`,
    '--kc-nscale': scale,
    ...(data.accent ? { '--kc-accent': data.accent } : {}),
    ...(pair ? { '--kc-script': pair.script, '--kc-serif': pair.serif, '--kc-caps': pair.caps } : {}),
    ...(bg ? (bg.dark ? { '--kc-ink': '#f3ead6', '--kc-soft': '#d8c9a3', '--kc-press': 'none' } : { '--kc-ink': '#3d3126', '--kc-soft': '#6b5a48', '--kc-press': 'none' }) : {}),
  } as CSSProperties;
  const where = [data.venueName, data.address].filter(Boolean);
  const cls = [
    'kc', `kc--${theme}`, `kc-t--${type}`,
    data.accent ? 'kc--accented' : '',
    hasPhoto ? 'kc--photo' : '',
    minText ? 'kc--readable' : '',
    t.deckle ? 'kc--deckle' : '',
    t.foil ? 'kc--foil' : '',
    L ? 'kc--custom' : '',
    bg?.dark ? 'kc--darkbg' : '',
    editable ? 'kc--editable' : '',
    className,
  ].filter(Boolean).join(' ');

  /** Position, size, color, alignment and layer of one element, from the host's edits. */
  const el = (id: ElId, extra = ''): ElProps => {
    const st = els[id];
    const out: ElProps = { 'data-el': id };
    const c = [extra];
    if (st) {
      const s = st.s && st.s !== 1 ? (minText && isTextEl(id) ? Math.max(1, st.s) : st.s) : 0;
      const o: Record<string, string | number> = {};
      // zoom also scales the element's own transform, so the move is divided back out
      if (st.x || st.y) { const k = s || 1; o.transform = `translate(${(st.x || 0) / k}cqi, ${(st.y || 0) / k}cqi)`; }
      if (s) o.zoom = s;
      if (st.color) { o['--el-c'] = st.color; c.push('kc-colored'); }
      if (st.z) { o.zIndex = st.z; o.position = 'relative'; }
      if (st.align && st.align !== 'center') c.push(`kc-al-${st.align}`);
      out.style = o as CSSProperties;
    }
    const k = c.filter(Boolean).join(' ');
    if (k) out.className = k;
    return out;
  };
  /** Illustrations and dividers are wrapped only when they can be (or have been) moved. */
  const wrap = (id: ElId, node: ReactNode) => {
    if (!node || !shown(id)) return null;
    if (!editable && !els[id]) return node;
    const p = el(id, 'kc-el');
    return <div data-el={id} className={p.className} style={p.style}>{node}</div>;
  };

  const introText = els.intro?.text ?? (wedding ? t.intro : w.intro);
  const requestText = els.request?.text ?? (wedding ? t.request : w.request);
  const subText = els.sub?.text ?? w.sub;
  const bylineText = els.byline?.text ?? w.byline;
  const amp = wedding ? t.amp : t.amp === 'and' ? 'and' : w.amp || t.amp;
  const decor = shown('decor');
  const one = photos[0];
  const photoAlt = wedding ? `${a} and ${b}` : `Photo for ${w.title}`;

  const photoNode = !hasPhoto ? null : photos.length === 1 ? (
    <figure {...el('photos', 'kc-photo')}>
      <img src={one.src} alt={photoAlt} loading="eager" decoding="async" style={one.id === 'legacy' ? undefined : { objectPosition: `${one.fx * 100}% ${one.fy * 100}%` }} />
    </figure>
  ) : <Collage photos={photos} variant={data.photoLayout || 0} alt={photoAlt} el={el('photos')} />;

  return (
    <article className={cls} style={style} aria-label={wedding ? `Wedding invitation for ${a} and ${b}` : `Invitation: ${w.title}`}>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        {theme === 'blush' || theme === 'crown' ? <FoilDefs gid={gid} stops={ROSE_GOLD_STOPS} /> : <FoilDefs gid={gid} />}
      </svg>
      {/* deckled cards are clipped, so their shadow is a separate layer (no CSS filter: large
          filtered layers can fail to paint on phone GPUs) */}
      {t.deckle && <div className="kc-shadow" aria-hidden="true" />}
      <div className="kc-paper" style={{ ...(t.deckle ? { clipPath: DECKLE } : {}), ...(bg ? { background: bg.css } : {}) }}>
        {bgPhoto && (
          <div className="kc-bgphoto" aria-hidden="true">
            <img src={bgPhoto.src} alt="" style={{ objectPosition: `${bgPhoto.fx * 100}% ${bgPhoto.fy * 100}%` }} />
            <i />
          </div>
        )}
        <div className="kc-gild" aria-hidden="true" />

        {/* decoration layer */}
        {decor && (
          <>
            {theme === 'ivory' && (
              <>
                <div className="kc-frame" aria-hidden="true" />
                {['tl', 'tr', 'bl', 'br'].map((c) => <CornerFiligree key={c} gid={gid} className={`kc-corner kc-corner--${c}`} />)}
              </>
            )}
            {(theme === 'garden' || theme === 'blush' || theme === 'crown') && (
              <>
                <FloralCluster gid={`${gid}a`} palette={theme === 'garden' ? GARDEN_PALETTE : BLUSH_PALETTE} className="kc-floral kc-floral--tl" />
                <FloralCluster gid={`${gid}b`} variant={1} palette={theme === 'garden' ? GARDEN_PALETTE : BLUSH_PALETTE} className="kc-floral kc-floral--br" />
              </>
            )}
            {theme === 'midnight' && (
              <>
                <Stars className="kc-stars" />
                <div className="kc-frame" aria-hidden="true" />
              </>
            )}
            {theme === 'kraft' && (
              <>
                <Eucalyptus className="kc-euc kc-euc--tl" />
                <Eucalyptus className="kc-euc kc-euc--br" />
                <div className="kc-twine" aria-hidden="true" />
                <TwineBow className="kc-bow" />
              </>
            )}
            {theme === 'boho' && (
              <>
                <BohoArches className="kc-arches kc-arches--bl" />
                <BohoArches className="kc-arches kc-arches--br" />
              </>
            )}
            {(theme === 'emerald' || theme === 'minimal' || theme === 'blacktie' || theme === 'waxseal' || theme === 'tile') && <div className="kc-frame" aria-hidden="true" />}
            {theme === 'vellum' && (
              <>
                <PressedFlowers className="kc-pressed kc-pressed--tl" />
                <PressedFlowers className="kc-pressed kc-pressed--br" flip />
                <div className="kc-vellum" aria-hidden="true" />
              </>
            )}
            {theme === 'tile' && (
              <>
                <TileBand gid={`${gid}t`} className="kc-tiles kc-tiles--top" />
                <TileBand gid={`${gid}u`} className="kc-tiles kc-tiles--bottom" />
              </>
            )}
            {theme === 'deco' && (
              <>
                <div className="kc-frame" aria-hidden="true" />
                {['tl', 'tr', 'bl', 'br'].map((c) => <DecoCorner key={c} gid={gid} className={`kc-corner kc-corner--${c}`} />)}
              </>
            )}
            {(theme === 'couple' || theme === 'chapel' || theme === 'renewal' || theme === 'city' || theme === 'ring' || theme === 'cheers' || theme === 'gradcap' || theme === 'mitzvah' || theme === 'nursery' || theme === 'cake') && <div className="kc-frame" aria-hidden="true" />}
            {theme === 'arbor' && <Arbor gid={`${gid}r`} className="kc-arbor" />}
            {theme === 'beach' && (
              <>
                <BeachTop gid={`${gid}s`} className="kc-beach-top" />
                <BeachBottom className="kc-beach-bottom" />
              </>
            )}
            {theme === 'barn' && <div className="kc-barn-wash" aria-hidden="true" />}
            {theme === 'confetti' && <ConfettiField className="kc-confetti-field" />}
            {theme === 'neon' && <div className="kc-neon-frame" aria-hidden="true" />}
            {theme === 'sunset' && <SunsetBand gid={`${gid}n`} className="kc-sunset" />}
            {theme === 'launch' && <LaunchShapes className="kc-launch" />}
            {theme === 'winter' && (
              <>
                <div className="kc-frame" aria-hidden="true" />
                <PineCorner className="kc-pine kc-pine--tl" />
                <PineCorner className="kc-pine kc-pine--br" />
                {[[78, 8, 7], [12, 92, 6], [84, 74, 4.5], [20, 30, 4]].map(([x, y, s]) => (
                  <span key={`${x}-${y}`} className="kc-flake" style={{ left: `${x}%`, top: `${y}%`, width: `${s}cqi` }}><Snowflake color="rgba(233,208,138,.55)" /></span>
                ))}
              </>
            )}
            {theme === 'balloons' && <div className="kc-dots" aria-hidden="true" />}
          </>
        )}

        {theme === 'passport' ? <BoardingPass data={data} a={a} b={b} t={t} photo={hasPhoto ? one : null} /> : (
        <div className="kc-body">
          {wrap('art', artFor(theme, gid, data, hasPhoto, ia, ib))}
          {photoNode}
          {introText && shown('intro') && <p {...el('intro', 'kc-intro')}>{introText}</p>}
          {shown('names') && (
            <h1 {...el('names', 'kc-names')}>
              <span className="kc-name">{heads[0]}</span>
              {heads[1] && <span className="kc-amp">{amp}</span>}
              {heads[1] && <span className="kc-name">{heads[1]}</span>}
            </h1>
          )}
          {subText && shown('sub') && <p {...el('sub', 'kc-sub')}>{subText}</p>}
          {requestText && shown('request') && <p {...el('request', 'kc-request')}>{requestText}</p>}
          {wrap('divider', dividerFor(theme, gid))}
          {shown('date') && <DateBlock style={t.dateStyle} date={data.date} time={data.time} el={el('date')} />}
          {where.length > 0 && shown('where') && (data.mapHref ? (
            <a {...el('where', 'kc-where kc-maplink')} href={data.mapHref} target="_blank" rel="noopener noreferrer" aria-label={`Open ${where.join(', ')} in maps`} data-testid="card-map">
              {data.venueName && <p className="kc-venue">{data.venueName}</p>}
              {data.address && <p className="kc-address"><Pin />{data.address}</p>}
            </a>
          ) : (
            <div {...el('where', 'kc-where')}>
              {data.venueName && <p className="kc-venue">{data.venueName}</p>}
              {data.address && <p className="kc-address">{data.address}</p>}
            </div>
          ))}
          {data.personalMessage && shown('message') && <p {...el('message', 'kc-message')}>{data.personalMessage}</p>}
          {bylineText && shown('byline') && <p {...el('byline', 'kc-byline')}>{bylineText}</p>}
          {decor && theme === 'waxseal' && hasPhoto && <WaxSeal gid={`${gid}w`} a={ia} b={ib} className="kc-seal kc-seal--end" />}
          {decor && theme === 'midnight' && <Flourish gid={gid} className="kc-flourish kc-flourish--end" />}
          {decor && theme === 'chapel' && <Bells gid={gid} className="kc-bells" />}
        </div>
        )}
        {L?.stickers && L.stickers.length > 0 && (
          <div className="kc-stickers">
            {L.stickers.map((s) => (
              <div key={s.id} className="kc-sticker" data-sticker={s.id}
                style={{ left: `${s.x}cqi`, top: `${s.y}cqi`, width: `${s.w}cqi`, transform: `translate(-50%, -50%)${s.r ? ` rotate(${s.r}deg)` : ''}`, zIndex: s.z ?? 3 }}>
                <StickerArt k={s.k} color={s.c} />
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

type CardProps = { data: CardData; minText?: number; className?: string; editable?: boolean };
const sameCard = (a: CardProps, b: CardProps) =>
  a.minText === b.minText && a.className === b.className && a.editable === b.editable && JSON.stringify(a.data) === JSON.stringify(b.data);

/** Memoized: the card is a large SVG tree and parents re-render during animations. */
const InvitationCard = memo(InvitationCardInner, sameCard);
export default InvitationCard;
