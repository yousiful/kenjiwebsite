import { useEffect } from 'react';

export function ErrorLogger() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Runtime Error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });

      event.preventDefault();
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled Promise Rejection:', {
        reason: event.reason,
        promise: event.promise
      });

      event.preventDefault();
    };

    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target && (target.tagName === 'IMG' || target.tagName === 'SCRIPT' || target.tagName === 'LINK')) {
        console.warn('Resource failed to load:', {
          tagName: target.tagName,
          src: target.getAttribute('src') || target.getAttribute('href')
        });
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleResourceError, true);

    const checkBrowser = () => {
      const isSupported =
        'Promise' in window &&
        'fetch' in window &&
        'Map' in window &&
        'Set' in window;

      if (!isSupported) {
        console.warn('Browser may not be fully supported. Some features might not work.');
      }
    };

    checkBrowser();

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleResourceError, true);
    };
  }, []);

  return null;
}
