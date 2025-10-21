import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, MapPin } from 'lucide-react';

interface Notification {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  action: string;
  actionType: string;
  actionIcon: string;
  timestamp: number;
  verified: boolean;
}

const customers = [
  { name: 'Sarah M.', email: 'sar***@gmail.com', phone: '(555) ***-4521', location: 'Austin, TX', verified: true },
  { name: 'Michael R.', email: 'mich***@outlook.com', phone: '(512) ***-7839', location: 'San Francisco, CA', verified: true },
  { name: 'Jennifer L.', email: 'jen***@yahoo.com', phone: '(415) ***-2847', location: 'Seattle, WA', verified: true },
  { name: 'David C.', email: 'dav***@company.co', phone: '(206) ***-9213', location: 'Boston, MA', verified: true },
  { name: 'Lisa P.', email: 'lis***@business.com', phone: '(617) ***-6582', location: 'Miami, FL', verified: true },
  { name: 'James W.', email: 'jam***@gmail.com', phone: '(305) ***-4719', location: 'Chicago, IL', verified: true },
  { name: 'Maria G.', email: 'mar***@startup.io', phone: '(312) ***-8364', location: 'Denver, CO', verified: true },
  { name: 'Robert K.', email: 'rob***@tech.com', phone: '(720) ***-2951', location: 'Atlanta, GA', verified: true },
  { name: 'Amanda T.', email: 'ama***@agency.net', phone: '(404) ***-7126', location: 'Portland, OR', verified: true },
  { name: 'Christopher B.', email: 'chr***@consulting.com', phone: '(503) ***-4893', location: 'Dallas, TX', verified: true },
  { name: 'Nicole H.', email: 'nic***@ventures.co', phone: '(214) ***-6217', location: 'Phoenix, AZ', verified: true },
  { name: 'Daniel S.', email: 'dan***@marketing.io', phone: '(602) ***-3584', location: 'New York, NY', verified: true },
  { name: 'Ashley D.', email: 'ash***@realestate.com', phone: '(917) ***-8942', location: 'Los Angeles, CA', verified: true },
  { name: 'Matthew J.', email: 'mat***@sales.com', phone: '(323) ***-5176', location: 'Houston, TX', verified: true },
  { name: 'Jessica F.', email: 'jes***@coaching.net', phone: '(713) ***-2649', location: 'Philadelphia, PA', verified: true },
  { name: 'Ryan A.', email: 'rya***@agency.co', phone: '(215) ***-7831', location: 'San Diego, CA', verified: true },
  { name: 'Lauren M.', email: 'lau***@ecommerce.com', phone: '(619) ***-4295', location: 'Charlotte, NC', verified: true },
  { name: 'Kevin L.', email: 'kev***@financial.io', phone: '(704) ***-9163', location: 'Indianapolis, IN', verified: true },
  { name: 'Rachel N.', email: 'rac***@legal.com', phone: '(317) ***-5728', location: 'Columbus, OH', verified: true },
  { name: 'Brandon P.', email: 'bra***@construction.net', phone: '(614) ***-2841', location: 'Nashville, TN', verified: true },
  { name: 'Stephanie V.', email: 'ste***@healthcare.com', phone: '(615) ***-6397', location: 'Raleigh, NC', verified: true },
  { name: 'Eric W.', email: 'eri***@tech.io', phone: '(919) ***-4572', location: 'Minneapolis, MN', verified: true },
  { name: 'Melissa K.', email: 'mel***@retail.com', phone: '(612) ***-8136', location: 'Tampa, FL', verified: true },
  { name: 'Justin R.', email: 'jus***@consulting.co', phone: '(813) ***-9254', location: 'Las Vegas, NV', verified: true },
  { name: 'Brittany S.', email: 'bri***@fitness.com', phone: '(702) ***-3687', location: 'Orlando, FL', verified: true },
  { name: 'Andrew H.', email: 'and***@restaurant.io', phone: '(407) ***-5129', location: 'Detroit, MI', verified: true },
  { name: 'Samantha G.', email: 'sam***@design.net', phone: '(313) ***-7463', location: 'San Antonio, TX', verified: true },
  { name: 'Tyler M.', email: 'tyl***@logistics.com', phone: '(210) ***-2918', location: 'Kansas City, MO', verified: true },
  { name: 'Kimberly B.', email: 'kim***@insurance.co', phone: '(816) ***-6542', location: 'Baltimore, MD', verified: true },
  { name: 'Joshua C.', email: 'jos***@automotive.com', phone: '(410) ***-8375', location: 'Milwaukee, WI', verified: true }
];

