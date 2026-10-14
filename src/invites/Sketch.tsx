import { memo, useMemo, type CSSProperties, type ReactNode } from 'react';
import type { EventType, Figures, ThemeId } from './shared';
import { occasionOf } from './InvitationCard';
import './sketch.css';

// "Drawing itself" opening: an ink sketch (the couple at their ceremony, or the celebration's
// own scene: a cake, a cap, a house...), drawn with stroke-dashoffset (pathLength=1 on every
// line), then washed with watercolor and touched with gold. Hand-built paths only.

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


// ---------- every other kind of celebration: its own drawing (viewBox 320 x 300) ----------
const circ = (x: number, y: number, r: number) => `M${x - r} ${y} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0`;
const starP = (x: number, y: number, r: number) => `M${x} ${y - r} L${x + r * 0.3} ${y - r * 0.4} L${x + r * 0.95} ${y - r * 0.3} L${x + r * 0.48} ${y + r * 0.15} L${x + r * 0.6} ${y + r * 0.8} L${x} ${y + r * 0.5} L${x - r * 0.6} ${y + r * 0.8} L${x - r * 0.48} ${y + r * 0.15} L${x - r * 0.95} ${y - r * 0.3} L${x - r * 0.3} ${y - r * 0.4} Z`;
const balloon = (x: number, y: number, r: number) => `M${x} ${y - r} C ${x - r * 0.95} ${y - r} ${x - r * 1.05} ${y + r * 0.5} ${x - r * 0.4} ${y + r * 0.95} C ${x - r * 0.2} ${y + r * 1.1} ${x} ${y + r * 1.15} ${x} ${y + r * 1.15} C ${x} ${y + r * 1.15} ${x + r * 0.2} ${y + r * 1.1} ${x + r * 0.4} ${y + r * 0.95} C ${x + r * 1.05} ${y + r * 0.5} ${x + r * 0.95} ${y - r} ${x} ${y - r} Z`;
const rose = (x: number, y: number) => `M${x} ${y} c 8 -6 14 4 6 10 c -10 6 -18 -6 -10 -14 c 10 -8 26 0 22 14 c -4 12 -26 14 -30 0`;
const HEART = (x: number, y: number, s = 1) => `M${x} ${y + 14 * s} C ${x - 5 * s} ${y + 8 * s} ${x - 11 * s} ${y + 6 * s} ${x - 11 * s} ${y} C ${x - 11 * s} ${y - 5 * s} ${x - 5 * s} ${y - 7 * s} ${x} ${y - 2 * s} C ${x + 5 * s} ${y - 7 * s} ${x + 11 * s} ${y - 5 * s} ${x + 11 * s} ${y} C ${x + 11 * s} ${y + 6 * s} ${x + 5 * s} ${y + 8 * s} ${x} ${y + 14 * s} Z`;

