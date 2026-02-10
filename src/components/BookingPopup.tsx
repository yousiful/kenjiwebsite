import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Users, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

interface BookingPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookingPopup({ isOpen, onClose }: BookingPopupProps) {
  const [spotsLeft, setSpotsLeft] = useState(3);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 47, seconds: 33 });
  const [iframeHeight, setIframeHeight] = useState(800);
  const [isCalendarLoaded, setIsCalendarLoaded] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      // Load the GHL form embed script
      const existingScript = document.getElementById('ghl-embed-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'ghl-embed-script';
        script.src = 'https://safeclick.kenjiai.com/js/form_embed.js';
        script.type = 'text/javascript';
        script.async = false;
        document.head.appendChild(script);

        script.onload = () => {
          console.log('GHL embed script loaded');
        };
      }

      // Listen for iframe height messages
      const handleMessage = (event: MessageEvent) => {
        if (event.origin === 'https://safeclick.kenjiai.com') {
          if (event.data.height) {
            setIframeHeight(event.data.height);
          }
        }
      };

      window.addEventListener('message', handleMessage);

      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('message', handleMessage);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-orange-500/50 rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl"
          style={{ boxShadow: '0 0 80px rgba(249, 115, 22, 0.5)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-orange-500/10 animate-pulse"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 bg-gray-800/80 hover:bg-gray-700 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Content */}
          <div className="relative z-10 overflow-y-auto max-h-[95vh] custom-scrollbar">
            {/* Header with urgency */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-block bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-black mb-4"
              >
                LIMITED SPOTS AVAILABLE
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                Book Your VIP Strategy Call Now
              </h2>
              <p className="text-orange-100 text-lg">
                Only {spotsLeft} spots left this week - Don't miss your chance for LIFETIME ACCESS
              </p>
            </div>

            {/* Calendar iframe - MOVED TO TOP */}
            <div className="p-6 bg-gray-900/40 border-b border-gray-700">
              <div className="max-w-4xl mx-auto mb-6">
                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/50 rounded-xl p-4 text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Choose Your Time Slot
                  </h3>
                  <p className="text-orange-200 text-sm">
                    Select a date and time that works best for your schedule
                  </p>
                </div>
              </div>

              <div className="max-w-4xl mx-auto relative">
                {!isCalendarLoaded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white to-gray-100 rounded-2xl z-10"
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{
                          rotate: 360,
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                          scale: { duration: 0.5, repeat: Infinity, repeatType: "reverse" }
                        }}
                        className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"
                      />
                      <motion.p
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-gray-700 font-bold text-lg"
                      >
                        Loading calendar...
                      </motion.p>
                      <p className="text-gray-500 text-sm mt-2">Please wait while we prepare your booking options</p>
                    </div>
                  </motion.div>
                )}
                <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                  <iframe
                    src="https://safeclick.kenjiai.com/widget/booking/jB82SG2CBq9Nh8103IfC"
                    style={{
                      width: '100%',
                      height: `${iframeHeight}px`,
                      minHeight: '700px',
                      border: 'none',
                      display: 'block',
                      overflow: 'hidden'
                    }}
                    scrolling="no"
                    id="BcIemEVdNzY7eDxTJD3q_1770498301373"
                    title="Book Your VIP Call"
                    onLoad={() => {
                      setIsCalendarLoaded(true);
                      console.log('Calendar iframe loaded');
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Urgency indicators */}
            <div className="bg-gray-900/60 backdrop-blur-sm border-b border-gray-700 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3 bg-red-900/30 border border-red-500/40 rounded-xl p-3"
                >
                  <Clock className="w-6 h-6 text-red-400 animate-pulse" />
                  <div>
                    <p className="text-red-400 font-bold text-sm">Time Left</p>
                    <p className="text-white font-mono text-lg">
                      {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3 bg-orange-900/30 border border-orange-500/40 rounded-xl p-3"
                >
                  <Users className="w-6 h-6 text-orange-400" />
                  <div>
                    <p className="text-orange-400 font-bold text-sm">Spots Left</p>
                    <p className="text-white text-lg font-black">{spotsLeft} / 5 This Week</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-3 bg-green-900/30 border border-green-500/40 rounded-xl p-3"
                >
                  <TrendingUp className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-green-400 font-bold text-sm">Avg. ROI</p>
                    <p className="text-white text-lg font-black">425%+</p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* What you'll get */}
            <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 border-b border-gray-700 p-6">
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                What You'll Get On This Call:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {[
                  'Custom $500K+ revenue roadmap',
                  'Live platform walkthrough',
                  'Exclusive lifetime access opportunity',
                  'Done-for-you strategy session',
                  'Priority onboarding guaranteed',
                  'Zero-obligation consultation'
                ].map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-200 text-sm">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Important notice */}
            <div className="bg-blue-900/20 border-b border-blue-500/30 p-4">
              <div className="flex items-start gap-3 max-w-3xl mx-auto">
                <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-blue-300 font-bold mb-2">Pre-Call Checklist:</p>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>1. Join via laptop/tablet (no mobile)</li>
                    <li>2. Have all decision-makers present</li>
                    <li>3. Be ready with investment funds for ad-spend scaling</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer urgency */}
            <div className="bg-gradient-to-r from-red-900/40 to-orange-900/40 border-t border-red-500/30 p-4 text-center">
              <p className="text-red-300 font-bold text-lg animate-pulse">
                Act Fast - This Opportunity Won't Last
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Join 50+ VIP clients earning $500K+/month
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(249, 115, 22, 0.6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(249, 115, 22, 0.8);
        }
      `}</style>
    </AnimatePresence>
  );
}
