import { memo, useId, type CSSProperties } from 'react';
import type { ThemeId } from './shared';
import { formalDate, formalTime, longDate, clockTime, parts } from './format';
import {
  FoilDefs, Flourish, CornerFiligree, FloralCluster, Eucalyptus, BohoArches, DecoCorner, MonogramFrame, Stars,
  GARDEN_PALETTE, BLUSH_PALETTE, ROSE_GOLD_STOPS,
} from './ornaments';
import { DECKLE, WaxSeal, PressedFlowers, TileBand, Constellation, TwineBow, DecoSunburst } from './ornaments2';
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
};

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

const initial = (s: string, d: string) => (s.trim() || d).charAt(0).toUpperCase();

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

        <div className="kc-body">
          {theme === 'midnight' && <Constellation gid={gid} className="kc-constellation" />}
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
          {(theme === 'ivory' || theme === 'emerald' || theme === 'blush' || theme === 'waxseal') && <Flourish gid={gid} className="kc-flourish" />}
          {(theme === 'garden' || theme === 'vellum' || theme === 'blacktie') && <div className="kc-rule" aria-hidden="true" />}
          <DateBlock style={t.dateStyle} date={data.date} time={data.time} />
          {where.length > 0 && (
            <div className="kc-where">
              {data.venueName && <p className="kc-venue">{data.venueName}</p>}
              {data.address && <p className="kc-address">{data.address}</p>}
            </div>
          )}
          {data.personalMessage && <p className="kc-message">{data.personalMessage}</p>}
          {theme === 'waxseal' && data.photoUrl && <WaxSeal gid={`${gid}w`} a={ia} b={ib} className="kc-seal kc-seal--end" />}
          {theme === 'midnight' && <Flourish gid={gid} className="kc-flourish kc-flourish--end" />}
        </div>
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
