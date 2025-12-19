import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useHolidayTheme } from '../contexts/HolidayThemeContext';

export function HolidayBanner() {
  const { currentHoliday, isHolidayActive } = useHolidayTheme();

  if (!isHolidayActive || !currentHoliday) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-600/90 to-cyan-600/90 backdrop-blur-sm border-b-2 border-blue-400/50 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-3 text-center">
          <motion.span
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl drop-shadow-lg"
          >
            {currentHoliday.emoji}
          </motion.span>
          <span className="text-white text-sm sm:text-base font-medium drop-shadow">
            {currentHoliday.offer_text}
          </span>
          <motion.span
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs sm:text-sm font-bold flex items-center gap-1 shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            {currentHoliday.offer_badge}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}
