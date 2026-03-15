import React, { useEffect } from 'react';

const RAINBOW_CSS = `
  .rainbow-border {
    position: relative;
    background: #000;
    border: none;
    color: #fff;
    cursor: pointer;
    font-weight: 900;
    transition: all 0.2s;
  }
  .rainbow-border::before,
  .rainbow-border::after {
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
    animation: rainbow-anim 20s linear infinite;
  }
  .rainbow-border::after {
    filter: blur(16px);
    opacity: 0.7;
  }
  @keyframes rainbow-anim {
    0% { background-position: 0 0; }
    50% { background-position: 400% 0; }
    100% { background-position: 0 0; }
  }
`;

function injectRainbowStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('rainbow-border-styles')) return;
  const style = document.createElement('style');
  style.id = 'rainbow-border-styles';
  style.textContent = RAINBOW_CSS;
  document.head.appendChild(style);
}

interface RainbowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const RainbowButton: React.FC<RainbowButtonProps> = ({
  children,
  onClick,
  className = '',
}) => {
  useEffect(() => {
    injectRainbowStyles();
  }, []);

  return (
    <button
      className={`rainbow-border relative flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-white font-black transition-all duration-200 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
