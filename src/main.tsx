import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import { preloadCriticalAssets, preconnectToOrigins } from './utils/preload';

preconnectToOrigins();

const AppWithTracking = () => {
  useEffect(() => {
    preloadCriticalAssets();

    if (typeof window !== 'undefined' && !(window as any).fbq) {
      (window as any).fbq = function() {
        (window as any).fbq.callMethod ?
        (window as any).fbq.callMethod.apply((window as any).fbq, arguments) :
        (window as any).fbq.queue.push(arguments)
      };

      if (!(window as any)._fbq) (window as any)._fbq = (window as any).fbq;
      (window as any).fbq.push = (window as any).fbq;
      (window as any).fbq.loaded = true;
      (window as any).fbq.version = '2.0';
      (window as any).fbq.queue = [];

      (window as any).fbq('track', 'PageView');
    }
  }, []);

  return (
    <StrictMode>
      <HelmetProvider>
        <Helmet defaultTitle="KenjiAI - AI Business Automation Platform">
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="theme-color" content="#3B82F6" />
        </Helmet>
        <App />
      </HelmetProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<AppWithTracking />);