const actions = [
  { text: 'just subscribed to KenjiAI Pro', type: 'purchase', icon: '💳' },
  { text: 'just joined KenjiAI', type: 'signup', icon: '🎉' },
  { text: 'upgraded to Pro plan', type: 'upgrade', icon: '⚡' },
  { text: 'launched their first AI voice agent', type: 'milestone', icon: '🤖' },
  { text: 'just automated their sales workflow', type: 'milestone', icon: '✨' },
  { text: 'closed their first deal with AI', type: 'success', icon: '🎯' },
  { text: 'joined 50,000+ KenjiAI users', type: 'signup', icon: '🚀' },
  { text: 'set up their AI business system', type: 'milestone', icon: '⚙️' },
  { text: 'activated their CRM automation', type: 'milestone', icon: '📊' },
  { text: 'subscribed for $275/month', type: 'purchase', icon: '💰' }
];

const SocialProofNotifications: React.FC = () => {
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);

  const generateNotification = useCallback((): Notification => {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];

    return {
      id: `notif-${Date.now()}-${Math.random()}`,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      location: customer.location,
      action: action.text,
      actionType: action.type,
      actionIcon: action.icon,
      timestamp: Date.now(),
      verified: customer.verified
    };
  }, []);

  useEffect(() => {
    const showNotification = () => {
      const newNotif = generateNotification();
      setCurrentNotification(newNotif);

      setTimeout(() => {
        setCurrentNotification(null);
      }, 5000);
    };

    showNotification();

    const interval = setInterval(() => {
      showNotification();
    }, 12000);

    return () => clearInterval(interval);
  }, [generateNotification]);

  return (
    <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50 pointer-events-none">
      <AnimatePresence>
        {currentNotification && (
          <motion.div
            key={currentNotification.id}
            initial={{ opacity: 0, x: -100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30
            }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg md:rounded-xl shadow-xl border border-green-400/40 p-2.5 md:p-3 max-w-[280px] md:max-w-[320px] pointer-events-auto backdrop-blur-lg"
          >
            <div className="flex items-start gap-2 md:gap-2.5">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-lg md:text-xl shadow-lg">
                  {currentNotification.actionIcon}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="font-semibold text-white text-xs md:text-sm truncate">
                    {currentNotification.name}
                  </p>
                  {currentNotification.verified && (
                    <CheckCircle className="w-3 h-3 md:w-3.5 md:h-3.5 text-green-400 flex-shrink-0" />
                  )}
                </div>

                <p className="text-xs md:text-sm text-gray-300 mb-1 md:mb-1.5 font-medium line-clamp-2">
                  {currentNotification.action}
                </p>

                <div className="flex items-center gap-1 text-[10px] md:text-xs text-gray-400">
                  <MapPin className="w-2.5 h-2.5 md:w-3 md:h-3 flex-shrink-0" />
                  <span className="truncate">{currentNotification.location}</span>
                </div>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-gray-700/50">
              <div className="flex items-center justify-between text-[10px] md:text-xs">
                <span className="text-gray-500">Just now</span>
                <div className="flex items-center gap-1">
                  <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-green-400"></span>
                  </span>
                  <span className="text-green-400 font-semibold">Verified</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialProofNotifications;
