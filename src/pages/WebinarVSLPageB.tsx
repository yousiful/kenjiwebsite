import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';

// A/B variant B of /overview. Identical to WebinarVSLPage except the video,
// so the test isolates the video as the only variable.
export default function WebinarVSLPageB() {
  const [viewers, setViewers] = useState(214);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

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

            <iframe
              src="https://www.youtube.com/embed/ydIOQA11s7Y?si=10MlUNyxcaRiakhq&controls=1&autoplay=1&rel=0&modestbranding=1"
              title="KenjiAI Overview"
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />

            {/* Expand / fullscreen button — top-right so it never covers
                YouTube's own bottom-right fullscreen control (the reliable
                path on iOS, where iframes can't be fullscreened by script) */}
            <button
              onClick={handleExpand}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enlarge video'}
              className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-black/75 hover:bg-black/90 backdrop-blur-sm border border-white/25 text-white rounded-lg px-3.5 py-2 text-[13px] font-semibold transition-all active:scale-95 shadow-lg"
            >
              <Maximize2 size={15} />
              <span>{isFullscreen ? 'Exit' : 'Enlarge'}</span>
            </button>
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
            To work with us on a strictly performance basis, you must book your onboarding call and actually show up. If you miss your call again, this offer will be voided.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://go.mediatraffics.com/price"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col items-center justify-center w-full sm:max-w-[300px] px-6 py-4 rounded-2xl bg-gradient-to-br from-green-600 to-green-500 text-white shadow-[0_8px_20px_-4px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_28px_-4px_rgba(16,185,129,0.6)] hover:-translate-y-0.5 transition-all duration-300 border border-white/20"
            >
              <span className="font-bold text-base tracking-wide">ONE-TIME SETUP</span>
              <span className="text-xs font-medium opacity-80 mt-0.5">Done-for-you implementation.</span>
            </a>

            <a
              href="https://go.mediatraffics.com/leads"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col items-center justify-center w-full sm:max-w-[300px] px-6 py-4 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-[0_8px_20px_-4px_rgba(59,130,246,0.4)] hover:shadow-[0_12px_28px_-4px_rgba(59,130,246,0.6)] hover:-translate-y-0.5 transition-all duration-300 border border-white/20"
            >
              <span className="font-bold text-base tracking-wide">Need More Proof?</span>
              <span className="text-xs font-medium opacity-80 mt-0.5">Book a Walkthrough</span>
            </a>

            <a
              href="https://kenjiai.com/pricing"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col items-center justify-center w-full sm:max-w-[300px] px-6 py-4 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-500 text-white shadow-[0_8px_20px_-4px_rgba(139,92,246,0.4)] hover:shadow-[0_12px_28px_-4px_rgba(139,92,246,0.6)] hover:-translate-y-0.5 transition-all duration-300 border border-white/20"
            >
              <span className="font-bold text-base tracking-wide">PERFORMANCE PLANS</span>
              <span className="text-xs font-medium opacity-80 mt-0.5">Pay only when you earn.</span>
            </a>
          </div>
        </motion.div>

      </div>
    </>
  );
}
