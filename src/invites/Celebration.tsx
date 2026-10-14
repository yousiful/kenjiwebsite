import { useEffect, useRef } from 'react';
import type { EventType, ThemeId } from './shared';

// Party burst on the guest page: confetti, gold flecks and theme shapes (petals, doves,
// bells, shells...) plus a firework for festive designs. One small canvas, about 2.5s of
// heavy motion, then everything settles and the canvas is removed. No libraries.

type Shape = 'rect' | 'circle' | 'petal' | 'heart' | 'star' | 'dove' | 'bell' | 'shell' | 'leaf' | 'plane' | 'balloon' | 'cap' | 'snowflake' | 'david' | 'note';
interface PartyStyle { colors: string[]; shapes: Shape[]; fireworks?: boolean; streamers?: boolean }

const GOLD = ['#c9a24f', '#e9d08a', '#b8913f', '#f3e2a6'];
export const PARTY: Record<ThemeId, PartyStyle> = {
  ivory: { colors: [...GOLD, '#fffaf0'], shapes: ['rect', 'circle', 'star'] },
  waxseal: { colors: ['#7d1f2a', '#c25b62', ...GOLD, '#fbf7ee'], shapes: ['heart', 'rect', 'circle'] },
  blacktie: { colors: ['#111111', '#ffffff', '#c0c0c0', '#8f8f8f'], shapes: ['rect', 'circle', 'star'], streamers: true },
  vellum: { colors: ['#8f7fbf', '#a596cf', '#e3b94f', '#fbf8ef', '#8fa37f'], shapes: ['petal', 'leaf', 'circle'] },
  garden: { colors: ['#f4ded9', '#e59a9c', '#fbe6dc', '#89a083', '#e9d08a'], shapes: ['petal', 'petal', 'leaf', 'circle'] },
  blush: { colors: ['#f6d3c8', '#d9a093', '#fff1ea', '#c18676', '#e9d08a'], shapes: ['petal', 'heart', 'circle'] },
  emerald: { colors: [...GOLD, '#1c5947', '#fbf3e0'], shapes: ['rect', 'star', 'circle'] },
  midnight: { colors: [...GOLD, '#fbf3e0', '#6d86c4'], shapes: ['star', 'rect', 'circle'], fireworks: true },
  deco: { colors: [...GOLD, '#111111', '#fbf3e0'], shapes: ['rect', 'star'], fireworks: true, streamers: true },
  tile: { colors: ['#1f3f8f', '#3d64b8', '#e3b94f', '#fbf8f1'], shapes: ['rect', 'circle', 'star'] },
  minimal: { colors: ['#121212', '#ffffff', '#bdbdbd'], shapes: ['rect', 'circle'], streamers: true },
  kraft: { colors: ['#7f9a8a', '#56705f', '#f1e6d6', '#c9a77c', '#e3b94f'], shapes: ['leaf', 'petal', 'circle'] },
  boho: { colors: ['#c8693f', '#e6c3a1', '#a9502c', '#e7b08c', '#f1dcc4'], shapes: ['petal', 'leaf', 'circle'] },
  couple: { colors: ['#b4626a', '#e8b4ae', '#2b2a33', ...GOLD], shapes: ['heart', 'rect', 'circle'] },
  chapel: { colors: [...GOLD, '#8e2b3c', '#2c4f8a', '#2f6b4f', '#ffffff'], shapes: ['dove', 'bell', 'heart', 'rect'] },
  arbor: { colors: ['#f4ded9', '#e8b4ae', '#fbf3ea', '#6f8a6c', '#89a083'], shapes: ['petal', 'petal', 'leaf'] },
  beach: { colors: ['#5fa2a9', '#9cc9c9', '#f2b98a', '#f2d7c4', '#fdf6ee'], shapes: ['shell', 'circle', 'rect'] },
  barn: { colors: ['#f4c86a', '#e7a07c', '#fbf3ea', '#7a3b2e', '#6f8a5c'], shapes: ['leaf', 'petal', 'circle'] },
  passport: { colors: ['#1f2f57', '#d8b866', '#f3e7c6', '#b4626a'], shapes: ['plane', 'heart', 'rect'], fireworks: true },
  city: { colors: ['#2e2e31', '#e9cfc4', ...GOLD], shapes: ['rect', 'star', 'circle'], fireworks: true, streamers: true },
  renewal: { colors: [...GOLD, '#fffaf0', '#e8b4ae'], shapes: ['heart', 'star', 'circle'] },
  balloons: { colors: ['#f08a76', '#e9b949', '#6fb39c', '#9b84c9', '#e57a9b'], shapes: ['balloon', 'circle', 'rect'], streamers: true },
  cake: { colors: ['#e57a9b', '#f6d36b', '#9fc9b9', '#ffffff', '#b8475f'], shapes: ['rect', 'circle', 'star'], streamers: true },
  confetti: { colors: ['#f08a76', '#e9b949', '#6fb39c', '#9b84c9', '#5b8bd6', '#1d1d22'], shapes: ['rect', 'circle'], streamers: true, fireworks: true },
  neon: { colors: ['#ff5fc8', '#5ff3ff', '#ffe066', '#b98cff'], shapes: ['star', 'circle', 'rect'], fireworks: true },
  gradcap: { colors: [...GOLD, '#1d2b4f', '#ffffff'], shapes: ['cap', 'star', 'rect'], fireworks: true },
  nursery: { colors: ['#bcd6ea', '#f6d9a8', '#ffffff', '#cfe3d6', '#f2c1c9'], shapes: ['star', 'circle', 'heart'] },
  ring: { colors: [...GOLD, '#ffffff', '#e8b4ae'], shapes: ['heart', 'star', 'circle'] },
  crown: { colors: ['#e8a9b8', '#f6d3dc', ...GOLD, '#ffffff'], shapes: ['heart', 'petal', 'star'] },
  mitzvah: { colors: ['#c0c8d8', '#ffffff', '#3d5a9e', '#8fa3c9', '#e9d08a'], shapes: ['david', 'star', 'rect'], fireworks: true },
  sunset: { colors: ['#f3a07f', '#f6c49a', '#fff1c9', '#6f9fb0'], shapes: ['circle', 'rect', 'star'] },
  house: { colors: ['#c06a45', '#8aa676', '#f3d27a', '#ffffff'], shapes: ['leaf', 'heart', 'circle'] },
  winter: { colors: [...GOLD, '#b3263a', '#ffffff'], shapes: ['snowflake', 'star', 'circle'] },
  cheers: { colors: [...GOLD, '#fff8e7'], shapes: ['circle', 'star', 'rect'], fireworks: true, streamers: true },
  launch: { colors: ['#14254f', '#e46f55', '#f6c7a8', '#ffffff'], shapes: ['rect', 'circle'], streamers: true },
  polaroid: { colors: ['#2f5d74', '#e39b78', '#8aa676', '#f3dcc8', '#ffffff'], shapes: ['heart', 'rect', 'circle'] },
};

