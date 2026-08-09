import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

/**
 * Click-to-play explainer, same video used on /overview-b. `preload="none"`
 * on purpose: this is an 83MB file, it should not be fetched until someone
 * actually chooses to watch it. Uses native controls (unlike the VSL pages'
 * unskippable player) since this is a supplementary watch, not the primary
 * funnel step.
 */
export function ExplainerVideo() {
  const [playing, setPlaying] = useState(false);

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
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative w-full max-w-4xl mx-auto aspect-video bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
        >
          {playing ? (
            <video
              className="absolute inset-0 w-full h-full object-contain bg-black"
              src="/webinar1/webinar-1.mp4"
              controls
              autoPlay
              playsInline
              preload="none"
              title="KenjiAI Overview"
            />
          ) : (
            <button
              onClick={() => setPlaying(true)}
              aria-label="Play the KenjiAI overview video"
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-gray-900 via-gray-950 to-black group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500 group-hover:bg-emerald-400 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all duration-300 group-hover:scale-110">
                <Play className="w-7 h-7 sm:w-8 sm:h-8 text-gray-950 ml-1" fill="currentColor" />
              </div>
              <span className="text-white font-bold text-base sm:text-lg">Watch the Overview</span>
            </button>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default ExplainerVideo;
