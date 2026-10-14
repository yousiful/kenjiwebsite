import { useEffect, type CSSProperties, type ReactNode } from 'react';
import type { Figures, ThemeId } from './shared';
import { occasionOf } from './InvitationCard';
import './sketch.css';

// "Drawing itself" opening: an ink sketch of the couple at their ceremony, drawn with
// stroke-dashoffset (pathLength=1 on every line), then washed with watercolor and touched
// with gold. Hand-built paths only. About 3.5s; tap anywhere to move on.

type L = { d: string; t: number; dur?: number; w?: number; cls?: string };

// ---------- the couple, as flowing contour lines (feet on y=0, ~170 tall, centred on x=0) ----------
function bride(cx: number, flip: boolean, older: boolean, t0: number): { lines: L[]; wash: L[] } {
  const s = flip ? -1 : 1;
  const X = (x: number) => cx + s * x;
  const lines: L[] = [
    // head in one stroke, then hair
    { d: `M${X(1)} -150 C ${X(-8)} -150 ${X(-9)} -137 ${X(-6)} -132 C ${X(-3)} -127 ${X(5)} -127 ${X(7)} -134 C ${X(9)} -142 ${X(6)} -150 ${X(1)} -150`, t: t0, dur: 0.35 },
    { d: older ? `M${X(-7)} -140 C ${X(-12)} -150 ${X(-2)} -156 ${X(5)} -152 C ${X(10)} -149 ${X(10)} -143 ${X(8)} -139` : `M${X(-6)} -144 C ${X(-14)} -146 ${X(-15)} -138 ${X(-9)} -136`, t: t0 + 0.2, dur: 0.25 },
    // neck, shoulders, bodice and the long sweep of the gown in one line
    { d: `M${X(-2)} -127 L ${X(-3)} -119 C ${X(-10)} -117 ${X(-11)} -110 ${X(-9)} -100 C ${X(-7)} -88 ${X(-6)} -80 ${X(-6)} -76 C ${X(-16)} -50 ${X(-30)} -22 ${X(-40)} 0 C ${X(-14)} 5 ${X(18)} 5 ${X(38)} 0 C ${X(28)} -22 ${X(16)} -50 ${X(6)} -76 C ${X(6)} -82 ${X(8)} -92 ${X(9)} -102 C ${X(10)} -110 ${X(8)} -117 ${X(2)} -119 L ${X(2)} -127`, t: t0 + 0.3, dur: 0.75 },
    // arm reaching across with the bouquet
    { d: `M${X(8)} -114 C ${X(14)} -104 ${X(16)} -94 ${X(15)} -84`, t: t0 + 0.75, dur: 0.25 },
    { d: `M${X(13)} -86 c ${s * 4} -5 ${s * 10} -4 ${s * 11} 1 c ${s * 1} 5 ${s * -6} 7 ${s * -10} 4 c ${s * -3} -2 ${s * -3} -4 ${s * -1} -5`, t: t0 + 0.9, dur: 0.25 },
    // gown folds
    { d: `M${X(-1)} -70 C ${X(-6)} -46 ${X(-12)} -22 ${X(-16)} 2`, t: t0 + 0.95, dur: 0.3, w: 0.8 },
    { d: `M${X(4)} -70 C ${X(7)} -46 ${X(12)} -22 ${X(16)} 2`, t: t0 + 1.0, dur: 0.3, w: 0.8 },
  ];
  if (!older) lines.push({ d: `M${X(-9)} -140 C ${X(-30)} -110 ${X(-38)} -60 ${X(-50)} 2`, t: t0 + 0.55, dur: 0.5, w: 0.7, cls: 'sk-veil' });
  const wash: L[] = [
    { d: `M${X(-3)} -119 C ${X(-10)} -117 ${X(-11)} -110 ${X(-9)} -100 C ${X(-7)} -88 ${X(-6)} -80 ${X(-6)} -76 C ${X(-16)} -50 ${X(-30)} -22 ${X(-40)} 0 C ${X(-14)} 5 ${X(18)} 5 ${X(38)} 0 C ${X(28)} -22 ${X(16)} -50 ${X(6)} -76 C ${X(6)} -82 ${X(8)} -92 ${X(9)} -102 C ${X(10)} -110 ${X(8)} -117 ${X(2)} -119 Z`, t: 0, cls: 'sk-wash-gown' },
    { d: `M${X(13)} -86 c ${s * 4} -5 ${s * 10} -4 ${s * 11} 1 c ${s * 1} 5 ${s * -6} 7 ${s * -10} 4 Z`, t: 0, cls: 'sk-wash-flower' },
  ];
  return { lines, wash };
}

