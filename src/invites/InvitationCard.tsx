import { useId, type CSSProperties } from 'react';
import type { ThemeId } from './shared';
import { formalDate, formalTime, longDate, clockTime, parts } from './format';
import {
  FoilDefs, Flourish, CornerFiligree, FloralCluster, Eucalyptus, BohoArches, DecoCorner, DecoFan, MonogramFrame, Stars,
  GARDEN_PALETTE, BLUSH_PALETTE, ROSE_GOLD_STOPS,
} from './ornaments';
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

export const THEMES: Record<ThemeId, { name: string; intro: string; request: string; dateStyle: DateStyle; swatch: [string, string] }> = {
  ivory: { name: 'Classic Ivory & Gold', intro: 'Together with their families', request: 'request the honour of your presence at the celebration of their marriage', dateStyle: 'formal', swatch: ['#fbf6ea', '#c9a24f'] },
  garden: { name: 'Garden Watercolor Florals', intro: 'Please join us for the wedding of', request: '', dateStyle: 'plain', swatch: ['#fffdf9', '#e59a9c'] },
  minimal: { name: 'Modern Minimal', intro: 'We are getting married', request: '', dateStyle: 'numeric', swatch: ['#ffffff', '#111111'] },
  blush: { name: 'Romantic Blush Script', intro: 'With joy in their hearts', request: 'invite you to celebrate their wedding', dateStyle: 'plain', swatch: ['#f7e6e1', '#b9786a'] },
  midnight: { name: 'Midnight Navy & Gold', intro: 'The pleasure of your company is requested at the marriage of', request: '', dateStyle: 'columns', swatch: ['#101c36', '#d8b866'] },
  kraft: { name: 'Rustic Greenery Kraft', intro: 'Together with their families', request: 'invite you to celebrate their wedding', dateStyle: 'columns', swatch: ['#c9a77c', '#56705f'] },
  boho: { name: 'Boho Terracotta Arches', intro: 'Join us to celebrate the wedding of', request: '', dateStyle: 'columns', swatch: ['#f3e5d3', '#c8693f'] },
  emerald: { name: 'Elegant Emerald', intro: 'Together with their families', request: 'request the honour of your presence at their wedding', dateStyle: 'formal', swatch: ['#0f3a2e', '#d8b866'] },
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

/**
 * One invitation card. All sizes are in container units, so the same card
 * renders as a thumbnail, a live preview or the full guest invitation.
 * `minText` sets the floor for body text (18px on the guest page).
 */
export default function InvitationCard({ data, minText = 0, className = '' }: { data: CardData; minText?: number; className?: string }) {
  const raw = useId();
  const gid = 'kc' + raw.replace(/[^a-zA-Z0-9]/g, '');
  const t = THEMES[data.theme] || THEMES.ivory;
  const [a, b] = data.coupleNames;
  const scale = Math.min(nameScale(a), nameScale(b));
  const theme = data.theme;
  const style = {
    '--kc-min': `${minText}px`,
    '--kc-nscale': scale,
    ...(data.accent ? { '--kc-accent': data.accent } : {}),
  } as CSSProperties;
  const foil = theme === 'blush' ? <FoilDefs gid={gid} stops={ROSE_GOLD_STOPS} /> : <FoilDefs gid={gid} />;
  const where = [data.venueName, data.address].filter(Boolean);

  return (
    <article className={`kc kc--${theme}${data.accent ? ' kc--accented' : ''}${data.photoUrl ? ' kc--photo' : ''}${minText ? ' kc--readable' : ''} ${className}`} style={style} aria-label={`Wedding invitation for ${a} and ${b}`}>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">{foil}</svg>
      <div className="kc-paper">
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
            {['tl', 'tr', 'bl', 'br'].map((c) => <DecoCorner key={c} gid={gid} className={`kc-corner kc-corner--${c}`} />)}
          </>
        )}
        {theme === 'kraft' && (
          <>
            <Eucalyptus className="kc-euc kc-euc--tl" />
            <Eucalyptus className="kc-euc kc-euc--br" />
          </>
        )}
        {theme === 'boho' && (
          <>
            <BohoArches className="kc-arches kc-arches--bl" />
            <BohoArches className="kc-arches kc-arches--br" />
          </>
        )}
        {theme === 'emerald' && <div className="kc-frame" aria-hidden="true" />}
        {theme === 'minimal' && <div className="kc-frame" aria-hidden="true" />}

        <div className="kc-body">
          {theme === 'midnight' && <DecoFan gid={gid} className="kc-fan" />}
          {theme === 'emerald' && !data.photoUrl && <MonogramFrame gid={gid} a={(a || 'A').charAt(0).toUpperCase()} b={(b || 'B').charAt(0).toUpperCase()} className="kc-monogram" />}
          {data.photoUrl && (
            <figure className="kc-photo">
              <img src={data.photoUrl} alt={`${a} and ${b}`} loading="eager" decoding="async" />
            </figure>
          )}
          <p className="kc-intro">{t.intro}</p>
          <h1 className="kc-names">
            <span className="kc-name">{a || 'Your name'}</span>
            <span className="kc-amp">{theme === 'ivory' || theme === 'emerald' ? 'and' : '&'}</span>
            <span className="kc-name">{b || 'Their name'}</span>
          </h1>
          {t.request && <p className="kc-request">{t.request}</p>}
          {(theme === 'ivory' || theme === 'emerald' || theme === 'blush') && <Flourish gid={gid} className="kc-flourish" />}
          {theme === 'garden' && <div className="kc-rule" aria-hidden="true" />}
          <DateBlock style={t.dateStyle} date={data.date} time={data.time} />
          {where.length > 0 && (
            <div className="kc-where">
              {data.venueName && <p className="kc-venue">{data.venueName}</p>}
              {data.address && <p className="kc-address">{data.address}</p>}
            </div>
          )}
          {data.personalMessage && <p className="kc-message">{data.personalMessage}</p>}
          {theme === 'midnight' && <Flourish gid={gid} className="kc-flourish kc-flourish--end" />}
        </div>
      </div>
    </article>
  );
}
