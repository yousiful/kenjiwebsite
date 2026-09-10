import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Maximize2, Volume2, VolumeX } from 'lucide-react';
import WebinarObjectionSection from '../components/WebinarObjectionSection';
import { useResumableVideo } from '../hooks/useResumableVideo';

// A/B variant B of /overview. Identical to WebinarVSLPage except the video,
// so the test isolates the video as the only variable.
// Fixed real-content timestamp (webinar-1.mp4): the point where the video starts
// walking through the actual pricing options (golden membership one-time payment
// vs. the performance plan), right before testimonials start at ~312s. Was
// previously a 95%-of-duration threshold -- moved to match real video content
// 2026-09-10 per Yousif's request. Re-time this if the VSL is ever replaced.
const OPTIONS_REVEAL_SECONDS = 252;

export default function WebinarVSLPageB() {
  const [viewers, setViewers] = useState(214);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [pricingUnlocked, setPricingUnlocked] = useState(false);
  const [videoJoined, setVideoJoined] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  const videoElRef = useRef<HTMLVideoElement>(null);

  useResumableVideo(videoElRef, 'kenjiai-video-progress:/overview-b');

  // Pricing unlocks once the video reaches the real point where it starts
  // discussing the pricing options, before testimonials begin.
  useEffect(() => {
    const el = videoElRef.current;
    if (!el) return;
    const onTimeUpdate = () => {
      if (!el.duration) return;
      if (el.currentTime >= OPTIONS_REVEAL_SECONDS) setPricingUnlocked(true);
    };
    const onEnded = () => { setPricingUnlocked(true); setVideoEnded(true); };
    el.addEventListener('timeupdate', onTimeUpdate);
    el.addEventListener('ended', onEnded);
    return () => {
      el.removeEventListener('timeupdate', onTimeUpdate);
      el.removeEventListener('ended', onEnded);
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
    const handler = () => {
      const doc = document as Document & { webkitFullscreenElement?: Element };
      setIsFullscreen(!!(doc.fullscreenElement || doc.webkitFullscreenElement));
    };
    document.addEventListener('fullscreenchange', handler);
    document.addEventListener('webkitfullscreenchange', handler);
    return () => {
      document.removeEventListener('fullscreenchange', handler);
      document.removeEventListener('webkitfullscreenchange', handler);
    };
  }, []);

  const handleExpand = () => {
    const el = videoRef.current as
      | (HTMLDivElement & { webkitRequestFullscreen?: () => Promise<void> | void })
      | null;
    if (!el) return;
    const doc = document as Document & {
      webkitFullscreenElement?: Element;
      webkitExitFullscreen?: () => Promise<void> | void;
    };
    if (doc.fullscreenElement || doc.webkitFullscreenElement) {
      const exit = doc.exitFullscreen || doc.webkitExitFullscreen;
      if (exit) Promise.resolve(exit.call(doc)).catch(() => {});
    } else {
      const req = el.requestFullscreen || el.webkitRequestFullscreen;
      if (req) Promise.resolve(req.call(el)).catch(() => {});
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

        {/* ── VIDEO — full 16:9, edge-to-edge & vertically centered on mobile,
              large & centered on desktop. Always shows the whole frame (no crop) ── */}
        <div className="w-full flex-1 flex items-center sm:block sm:flex-none sm:px-4 sm:pt-4">
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
              muted
              playsInline
              disablePictureInPicture
              tabIndex={-1}
              onContextMenu={(e) => e.preventDefault()}
              title="KenjiAI Overview"
            />

            {/* Custom controls: mute + fullscreen only, no seek/scrub bar.
                Top-right, kept clear of the mobile top-bar block above. */}
            <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
              <button
                onClick={handleToggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                className="flex items-center justify-center bg-black/75 hover:bg-black/90 backdrop-blur-sm border border-white/25 text-white rounded-lg p-2 transition-all active:scale-95 shadow-lg"
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
              <button
                onClick={handleExpand}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enlarge video'}
                className="flex items-center gap-1.5 bg-black/75 hover:bg-black/90 backdrop-blur-sm border border-white/25 text-white rounded-lg px-3.5 py-2 text-[13px] font-semibold transition-all active:scale-95 shadow-lg"
              >
                <Maximize2 size={15} />
                <span>{isFullscreen ? 'Exit' : 'Enlarge'}</span>
              </button>
            </div>

            {/* Zoom-style waiting room. A real click lets sound play immediately. */}
            {!videoJoined && (
              <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 text-center px-6 bg-gradient-to-b from-[#0b1220] via-[#111827] to-[#0b1220]">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-2xl shadow-[0_0_0_4px_rgba(37,99,235,0.25)]">
                  🎥
                </div>
                <div className="flex items-center gap-2 text-blue-300 text-[11px] font-extrabold uppercase tracking-widest">
                  Waiting Room
                  <span className="flex gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-blue-300 animate-pulse" />
                    <span className="w-1 h-1 rounded-full bg-blue-300 animate-pulse [animation-delay:0.2s]" />
                    <span className="w-1 h-1 rounded-full bg-blue-300 animate-pulse [animation-delay:0.4s]" />
                  </span>
                </div>
                <h2 className="text-white font-black text-lg sm:text-xl max-w-xs">You're invited to join this training</h2>
                <p className="text-gray-400 text-sm max-w-xs">Click below to enter. Sound turns on automatically.</p>
                <button
                  onClick={handleJoin}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-sm px-7 py-3.5 rounded-xl shadow-[0_10px_30px_rgba(16,185,129,0.35)] transition-transform active:scale-95"
                >
                  ▶ Join Webinar
                </button>
                <p className="text-gray-600 text-[11px]">This session is limited to registered attendees</p>
              </div>
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

        <WebinarObjectionSection />
      </div>
    </>
  );
}
