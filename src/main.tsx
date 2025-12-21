import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

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

createRoot(document.getElementById('root')!).render(<AppWithTracking />);