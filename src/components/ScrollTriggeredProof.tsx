import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, User, ShoppingCart, Zap, Star, Award, TrendingUp } from 'lucide-react';

interface Notification {
  id: string;
  name: string;
  action: string;
  location: string;
  icon: typeof User;
  color: string;
  timestamp: Date;
}

const firstNames = [
  'Sarah', 'Michael', 'Jessica', 'David', 'Amanda', 'Chris', 'Jennifer', 'Robert',
  'Emily', 'Daniel', 'Lisa', 'Kevin', 'Rachel', 'Matthew', 'Ashley', 'James',
  'Lauren', 'Andrew', 'Nicole', 'Joshua', 'Melissa', 'Ryan', 'Stephanie', 'Brian',
  'Rebecca', 'Justin', 'Brittany', 'Brandon', 'Samantha', 'Tyler'
];

const locations = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
  'San Antonio', 'San Diego', 'Dallas', 'Austin', 'Seattle', 'Boston',
  'Denver', 'Miami', 'Atlanta', 'Portland', 'Las Vegas', 'Nashville',
  'Detroit', 'Charlotte', 'Toronto', 'London', 'Sydney', 'Singapore'
];

const activities = [
  {
    action: 'just signed up for KenjiAI',
    icon: User,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    action: 'purchased the Yearly Program',
    icon: ShoppingCart,
    color: 'from-green-500 to-emerald-500'
  },
  {
    action: 'activated Voice AI Agents',
    icon: Zap,
    color: 'from-purple-500 to-pink-500'
  },
  {
    action: 'gave KenjiAI 5 stars',
    icon: Star,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    action: 'achieved $10K revenue milestone',
    icon: Award,
    color: 'from-pink-500 to-rose-500'
  },
  {
    action: 'upgraded to Yearly Plan',
    icon: TrendingUp,
    color: 'from-indigo-500 to-purple-500'
  },
  {
    action: 'deployed automation workflows',
    icon: Zap,
    color: 'from-cyan-500 to-blue-500'
  },
  {
    action: 'closed their first AI deal',
    icon: CheckCircle,
    color: 'from-emerald-500 to-green-500'
  }
];

const generateNotification = (): Notification => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  const activity = activities[Math.floor(Math.random() * activities.length)];

  return {
    id: Math.random().toString(36).substring(2, 11),
    name: `${firstName} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}.`,
    action: activity.action,
    location,
    icon: activity.icon,
    color: activity.color,
    timestamp: new Date()
  };
};

export function ScrollTriggeredProof() {
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [show, setShow] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [notificationQueue] = useState<Notification[]>(() =>
    Array(20).fill(null).map(() => generateNotification())
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewportPosition, setViewportPosition] = useState(0);

  const handleScroll = useCallback(() => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
    setScrollProgress(scrollPercentage);
    setViewportPosition(scrollTop);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const showNotificationAtProgress = (progress: number) => {
      const thresholds = [10, 20, 30, 40, 50, 60, 70, 80];
      const threshold = thresholds.find(t => progress >= t && progress < t + 5);

      if (threshold) {
        const index = Math.floor(threshold / 10);
        if (index !== currentIndex && index < notificationQueue.length) {
          const notification = notificationQueue[index];
          setCurrentNotification(notification);
          setCurrentIndex(index);
          setShow(true);

          setTimeout(() => {
            setShow(false);
          }, 5000);
        }
      }
    };

    showNotificationAtProgress(scrollProgress);
  }, [scrollProgress, notificationQueue, currentIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (notificationQueue.length > 0) {
        setCurrentNotification(notificationQueue[0]);
        setShow(true);

        setTimeout(() => {
          setShow(false);
        }, 5000);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="fixed left-4 z-40 pointer-events-none transition-all duration-500 ease-out"
      style={{
        top: `${Math.min(viewportPosition + window.innerHeight * 0.7, document.documentElement.scrollHeight - 200)}px`
      }}
    >
      <AnimatePresence>
        {show && currentNotification && (
          <motion.div
            initial={{ opacity: 0, x: -80, scale: 0.85 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -80, scale: 0.85 }}
            transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
            className="pointer-events-none"
          >
            <div
              className={`bg-gradient-to-r ${currentNotification.color} rounded-xl shadow-lg p-2.5 border border-white/10 backdrop-blur-md bg-opacity-40 max-w-[280px] sm:max-w-xs`}
              style={{
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                backgroundColor: 'rgba(255, 255, 255, 0.08)'
              }}
            >
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 w-7 h-7 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <currentNotification.icon className="w-3.5 h-3.5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <CheckCircle className="w-2.5 h-2.5 text-white/90" />
                    <span className="text-white/90 font-semibold text-[10px] tracking-wide uppercase">Live</span>
                  </div>
                  <p className="text-white text-xs font-semibold mb-0.5 leading-tight">
                    {currentNotification.name}
                  </p>
                  <p className="text-white/85 text-[11px] leading-snug">
                    {currentNotification.action}
                  </p>
                  <p className="text-white/70 text-[10px] mt-0.5">
                    {currentNotification.location}
                  </p>
                </div>
              </div>

              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 5, ease: 'linear' }}
                className="absolute bottom-0 left-0 h-0.5 bg-white/20 rounded-full origin-left"
                style={{ width: '100%' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
