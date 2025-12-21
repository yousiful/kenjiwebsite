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
      transition={{ duration: 0.5 }}
      className="fixed top-16 left-0 right-0 w-full bg-gradient-to-r from-red-600 via-green-600 to-red-600 shadow-lg border-y border-yellow-400/50 z-40"
      style={{
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3), 0 0 30px rgba(220, 38, 38, 0.3), inset 0 1px 5px rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

      {/* Animated sparkle borders */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: ['-100%', '200%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{ width: '30%' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-1.5">
        <div className="flex items-center justify-center gap-1.5 sm:gap-3 text-center flex-wrap">
          <motion.span
            animate={{
              rotate: [0, 15, -15, 15, 0],
              scale: [1, 1.2, 1, 1.2, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-xl sm:text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          >
            {currentHoliday.emoji}
          </motion.span>

          <span className="text-white text-xs sm:text-sm font-extrabold tracking-wide drop-shadow-[0_1px_5px_rgba(0,0,0,0.8)]">
            {currentHoliday.offer_text}
          </span>

          <motion.span
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 0 15px rgba(255,255,255,0.4)',
                '0 0 25px rgba(255,255,255,0.6)',
                '0 0 15px rgba(255,255,255,0.4)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 px-2.5 py-0.5 rounded-full text-red-600 text-xs font-black uppercase flex items-center gap-1.5 shadow-xl border border-yellow-400"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-3 h-3" />
            </motion.div>
            {currentHoliday.offer_badge}
          </motion.span>

          {/* Decorative snowflakes */}
          <motion.span
            animate={{
              y: [0, -3, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-base sm:text-lg drop-shadow-md hidden sm:inline"
          >
            ❄️
          </motion.span>
        </div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
    </motion.div>
  );
}
