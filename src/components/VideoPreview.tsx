import { RefObject, useEffect, useState } from 'react';

// Yousif, 2026-10-22: every video preview should look like a Loom share: poster, big white play
// button, and a dark pill showing "1.5x  ~~1 min 18 sec~~ ⚡ 52 sec". Clicking plays at 1.5x
// with sound; viewers can still change speed from the native controls.
const SPEED = 1.5;

function fmt(totalSeconds: number) {
  const s = Math.max(1, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (!m) return `${r} sec`;
  return r ? `${m} min ${r} sec` : `${m} min`;
}

type Props = {
  videoRef: RefObject<HTMLVideoElement>;
  src: string;
  poster?: string;
  label?: string;
  className?: string;
};

export function VideoPreview({ videoRef, src, poster, label = 'Play video', className = '' }: Props) {
  const [started, setStarted] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const read = () => { if (Number.isFinite(el.duration)) setDuration(el.duration); };
    read();
    el.addEventListener('loadedmetadata', read);
    return () => el.removeEventListener('loadedmetadata', read);
  }, [videoRef, src]);

  const start = () => {
    const el = videoRef.current;
    if (!el) return;
    setStarted(true);
    el.defaultPlaybackRate = SPEED;
    el.playbackRate = SPEED;
    el.muted = false;
    el.play().catch(() => {});
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="metadata"
        playsInline
        controls={started}
        className="w-full h-full object-cover bg-black"
      />
      {!started && (
        <button
          type="button"
          onClick={start}
          aria-label={label}
          className="group absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white/70"
        >
          <span className="flex items-center justify-center w-[20%] max-w-[180px] min-w-[56px] -translate-y-[12%] sm:translate-y-0 aspect-square rounded-full bg-white/95 ring-[6px] sm:ring-[10px] ring-white/25 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.6)] transition-transform duration-200 ease-out group-hover:scale-105">
            <svg viewBox="0 0 24 24" className="w-[42%] h-[42%] ml-[8%] fill-gray-900" aria-hidden="true">
              <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
            </svg>
          </span>

          <span className="absolute bottom-[4%] left-1/2 -translate-x-1/2 flex flex-col items-center rounded-2xl sm:rounded-3xl bg-[#1c1c1e]/90 text-white px-3 sm:px-7 py-1.5 sm:py-3.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.7)] whitespace-nowrap">
            <span className="flex items-center gap-1.5 sm:gap-2 font-bold text-sm sm:text-3xl tabular-nums">
              <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                <path d="M12 3a9 9 0 1 0 9 9" />
                <path d="M12 12V7" />
                <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
              </svg>
              {SPEED}×
            </span>
            {duration > 0 && (
              <span className="mt-1 sm:mt-2 flex items-center gap-2 sm:gap-3 rounded-xl bg-white/[0.06] px-2.5 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-2xl font-bold tabular-nums">
                <span className="line-through decoration-2 text-white/45">{fmt(duration)}</span>
                <span aria-hidden="true">⚡</span>
                <span>{fmt(duration / SPEED)}</span>
              </span>
            )}
          </span>
        </button>
      )}
    </div>
  );
}
