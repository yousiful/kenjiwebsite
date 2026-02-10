import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ShoppingCart, TrendingUp, Award, Star, Zap } from 'lucide-react';

interface NotificationData {
  name: string;
  action: string;
  value: string;
  type: 'revenue' | 'conversion' | 'achievement' | 'rating';
}

const notifications: NotificationData[] = [
  { name: "Alex M.", action: "generated", value: "$15,200 in revenue", type: "revenue" },
  { name: "Taylor S.", action: "achieved", value: "85% conversion rate", type: "conversion" },
  { name: "Jordan P.", action: "earned", value: "$8,500 this month", type: "revenue" },
  { name: "Morgan K.", action: "reached", value: "500+ qualified leads", type: "achievement" },
  { name: "Casey L.", action: "generated", value: "$22,000 in sales", type: "revenue" },
  { name: "Riley H.", action: "achieved", value: "92% customer satisfaction", type: "rating" },
  { name: "Avery D.", action: "earned", value: "$12,800 profit", type: "revenue" },
  { name: "Quinn B.", action: "reached", value: "1,000+ automation runs", type: "achievement" },
  { name: "Sage W.", action: "generated", value: "$18,300 revenue", type: "revenue" },
  { name: "Dakota R.", action: "achieved", value: "78% conversion boost", type: "conversion" },
  { name: "Phoenix T.", action: "earned", value: "$25,000 monthly", type: "revenue" },
  { name: "River M.", action: "reached", value: "5-star rating streak", type: "rating" },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'revenue':
      return ShoppingCart;
    case 'conversion':
      return TrendingUp;
    case 'achievement':
      return Award;
    case 'rating':
      return Star;
    default:
      return Zap;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'revenue':
      return 'from-emerald-500 via-green-500 to-emerald-600';
    case 'conversion':
      return 'from-blue-500 via-indigo-500 to-blue-600';
    case 'achievement':
      return 'from-amber-500 via-yellow-500 to-amber-600';
    case 'rating':
      return 'from-orange-500 via-red-500 to-orange-600';
    default:
      return 'from-purple-500 via-pink-500 to-purple-600';
  }
};

export function RightSideNotifications() {
  const [currentNotification, setCurrentNotification] = useState<NotificationData | null>(null);
  const [show, setShow] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
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
        if (!isHovered) {
          setShow(false);
        }
      }, 6000);
    };

    const initialDelay = setTimeout(() => {
      showNotification();
    }, 3000);

    const interval = setInterval(() => {
      if (!isHovered) {
        showNotification();
      }
    }, 14000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [hasScrolled, isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTimeout(() => {
      if (!isHovered) {
        setShow(false);
      }
    }, 2000);
  };

  if (!hasScrolled) return null;

  return (
    <AnimatePresence>
      {show && currentNotification && (
        <motion.div
          initial={{ opacity: 0, x: 120, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 120, scale: 0.9 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
          className="fixed right-2 sm:right-4 z-40 max-w-[240px] sm:max-w-[260px] hidden lg:block"
          style={{
            top: '50vh',
            transform: 'translateY(-50%)',
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-2xl blur-2xl"
            style={{
              background: `radial-gradient(circle, ${
                currentNotification.type === 'revenue' ? 'rgba(16, 185, 129, 0.4)' :
                currentNotification.type === 'conversion' ? 'rgba(59, 130, 246, 0.4)' :
                currentNotification.type === 'achievement' ? 'rgba(245, 158, 11, 0.4)' :
                'rgba(249, 115, 22, 0.4)'
              } 0%, transparent 70%)`,
              transform: 'scale(1.3)',
            }}
          />

          <div
            className={`relative bg-gradient-to-br ${getNotificationColor(currentNotification.type)} rounded-xl shadow-2xl p-2.5 border border-white/20`}
            style={{
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
          >
            <motion.div
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 2
              }}
              className="absolute inset-0 overflow-hidden rounded-xl"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent)',
                width: '40%',
              }}
            />

            <div className="relative flex items-start gap-2">
              {React.createElement(
                motion.div,
                {
                  animate: {
                    scale: [1, 1.15, 1],
                    rotate: [0, 8, -8, 0]
                  },
                  transition: {
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  },
                  className: "flex-shrink-0 w-8 h-8 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 shadow-lg"
                },
                React.createElement(getNotificationIcon(currentNotification.type), {
                  className: "w-4 h-4 text-white"
                })
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <CheckCircle className="w-2.5 h-2.5 text-white animate-pulse" />
                  <span className="text-white/95 font-bold text-[9px] tracking-wider uppercase">Success Story</span>
                </div>
                <p className="text-white text-xs font-bold mb-0.5 drop-shadow-md">
                  {currentNotification.name}
                </p>
                <p className="text-white/95 text-[10px] font-medium drop-shadow leading-tight">
                  {currentNotification.action} <span className="font-bold">{currentNotification.value}</span>
                </p>
                <div className="flex items-center gap-1.5 mt-1.5 text-[9px]">
                  <span className="text-white/80">with KenjiAI</span>
                  <span className="text-white/60">•</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-white animate-pulse shadow-lg"></span>
                    <span className="text-white/90 font-medium">Live</span>
                  </div>
                </div>
              </div>
            </div>

            {!isHovered && (
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 6, ease: "linear" }}
                className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-full origin-left"
                style={{ width: '100%' }}
              />
            )}
          </div>

          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-8 left-0 right-0 text-center"
            >
              <span className="text-xs text-gray-400 bg-gray-900/80 px-3 py-1 rounded-full backdrop-blur-sm">
                Hover to pause
              </span>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
