import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

const EARLY_CHUNK_KEY = 'kenjiai_early_chunk_reload';
const CHUNK_PATTERN = /Failed to fetch dynamically imported module|Loading chunk \d+ failed|ChunkLoadError/i;

function triggerChunkRecovery() {
  const count = parseInt(sessionStorage.getItem(EARLY_CHUNK_KEY) ?? '0', 10);
  if (count < 2) {
    sessionStorage.setItem(EARLY_CHUNK_KEY, String(count + 1));
    if ('caches' in window) {
      caches.keys().then((names) => names.forEach((n) => caches.delete(n)));
    }
    window.location.reload();
  }
}

window.addEventListener('error', (event) => {
  if (CHUNK_PATTERN.test(event.message ?? '')) triggerChunkRecovery();
});

window.addEventListener('unhandledrejection', (event) => {
  const msg = event.reason instanceof Error ? event.reason.message : String(event.reason ?? '');
  if (CHUNK_PATTERN.test(msg)) triggerChunkRecovery();
});

const AppWithTracking = () => {
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

const root = document.getElementById('root')!;
createRoot(root).render(<AppWithTracking />);
