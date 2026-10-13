// More hand-built SVG for the premium designs (wax seal, pressed flowers, majolica
// tiles, gilded constellation, twine bow, art deco sunburst). No external images.

type G = { gid: string };

/** Deckled (torn cotton-paper) edge as a clip-path polygon, deterministic so it never jumps. */
export const DECKLE = (() => {
  let seed = 7;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const pts: string[] = [];
  const step = 1.25;
  const j = () => (rnd() * 0.55).toFixed(2);
  for (let x = 0; x <= 100; x += step) pts.push(`${x.toFixed(2)}% ${j()}%`);
  for (let y = 0; y <= 100; y += step * 0.72) pts.push(`calc(100% - ${j()}%) ${y.toFixed(2)}%`);
  for (let x = 100; x >= 0; x -= step) pts.push(`${x.toFixed(2)}% calc(100% - ${j()}%)`);
  for (let y = 100; y >= 0; y -= step * 0.72) pts.push(`${j()}% ${y.toFixed(2)}%`);
  return `polygon(${pts.join(',')})`;
})();

/** Wax seal with an embossed monogram. */
export function WaxSeal({ gid, a, b, className, color = '#7d1f2a' }: G & { a: string; b: string; className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 150" role="img" aria-label={`Wax seal with ${a} and ${b}`}>
      <defs>
        <radialGradient id={`${gid}-wax`} cx="0.36" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#c25b62" />
          <stop offset="0.45" stopColor={color} />
          <stop offset="1" stopColor="#3f0c13" />
        </radialGradient>
        <linearGradient id={`${gid}-rib`} x1="0" x2="1">
          <stop offset="0" stopColor="#d9cbb5" />
          <stop offset="0.5" stopColor="#efe5d3" />
          <stop offset="1" stopColor="#cdbd9f" />
        </linearGradient>
      </defs>
      <path d="M50 70 L34 146 L44 136 L52 148 L60 74 Z" fill={`url(#${gid}-rib)`} />
      <path d="M70 70 L86 146 L76 136 L68 148 L60 74 Z" fill={`url(#${gid}-rib)`} />
      <g transform="translate(10 10)">
        <path d="M50 2 C60 2 66 7 74 9 C84 12 94 20 96 31 C99 41 96 48 98 57 C99 68 93 77 86 84 C78 92 68 96 57 97 C48 99 39 98 30 94 C20 90 11 83 6 73 C1 63 3 54 2 44 C2 33 7 24 14 17 C22 9 31 5 40 3 C44 2 47 2 50 2 Z" fill={`url(#${gid}-wax)`} />
        <circle cx="50" cy="50" r="33" fill="none" stroke="rgba(0,0,0,.28)" strokeWidth="2.6" />
        <circle cx="50" cy="51" r="33" fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="1" />
        <circle cx="50" cy="50" r="27" fill="none" stroke="rgba(0,0,0,.18)" strokeWidth="0.8" strokeDasharray="1.2 2.4" />
        <text x="50" y="58" textAnchor="middle" fontFamily="'Pinyon Script', cursive" fontSize="25" fill="rgba(0,0,0,.32)">{a}&amp;{b}</text>
        <text x="50" y="57" textAnchor="middle" fontFamily="'Pinyon Script', cursive" fontSize="25" fill="rgba(255,255,255,.34)">{a}&amp;{b}</text>
        <ellipse cx="36" cy="26" rx="12" ry="6" fill="rgba(255,255,255,.16)" transform="rotate(-28 36 26)" />
      </g>
    </svg>
  );
}

