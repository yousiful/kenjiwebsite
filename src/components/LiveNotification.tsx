import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const notifications = [
  { name: 'Lauren M.', location: 'Charlotte, NC', action: 'just joined KenjiAI automation' },
  { name: 'Michael R.', location: 'Austin, TX', action: 'started their free trial' },
  { name: 'Sarah K.', location: 'New York, NY', action: 'booked a VIP demo' },
  { name: 'James T.', location: 'Los Angeles, CA', action: 'upgraded to yearly plan' },
  { name: 'Emily W.', location: 'Chicago, IL', action: 'just joined KenjiAI automation' },
];

export function LiveNotification() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showInterval = setInterval(() => {
      setIsVisible(true);
      setCurrentIndex((prev) => (prev + 1) % notifications.length);

      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    }, 8000);

    return () => clearInterval(showInterval);
  }, []);

  const notification = notifications[currentIndex];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-8 left-8 z-50 max-w-sm"
        >
          <div className="bg-gray-900/95 backdrop-blur-lg border border-gray-700 rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {notification.name.charAt(0)}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-semibold text-sm truncate">
                    {notification.name}
                  </p>
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                </div>
                <p className="text-gray-400 text-xs truncate">
                  {notification.action}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-500 text-xs">{notification.location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-gray-500">Just now</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-xs text-green-400 font-medium">Verified</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
