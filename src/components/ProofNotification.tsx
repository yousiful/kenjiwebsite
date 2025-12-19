import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, User } from 'lucide-react';

interface NotificationData {
  name: string;
  action: string;
  location: string;
}

const notifications: NotificationData[] = [
  { name: "Sarah M.", action: "just purchased the Yearly Program", location: "New York" },
  { name: "Michael T.", action: "signed up for Monthly Program", location: "Los Angeles" },
  { name: "Jessica R.", action: "upgraded to Yearly Program", location: "Chicago" },
  { name: "David K.", action: "activated Voice AI Agents", location: "Miami" },
  { name: "Amanda L.", action: "just purchased the Monthly Program", location: "Seattle" },
  { name: "Chris P.", action: "deployed automation workflows", location: "Austin" },
  { name: "Jennifer S.", action: "signed up for Yearly Program", location: "Boston" },
  { name: "Robert H.", action: "activated CRM integration", location: "Denver" },
  { name: "Emily W.", action: "just purchased the Yearly Program", location: "Portland" },
  { name: "Daniel M.", action: "started using AI marketing", location: "Atlanta" },
  { name: "Lisa B.", action: "signed up for Monthly Program", location: "Phoenix" },
  { name: "Kevin D.", action: "upgraded to Yearly Program", location: "Dallas" },
];

export function ProofNotification() {
  const [currentNotification, setCurrentNotification] = useState<NotificationData | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
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
    }, 3000);

    const interval = setInterval(() => {
      showNotification();
    }, 12000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && currentNotification && (
        <motion.div
          initial={{ opacity: 0, x: -100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.8 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="fixed bottom-6 left-6 z-50 max-w-sm"
        >
          <div
            className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-2xl p-4 border-2 border-green-300/50"
            style={{
              boxShadow: '0 10px 40px rgba(16, 185, 129, 0.6), 0 0 20px rgba(16, 185, 129, 0.4)'
            }}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-white animate-pulse" />
                  <span className="text-white font-bold text-sm">Live Activity</span>
                </div>
                <p className="text-white text-sm font-semibold mb-1">
                  {currentNotification.name}
                </p>
                <p className="text-green-100 text-xs">
                  {currentNotification.action}
                </p>
                <p className="text-green-200 text-xs mt-1 opacity-90">
                  {currentNotification.location} • Just now
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
  );
}
