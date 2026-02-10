import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, TrendingUp, Users, ShoppingCart } from 'lucide-react';

interface NotificationData {
  name: string;
  action: string;
  type: 'signup' | 'purchase' | 'activity';
}

const notifications: NotificationData[] = [
  { name: "Sarah M.", action: "just subscribed to Yearly Plan", type: "purchase" },
  { name: "Michael T.", action: "joined KenjiAI", type: "signup" },
  { name: "Jessica R.", action: "upgraded to Yearly Plan", type: "purchase" },
  { name: "David K.", action: "achieved $15K revenue", type: "activity" },
  { name: "Amanda L.", action: "just purchased Monthly Plan", type: "purchase" },
  { name: "Chris P.", action: "signed up for demo", type: "signup" },
  { name: "Jennifer S.", action: "just subscribed", type: "purchase" },
  { name: "Robert H.", action: "reached 85% conversion", type: "activity" },
  { name: "Emily W.", action: "joined Yearly Plan", type: "purchase" },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'signup':
      return Users;
    case 'purchase':
      return ShoppingCart;
    case 'activity':
      return TrendingUp;
    default:
      return CheckCircle;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'signup':
      return 'from-blue-500 to-cyan-500';
    case 'purchase':
      return 'from-green-500 to-emerald-500';
    case 'activity':
      return 'from-purple-500 to-pink-500';
    default:
      return 'from-gray-500 to-gray-600';
  }
};

export function MobileBottomNotification() {
  const [currentNotification, setCurrentNotification] = useState<NotificationData | null>(null);
  const [show, setShow] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!hasScrolled) return;

    const showNotification = () => {
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      setCurrentNotification(randomNotification);
      setShow(true);

      setTimeout(() => {
        setShow(false);
      }, 5000);
    };

    const initialDelay = setTimeout(() => {
      showNotification();
    }, 2500);

    const interval = setInterval(() => {
      showNotification();
    }, 13000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [hasScrolled]);

  if (!hasScrolled) return null;

  return (
    <div className="md:hidden">
      <AnimatePresence>
        {show && currentNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.25 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-[320px]"
          >
            <motion.div
              animate={{
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-xl blur-xl"
              style={{
                background: `radial-gradient(circle, ${
                  currentNotification.type === 'signup' ? 'rgba(59, 130, 246, 0.5)' :
                  currentNotification.type === 'purchase' ? 'rgba(16, 185, 129, 0.5)' :
                  'rgba(168, 85, 247, 0.5)'
                } 0%, transparent 70%)`,
              }}
            />

            <div
              className={`relative bg-gradient-to-r ${getNotificationColor(currentNotification.type)} rounded-xl shadow-2xl p-3 border border-white/20`}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex-shrink-0 w-9 h-9 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center">
                  {React.createElement(getNotificationIcon(currentNotification.type), {
                    className: "w-4.5 h-4.5 text-white"
                  })}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <CheckCircle className="w-2.5 h-2.5 text-white animate-pulse" />
                    <span className="text-white/95 font-bold text-[9px] tracking-wider uppercase">Live</span>
                  </div>
                  <p className="text-white text-xs font-bold leading-tight">
                    {currentNotification.name}
                  </p>
                  <p className="text-white/95 text-[11px] font-medium leading-tight mt-0.5">
                    {currentNotification.action}
                  </p>
                </div>
              </div>

              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 5, ease: "linear" }}
                className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-full origin-left"
                style={{ width: '100%' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
