import type { Figures } from './shared';

// Hand-drawn SVG illustrations for the occasion designs. No external or generated images.
// Colors come from CSS (currentColor / CSS variables) so each design can tint them.

type G = { gid: string };

// ---------- couple silhouettes ----------

function Bride({ cx, flip = false }: { cx: number; flip?: boolean }) {
  return (
    <g transform={flip ? `translate(${cx * 2} 0) scale(-1 1)` : undefined}>
      {/* veil */}
      <path d={`M${cx - 8} 32 C ${cx - 30} 62 ${cx - 40} 128 ${cx - 50} 208 L ${cx - 26} 208 C ${cx - 22} 146 ${cx - 14} 84 ${cx - 4} 42 Z`} fill="var(--il-veil, currentColor)" opacity="0.22" />
      <circle cx={cx - 7} cy="31" r="5.2" fill="currentColor" />
      <ellipse cx={cx} cy="40" rx="8.6" ry="10.4" fill="currentColor" />
      <path d={`M${cx - 3} 49 L ${cx - 3} 57 L ${cx + 3} 57 L ${cx + 3} 49 Z`} fill="currentColor" />
      {/* bodice + arms */}
      <path d={`M${cx - 10} 58 C ${cx - 12} 72 ${cx - 9} 88 ${cx - 7} 98 L ${cx + 7} 98 C ${cx + 9} 88 ${cx + 12} 72 ${cx + 10} 58 C ${cx + 4} 55 ${cx - 4} 55 ${cx - 10} 58 Z`} fill="currentColor" />
      <path d={`M${cx + 9} 60 C ${cx + 15} 72 ${cx + 17} 84 ${cx + 15} 96 L ${cx + 12} 96 C ${cx + 13} 86 ${cx + 11} 74 ${cx + 7} 64 Z`} fill="currentColor" />
      {/* gown */}
      <path d={`M${cx - 7} 96 C ${cx - 20} 130 ${cx - 36} 170 ${cx - 46} 208 Q ${cx} 216 ${cx + 44} 208 C ${cx + 34} 170 ${cx + 20} 130 ${cx + 7} 96 Z`} fill="currentColor" />
      <path d={`M${cx - 2} 104 C ${cx - 8} 140 ${cx - 14} 176 ${cx - 18} 208`} stroke="var(--il-hi, rgba(255,255,255,.18))" strokeWidth="1.2" fill="none" />
      <path d={`M${cx + 4} 104 C ${cx + 8} 140 ${cx + 14} 176 ${cx + 20} 208`} stroke="var(--il-hi, rgba(255,255,255,.18))" strokeWidth="1" fill="none" />
      {/* bouquet */}
      <g fill="var(--il-accent, currentColor)">
        <circle cx={cx + 16} cy="98" r="4.2" /><circle cx={cx + 22} cy="95" r="3.6" /><circle cx={cx + 19} cy="102" r="3.4" /><circle cx={cx + 24} cy="101" r="2.8" />
      </g>
      <path d={`M${cx + 19} 104 L ${cx + 17} 114 M${cx + 21} 104 L ${cx + 22} 113`} stroke="var(--il-accent, currentColor)" strokeWidth="1" />
    </g>
  );
}

