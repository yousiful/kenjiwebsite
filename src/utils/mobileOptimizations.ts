export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

export const isLowEndDevice = () => {
  if (typeof navigator === 'undefined') return false;
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

  if (connection) {
    const effectiveType = connection.effectiveType;
    return effectiveType === 'slow-2g' || effectiveType === '2g' || effectiveType === '3g';
  }

  const memory = (performance as any).memory;
  if (memory && memory.jsHeapSizeLimit) {
    return memory.jsHeapSizeLimit < 1073741824;
  }

  return false;
};

export const getAnimationConfig = () => {
  const mobile = isMobile();
  const lowEnd = isLowEndDevice();

  if (lowEnd) {
    return {
      enabled: false,
      duration: 0,
      particleCount: 0,
      reduceMotion: true
    };
  }

  if (mobile) {
    return {
      enabled: true,
      duration: 0.3,
      particleCount: 30,
      reduceMotion: false
    };
  }

  return {
    enabled: true,
    duration: 0.6,
    particleCount: 80,
    reduceMotion: false
  };
};

export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
