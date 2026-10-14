// Illustrations for the designs beyond weddings: birthdays, graduations, showers, holidays,
// business events and more. Hand-built SVG only, sized by the card's CSS (container units).

type G = { gid: string; className?: string };

/** A cluster of five glossy balloons on curling strings (viewBox 0 0 200 150). */
export function Balloons({ gid, className }: G) {
  const b = [
    { x: 64, y: 52, r: 25, c: ['#ffd1c2', '#f08a76'] },
    { x: 100, y: 38, r: 28, c: ['#fff0c7', '#e9b949'] },
    { x: 136, y: 52, r: 25, c: ['#d7efe6', '#6fb39c'] },
    { x: 82, y: 78, r: 22, c: ['#e8ddf6', '#9b84c9'] },
    { x: 120, y: 80, r: 22, c: ['#ffd9e4', '#e57a9b'] },
  ];
  return (
    <svg className={className} viewBox="0 0 200 150" role="img" aria-label="Balloons">
      <defs>
        {b.map((o, i) => (
          <radialGradient key={i} id={`${gid}-bl${i}`} cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
            <stop offset="0.25" stopColor={o.c[0]} />
            <stop offset="1" stopColor={o.c[1]} />
          </radialGradient>
        ))}
      </defs>
      {b.map((o, i) => (
        <path key={`s${i}`} d={`M${o.x} ${o.y + o.r * 1.18} C ${o.x + (i % 2 ? 6 : -6)} ${o.y + o.r * 1.18 + 14} ${100 + (o.x - 100) * 0.3} 118 100 146`} fill="none" stroke="rgba(90,70,60,.45)" strokeWidth="0.8" />
      ))}
      {b.map((o, i) => (
        <g key={i}>
          <ellipse cx={o.x} cy={o.y} rx={o.r * 0.86} ry={o.r} fill={`url(#${gid}-bl${i})`} />
          <path d={`M${o.x - 2.5} ${o.y + o.r - 0.5} L ${o.x + 2.5} ${o.y + o.r - 0.5} L ${o.x} ${o.y + o.r + 3.5} Z`} fill={o.c[1]} />
          <path d={`M${o.x - o.r * 0.45} ${o.y - o.r * 0.35} C ${o.x - o.r * 0.4} ${o.y - o.r * 0.7} ${o.x - o.r * 0.1} ${o.y - o.r * 0.82} ${o.x + o.r * 0.1} ${o.y - o.r * 0.8}`} fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}

/** A two-tier cake with candles and frosting drips (viewBox 0 0 160 140). */
export function Cake({ gid, className }: G) {
  const p = `url(#${gid}-foil)`;
  return (
    <svg className={className} viewBox="0 0 160 140" role="img" aria-label="A birthday cake">
      <defs>
        <linearGradient id={`${gid}-ck`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff6f3" /><stop offset="1" stopColor="#f6d4d0" /></linearGradient>
        <linearGradient id={`${gid}-ck2`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fbe3e2" /><stop offset="1" stopColor="#eab4b4" /></linearGradient>
      </defs>
      <ellipse cx="80" cy="132" rx="62" ry="6" fill="rgba(80,40,40,.12)" />
      <rect x="24" y="86" width="112" height="44" rx="5" fill={`url(#${gid}-ck2)`} />
      <path d="M24 92 C 34 92 34 102 44 102 C 54 102 54 92 64 92 C 74 92 74 104 84 104 C 94 104 94 92 104 92 C 114 92 114 101 124 101 C 132 101 132 92 136 92 V 86 H 24 Z" fill="#fffaf7" />
      <rect x="24" y="118" width="112" height="3" fill={p} />
      <rect x="44" y="52" width="72" height="36" rx="4" fill={`url(#${gid}-ck)`} />
      <path d="M44 57 C 52 57 52 66 60 66 C 68 66 68 57 76 57 C 84 57 84 67 92 67 C 100 67 100 57 108 57 C 113 57 113 63 116 63 V 52 H 44 Z" fill="#fffaf7" />
      <rect x="44" y="80" width="72" height="2.4" fill={p} />
      {[60, 80, 100].map((x, i) => (
        <g key={x}>
          <rect x={x - 2.6} y={30} width="5.2" height="22" rx="1.5" fill={['#9fc9b9', '#e9b949', '#e57a9b'][i]} />
          <path d={`M${x - 2.6} 36 L ${x + 2.6} 33 M${x - 2.6} 43 L ${x + 2.6} 40`} stroke="#fff" strokeOpacity="0.7" strokeWidth="1.2" />
          <path d={`M${x} 18 C ${x + 5} 23 ${x + 4} 29 ${x} 29 C ${x - 4} 29 ${x - 5} 23 ${x} 18 Z`} fill="#f6b23e" />
          <path d={`M${x} 22 C ${x + 2} 25 ${x + 2} 28 ${x} 28 C ${x - 2} 28 ${x - 2} 25 ${x} 22 Z`} fill="#fff2b0" />
        </g>
      ))}
      {[[34, 106], [52, 112], [74, 108], [96, 113], [118, 107], [58, 72], [86, 74], [104, 70]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.6" fill={['#e57a9b', '#6fb39c', '#e9b949'][i % 3]} />
      ))}
    </svg>
  );
}

/** Confetti scattered around the edges of the card, leaving the middle clear (viewBox 0 0 100 140). */
export function ConfettiField({ className }: { className?: string }) {
  const colors = ['#f08a76', '#e9b949', '#6fb39c', '#9b84c9', '#e57a9b', '#5b8bd6'];
  // deterministic scatter in the outer band
  const pts: [number, number, number, number][] = [];
  let seed = 7;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  while (pts.length < 64) {
    const x = rnd() * 100;
    const y = rnd() * 140;
    const inner = x > 14 && x < 86 && y > 16 && y < 124;
    if (inner) continue;
    pts.push([x, y, rnd() * 180, Math.floor(rnd() * 3)]);
  }
  return (
    <svg className={className} viewBox="0 0 100 140" preserveAspectRatio="none" aria-hidden="true">
      {pts.map(([x, y, r, k], i) => {
        const c = colors[i % colors.length];
        if (k === 0) return <circle key={i} cx={x} cy={y} r="0.9" fill={c} />;
        if (k === 1) return <rect key={i} x={x - 0.5} y={y - 1.4} width="1" height="2.8" rx="0.3" fill={c} transform={`rotate(${r} ${x} ${y})`} />;
        return <path key={i} d={`M${x - 1.6} ${y} q 0.8 -1.2 1.6 0 t 1.6 0`} fill="none" stroke={c} strokeWidth="0.5" strokeLinecap="round" transform={`rotate(${r} ${x} ${y})`} />;
      })}
    </svg>
  );
}

/** A neon sparkle with a soft glow (viewBox 0 0 120 60). */
export function NeonSpark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 60" role="img" aria-label="Neon stars">
      {[[60, 30, 16, '#ff5fc8'], [30, 34, 8, '#5ff3ff'], [90, 24, 9, '#ffe066']].map(([x, y, r, c], i) => (
        <g key={i} style={{ filter: `drop-shadow(0 0 2px ${c}) drop-shadow(0 0 6px ${c})` }}>
          <path d={`M${x} ${Number(y) - Number(r)} L${Number(x) + Number(r) * 0.25} ${Number(y) - Number(r) * 0.25} L${Number(x) + Number(r)} ${y} L${Number(x) + Number(r) * 0.25} ${Number(y) + Number(r) * 0.25} L${x} ${Number(y) + Number(r)} L${Number(x) - Number(r) * 0.25} ${Number(y) + Number(r) * 0.25} L${Number(x) - Number(r)} ${y} L${Number(x) - Number(r) * 0.25} ${Number(y) - Number(r) * 0.25} Z`} fill="none" stroke={String(c)} strokeWidth="1.6" strokeLinejoin="round" />
        </g>
      ))}
    </svg>
  );
}

/** Mortarboard with a gold tassel, over a rolled diploma (viewBox 0 0 160 110). */
export function GradCap({ gid, className }: G) {
  const p = `url(#${gid}-foil)`;
  return (
    <svg className={className} viewBox="0 0 160 110" role="img" aria-label="A graduation cap and diploma">
      <defs>
        <linearGradient id={`${gid}-cap`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a3a63" /><stop offset="1" stopColor="#101a33" /></linearGradient>
      </defs>
      {/* diploma */}
      <g transform="rotate(-8 80 92)">
        <rect x="34" y="84" width="92" height="16" rx="8" fill="#fbf4e2" stroke="rgba(120,90,40,.35)" strokeWidth="0.8" />
        <ellipse cx="34" cy="92" rx="4" ry="8" fill="#efe2c2" stroke="rgba(120,90,40,.35)" strokeWidth="0.8" />
        <rect x="74" y="83" width="9" height="18" fill="#9c2f3c" />
        <path d="M78 101 l-5 9 l5 -3 l5 3 z" fill="#7d1f2a" />
      </g>
      {/* cap */}
      <path d="M48 46 L48 64 C 48 72 112 72 112 64 L112 46 Z" fill={`url(#${gid}-cap)`} />
      <path d="M80 14 L150 40 L80 66 L10 40 Z" fill="#1d2b4f" />
      <path d="M80 14 L150 40 L80 66 L10 40 Z" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="0.8" />
      <circle cx="80" cy="40" r="3.2" fill={p} />
      <path d="M80 40 C 100 44 118 48 128 54 L128 80" fill="none" stroke={p} strokeWidth="1.8" />
      <path d="M124 78 h8 l2 16 h-12 z" fill={p} />
      <path d="M125 94 v6 M128 94 v7 M131 94 v6" stroke={p} strokeWidth="1" />
    </svg>
  );
}

/** Laurel branches meeting at the bottom (viewBox 0 0 160 50). */
export function Laurel({ gid, className }: G) {
  const p = `url(#${gid}-foil)`;
  const leaves = (s: number) => Array.from({ length: 7 }, (_, i) => {
    const t = i / 6;
    const x = 80 + s * (8 + t * 62);
    const y = 44 - Math.sin(t * Math.PI * 0.9) * 26 - t * 6;
    const a = s * (-30 - t * 50);
    return <ellipse key={`${s}${i}`} cx={x} cy={y} rx="7" ry="2.6" fill={p} transform={`rotate(${a} ${x} ${y})`} />;
  });
  return (
    <svg className={className} viewBox="0 0 160 50" aria-hidden="true">
      <path d="M80 46 C 60 44 30 34 14 14 M80 46 C 100 44 130 34 146 14" fill="none" stroke={p} strokeWidth="1" />
      {leaves(-1)}
      {leaves(1)}
    </svg>
  );
}

/** Sleeping crescent moon on clouds with stars (viewBox 0 0 180 120). */
export function Nursery({ gid, className }: G) {
  return (
    <svg className={className} viewBox="0 0 180 120" role="img" aria-label="A moon, clouds and stars">
      <defs>
        <radialGradient id={`${gid}-moon`} cx="0.4" cy="0.35" r="0.8"><stop offset="0" stopColor="#fff8dc" /><stop offset="1" stopColor="#f1d68e" /></radialGradient>
      </defs>
      <path d="M96 12 A 40 40 0 1 0 136 70 A 32 32 0 1 1 96 12 Z" fill={`url(#${gid}-moon)`} />
      <path d="M104 52 q 4 3 8 0 M118 60 q 4 3 8 0" fill="none" stroke="#b98d3e" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="112" cy="68" r="2.4" fill="#f2b7a8" opacity="0.7" />
      {[[30, 24, 4], [52, 12, 2.6], [156, 18, 3.4], [166, 48, 2.4], [20, 54, 2.2], [146, 92, 2.6]].map(([x, y, r], i) => (
        <path key={i} d={`M${x} ${y - r * 2} L${x + r * 0.5} ${y - r * 0.5} L${x + r * 2} ${y} L${x + r * 0.5} ${y + r * 0.5} L${x} ${y + r * 2} L${x - r * 0.5} ${y + r * 0.5} L${x - r * 2} ${y} L${x - r * 0.5} ${y - r * 0.5} Z`} fill="#e7c76f" />
      ))}
      <path d="M20 104 C 14 104 12 94 20 92 C 20 82 34 80 38 88 C 42 78 58 80 58 90 C 66 88 72 98 64 104 Z" fill="#fff" stroke="#c9dbe4" strokeWidth="1" />
      <path d="M92 110 C 84 110 82 98 92 96 C 92 84 110 82 114 92 C 120 80 140 84 138 96 C 148 94 154 108 144 110 Z" fill="#fff" stroke="#c9dbe4" strokeWidth="1" />
    </svg>
  );
}

/** A solitaire diamond ring with sparkles (viewBox 0 0 120 120). */
export function DiamondRing({ gid, className }: G) {
  const p = `url(#${gid}-foil)`;
  return (
    <svg className={className} viewBox="0 0 120 120" role="img" aria-label="An engagement ring">
      <defs>
        <linearGradient id={`${gid}-gem`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="0.5" stopColor="#dfeef6" /><stop offset="1" stopColor="#a9c6d8" /></linearGradient>
      </defs>
      <ellipse cx="60" cy="78" rx="30" ry="30" fill="none" stroke={p} strokeWidth="6" />
      <ellipse cx="60" cy="78" rx="30" ry="30" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="1" transform="translate(-1.5 -1.5)" />
      <path d="M52 50 L56 44 H64 L68 50 Z" fill={p} />
      <path d="M44 30 L52 20 H68 L76 30 L60 50 Z" fill={`url(#${gid}-gem)`} stroke="#8fb0c4" strokeWidth="0.8" strokeLinejoin="round" />
      <path d="M44 30 H76 M52 20 L56 30 L60 50 L64 30 L68 20 M56 30 L60 20 L64 30" fill="none" stroke="#8fb0c4" strokeWidth="0.6" />
      {[[28, 22, 4], [92, 18, 3.4], [96, 46, 2.4], [22, 48, 2.4]].map(([x, y, r], i) => (
        <path key={i} d={`M${x} ${y - r * 2} L${x + r * 0.4} ${y - r * 0.4} L${x + r * 2} ${y} L${x + r * 0.4} ${y + r * 0.4} L${x} ${y + r * 2} L${x - r * 0.4} ${y + r * 0.4} L${x - r * 2} ${y} L${x - r * 0.4} ${y - r * 0.4} Z`} fill={p} />
      ))}
    </svg>
  );
}

/** A jewelled tiara (viewBox 0 0 160 80). */
export function Tiara({ gid, className }: G) {
  const p = `url(#${gid}-foil)`;
  return (
    <svg className={className} viewBox="0 0 160 80" role="img" aria-label="A tiara">
      <path d="M14 64 C 40 74 120 74 146 64 L 140 56 C 116 64 44 64 20 56 Z" fill={p} />
      <path d="M20 56 L 34 34 L 50 50 L 64 22 L 80 6 L 96 22 L 110 50 L 126 34 L 140 56 C 116 64 44 64 20 56 Z" fill="none" stroke={p} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M50 50 C 60 40 70 40 80 46 C 90 40 100 40 110 50" fill="none" stroke={p} strokeWidth="1.4" />
      {[[34, 34, 3.4, '#e57a9b'], [64, 22, 3.6, '#9b84c9'], [80, 8, 5, '#e57a9b'], [96, 22, 3.6, '#9b84c9'], [126, 34, 3.4, '#e57a9b']].map(([x, y, r, c], i) => (
        <g key={i}><circle cx={x} cy={y} r={r} fill={String(c)} /><circle cx={Number(x) - Number(r) * 0.3} cy={Number(y) - Number(r) * 0.3} r={Number(r) * 0.35} fill="#fff" opacity="0.8" /></g>
      ))}
      {[40, 56, 72, 88, 104, 120].map((x) => <circle key={x} cx={x} cy="65" r="2" fill="#fff" opacity="0.9" />)}
    </svg>
  );
}

/** Star of David drawn in two interlaced silver triangles, with soft rays (viewBox 0 0 120 120). */
export function StarOfDavid({ gid, className }: G) {
  const p = `url(#${gid}-silver)`;
  return (
    <svg className={className} viewBox="0 0 120 120" role="img" aria-label="Star of David">
      <defs>
        <linearGradient id={`${gid}-silver`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4f6fa" /><stop offset="0.35" stopColor="#b9c3d3" /><stop offset="0.6" stopColor="#eef2f8" /><stop offset="1" stopColor="#8e9ab0" />
        </linearGradient>
      </defs>
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        const r1 = 50; const r2 = i % 2 ? 56 : 60;
        return <line key={i} x1={60 + Math.cos(a) * r1} y1={60 + Math.sin(a) * r1} x2={60 + Math.cos(a) * r2} y2={60 + Math.sin(a) * r2} stroke={p} strokeWidth="0.8" opacity="0.7" />;
      })}
      <path d="M60 14 L100 83 L20 83 Z" fill="none" stroke={p} strokeWidth="5" strokeLinejoin="round" />
      <path d="M60 106 L20 37 L100 37 Z" fill="none" stroke={p} strokeWidth="5" strokeLinejoin="round" />
      <path d="M60 14 L100 83 L20 83 Z M60 106 L20 37 L100 37 Z" fill="none" stroke="rgba(20,30,60,.35)" strokeWidth="0.6" strokeLinejoin="round" />
    </svg>
  );
}

/** Sun setting over the sea, with birds and a sailboat: a band across the top (viewBox 0 0 200 90). */
export function SunsetBand({ gid, className }: G) {
  return (
    <svg className={className} viewBox="0 0 200 90" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${gid}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6c49a" /><stop offset="0.55" stopColor="#f3a07f" /><stop offset="1" stopColor="#f7d4b0" /></linearGradient>
        <linearGradient id={`${gid}-sea`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6f9fb0" /><stop offset="1" stopColor="#3f6f83" /></linearGradient>
      </defs>
      <rect width="200" height="64" fill={`url(#${gid}-sky)`} />
      <circle cx="100" cy="62" r="24" fill="#fff1c9" opacity="0.95" />
      <rect y="62" width="200" height="28" fill={`url(#${gid}-sea)`} />
      {[68, 74, 80].map((y, i) => <path key={y} d={`M${70 + i * 6} ${y} H${130 - i * 6}`} stroke="#fff1c9" strokeOpacity={0.7 - i * 0.18} strokeWidth="1.4" strokeLinecap="round" />)}
      <path d="M40 30 q4 -4 8 0 q4 -4 8 0 M140 22 q3 -3 6 0 q3 -3 6 0 M156 34 q2.4 -2.4 4.8 0 q2.4 -2.4 4.8 0" fill="none" stroke="#7a4f45" strokeWidth="1" strokeLinecap="round" />
      <path d="M160 66 L160 46 L170 64 Z M158 46 L158 64 L150 64 Z" fill="#fffaf2" />
      <path d="M146 66 H174 L170 70 H150 Z" fill="#7a4f45" />
    </svg>
  );
}

/** A little house with a door, windows, a potted plant and a tree (viewBox 0 0 180 120). */
export function House({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 180 120" role="img" aria-label="A house">
      <ellipse cx="90" cy="114" rx="80" ry="4" fill="rgba(80,60,40,.12)" />
      <path d="M44 56 L90 22 L136 56" fill="none" stroke="#3d3a35" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M52 52 V112 H128 V52 L90 26 Z" fill="#fbf4ea" stroke="#3d3a35" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M112 38 V24 H120 V44" fill="#fbf4ea" stroke="#3d3a35" strokeWidth="1.6" strokeLinejoin="round" />
      <rect x="80" y="78" width="20" height="34" rx="1.5" fill="#c06a45" stroke="#3d3a35" strokeWidth="1.4" />
      <circle cx="95" cy="96" r="1.4" fill="#f3d27a" />
      <rect x="60" y="64" width="14" height="14" fill="#cfe2e6" stroke="#3d3a35" strokeWidth="1.2" />
      <path d="M67 64 V78 M60 71 H74" stroke="#3d3a35" strokeWidth="0.8" />
      <rect x="106" y="64" width="14" height="14" fill="#cfe2e6" stroke="#3d3a35" strokeWidth="1.2" />
      <path d="M113 64 V78 M106 71 H120" stroke="#3d3a35" strokeWidth="0.8" />
      <circle cx="90" cy="50" r="5" fill="#cfe2e6" stroke="#3d3a35" strokeWidth="1.2" />
      <path d="M74 112 h6 l-1 -8 h-4 z" fill="#c06a45" />
      <path d="M77 104 c -4 -6 -2 -10 0 -12 c 2 2 4 6 0 12 M77 104 c -6 -2 -8 -6 -8 -8 c 3 0 7 2 8 8 M77 104 c 6 -2 8 -6 8 -8 c -3 0 -7 2 -8 8" fill="#6f8a5c" />
      <path d="M156 112 V82" stroke="#6b4e36" strokeWidth="3" strokeLinecap="round" />
      <circle cx="156" cy="72" r="16" fill="#8aa676" />
      <circle cx="148" cy="80" r="10" fill="#7a9767" />
      <circle cx="164" cy="64" r="9" fill="#9cb788" />
      <path d="M18 112 C 18 96 30 92 32 100 C 36 90 46 96 42 112" fill="#9cb788" />
    </svg>
  );
}

/** Pine branches with berries for a corner (viewBox 0 0 120 120). */
export function PineCorner({ className }: { className?: string }) {
  const needles = (x0: number, y0: number, x1: number, y1: number, n: number) => Array.from({ length: n }, (_, i) => {
    const t = (i + 1) / (n + 1);
    const x = x0 + (x1 - x0) * t;
    const y = y0 + (y1 - y0) * t;
    const ang = Math.atan2(y1 - y0, x1 - x0);
    const l = 9 * (1 - t * 0.4);
    return (
      <g key={i} stroke="#2f5d45" strokeWidth="1.3" strokeLinecap="round">
        <line x1={x} y1={y} x2={x + Math.cos(ang - 0.9) * l} y2={y + Math.sin(ang - 0.9) * l} />
        <line x1={x} y1={y} x2={x + Math.cos(ang + 0.9) * l} y2={y + Math.sin(ang + 0.9) * l} />
      </g>
    );
  });
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true">
      <path d="M0 6 C 30 14 60 30 96 62 M0 30 C 20 34 44 44 64 60 M18 0 C 26 22 40 42 58 58" fill="none" stroke="#5a4632" strokeWidth="1.4" />
      {needles(0, 6, 96, 62, 12)}
      {needles(0, 30, 64, 60, 8)}
      {needles(18, 0, 58, 58, 8)}
      {[[60, 52, '#b3263a'], [66, 58, '#c73a4e'], [56, 60, '#9c1f30'], [30, 26, '#b3263a'], [36, 30, '#c73a4e']].map(([x, y, c], i) => (
        <g key={i}><circle cx={x} cy={y} r="3.4" fill={String(c)} /><circle cx={Number(x) - 1} cy={Number(y) - 1} r="1" fill="#fff" opacity="0.6" /></g>
      ))}
    </svg>
  );
}

/** A six-armed snowflake (viewBox 0 0 40 40). */
export function Snowflake({ className, color = '#e9d08a' }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <g stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none">
        {[0, 60, 120].map((a) => (
          <g key={a} transform={`rotate(${a} 20 20)`}>
            <path d="M20 2 V38 M20 9 l-4 -4 M20 9 l4 -4 M20 31 l-4 4 M20 31 l4 4" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Two champagne flutes clinking, with bubbles and a burst (viewBox 0 0 140 120). */
export function Champagne({ gid, className }: G) {
  const p = `url(#${gid}-foil)`;
  const flute = (rot: number, cx: number) => (
    <g transform={`rotate(${rot} ${cx} 108)`}>
      <path d={`M${cx - 11} 16 C ${cx - 12} 40 ${cx - 9} 58 ${cx} 64 C ${cx + 9} 58 ${cx + 12} 40 ${cx + 11} 16 Z`} fill="rgba(255,255,255,.55)" stroke={p} strokeWidth="1.6" />
      <path d={`M${cx - 10.4} 30 C ${cx - 10.6} 44 ${cx - 8} 57 ${cx} 62 C ${cx + 8} 57 ${cx + 10.6} 44 ${cx + 10.4} 30 Z`} fill="#f3d98c" opacity="0.85" />
      <path d={`M${cx} 64 V100 M${cx - 12} 104 C ${cx - 6} 100 ${cx + 6} 100 ${cx + 12} 104`} fill="none" stroke={p} strokeWidth="1.8" strokeLinecap="round" />
      {[36, 44, 50].map((y, i) => <circle key={y} cx={cx - 3 + i * 3} cy={y} r="1.1" fill="#fff" opacity="0.85" />)}
    </g>
  );
  return (
    <svg className={className} viewBox="0 0 140 120" role="img" aria-label="Two champagne glasses">
      {flute(-16, 52)}
      {flute(16, 88)}
      <g stroke={p} strokeWidth="1.4" strokeLinecap="round">
        <path d="M70 8 V0 M58 12 L52 5 M82 12 L88 5 M50 20 L42 18 M90 20 L98 18" />
      </g>
    </svg>
  );
}

/** Abstract geometric shapes for the modern business design (viewBox 0 0 100 140, full card). */
export function LaunchShapes({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 140" preserveAspectRatio="none" aria-hidden="true">
      <path d="M100 0 V40 C 78 40 60 24 60 0 Z" fill="#14254f" />
      <path d="M100 0 V26 C 86 26 74 14 74 0 Z" fill="#e46f55" />
      <circle cx="6" cy="132" r="16" fill="#e46f55" opacity="0.9" />
      <circle cx="6" cy="132" r="9" fill="#f6c7a8" />
      <path d="M78 136 H100 M84 132 H100" stroke="#14254f" strokeWidth="0.6" />
    </svg>
  );
}

/** Three empty instant-photo frames, tilted, with tiny sketched scenes (viewBox 0 0 200 100). */
export function PolaroidStack({ className }: { className?: string }) {
  const frame = (x: number, y: number, r: number, scene: number) => (
    <g transform={`rotate(${r} ${x + 30} ${y + 36})`}>
      <rect x={x} y={y} width="60" height="72" rx="1.5" fill="#fffdf8" stroke="rgba(0,0,0,.08)" />
      <rect x={x + 5} y={y + 5} width="50" height="48" fill={['#cfe0e3', '#f3dcc8', '#dbe6d2'][scene]} />
      {scene === 0 && <path d={`M${x + 5} ${y + 44} l 14 -14 l 10 10 l 8 -6 l 18 14 V${y + 53} H${x + 5} Z`} fill="#8aa6a8" />}
      {scene === 1 && <><circle cx={x + 30} cy={y + 24} r="7" fill="#f2b36b" /><path d={`M${x + 5} ${y + 42} H${x + 55} V${y + 53} H${x + 5} Z`} fill="#e39b78" /></>}
      {scene === 2 && <><circle cx={x + 22} cy={y + 30} r="6" fill="#7a8f6c" /><circle cx={x + 38} cy={y + 30} r="6" fill="#93a585" /><path d={`M${x + 12} ${y + 53} C ${x + 14} ${y + 38} ${x + 30} ${y + 38} ${x + 30} ${y + 53} M${x + 28} ${y + 53} C ${x + 30} ${y + 38} ${x + 46} ${y + 38} ${x + 48} ${y + 53}`} fill="#7a8f6c" /></>}
      <path d={`M${x + 14} ${y + 63} q 6 -3 12 0 t 12 0`} fill="none" stroke="#9a8a78" strokeWidth="0.8" />
    </g>
  );
  return (
    <svg className={className} viewBox="0 0 200 100" role="img" aria-label="Old photos">
      {frame(18, 16, -9, 0)}
      {frame(122, 14, 8, 2)}
      {frame(70, 8, -1, 1)}
      <rect x="90" y="2" width="20" height="9" fill="rgba(240,220,170,.75)" transform="rotate(-4 100 6)" />
    </svg>
  );
}