function Groom({ cx, flip = false }: { cx: number; flip?: boolean }) {
  return (
    <g transform={flip ? `translate(${cx * 2} 0) scale(-1 1)` : undefined}>
      <ellipse cx={cx} cy="36" rx="9.4" ry="11" fill="currentColor" />
      <path d={`M${cx - 10} 33 C ${cx - 10} 22 ${cx + 9} 20 ${cx + 10} 31 C ${cx + 5} 27 ${cx - 4} 27 ${cx - 10} 33 Z`} fill="currentColor" />
      <path d={`M${cx - 3.5} 46 L ${cx - 3.5} 54 L ${cx + 3.5} 54 L ${cx + 3.5} 46 Z`} fill="currentColor" />
      {/* jacket */}
      <path d={`M${cx - 15} 56 C ${cx - 6} 52 ${cx + 6} 52 ${cx + 15} 56 L ${cx + 17} 122 L ${cx - 17} 122 Z`} fill="currentColor" />
      <path d={`M${cx - 4} 55 L ${cx} 82 L ${cx + 4} 55 Z`} fill="var(--il-shirt, #fff)" />
      <path d={`M${cx - 3.5} 57 L ${cx} 59.5 L ${cx + 3.5} 57 L ${cx + 3.5} 61 L ${cx} 59.5 L ${cx - 3.5} 61 Z`} fill="currentColor" />
      <circle cx={cx - 9} cy="66" r="2.4" fill="var(--il-accent, currentColor)" />
      {/* arm toward partner */}
      <path d={`M${cx - 14} 62 C ${cx - 22} 76 ${cx - 26} 88 ${cx - 28} 98 L ${cx - 24} 99 C ${cx - 21} 90 ${cx - 17} 80 ${cx - 11} 70 Z`} fill="currentColor" />
      {/* trousers + shoes */}
      <path d={`M${cx - 14} 120 L ${cx - 12} 206 L ${cx - 3} 206 L ${cx} 134 L ${cx + 3} 206 L ${cx + 12} 206 L ${cx + 14} 120 Z`} fill="currentColor" />
      <path d={`M${cx - 15} 206 h 13 v 3 h -15 Z M${cx + 2} 206 h 13 l 2 3 h -15 Z`} fill="currentColor" />
    </g>
  );
}

/** Wedding couple silhouettes: bride & groom, two brides or two grooms (viewBox 0 0 200 216). */
export function CoupleIllustration({ figures, className }: { figures: Figures; className?: string }) {
  const label = figures === 'two-brides' ? 'Two brides' : figures === 'two-grooms' ? 'Two grooms' : 'Bride and groom';
  return (
    <svg className={className} viewBox="0 0 200 216" role="img" aria-label={label}>
      <ellipse cx="100" cy="210" rx="78" ry="4" fill="currentColor" opacity="0.12" />
      {figures === 'two-brides' && (<><Bride cx={76} /><Bride cx={124} flip /></>)}
      {figures === 'two-grooms' && (<><Groom cx={80} flip /><Groom cx={122} /></>)}
      {figures === 'bride-groom' && (<><Bride cx={78} /><Groom cx={124} /></>)}
      <path d="M96 94 C 98 90 104 90 104 94 C 104 98 100 101 100 103 C 100 101 96 98 96 94 Z" fill="var(--il-accent, currentColor)" transform="translate(0 -70) scale(1)" opacity="0.9" />
    </svg>
  );
}

// ---------- church / chapel ----------

