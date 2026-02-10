import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { Link } from 'react-router-dom';

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
  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #E9338E 0%, #4B52FF 50%, #10B981 100%)',
      shadow: '0 20px 60px rgba(233, 51, 142, 0.5), 0 0 100px rgba(75, 82, 255, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.2)',
      border: 'rgba(255, 255, 255, 0.3)',
    },
    secondary: {
      background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #10B981 100%)',
      shadow: '0 20px 60px rgba(59, 130, 246, 0.5), 0 0 100px rgba(139, 92, 246, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.2)',
      border: 'rgba(255, 255, 255, 0.3)',
    },
    premium: {
      background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #D97706 100%)',
      shadow: '0 20px 60px rgba(251, 191, 36, 0.6), 0 0 100px rgba(245, 158, 11, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.5), inset 0 -2px 4px rgba(0, 0, 0, 0.2)',
      border: 'rgba(255, 255, 255, 0.4)',
    },
  };

  const sizes = {
    sm: 'px-5 py-2.5 sm:px-6 sm:py-3 text-sm',
    md: 'px-6 py-3 sm:px-8 sm:py-4 text-base',
    lg: 'px-8 py-4 sm:px-10 sm:py-5 text-base sm:text-lg',
    xl: 'px-10 py-4 sm:px-14 sm:py-6 text-lg sm:text-2xl',
  };

  const style = variants[variant];
  const sizeClass = sizes[size];

  const isInternalRoute = href && (href.startsWith('/') || href.startsWith('#'));

  const buttonContent = (
    <motion.div
      whileHover={{
        scale: 1.05,
        y: -3,
      }}
      whileTap={{ scale: 0.98 }}
      animate={{
        boxShadow: [
          style.shadow,
          style.shadow.replace('0.5', '0.7').replace('0.4', '0.6'),
          style.shadow,
        ],
      }}
      transition={{
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
        scale: {
          duration: 0.2,
        },
      }}
      className={`group relative inline-flex items-center justify-center gap-2 sm:gap-3 font-bold rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer touch-manipulation min-h-[48px] ${sizeClass} ${className}`}
      style={{
        background: style.background,
        boxShadow: style.shadow,
        border: `2px solid ${style.border}`,
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 50%, rgba(255, 255, 255, 0.15) 100%)',
          backdropFilter: 'blur(10px)',
        }}
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
        }}
      />

      <div className="absolute inset-0 rounded-2xl" style={{
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(0, 0, 0, 0.1) 100%)',
      }} />

      <motion.div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent)',
          borderRadius: '16px 16px 0 0',
        }}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <span className="relative z-10 text-white drop-shadow-lg flex items-center gap-3">
        {children}
      </span>

      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.15), transparent 60%)',
        }}
        transition={{ duration: 0.3 }}
      />
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