/** Each kind of celebration throws its own shapes, in the design's colors. */
const TYPE_SHAPES: Partial<Record<EventType, Shape[]>> = {
  birthday: ['balloon', 'rect', 'circle', 'star'],
  graduation: ['cap', 'star', 'rect'],
  baby: ['star', 'heart', 'circle'],
  bridal: ['heart', 'petal', 'circle'],
  engagement: ['heart', 'star', 'rect'],
  anniversary: ['heart', 'star', 'circle'],
  quince: ['heart', 'star', 'petal'],
  mitzvah: ['david', 'star', 'rect'],
  retirement: ['star', 'circle', 'rect', 'note'],
  housewarming: ['heart', 'leaf', 'circle'],
  holiday: ['snowflake', 'star', 'circle'],
  business: ['rect', 'star', 'circle'],
  reunion: ['heart', 'star', 'note'],
};

/** Fewer pieces on slower phones, so the burst stays smooth. */
export function lowEndDevice(): boolean {
  const n = navigator as Navigator & { deviceMemory?: number };
  return (n.hardwareConcurrency || 8) <= 4 || (n.deviceMemory || 8) <= 4;
}

const PATHS: Partial<Record<Shape, string>> = {
  petal: 'M0 -10 C 7 -6 7 6 0 10 C -7 6 -7 -6 0 -10 Z',
  heart: 'M0 9 C -10 2 -11 -6 -5 -8 C -2 -9 0 -6 0 -4 C 0 -6 2 -9 5 -8 C 11 -6 10 2 0 9 Z',
  star: 'M0 -10 L2.4 -2.4 L10 0 L2.4 2.4 L0 10 L-2.4 2.4 L-10 0 L-2.4 -2.4 Z',
  dove: 'M-10 2 C -6 -2 -2 -2 1 0 C 3 -6 8 -9 11 -8 C 8 -5 6 -2 6 1 C 9 1 11 3 12 5 C 6 5 2 6 -2 5 C -5 6 -8 5 -10 2 Z',
  bell: 'M0 -9 C -5 -8 -6 -1 -8 5 L8 5 C 6 -1 5 -8 0 -9 Z M-2 6 a2 2 0 0 0 4 0 Z',
  shell: 'M0 8 C -8 6 -10 -4 -6 -8 C -3 -10 3 -10 6 -8 C 10 -4 8 6 0 8 Z M0 7 L-4 -8 M0 7 L0 -9 M0 7 L4 -8',
  leaf: 'M-10 0 C -4 -7 4 -7 10 0 C 4 7 -4 7 -10 0 Z',
  plane: 'M10 0 L-6 -2 L-9 -7 L-11 -7 L-9 -1 L-10 0 L-9 1 L-11 7 L-9 7 L-6 2 Z',
  balloon: 'M0 -10 C 7 -10 8 -2 5 3 C 3 6 1 7 0 7 C -1 7 -3 6 -5 3 C -8 -2 -7 -10 0 -10 Z M-1.4 7 L1.4 7 L0 9.4 Z',
  cap: 'M0 -6 L11 -1 L0 4 L-11 -1 Z M-6 1.6 L0 4.4 L6 1.6 V6 C 6 8 -6 8 -6 6 Z',
  snowflake: 'M0 -10 L1 -1.6 L8.7 -5 L1.9 0 L8.7 5 L1 1.6 L0 10 L-1 1.6 L-8.7 5 L-1.9 0 L-8.7 -5 L-1 -1.6 Z',
  david: 'M0 -10 L8.7 5 H-8.7 Z M0 10 L-8.7 -5 H8.7 Z',
  note: 'M-6 5 C -6 2 -1 2 -1 5 C -1 8 -6 8 -6 5 Z M-2.4 5 V-8 L7 -10 V-6 L-1 -4.4 V5 Z',
};