export function typeScene(type: EventType): { lines: L[]; wash: L[] } {
  switch (type) {
    case 'birthday':
      return {
        lines: [
          { d: 'M40 288 H280', t: 0, dur: 0.6, w: 0.9 },
          { d: 'M104 288 V236 H216 V288', t: 0.1, dur: 0.7, w: 1.3 },
          { d: 'M104 244 C 116 244 116 254 128 254 C 140 254 140 244 152 244 C 164 244 164 256 176 256 C 188 256 188 244 200 244 C 210 244 210 252 216 252', t: 0.6, dur: 0.5 },
          { d: 'M124 236 V200 H196 V236', t: 0.75, dur: 0.5, w: 1.2 },
          { d: 'M144 200 V180 M160 200 V176 M176 200 V180', t: 1.15, dur: 0.3 },
          { d: 'M144 168 c 5 5 4 10 0 10 c -4 0 -5 -5 0 -10 Z M160 164 c 5 5 4 10 0 10 c -4 0 -5 -5 0 -10 Z M176 168 c 5 5 4 10 0 10 c -4 0 -5 -5 0 -10 Z', t: 1.4, dur: 0.3, cls: 'sk-flame' },
          { d: balloon(62, 84, 26), t: 0.2, dur: 0.6, w: 1.2 },
          { d: 'M62 114 C 56 150 72 180 66 220', t: 0.7, dur: 0.5, w: 0.7 },
          { d: balloon(258, 68, 26), t: 0.35, dur: 0.6, w: 1.2 },
          { d: 'M258 98 C 266 140 250 170 256 214', t: 0.85, dur: 0.5, w: 0.7 },
          { d: balloon(224, 124, 17), t: 0.5, dur: 0.5 },
          { d: 'M224 144 C 218 170 232 196 228 226', t: 0.95, dur: 0.4, w: 0.7 },
        ],
        wash: [
          { d: 'M104 288 V236 H216 V288 Z', t: 0, cls: 'sk-wash-pink' },
          { d: 'M124 236 V200 H196 V236 Z', t: 0, cls: 'sk-wash-cream' },
          { d: balloon(62, 84, 26), t: 0, cls: 'sk-wash-coral' },
          { d: balloon(258, 68, 26), t: 0, cls: 'sk-wash-gold' },
          { d: balloon(224, 124, 17), t: 0, cls: 'sk-wash-mint' },
        ],
      };
    case 'graduation':
      return {
        lines: [
          { d: 'M160 70 L262 108 L160 146 L58 108 Z', t: 0, dur: 0.8, w: 1.4 },
          { d: 'M104 128 V160 C 104 176 216 176 216 160 V128', t: 0.5, dur: 0.6, w: 1.2 },
          { d: 'M160 108 C 196 116 222 124 232 134 V188', t: 1.0, dur: 0.4 },
          { d: 'M226 186 h12 l4 22 h-20 z', t: 1.3, dur: 0.3, cls: 'sk-goldline' },
          { d: 'M66 236 C 60 246 66 266 76 264 L252 234 C 262 232 258 212 250 214 L72 244', t: 1.1, dur: 0.7, w: 1.1 },
          { d: 'M156 230 L162 262 M150 234 L144 266', t: 1.6, dur: 0.3, cls: 'sk-redline' },
        ],
        wash: [
          { d: 'M160 70 L262 108 L160 146 L58 108 Z', t: 0, cls: 'sk-wash-navy' },
          { d: 'M104 128 V160 C 104 176 216 176 216 160 V128 Z', t: 0, cls: 'sk-wash-navy' },
          { d: 'M66 236 C 60 246 66 266 76 264 L252 234 C 262 232 258 212 250 214 Z', t: 0, cls: 'sk-wash-cream' },
        ],
      };
    case 'baby':
      return {
        lines: [
          { d: 'M190 40 A 70 70 0 1 0 250 150 A 56 56 0 1 1 190 40 Z', t: 0, dur: 1.0, w: 1.3 },
          { d: 'M40 260 C 26 260 22 240 40 236 C 40 214 70 210 78 228 C 86 208 118 212 118 234 C 134 230 146 256 128 262 Z', t: 0.4, dur: 0.8 },
          { d: 'M170 284 C 158 284 152 266 168 262 C 170 244 196 242 202 258 C 212 240 240 248 238 266 C 254 266 258 284 244 286 Z', t: 0.6, dur: 0.8 },
          { d: 'M80 0 V60 M120 0 V90', t: 0.9, dur: 0.4, w: 0.7 },
          { d: `${starP(80, 72, 11)} ${starP(120, 102, 9)}`, t: 1.2, dur: 0.4, cls: 'sk-goldline' },
          { d: 'M196 98 q 5 4 10 0 M220 108 q 5 4 10 0', t: 1.4, dur: 0.25, w: 0.9 },
        ],
        wash: [
          { d: 'M190 40 A 70 70 0 1 0 250 150 A 56 56 0 1 1 190 40 Z', t: 0, cls: 'sk-wash-gold' },
          { d: 'M40 260 C 26 260 22 240 40 236 C 40 214 70 210 78 228 C 86 208 118 212 118 234 C 134 230 146 256 128 262 Z', t: 0, cls: 'sk-wash-sky' },
          { d: 'M170 284 C 158 284 152 266 168 262 C 170 244 196 242 202 258 C 212 240 240 248 238 266 C 254 266 258 284 244 286 Z', t: 0, cls: 'sk-wash-sky' },
        ],
      };
    case 'bridal':
      return {
        lines: [
          { d: circ(160, 118, 26), t: 0, dur: 0.6, w: 1.2 },
          { d: circ(120, 140, 20), t: 0.2, dur: 0.5 },
          { d: circ(200, 140, 20), t: 0.3, dur: 0.5 },
          { d: `${rose(156, 112)} ${rose(116, 136)} ${rose(196, 136)}`, t: 0.6, dur: 0.6, w: 0.9 },
          { d: 'M96 150 C 80 150 70 166 74 174 C 86 172 96 162 96 150 Z M224 150 C 240 150 250 166 246 174 C 234 172 224 162 224 150 Z', t: 0.7, dur: 0.4, cls: 'sk-leaf' },
          { d: 'M150 156 L140 250 M160 160 V256 M170 156 L180 250', t: 0.9, dur: 0.5 },
          { d: 'M136 210 C 150 222 170 222 184 210 M150 216 L136 262 M170 216 L184 262', t: 1.3, dur: 0.5, cls: 'sk-redline' },
        ],
        wash: [
          { d: circ(160, 118, 26), t: 0, cls: 'sk-wash-pink' },
          { d: circ(120, 140, 20), t: 0, cls: 'sk-wash-blush' },
          { d: circ(200, 140, 20), t: 0, cls: 'sk-wash-blush' },
        ],
      };
    case 'engagement':
      return {
        lines: [
          { d: circ(160, 196, 62), t: 0, dur: 1.0, w: 1.5 },
          { d: circ(160, 196, 50), t: 0.3, dur: 0.9, w: 0.8 },
          { d: 'M146 136 L152 126 H168 L174 136', t: 0.9, dur: 0.3 },
          { d: 'M130 98 L146 78 H174 L190 98 L160 128 Z', t: 1.1, dur: 0.5, w: 1.2 },
          { d: 'M130 98 H190 M146 78 L152 98 L160 128 L168 98 L174 78 M152 98 L160 78 L168 98', t: 1.45, dur: 0.4, w: 0.7 },
        ],
        wash: [
          { d: `${circ(160, 196, 62)} ${circ(160, 196, 50)}`, t: 0, cls: 'sk-wash-gold sk-evenodd' },
          { d: 'M130 98 L146 78 H174 L190 98 L160 128 Z', t: 0, cls: 'sk-wash-ice' },
        ],
      };
    case 'anniversary':
      return {
        lines: [
          { d: circ(128, 190, 52), t: 0, dur: 0.9, w: 1.5 },
          { d: circ(192, 190, 52), t: 0.25, dur: 0.9, w: 1.5 },
          { d: `${circ(128, 190, 42)} ${circ(192, 190, 42)}`, t: 0.6, dur: 0.8, w: 0.7 },
          { d: HEART(160, 84, 2), t: 1.3, dur: 0.5, cls: 'sk-heart' },
        ],
        wash: [
          { d: `${circ(128, 190, 52)} ${circ(128, 190, 42)}`, t: 0, cls: 'sk-wash-gold sk-evenodd' },
          { d: `${circ(192, 190, 52)} ${circ(192, 190, 42)}`, t: 0, cls: 'sk-wash-gold sk-evenodd' },
        ],
      };
    case 'quince':
      return {
        lines: [
          { d: 'M70 200 C 120 216 200 216 250 200', t: 0, dur: 0.6, w: 1.4 },
          { d: 'M76 196 L100 150 L126 182 L144 126 L160 96 L176 126 L194 182 L220 150 L244 196', t: 0.2, dur: 1.0, w: 1.4 },
          { d: `${circ(100, 144, 6)} ${circ(160, 88, 8)} ${circ(220, 144, 6)} ${circ(144, 120, 4)} ${circ(176, 120, 4)}`, t: 1.2, dur: 0.4 },
          { d: `${rose(104, 250)} ${rose(204, 250)}`, t: 1.4, dur: 0.5 },
          { d: 'M90 262 C 76 262 68 274 72 280 C 82 278 90 270 90 262 Z M230 262 C 244 262 252 274 248 280 C 238 278 230 270 230 262 Z', t: 1.6, dur: 0.3, cls: 'sk-leaf' },
        ],
        wash: [
          { d: 'M76 196 L100 150 L126 182 L144 126 L160 96 L176 126 L194 182 L220 150 L244 196 C 200 210 120 210 76 196 Z', t: 0, cls: 'sk-wash-gold' },
          { d: `${circ(100, 144, 6)} ${circ(160, 88, 8)} ${circ(220, 144, 6)}`, t: 0, cls: 'sk-wash-pink' },
        ],
      };
    case 'mitzvah':
      return {
        lines: [
          { d: 'M160 46 L236 178 H84 Z', t: 0, dur: 0.9, w: 1.5 },
          { d: 'M160 222 L84 90 H236 Z', t: 0.4, dur: 0.9, w: 1.5 },
          { d: Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `M${160 + Math.cos(a) * 96} ${134 + Math.sin(a) * 96} L${160 + Math.cos(a) * 112} ${134 + Math.sin(a) * 112}`; }).join(' '), t: 1.2, dur: 0.4, w: 0.7 },
          { d: 'M100 270 H220 M100 252 V288 M220 252 V288 M92 252 H108 M212 252 H228 M92 288 H108 M212 288 H228', t: 1.3, dur: 0.5 },
        ],
        wash: [
          { d: 'M160 46 L236 178 H84 Z', t: 0, cls: 'sk-wash-sky' },
          { d: 'M160 222 L84 90 H236 Z', t: 0, cls: 'sk-wash-sky' },
        ],
      };
    case 'retirement':
      return {
        lines: [
          { d: 'M24 220 H296', t: 0, dur: 0.6 },
          { d: 'M110 220 A 50 50 0 0 1 210 220', t: 0.2, dur: 0.7, w: 1.3 },
          { d: 'M160 150 V130 M114 168 L100 154 M206 168 L220 154 M96 206 H76 M224 206 H244', t: 0.8, dur: 0.4 },
          { d: 'M30 244 C 60 236 90 252 120 244 S 180 236 210 244 S 262 252 292 242', t: 0.5, dur: 0.6, w: 0.9 },
          { d: 'M20 268 C 70 258 120 274 170 266 S 250 260 300 268', t: 0.6, dur: 0.6, w: 0.8 },
          { d: 'M244 226 L244 186 L270 222 Z M240 186 L240 222 L222 222 Z M220 228 H274 L268 236 H226 Z', t: 1.0, dur: 0.5 },
          { d: 'M64 120 q6 -6 12 0 q6 -6 12 0 M100 96 q5 -5 10 0 q5 -5 10 0', t: 1.2, dur: 0.35, w: 0.9 },
        ],
        wash: [
          { d: 'M110 220 A 50 50 0 0 1 210 220 Z', t: 0, cls: 'sk-wash-sun' },
          { d: 'M24 220 H296 V280 H24 Z', t: 0, cls: 'sk-wash-sea' },
        ],
      };
    case 'housewarming':
      return {
        lines: [
          { d: 'M30 288 H300', t: 0, dur: 0.6, w: 0.9 },
          { d: 'M76 160 L160 96 L244 160', t: 0.1, dur: 0.7, w: 1.5 },
          { d: 'M92 150 V288 M228 150 V288', t: 0.4, dur: 0.6, w: 1.2 },
          { d: 'M196 128 V104 H212 V140', t: 0.6, dur: 0.3 },
          { d: 'M146 288 V226 H174 V288', t: 0.85, dur: 0.4 },
          { d: 'M110 186 H136 V212 H110 Z M184 186 H210 V212 H184 Z', t: 1.0, dur: 0.4 },
          { d: 'M204 96 c -8 -8 8 -14 0 -22 c -8 -8 8 -14 0 -22', t: 1.2, dur: 0.4, w: 0.8 },
          { d: `M276 288 V236 ${circ(276, 214, 22)}`, t: 1.1, dur: 0.5 },
        ],
        wash: [
          { d: 'M92 150 V288 H228 V150 L160 100 Z', t: 0, cls: 'sk-wash-cream' },
          { d: 'M146 288 V226 H174 V288 Z', t: 0, cls: 'sk-wash-coral' },
          { d: circ(276, 214, 22), t: 0, cls: 'sk-wash-green' },
        ],
      };
    case 'holiday':
      return {
        lines: [
          { d: 'M160 52 L206 120 H186 L226 180 H200 L246 244 H74 L120 180 H94 L134 120 H114 Z', t: 0, dur: 1.1, w: 1.4 },
          { d: 'M150 244 V276 H170 V244', t: 0.9, dur: 0.3 },
          { d: 'M118 150 C 150 166 180 160 206 146 M102 206 C 140 222 190 222 222 200', t: 1.0, dur: 0.5, w: 0.8, cls: 'sk-goldline' },
          { d: starP(160, 40, 16), t: 1.2, dur: 0.4, cls: 'sk-goldline' },
          { d: `${circ(132, 166, 5)} ${circ(184, 178, 5)} ${circ(150, 214, 5)} ${circ(204, 226, 5)} ${circ(110, 230, 5)}`, t: 1.4, dur: 0.3, cls: 'sk-redline' },
          { d: 'M40 70 v24 M28 82 h24 M32 74 l16 16 M48 74 l-16 16 M276 200 v20 M266 210 h20 M269 203 l14 14 M283 203 l-14 14', t: 1.5, dur: 0.4, w: 0.8 },
        ],
        wash: [
          { d: 'M160 52 L206 120 H186 L226 180 H200 L246 244 H74 L120 180 H94 L134 120 H114 Z', t: 0, cls: 'sk-wash-green' },
          { d: starP(160, 40, 16), t: 0, cls: 'sk-wash-gold' },
        ],
      };
    case 'business':
      return {
        lines: [
          { d: 'M60 288 L110 60 M260 288 L210 60', t: 0.3, dur: 0.7, w: 0.7, cls: 'sk-dash' },
          { d: 'M20 288 V210 H52 V170 H84 V230 H110 V140 H146 V200 H170 V120 H210 V190 H232 V160 H262 V220 H300 V288', t: 0, dur: 1.2, w: 1.2 },
          { d: 'M120 160 H136 M120 176 H136 M180 140 H200 M180 156 H200 M180 172 H200 M60 186 H76 M240 176 H254', t: 0.9, dur: 0.3, w: 0.8 },
          { d: 'M20 252 H300', t: 1.2, dur: 0.6, w: 2.4, cls: 'sk-redline' },
          { d: 'M160 252 C 140 232 126 242 136 252 C 126 262 140 272 160 252 C 180 232 194 242 184 252 C 194 262 180 272 160 252 Z', t: 1.6, dur: 0.4, cls: 'sk-redline' },
        ],
        wash: [
          { d: 'M20 288 V210 H52 V170 H84 V230 H110 V140 H146 V200 H170 V120 H210 V190 H232 V160 H262 V220 H300 V288 Z', t: 0, cls: 'sk-wash-navy' },
        ],
      };
    case 'reunion':
      return {
        lines: [
          { d: 'M20 70 Q 160 120 300 70', t: 0, dur: 0.8, w: 0.8 },
          { d: 'M50 84 L106 92 L98 158 L42 150 Z', t: 0.3, dur: 0.5 },
          { d: 'M132 100 H188 V168 H132 Z', t: 0.45, dur: 0.5 },
          { d: 'M214 92 L270 84 L278 150 L222 158 Z', t: 0.6, dur: 0.5 },
          { d: `${circ(76, 116, 9)} ${circ(160, 128, 9)} ${circ(246, 116, 9)}`, t: 1.0, dur: 0.4, w: 0.9 },
          { d: 'M62 146 C 64 132 88 132 90 148 M146 160 C 148 146 172 146 174 160 M232 148 C 234 134 258 134 260 146', t: 1.15, dur: 0.4, w: 0.9 },
          { d: 'M76 82 V92 M160 96 V104 M242 82 V92', t: 1.1, dur: 0.2 },
          { d: HEART(160, 222, 1.8), t: 1.4, dur: 0.5, cls: 'sk-heart' },
        ],
        wash: [
          { d: 'M50 84 L106 92 L98 158 L42 150 Z', t: 0, cls: 'sk-wash-sky' },
          { d: 'M132 100 H188 V168 H132 Z', t: 0, cls: 'sk-wash-cream' },
          { d: 'M214 92 L270 84 L278 150 L222 158 Z', t: 0, cls: 'sk-wash-mint' },
        ],
      };
    default:
      return {
        lines: [
          { d: 'M108 64 C 106 116 116 146 134 152 C 152 146 160 116 158 64 Z', t: 0, dur: 0.7, w: 1.3 },
          { d: 'M162 64 C 160 116 170 146 188 152 C 206 146 214 116 212 64 Z', t: 0.2, dur: 0.7, w: 1.3 },
          { d: 'M134 152 V236 M110 244 C 122 236 146 236 158 244', t: 0.6, dur: 0.5 },
          { d: 'M188 152 V236 M164 244 C 176 236 200 236 212 244', t: 0.75, dur: 0.5 },
          { d: 'M160 40 V20 M142 46 L130 32 M178 46 L190 32', t: 1.1, dur: 0.3, cls: 'sk-goldline' },
          { d: `${circ(128, 104, 2.4)} ${circ(140, 118, 2)} ${circ(182, 98, 2.4)} ${circ(194, 116, 2)}`, t: 1.3, dur: 0.3, w: 0.8 },
          { d: 'M40 120 l8 10 M270 140 l-6 12 M60 230 l12 -4 M262 236 l10 6 M86 70 l4 10 M240 70 l-6 10', t: 1.5, dur: 0.3, w: 2.2, cls: 'sk-confetti' },
        ],
        wash: [
          { d: 'M110 92 C 112 124 120 144 134 150 C 148 144 156 124 156 92 Z', t: 0, cls: 'sk-wash-gold' },
          { d: 'M164 92 C 166 124 174 144 188 150 C 202 144 210 124 210 92 Z', t: 0, cls: 'sk-wash-gold' },
        ],
      };
  }
}

