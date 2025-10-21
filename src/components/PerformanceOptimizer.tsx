import React, { useEffect } from 'react';

const PerformanceOptimizer: React.FC = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Only preload hero image on desktop
      if (window.innerWidth > 768) {
        const heroImage = new Image();
        heroImage.src = 'https://assets.cdn.filesafe.space/q5L4ttbBMHNxieXIcTVJ/media/5adccaae-527e-49d4-befc-6410b918c624.gif';
      }

      // Preload Stripe
      const stripeScript = document.createElement('link');
      stripeScript.rel = 'dns-prefetch';
      stripeScript.href = 'https://js.stripe.com';
      document.head.appendChild(stripeScript);

      // Preload external domains
      const domains = [
        'https://app.kenjicrm.com',
        'https://js.stripe.com'
      ];

      domains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      });
    };

    // Optimize images
    const optimizeImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (!img.loading) {
          img.loading = 'lazy';
        }
        if (!img.decoding) {
          img.decoding = 'async';
        }
      });
    };

    // Add performance observers - Only in development
    const addPerformanceObservers = () => {
      if ('PerformanceObserver' in window && process.env.NODE_ENV === 'development') {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          // Observer not supported
        }
      }
    };

    // Optimize third-party scripts
    const optimizeThirdPartyScripts = () => {
      // Defer non-critical scripts
      const scripts = document.querySelectorAll('script[src]');
      scripts.forEach(script => {
        if (!script.async && !script.defer) {
          script.defer = true;
        }
      });
    };

    // Service Worker registration for caching
    const registerServiceWorker = () => {
      if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered:', registration);
          })
          .catch(error => {
            console.log('SW registration failed:', error);
          });
      }
    };

    // Memory management
    const optimizeMemory = () => {
      // Clean up unused event listeners
      const cleanupEventListeners = () => {
        const elements = document.querySelectorAll('[data-cleanup]');
        elements.forEach(element => {
          element.removeAttribute('data-cleanup');
        });
      };

      // Throttle resize events
      let resizeTimeout: NodeJS.Timeout;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          window.dispatchEvent(new Event('optimizedResize'));
        }, 250);
      };

      window.addEventListener('resize', handleResize, { passive: true });
      
      return () => {
        window.removeEventListener('resize', handleResize);
        cleanupEventListeners();
      };
    };

    // Initialize optimizations
    preloadCriticalResources();
    optimizeImages();
    addPerformanceObservers();
    optimizeThirdPartyScripts();
    registerServiceWorker();
    const memoryCleanup = optimizeMemory();

    // Cleanup on unmount
    return () => {
      memoryCleanup();
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceOptimizer;