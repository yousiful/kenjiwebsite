import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X } from 'lucide-react';

const CONSENT_KEY = 'kenji_tracking_consent';

export function getTrackingConsent(): boolean {
  return localStorage.getItem(CONSENT_KEY) === 'granted';
}

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Show after 1.5s delay so it doesn't compete with page load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'granted');
    setVisible(false);
    window.dispatchEvent(new Event('tracking-consent-granted'));
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, 'denied');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-[9998] p-2 sm:p-4"
        >
          <div className="max-w-2xl mx-auto bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl sm:rounded-2xl p-2.5 sm:p-5 shadow-2xl">

            {/* Mobile: single compact row, no paragraph - text + buttons only */}
            <div className="flex sm:hidden items-center justify-between gap-2">
              <p className="text-gray-300 text-[11px] leading-tight min-w-0">
                We use cookies.{' '}
                <a href="/privacy" className="underline text-gray-400">Privacy Policy</a>
              </p>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={handleAccept}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={handleDecline}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-gray-600 transition-colors"
                >
                  Decline
                </button>
              </div>
            </div>

            {/* Desktop: full explanation */}
            <div className="hidden sm:flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm mb-1">We value your privacy</h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-3">
                  We use cookies to understand how visitors interact with our site so we can improve the experience.
                  No personal data is sold or shared. You can opt out anytime.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAccept}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={handleDecline}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold px-4 py-2 rounded-lg border border-gray-600 transition-colors"
                  >
                    Decline
                  </button>
                  <a
                    href="/privacy"
                    className="text-gray-500 hover:text-gray-300 text-xs underline transition-colors"
                  >
                    Privacy Policy
                  </a>
                </div>
              </div>
              <button
                onClick={handleDecline}
                className="flex-shrink-0 text-gray-500 hover:text-gray-300 transition-colors p-1"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
