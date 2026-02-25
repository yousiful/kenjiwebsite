import { useEffect } from 'react';
import { logError } from '../lib/telemetry';

const CHUNK_ERROR_PATTERN = /Failed to fetch dynamically imported module|Loading chunk \d+ failed|ChunkLoadError/i;
const CHUNK_RELOAD_KEY = 'kenjiai_chunk_reload';

function handleChunkLoadError(message: string) {
  const count = parseInt(sessionStorage.getItem(CHUNK_RELOAD_KEY) ?? '0', 10);
  if (count < 2) {
    sessionStorage.setItem(CHUNK_RELOAD_KEY, String(count + 1));
    if ('caches' in window) {
      caches.keys().then((names) => names.forEach((n) => caches.delete(n)));
    }
    window.location.reload();
  }
}

export function ErrorLogger() {
  useEffect(() => {
    sessionStorage.removeItem(CHUNK_RELOAD_KEY);

    const handleError = (event: ErrorEvent) => {
      const message = event.message ?? '';

      if (CHUNK_ERROR_PATTERN.test(message)) {
        handleChunkLoadError(message);
        logError({
          error_type: 'chunk_load',
          message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack,
        });
        return;
      }

      logError({
        error_type: 'runtime',
        message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      });

      event.preventDefault();
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message = reason instanceof Error ? reason.message : String(reason ?? '');

      if (CHUNK_ERROR_PATTERN.test(message)) {
        handleChunkLoadError(message);
        logError({ error_type: 'chunk_load', message, stack: reason?.stack });
        return;
      }

      logError({
        error_type: 'promise_rejection',
        message,
        stack: reason?.stack,
      });

      event.preventDefault();
    };

    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target && (target.tagName === 'IMG' || target.tagName === 'SCRIPT' || target.tagName === 'LINK')) {
        const src = target.getAttribute('src') || target.getAttribute('href') || '';
        logError({
          error_type: 'resource',
          message: `Failed to load ${target.tagName.toLowerCase()}: ${src}`,
          filename: src,
        });
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleResourceError, true);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleResourceError, true);
    };
  }, []);

  return null;
}
