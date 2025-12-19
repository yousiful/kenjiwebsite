export const preloadCriticalAssets = () => {
  const criticalImages = [
    '/apple-touch-icon.png',
    '/og-image.svg',
  ];

  criticalImages.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

export const prefetchRoute = (route: string) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = route;
  document.head.appendChild(link);
};

export const preconnectToOrigins = () => {
  const origins = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ];

  origins.forEach((origin) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};
