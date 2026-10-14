import { memo, useId, type CSSProperties } from 'react';
import type { Figures, ThemeId } from './shared';
import { formalDate, formalTime, longDate, clockTime, parts } from './format';
import {
  FoilDefs, Flourish, CornerFiligree, FloralCluster, Eucalyptus, BohoArches, DecoCorner, MonogramFrame, Stars,
  GARDEN_PALETTE, BLUSH_PALETTE, ROSE_GOLD_STOPS,
} from './ornaments';
import { DECKLE, WaxSeal, PressedFlowers, TileBand, Constellation, TwineBow, DecoSunburst } from './ornaments2';
import { CoupleIllustration, ChapelWindow, Bells, Arbor, BeachTop, BeachBottom, BarnScene, CityHall, Rings, Plane } from './ornaments3';
import './card.css';

export interface CardData {
  coupleNames: [string, string];
  date: string;
  time: string;
  venueName: string;
  address: string;
  personalMessage: string;
  theme: ThemeId;
  accent?: string;
  photoUrl?: string;
  figures?: Figures;
  showCross?: boolean;
  /** when set, the venue and address on the card open this maps link */
  mapHref?: string;
}

type DateStyle = 'formal' | 'columns' | 'numeric' | 'plain';
interface ThemeDef { name: string; intro: string; request: string; dateStyle: DateStyle; swatch: [string, string]; amp: string; deckle?: boolean; foil?: boolean }

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
};

/** "What kind of wedding?" groups for step 3. First design in each list is the picture tile. */
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

function nameScale(n: string): number {
  const len = n.length;
  if (len <= 7) return 1;
  if (len <= 10) return 0.9;
  if (len <= 14) return 0.8;
  if (len <= 20) return 0.7;
  return 0.62;
}

function DateBlock({ style, date, time }: { style: DateStyle; date: string; time: string }) {
  if (!date) return <p className="kc-date kc-date--plain">Date to come</p>;
  const p = parts(date);
  if (style === 'formal') {
    const f = formalDate(date);
    return (
      <div className="kc-date kc-date--formal">
        <p>{f.line1}</p>
        <p>{f.line2}</p>
        {time && <p className="kc-time">{formalTime(time).replace(/^./, (c) => c.toLowerCase()).replace(/^/, 'at ')}</p>}
      </div>
    );
  }
  if (style === 'columns') {
    return (
      <div className="kc-date kc-date--columns">
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
      <div className="kc-date kc-date--numeric">
        <p className="kc-num">
          {String(p.m).padStart(2, '0')}<span className="kc-dot" aria-hidden="true" />{String(p.d).padStart(2, '0')}<span className="kc-dot" aria-hidden="true" />{String(p.y).slice(2)}
        </p>
        <p className="kc-small">{p.weekday}, {p.month} {p.d}, {p.y}</p>
        {time && <p className="kc-small">{clockTime(time)}</p>}
      </div>
    );
  }
  return (
    <div className="kc-date kc-date--plain">
      <p>{longDate(date)}</p>
      {time && <p className="kc-time">at {clockTime(time)}</p>}
    </div>
  );
}

const Pin = () => (
  <svg className="kc-pin" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-5.8-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.2-6.5 11-6.5 11z M12 12.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8z" fill="currentColor" fillRule="evenodd" /></svg>
);

const initial = (s: string, d: string) => (s.trim() || d).charAt(0).toUpperCase();

/** Destination design: the invitation laid out as a premium boarding pass. */
function BoardingPass({ data, a, b, t }: { data: CardData; a: string; b: string; t: ThemeDef }) {
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
      {data.photoUrl && (
        <figure className="kc-photo">
          <img src={data.photoUrl} alt={`${a} and ${b}`} loading="eager" decoding="async" />
        </figure>
      )}
      <p className="kc-intro">{t.intro}</p>
      <h1 className="kc-names">
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
      {data.personalMessage && <p className="kc-message">{data.personalMessage}</p>}
      <div className="kc-bp-stub" aria-hidden="true">
        <div className="kc-bp-barcode">{Array.from({ length: 34 }, (_, i) => <i key={i} style={{ width: `${[1, 2, 1, 3, 1, 2][i % 6] * 0.42}cqi` }} />)}</div>
        <span>Admit with love</span>
      </div>
    </div>
  );
}

/**
 * One invitation card, built to read like a photographed piece of stationery.
 * All sizes are container units, so the same card renders as a thumbnail, the live
 * preview or the full guest invitation. `minText` floors body text (18px for guests).
 */
