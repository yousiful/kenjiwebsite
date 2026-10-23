import { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';
import { VideoPreview } from './VideoPreview';
import { useResumableVideo } from '../hooks/useResumableVideo';
import { pickVslVariant, useVslDropoff } from '../hooks/useVslDropoff';

// Yousif, 2026-10-17: swapped to "New Offer Overview" (8:09), where he walks through the $7-$27
// low-ticket front end + order bump + OTO that pays for the ads and generates leads.
// Poster is its "ad pays for itself" frame. Previous VSLs: /videos/pricing-vsl-300.mp4 (10/08),
// /webinar1/webinar-1.mp4 (10/06).
// A/B test: each visitor is assigned one version and keeps it (localStorage). Add a version here
// to put it in the rotation; ?vsl=<id> forces one for checking. Results: kenjiai.com/funnel-stats/
// ("Video drop-off" section), from the vsl_v_<id> and vsl_t<seconds> steps sent below.
const VARIANTS: { id: string; src: string; poster: string }[] = [
  { id: 'lt', src: '/videos/pricing-vsl-lowticket.mp4', poster: '/videos/pricing-vsl-lowticket-poster.jpg' },
];

export function PricingVSL() {
  const videoElRef = useRef<HTMLVideoElement>(null);
  const [variant] = useState(() => pickVslVariant(VARIANTS, 'kenji-pricing-vsl'));

  useResumableVideo(videoElRef, `kenjiai-video-progress:/pricing:${variant.id}`);

  useVslDropoff(videoElRef, variant.id);

  // Same milestone tracking as /overview, under its own page key so the two are comparable.
  useEffect(() => {
    const el = videoElRef.current;
    if (!el) return;

    const sendBeaconJSON = (body: Record<string, unknown>) => {
      try {
        const json = JSON.stringify({ page: 'pricing', ...body });
        if (navigator.sendBeacon) navigator.sendBeacon('/.netlify/functions/webinar-track', json);
        else fetch('/.netlify/functions/webinar-track', { method: 'POST', body: json, keepalive: true });
      } catch {
        // tracking is best-effort, never block playback on a failed beacon
      }
    };

    const hit: Record<number, boolean> = {};
    const onTimeUpdate = () => {
      if (!el.duration) return;
      const pct = (el.currentTime / el.duration) * 100;
      [25, 50, 75, 95, 100].forEach((p) => {
        if (pct < p || hit[p]) return;
        hit[p] = true;
        const w = window as any;
        if (w.gtag) w.gtag('event', 'video_progress', { event_category: 'pricing_vsl', video_percent: p, page_path: location.pathname });
        if (w.fbq) w.fbq('trackCustom', 'VideoProgress', { percent: p, page_path: location.pathname });
        sendBeaconJSON({ event: 'video_progress', percent: p });
      });
    };
    const onUnload = () => {
      if (el.currentTime > 0) sendBeaconJSON({ event: 'video_watch_seconds', seconds: el.currentTime });
    };

    el.addEventListener('timeupdate', onTimeUpdate);
    window.addEventListener('pagehide', onUnload);
    return () => {
      el.removeEventListener('timeupdate', onTimeUpdate);
      window.removeEventListener('pagehide', onUnload);
    };
  }, []);


  return (
    <section className="px-4 pt-14 sm:pt-20 pb-6">
      <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.05] tracking-tight [text-wrap:balance]">
          Here's exactly what we build for you
        </h1>
        <p className="mt-5 text-lg sm:text-xl text-gray-300 [text-wrap:pretty]">
          A short walkthrough from Yousif. Your plan options are right below it.
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)]">
        <VideoPreview videoRef={videoElRef} src={variant.src} poster={variant.poster} label="Play the walkthrough video" />
      </div>

      <div className="max-w-5xl mx-auto mt-6 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-3 text-sm sm:text-base text-gray-300">
        <span className="flex items-center gap-2">
          <span className="flex" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
          </span>
          <span><span className="text-white font-semibold">5.0</span> on Google from 31 reviews</span>
        </span>
        <span className="hidden sm:block w-px h-4 bg-white/20" aria-hidden="true" />
        <span><span className="text-white font-semibold">$3.35M</span> generated for 500+ clients</span>
      </div>

      <div className="text-center mt-8">
        <a
          href="#plans"
          className="inline-block rounded-xl bg-[#10A37F] hover:bg-[#0E906F] text-white font-bold px-7 py-3.5 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#10A37F]/40"
        >
          See the plans
        </a>
      </div>
    </section>
  );
}