/** Gothic chapel window: rose window and two lancets of leaded stained glass, optional cross (viewBox 0 -24 200 214). */
export function ChapelWindow({ gid, showCross, className }: G & { showCross: boolean; className?: string }) {
  const gold = `url(#${gid}-foil)`;
  const jewel = ['#8e2b3c', '#2c4f8a', '#2f6b4f', '#c9962f', '#5b3a7a', '#2c4f8a', '#8e2b3c', '#2f6b4f'];
  const lancet = (x: number) => `M${x} 186 V122 Q${x} 98 ${x + 21} 90 Q${x + 42} 98 ${x + 42} 122 V186 Z`;
  return (
    <svg className={className} viewBox="0 -24 200 214" role="img" aria-label={showCross ? 'Chapel window with a cross' : 'Chapel window'}>
      <defs>
        <linearGradient id={`${gid}-glass`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8e2b3c" stopOpacity="0.5" />
          <stop offset="0.35" stopColor="#c9962f" stopOpacity="0.38" />
          <stop offset="0.7" stopColor="#2c4f8a" stopOpacity="0.42" />
          <stop offset="1" stopColor="#2f6b4f" stopOpacity="0.45" />
        </linearGradient>
        <pattern id={`${gid}-lead`} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0 H9 M0 0 V9" stroke="#b8913f" strokeWidth="0.55" opacity="0.8" />
        </pattern>
        <radialGradient id={`${gid}-glow`} cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#fff6dc" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff6dc" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="96" rx="80" ry="96" fill={`url(#${gid}-glow)`} />
      {/* rose window */}
      {jewel.map((c, i) => (
        <path key={i} d="M100 58 L 100 33 A 25 25 0 0 1 117.7 40.3 Z" fill={c} opacity="0.5" transform={`rotate(${i * 45} 100 58)`} />
      ))}
      <circle cx="100" cy="58" r="9" fill="#e8c46a" opacity="0.75" />
      {/* lancets */}
      {[52, 106].map((x) => (
        <g key={x}>
          <path d={lancet(x)} fill={`url(#${gid}-glass)`} />
          <path d={lancet(x)} fill={`url(#${gid}-lead)`} />
          <path d={lancet(x)} fill="none" stroke={gold} strokeWidth="1.6" />
        </g>
      ))}
      <g fill="none" stroke={gold}>
        <path d="M44 188 V82 Q44 24 100 6 Q156 24 156 82 V188" strokeWidth="2.6" />
        <path d="M37 188 V80 Q37 16 100 -3 Q163 16 163 80 V188" strokeWidth="0.8" />
        <circle cx="100" cy="58" r="25" strokeWidth="1.6" />
        <circle cx="100" cy="58" r="9" strokeWidth="0.9" />
        {Array.from({ length: 8 }, (_, i) => <path key={i} d="M100 49 L100 33" strokeWidth="1" transform={`rotate(${i * 45} 100 58)`} />)}
        <path d="M30 188 H170" strokeWidth="1.4" />
      </g>
      {showCross && <path d="M97 -24 h6 v9 h8 v5.5 h-8 v14 h-6 v-14 h-8 v-5.5 h8 Z" fill={gold} />}
    </svg>
  );
}

/** Two wedding bells tied with a ribbon (viewBox 0 0 120 70). */
export function Bells({ gid, className }: G & { className?: string }) {
  const gold = `url(#${gid}-foil)`;
  const bell = (x: number, r: number) => (
    <g transform={`rotate(${r} ${x} 14)`}>
      <path d={`M${x} 14 C ${x - 12} 16 ${x - 13} 34 ${x - 18} 48 L ${x + 18} 48 C ${x + 13} 34 ${x + 12} 16 ${x} 14 Z`} fill={gold} />
      <path d={`M${x - 20} 48 H ${x + 20}`} stroke={gold} strokeWidth="3" strokeLinecap="round" />
      <circle cx={x} cy="53" r="3.6" fill={gold} />
      <path d={`M${x - 8} 24 C ${x - 10} 32 ${x - 11} 40 ${x - 13} 46`} stroke="rgba(255,255,255,.45)" strokeWidth="1.4" fill="none" />
    </g>
  );
  return (
    <svg className={className} viewBox="0 0 120 70" aria-hidden="true" focusable="false">
      {bell(42, 14)}
      {bell(78, -14)}
      <path d="M60 10 C 50 0 40 4 46 12 C 52 18 58 12 60 10 C 62 12 68 18 74 12 C 80 4 70 0 60 10 Z" fill="var(--il-accent, #8e2b3c)" />
      <path d="M60 10 C 56 24 50 30 44 34 M60 10 C 64 24 70 30 76 34" stroke="var(--il-accent, #8e2b3c)" strokeWidth="2" fill="none" />
    </svg>
  );
}

// ---------- garden arbor ----------
type Pt = [number, number];
const quad = (a: Pt, c: Pt, b: Pt, t: number): Pt => [
  (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0],
  (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1],
];

/** Floral wedding arbor framing the card (viewBox 0 0 200 110; the posts continue in CSS). */
export function Arbor({ gid, className }: G & { className?: string }) {
  const L: Pt = [24, 96], C: Pt = [100, -6], R: Pt = [176, 96];
  const leaves = Array.from({ length: 30 }, (_, i) => {
    const t = i / 29;
    const [x, y] = quad(L, C, R, t);
    const s = i % 2 ? 1 : -1;
    return { x, y, r: (t - 0.5) * 140 + s * 50, k: i % 3 };
  });
  const greens = ['#6f8a6c', '#89a083', '#56715a'];
  const bloom = (x: number, y: number, r: number, c: string, k: number) => (
    <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
      {Array.from({ length: 7 }, (_, i) => <ellipse key={i} cx="0" cy={-r * 0.45} rx={r * 0.42} ry={r * 0.6} fill={c} opacity="0.88" transform={`rotate(${i * 51 + k * 9})`} />)}
      <circle r={r * 0.28} fill="#f3d9a4" />
    </g>
  );
  return (
    <svg className={className} viewBox="0 0 200 110" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${gid}-wood`} x1="0" x2="1"><stop offset="0" stopColor="#d9cbb3" /><stop offset="1" stopColor="#bfae93" /></linearGradient>
      </defs>
      <path d="M24 96 Q100 -6 176 96" fill="none" stroke={`url(#${gid}-wood)`} strokeWidth="4" />
      <path d="M24 96 V110 M176 96 V110" stroke={`url(#${gid}-wood)`} strokeWidth="4" />
      {leaves.map((l, i) => (
        <path key={i} d="M0 0 C 4 -5 11 -5 15 0 C 11 5 4 5 0 0 Z" fill={greens[l.k]} transform={`translate(${l.x} ${l.y}) rotate(${l.r})`} />
      ))}
      {bloom(44, 62, 10, '#f4ded9', 0)}
      {bloom(58, 44, 7, '#e8b4ae', 1)}
      {bloom(34, 82, 6, '#fbf3ea', 2)}
      {bloom(152, 58, 9, '#f4ded9', 3)}
      {bloom(166, 76, 6.5, '#e8b4ae', 4)}
      {bloom(100, 22, 7.5, '#fbf3ea', 5)}
      {bloom(88, 26, 5, '#e8b4ae', 6)}
      {bloom(114, 26, 5, '#f4ded9', 7)}
    </svg>
  );
}

// ---------- beach ----------
export function BeachTop({ gid, className }: G & { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 300 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${gid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6d3b8" /><stop offset="0.6" stopColor="#fbe6d2" /><stop offset="1" stopColor="#fdf6ee" />
        </linearGradient>
        <linearGradient id={`${gid}-sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5fa2a9" /><stop offset="1" stopColor="#9cc9c9" />
        </linearGradient>
      </defs>
      <rect width="300" height="120" fill={`url(#${gid}-sky)`} />
      <circle cx="150" cy="84" r="30" fill="#f2b98a" opacity="0.85" />
      <circle cx="150" cy="84" r="40" fill="#f2b98a" opacity="0.18" />
      <path d="M0 82 C 40 76 70 86 110 80 C 150 74 190 86 230 80 C 260 76 280 80 300 78 V120 H0 Z" fill={`url(#${gid}-sea)`} />
      <path d="M0 94 C 30 88 60 98 100 92 C 140 86 180 98 220 92 C 250 88 280 94 300 90 V120 H0 Z" fill="#7fb7b8" opacity="0.8" />
      <path d="M0 104 C 40 98 80 108 120 102 C 160 96 200 108 240 102 C 270 98 290 102 300 100 V120 H0 Z" fill="#fdf6ee" opacity="0.92" />
      <path d="M20 88 h18 M200 96 h22 M120 98 h14" stroke="#fff" strokeWidth="1" opacity="0.7" />
      {/* gulls */}
      <path d="M60 34 q5 -5 10 0 q5 -5 10 0 M230 22 q4 -4 8 0 q4 -4 8 0" stroke="#7b6a5c" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

export function BeachBottom({ className }: { className?: string }) {
  const shell = (x: number, y: number, s: number, r: number) => (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M0 0 C -10 -2 -14 -14 -8 -22 C -4 -26 4 -26 8 -22 C 14 -14 10 -2 0 0 Z" fill="#f2d7c4" stroke="#d9a98c" strokeWidth="0.8" />
      {[-6, -3, 0, 3, 6].map((dx) => <path key={dx} d={`M0 -1 L ${dx} -22`} stroke="#d9a98c" strokeWidth="0.6" />)}
      <path d="M-3 0 h6 v3 h-6 Z" fill="#e6c0a8" />
    </g>
  );
  const star = (x: number, y: number, s: number) => (
    <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 -10 L3 -3 L10 -3 L4 2 L6 10 L0 5 L-6 10 L-4 2 L-10 -3 L-3 -3 Z" fill="#e7a07c" stroke="#cf8463" strokeWidth="0.6" strokeLinejoin="round" />
  );
  return (
    <svg className={className} viewBox="0 0 300 70" preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false">
      <path d="M0 18 C 60 8 120 22 180 14 C 230 8 270 16 300 12 V70 H0 Z" fill="#f1e2cb" />
      <path d="M0 26 C 70 18 140 30 210 22 C 250 18 280 24 300 22" stroke="#e5d0b2" strokeWidth="1" fill="none" />
      {shell(46, 52, 0.9, -14)}
      {star(92, 46, 0.9)}
      {shell(214, 54, 1.1, 18)}
      {star(258, 40, 0.7)}
      {[[150, 46], [170, 52], [128, 56], [34, 36], [282, 58]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.2" fill="#d9c2a0" />)}
    </svg>
  );
}

// ---------- rustic barn ----------
export function BarnScene({ className }: { className?: string }) {
  const bulbs = Array.from({ length: 13 }, (_, i) => {
    const t = i / 12;
    const x = 10 + 280 * t;
    const y = 18 + Math.sin(t * Math.PI * 2) * 0 + 16 * Math.sin(t * Math.PI) * (i % 2 ? 1 : 0.94);
    return [x, y];
  });
  return (
    <svg className={className} viewBox="0 0 300 150" aria-hidden="true" focusable="false">
      <path d="M10 18 Q 82 44 150 30 Q 220 18 290 40" stroke="#5b4636" strokeWidth="0.9" fill="none" />
      {bulbs.map(([x], i) => {
        const t = i / 12;
        const y = t < 0.5 ? 18 + (1 - Math.pow(1 - t * 2, 2)) * 14 : 30 + Math.sin((t - 0.5) * Math.PI) * 10 - 2;
        return (
          <g key={i}>
            <circle cx={x} cy={y + 5} r="7" fill="#f7d58a" opacity="0.28" />
            <circle cx={x} cy={y + 5} r="2.8" fill="#f9dc96" />
            <path d={`M${x} ${y} v2`} stroke="#5b4636" strokeWidth="1" />
          </g>
        );
      })}
      {/* barn */}
      <g transform="translate(150 150)">
        <path d="M-62 0 V-52 L-52 -74 L0 -98 L52 -74 L62 -52 V0 Z" fill="#7a3b2e" />
        <path d="M-62 -52 L-52 -74 L0 -98 L52 -74 L62 -52" fill="none" stroke="#f1e6d6" strokeWidth="3" strokeLinejoin="round" />
        <path d="M-12 -74 h24 v16 h-24 Z" fill="#f1e6d6" opacity="0.92" />
        <path d="M-12 -74 l24 16 M12 -74 l-24 16" stroke="#7a3b2e" strokeWidth="1.4" />
        <path d="M-26 0 V-42 h52 V0" fill="#5e2c22" />
        <path d="M-26 -42 h52 V0 h-52 Z M0 -42 V0 M-26 -42 L0 0 M0 -42 L-26 0 M0 -42 L26 0 M26 -42 L0 0" stroke="#f1e6d6" strokeWidth="2" fill="none" />
        {[-48, 40].map((x) => <path key={x} d={`M${x} -40 h12 v12 h-12 Z`} fill="#f7d58a" opacity="0.9" />)}
      </g>
      {/* grass + wildflowers */}
      {Array.from({ length: 40 }, (_, i) => {
        const x = 4 + i * 7.4;
        const h = 8 + ((i * 37) % 10);
        return <path key={i} d={`M${x} 150 q ${(i % 2 ? 2 : -2)} ${-h / 2} ${(i % 3) - 1} ${-h}`} stroke="#6f8a5c" strokeWidth="1.1" fill="none" />;
      })}
      {[[20, 140, '#f4c86a'], [40, 136, '#fbf3ea'], [262, 138, '#e7a07c'], [280, 142, '#f4c86a'], [70, 142, '#e7a07c'], [236, 141, '#fbf3ea']].map(([x, y, c], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>{Array.from({ length: 5 }, (_, k) => <ellipse key={k} cx="0" cy="-2.6" rx="1.6" ry="2.6" fill={c as string} transform={`rotate(${k * 72})`} />)}<circle r="1.2" fill="#c98a3a" /></g>
      ))}
    </svg>
  );
}

// ---------- city / courthouse ----------
export function CityHall({ gid, className }: G & { className?: string }) {
  const gold = `url(#${gid}-foil)`;
  const buildings: [number, number, number][] = [[0, 70, 22], [20, 52, 18], [36, 84, 16], [50, 40, 24], [72, 64, 14], [210, 58, 18], [226, 86, 16], [240, 46, 24], [262, 70, 18], [278, 54, 22]];
  return (
    <svg className={className} viewBox="0 0 300 130" aria-hidden="true" focusable="false">
      {buildings.map(([x, h, w], i) => (
        <g key={i}>
          <rect x={x} y={130 - h} width={w} height={h} fill="var(--il-city, #3a3a3d)" opacity={0.55 + (i % 3) * 0.12} />
          {Array.from({ length: Math.floor(h / 10) }, (_, r) => (
            <rect key={r} x={x + 4} y={130 - h + 6 + r * 10} width={w - 8} height="2" fill="#f3d9a4" opacity={(r + i) % 3 === 0 ? 0.65 : 0.18} />
          ))}
        </g>
      ))}
      {/* courthouse */}
      <g transform="translate(150 130)">
        <path d="M-58 0 h116 v-6 h-116 Z M-54 -6 h108 v-4 h-108 Z" fill="var(--il-stone, #f4efe6)" stroke={gold} strokeWidth="0.8" />
        {[-44, -26, -9, 9, 26, 44].map((x) => <rect key={x} x={x - 4} y="-62" width="8" height="52" fill="var(--il-stone, #f4efe6)" stroke={gold} strokeWidth="0.7" />)}
        <path d="M-56 -62 h112 v-6 h-112 Z" fill="var(--il-stone, #f4efe6)" stroke={gold} strokeWidth="0.8" />
        <path d="M-60 -68 L0 -98 L60 -68 Z" fill="var(--il-stone, #f4efe6)" stroke={gold} strokeWidth="1" />
        <circle cx="0" cy="-80" r="5" fill="none" stroke={gold} strokeWidth="0.9" />
        <path d="M0 -98 v-14" stroke={gold} strokeWidth="1" />
        <path d="M0 -112 l10 3 l-10 3 Z" fill={gold} />
      </g>
    </svg>
  );
}

// ---------- renewal ----------
export function Rings({ gid, className }: G & { className?: string }) {
  const gold = `url(#${gid}-foil)`;
  return (
    <svg className={className} viewBox="0 0 140 96" role="img" aria-label="Two wedding rings">
      <ellipse cx="54" cy="58" rx="30" ry="30" fill="none" stroke={gold} strokeWidth="7" />
      <ellipse cx="54" cy="58" rx="30" ry="30" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="1.2" strokeDasharray="30 160" />
      <ellipse cx="86" cy="58" rx="30" ry="30" fill="none" stroke={gold} strokeWidth="7" />
      <path d="M56 30 A30 30 0 0 1 84 32" fill="none" stroke={gold} strokeWidth="7.4" />
      <path d="M86 20 L94 28 L86 34 L78 28 Z" fill="#fdfaf2" stroke={gold} strokeWidth="1.4" />
      <path d="M78 28 H94 M86 20 L84 28 L86 34 M86 20 L88 28 L86 34" stroke={gold} strokeWidth="0.6" fill="none" />
      {[[20, 22, 3], [122, 18, 2.4], [116, 76, 2], [14, 80, 2.2]].map(([x, y, r], i) => (
        <path key={i} d={`M${x} ${y - r * 2} L${x + r * 0.5} ${y - r * 0.5} L${x + r * 2} ${y} L${x + r * 0.5} ${y + r * 0.5} L${x} ${y + r * 2} L${x - r * 0.5} ${y + r * 0.5} L${x - r * 2} ${y} L${x - r * 0.5} ${y - r * 0.5} Z`} fill={gold} />
      ))}
    </svg>
  );
}

/** Small plane for the boarding-pass design. */
export function Plane({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5Z" fill="currentColor" />
    </svg>
  );
}
