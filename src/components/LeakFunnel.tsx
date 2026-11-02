import React, { useEffect, useRef } from 'react';
import type { Funnel } from '../data/leadScore';
import { fmtMoney } from '../data/leadScore';

/* Results-page version of the internal "45 booked, 6 showed" leak diagram (2026-10-16): a funnel of
   dots on the left, people dripping out in coral at the stages that leak, the numbers on the right. */

const FLOW = '#5EEAD4';
const LEAK = '#FF8A73';
const show = (n: number) => (n > 0 && n < 1 ? 'under 1' : Math.round(n).toLocaleString('en-US'));

/* Shared canvas engine: dots pour down a funnel shaped by the stage counts and drip out in coral at
   the stages marked as leaks. The funnel lines up with the <li> rows of the list next to it. */
export function useLeakCanvas(canvas: React.RefObject<HTMLCanvasElement>, list: React.RefObject<HTMLOListElement>,
                              stages: { n: number; leak?: unknown }[], speed = 1) {
  useEffect(() => {
    const cv = canvas.current, ol = list.current;
    if (!cv || !ol) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, raf = 0;
    let segs: { y: number; w: number; leak: boolean; top: number }[] = [];
    let parts: { y: number; u: number; v: number }[] = [];
    let drips: { x: number; y: number; vx: number; vy: number; a: number }[] = [];
    const rows = Array.from(ol.querySelectorAll<HTMLLIElement>('li'));
    const maxN = Math.max(...stages.map((s) => s.n), 1);

    const layout = () => {
      const r = cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; cv.width = W * dpr; cv.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Measured against the canvas itself, so the page's entrance animation and wrapping can't throw it off.
      const top = r.top;
      segs = stages.map((s, i) => {
        const rr = rows[i].getBoundingClientRect();
        const frac = Math.sqrt(Math.max(s.n, 0.3) / maxN);
        return { y: rr.top - top + rr.height / 2, top: rr.top - top, w: 8 + frac * (W * 0.8 - 8), leak: !!s.leak };
      });
    };
    const widthAt = (y: number) => {
      if (y <= segs[0].y) return segs[0].w;
      for (let i = 1; i < segs.length; i++) if (y <= segs[i].y) { const a = segs[i - 1], b = segs[i], t = (y - a.y) / (b.y - a.y); return a.w + (b.w - a.w) * t; }
      return segs[segs.length - 1].w;
    };
    const cx = () => W * 0.5;
    const pipe = () => {
      ctx.clearRect(0, 0, W, cv.height);
      ctx.beginPath();
      const ys: number[] = [];
      for (let y = segs[0].y; y <= segs[segs.length - 1].y; y += 4) ys.push(y);
      ys.forEach((y, i) => { const x = cx() - widthAt(y) / 2; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); });
      ys.slice().reverse().forEach((y) => ctx.lineTo(cx() + widthAt(y) / 2, y));
      ctx.closePath(); ctx.fillStyle = 'rgba(94,234,212,.08)'; ctx.fill();
      ctx.strokeStyle = 'rgba(94,234,212,.35)'; ctx.lineWidth = 1; ctx.stroke();
    };
    let frame = 0;
    const step = () => {
      if (frame++ % 20 === 0) layout();
      pipe();
      for (let k = 0; k < 2; k++) parts.push({ y: segs[0].y, u: Math.random() - 0.5, v: 0.6 + Math.random() * 0.6 });
      ctx.fillStyle = FLOW;
      parts = parts.filter((p) => {
        const before = widthAt(p.y); p.y += p.v * 1.5 * speed; const now = widthAt(p.y);
        if (now < before && Math.random() > now / before) {
          if (segs.some((s) => s.leak && p.y > s.top - 24 && p.y < s.y + 6)) {
            drips.push({ x: cx() + (p.u > 0 ? 1 : -1) * now / 2, y: p.y, vx: (p.u > 0 ? 1 : -1) * (0.5 + Math.random()), vy: 0, a: 1 });
          }
          return false;
        }
        if (p.y > segs[segs.length - 1].y) return false;
        ctx.globalAlpha = 0.85; ctx.fillRect(cx() + p.u * now - 1, p.y - 1, 2.2, 2.2);
        return true;
      });
      ctx.fillStyle = LEAK;
      drips = drips.filter((d) => { d.x += d.vx; d.vy += 0.08; d.y += d.vy; d.a -= 0.014; ctx.globalAlpha = Math.max(d.a, 0); ctx.fillRect(d.x - 1.3, d.y - 1.3, 2.6, 2.6); return d.a > 0 && d.x > 0 && d.x < W; });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(step);
    };
    const start = () => { layout(); if (reduce) pipe(); else { cancelAnimationFrame(raf); step(); } };
    const onResize = () => { layout(); if (reduce) pipe(); };
    start();
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, [stages, speed]);

}

