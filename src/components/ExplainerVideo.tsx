import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Maximize2, Volume2, VolumeX } from 'lucide-react';

/**
 * Same video and interaction pattern as /overview-b: autoplay muted, custom
 * mute + fullscreen controls only, no native seek bar. Difference: autoplay
 * triggers when this section scrolls into view rather than on page load -
 * this file is 87MB, no reason to fetch it for visitors who never scroll
 * this far down a pricing page.
 */
export function ExplainerVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoElRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.4 });
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    const el = containerRef.current as
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

  return (
    <section className="py-16 px-4 sm:px-6" style={{ backgroundColor: '#0B0E14' }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            See How It Actually Works
          </h2>
          <p className="text-lg font-semibold text-gray-300 max-w-2xl mx-auto">
            A full walkthrough before you pick a plan. No sign-up required to watch.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          ref={containerRef}
          className="relative w-full max-w-4xl mx-auto aspect-video bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
        >
          {inView && (
            <>
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

              <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
                <button
                  onClick={handleToggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                  className={`flex items-center justify-center bg-black/75 hover:bg-black/90 backdrop-blur-sm border text-white rounded-lg p-2 transition-all active:scale-95 shadow-lg ${isMuted ? 'border-emerald-400/60 animate-pulse' : 'border-white/25'}`}
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

              {isMuted && (
                <button
                  onClick={handleToggleMute}
                  aria-label="Tap to unmute"
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs sm:text-sm px-4 py-2 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all active:scale-95"
                >
                  <VolumeX size={14} />
                  Tap to unmute
                </button>
              )}
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default ExplainerVideo;
