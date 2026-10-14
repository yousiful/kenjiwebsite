import { forwardRef, type CSSProperties, type ReactNode } from 'react';
import { THEMES } from './InvitationCard';
import type { PublicEvent } from './api';
import { clockTime, longDate } from './format';
import {
  FoilDefs, Flourish, FloralCluster, Eucalyptus, BohoArches, MonogramFrame, GARDEN_PALETTE, BLUSH_PALETTE, ROSE_GOLD_STOPS,
} from './ornaments';
import { WaxSeal, PressedFlowers, TileBand, Constellation, DecoSunburst } from './ornaments2';
import { CoupleIllustration, ChapelWindow, Arbor, BeachTop, BarnScene, CityHall, Rings, Plane } from './ornaments3';

// Lock-screen wallpaper: not a shrunken card but its own composition in the same design.
// Top third left plain for the clock, bottom 14% left plain for the phone's buttons;
// in between, the design's illustration, the names LARGE, then the date and the place.

const first = (n: string) => n.trim().split(/\s+/)[0] || n;

function ornament(ev: PublicEvent, gid: string): ReactNode {
  const a = first(ev.coupleNames[0]).charAt(0).toUpperCase();
  const b = first(ev.coupleNames[1]).charAt(0).toUpperCase();
  switch (ev.theme) {
    case 'couple': return <CoupleIllustration figures={ev.figures || 'bride-groom'} className="kg-lock-orn kg-lock-orn--tall" />;
    case 'chapel': return <ChapelWindow gid={gid} showCross={!!ev.showCross} className="kg-lock-orn kg-lock-orn--tall" />;
    case 'arbor': return <Arbor gid={gid} className="kg-lock-orn kg-lock-orn--wide" />;
    case 'beach': return <BeachTop gid={gid} className="kg-lock-orn kg-lock-orn--band" />;
    case 'barn': return <BarnScene className="kg-lock-orn kg-lock-orn--wide" />;
    case 'city': return <CityHall gid={gid} className="kg-lock-orn kg-lock-orn--wide" />;
    case 'renewal': return <Rings gid={gid} className="kg-lock-orn kg-lock-orn--small" />;
    case 'passport': return <div className="kg-lock-orn kg-lock-route"><span>{first(ev.coupleNames[0]).slice(0, 3).toUpperCase()}</span><i /><Plane className="kg-lock-plane" /><i /><span>{first(ev.coupleNames[1]).slice(0, 3).toUpperCase()}</span></div>;
    case 'waxseal': return <WaxSeal gid={gid} a={a} b={b} className="kg-lock-orn kg-lock-orn--seal" />;
    case 'emerald':
    case 'blacktie': return <MonogramFrame gid={gid} a={a} b={b} className="kg-lock-orn kg-lock-orn--small" />;
    case 'midnight': return <Constellation gid={gid} className="kg-lock-orn kg-lock-orn--wide" />;
    case 'deco': return <DecoSunburst gid={gid} className="kg-lock-orn kg-lock-orn--wide" />;
    case 'garden': return <FloralCluster gid={gid} palette={GARDEN_PALETTE} className="kg-lock-orn kg-lock-orn--wide" />;
    case 'blush': return <FloralCluster gid={gid} palette={BLUSH_PALETTE} className="kg-lock-orn kg-lock-orn--wide" />;
    case 'vellum': return <PressedFlowers className="kg-lock-orn kg-lock-orn--wide" />;
    case 'kraft': return <Eucalyptus className="kg-lock-orn kg-lock-orn--wide" />;
    case 'boho': return <BohoArches className="kg-lock-orn kg-lock-orn--wide" />;
    case 'tile': return <TileBand gid={gid} className="kg-lock-orn kg-lock-orn--band kg-lock-orn--tiles" />;
    default: return <Flourish gid={gid} className="kg-lock-orn kg-lock-orn--wide" />;
  }
}

export const LockWallpaper = forwardRef<HTMLDivElement, { ev: PublicEvent; width: number; height: number }>(function LockWallpaper({ ev, width, height }, ref) {
  const t = THEMES[ev.theme] || THEMES.ivory;
  const gid = 'kglock';
  const a = first(ev.coupleNames[0]);
  const b = first(ev.coupleNames[1]);
  // names fill roughly 78% of the width: script letters average about half an em wide
  const longest = Math.max(a.length, b.length, 4);
  const nameSize = Math.round(Math.min(width * 0.21, Math.max(width * 0.1, (width * 0.78) / (longest * 0.5))));
  const style = { width, height, '--lw': `${width}px`, '--name': `${nameSize}px` } as CSSProperties;
  return (
    <div ref={ref} className={`kg-lock kc kc--${ev.theme}${t.foil ? ' kc--foil' : ''}${ev.accent ? ' kc--accented' : ''}`} style={{ ...style, ...(ev.accent ? { '--kc-accent': ev.accent } as CSSProperties : {}) }} data-w={width} data-h={height}>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        {ev.theme === 'blush' ? <FoilDefs gid={gid} stops={ROSE_GOLD_STOPS} /> : <FoilDefs gid={gid} />}
      </svg>
      <div className="kc-paper kg-lock-paper">
        <div className="kg-lock-zone">
          {ornament(ev, gid)}
          <div className="kg-lock-names">
            <span className="kc-name">{a}</span>
            <span className="kc-amp kg-lock-amp">{t.amp}</span>
            <span className="kc-name">{b}</span>
          </div>
          {ev.date && <p className="kg-lock-date">{longDate(ev.date)}</p>}
          {ev.time && <p className="kg-lock-time">{clockTime(ev.time)}</p>}
          {ev.venueName && <p className="kg-lock-venue">{ev.venueName}</p>}
        </div>
      </div>
    </div>
  );
});
