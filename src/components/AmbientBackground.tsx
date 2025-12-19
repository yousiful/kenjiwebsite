import React from 'react';
import { motion } from 'framer-motion';
import { BreathingOrb, FloatingParticle } from './BreathingOrb';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <BreathingOrb
        size={500}
        color="#E9338E"
        intensity={0.2}
        position={{ top: '10%', left: '15%' }}
        delay={0}
      />

      <BreathingOrb
        size={600}
        color="#4B52FF"
        intensity={0.25}
        position={{ top: '50%', right: '10%' }}
        delay={1}
      />

      <BreathingOrb
        size={450}
        color="#10B981"
        intensity={0.2}
        position={{ bottom: '15%', left: '25%' }}
        delay={2}
      />

      <BreathingOrb
        size={400}
        color="#8B5CF6"
        intensity={0.15}
        position={{ top: '60%', left: '60%' }}
        delay={1.5}
      />

      <BreathingOrb
        size={350}
        color="#FBBF24"
        intensity={0.18}
        position={{ bottom: '25%', right: '20%' }}
        delay={2.5}
      />

      {[...Array(30)].map((_, i) => (
        <FloatingParticle
          key={i}
          delay={i * 0.3}
          duration={4 + Math.random() * 3}
          x={Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200)}
          y={Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)}
        />
      ))}

      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};
