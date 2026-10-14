import type { ReactNode } from 'react';
import type { EventType } from './shared';

// Sticker library for "Customize my card": small hand-built SVGs a host can add, move and
// resize. `c` is the sticker's main color (the host can change it); details keep their own.

interface StickerDef { name: string; vb: string; color: string; draw: (c: string) => ReactNode }
const star = (x: number, y: number, r: number) => `M${x} ${y - r} L${x + r * 0.29} ${y - r * 0.4} L${x + r * 0.95} ${y - r * 0.31} L${x + r * 0.47} ${y + r * 0.15} L${x + r * 0.59} ${y + r * 0.81} L${x} ${y + r * 0.5} L${x - r * 0.59} ${y + r * 0.81} L${x - r * 0.47} ${y + r * 0.15} L${x - r * 0.95} ${y - r * 0.31} L${x - r * 0.29} ${y - r * 0.4} Z`;
const sparkle = (x: number, y: number, r: number) => `M${x} ${y - r} L${x + r * 0.22} ${y - r * 0.22} L${x + r} ${y} L${x + r * 0.22} ${y + r * 0.22} L${x} ${y + r} L${x - r * 0.22} ${y + r * 0.22} L${x - r} ${y} L${x - r * 0.22} ${y - r * 0.22} Z`;
const HEART = 'M50 86 C 18 64 8 44 16 28 C 24 12 44 14 50 30 C 56 14 76 12 84 28 C 92 44 82 64 50 86 Z';

