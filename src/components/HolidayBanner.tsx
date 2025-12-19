import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Clock } from 'lucide-react';
import { useHolidayTheme } from '../contexts/HolidayThemeContext';

export function HolidayBanner() {
  const { currentHoliday, isHolidayActive } = useHolidayTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number; size: number }>>([]);
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; delay: number; color: string; rotation: number }>>([]);

  useEffect(() => {
    if (isHolidayActive && currentHoliday) {
      const newParticles = Array.from({ length: 25 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
        size: Math.random() * 3 + 1
      }));
      setParticles(newParticles);

      const colors = currentHoliday.confetti_colors;
      const newConfetti = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360
      }));
      setConfetti(newConfetti);
    }
  }, [isHolidayActive, currentHoliday]);

  if (!isHolidayActive || !currentHoliday || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-16 left-0 right-0 z-40 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${currentHoliday.theme_color}dd, ${currentHoliday.secondary_color}dd)`,
        }}
      >
        {/* Enhanced animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
              }}
              animate={{
                y: [0, -40, 0],
                opacity: [0.2, 1, 0.2],
                scale: [1, 1.8, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Falling confetti */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {confetti.map((piece) => (
            <motion.div
              key={`confetti-${piece.id}`}
              className="absolute w-2 h-3 rounded-sm"
              style={{
                left: `${piece.x}%`,
                top: '-10px',
                backgroundColor: piece.color,
                rotate: piece.rotation
              }}
              animate={{
                y: ['0vh', '110vh'],
                rotate: [piece.rotation, piece.rotation + 720],
                x: [0, Math.sin(piece.id) * 50],
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: piece.delay,
                ease: "linear",
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 py-3 relative">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                className="text-2xl"
              >
                {currentHoliday.emoji}
              </motion.span>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-sm sm:text-base">
                    {currentHoliday.banner_message}
                  </span>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full"
                  >
                    <span className="text-white text-xs font-bold uppercase">
                      {currentHoliday.offer_badge}
                    </span>
                  </motion.div>
                </div>

                <div className="hidden md:flex items-center gap-2 text-white/90 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{currentHoliday.urgency_text}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.a
                href="/pricing"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold text-sm hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">View Offer</span>
                <span className="sm:hidden">Offer</span>
              </motion.a>

              <button
                onClick={() => setIsVisible(false)}
                className="text-white/80 hover:text-white transition-colors p-1"
                aria-label="Close banner"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile urgency text */}
          <div className="md:hidden flex items-center gap-2 text-white/90 text-xs mt-2">
            <Clock className="w-3 h-3" />
            <span>{currentHoliday.urgency_text}</span>
          </div>
        </div>

        {/* Bottom glow effect */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 opacity-50"
          style={{
            background: `linear-gradient(90deg, ${currentHoliday.confetti_colors.join(', ')})`
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
