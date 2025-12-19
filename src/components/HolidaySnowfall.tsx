import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useHolidayTheme } from '../contexts/HolidayThemeContext';

interface Snowflake {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

export function HolidaySnowfall() {
  const { currentHoliday, isHolidayActive } = useHolidayTheme();
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    if (!isHolidayActive || !currentHoliday) return;

    const flakes: Snowflake[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 4,
      size: 0.5 + Math.random() * 1.5
    }));

    setSnowflakes(flakes);
  }, [isHolidayActive, currentHoliday]);

  if (!isHolidayActive || !currentHoliday) return null;

  const isWinterHoliday = currentHoliday.name === 'Christmas' || currentHoliday.name === 'New Year' || currentHoliday.name === 'New Year Eve';

  return (
    <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          initial={{ y: -20, x: 0, opacity: 0 }}
          animate={{
            y: '100vh',
            x: [0, Math.sin(flake.id) * 50, 0],
            opacity: [0, 1, 1, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute text-white"
          style={{
            left: `${flake.left}%`,
            fontSize: `${flake.size}rem`,
          }}
        >
          {isWinterHoliday ? '❄️' : currentHoliday.emoji}
        </motion.div>
      ))}
    </div>
  );
}
