import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';

export function ScrollControls() {
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowControls(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {showControls && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
          className="fixed right-6 bottom-6 z-40 flex flex-col gap-2"
        >
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
            style={{
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.5)'
            }}
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>

          <motion.button
            onClick={scrollToBottom}
            whileHover={{ scale: 1.1, y: 2 }}
            whileTap={{ scale: 0.9 }}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-300"
            style={{
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.5)'
            }}
            aria-label="Scroll to bottom"
          >
            <ChevronDown className="w-6 h-6" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
