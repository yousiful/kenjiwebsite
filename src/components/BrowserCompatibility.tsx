import { useEffect } from 'react';
import { getBrowserInfo } from '../utils/languageDetection';

export function BrowserCompatibility() {
  useEffect(() => {
    const browserInfo = getBrowserInfo();

    if (browserInfo.isSocialMedia) {
      document.body.classList.add('social-media-browser');

      const style = document.createElement('style');
      style.textContent = `
        .social-media-browser {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-y: none;
        }
        .social-media-browser * {
          -webkit-tap-highlight-color: transparent;
        }
        .social-media-browser a {
          -webkit-touch-callout: none;
        }
      `;
      document.head.appendChild(style);
    }

    if (browserInfo.isIOS) {
      document.body.classList.add('ios-browser');

      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';

      const existing = document.querySelector('meta[name="viewport"]');
      if (existing) {
        existing.remove();
      }
      document.head.appendChild(meta);
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        try {
          sessionStorage.setItem('lastVisit', Date.now().toString());
        } catch (e) {
          console.warn('Could not save last visit time');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const handleOnline = () => {
      document.body.classList.remove('offline');
    };

    const handleOffline = () => {
      document.body.classList.add('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (!navigator.onLine) {
      handleOffline();
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return null;
}
