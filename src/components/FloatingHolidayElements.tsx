import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useHoliday } from '../hooks/useHoliday';

interface FloatingElement {
  id: number;
  emoji: string;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

export const FloatingHolidayElements = () => {
  const { currentHoliday } = useHoliday();
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    if (!currentHoliday) {
      setElements([]);
      return;
    }

    const holidayEmojis: Record<string, string[]> = {
      'New Year': ['🎆', '🎊', '🥳', '✨', '🎉'],
      "Valentine's Day": ['💝', '💕', '💖', '💗', '❤️', '💘'],
      "St. Patrick's Day": ['🍀', '🌈', '☘️', '💚'],
      'Easter': ['🐰', '🥚', '🐣', '🌷', '🌸'],
      'Independence Day': ['🎆', '🎇', '🇺🇸', '⭐', '🦅'],
      'Halloween': ['🎃', '👻', '🦇', '🕷️', '🕸️', '🍬'],
      'Thanksgiving': ['🦃', '🍂', '🌽', '🥧', '🍁'],
      'Black Friday': ['🛍️', '💰', '💳', '🏷️', '💵'],
      'Cyber Monday': ['💻', '⌨️', '🖱️', '📱', '🖥️'],
      'Christmas': ['🎄', '🎅', '🎁', '⛄', '❄️', '🔔', '⭐'],
      "New Year's Eve": ['🥳', '🎊', '🍾', '🎆', '✨'],
    };

    const emojis = holidayEmojis[currentHoliday.name] || [currentHoliday.emoji];
    const newElements: FloatingElement[] = [];

    for (let i = 0; i < 8; i++) {
      newElements.push({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 10 + Math.random() * 10,
        size: 20 + Math.random() * 20,
      });
    }

    setElements(newElements);
  }, [currentHoliday]);

  if (!currentHoliday || elements.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute opacity-20 hover:opacity-40 transition-opacity"
          initial={{ y: '100vh', x: `${element.x}%`, rotate: 0 }}
          animate={{
            y: '-10vh',
            x: [`${element.x}%`, `${element.x + 10}%`, `${element.x - 5}%`, `${element.x}%`],
            rotate: [0, 360],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            fontSize: `${element.size}px`,
            left: 0,
          }}
        >
          {element.emoji}
        </motion.div>
      ))}
    </div>
  );
};