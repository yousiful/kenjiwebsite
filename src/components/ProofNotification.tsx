import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, User, Sparkles } from 'lucide-react';

interface NotificationData {
  name: string;
  action: string;
  location: string;
}

const notifications: NotificationData[] = [
  { name: "Sarah M.", action: "subscribed to Yearly Plan", location: "New York" },
  { name: "Michael T.", action: "joined Monthly Subscription", location: "Los Angeles" },
  { name: "Jessica R.", action: "upgraded to Yearly Subscription", location: "Chicago" },
  { name: "David K.", action: "built 5 automation workflows", location: "Miami" },
  { name: "Amanda L.", action: "subscribed to Monthly Plan", location: "Seattle" },
  { name: "Chris P.", action: "sent SMS blast to 1,000 contacts", location: "Austin" },
  { name: "Jennifer S.", action: "joined Yearly Subscription", location: "Boston" },
  { name: "Robert H.", action: "deployed 3 new workflows", location: "Denver" },
  { name: "Emily W.", action: "subscribed to Yearly Plan", location: "Portland" },
  { name: "Daniel M.", action: "sent SMS campaign to 2,500 leads", location: "Atlanta" },
  { name: "Lisa B.", action: "joined Monthly Subscription", location: "Phoenix" },
  { name: "Kevin D.", action: "upgraded to Yearly Plan", location: "Dallas" },
  { name: "Rachel P.", action: "built AI workflow automation", location: "San Diego" },
  { name: "Brian S.", action: "sent 500 SMS messages", location: "Charlotte" },
  { name: "Nicole H.", action: "subscribed to Monthly Plan", location: "Nashville" },
  { name: "Marcus J.", action: "deployed 7 workflows", location: "Orlando" },
  { name: "Ashley K.", action: "joined Yearly Subscription", location: "Columbus" },
  { name: "Tyler W.", action: "sent SMS blast to 3,000 contacts", location: "San Francisco" },
];

// Confetti particle component
const Confetti = ({ delay = 0 }: { delay?: number }) => {
  const colors = ['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#f59e0b', '#ef4444', '#3b82f6'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomX = Math.random() * 60 - 30;
  const randomRotate = Math.random() * 360;
  const randomDelay = delay + Math.random() * 0.2;

  return (
    <motion.div
      initial={{
        opacity: 1,
        y: 0,
        x: 0,
        rotate: 0,
        scale: 1
      }}
      animate={{
        opacity: 0,
        y: -80 + Math.random() * 40,
        x: randomX,
        rotate: randomRotate,
        scale: 0
      }}
      transition={{
        duration: 0.8 + Math.random() * 0.4,
        delay: randomDelay,
        ease: "easeOut"
      }}
      className="absolute"
      style={{
        width: '8px',
        height: '8px',
        backgroundColor: randomColor,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      }}
    />
  );
};

export function ProofNotification() {
  const [currentNotification, setCurrentNotification] = useState<NotificationData | null>(null);
  const [show, setShow] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const showNotification = () => {
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      setCurrentNotification(randomNotification);
      setShow(true);
      setShowConfetti(true);

      setTimeout(() => {
        setShowConfetti(false);
      }, 1200);

      setTimeout(() => {
        setShow(false);
      }, 5000);
    };

    const initialDelay = setTimeout(() => {
      showNotification();
    }, 4000);

    const interval = setInterval(() => {
      showNotification();
    }, 15000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {show && currentNotification && (
          <motion.div
            initial={{ opacity: 0, x: -100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.8 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
            className="fixed bottom-6 left-6 z-50 max-w-sm"
          >
            {/* Glow effect */}
            <motion.div
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-2xl blur-xl"
              style={{
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(16, 185, 129, 0) 70%)',
                transform: 'scale(1.2)',
              }}
            />

            <div
              className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 rounded-2xl shadow-2xl p-3.5 border border-green-300/30"
              style={{
                boxShadow: '0 10px 40px rgba(16, 185, 129, 0.5), 0 0 30px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
            >
              {/* Shimmer effect */}
              <motion.div
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 1
                }}
                className="absolute inset-0 overflow-hidden rounded-2xl"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                  width: '50%',
                }}
              />

              <div className="relative flex items-start gap-3">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="flex-shrink-0 w-10 h-10 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30"
                >
                  <User className="w-5 h-5 text-white" />
                </motion.div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-white animate-pulse" />
                    <span className="text-white/90 font-semibold text-xs tracking-wide uppercase">Live Activity</span>
                  </div>
                  <p className="text-white text-sm font-bold mb-0.5">
                    {currentNotification.name}
                  </p>
                  <p className="text-white/95 text-xs font-medium">
                    {currentNotification.action}
                  </p>
                  <p className="text-green-100/80 text-xs mt-1 flex items-center gap-1">
                    <span>{currentNotification.location}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      Just now
                    </span>
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 5, ease: "linear" }}
                className="absolute bottom-0 left-0 h-0.5 bg-white/40 rounded-full origin-left"
                style={{ width: '100%' }}
              />
            </div>

            {/* Confetti burst from sides */}
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none overflow-visible">
                {/* Left side confetti */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Confetti key={`left-${i}`} delay={i * 0.05} />
                  ))}
                </div>
                {/* Right side confetti */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Confetti key={`right-${i}`} delay={i * 0.05} />
                  ))}
                </div>
                {/* Top confetti */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Confetti key={`top-${i}`} delay={i * 0.04} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
