import React, { useEffect } from 'react';
import { logVital } from '../lib/telemetry';

const PerformanceOptimizer: React.FC = () => {
  useEffect(() => {
    const preloadCriticalResources = () => {
      const heroImage = new Image();
      heroImage.src = 'https://assets.cdn.filesafe.space/q5L4ttbBMHNxieXIcTVJ/media/5adccaae-527e-49d4-befc-6410b918c624.gif';

      const domains = [
        'https://app.kenjicrm.com',
        'https://support.kenjiai.com',
        'https://images.pexels.com',
        'https://js.stripe.com',
      ];
      domains.forEach((domain) => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      });
    };

    const optimizeImages = () => {
      document.querySelectorAll('img').forEach((img) => {
        if (!img.loading) img.loading = 'lazy';
        if (!img.decoding) img.decoding = 'async';
      });
    };

    const addPerformanceObservers = () => {
      if (!('PerformanceObserver' in window)) return;

      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
        logVital('LCP', last.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const e = entry as PerformanceEntry & { processingStart: number; startTime: number };
          logVital('FID', e.processingStart - e.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      let clsTotal = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const e = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
          if (!e.hadRecentInput) clsTotal += e.value;
        });
        logVital('CLS', clsTotal);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navEntry) {
        const ttfb = navEntry.responseStart - navEntry.requestStart;
        const fcp = navEntry.loadEventStart - navEntry.fetchStart;
        if (ttfb > 0) logVital('TTFB', ttfb);
        if (fcp > 0) logVital('FCP', fcp);
      }
    };

    const optimizeThirdPartyScripts = () => {
      document.querySelectorAll<HTMLScriptElement>('script[src]').forEach((script) => {
        if (!script.async && !script.defer) script.defer = true;
      });
    };

    const optimizeMemory = () => {
      let resizeTimeout: ReturnType<typeof setTimeout>;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => window.dispatchEvent(new Event('optimizedResize')), 250);
      };
      window.addEventListener('resize', handleResize, { passive: true });
      return () => window.removeEventListener('resize', handleResize);
    };

    preloadCriticalResources();
    optimizeImages();
    addPerformanceObservers();
    optimizeThirdPartyScripts();
    const cleanup = optimizeMemory();
    return cleanup;
  }, []);

  return null;
};

export default PerformanceOptimizer;
