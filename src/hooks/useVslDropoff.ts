import { RefObject, useEffect } from 'react';

// The two booking VSLs (Desktop\Output\VSL and Landing Pages\landing1_full / landing2_full), tested
// against each other on /growth-quiz/book, /book and /book2 from 2026-10-10. One shared storage key,
// so a visitor sees the same one on every booking page.
export const BOOK_VSLS = [
  { id: 'l1', src: '/videos/book-vsl-1.mp4', poster: '/videos/book-vsl-1-poster.jpg' },
  { id: 'l2', src: '/videos/book-vsl-2.mp4', poster: '/videos/book-vsl-2-poster.jpg' },
];
export const BOOK_VSL_KEY = 'kenji-book-vsl';

const ft = (step: string) => (window as any).__ft?.send(step);

// A/B pick for a page's VSL: each visitor is assigned one version and keeps it (localStorage).
// ?vsl=<id> forces one for checking.
export function pickVslVariant<T extends { id: string }>(variants: T[], storageKey: string): T {
  const forced = new URLSearchParams(window.location.search).get('vsl');
  const byId = (id: string | null) => variants.find((v) => v.id === id);
  if (byId(forced)) return byId(forced)!;
  try {
    const saved = byId(localStorage.getItem(storageKey));
    if (saved) return saved;
    const v = variants[Math.floor(Math.random() * variants.length)];
    localStorage.setItem(storageKey, v.id);
    return v;
  } catch {
    return variants[0];
  }
}

// Second-by-second drop-off: report each 5-second stretch the viewer actually plays through.
// A jump of more than 1.5s between timeupdates is a seek, so skipped stretches never count.
// Results: kenjiai.com/funnel-stats/ ("Video drop-off"), click the page in the page table.
export function useVslDropoff(ref: RefObject<HTMLVideoElement>, variantId: string) {
  useEffect(() => {
    ft(`vsl_v_${variantId}`);
    const el = ref.current;
    if (!el) return;
    let lastT = el.currentTime;
    const onTime = () => {
      const t = el.currentTime;
      if (t >= lastT && t - lastT < 1.5) ft(`vsl_t${Math.floor(t / 5) * 5}`);
      lastT = t;
    };
    const onSeek = () => { ft('vsl_seek'); lastT = el.currentTime; };
    const onPlay = () => ft('video_play');
    const onEnd = () => ft('vsl_end');
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('seeking', onSeek);
    el.addEventListener('play', onPlay);
    el.addEventListener('ended', onEnd);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('seeking', onSeek);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('ended', onEnd);
    };
  }, [ref, variantId]);
}
