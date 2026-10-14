import { forwardRef, type CSSProperties, type ReactNode } from 'react';
import { THEMES, BACKGROUNDS, PAIRINGS, type CardPhoto } from './InvitationCard';
import type { PublicEvent } from './api';
import { clockTime, longDate } from './format';
import { eventWording, typeOf } from './shared';
import {
  FoilDefs, Flourish, FloralCluster, Eucalyptus, BohoArches, MonogramFrame, GARDEN_PALETTE, BLUSH_PALETTE, ROSE_GOLD_STOPS,
} from './ornaments';
import { WaxSeal, PressedFlowers, TileBand, Constellation, DecoSunburst } from './ornaments2';
import { CoupleIllustration, ChapelWindow, Arbor, BeachTop, BarnScene, CityHall, Rings, Plane } from './ornaments3';
import { Balloons, Cake, NeonSpark, GradCap, Nursery, DiamondRing, Tiara, StarOfDavid, SunsetBand, House, PineCorner, Champagne, PolaroidStack } from './ornaments4';

// Lock-screen wallpaper: not a shrunken card but its own composition in the same design.
// Top third left plain for the clock, bottom 14% left plain for the phone's buttons;
// in between, the main photo or the design's illustration, the names (or the event's
// name) LARGE, then the date and the place. Follows the host's card edits: background,
// fonts, colors and anything they hid.

const first = (n: string) => n.trim().split(/\s+/)[0] || n;

function ornament(ev: PublicEvent, gid: string, a: string, b: string): ReactNode {
  const ia = a.replace(/^the\s+/i, '').charAt(0).toUpperCase();
  const ib = b ? b.charAt(0).toUpperCase() : '';
  switch (ev.theme) {
    case 'couple': return <CoupleIllustration figures={ev.figures || 'bride-groom'} className="kg-lock-orn kg-lock-orn--tall" />;
    case 'chapel': return <ChapelWindow gid={gid} showCross={!!ev.showCross} className="kg-lock-orn kg-lock-orn--tall" />;
    case 'arbor': return <Arbor gid={gid} className="kg-lock-orn kg-lock-orn--wide" />;
    case 'beach': return <BeachTop gid={gid} className="kg-lock-orn kg-lock-orn--band" />;
    case 'barn': return <BarnScene className="kg-lock-orn kg-lock-orn--wide" />;
    case 'city': return <CityHall gid={gid} className="kg-lock-orn kg-lock-orn--wide" />;
    case 'renewal': return <Rings gid={gid} className="kg-lock-orn kg-lock-orn--small" />;
    case 'passport': return <div className="kg-lock-orn kg-lock-route"><span>{a.slice(0, 3).toUpperCase()}</span><i /><Plane className="kg-lock-plane" /><i /><span>{(b || a).slice(0, 3).toUpperCase()}</span></div>;
    case 'waxseal': return <WaxSeal gid={gid} a={ia} b={ib} className="kg-lock-orn kg-lock-orn--seal" />;
    case 'emerald':
    case 'blacktie': return <MonogramFrame gid={gid} a={ia} b={ib} className="kg-lock-orn kg-lock-orn--small" />;
    case 'midnight': return <Constellation gid={gid} className="kg-lock-orn kg-lock-orn--wide" />;
    case 'deco': return <DecoSunburst gid={gid} className="kg-lock-orn kg-lock-orn--wide" />;
    case 'garden': return <FloralCluster gid={gid} palette={GARDEN_PALETTE} className="kg-lock-orn kg-lock-orn--wide" />;
    case 'blush': return <FloralCluster gid={gid} palette={BLUSH_PALETTE} className="kg-lock-orn kg-lock-orn--wide" />;
    case 'vellum': return <PressedFlowers className="kg-lock-orn kg-lock-orn--wide" />;
    case 'kraft': return <Eucalyptus className="kg-lock-orn kg-lock-orn--wide" />;
    case 'boho': return <BohoArches className="kg-lock-orn kg-lock-orn--wide" />;
    case 'tile': return <TileBand gid={gid} className="kg-lock-orn kg-lock-orn--band kg-lock-orn--tiles" />;
    case 'balloons': return <Balloons gid={gid} className="kg-lock-orn kg-lock-orn--tall" />;
    case 'cake': return <Cake gid={gid} className="kg-lock-orn kg-lock-orn--tall" />;
    case 'neon': return <NeonSpark className="kg-lock-orn kg-lock-orn--wide" />;
    case 'gradcap': return <GradCap gid={gid} className="kg-lock-orn kg-lock-orn--tall" />;
    case 'nursery': return <Nursery gid={gid} className="kg-lock-orn kg-lock-orn--tall" />;
    case 'ring': return <DiamondRing gid={gid} className="kg-lock-orn kg-lock-orn--small" />;
    case 'crown': return <Tiara gid={gid} className="kg-lock-orn kg-lock-orn--wide" />;
    case 'mitzvah': return <StarOfDavid gid={gid} className="kg-lock-orn kg-lock-orn--small" />;
    case 'sunset': return <SunsetBand gid={gid} className="kg-lock-orn kg-lock-orn--band" />;
    case 'house': return <House className="kg-lock-orn kg-lock-orn--tall" />;
    case 'winter': return <PineCorner className="kg-lock-orn kg-lock-orn--small" />;
    case 'cheers': return <Champagne gid={gid} className="kg-lock-orn kg-lock-orn--tall" />;
    case 'polaroid': return <PolaroidStack className="kg-lock-orn kg-lock-orn--wide" />;
    default: return <Flourish gid={gid} className="kg-lock-orn kg-lock-orn--wide" />;
  }
}