function groom(cx: number, flip: boolean, older: boolean, t0: number): { lines: L[]; wash: L[] } {
  const s = flip ? -1 : 1;
  const X = (x: number) => cx + s * x;
  const lines: L[] = [
    { d: `M${X(0)} -160 C ${X(-9)} -160 ${X(-10)} -146 ${X(-7)} -141 C ${X(-4)} -136 ${X(5)} -136 ${X(8)} -142 C ${X(10)} -150 ${X(8)} -160 ${X(0)} -160`, t: t0, dur: 0.35 },
    { d: `M${X(-9)} -150 C ${X(-8)} -162 ${X(7)} -164 ${X(9)} -152`, t: t0 + 0.2, dur: 0.2 },
    // shoulders, jacket and trousers in one line
    { d: `M${X(-3)} -136 L ${X(-4)} -128 C ${X(-12)} -127 ${X(-16)} -124 ${X(-17)} -116 L ${X(-18)} -66 L ${X(-12)} -66 L ${X(-11)} 0 L ${X(-2)} 0 L ${X(0)} -56 L ${X(2)} 0 L ${X(11)} 0 L ${X(12)} -66 L ${X(18)} -66 L ${X(17)} -116 C ${X(16)} -124 ${X(12)} -127 ${X(4)} -128 L ${X(3)} -136`, t: t0 + 0.3, dur: 0.75 },
    // lapels and bow tie
    { d: `M${X(-4)} -127 L ${X(0)} -104 L ${X(4)} -127`, t: t0 + 0.8, dur: 0.2, w: 0.9 },
    { d: `M${X(-3)} -125 L ${X(0)} -123 L ${X(3)} -125 L ${X(3)} -121 L ${X(0)} -123 L ${X(-3)} -121 Z`, t: t0 + 0.95, dur: 0.15, w: 0.9 },
    // arm reaching to the partner
    { d: `M${X(-16)} -112 C ${X(-22)} -100 ${X(-26)} -92 ${X(-28)} -84`, t: t0 + 0.85, dur: 0.25 },
  ];
  if (older) lines.push({ d: `M${X(-6)} -149 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0 M${X(1)} -149 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0`, t: t0 + 0.45, dur: 0.2, w: 0.8 });
  const wash: L[] = [
    { d: `M${X(-4)} -128 C ${X(-12)} -127 ${X(-16)} -124 ${X(-17)} -116 L ${X(-18)} -66 L ${X(-12)} -66 L ${X(-11)} 0 L ${X(-2)} 0 L ${X(0)} -56 L ${X(2)} 0 L ${X(11)} 0 L ${X(12)} -66 L ${X(18)} -66 L ${X(17)} -116 C ${X(16)} -124 ${X(12)} -127 ${X(4)} -128 Z`, t: 0, cls: 'sk-wash-suit' },
  ];
  return { lines, wash };
}

