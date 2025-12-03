import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useHoliday } from '../hooks/useHoliday';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  speedX: number;
  speedY: number;
  rotationSpeed: number;
}

export const HolidayThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentHoliday, loading } = useHoliday();
  const [showBanner, setShowBanner] = useState(true);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const animationFrameRef = useRef<number>();
  const confettiRef = useRef<ConfettiPiece[]>([]);

  useEffect(() => {
    if (currentHoliday && showBanner) {
      const dismissed = sessionStorage.getItem(`holiday-banner-${currentHoliday.id}`);
      if (dismissed) {
        setShowBanner(false);
      }
    }
  }, [currentHoliday, showBanner]);

  useEffect(() => {
    if (currentHoliday && currentHoliday.priority >= 10) {
      createConfetti();

      const interval = setInterval(() => {
        createConfetti();
      }, 8000);

      return () => {
        clearInterval(interval);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [currentHoliday]);

  const createConfetti = () => {
    const colors = currentHoliday?.confetti_colors || ['#ff0000', '#00ff00', '#0000ff'];
    const newConfetti: ConfettiPiece[] = [];

    for (let i = 0; i < 15; i++) {
      newConfetti.push({
        id: Math.random(),
        x: Math.random() * window.innerWidth,
        y: -20,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 3,
        speedX: (Math.random() - 0.5) * 2,
        speedY: Math.random() * 2 + 1,
        rotationSpeed: (Math.random() - 0.5) * 10,
      });
    }

    confettiRef.current = [...confettiRef.current, ...newConfetti];
    animateConfetti();
  };

  const animateConfetti = () => {
    confettiRef.current = confettiRef.current
      .map((piece) => ({
        ...piece,
        x: piece.x + piece.speedX,
        y: piece.y + piece.speedY,
        rotation: piece.rotation + piece.rotationSpeed,
        speedY: piece.speedY + 0.1,
      }))
      .filter((piece) => piece.y < window.innerHeight + 20);

    setConfetti([...confettiRef.current]);

    if (confettiRef.current.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animateConfetti);
    }
  };

  const handleDismiss = () => {
    if (currentHoliday) {
      sessionStorage.setItem(`holiday-banner-${currentHoliday.id}`, 'true');
      setShowBanner(false);
    }
  };

  if (loading) {
    return <>{children}</>;
  }

  return (
    <>
      <AnimatePresence>
        {currentHoliday && showBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${currentHoliday.theme_color} 0%, ${currentHoliday.secondary_color} 100%)`,
            }}
          >
            <div className="container mx-auto px-4 py-3 relative z-10">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <motion.span
                    className="text-2xl"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                  >
                    {currentHoliday.emoji}
                  </motion.span>
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm md:text-base">
                      {currentHoliday.banner_message}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                  aria-label="Dismiss banner"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, ${currentHoliday.secondary_color} 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${currentHoliday.theme_color} 0%, transparent 50%)`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {currentHoliday && currentHoliday.priority >= 10 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {confetti.map((piece) => (
            <div
              key={piece.id}
              className="absolute"
              style={{
                left: `${piece.x}px`,
                top: `${piece.y}px`,
                width: `${piece.size}px`,
                height: `${piece.size}px`,
                backgroundColor: piece.color,
                transform: `rotate(${piece.rotation}deg)`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0%',
              }}
            />
          ))}
        </div>
      )}

      {children}
    </>
  );
};