export const LockWallpaper = forwardRef<HTMLDivElement, { ev: PublicEvent; photos: CardPhoto[]; width: number; height: number }>(function LockWallpaper({ ev, photos, width, height }, ref) {
  const t = THEMES[ev.theme] || THEMES.ivory;
  const gid = 'kglock';
  const wedding = typeOf(ev) === 'wedding';
  const w = eventWording(ev);
  const els = ev.layout?.els || {};
  const named = !wedding && w.heads.length === 1 && !ev.coupleNames[0].trim();
  // names: first names only; an event's own name ("Summer BBQ") stays whole and may wrap
  const heads = wedding ? [first(ev.coupleNames[0]), first(ev.coupleNames[1])] : named ? [w.heads[0]] : w.heads.map(first);
  const amp = wedding ? t.amp : t.amp === 'and' ? 'and' : '&';
  const longest = named ? Math.min(12, Math.max(...heads.map((h) => h.length))) : Math.max(...heads.map((h) => h.length), 4);
  const nameSize = Math.round(Math.min(width * 0.21, Math.max(width * 0.1, (width * 0.78) / (longest * 0.5))));
  const bg = ev.layout?.bg && !ev.layout.bg.startsWith('photo:') ? BACKGROUNDS[ev.layout.bg] : null;
  const pair = ev.layout?.fonts ? PAIRINGS[ev.layout.fonts] : null;
  const style = {
    width, height, '--lw': `${width}px`, '--name': `${nameSize}px`,
    ...(ev.accent ? { '--kc-accent': ev.accent } : {}),
    ...(pair ? { '--kc-script': pair.script, '--kc-serif': pair.serif, '--kc-caps': pair.caps } : {}),
    ...(bg ? (bg.dark ? { '--kc-ink': '#f3ead6', '--kc-soft': '#d8c9a3' } : { '--kc-ink': '#3d3126', '--kc-soft': '#6b5a48' }) : {}),
  } as CSSProperties;
  // events from before multi-photo keep the illustration they always had
  const main = ev.photos?.length && photos.length && !els.photos?.hide ? photos[0] : null;
  const showArt = !els.art?.hide;
  const nameColor = els.names?.color;
  const sub = els.sub?.text ?? w.sub;
  return (
    <div ref={ref} className={`kg-lock kc kc--${ev.theme}${t.foil ? ' kc--foil' : ''}${ev.accent ? ' kc--accented' : ''}`} style={style} data-w={width} data-h={height}>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        {ev.theme === 'blush' || ev.theme === 'crown' ? <FoilDefs gid={gid} stops={ROSE_GOLD_STOPS} /> : <FoilDefs gid={gid} />}
      </svg>
      <div className="kc-paper kg-lock-paper" style={bg ? { background: bg.css } : undefined}>
        <div className="kg-lock-zone">
          {main ? (
            <div className="kg-lock-photo"><img src={main.src} alt="" style={{ objectPosition: `${main.fx * 100}% ${main.fy * 100}%` }} /></div>
          ) : showArt ? ornament(ev, gid, heads[0] || '', heads[1] || '') : null}
          {!els.names?.hide && (
            <div className={`kg-lock-names${named ? ' kg-lock-names--event' : ''}${nameColor ? ' kc-colored' : ''}`} style={nameColor ? ({ '--el-c': nameColor } as CSSProperties) : undefined}>
              <span className="kc-name">{heads[0]}</span>
              {heads[1] && <span className="kc-amp kg-lock-amp">{amp}</span>}
              {heads[1] && <span className="kc-name">{heads[1]}</span>}
            </div>
          )}
          {sub && !els.sub?.hide && <p className="kg-lock-sub">{sub}</p>}
          {ev.date && !els.date?.hide && <p className="kg-lock-date">{longDate(ev.date)}</p>}
          {ev.time && !els.date?.hide && <p className="kg-lock-time">{clockTime(ev.time)}</p>}
          {ev.venueName && !els.where?.hide && <p className="kg-lock-venue">{ev.venueName}</p>}
        </div>
      </div>
    </div>
  );
});