// ---------- the setting, drawn first ----------
function scene(kind: string): { lines: L[]; wash: L[] } {
  const arch = (w = 1): L[] => [
    { d: 'M72 288 V150 C 72 96 112 60 160 56 C 208 60 248 96 248 150 V288', t: 0, dur: 1.0, w: 1.4 * w },
    { d: 'M84 288 V154 C 84 106 118 74 160 70 C 202 74 236 106 236 154 V288', t: 0.25, dur: 0.9, w: 0.7 },
  ];
  switch (kind) {
    case 'church':
      return {
        lines: [
          { d: 'M78 288 V146 C 78 96 112 58 160 44 C 208 58 242 96 242 146 V288', t: 0, dur: 1.0, w: 1.5 },
          { d: 'M92 288 V150 C 92 106 120 74 160 62 C 200 74 228 106 228 150 V288', t: 0.2, dur: 0.9, w: 0.7 },
          { d: 'M160 62 V30 M150 40 H170', t: 0.9, dur: 0.25, w: 1.1, cls: 'sk-cross' },
          { d: 'M58 52 C 50 54 49 70 44 78 H72 C 67 70 66 54 58 52 Z M58 52 V44 M54 80 a4 4 0 0 0 8 0', t: 0.55, dur: 0.4 },
          { d: 'M262 52 C 254 54 253 70 248 78 H276 C 271 70 270 54 262 52 Z M262 52 V44 M258 80 a4 4 0 0 0 8 0', t: 0.65, dur: 0.4 },
          { d: 'M58 44 C 90 30 130 26 160 30 C 190 26 230 30 262 44', t: 0.4, dur: 0.6, w: 0.8 },
        ],
        wash: [{ d: 'M92 288 V150 C 92 106 120 74 160 62 C 200 74 228 106 228 150 V288 Z', t: 0, cls: 'sk-wash-glass' }],
      };
    case 'beach':
      return {
        lines: [
          { d: 'M100 196 A 60 60 0 0 1 220 196', t: 0, dur: 0.6, w: 1.2 },
          { d: 'M24 196 H296', t: 0.1, dur: 0.6 },
          { d: 'M30 216 C 60 208 90 224 120 216 S 180 208 210 216 S 262 224 292 214', t: 0.35, dur: 0.6, w: 0.9 },
          { d: 'M20 240 C 70 230 120 246 170 238 S 250 232 300 240', t: 0.5, dur: 0.6, w: 0.8 },
          { d: 'M64 120 q6 -6 12 0 q6 -6 12 0 M232 104 q5 -5 10 0 q5 -5 10 0', t: 0.7, dur: 0.35, w: 0.9 },
        ],
        wash: [{ d: 'M100 196 A 60 60 0 0 1 220 196 Z', t: 0, cls: 'sk-wash-sun' }, { d: 'M24 196 H296 V250 H24 Z', t: 0, cls: 'sk-wash-sea' }],
      };
    case 'garden':
      return {
        lines: [
          ...arch(),
          ...[[80, 120], [96, 88], [124, 66], [160, 58], [196, 66], [224, 88], [240, 120], [76, 170], [244, 176]].map(([x, y], i) => ({ d: `M${x} ${y} c 5 -6 12 -2 9 4 c -2 5 -9 5 -11 0 c -1 -4 3 -7 6 -5`, t: 0.5 + i * 0.05, dur: 0.25, w: 0.9 })),
          ...[[86, 104, 30], [110, 76, -20], [210, 76, 20], [234, 104, -30], [74, 200, 60], [246, 210, -60]].map(([x, y, r], i) => ({ d: `M${x} ${y} l ${Math.round(Math.cos((r * Math.PI) / 180) * 15)} ${Math.round(Math.sin((r * Math.PI) / 180) * 15)}`, t: 0.7 + i * 0.05, dur: 0.2, w: 2.6, cls: 'sk-leaf' })),
        ],
        wash: [{ d: 'M72 288 V150 C 72 96 112 60 160 56 C 208 60 248 96 248 150 V288 L 236 288 V154 C 236 106 202 74 160 70 C 118 74 84 106 84 154 V288 Z', t: 0, cls: 'sk-wash-green' }],
      };
    case 'barn':
      return {
        lines: [
          { d: 'M58 288 V176 L 82 140 L 160 100 L 238 140 L 262 176 V288', t: 0, dur: 1.0, w: 1.3 },
          { d: 'M126 288 V214 H194 V288 M126 214 L194 288 M194 214 L126 288', t: 0.5, dur: 0.6, w: 0.8 },
          { d: 'M146 150 H174 V170 H146 Z', t: 0.75, dur: 0.25, w: 0.8 },
          { d: 'M30 70 Q 95 100 160 82 Q 225 64 290 92', t: 0.3, dur: 0.6, w: 0.7 },
        ],
        wash: [{ d: 'M58 288 V176 L 82 140 L 160 100 L 238 140 L 262 176 V288 Z', t: 0, cls: 'sk-wash-barn' }],
      };
    case 'city':
      return {
        lines: [
          { d: 'M60 120 L 160 76 L 260 120 Z', t: 0, dur: 0.6, w: 1.3 },
          { d: 'M84 126 V250 M118 126 V250 M202 126 V250 M236 126 V250', t: 0.35, dur: 0.5, w: 1 },
          { d: 'M64 250 H256 M52 266 H268 M40 282 H280', t: 0.6, dur: 0.5, w: 1 },
          { d: 'M10 200 V140 H34 V200 M286 200 V120 H310 V200', t: 0.8, dur: 0.4, w: 0.7 },
        ],
        wash: [{ d: 'M60 120 L 160 76 L 260 120 Z', t: 0, cls: 'sk-wash-stone' }],
      };
    case 'destination':
      return {
        lines: [
          { d: 'M20 150 C 60 120 90 120 120 96 C 140 80 150 64 160 52', t: 0, dur: 0.8, w: 1, cls: 'sk-dash' },
          { d: 'M160 52 C 152 40 136 42 136 56 C 136 70 152 78 160 88 C 168 78 184 70 184 56 C 184 42 168 40 160 52 Z', t: 0.75, dur: 0.6, w: 1.3 },
          { d: 'M10 158 l14 -10 l-4 -2 l6 -6 l4 1 l-3 7 l7 1 z', t: 0, dur: 0.3, w: 0.9 },
          { d: 'M40 288 H280', t: 0.4, dur: 0.6, w: 0.9 },
        ],
        wash: [{ d: 'M160 52 C 152 40 136 42 136 56 C 136 70 152 78 160 88 C 168 78 184 70 184 56 C 184 42 168 40 160 52 Z', t: 0, cls: 'sk-wash-heart' }],
      };
    default:
      return {
        lines: [...arch(), { d: 'M100 70 c 8 -8 16 -8 20 0 M200 70 c 8 -8 16 -8 20 0', t: 0.8, dur: 0.3, w: 0.8 }],
        wash: [{ d: 'M72 288 V150 C 72 96 112 60 160 56 C 208 60 248 96 248 150 V288 L 236 288 V154 C 236 106 202 74 160 70 C 118 74 84 106 84 154 V288 Z', t: 0, cls: 'sk-wash-blush' }],
      };
  }
}

