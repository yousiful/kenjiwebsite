// Hand-built SVG ornaments for the invitation designs. No external images.
// `gid` makes gradient/filter ids unique when several cards are on one page.

type G = { gid: string };

export const GOLD_STOPS: [number, string][] = [
  [0, '#8a6427'], [0.18, '#c9a24f'], [0.36, '#f3e2a6'], [0.52, '#b98f3c'], [0.7, '#e9d08a'], [0.86, '#a37a32'], [1, '#d8b866'],
];
export const ROSE_GOLD_STOPS: [number, string][] = [
  [0, '#a8695a'], [0.25, '#d9a08e'], [0.45, '#f4d3c4'], [0.65, '#bf8270'], [0.85, '#e6b6a3'], [1, '#b07563'],
];

export function FoilDefs({ gid, stops = GOLD_STOPS }: G & { stops?: [number, string][] }) {
  return (
    <defs>
      <linearGradient id={`${gid}-foil`} x1="0" y1="0" x2="1" y2="1">
        {stops.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}
      </linearGradient>
    </defs>
  );
}

/** Symmetric scrolling divider. */
export function Flourish({ gid, color, className }: G & { color?: string; className?: string }) {
  const paint = color || `url(#${gid}-foil)`;
  const half = (
    <g>
      <path d="M160 15 C 188 15 212 9 238 12 C 254 14 263 21 256 26 C 249 30 241 23 247 18 C 250 16 254 17 254 20" fill="none" stroke={paint} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M163 18.5 C 186 19.5 203 22.5 224 20.5" fill="none" stroke={paint} strokeWidth="0.8" strokeLinecap="round" />
      <path d="M170 14.6 C 177 6.5 189 4.2 197 7.4 C 189 8.6 180 11.6 170 14.6 Z" fill={paint} />
      <path d="M201 12.4 C 207 7.8 215 7.4 219 9.6 C 213 10.2 207 11.4 201 12.4 Z" fill={paint} opacity="0.85" />
      <circle cx="272" cy="15" r="1.6" fill={paint} />
      <circle cx="282" cy="15" r="1.1" fill={paint} />
    </g>
  );
  return (
    <svg className={className} viewBox="0 0 300 30" aria-hidden="true" focusable="false">
      {half}
      <g transform="translate(300 0) scale(-1 1)">{half}</g>
      <path d="M150 7 L157 15 L150 23 L143 15 Z" fill={paint} />
      <circle cx="150" cy="15" r="1.6" fill="#fff" opacity="0.7" />
    </svg>
  );
}

/** Corner filigree, drawn for the top-left corner. Flip with CSS for the others. */
export function CornerFiligree({ gid, color, className }: G & { color?: string; className?: string }) {
  const paint = color || `url(#${gid}-foil)`;
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <path d="M8 118 V44 C8 22 22 8 44 8 H118" fill="none" stroke={paint} strokeWidth="1.4" />
      <path d="M15 118 V50 C15 30 30 15 50 15 H118" fill="none" stroke={paint} strokeWidth="0.6" />
      <path d="M26 26 C 34 36 47 35 48 25 C 49 16 37 13 33 21 C 30 27 37 31 40 27" fill="none" stroke={paint} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M48 25 C 60 24 70 28 78 22 C 72 30 62 31 52 30" fill={paint} opacity="0.9" />
      <path d="M25 48 C 24 60 28 70 22 78 C 30 72 31 62 30 52" fill={paint} opacity="0.9" />
      <path d="M58 15 C 66 10 76 10 82 14" fill="none" stroke={paint} strokeWidth="0.8" strokeLinecap="round" />
      <path d="M15 58 C 10 66 10 76 14 82" fill="none" stroke={paint} strokeWidth="0.8" strokeLinecap="round" />
      <circle cx="92" cy="15" r="1.5" fill={paint} />
      <circle cx="15" cy="92" r="1.5" fill={paint} />
      <circle cx="8" cy="8" r="2.4" fill={paint} />
    </svg>
  );
}

// ---------- watercolor florals ----------

interface Palette { petal: [string, string]; petal2: [string, string]; center: string; leaf: [string, string]; wash: string }
export const GARDEN_PALETTE: Palette = { petal: ['#f7d6d2', '#e59a9c'], petal2: ['#fbe6dc', '#eeb59e'], center: '#c97c6f', leaf: ['#a9bfa0', '#61806a'], wash: '#dfe9dc' };
export const BLUSH_PALETTE: Palette = { petal: ['#fbe4e0', '#e8a9a3'], petal2: ['#fff1ea', '#efc1b0'], center: '#c98a7a', leaf: ['#c7cfbf', '#8d9c88'], wash: '#f6dcd6' };

