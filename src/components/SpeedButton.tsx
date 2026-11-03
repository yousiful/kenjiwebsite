import { RefObject, useState } from 'react';

// Yousif, 2026-11-02: the overview videos have no seek bar on purpose, so give viewers a speed button
// instead (same 1x / 1.25x / 1.5x / 2x cycle as the /webinar1 watch pages).
const SPEEDS = [1, 1.25, 1.5, 2];

export function SpeedButton({ videoRef, className = '' }: { videoRef: RefObject<HTMLVideoElement>; className?: string }) {
  const [i, setI] = useState(0);

  const next = () => {
    const n = (i + 1) % SPEEDS.length;
    setI(n);
    const el = videoRef.current;
    if (el) {
      el.defaultPlaybackRate = SPEEDS[n];
      el.playbackRate = SPEEDS[n];
    }
  };

  return (
    <button
      type="button"
      onClick={next}
      aria-label={`Playback speed ${SPEEDS[i]}x, tap to change`}
      className={className}
    >
      <span className="tabular-nums">{SPEEDS[i]}x</span>
    </button>
  );
}
