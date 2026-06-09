import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * Soccer-season urgency bar. The "biggest summer in sports" energy without any
 * trademarked names, teams, or logos. Evergreen 48h rolling countdown per
 * visitor (localStorage) so the urgency never expires to 00:00:00.
 *
 * Fixed at the very top with a predictable 40px (h-10) height; the Navbar is
 * offset to `top-10` so it sits flush beneath this bar.
 */
const WINDOW_MS = 48 * 60 * 60 * 1000;
const STORAGE_KEY = 'kenji_kickoff_deadline';

function useRollingCountdown(): number {
  const [remaining, setRemaining] = useState(WINDOW_MS);

  useEffect(() => {
    let deadline = Number(localStorage.getItem(STORAGE_KEY));
    if (!deadline || Number.isNaN(deadline) || deadline < Date.now()) {
      deadline = Date.now() + WINDOW_MS;
      localStorage.setItem(STORAGE_KEY, String(deadline));
    }
    const tick = () => setRemaining(Math.max(0, deadline - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return remaining;
}

function format(ms: number): { h: string; m: string; s: string } {
  const total = Math.floor(ms / 1000);
  return {
    h: String(Math.floor(total / 3600)).padStart(2, '0'),
    m: String(Math.floor((total % 3600) / 60)).padStart(2, '0'),
    s: String(total % 60).padStart(2, '0'),
  };
}

export default function KickoffBar() {
  const { h, m, s } = format(useRollingCountdown());

  return (
    <div className="fixed top-0 inset-x-0 z-[60] h-10 overflow-hidden bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-700 text-white">
      {/* pitch-stripe sheen */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0 28px, transparent 28px 56px)',
        }}
      />
      <div className="relative mx-auto flex h-full max-w-6xl items-center justify-center gap-3 px-3 sm:gap-4 sm:px-6">
        <p className="truncate text-[11px] font-semibold sm:text-sm">
          <span aria-hidden="true">⚽</span>{' '}
          <span className="hidden sm:inline">
            The whole world is glued to the beautiful game this summer. Don&apos;t get left on the bench.{' '}
          </span>
          <span aria-hidden="true">🔥</span>{' '}
          <span className="font-extrabold">Your shot ends in</span>
        </p>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 rounded-md bg-black/30 px-2 py-0.5 font-mono text-xs font-bold tabular-nums shadow-[0_0_12px_rgba(0,0,0,0.25)] ring-1 ring-white/40 sm:text-sm">
            <span>{h}</span>
            <span className="opacity-60">:</span>
            <span>{m}</span>
            <span className="opacity-60">:</span>
            <span>{s}</span>
          </div>

          <Link
            to="/pricing"
            className="whitespace-nowrap rounded-full bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-emerald-700 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-[0_0_16px_rgba(255,255,255,0.5)] active:scale-95 sm:text-xs"
          >
            Claim your spot →
          </Link>
        </div>
      </div>
    </div>
  );
}