/** Delicate pressed wildflowers (lavender, chamomile, fern), viewBox 0 0 220 160. */
export function PressedFlowers({ className, flip = false }: { className?: string; flip?: boolean }) {
  const stem = '#8a9a7b';
  const lav = ['#8f7fbf', '#7d6cb0', '#a596cf'];
  return (
    <svg className={className} viewBox="0 0 220 160" aria-hidden="true" focusable="false" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <g opacity="0.92">
        {/* lavender sprig */}
        <path d="M30 158 C40 120 52 82 70 40" stroke={stem} strokeWidth="1.3" fill="none" strokeLinecap="round" />
        {Array.from({ length: 11 }, (_, i) => {
          const t = i / 10;
          const x = 30 + (70 - 30) * t + Math.sin(t * 3) * 2;
          const y = 158 - (158 - 40) * t;
          return (
            <g key={i}>
              {t > 0.45 && <ellipse cx={x - 3} cy={y} rx="2.4" ry="4" fill={lav[i % 3]} transform={`rotate(-25 ${x - 3} ${y})`} />}
              {t > 0.45 && <ellipse cx={x + 3} cy={y - 2} rx="2.4" ry="4" fill={lav[(i + 1) % 3]} transform={`rotate(25 ${x + 3} ${y - 2})`} />}
            </g>
          );
        })}
        {/* fern frond */}
        <path d="M60 160 C82 130 104 106 140 88" stroke="#7b8f6b" strokeWidth="1.1" fill="none" />
        {Array.from({ length: 14 }, (_, i) => {
          const t = 0.08 + i * 0.065;
          const x = 60 + 80 * t;
          const y = 160 - 72 * t - Math.sin(t * 3) * 6;
          const s = 10 - i * 0.55;
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(-38)`}>
              <path d={`M0 0 C ${s * 0.4} ${-s * 0.4} ${s * 0.9} ${-s * 0.5} ${s} ${-s * 0.6}`} stroke="#8fa37f" strokeWidth="1.6" fill="none" strokeLinecap="round" />
              <path d={`M0 0 C ${-s * 0.2} ${s * 0.5} ${-s * 0.1} ${s * 0.9} ${-s * 0.1} ${s}`} stroke="#8fa37f" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            </g>
          );
        })}
        {/* chamomile */}
        {[[150, 52, 9], [176, 74, 7], [128, 30, 6]].map(([cx, cy, r], k) => (
          <g key={k}>
            <path d={`M${cx} ${cy + r} C ${cx - 6} ${cy + 30} ${cx - 20} ${cy + 50} ${cx - 40} ${cy + 70}`} stroke={stem} strokeWidth="1" fill="none" />
            {Array.from({ length: 12 }, (_, i) => (
              <ellipse key={i} cx={cx} cy={cy - r * 0.9} rx={r * 0.24} ry={r * 0.62} fill="#fbf8ef" stroke="#e3dccb" strokeWidth="0.4" transform={`rotate(${i * 30} ${cx} ${cy})`} />
            ))}
            <circle cx={cx} cy={cy} r={r * 0.36} fill="#e3b94f" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** One cobalt majolica tile; used as an SVG pattern band. */
export function TileBand({ gid, className }: G & { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 40" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`${gid}-tile`} width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#fbf8f1" />
          <rect x="0.5" y="0.5" width="39" height="39" fill="none" stroke="#c9d3e6" strokeWidth="0.6" />
          {[[0, 0], [40, 0], [0, 40], [40, 40]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="9" fill="#1f3f8f" />)}
          {[[0, 0], [40, 0], [0, 40], [40, 40]].map(([x, y], i) => <circle key={`w${i}`} cx={x} cy={y} r="5" fill="#fbf8f1" />)}
          <g transform="translate(20 20)">
            {Array.from({ length: 8 }, (_, i) => (
              <path key={i} d="M0 0 C 3 -4 3 -9 0 -13 C -3 -9 -3 -4 0 0 Z" fill={i % 2 ? '#3d64b8' : '#1f3f8f'} transform={`rotate(${i * 45})`} />
            ))}
            <circle r="3.2" fill="#e3b94f" />
          </g>
          <path d="M20 0 L23 3 L20 6 L17 3 Z M20 34 L23 37 L20 40 L17 37 Z M0 20 L3 17 L6 20 L3 23 Z M34 20 L37 17 L40 20 L37 23 Z" fill="#3d64b8" />
        </pattern>
      </defs>
      <rect width="400" height="40" fill={`url(#${gid}-tile)`} />
    </svg>
  );
}

/** Gold-foil constellation with fine connecting lines (viewBox 0 0 200 90). */
export function Constellation({ gid, className }: G & { className?: string }) {
  const p = `url(#${gid}-foil)`;
  const pts: [number, number, number][] = [[18, 60, 2.2], [46, 34, 1.6], [78, 46, 2.6], [100, 14, 3.4], [122, 46, 2.6], [154, 34, 1.6], [182, 60, 2.2], [100, 74, 1.8]];
  const star = (x: number, y: number, r: number) => `M${x} ${y - r * 2.2} L${x + r * 0.5} ${y - r * 0.5} L${x + r * 2.2} ${y} L${x + r * 0.5} ${y + r * 0.5} L${x} ${y + r * 2.2} L${x - r * 0.5} ${y + r * 0.5} L${x - r * 2.2} ${y} L${x - r * 0.5} ${y - r * 0.5} Z`;
  return (
    <svg className={className} viewBox="0 0 200 90" aria-hidden="true" focusable="false">
      <path d="M18 60 L46 34 L78 46 L100 14 L122 46 L154 34 L182 60 M78 46 L100 74 L122 46" fill="none" stroke={p} strokeWidth="0.5" opacity="0.7" />
      {pts.map(([x, y, r], i) => <path key={i} d={star(x, y, r)} fill={p} />)}
      {[[30, 20], [64, 10], [140, 8], [172, 20], [60, 72], [142, 72], [8, 30], [194, 36]].map(([x, y], i) => <circle key={`d${i}`} cx={x} cy={y} r="0.9" fill={p} />)}
    </svg>
  );
}

/** Natural twine wrapped around the card with a small bow (viewBox 0 0 60 400). */
export function TwineBow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 120" aria-hidden="true" focusable="false">
      <g stroke="#a88a5f" strokeWidth="2.4" fill="none" strokeLinecap="round">
        <path d="M40 60 C 18 40 6 46 10 58 C 13 70 30 66 40 60" />
        <path d="M40 60 C 62 40 74 46 70 58 C 67 70 50 66 40 60" />
        <path d="M40 60 C 34 78 28 96 20 116" />
        <path d="M40 60 C 46 80 54 98 62 116" />
      </g>
      <g stroke="#c9ad7f" strokeWidth="0.8" fill="none" strokeDasharray="1.5 2.5">
        <path d="M40 60 C 18 40 6 46 10 58 C 13 70 30 66 40 60" />
        <path d="M40 60 C 62 40 74 46 70 58 C 67 70 50 66 40 60" />
      </g>
      <circle cx="40" cy="60" r="4.2" fill="#9c7e54" />
    </svg>
  );
}

/** Full-width art deco sunburst with stepped base (viewBox 0 0 300 110). */
export function DecoSunburst({ gid, className }: G & { className?: string }) {
  const p = `url(#${gid}-foil)`;
  const rays = Array.from({ length: 23 }, (_, i) => {
    const a = Math.PI + (Math.PI * (i + 0.5)) / 23;
    const r1 = 30, r2 = i % 2 ? 92 : 104;
    return `M${150 + Math.cos(a) * r1} ${106 + Math.sin(a) * r1} L${150 + Math.cos(a) * r2} ${106 + Math.sin(a) * r2}`;
  }).join(' ');
  return (
    <svg className={className} viewBox="0 0 300 110" aria-hidden="true" focusable="false">
      <path d={rays} stroke={p} strokeWidth="0.9" />
      <path d="M120 106 A30 30 0 0 1 180 106 Z" fill={p} />
      <path d="M128 106 A22 22 0 0 1 172 106" fill="none" stroke="#111" strokeWidth="0.8" opacity="0.5" />
      <path d="M2 106 H298 M24 100 H120 M180 100 H276 M50 94 H112 M188 94 H250" stroke={p} strokeWidth="0.9" />
      <path d="M150 0 V12 M146 6 L150 0 L154 6" stroke={p} strokeWidth="0.9" fill="none" />
    </svg>
  );
}