function couple(figures: Figures, older: boolean): { lines: L[]; wash: L[] } {
  const parts = figures === 'two-brides'
    ? [bride(138, false, older, 1.0), bride(182, true, older, 1.15)]
    : figures === 'two-grooms'
      ? [groom(138, true, older, 1.0), groom(182, false, older, 1.15)]
      : [bride(140, false, older, 1.0), groom(182, false, older, 1.15)];
  return { lines: parts.flatMap((p) => p.lines), wash: parts.flatMap((p) => p.wash) };
}

// Each main line is drawn twice, the second slightly offset and fainter, like a pen
// going over a pencil line. Small details get a single stroke.
const Line = ({ l, base = 0 }: { l: L; base?: number }) => {
  const style = { '--t': `${base + l.t}s`, '--dur': `${l.dur ?? 0.5}s`, strokeWidth: l.w ?? 1.15 } as CSSProperties;
  const echo = (l.w ?? 1.15) >= 1 && !l.cls;
  return (
    <>
      <path d={l.d} pathLength={1} className={`sk-line ${l.cls || ''}`} style={style} />
      {echo && <path d={l.d} pathLength={1} className="sk-line sk-echo" style={{ ...style, '--t': `${base + l.t + 0.06}s` } as CSSProperties} />}
    </>
  );
};

