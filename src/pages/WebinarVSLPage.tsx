import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Maximize2, Volume2, VolumeX } from 'lucide-react';
import WebinarObjectionSection from '../components/WebinarObjectionSection';
import { useResumableVideo } from '../hooks/useResumableVideo';

export default function WebinarVSLPage() {
  const [viewers, setViewers] = useState(214);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLDivElement>(null);
  const videoElRef = useRef<HTMLVideoElement>(null);

  useResumableVideo(videoElRef, 'kenjiai-video-progress:/overview');

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
    };
    el.addEventListener('timeupdate', onTimeUpdate);

    const onUnload = () => {
      if (el.currentTime > 0) sendBeaconJSON({ event: 'video_watch_seconds', seconds: el.currentTime });
    };
    window.addEventListener('pagehide', onUnload);

    return () => {
      el.removeEventListener('timeupdate', onTimeUpdate);
      window.removeEventListener('pagehide', onUnload);
    };
  }, []);

  useEffect(() => {
    setViewers(Math.floor(Math.random() * (240 - 180 + 1) + 180));
    let timer: ReturnType<typeof setTimeout>;
    const updateViewers = () => {
      setViewers(prev => {
        let next = prev + (Math.floor(Math.random() * 5) - 2);
        if (next > 290) next -= 5;
        if (next < 160) next += 8;
        return next;
      });
      timer = setTimeout(updateViewers, Math.floor(Math.random() * 5000) + 3000);
    };
    timer = setTimeout(updateViewers, 4000);
    return () => clearTimeout(timer);
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

  return (
    <>
      <Helmet>
        <title>Exclusive Overview | KenjiAI</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-[#0B0E14] text-white flex flex-col">

        {/* ── LIVE BADGE (compact, above video) ── */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#111822]/90 border-b border-white/10 sm:hidden">
          <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">
            Exclusive Briefing
          </span>
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            <span className="font-semibold text-xs font-mono">Live: {viewers}</span>
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
              src="/webinar1/webinar-1.mp4"
              autoPlay
              muted
              playsInline
              disablePictureInPicture
              tabIndex={-1}
              onContextMenu={(e) => e.preventDefault()}
              title="KenjiAI Overview"
            />

            {/* Custom controls: mute + fullscreen only, no seek/scrub bar */}
            <div className="absolute bottom-3 right-3 z-30 flex items-center gap-2">
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
          </div>
        </div>

        {/* ── DESKTOP HEADER BAR (hidden on mobile) ── */}
        <div className="hidden sm:flex items-center justify-between bg-[#111822]/80 border-b border-white/10 backdrop-blur-md px-6 py-4 max-w-4xl w-full mx-auto">
          <div>
            <span className="text-blue-500 text-xs font-extrabold uppercase tracking-widest block mb-1">
              Exclusive Briefing
            </span>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">
              How To Automate Leads &amp; Scale Without More Work
            </h1>
          </div>
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-full shrink-0">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
            <span className="font-semibold text-sm tracking-wide">
              Live: <span className="font-mono">{viewers}</span>
            </span>
          </div>
        </div>

        {/* ── TITLE (mobile only, below video) ── */}
        <div className="sm:hidden px-4 pt-3 pb-1">
          <h1 className="text-base font-bold leading-snug text-white">
            How To Automate Leads &amp; Scale Without More Work
          </h1>
        </div>

        {/* ── CTA SECTION ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
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

        <WebinarObjectionSection />
      </div>
    </>
  );
}
