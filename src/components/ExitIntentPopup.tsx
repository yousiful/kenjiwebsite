import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Clock, Zap } from 'lucide-react';

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasFired, setHasFired] = useState(false);

  const showPopup = useCallback(() => {
    if (hasFired) return;

    const dismissed = sessionStorage.getItem('exit-popup-dismissed');
    const lastShown = sessionStorage.getItem('exit-popup-last-shown');

    if (dismissed) return;

    if (lastShown) {
      const timeSinceLastShown = Date.now() - parseInt(lastShown);
      if (timeSinceLastShown < 300000) {
        return;
      }
    }

    setIsVisible(true);
    setHasFired(true);
    sessionStorage.setItem('exit-popup-last-shown', Date.now().toString());
  }, [hasFired]);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('exit-popup-dismissed');
    if (dismissed) {
      setHasFired(true);
      return;
    }

    let isMouseInViewport = true;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      lastY = e.clientY;
      isMouseInViewport = true;
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 || (e.clientY <= 10 && lastY > e.clientY)) {
        isMouseInViewport = false;
        setTimeout(() => {
          if (!isMouseInViewport) {
            showPopup();
          }
        }, 100);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY < 10) {
        showPopup();
      }
    };

    const timeout = setTimeout(() => {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseleave', handleMouseLeave);
      document.addEventListener('mouseout', handleMouseOut);
    }, 3000);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [showPopup]);

  useEffect(() => {
    if (hasFired) return;

    const dismissed = sessionStorage.getItem('exit-popup-dismissed');
    if (dismissed) {
      setHasFired(true);
      return;
    }

    let scrollTimeout: NodeJS.Timeout;
    let touchStartY = 0;
    let touchStartTime = 0;
    let isScrolling = false;

    const handleScroll = () => {
      isScrolling = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 150);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isScrolling || window.scrollY > 50) return;

      const touchCurrentY = e.touches[0].clientY;
      const diff = touchCurrentY - touchStartY;

      if (diff > 100 && window.scrollY === 0) {
        const duration = Date.now() - touchStartTime;
        if (duration < 500) {
          showPopup();
        }
      }
    };

    const visibilityTimeout = setTimeout(() => {
      showPopup();
    }, 30000);

    document.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      clearTimeout(scrollTimeout);
      clearTimeout(visibilityTimeout);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [hasFired, showPopup]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('exit-popup-dismissed', 'true');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };

      document.addEventListener('keydown', handleEscape);

      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

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
              aria-label="Close popup"
              className="absolute top-4 right-4 z-20 text-gray-400 hover:text-white transition-colors p-2 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-gray-800"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-400" />
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-3">
                Pricing Changes Next Month
              </h2>

              <p className="text-gray-300 text-center text-sm sm:text-base mb-4 leading-relaxed">
                We're increasing our rates to fund product improvements. Lock in today's pricing before that happens.
              </p>

              <div className="bg-amber-500/15 border border-amber-500/30 rounded-lg px-4 py-3 mb-6">
                <p className="text-amber-200 text-sm text-center font-semibold">
                  This rate expires at the end of the month
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  'Lock in Today',
                  'Expires End of Month',
                  'Cancel Anytime',
                  'No Setup Fees'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 bg-gray-800/60 border border-gray-700/50 rounded-lg px-3 py-2">
                    <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span className="text-gray-200 text-xs font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <a
                href="https://freedom.kenjiai.com/checkout"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center text-white font-bold text-base sm:text-lg py-4 rounded-xl touch-manipulation transition-all duration-300 hover:brightness-110"
                style={{
                  background: 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)',
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  Lock In Pricing
                  <ArrowRight className="w-5 h-5" />
                </span>
              </a>

              <button
                onClick={handleClose}
                className="block w-full text-center text-gray-500 text-sm mt-4 py-2 hover:text-gray-300 transition-colors touch-manipulation min-h-[44px]"
              >
                Not now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