export const LeakFunnel: React.FC<{ funnel: Funnel }> = ({ funnel }) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const list = useRef<HTMLOListElement>(null);
  useLeakCanvas(canvas, list, funnel.stages);

  return (
    <section className="mt-12" aria-labelledby="funnel-h">
      <h2 id="funnel-h" className="display text-[28px] sm:text-[34px] leading-tight font-extrabold">Your funnel, {funnel.basis}</h2>
      <p className="mt-2 text-[16px] text-[#A9B4C4]">Worked out from your answers. The coral steps are where people fall out.</p>
      <div className="mt-6 grid grid-cols-[64px_1fr] sm:grid-cols-[120px_1fr] gap-3 sm:gap-6">
        <canvas ref={canvas} className="w-full h-full" aria-hidden="true" />
        <ol ref={list} className="divide-y divide-white/10">
          {funnel.stages.map((s) => (
            <li key={s.id} className={`flex items-center justify-between gap-4 py-4 sm:py-5 px-3 sm:px-4 ${s.leak ? 'bg-[#FF8A73]/[0.07] rounded-xl' : ''}`}>
              <div className="min-w-0">
                <p className="font-semibold text-[16px] sm:text-[17px] flex flex-wrap items-center gap-2">
                  {s.label}
                  {s.leak && <span className="text-[11px] font-bold tracking-wider text-[#FF8A73] border border-[#FF8A73]/60 rounded-full px-2 py-0.5">LEAK</span>}
                </p>
                <p className={`mt-1 text-[14px] ${s.leak ? 'text-[#FF8A73] font-medium' : 'text-[#A9B4C4]'}`}>{s.leak || s.sub}</p>
              </div>
              <span className={`shrink-0 whitespace-nowrap display text-[28px] sm:text-[36px] font-extrabold tabular-nums ${s.leak ? 'text-[#FF8A73]' : ''}`}>{show(s.n)}</span>
            </li>
          ))}
        </ol>
      </div>
      {funnel.slipping >= 100 && (
        <div className="mt-6 rounded-2xl border border-[#FF8A73]/40 bg-[#FF8A73]/[0.07] p-5 sm:p-6">
          <p className="text-[17px] sm:text-[18px] leading-relaxed">
            {funnel.perMonth ? 'Those leads bring in about ' : 'Those 100 people bring in about '}<b>{fmtMoney(funnel.monthly)}</b>{funnel.perMonth ? ' a month' : ''}. With follow-up inside 5 minutes and every call answered, the same leads would bring about <b>{fmtMoney(funnel.fixedMonthly)}</b>.
            That’s roughly <b className="text-[#FF8A73]">{fmtMoney(funnel.slipping)}{funnel.perMonth ? ' a month' : ''}</b> slipping through, before spending another dollar on ads.
          </p>
        </div>
      )}
      <p className="mt-3 text-[13px] text-[#7D8899]">A rough model from your answers, not an audit. Real numbers vary.</p>
    </section>
  );
};

/* Intro-screen version (Yousif 2026-11-02, "put the funnel animation showing leaks at different stages"):
   an example funnel so people see what they'll get before they start. Illustrative numbers, labeled as such. */
const EXAMPLE = [
  { id: 'leads', label: 'Leads come in', sub: 'From ads, Google, referrals', n: 100 },
  { id: 'reached', label: 'Hear back fast', sub: '', n: 41, leak: 'Slow follow-up. Most go cold within the hour' },
  { id: 'talked', label: 'Get someone on the phone', sub: '', n: 22, leak: 'Missed calls and voicemail' },
  { id: 'showed', label: 'Show up to the appointment', sub: '', n: 12, leak: 'No reminders, so they forget' },
  { id: 'bought', label: 'Become customers', sub: '', n: 5, leak: 'Nobody follows up after the quote' },
];

export const HeroLeakFunnel: React.FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const list = useRef<HTMLOListElement>(null);
  useLeakCanvas(canvas, list, EXAMPLE, 0.8);

  return (
    <figure className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-6" aria-label="Example funnel: 100 leads in, 5 customers out, with leaks at four stages">
      <div className="grid grid-cols-[52px_1fr] sm:grid-cols-[96px_1fr] gap-3 sm:gap-5">
        <canvas ref={canvas} className="w-full h-full" aria-hidden="true" />
        <ol ref={list} className="space-y-1.5">
          {EXAMPLE.map((s, i) => (
            <li key={s.id} className={`flex items-center justify-between gap-3 py-2.5 sm:py-3 px-3 rounded-xl ${s.leak ? 'bg-[#FF8A73]/[0.07]' : ''}`}
                style={{ animation: `leakIn .5s ${0.15 + i * 0.18}s both cubic-bezier(.16,1,.3,1)` }}>
              <div className="min-w-0">
                <p className="font-semibold text-[15px] sm:text-[16px] leading-snug">{s.label}</p>
                <p className={`mt-0.5 text-[13px] sm:text-[14px] leading-snug ${s.leak ? 'text-[#FF8A73]' : 'text-[#A9B4C4]'}`}>
                  {s.leak && <span className="font-bold tracking-wider text-[11px] mr-1.5">LEAK</span>}{s.leak || s.sub}
                </p>
              </div>
              <span className={`shrink-0 display text-[24px] sm:text-[30px] font-extrabold tabular-nums ${s.leak ? 'text-[#FF8A73]' : ''}`}>{s.n}</span>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="mt-3 text-[13px] text-[#7D8899]">An example of what we usually find. Yours is built from your own answers.</figcaption>
      <style>{`@keyframes leakIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @media (prefers-reduced-motion: reduce){.gq figure li{animation:none!important}}`}</style>
    </figure>
  );
};