export const STICKERS: Record<string, StickerDef> = {
  rose: { name: 'Rose', vb: '0 0 100 100', color: '#e48b95', draw: (c) => (<>
    <path d="M30 70 C 20 76 12 74 8 66 C 18 62 26 64 30 70 Z M66 74 C 76 82 86 80 92 72 C 82 66 72 68 66 74 Z" fill="#7f9a6e" />
    <circle cx="50" cy="48" r="28" fill={c} /><path d="M50 30 C 62 30 68 42 60 50 C 54 56 42 54 40 46 C 38 38 44 34 50 36 M36 56 C 44 66 60 66 66 56 M30 44 C 30 32 40 24 50 24" fill="none" stroke="rgba(120,30,40,.35)" strokeWidth="2.4" strokeLinecap="round" />
  </>) },
  sprig: { name: 'Leaf sprig', vb: '0 0 100 100', color: '#6f8a5c', draw: (c) => (<>
    <path d="M20 88 C 40 64 56 40 80 12" fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round" />
    {[[30, 74, -40], [40, 60, 20], [48, 50, -50], [58, 38, 30], [66, 28, -60], [74, 20, 40]].map(([x, y, a], i) => <ellipse key={i} cx={x} cy={y} rx="11" ry="4.6" fill={c} transform={`rotate(${a} ${x} ${y})`} opacity={0.85 + (i % 2) * 0.15} />)}
  </>) },
  balloon: { name: 'Balloon', vb: '0 0 100 100', color: '#f08a76', draw: (c) => (<>
    <path d="M50 70 C 46 80 56 86 50 98" fill="none" stroke="rgba(80,60,50,.5)" strokeWidth="1.4" />
    <ellipse cx="50" cy="38" rx="25" ry="31" fill={c} /><path d="M46 69 h8 l-4 5 z" fill={c} />
    <path d="M36 24 C 38 16 44 12 50 12" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" />
  </>) },
  star: { name: 'Star', vb: '0 0 100 100', color: '#e0b84e', draw: (c) => <path d={star(50, 54, 44)} fill={c} /> },
  sparkle: { name: 'Sparkles', vb: '0 0 100 100', color: '#d9b45a', draw: (c) => (<><path d={sparkle(44, 50, 32)} fill={c} /><path d={sparkle(80, 22, 12)} fill={c} /><path d={sparkle(80, 80, 9)} fill={c} /></>) },
  heart: { name: 'Heart', vb: '0 0 100 100', color: '#d4687a', draw: (c) => <path d={HEART} fill={c} /> },
  hearts: { name: 'Two hearts', vb: '0 0 100 100', color: '#d4687a', draw: (c) => (<>
    <path d={HEART} fill={c} transform="translate(-8 4) scale(0.62) rotate(-12 50 50)" /><path d={HEART} fill="none" stroke={c} strokeWidth="5" transform="translate(40 30) scale(0.55) rotate(12 50 50)" />
  </>) },
  rings: { name: 'Rings', vb: '0 0 100 100', color: '#c9a24f', draw: (c) => (<><circle cx="38" cy="58" r="22" fill="none" stroke={c} strokeWidth="6" /><circle cx="62" cy="58" r="22" fill="none" stroke={c} strokeWidth="6" /><path d="M56 30 l6 -8 l6 8 l-6 6 z" fill="#dfeef6" stroke="#8fb0c4" /></>) },
  cap: { name: 'Graduation cap', vb: '0 0 100 100', color: '#1d2b4f', draw: (c) => (<>
    <path d="M28 46 V62 C 28 70 72 70 72 62 V46 Z" fill={c} /><path d="M50 20 L94 38 L50 56 L6 38 Z" fill={c} />
    <path d="M50 38 C 66 42 76 46 80 50 V70" fill="none" stroke="#e0b84e" strokeWidth="2" /><path d="M76 68 h8 l2 12 h-12 z" fill="#e0b84e" />
  </>) },
  diploma: { name: 'Diploma', vb: '0 0 100 100', color: '#9c2f3c', draw: (c) => (<g transform="rotate(-18 50 50)">
    <rect x="12" y="40" width="76" height="20" rx="10" fill="#fbf4e2" stroke="rgba(120,90,40,.4)" /><rect x="46" y="38" width="9" height="24" fill={c} /><path d="M50 62 l-6 12 l6 -4 l6 4 z" fill={c} />
  </g>) },
  cake: { name: 'Cake', vb: '0 0 100 100', color: '#efb2b4', draw: (c) => (<>
    <rect x="18" y="56" width="64" height="32" rx="4" fill={c} /><rect x="28" y="34" width="44" height="24" rx="3" fill="#fbe3e2" />
    <path d="M18 62 c 6 0 6 6 12 6 s 6 -6 12 -6 s 6 6 12 6 s 6 -6 12 -6 s 6 6 12 6 V56 H18 Z" fill="#fffaf7" />
    {[40, 50, 60].map((x) => <g key={x}><rect x={x - 1.6} y="20" width="3.2" height="14" fill="#9fc9b9" /><path d={`M${x} 10 c 4 4 3 9 0 9 c -3 0 -4 -5 0 -9 z`} fill="#f6b23e" /></g>)}
  </>) },
  gift: { name: 'Gift', vb: '0 0 100 100', color: '#6fb39c', draw: (c) => (<>
    <rect x="16" y="40" width="68" height="48" rx="3" fill={c} /><rect x="12" y="30" width="76" height="14" rx="3" fill={c} />
    <rect x="45" y="30" width="10" height="58" fill="#f6d36b" /><path d="M50 30 C 36 14 22 24 34 30 Z M50 30 C 64 14 78 24 66 30 Z" fill="#f6d36b" />
  </>) },
  confetti: { name: 'Confetti', vb: '0 0 100 100', color: '#f08a76', draw: (c) => (<>
    {[[20, 30, c], [70, 20, '#e9b949'], [40, 70, '#6fb39c'], [84, 62, '#9b84c9'], [56, 44, c], [14, 76, '#5b8bd6'], [34, 14, '#e57a9b'], [78, 88, '#e9b949']].map(([x, y, col], i) => (
      i % 2 ? <circle key={i} cx={x} cy={y} r="4.4" fill={String(col)} /> : <rect key={i} x={Number(x) - 2.5} y={Number(y) - 7} width="5" height="14" rx="1.5" fill={String(col)} transform={`rotate(${i * 37} ${x} ${y})`} />
    ))}
  </>) },
  champagne: { name: 'Champagne', vb: '0 0 100 100', color: '#d9b45a', draw: (c) => (<>
    <path d="M38 8 C 36 30 40 44 50 48 C 60 44 64 30 62 8 Z" fill="rgba(255,255,255,.6)" stroke={c} strokeWidth="3" />
    <path d="M39 20 C 39 34 42 43 50 46 C 58 43 61 34 61 20 Z" fill="#f3d98c" /><path d="M50 48 V84 M36 90 C 44 84 56 84 64 90" fill="none" stroke={c} strokeWidth="3.4" strokeLinecap="round" />
  </>) },
  snowflake: { name: 'Snowflake', vb: '0 0 100 100', color: '#7fa7c9', draw: (c) => (<g stroke={c} strokeWidth="4" strokeLinecap="round" fill="none">
    {[0, 60, 120].map((a) => <path key={a} transform={`rotate(${a} 50 50)`} d="M50 6 V94 M50 22 l-10 -10 M50 22 l10 -10 M50 78 l-10 10 M50 78 l10 10" />)}
  </g>) },
  tree: { name: 'Pine tree', vb: '0 0 100 100', color: '#2f6b4f', draw: (c) => (<>
    <path d="M50 10 L72 40 H62 L80 64 H66 L86 88 H14 L34 64 H20 L38 40 H28 Z" fill={c} /><rect x="45" y="88" width="10" height="10" fill="#6b4e36" />
    <path d={star(50, 10, 8)} fill="#e0b84e" />{[[40, 52], [60, 60], [46, 76], [66, 80], [34, 80]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill={i % 2 ? '#c73a4e' : '#e0b84e'} />)}
  </>) },
  crown: { name: 'Crown', vb: '0 0 100 100', color: '#d9a14e', draw: (c) => (<>
    <path d="M14 76 L10 30 L32 50 L50 20 L68 50 L90 30 L86 76 Z" fill={c} /><rect x="14" y="76" width="72" height="10" rx="2" fill={c} />
    {[[10, 30], [50, 20], [90, 30]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill="#e57a9b" />)}<circle cx="50" cy="62" r="5" fill="#9b84c9" />
  </>) },
  starofdavid: { name: 'Star of David', vb: '0 0 100 100', color: '#3d5a9e', draw: (c) => (<g fill="none" stroke={c} strokeWidth="5" strokeLinejoin="round"><path d="M50 8 L88 74 H12 Z" /><path d="M50 92 L12 26 H88 Z" /></g>) },
  house: { name: 'House', vb: '0 0 100 100', color: '#c06a45', draw: (c) => (<>
    <path d="M16 48 L50 18 L84 48" fill="none" stroke="#3d3a35" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M24 44 V88 H76 V44 L50 22 Z" fill="#fbf4ea" stroke="#3d3a35" strokeWidth="3" strokeLinejoin="round" /><rect x="42" y="60" width="16" height="28" fill={c} />
  </>) },
  key: { name: 'Key', vb: '0 0 100 100', color: '#c9a24f', draw: (c) => (<g fill="none" stroke={c} strokeWidth="6" strokeLinecap="round"><circle cx="30" cy="40" r="16" /><path d="M42 50 L84 84 M70 72 l-8 8 M78 80 l-6 6" /></g>) },
  sun: { name: 'Sun', vb: '0 0 100 100', color: '#f0a64e', draw: (c) => (<>
    <circle cx="50" cy="50" r="20" fill={c} />{Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return <line key={i} x1={50 + Math.cos(a) * 28} y1={50 + Math.sin(a) * 28} x2={50 + Math.cos(a) * 42} y2={50 + Math.sin(a) * 42} stroke={c} strokeWidth="4" strokeLinecap="round" />; })}
  </>) },
  moon: { name: 'Moon and stars', vb: '0 0 100 100', color: '#e9c46a', draw: (c) => (<><path d="M54 12 A 38 38 0 1 0 90 62 A 30 30 0 1 1 54 12 Z" fill={c} /><path d={sparkle(22, 22, 8)} fill={c} /><path d={sparkle(84, 20, 6)} fill={c} /></>) },
  bow: { name: 'Bow', vb: '0 0 100 100', color: '#e48b95', draw: (c) => (<>
    <path d="M50 46 C 30 24 8 30 14 46 C 18 58 36 56 50 50 Z M50 46 C 70 24 92 30 86 46 C 82 58 64 56 50 50 Z" fill={c} />
    <path d="M46 52 L36 86 L44 80 L48 90 L50 54 Z M54 52 L64 86 L56 80 L52 90 L50 54 Z" fill={c} opacity="0.85" /><circle cx="50" cy="48" r="7" fill={c} stroke="rgba(0,0,0,.15)" />
  </>) },
  music: { name: 'Music notes', vb: '0 0 100 100', color: '#5b4a8a', draw: (c) => (<>
    <path d="M36 74 V22 L80 12 V64" fill="none" stroke={c} strokeWidth="5" strokeLinejoin="round" /><path d="M36 30 L80 20" stroke={c} strokeWidth="9" />
    <ellipse cx="28" cy="76" rx="10" ry="8" fill={c} /><ellipse cx="72" cy="66" rx="10" ry="8" fill={c} />
  </>) },
  'frame-round': { name: 'Round frame', vb: '0 0 100 100', color: '#c9a24f', draw: (c) => (<>
    <circle cx="50" cy="50" r="44" fill="none" stroke={c} strokeWidth="1.6" /><circle cx="50" cy="50" r="40" fill="none" stroke={c} strokeWidth="0.8" />
    {Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return <ellipse key={i} cx={50 + Math.cos(a) * 46} cy={50 + Math.sin(a) * 46} rx="3.4" ry="1.4" fill={c} transform={`rotate(${(a * 180) / Math.PI + 90} ${50 + Math.cos(a) * 46} ${50 + Math.sin(a) * 46})`} />; })}
  </>) },
  'frame-square': { name: 'Square frame', vb: '0 0 100 100', color: '#3d3126', draw: (c) => (<g fill="none" stroke={c}><rect x="6" y="6" width="88" height="88" strokeWidth="1.6" /><rect x="11" y="11" width="78" height="78" strokeWidth="0.7" /><path d="M6 20 H20 V6 M80 6 V20 H94 M94 80 H80 V94 M20 94 V80 H6" strokeWidth="1.2" /></g>) },
  'divider-line': { name: 'Divider', vb: '0 0 100 20', color: '#b8913f', draw: (c) => (<><path d="M4 10 H40 M60 10 H96" stroke={c} strokeWidth="0.8" /><path d="M50 3 L57 10 L50 17 L43 10 Z" fill={c} /><circle cx="40" cy="10" r="1.4" fill={c} /><circle cx="60" cy="10" r="1.4" fill={c} /></>) },
  'divider-vine': { name: 'Vine divider', vb: '0 0 100 20', color: '#6f8a5c', draw: (c) => (<>
    <path d="M2 10 C 20 2 30 18 50 10 C 70 2 80 18 98 10" fill="none" stroke={c} strokeWidth="1" />
    {[[16, 7, -30], [34, 13, 30], [66, 7, -30], [84, 13, 30]].map(([x, y, a], i) => <ellipse key={i} cx={x} cy={y} rx="4.4" ry="1.8" fill={c} transform={`rotate(${a} ${x} ${y})`} />)}
  </>) },
};

