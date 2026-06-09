import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * Soccer-season urgency bar. The "biggest summer in sports" energy without any
 * trademarked names, teams, or logos. Evergreen 48h rolling countdown per
 * visitor (localStorage) so the urgency never expires to 00:00:00.
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

function Unit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center leading-none">
      <span className="font-mono font-bold text-sm sm:text-base tabular-nums">{value}</span>
      <span className="text-[8px] uppercase tracking-widest opacity-70">{label}</span>
    </div>
  );
}

export default function KickoffBar() {
  const { h, m, s } = format(useRollingCountdown());

  return (
    <div className="relative z-50 w-full overflow-hidden bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-700 text-white">
      {/* pitch-stripe sheen */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0 28px, transparent 28px 56px)',
        }}
      />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center justify-center gap-2 px-4 py-2 text-center sm:flex-row sm:gap-4">
        <p className="text-xs font-semibold sm:text-sm">
          <span aria-hidden="true">⚽</span> The whole world's watching the beautiful game this summer —{' '}
          <span className="font-extrabold">don't watch your competitors score.</span>
        </p>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="hidden text-[10px] font-bold uppercase tracking-wider opacity-80 sm:inline">
              Closes in
            </span>
            <div className="flex items-center gap-1 rounded-lg bg-black/25 px-2 py-1">
              <Unit value={h} label="hrs" />
              <span className="font-mono font-bold opacity-60">:</span>
              <Unit value={m} label="min" />
              <span className="font-mono font-bold opacity-60">:</span>
              <Unit value={s} label="sec" />
            </div>
          </div>

          <Link
            to="/pricing"
            className="rounded-full bg-white px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide text-emerald-700 shadow-sm transition-transform hover:-translate-y-0.5 active:scale-95"
          >
            Claim your spot →
          </Link>
        </div>
      </div>
    </div>
  );
}
