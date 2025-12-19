import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { animationConfig, generateGlowAnimation, generateHoverAnimation } from '../lib/animationConfig';

interface LuxuryButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'premium';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const LuxuryButton: React.FC<LuxuryButtonProps> = ({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'lg',
  className = '',
}) => {
  const isInternalRoute = href && (href.startsWith('/') || href.startsWith('#'));
  const reducedMotion = animationConfig.performance.reducedMotion;

  const buttonContent = (
    <motion.div
      whileHover={{
        scale: reducedMotion ? 1 : animationConfig.hover.scale,
        y: reducedMotion ? 0 : animationConfig.hover.yOffset,
      }}
      whileTap={{
        scale: reducedMotion ? 1 : animationConfig.tap.scale
      }}
      animate={
        reducedMotion
          ? {}
          : {
              boxShadow: generateGlowAnimation(variant).boxShadow,
            }
      }
      transition={{
        boxShadow: {
          duration: animationConfig.glow.duration,
          repeat: Infinity,
          ease: animationConfig.pulse.easing,
        },
        scale: {
          duration: animationConfig.hover.duration,
        },
      }}
      className={`luxury-button-base luxury-button-${variant} luxury-button-${size} luxury-button-glow group ${className}`}
    >
      <div className="luxury-button-shine" />

      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
        }}
      />

      <div className="luxury-button-laminate" />

      <div className="luxury-button-top-shine" />

      <span className="relative z-10 text-white drop-shadow-lg flex items-center gap-3">
        {children}
      </span>

      <div className="luxury-button-hover-glow" />
    </motion.div>
  );

  if (href) {
    if (isInternalRoute) {
      return <Link to={href}>{buttonContent}</Link>;
    }
    return <a href={href} target="_blank" rel="noopener noreferrer">{buttonContent}</a>;
  }

  return <div onClick={onClick}>{buttonContent}</div>;
};
