import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, User, TrendingUp, Users, Zap } from 'lucide-react';

interface NotificationData {
  name: string;
  action: string;
  location: string;
  type: 'signup' | 'upgrade' | 'activity';
}

const notifications: NotificationData[] = [
  { name: "Sarah M.", action: "subscribed to Yearly Plan", location: "New York", type: "signup" },
  { name: "Michael T.", action: "joined Monthly Subscription", location: "Los Angeles", type: "signup" },
  { name: "Jessica R.", action: "upgraded to Yearly Subscription", location: "Chicago", type: "upgrade" },
  { name: "David K.", action: "built 5 automation workflows", location: "Miami", type: "activity" },
  { name: "Amanda L.", action: "subscribed to Monthly Plan", location: "Seattle", type: "signup" },
  { name: "Chris P.", action: "sent SMS blast to 1,000 contacts", location: "Austin", type: "activity" },
  { name: "Jennifer S.", action: "joined Yearly Subscription", location: "Boston", type: "signup" },
  { name: "Robert H.", action: "deployed 3 new workflows", location: "Denver", type: "activity" },
  { name: "Emily W.", action: "subscribed to Yearly Plan", location: "Portland", type: "signup" },
  { name: "Daniel M.", action: "sent SMS campaign to 2,500 leads", location: "Atlanta", type: "activity" },
  { name: "Lisa B.", action: "joined Monthly Subscription", location: "Phoenix", type: "signup" },
  { name: "Kevin D.", action: "upgraded to Yearly Plan", location: "Dallas", type: "upgrade" },
  { name: "Rachel P.", action: "built AI workflow automation", location: "San Diego", type: "activity" },
  { name: "Brian S.", action: "sent 500 SMS messages", location: "Charlotte", type: "activity" },
  { name: "Nicole H.", action: "subscribed to Monthly Plan", location: "Nashville", type: "signup" },
  { name: "Marcus J.", action: "deployed 7 workflows", location: "Orlando", type: "activity" },
  { name: "Ashley K.", action: "joined Yearly Subscription", location: "Columbus", type: "signup" },
  { name: "Tyler W.", action: "sent SMS blast to 3,000 contacts", location: "San Francisco", type: "activity" },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'signup':
      return User;
    case 'upgrade':
      return TrendingUp;
    case 'activity':
      return Zap;
    default:
      return User;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'signup':
      return 'from-green-500 via-emerald-500 to-green-600';
    case 'upgrade':
      return 'from-blue-500 via-cyan-500 to-blue-600';
    case 'activity':
      return 'from-purple-500 via-violet-500 to-purple-600';
    default:
      return 'from-green-500 via-emerald-500 to-green-600';
  }
};

export function LeftSideNotifications() {
  const [currentNotification, setCurrentNotification] = useState<NotificationData | null>(null);
  const [show, setShow] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
        if (!isHovered) {
          setShow(false);
        }
      }, 6000);
    };

    const initialDelay = setTimeout(() => {
      showNotification();
    }, 2000);

    const interval = setInterval(() => {
      if (!isHovered) {
        showNotification();
      }
    }, 12000);

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
          initial={{ opacity: 0, x: -120, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -120, scale: 0.9 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
          className="fixed left-6 top-1/2 -translate-y-1/2 z-40 max-w-xs"
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
                currentNotification.type === 'signup' ? 'rgba(16, 185, 129, 0.4)' :
                currentNotification.type === 'upgrade' ? 'rgba(59, 130, 246, 0.4)' :
                'rgba(168, 85, 247, 0.4)'
              } 0%, transparent 70%)`,
              transform: 'scale(1.3)',
            }}
          />

          <div
            className={`relative bg-gradient-to-br ${getNotificationColor(currentNotification.type)} rounded-2xl shadow-2xl p-4 border border-white/20`}
            style={{
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
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
              className="absolute inset-0 overflow-hidden rounded-2xl"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent)',
                width: '40%',
              }}
            />

            <div className="relative flex items-start gap-3">
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
                  className: "flex-shrink-0 w-11 h-11 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/40 shadow-lg"
                },
                React.createElement(getNotificationIcon(currentNotification.type), {
                  className: "w-5 h-5 text-white"
                })
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-3.5 h-3.5 text-white animate-pulse" />
                  <span className="text-white/95 font-bold text-xs tracking-wider uppercase">Live Activity</span>
                </div>
                <p className="text-white text-sm font-bold mb-1 drop-shadow-md">
                  {currentNotification.name}
                </p>
                <p className="text-white/95 text-xs font-medium drop-shadow">
                  {currentNotification.action}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className="text-white/80">{currentNotification.location}</span>
                  <span className="text-white/60">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-lg"></span>
                    <span className="text-white/90 font-medium">Just now</span>
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
