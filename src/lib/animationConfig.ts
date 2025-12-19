export const animationConfig = {
  durations: {
    instant: 0.1,
    fast: 0.2,
    normal: 0.3,
    medium: 0.5,
    slow: 0.8,
    verySlow: 1.2,
  },

  easing: {
    easeOut: [0.16, 1, 0.3, 1],
    easeIn: [0.7, 0, 0.84, 0],
    easeInOut: [0.65, 0, 0.35, 1],
    spring: { type: 'spring' as const, stiffness: 300, damping: 30 },
    smoothSpring: { type: 'spring' as const, stiffness: 200, damping: 25 },
    bouncy: { type: 'spring' as const, stiffness: 400, damping: 20, bounce: 0.4 },
  },

  hover: {
    scale: 1.05,
    scaleSubtle: 1.02,
    scaleBig: 1.1,
    yOffset: -3,
    yOffsetSubtle: -2,
    yOffsetBig: -5,
    duration: 0.2,
  },

  tap: {
    scale: 0.98,
    scaleBig: 0.95,
    duration: 0.1,
  },

  glow: {
    duration: 2,
    intensityMultiplier: 1.5,
    colors: {
      primary: {
        base: 'rgba(233, 51, 142, 0.5)',
        intense: 'rgba(233, 51, 142, 0.75)',
        secondary: 'rgba(75, 82, 255, 0.4)',
        secondaryIntense: 'rgba(75, 82, 255, 0.6)',
      },
      secondary: {
        base: 'rgba(59, 130, 246, 0.5)',
        intense: 'rgba(59, 130, 246, 0.75)',
        secondary: 'rgba(139, 92, 246, 0.4)',
        secondaryIntense: 'rgba(139, 92, 246, 0.6)',
      },
      premium: {
        base: 'rgba(251, 191, 36, 0.6)',
        intense: 'rgba(251, 191, 36, 0.9)',
        secondary: 'rgba(245, 158, 11, 0.5)',
        secondaryIntense: 'rgba(245, 158, 11, 0.75)',
      },
      success: {
        base: 'rgba(16, 185, 129, 0.5)',
        intense: 'rgba(16, 185, 129, 0.75)',
      },
      blue: {
        base: 'rgba(59, 130, 246, 0.4)',
        intense: 'rgba(59, 130, 246, 0.6)',
      },
    },
  },

  shine: {
    duration: 3,
    delay: 0,
    repeat: Infinity,
  },

  pulse: {
    duration: 2,
    repeat: Infinity,
    easing: 'easeInOut' as const,
  },

  entrance: {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      duration: 0.6,
    },
    slideUp: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      duration: 0.8,
    },
    slideDown: {
      initial: { opacity: 0, y: -30 },
      animate: { opacity: 1, y: 0 },
      duration: 0.8,
    },
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      duration: 0.5,
    },
    scaleRotate: {
      initial: { opacity: 0, scale: 0, rotate: -180 },
      animate: { opacity: 1, scale: 1, rotate: 0 },
      duration: 1,
    },
  },

  stagger: {
    fast: 0.05,
    normal: 0.1,
    slow: 0.15,
  },

  performance: {
    reducedMotion: false,
  },
};

export const generateGlowAnimation = (variant: 'primary' | 'secondary' | 'premium' = 'primary') => {
  const colors = animationConfig.glow.colors[variant];
  return {
    boxShadow: [
      `0 20px 60px ${colors.base}, 0 0 100px ${colors.secondary}, inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.2)`,
      `0 20px 80px ${colors.intense}, 0 0 120px ${colors.secondaryIntense}, inset 0 2px 4px rgba(255, 255, 255, 0.5), inset 0 -2px 4px rgba(0, 0, 0, 0.2)`,
      `0 20px 60px ${colors.base}, 0 0 100px ${colors.secondary}, inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.2)`,
    ],
  };
};

export const generateShineAnimation = () => ({
  animate: {
    x: ['-100%', '200%'],
  },
  transition: {
    duration: animationConfig.shine.duration,
    repeat: animationConfig.shine.repeat,
    ease: 'linear' as const,
  },
});

export const generateHoverAnimation = (subtle = false) => ({
  whileHover: {
    scale: subtle ? animationConfig.hover.scaleSubtle : animationConfig.hover.scale,
    y: subtle ? animationConfig.hover.yOffsetSubtle : animationConfig.hover.yOffset,
  },
  whileTap: {
    scale: animationConfig.tap.scale
  },
  transition: {
    duration: animationConfig.hover.duration,
  },
});

export const generatePulseAnimation = (scaleRange = [1, 1.05, 1]) => ({
  animate: {
    scale: scaleRange,
  },
  transition: {
    duration: animationConfig.pulse.duration,
    repeat: animationConfig.pulse.repeat,
    ease: animationConfig.pulse.easing,
  },
});

if (typeof window !== 'undefined') {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  animationConfig.performance.reducedMotion = prefersReducedMotion.matches;

  prefersReducedMotion.addEventListener('change', (e) => {
    animationConfig.performance.reducedMotion = e.matches;
  });
}
