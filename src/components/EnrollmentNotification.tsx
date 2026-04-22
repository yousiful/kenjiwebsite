import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck } from 'lucide-react';

const NAMES = ["John S.", "Sarah M.", "David L.", "Elena R.", "Marcus T.", "Aria K.", "Liam J.", "Sophie V.", "Michael B.", "Jessica W."];
const COURSES = [
  "AI Business Automation Mastery",
  "Voice AI Sales Mastery",
  "Tax Optimization for Entrepreneurs",
  "Smart Investment Strategies",
  "AI Customer Service Excellence"
];
const LOCATIONS = ["Austin, TX", "London, UK", "Sydney, AU", "New York, NY", "Dubai, UAE", "Toronto, CA", "Berlin, DE"];

const EnrollmentNotification: React.FC = () => {
  const [notification, setNotification] = useState<{name: string, course: string, location: string} | null>(null);

  useEffect(() => {
    const showNotification = () => {
      const name = NAMES[Math.floor(Math.random() * NAMES.length)];
      const course = COURSES[Math.floor(Math.random() * COURSES.length)];
      const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      
      setNotification({ name, course, location });
      
      setTimeout(() => setNotification(null), 5000);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        showNotification();
      }
    }, 15000 + Math.random() * 20000);

    // Show one early
    const initialTimeout = setTimeout(showNotification, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
          className="fixed bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-auto z-[100] flex items-center gap-4 bg-gray-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl md:max-w-sm"
        >
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="text-white font-bold text-sm">New Enrollment!</div>
            <div className="text-gray-400 text-xs mt-1">
              <span className="text-blue-400 font-semibold">{notification.name}</span> from {notification.location} just joined <span className="text-gray-200">{notification.course}</span>.
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnrollmentNotification;