interface P { x: number; y: number; vx: number; vy: number; r: number; vr: number; s: number; c: string; shape: Shape | 'spark' | 'ribbon'; life: number; age: number; wob: number; tilt: number }

export function Celebration({ theme, type, onDone }: { theme: ThemeId; type?: EventType; onDone?: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const base = PARTY[theme] || PARTY.ivory;
    const style = { ...base, shapes: (type && TYPE_SHAPES[type]) || base.shapes };
    const few = lowEndDevice() ? 0.55 : 1;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.scale(dpr, dpr);
    const paths: Partial<Record<Shape, Path2D>> = {};
    for (const [k, d] of Object.entries(PATHS)) paths[k as Shape] = new Path2D(d);
    const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
    const parts: P[] = [];
    const small = W < 600;
    const add = (n: number, fn: () => Partial<P>) => { for (let i = 0; i < Math.round(n * few); i++) parts.push({ x: 0, y: 0, vx: 0, vy: 0, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.25, s: 1, c: pick(style.colors), shape: pick(style.shapes), life: 2.6, age: 0, wob: Math.random() * 6, tilt: Math.random(), ...fn() }); };

    // two cannons from the bottom corners, then a gentle fall from the top
    const cannon = (fromLeft: boolean) => add(small ? 34 : 50, () => {
      const ang = (fromLeft ? -62 : -118) + (Math.random() - 0.5) * 34;
      const sp = 9 + Math.random() * 8;
      return { x: fromLeft ? -10 : W + 10, y: H * 0.86, vx: Math.cos((ang * Math.PI) / 180) * sp, vy: Math.sin((ang * Math.PI) / 180) * sp, s: 0.7 + Math.random() * 0.7 };
    });
    cannon(true);
    cannon(false);
    add(small ? 36 : 60, () => ({ x: Math.random() * W, y: -20 - Math.random() * H * 0.4, vx: (Math.random() - 0.5) * 1.2, vy: 1.5 + Math.random() * 2, s: 0.6 + Math.random() * 0.6, life: 2.8 }));
    if (style.streamers) add(small ? 8 : 12, () => ({ x: Math.random() * W, y: -40 - Math.random() * 120, vx: (Math.random() - 0.5) * 1.5, vy: 2.4 + Math.random() * 1.6, shape: 'ribbon', s: 1, life: 2.7 }));
    const bursts: [number, number, number][] = style.fireworks ? [[0.28, 0.24, 0.35], [0.72, 0.18, 0.75]] : [];

    let last = performance.now();
    let t = 0;
    let raf = 0;
    let fired = 0;
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      while (fired < bursts.length && t >= bursts[fired][2]) {
        const [bx, by] = bursts[fired++];
        const c = pick(style.colors);
        const sparks = Math.round((small ? 42 : 60) * few);
        for (let i = 0; i < sparks; i++) {
          const a = (Math.PI * 2 * i) / sparks;
          const sp = 3 + Math.random() * 3.2;
          parts.push({ x: bx * W, y: by * H, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: 0, vr: 0, s: 1, c, shape: 'spark', life: 1.4, age: 0, wob: 0, tilt: 0 });
        }
      }
      ctx.clearRect(0, 0, W, H);
      let alive = 0;
      for (const p of parts) {
        p.age += dt;
        if (p.age > p.life) continue;
        alive++;
        const k = dt * 60;
        if (p.shape === 'spark') { p.vy += 0.06 * k; p.vx *= 0.97; p.vy *= 0.97; }
        else { p.vy = Math.min(p.vy + 0.18 * k, 3.4); p.vx *= 0.985; p.wob += 0.08 * k; p.x += Math.sin(p.wob) * 0.6; }
        p.x += p.vx * k;
        p.y += p.vy * k;
        p.r += p.vr * k;
        const fade = Math.min(1, (p.life - p.age) / 0.6);
        ctx.globalAlpha = fade;
        ctx.fillStyle = p.c;
        if (p.shape === 'spark') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        if (p.shape === 'ribbon') {
          ctx.strokeStyle = p.c;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) ctx.lineTo(Math.sin(p.wob + i) * 5, i * 7);
          ctx.stroke();
        } else if (p.shape === 'rect') {
          ctx.scale(p.s, p.s * (0.35 + Math.abs(Math.sin(p.wob)) * 0.65));
          ctx.fillRect(-4, -6, 8, 12);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, 3 * p.s, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const path = paths[p.shape];
          ctx.scale(p.s * 0.9, p.s * 0.9 * (0.55 + Math.abs(Math.sin(p.wob)) * 0.45));
          if (path) { if (p.shape === 'shell') { ctx.fill(path); ctx.strokeStyle = 'rgba(0,0,0,.15)'; ctx.lineWidth = 0.8; ctx.stroke(path); } else ctx.fill(path); }
        }
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      if (alive > 0 && t < 4) raf = requestAnimationFrame(frame);
      else { ctx.clearRect(0, 0, W, H); onDone?.(); }
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [theme, type, onDone]);
  return <canvas ref={ref} className="kg-confetti" aria-hidden="true" data-testid="confetti" />;
}

/** Reduced-motion stand-in: a few still sparkles, nothing moves. */
export function StaticSparkles() {
  const pts: [number, number, number][] = [[8, 18, 9], [88, 10, 7], [94, 52, 6], [4, 70, 6], [52, 4, 5]];
  return (
    <svg className="kg-sparkles" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {pts.map(([x, y, r], i) => (
        <path key={i} d={`M${x} ${y - r} L${x + r * 0.22} ${y - r * 0.22} L${x + r} ${y} L${x + r * 0.22} ${y + r * 0.22} L${x} ${y + r} L${x - r * 0.22} ${y + r * 0.22} L${x - r} ${y} L${x - r * 0.22} ${y - r * 0.22} Z`} fill="#e9d08a" opacity="0.8" />
      ))}
    </svg>
  );
}