function Bloom({ gid, x, y, r, rot = 0, alt = false }: G & { x: number; y: number; r: number; rot?: number; alt?: boolean }) {
  const fillA = `url(#${gid}-${alt ? 'p2' : 'p1'})`;
  const layers = [
    { n: 9, dist: 0.48, rx: 0.42, ry: 0.62, op: 0.78 },
    { n: 7, dist: 0.3, rx: 0.34, ry: 0.5, op: 0.85 },
    { n: 5, dist: 0.14, rx: 0.24, ry: 0.34, op: 0.9 },
  ];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} filter={`url(#${gid}-wc)`}>
      {layers.map((L, li) =>
        Array.from({ length: L.n }, (_, i) => {
          const a = (360 / L.n) * i + li * 17;
          return (
            <ellipse key={`${li}-${i}`} cx="0" cy={-r * L.dist} rx={r * L.rx} ry={r * L.ry} fill={fillA} opacity={L.op} transform={`rotate(${a})`} />
          );
        })
      )}
      <circle r={r * 0.12} fill={`url(#${gid}-ctr)`} />
      {Array.from({ length: 10 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 10;
        return <circle key={i} cx={Math.cos(a) * r * 0.16} cy={Math.sin(a) * r * 0.16} r={r * 0.025} fill={`url(#${gid}-ctr)`} opacity="0.8" />;
      })}
    </g>
  );
}

function Leaf({ gid, x, y, len, rot, w = 0.32 }: G & { x: number; y: number; len: number; rot: number; w?: number }) {
  const h = len * w;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M0 0 C ${len * 0.3} ${-h} ${len * 0.75} ${-h * 0.9} ${len} 0 C ${len * 0.75} ${h * 0.9} ${len * 0.3} ${h} 0 0 Z`} fill={`url(#${gid}-lf)`} opacity="0.92" />
      <path d={`M${len * 0.05} 0 L${len * 0.9} 0`} stroke="#fff" strokeOpacity="0.35" strokeWidth={Math.max(0.6, len * 0.015)} />
    </g>
  );
}

function Sprig({ x, y, len, rot, color }: { x: number; y: number; len: number; rot: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} stroke={color} strokeWidth="1" fill="none" strokeLinecap="round">
      <path d={`M0 0 C ${len * 0.3} -4 ${len * 0.7} -2 ${len} -8`} />
      {[0.25, 0.45, 0.65, 0.85].map((t, i) => (
        <g key={i}>
          <path d={`M${len * t} ${-3 - t * 4} l ${5 + i} ${-7 - i}`} />
          <circle cx={len * t + 5 + i} cy={-3 - t * 4 - 7 - i} r="1.8" fill={color} stroke="none" />
        </g>
      ))}
    </g>
  );
}