/** The finished or drawing sketch. `still` renders it complete (reduced motion). */
export function SketchArt({ theme, figures, showCross, still = false, className = '' }: { theme: ThemeId; figures: Figures; showCross: boolean; still?: boolean; className?: string }) {
  const occ = occasionOf(theme);
  const kind = occ === 'church' ? 'church' : occ === 'beach' ? 'beach' : occ === 'garden' ? 'garden' : occ === 'barn' ? 'barn' : occ === 'city' ? 'city' : occ === 'destination' ? 'destination' : 'arch';
  const older = occ === 'renewal';
  const sc = scene(kind);
  const sceneLines = kind === 'church' && !showCross ? sc.lines.filter((l) => l.cls !== 'sk-cross') : sc.lines;
  const cp = couple(figures, older);
  // feet on the ground line, figures grouped so they can lean together after drawing
  // a little larger than life so the couple reads as the subject
  const FIG = 'translate(160 288) scale(1.18) translate(-160 0)';
  const fig = (els: ReactNode) => <g transform={FIG}>{els}</g>;
  const heart = older
    ? <><path className="sk-line sk-gold" pathLength={1} style={{ '--t': '2.25s', '--dur': '0.4s' } as CSSProperties} d="M150 108 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 M160 108 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0" /></>
    : <path className="sk-line sk-heart" pathLength={1} style={{ '--t': '2.25s', '--dur': '0.4s' } as CSSProperties} d="M161 118 C 156 112 150 110 150 104 C 150 99 156 97 161 102 C 166 97 172 99 172 104 C 172 110 166 112 161 118 Z" />;
  return (
    <svg className={`sk-art${still ? ' sk-still' : ''} ${className}`} viewBox="0 0 320 300" role="img" aria-label="A sketch of the couple at their wedding">
      <g className="sk-washes">
        {sc.wash.filter((w) => !(kind === 'church' && w.cls === 'sk-cross')).map((w, i) => <path key={i} d={w.d} className={`sk-wash ${w.cls}`} />)}
        <g transform="translate(160 288) scale(1.18) translate(-160 0)">{cp.wash.map((w, i) => <path key={i} d={w.d} className={`sk-wash ${w.cls}`} />)}</g>
      </g>
      {sceneLines.map((l, i) => <Line key={`s${i}`} l={l} />)}
      {fig(cp.lines.map((l, i) => <Line key={`f${i}`} l={l} />))}
      <g transform="translate(0 -28)">{heart}</g>
      <g className="sk-sparkles">
        {[[112, 92, 4], [214, 100, 3.4], [160, 34, 3], [96, 150, 2.6], [228, 160, 2.8]].map(([x, y, r], i) => (
          <path key={i} style={{ '--t': `${2.7 + i * 0.08}s` } as CSSProperties} d={`M${x} ${y - r * 2} L${x + r * 0.45} ${y - r * 0.45} L${x + r * 2} ${y} L${x + r * 0.45} ${y + r * 0.45} L${x} ${y + r * 2} L${x - r * 0.45} ${y + r * 0.45} L${x - r * 2} ${y} L${x - r * 0.45} ${y - r * 0.45} Z`} />
        ))}
      </g>
    </svg>
  );
}

/** Full-screen drawing opening. Calls onDone after ~3.6s or when tapped. */
export function SketchIntro({ theme, figures, showCross, onDone, onSkipAll }: { theme: ThemeId; figures: Figures; showCross: boolean; onDone: () => void; onSkipAll: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 3600);
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') onSkipAll(); else onDone(); };
    window.addEventListener('keydown', key);
    return () => { window.clearTimeout(t); window.removeEventListener('keydown', key); };
  }, [onDone, onSkipAll]);
  return (
    <div className="sk" onClick={onDone} role="dialog" aria-label="Opening your invitation" data-testid="sketch">
      <SketchArt theme={theme} figures={figures} showCross={showCross} />
      <p className="sk-hint">Tap anywhere to continue</p>
      <button type="button" className="kg3-skip" onClick={(e) => { e.stopPropagation(); onSkipAll(); }}>Skip</button>
    </div>
  );
}