// Each main line is drawn twice, the second slightly offset and fainter, like a pen
// going over a pencil line. Small details get a single stroke. Slow phones skip the echo.
const Line = ({ l, echo: allowEcho }: { l: L; echo: boolean }) => {
  const style = { '--t': `${l.t}s`, '--dur': `${l.dur ?? 0.5}s`, strokeWidth: l.w ?? 1.15 } as CSSProperties;
  const echo = allowEcho && (l.w ?? 1.15) >= 1 && !l.cls;
  return (
    <>
      <path d={l.d} pathLength={1} className={`sk-line ${l.cls || ''}`} style={style} />
      {echo && <path d={l.d} pathLength={1} className="sk-line sk-echo" style={{ ...style, '--t': `${l.t + 0.06}s` } as CSSProperties} />}
    </>
  );
};

const SPARKLES: [number, number, number][] = [[112, 92, 4], [214, 100, 3.4], [160, 34, 3], [96, 150, 2.6], [228, 160, 2.8]];

/** The finished or drawing sketch. `still` renders it complete (reduced motion). Memoized: the
 *  paths are built once and React never touches them while the strokes animate. */
export const SketchArt = memo(function SketchArt({ theme, figures, showCross, type = 'wedding', still = false, lite = false, className = '' }: { theme: ThemeId; figures: Figures; showCross: boolean; type?: EventType; still?: boolean; lite?: boolean; className?: string }) {
  const art = useMemo(() => {
    if (type !== 'wedding') return { sc: typeScene(type), cp: null, older: false, kind: type as string };
    const occ = occasionOf(theme);
    const kind = occ === 'church' ? 'church' : occ === 'beach' ? 'beach' : occ === 'garden' ? 'garden' : occ === 'barn' ? 'barn' : occ === 'city' ? 'city' : occ === 'destination' ? 'destination' : 'arch';
    const older = occ === 'renewal';
    const sc = scene(kind);
    return { sc: { ...sc, lines: kind === 'church' && !showCross ? sc.lines.filter((l) => l.cls !== 'sk-cross') : sc.lines }, cp: couple(figures, older), older, kind };
  }, [type, theme, figures, showCross]);
  const { sc, cp, older } = art;
  // feet on the ground line, a little larger than life so the couple reads as the subject
  const FIG = 'translate(160 288) scale(1.18) translate(-160 0)';
  const heart = !cp ? null : older
    ? <path className="sk-line sk-gold" pathLength={1} style={{ '--t': '2.25s', '--dur': '0.4s' } as CSSProperties} d="M150 108 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 M160 108 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0" />
    : <path className="sk-line sk-heart" pathLength={1} style={{ '--t': '2.25s', '--dur': '0.4s' } as CSSProperties} d="M161 118 C 156 112 150 110 150 104 C 150 99 156 97 161 102 C 166 97 172 99 172 104 C 172 110 166 112 161 118 Z" />;
  const echo = !lite;
  const fig = (els: ReactNode) => <g transform={FIG}>{els}</g>;
  return (
    <svg className={`sk-art${still ? ' sk-still' : ''} ${className}`} viewBox="0 0 320 300" role="img" aria-label={cp ? 'A sketch of the couple at their wedding' : 'A sketch of the celebration'}>
      <g className="sk-washes">
        {sc.wash.map((w, i) => <path key={i} d={w.d} className={`sk-wash ${w.cls}`} />)}
        {cp && <g transform={FIG}>{cp.wash.map((w, i) => <path key={i} d={w.d} className={`sk-wash ${w.cls}`} />)}</g>}
      </g>
      {sc.lines.map((l, i) => <Line key={`s${i}`} l={l} echo={echo} />)}
      {cp && fig(cp.lines.map((l, i) => <Line key={`f${i}`} l={l} echo={echo} />))}
      {heart && <g transform="translate(0 -28)">{heart}</g>}
      <g className="sk-sparkles">
        {SPARKLES.map(([x, y, r], i) => (
          <path key={i} style={{ '--t': `${2.7 + i * 0.08}s` } as CSSProperties} d={`M${x} ${y - r * 2} L${x + r * 0.45} ${y - r * 0.45} L${x + r * 2} ${y} L${x + r * 0.45} ${y + r * 0.45} L${x} ${y + r * 2} L${x - r * 0.45} ${y + r * 0.45} L${x - r * 2} ${y} L${x - r * 0.45} ${y - r * 0.45} Z`} />
        ))}
      </g>
    </svg>
  );
});
