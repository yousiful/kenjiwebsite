import { useEffect } from 'react';

/**
 * Persists video playback position to localStorage (keyed by page path) so a
 * visitor who leaves and comes back picks up where they left off instead of
 * restarting from zero. Deliberately does not add any UI (no scrub bar) —
 * this only affects where playback starts, matching the page's existing
 * "unskippable" video design.
 */
export function useResumableVideo(
  videoElRef: React.RefObject<HTMLVideoElement>,
  storageKey: string
) {
  useEffect(() => {
    const el = videoElRef.current;
    if (!el) return;

    const resume = () => {
      try {
        const saved = localStorage.getItem(storageKey);
        if (!saved) return;
        const t = parseFloat(saved);
        // Only resume if there's meaningful prior progress and we're not
        // basically at the end already (in which case just start over).
        if (Number.isFinite(t) && t > 3 && el.duration && t < el.duration - 5) {
          el.currentTime = t;
        }
      } catch {
        // localStorage unavailable (private browsing etc), just play from 0
      }
    };

    if (el.readyState >= 1) {
      resume();
    } else {
      el.addEventListener('loadedmetadata', resume, { once: true });
    }

    let lastSaved = 0;
    const onTimeUpdate = () => {
      const now = el.currentTime;
      if (Math.abs(now - lastSaved) >= 3) {
        lastSaved = now;
        try {
          localStorage.setItem(storageKey, String(now));
        } catch {
          // ignore write failures, resume is a nice-to-have
        }
      }
    };
    el.addEventListener('timeupdate', onTimeUpdate);

    return () => {
      el.removeEventListener('loadedmetadata', resume);
      el.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [videoElRef, storageKey]);
}
