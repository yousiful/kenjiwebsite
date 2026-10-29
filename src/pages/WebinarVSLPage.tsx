import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Maximize2, Volume2, VolumeX } from 'lucide-react';
import { useResumableVideo } from '../hooks/useResumableVideo';

// Video: "How to Get Paid for Running Ads" (3:09, a YouTube outlier, self-hosted so
// viewers can't click through to YouTube). Pricing unlocks at 1:53, where Yousif starts
// on the one-time setup vs. performance-basis options. Re-time this if the video changes.
const OPTIONS_REVEAL_SECONDS = 113;

export default function WebinarVSLPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [pricingUnlocked, setPricingUnlocked] = useState(false);
  const [videoJoined, setVideoJoined] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  const videoElRef = useRef<HTMLVideoElement>(null);

  useResumableVideo(videoElRef, 'kenjiai-video-progress:/overview:get-paid');

  // Watch-time tracking, matches the pattern already running on /overview-b
  // and the webinar1 pages: fires milestone events into GTM, Meta Pixel, and
  // the webinar-track backend so all VSL variants are comparable in one place
  // (GET /.netlify/functions/webinar-stats). See netlify/functions/webinar-track.ts.
  useEffect(() => {
    const el = videoElRef.current;
    if (!el) return;

    const sendBeaconJSON = (body: Record<string, unknown>) => {
      try {
        const json = JSON.stringify({ page: 'overview', ...body });
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/.netlify/functions/webinar-track', json);
        } else {
          fetch('/.netlify/functions/webinar-track', { method: 'POST', body: json, keepalive: true });
        }
      } catch {
        // tracking is best-effort, never block playback on a failed beacon
      }
    };

    const milestones = [25, 50, 75, 95, 100];
    const hit: Record<number, boolean> = {};
    const markMilestone = (p: number) => {
      if (hit[p]) return;
      hit[p] = true;
      const w = window as any;
      if (w.gtag) w.gtag('event', 'video_progress', { event_category: 'webinar', video_percent: p, page_path: location.pathname });
      if (w.fbq) w.fbq('trackCustom', 'VideoProgress', { percent: p, page_path: location.pathname });
      sendBeaconJSON({ event: 'video_progress', percent: p });
    };

    const onTimeUpdate = () => {
      if (!el.duration) return;
      const pct = (el.currentTime / el.duration) * 100;
      milestones.forEach((m) => { if (pct >= m) markMilestone(m); });
      if (el.currentTime >= OPTIONS_REVEAL_SECONDS) setPricingUnlocked(true);
    };
    el.addEventListener('timeupdate', onTimeUpdate);

    // Fallback: guarantee the pricing unlocks once the video actually ends,
    // even if timeupdate's last tick lands just under the 95% threshold.
    const onEnded = () => { setPricingUnlocked(true); setVideoEnded(true); };
    el.addEventListener('ended', onEnded);

    const onUnload = () => {
      if (el.currentTime > 0) sendBeaconJSON({ event: 'video_watch_seconds', seconds: el.currentTime });
    };
    window.addEventListener('pagehide', onUnload);

    return () => {
      el.removeEventListener('timeupdate', onTimeUpdate);
      el.removeEventListener('ended', onEnded);
      window.removeEventListener('pagehide', onUnload);
    };
  }, []);


  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const handleExpand = () => {
    const el = videoRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  };

  const handleToggleMute = () => {
    const el = videoElRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setIsMuted(el.muted);
  };

  // Zoom-style "Join Webinar" gate: a real click, so sound plays immediately
  // instead of being stuck muted behind the browser's autoplay policy.
  const handleJoin = () => {
    const el = videoElRef.current;
    if (!el) return;
    el.muted = false;
    setIsMuted(false);
    const pr = el.play();
    if (pr && pr.catch) {
      pr.catch(() => { el.muted = true; setIsMuted(true); el.play().catch(() => {}); });
    }
    setVideoJoined(true);
  };

  const handleReplay = () => {
    const el = videoElRef.current;
    if (!el) return;
    el.currentTime = 0;
    setVideoEnded(false);
    const pr = el.play();
    if (pr && pr.catch) pr.catch(() => {});
  };

  return (
    <>
      <Helmet>
        <title>Exclusive Overview | KenjiAI</title>
        <meta name="description" content="On-demand overview session: how KenjiAI builds done-for-you AI call centers and paid inbound for high-ticket businesses. Invite only." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-[#0B0E14] text-white flex flex-col">

        {/* ── ON-DEMAND SESSION BADGE ── */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#111822]/90 border-b border-white/10 sm:hidden">
          <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">
            Executive Briefing
          </span>
          <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <span className="font-semibold text-xs font-mono text-blue-300">On-Demand Access</span>
          </div>
        </div>

        {/* ── VIDEO — full 16:9, edge-to-edge on mobile, large & centered on desktop ── */}
        <div className="w-full sm:px-4 sm:pt-4">
          <div
            ref={videoRef}
            className="relative w-full max-w-6xl mx-auto aspect-video bg-black overflow-hidden sm:rounded-2xl sm:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] sm:border sm:border-white/10"
          >
            {/* Gradient edge shadow */}
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none sm:hidden" />

            {/* Block YouTube top-bar UI on mobile */}
            <div className="absolute top-0 left-0 w-full h-[56px] z-20 bg-transparent pointer-events-auto" />

            {/* Intentionally no `controls` attribute — native controls always
                include a seek bar. Custom controls below (mute + fullscreen
                only) keep this unskippable, matching the webinar watch page. */}
            <video
              ref={videoElRef}
              className="absolute inset-0 w-full h-full object-contain bg-black"
              src="/overview/get-paid-running-ads.mp4"
              muted
              playsInline
              disablePictureInPicture
              tabIndex={-1}
              onContextMenu={(e) => e.preventDefault()}
              title="KenjiAI Overview"
              poster="/overview/get-paid-thumb.jpg"
            />

            {/* Custom controls: mute + fullscreen only, no seek/scrub bar.
                Top-right, matching /overview-b and the explainer video. */}
            <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
              <button
                onClick={handleToggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                className="flex items-center justify-center bg-black/70 hover:bg-black/90 backdrop-blur-sm border border-white/20 text-white rounded-lg p-2 transition-all active:scale-95 shadow-lg"
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              <button
                onClick={handleExpand}
                aria-label="Expand video"
                className="flex items-center gap-1.5 bg-black/70 hover:bg-black/90 backdrop-blur-sm border border-white/20 text-white rounded-lg px-3 py-2 text-xs font-semibold transition-all active:scale-95 shadow-lg"
              >
                <Maximize2 size={14} />
                <span className="hidden xs:inline">{isFullscreen ? 'Exit' : 'Expand'}</span>
              </button>
            </div>

            {/* Yousif, 2026-10-24: real thumbnail (face, one promise, the length) instead of the dark
                "waiting room", which lost 140 of 151 visitors between 10s and 30s. A click starts it with sound. */}
            {!videoJoined && (
              <button
                type="button"
                onClick={handleJoin}
                aria-label="Play the 3-minute video"
                className="group absolute inset-0 z-40 block w-full h-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white/70"
              >
                <picture>
                  <source srcSet="/overview/get-paid-thumb.webp" type="image/webp" />
                  <img src="/overview/get-paid-thumb.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
                </picture>
                <span className="absolute left-[65%] top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-[9%] min-w-[44px] max-w-[96px] aspect-square rounded-full bg-white/95 ring-[6px] sm:ring-[10px] ring-white/25 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.6)] transition-transform duration-200 ease-out group-hover:scale-105">
                  <svg viewBox="0 0 24 24" className="w-[42%] h-[42%] ml-[8%] fill-gray-900" aria-hidden="true">
                    <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
                  </svg>
                </span>
              </button>
            )}

            {/* Watch Again once the video finishes. */}
            {videoEnded && (
              <button
                onClick={handleReplay}
                aria-label="Watch again"
                className="absolute inset-0 m-auto z-40 flex items-center gap-2 bg-black/80 border border-white/25 text-white font-extrabold text-sm px-6 py-3.5 rounded-full backdrop-blur-sm shadow-lg w-fit h-fit"
              >
                🔁 Watch Again
              </button>
            )}
          </div>
        </div>

        {/* ── DESKTOP HEADER BAR (hidden on mobile) ── */}
        <div className="hidden sm:flex items-center justify-between bg-[#111822]/80 border-b border-white/10 backdrop-blur-md px-6 py-4 max-w-4xl w-full mx-auto">
          <div>
            <span className="text-blue-500 text-xs font-extrabold uppercase tracking-widest block mb-1">
              Executive Briefing
            </span>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">
              How to Get Paid for Running Ads
            </h1>
          </div>
          <div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-full shrink-0">
            <div className="w-2.5 h-2.5 bg-blue-400 rounded-full" />
            <span className="font-semibold text-sm tracking-wide text-blue-300">
              On-Demand Access
            </span>
          </div>
        </div>

        {/* ── TITLE (mobile only, below video) ── */}
        <div className="sm:hidden px-4 pt-3 pb-1">
          <p className="text-base font-bold leading-snug text-white">
            How to Get Paid for Running Ads
          </p>
        </div>

        {/* ── CTA SECTION (locked until the training finishes) ── */}
        {pricingUnlocked ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-4xl mx-auto px-4 pt-6 pb-10 text-center"
          >
            <p className="text-gray-400 text-sm sm:text-base font-medium max-w-2xl mx-auto mb-6">
              You just watched exactly how this works. No call needed to get started, pick your plan below and you're in.
            </p>

            <div className="flex flex-col items-center gap-4">
              <a
                href="https://kenjiai.com/pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center justify-center w-full sm:max-w-[420px] px-8 py-5 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-500 text-white shadow-[0_8px_28px_-4px_rgba(139,92,246,0.5)] hover:shadow-[0_14px_36px_-4px_rgba(139,92,246,0.7)] hover:-translate-y-0.5 transition-all duration-300 border border-white/20"
              >
                <span className="font-bold text-lg tracking-wide">See Plans &amp; Get Started</span>
                <span className="text-xs font-medium opacity-80 mt-0.5">Pay only when you earn. No call required.</span>
              </a>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://go.mediatraffics.com/price"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col items-center justify-center w-full sm:max-w-[280px] px-5 py-3 rounded-xl bg-gray-900/60 border border-gray-700 text-gray-300 hover:border-green-500/50 hover:text-white transition-all duration-300"
                >
                  <span className="font-semibold text-sm tracking-wide">Want the DFY Setup Instead?</span>
                  <span className="text-xs opacity-70 mt-0.5">Book a call to talk it through.</span>
                </a>

                <a
                  href="https://go.mediatraffics.com/leads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col items-center justify-center w-full sm:max-w-[280px] px-5 py-3 rounded-xl bg-gray-900/60 border border-gray-700 text-gray-300 hover:border-blue-500/50 hover:text-white transition-all duration-300"
                >
                  <span className="font-semibold text-sm tracking-wide">Still Have Questions?</span>
                  <span className="text-xs opacity-70 mt-0.5">Book a walkthrough call.</span>
                </a>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="w-full max-w-xl mx-auto px-4 pt-6 pb-10 text-center"
          >
            <div className="rounded-2xl border border-amber-500/30 bg-gray-900/60 px-6 py-8">
              <div className="text-3xl mb-3">🔒</div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
                Pricing Unlocks At The End Of This Training
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">
                Keep watching. The full pricing breakdown reveals automatically when the video finishes.
              </p>
            </div>
          </motion.div>
        )}

      </div>
    </>
  );
}