/** A corner bouquet of watercolor blooms and leaves (viewBox 0 0 260 200, anchored top-left). */
export function FloralCluster({ gid, palette, className, variant = 0 }: G & { palette: Palette; className?: string; variant?: number }) {
  return (
    <svg className={className} viewBox="0 0 260 200" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${gid}-p1`} cx="0.5" cy="0.35" r="0.75">
          <stop offset="0" stopColor={palette.petal[0]} />
          <stop offset="1" stopColor={palette.petal[1]} />
        </radialGradient>
        <radialGradient id={`${gid}-p2`} cx="0.5" cy="0.35" r="0.75">
          <stop offset="0" stopColor={palette.petal2[0]} />
          <stop offset="1" stopColor={palette.petal2[1]} />
        </radialGradient>
        <radialGradient id={`${gid}-ctr`}>
          <stop offset="0" stopColor="#f3d9a4" />
          <stop offset="1" stopColor={palette.center} />
        </radialGradient>
        <linearGradient id={`${gid}-lf`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={palette.leaf[1]} />
          <stop offset="1" stopColor={palette.leaf[0]} />
        </linearGradient>
        <radialGradient id={`${gid}-wash`}>
          <stop offset="0" stopColor={palette.wash} stopOpacity="0.9" />
          <stop offset="1" stopColor={palette.wash} stopOpacity="0" />
        </radialGradient>
        <filter id={`${gid}-wc`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed={3 + variant} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="5" />
        </filter>
        <filter id={`${gid}-wc2`} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed={7 + variant} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="26" />
        </filter>
      </defs>
      <ellipse cx="80" cy="66" rx="110" ry="72" fill={`url(#${gid}-wash)`} filter={`url(#${gid}-wc2)`} />
      <Leaf gid={gid} x={70} y={70} len={120} rot={8} />
      <Leaf gid={gid} x={64} y={74} len={96} rot={58} />
      <Leaf gid={gid} x={60} y={62} len={84} rot={-28} w={0.28} />
      <Leaf gid={gid} x={52} y={80} len={70} rot={100} w={0.36} />
      <Leaf gid={gid} x={110} y={58} len={64} rot={-12} w={0.3} />
      <Sprig x={95} y={40} len={90} rot={-8} color={palette.leaf[1]} />
      <Sprig x={40} y={95} len={80} rot={78} color={palette.leaf[1]} />
      <Bloom gid={gid} x={62} y={58} r={46} rot={10} />
      <Bloom gid={gid} x={128} y={46} r={28} rot={40} alt />
      <Bloom gid={gid} x={44} y={122} r={24} rot={-20} alt />
      <circle cx="160" cy="70" r="7" fill={`url(#${gid}-p1)`} opacity="0.85" filter={`url(#${gid}-wc)`} />
      <circle cx="96" cy="104" r="5.5" fill={`url(#${gid}-p2)`} opacity="0.85" filter={`url(#${gid}-wc)`} />
      <circle cx="176" cy="54" r="4" fill={`url(#${gid}-p2)`} opacity="0.8" />
    </svg>
  );
}

// ---------- eucalyptus (Rustic Greenery Kraft) ----------
type Pt = [number, number];
const bez = (P: Pt[], t: number): Pt => {
  const u = 1 - t;
  return [
    u * u * u * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t * t * t * P[3][0],
    u * u * u * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t * t * t * P[3][1],
  ];
};
function branchLeaves(P: Pt[], n: number, r0: number, r1: number, t0 = 0.08, t1 = 0.96) {
  const out: { x: number; y: number; r: number; rot: number; tone: number }[] = [];
  for (let i = 0; i < n; i++) {
    const t = t0 + ((t1 - t0) * i) / (n - 1);
    const [x, y] = bez(P, t);
    const [x2, y2] = bez(P, Math.min(1, t + 0.01));
    const ang = Math.atan2(y2 - y, x2 - x);
    const r = r0 + (r1 - r0) * (i / (n - 1));
    for (const side of [-1, 1]) {
      const nx = -Math.sin(ang) * side;
      const ny = Math.cos(ang) * side;
      out.push({ x: x + nx * r * 0.95, y: y + ny * r * 0.95, r, rot: (ang * 180) / Math.PI + side * 12, tone: (i + (side > 0 ? 1 : 0)) % 3 });
    }
  }
  return out;
}

/** Silver-dollar eucalyptus sprig lying along the top edge (viewBox 0 0 260 110). */
export function Eucalyptus({ className }: { className?: string }) {
  const main: Pt[] = [[-6, 26], [70, 18], [150, 36], [254, 84]];
  const side: Pt[] = [[92, 24], [112, 6], [140, 0], [172, 4]];
  const tones = ['#8ea596', '#7a9284', '#5f7a69'];
  const leaves = [...branchLeaves(main, 8, 15, 7), ...branchLeaves(side, 4, 9, 5, 0.2, 0.95)];
  return (
    <svg className={className} viewBox="0 0 260 110" aria-hidden="true" focusable="false">
      <path d={`M${main[0].join(' ')} C ${main[1].join(' ')} ${main[2].join(' ')} ${main[3].join(' ')}`} fill="none" stroke="#56705f" strokeWidth="1.5" strokeLinecap="round" />
      <path d={`M${side[0].join(' ')} C ${side[1].join(' ')} ${side[2].join(' ')} ${side[3].join(' ')}`} fill="none" stroke="#56705f" strokeWidth="1.1" strokeLinecap="round" />
      {leaves.map((l, i) => (
        <g key={i} transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.rot.toFixed(1)})`}>
          <ellipse rx={l.r} ry={l.r * 0.88} fill={tones[l.tone]} opacity="0.94" />
          <ellipse rx={l.r * 0.82} ry={l.r * 0.66} cx={-l.r * 0.08} cy={-l.r * 0.1} fill="#c9d6cc" opacity="0.18" />
          <path d={`M${-l.r * 0.75} 0 H${l.r * 0.75}`} stroke="#fff" strokeOpacity="0.28" strokeWidth="0.8" />
        </g>
      ))}
    </svg>
  );
}

// ---------- boho arches ----------
export function BohoArches({ className }: { className?: string }) {
  const arch = (x: number, y: number, w: number, h: number) => `M${x} ${y + h} V${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} V${y + h} Z`;
  return (
    <svg className={className} viewBox="0 0 200 140" aria-hidden="true" focusable="false">
      <circle cx="132" cy="58" r="26" fill="#e7b08c" />
      <path d={arch(18, 30, 92, 110)} fill="#c8693f" />
      <path d={arch(32, 46, 64, 94)} fill="#e6c3a1" />
      <path d={arch(46, 62, 36, 78)} fill="#a9502c" />
      <path d={arch(118, 72, 64, 68)} fill="#d98f6b" />
      <path d={arch(130, 86, 40, 54)} fill="#f1dcc4" />
      <g stroke="#9a6a45" strokeWidth="1" fill="none" strokeLinecap="round">
        <path d="M108 140 C 106 110 110 86 122 62" />
        {Array.from({ length: 9 }, (_, i) => {
          const y = 120 - i * 7;
          const x = 107 + i * 1.6;
          return <path key={i} d={`M${x} ${y} q 8 -6 14 -4 M${x} ${y} q -7 -7 -12 -6`} />;
        })}
      </g>
    </svg>
  );
}

// ---------- art deco (Midnight Navy & Gold) ----------
export function DecoCorner({ gid, className }: G & { className?: string }) {
  const p = `url(#${gid}-foil)`;
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path d="M4 96 V24 H24 V4 H96" fill="none" stroke={p} strokeWidth="1.4" />
      <path d="M12 96 V32 H32 V12 H96" fill="none" stroke={p} strokeWidth="0.7" />
      <path d="M24 24 L40 40" stroke={p} strokeWidth="1" />
      <rect x="37" y="37" width="7" height="7" transform="rotate(45 40.5 40.5)" fill={p} />
      <path d="M44 12 V20 M56 12 V17 M68 12 V20 M12 44 H20 M12 56 H17 M12 68 H20" stroke={p} strokeWidth="0.8" />
    </svg>
  );
}

export function DecoFan({ gid, className }: G & { className?: string }) {
  const p = `url(#${gid}-foil)`;
  const rays = Array.from({ length: 13 }, (_, i) => {
    const a = Math.PI + (Math.PI * i) / 12;
    return `M100 70 L${100 + Math.cos(a) * 62} ${70 + Math.sin(a) * 62}`;
  }).join(' ');
  return (
    <svg className={className} viewBox="0 0 200 76" aria-hidden="true" focusable="false">
      <path d={rays} stroke={p} strokeWidth="0.8" />
      <path d="M30 70 A70 70 0 0 1 170 70" fill="none" stroke={p} strokeWidth="1.2" />
      <path d="M50 70 A50 50 0 0 1 150 70" fill="none" stroke={p} strokeWidth="0.7" />
      <path d="M74 70 A26 26 0 0 1 126 70 Z" fill={p} />
      <path d="M4 70 H196" stroke={p} strokeWidth="1" />
    </svg>
  );
}

// ---------- emerald monogram frame ----------
export function MonogramFrame({ gid, a, b, className }: G & { a: string; b: string; className?: string }) {
  const p = `url(#${gid}-foil)`;
  return (
    <svg className={className} viewBox="0 0 120 120" role="img" aria-label={`${a} and ${b}`}>
      <path d="M60 4 L116 60 L60 116 L4 60 Z" fill="none" stroke={p} strokeWidth="1.2" />
      <path d="M60 12 L108 60 L60 108 L12 60 Z" fill="none" stroke={p} strokeWidth="0.6" />
      <circle cx="60" cy="4" r="2.2" fill={p} />
      <circle cx="60" cy="116" r="2.2" fill={p} />
      <circle cx="4" cy="60" r="2.2" fill={p} />
      <circle cx="116" cy="60" r="2.2" fill={p} />
      <text x="60" y="68" textAnchor="middle" fontFamily="'Cinzel', serif" fontSize="26" fill={p} letterSpacing="1">
        {a}
        <tspan fontFamily="'Cormorant Garamond', serif" fontStyle="italic" fontSize="18" dx="2" dy="-1">&amp;</tspan>
        <tspan dx="2" dy="1">{b}</tspan>
      </text>
    </svg>
  );
}

/** Tiny gold sparkle field used on dark designs. */
export function Stars({ className, color = '#e9d08a' }: { className?: string; color?: string }) {
  const pts = [[9, 14, 1.1], [30, 6, 0.7], [68, 5, 0.9], [90, 11, 0.6], [6, 38, 0.6], [95, 33, 1], [4, 62, 0.5], [7, 84, 0.8], [94, 70, 0.7], [36, 95, 0.9], [72, 96, 0.6], [96, 90, 0.5]];
  return (
    <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      {pts.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r * 0.6} fill={color} opacity={0.35 + (i % 3) * 0.2} />)}
    </svg>
  );
}

export type { Palette };
