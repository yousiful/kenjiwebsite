import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const RAINBOW_CSS = `
  .luxury-rainbow-btn {
    position: relative;
    background: #000;
    border: none;
    color: #fff;
    cursor: pointer;
    font-weight: 900;
    transition: transform 0.2s, box-shadow 0.2s;
    z-index: 0;
  }
  .luxury-rainbow-btn::before,
  .luxury-rainbow-btn::after {
    content: '';
    position: absolute;
    left: -2px;
    top: -2px;
    border-radius: inherit;
    background: linear-gradient(45deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000);
    background-size: 400%;
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    z-index: -1;
    animation: luxury-rainbow 20s linear infinite;
  }
  .luxury-rainbow-btn::after {
    filter: blur(18px);
    opacity: 0.75;
  }
  @keyframes luxury-rainbow {
    0% { background-position: 0 0; }
    50% { background-position: 400% 0; }
    100% { background-position: 0 0; }
  }
`;

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('luxury-rainbow-styles')) return;
  const style = document.createElement('style');
  style.id = 'luxury-rainbow-styles';
  style.textContent = RAINBOW_CSS;
  document.head.appendChild(style);
}

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
  size = 'lg',
  className = '',
}) => {
  useEffect(() => {
    injectStyles();
  }, []);

  const sizes = {
    sm: 'px-5 py-2.5 sm:px-6 sm:py-3 text-sm',
    md: 'px-6 py-3 sm:px-8 sm:py-4 text-base',
    lg: 'px-8 py-4 sm:px-10 sm:py-5 text-base sm:text-lg',
    xl: 'px-10 py-4 sm:px-14 sm:py-6 text-lg sm:text-2xl',
  };

  const sizeClass = sizes[size];

  const isInternalRoute = href && (href.startsWith('/') || href.startsWith('#'));

  const buttonContent = (
    <motion.div
      whileHover={{ scale: 1.05, y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ scale: { duration: 0.2 } }}
      className={`luxury-rainbow-btn group inline-flex items-center justify-center gap-2 sm:gap-3 font-bold rounded-xl sm:rounded-2xl overflow-visible cursor-pointer touch-manipulation min-h-[48px] ${sizeClass} ${className}`}
    >
      <motion.div
        className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.12) 0%, transparent 70%)',
        }}
      />
      <span className="relative z-10 text-white drop-shadow-lg flex items-center gap-3">
        {children}
      </span>
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
