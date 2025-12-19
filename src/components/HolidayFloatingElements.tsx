import React from 'react';
import { motion } from 'framer-motion';
import { useHolidayTheme } from '../contexts/HolidayThemeContext';

export function HolidayFloatingElements() {
  const { currentHoliday, isHolidayActive } = useHolidayTheme();

  if (!isHolidayActive || !currentHoliday) return null;

  const positions = [
    { top: '10%', left: '5%', delay: 0 },
    { top: '25%', right: '8%', delay: 0.5 },
    { top: '45%', left: '3%', delay: 1 },
    { top: '60%', right: '5%', delay: 1.5 },
    { top: '80%', left: '7%', delay: 2 },
    { top: '90%', right: '10%', delay: 2.5 }
  ];

  return (
    <>
      {positions.map((pos, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
            rotate: [0, 360]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: pos.delay,
            ease: "easeInOut"
          }}
          className="fixed pointer-events-none z-[5]"
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            fontSize: '2rem'
          }}
        >
          {currentHoliday.emoji}
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed bottom-8 left-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-[45] hidden lg:flex items-center gap-2"
      >
        <motion.span
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xl"
        >
          {currentHoliday.emoji}
        </motion.span>
        <div className="text-sm">
          <div className="font-bold">{currentHoliday.offer_badge}</div>
          <div className="text-xs opacity-90">{currentHoliday.offer_text}</div>
        </div>
      </motion.div>
    </>
  );
}
