import React from 'react';
import { motion } from 'framer-motion';
import { useHolidayTheme } from '../contexts/HolidayThemeContext';
import { useLocation } from 'react-router-dom';

export function HolidayFloatingElements() {
  const { currentHoliday, isHolidayActive } = useHolidayTheme();
  const location = useLocation();

  if (!isHolidayActive || !currentHoliday) return null;

  const isPricingPage = location.pathname === '/pricing';

  const allPositions = [
    { top: '5%', left: '5%', delay: 0 },
    { top: '15%', right: '8%', delay: 0.3 },
    { top: '25%', left: '10%', delay: 0.6 },
    { top: '35%', right: '12%', delay: 0.9 },
    { top: '45%', left: '3%', delay: 1.2 },
    { top: '55%', right: '5%', delay: 1.5 },
    { top: '65%', left: '15%', delay: 1.8 },
    { top: '75%', right: '7%', delay: 2.1 },
    { top: '85%', left: '7%', delay: 2.4 },
    { top: '95%', right: '10%', delay: 2.7 }
  ];

  const positions = isPricingPage ? allPositions.slice(0, 4) : allPositions;

  return (
    <>
      {positions.map((pos, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.2, 0.7, 0.2],
            scale: [0.8, 1.3, 0.8],
            rotate: [0, 360],
            y: [0, -20, 0]
          }}
          transition={{
            duration: 6 + (index % 3),
            repeat: Infinity,
            delay: pos.delay,
            ease: "easeInOut"
          }}
          className="fixed pointer-events-none z-[5]"
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            fontSize: index % 2 === 0 ? '2.5rem' : '1.8rem'
          }}
        >
          {currentHoliday.emoji}
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed bottom-8 left-4 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white px-5 py-3 rounded-xl shadow-2xl z-[45] hidden lg:flex items-center gap-3 border-2 border-white/20"
      >
        <motion.span
          animate={{
            rotate: [0, 15, -15, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-2xl"
        >
          {currentHoliday.emoji}
        </motion.span>
        <div className="text-sm">
          <motion.div
            className="font-bold text-yellow-300 mb-1"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {currentHoliday.offer_badge}
          </motion.div>
          <div className="text-xs opacity-90">{currentHoliday.offer_text}</div>
          <div className="text-xs text-yellow-200 mt-1 font-semibold">{currentHoliday.urgency_text}</div>
        </div>
      </motion.div>
    </>
  );
}
