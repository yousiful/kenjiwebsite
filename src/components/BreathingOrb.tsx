import React from 'react';
import { motion } from 'framer-motion';

interface BreathingOrbProps {
  size?: number;
  color?: string;
  intensity?: number;
  position?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  delay?: number;
}

export const BreathingOrb: React.FC<BreathingOrbProps> = ({
  size = 400,
  color = '#3B82F6',
  intensity = 0.3,
  position = { top: '20%', left: '20%' },
  delay = 0,
}) => {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={{
        width: size,
        height: size,
        ...position,
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [intensity, intensity * 1.5, intensity],
        filter: ['blur(60px)', 'blur(80px)', 'blur(60px)'],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      <div
        className="w-full h-full rounded-full"
        style={{
          background: `radial-gradient(circle, ${color}80 0%, ${color}40 50%, transparent 100%)`,
        }}
      />
    </motion.div>
  );
};

export const FloatingParticle: React.FC<{
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
}> = ({ delay = 0, duration = 4, x = 0, y = 0 }) => {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{
        left: x,
        top: y,
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.2) 100%)',
        boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
      }}
      animate={{
        y: [0, -100, 0],
        x: [0, Math.random() * 50 - 25, 0],
        opacity: [0, 1, 0],
        scale: [0.5, 1, 0.5],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  );
};
