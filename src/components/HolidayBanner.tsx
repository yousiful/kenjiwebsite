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
      className="bg-gradient-to-r from-gray-800 to-gray-850 border-b border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-center gap-3 text-center">
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-lg"
          >
            {currentHoliday.emoji}
          </motion.span>
          <span className="text-gray-300 text-xs sm:text-sm">
            {currentHoliday.offer_text}
          </span>
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-blue-400 text-xs sm:text-sm font-semibold flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            {currentHoliday.offer_badge}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}
