import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Clock, Zap } from 'lucide-react';

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasFired, setHasFired] = useState(false);

  const showPopup = useCallback(() => {
    if (hasFired) return;
    setIsVisible(true);
    setHasFired(true);
  }, [hasFired]);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('exit-popup-dismissed');
    if (dismissed) {
      setHasFired(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && e.relatedTarget === null) {
        showPopup();
      }
    };

    const timeout = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [showPopup]);

  useEffect(() => {
    if (hasFired) return;

    const dismissed = sessionStorage.getItem('exit-popup-dismissed');
    if (dismissed) {
      setHasFired(true);
      return;
    }

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchEndY - touchStartY;
      if (diff > 150 && window.scrollY < 100) {
        showPopup();
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [hasFired, showPopup]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('exit-popup-dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500" />

            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white transition-colors p-1 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-400" />
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-3">
                Wait — Before You Go
              </h2>

              <p className="text-gray-300 text-center text-sm sm:text-base mb-6 leading-relaxed">
                Most businesses waste thousands on tools that don't work together. See how we replace 17+ tools with one AI-powered platform — in a free strategy call.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  'Done-For-You Setup',
                  'AI Voice Agents',
                  'Full CRM Included',
                  'Proven ROI'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 bg-gray-800/60 border border-gray-700/50 rounded-lg px-3 py-2">
                    <Zap className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-200 text-xs font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <a
                href="https://go.mediatraffics.com/leads"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center text-white font-bold text-base sm:text-lg py-4 rounded-xl touch-manipulation transition-all duration-300 hover:brightness-110"
                style={{
                  background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  Book Free Strategy Call
                  <ArrowRight className="w-5 h-5" />
                </span>
              </a>

              <button
                onClick={handleClose}
                className="block w-full text-center text-gray-500 text-sm mt-4 py-2 hover:text-gray-300 transition-colors touch-manipulation min-h-[44px]"
              >
                No thanks, I'll figure it out myself
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
