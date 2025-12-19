import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useHolidayTheme } from '../contexts/HolidayThemeContext';

export function HolidayBanner() {
  const { currentHoliday, isHolidayActive } = useHolidayTheme();

  if (!isHolidayActive || !currentHoliday) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 border-b border-white/10"
      style={{ zIndex: 40 }}
    >
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 py-2.5">
        <div className="flex items-center justify-center gap-2 sm:gap-4 text-center flex-wrap">
          <motion.span
            animate={{
              rotate: [0, 15, -15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-xl sm:text-2xl"
          >
            {currentHoliday.emoji}
          </motion.span>
          <span className="text-white text-xs sm:text-sm font-semibold tracking-wide">
            {currentHoliday.offer_text}
          </span>
          <motion.span
            animate={{
              boxShadow: [
                '0 0 10px rgba(255,255,255,0.3)',
                '0 0 20px rgba(255,255,255,0.5)',
                '0 0 10px rgba(255,255,255,0.3)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-white/95 px-2.5 py-1 rounded-md text-gray-900 text-[10px] sm:text-xs font-black uppercase flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-yellow-500" />
            {currentHoliday.offer_badge}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}
