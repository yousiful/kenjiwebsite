import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

// Enhanced particle colors for more vibrant fireworks
const particleColors = [
  'from-blue-400 to-cyan-400',
  'from-green-400 to-emerald-400',
  'from-purple-400 to-pink-400',
  'from-yellow-400 to-orange-400',
  'from-pink-400 to-rose-400',
  'from-indigo-400 to-purple-400',
  'from-red-400 to-orange-400',
  'from-teal-400 to-cyan-400'
];

interface ParticleEffect {
  id: string;
  x: number;
  y: number;
  type: 'click' | 'hover' | 'scroll';
  color: string;
}

const GamifiedInteractions: React.FC = () => {
  const [particles, setParticles] = React.useState<ParticleEffect[]>([]);

  const createParticle = (x: number, y: number, type: ParticleEffect['type']) => {
    const id = Math.random().toString(36).substr(2, 9);
    
    // Use the enhanced color palette for all particle types
    const selectedColor = particleColors[Math.floor(Math.random() * particleColors.length)];
    
    const newParticle: ParticleEffect = { id, x, y, type, color: selectedColor };
    
    setParticles(prev => [...prev, newParticle]);
    
    // Remove particle after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== id));
    }, 800);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Create fireworks for ANY click on the website
      createFireworks(e.clientX, e.clientY);
    };
    
    // Create a colorful firework effect
    const createFireworks = (x: number, y: number) => {
      // Create multiple particles in a circular pattern
      const particleCount = 12 + Math.floor(Math.random() * 8); // 12-20 particles
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 20 + Math.random() * 30;
        const offsetX = Math.cos(angle) * distance;
        const offsetY = Math.sin(angle) * distance;
        
        setTimeout(() => {
          createParticle(
            x + offsetX,
            y + offsetY,
            'click'
          );
        }, i * 20);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hasCaption = target.getAttribute('data-caption') || target.closest('[data-caption]');
      
      if (hasCaption && Math.random() > 0.8) { // 20% chance for hover particles
        createParticle(e.clientX, e.clientY, 'hover');
      }
    };

    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (Math.random() > 0.9) { // 10% chance for scroll particles
          const x = Math.random() * window.innerWidth;
          const y = window.innerHeight / 2;
          createParticle(x, y, 'scroll');
        }
      }, 100);
    };

    // Touch events for mobile
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('button, a, [role="button"], [data-caption]');
      
      if (isInteractive && e.touches.length === 1) {
        const touch = e.touches[0];
        // Create burst effect for touch
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            createParticle(
              touch.clientX + (Math.random() - 0.5) * 40,
              touch.clientY + (Math.random() - 0.5) * 40,
              'click'
            );
          }, i * 30);
        }
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getParticleConfig = (type: ParticleEffect['type']) => {
    switch (type) {
      case 'click':
        return {
          size: 'w-3 h-3',
          count: 1,
          duration: 1.2
        };
      case 'hover':
        return {
          size: 'w-1.5 h-1.5',
          count: 1,
          duration: 0.6
        };
      case 'scroll':
        return {
          size: 'w-1 h-1',
          count: 1,
          duration: 0.7
        };
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {particles.map(particle => {
        const config = getParticleConfig(particle.type);
        
        return (
          <div key={particle.id}>
            {Array.from({ length: config.count }).map((_, i) => (
              <motion.div
                key={`${particle.id}-${i}`}
                className={`absolute ${config.size} bg-gradient-to-r ${particle.color} rounded-full`}
                initial={{
                  x: particle.x,
                  y: particle.y,
                  scale: 0.2,
                  opacity: 1
                }}
                animate={{
                  x: particle.x + (Math.random() - 0.5) * 120,
                  y: particle.y - Math.random() * 120 - 60,
                  scale: [0.2, 1.8, 0],
                  opacity: [1, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: config.duration,
                  delay: i * 0.05,
                  ease: "easeInOut"
                }}
                style={{
                  filter: 'drop-shadow(0 0 12px currentColor) brightness(1.2)',
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default GamifiedInteractions;