const COMMON = ['star', 'sparkle', 'heart', 'confetti', 'frame-round', 'frame-square', 'divider-line', 'divider-vine'];
export const STICKERS_FOR: Record<EventType, string[]> = {
  wedding: ['rose', 'sprig', 'rings', 'hearts', 'bow', 'champagne', ...COMMON],
  birthday: ['balloon', 'cake', 'gift', 'crown', 'music', 'champagne', ...COMMON],
  graduation: ['cap', 'diploma', 'balloon', 'champagne', ...COMMON],
  baby: ['moon', 'balloon', 'bow', 'hearts', 'sprig', ...COMMON],
  bridal: ['rose', 'sprig', 'rings', 'bow', 'champagne', 'hearts', ...COMMON],
  engagement: ['rings', 'hearts', 'champagne', 'rose', 'sprig', ...COMMON],
  anniversary: ['rings', 'hearts', 'rose', 'champagne', 'sprig', ...COMMON],
  quince: ['crown', 'rose', 'bow', 'balloon', 'music', ...COMMON],
  mitzvah: ['starofdavid', 'music', 'gift', 'champagne', ...COMMON],
  retirement: ['sun', 'champagne', 'sprig', 'gift', 'balloon', ...COMMON],
  housewarming: ['house', 'key', 'sprig', 'champagne', 'gift', ...COMMON],
  holiday: ['tree', 'snowflake', 'gift', 'bow', 'champagne', ...COMMON],
  business: ['champagne', 'balloon', 'music', ...COMMON],
  reunion: ['hearts', 'sun', 'music', 'balloon', 'house', ...COMMON],
  custom: Object.keys(STICKERS).filter((k) => !COMMON.includes(k)).concat(COMMON),
};

/** One sticker drawn at its natural proportions. */
export function StickerArt({ k, color, className }: { k: string; color?: string; className?: string }) {
  const d = STICKERS[k];
  if (!d) return null;
  return <svg className={className} viewBox={d.vb} aria-hidden="true">{d.draw(color || d.color)}</svg>;
}
