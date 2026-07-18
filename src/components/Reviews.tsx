import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const WIDGET_SRC = 'https://reputationhub.site/reputation/assets/review-widget.js';

/**
 * LeadConnector / reputationhub review widget.
 * The external script handles auto-resizing the iframe; we inject it once on mount.
 */
export function Reviews() {
  useEffect(() => {
    if (document.querySelector(`script[src="${WIDGET_SRC}"]`)) return;
    const script = document.createElement('script');
    script.src = WIDGET_SRC;
    script.type = 'text/javascript';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6" style={{ backgroundColor: '#0B0E14' }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 mb-5">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-amber-300 text-sm font-bold tracking-wide">Real Client Reviews</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Don't Take Our Word For It
          </h2>
          <p className="text-lg font-bold text-gray-300 max-w-2xl mx-auto">
            Hear from the business owners already growing with KenjiAI.
          </p>
        </motion.div>

        <div className="rounded-2xl overflow-hidden">
          {/* min-height fallback: without it the iframe renders 0-tall on mobile
              whenever the widget's resize script loads late or is blocked. */}
          <iframe
            className="lc_reviews_widget min-h-[560px] sm:min-h-[420px]"
            src="https://reputationhub.site/reputation/widgets/review_widget/q5L4ttbBMHNxieXIcTVJ"
            frameBorder="0"
            scrolling="no"
            style={{ minWidth: '100%', width: '100%' }}
            title="KenjiAI Customer Reviews"
          />
        </div>
      </div>
    </section>
  );
}

export default Reviews;