function InvitationCardInner({ data, minText = 0, className = '' }: { data: CardData; minText?: number; className?: string }) {
  const raw = useId();
  const gid = 'kc' + raw.replace(/[^a-zA-Z0-9]/g, '');
  const theme: ThemeId = THEMES[data.theme] ? data.theme : 'ivory';
  const t = THEMES[theme];
  const [a, b] = data.coupleNames;
  const ia = initial(a, 'A');
  const ib = initial(b, 'B');
  const scale = Math.min(nameScale(a), nameScale(b));
  const style = {
    '--kc-min': `${minText}px`,
    '--kc-nscale': scale,
    ...(data.accent ? { '--kc-accent': data.accent } : {}),
  } as CSSProperties;
  const where = [data.venueName, data.address].filter(Boolean);
  const cls = [
    'kc', `kc--${theme}`,
    data.accent ? 'kc--accented' : '',
    data.photoUrl ? 'kc--photo' : '',
    minText ? 'kc--readable' : '',
    t.deckle ? 'kc--deckle' : '',
    t.foil ? 'kc--foil' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <article className={cls} style={style} aria-label={`Wedding invitation for ${a} and ${b}`}>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        {theme === 'blush' ? <FoilDefs gid={gid} stops={ROSE_GOLD_STOPS} /> : <FoilDefs gid={gid} />}
      </svg>
      {/* deckled cards are clipped, so their shadow is a separate layer (no CSS filter: large
          filtered layers can fail to paint on phone GPUs) */}
      {t.deckle && <div className="kc-shadow" aria-hidden="true" />}
      <div className="kc-paper" style={t.deckle ? { clipPath: DECKLE } : undefined}>
        <div className="kc-gild" aria-hidden="true" />

        {/* decoration layer */}
        {theme === 'ivory' && (
          <>
            <div className="kc-frame" aria-hidden="true" />
            {['tl', 'tr', 'bl', 'br'].map((c) => <CornerFiligree key={c} gid={gid} className={`kc-corner kc-corner--${c}`} />)}
          </>
        )}
        {(theme === 'garden' || theme === 'blush') && (
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
        {(theme === 'couple' || theme === 'chapel' || theme === 'renewal' || theme === 'city') && <div className="kc-frame" aria-hidden="true" />}
        {theme === 'arbor' && <Arbor gid={`${gid}r`} className="kc-arbor" />}
        {theme === 'beach' && (
          <>
            <BeachTop gid={`${gid}s`} className="kc-beach-top" />
            <BeachBottom className="kc-beach-bottom" />
          </>
        )}
        {theme === 'barn' && <div className="kc-barn-wash" aria-hidden="true" />}

        {theme === 'passport' ? <BoardingPass data={data} a={a} b={b} t={t} /> : (
        <div className="kc-body">
          {theme === 'midnight' && <Constellation gid={gid} className="kc-constellation" />}
          {theme === 'couple' && <CoupleIllustration figures={data.figures || 'bride-groom'} className="kc-couple" />}
          {theme === 'chapel' && <ChapelWindow gid={gid} showCross={!!data.showCross} className="kc-chapel" />}
          {theme === 'barn' && <BarnScene className="kc-barn" />}
          {theme === 'city' && <CityHall gid={gid} className="kc-city" />}
          {theme === 'renewal' && <Rings gid={gid} className="kc-rings" />}
          {theme === 'deco' && <DecoSunburst gid={gid} className="kc-sunburst" />}
          {theme === 'waxseal' && !data.photoUrl && <WaxSeal gid={`${gid}w`} a={ia} b={ib} className="kc-seal" />}
          {(theme === 'emerald' || theme === 'blacktie') && !data.photoUrl && <MonogramFrame gid={gid} a={ia} b={ib} className="kc-monogram" />}
          {data.photoUrl && (
            <figure className="kc-photo">
              <img src={data.photoUrl} alt={`${a} and ${b}`} loading="eager" decoding="async" />
            </figure>
          )}
          <p className="kc-intro">{t.intro}</p>
          <h1 className="kc-names">
            <span className="kc-name">{a || 'Your name'}</span>
            <span className="kc-amp">{t.amp}</span>
            <span className="kc-name">{b || 'Their name'}</span>
          </h1>
          {t.request && <p className="kc-request">{t.request}</p>}
          {(theme === 'ivory' || theme === 'emerald' || theme === 'blush' || theme === 'waxseal' || theme === 'chapel' || theme === 'renewal') && <Flourish gid={gid} className="kc-flourish" />}
          {(theme === 'garden' || theme === 'vellum' || theme === 'blacktie' || theme === 'couple' || theme === 'arbor' || theme === 'beach') && <div className="kc-rule" aria-hidden="true" />}
          <DateBlock style={t.dateStyle} date={data.date} time={data.time} />
          {where.length > 0 && (data.mapHref ? (
            <a className="kc-where kc-maplink" href={data.mapHref} target="_blank" rel="noopener noreferrer" aria-label={`Open ${where.join(', ')} in maps`} data-testid="card-map">
              {data.venueName && <p className="kc-venue">{data.venueName}</p>}
              {data.address && <p className="kc-address"><Pin />{data.address}</p>}
            </a>
          ) : (
            <div className="kc-where">
              {data.venueName && <p className="kc-venue">{data.venueName}</p>}
              {data.address && <p className="kc-address">{data.address}</p>}
            </div>
          ))}
          {data.personalMessage && <p className="kc-message">{data.personalMessage}</p>}
          {theme === 'waxseal' && data.photoUrl && <WaxSeal gid={`${gid}w`} a={ia} b={ib} className="kc-seal kc-seal--end" />}
          {theme === 'midnight' && <Flourish gid={gid} className="kc-flourish kc-flourish--end" />}
          {theme === 'chapel' && <Bells gid={gid} className="kc-bells" />}
        </div>
        )}
      </div>
    </article>
  );
}

type CardProps = { data: CardData; minText?: number; className?: string };
const sameCard = (a: CardProps, b: CardProps) =>
  a.minText === b.minText && a.className === b.className && JSON.stringify(a.data) === JSON.stringify(b.data);

/** Memoized: the card is a large SVG tree and parents re-render during animations. */
const InvitationCard = memo(InvitationCardInner, sameCard);
export default InvitationCard;
