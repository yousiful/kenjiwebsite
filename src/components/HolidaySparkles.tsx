import React from 'react';
import { motion } from 'framer-motion';
import { useHolidayTheme } from '../contexts/HolidayThemeContext';

export function HolidaySparkles() {
  const { currentHoliday, isHolidayActive } = useHolidayTheme();

  if (!isHolidayActive || !currentHoliday) return null;

  const sparklePositions = [
    { top: '20%', left: '15%', delay: 0 },
    { top: '40%', left: '85%', delay: 0.5 },
    { top: '60%', left: '25%', delay: 1 },
    { top: '80%', left: '75%', delay: 1.5 },
    { top: '30%', left: '50%', delay: 2 },
    { top: '70%', left: '60%', delay: 2.5 }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-[4]">
      {sparklePositions.map((pos, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{ top: pos.top, left: pos.left }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180]
          }}
          transition={{
            duration: 2,
            delay: pos.delay,
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path
              d="M15 0L16.5 13.5L30 15L16.5 16.5L15 30L13.5 16.5L0 15L13.5 13.5L15 0Z"
              fill={currentHoliday.theme_color}
              opacity="0.6"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
