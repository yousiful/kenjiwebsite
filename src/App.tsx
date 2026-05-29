import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RedirectSystem from './components/RedirectSystem';
import PerformanceOptimizer from './components/PerformanceOptimizer';
import ErrorBoundary from './components/ErrorBoundary';
import NotFoundPage from './components/NotFoundPage';
import AutoFormattingProvider from './components/AutoFormattingProvider';
import LinkValidator from './components/LinkValidator';
import { HolidayThemeProvider } from './contexts/HolidayThemeContext';
import { ErrorLogger } from './components/ErrorLogger';
import { BrowserCompatibility } from './components/BrowserCompatibility';
import { OfflineIndicator } from './components/OfflineIndicator';
import QuickContact from './components/QuickContact';
import { BackgroundLines } from './components/ui/animated-svg-background';
import { SocialProofToast } from './components/SocialProofToast';
import { SiteTracker } from './components/SiteTracker';
import { ConsentBanner } from './components/ConsentBanner';

// HomePage stays eager — it is the LCP route.
import HomePage from './pages/HomePage';

// All other routes are code-split. Cuts main bundle ~60% and ships per-route
// chunks that load on navigation. Suspense fallback shows a thin loading bar
// so users never see a blank flash.
const KnowledgeBasePage = lazy(() => import('./pages/KnowledgeBasePage'));
const AIEducationPage = lazy(() => import('./pages/AIEducationPage'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const ProductSelectionPage = lazy(() => import('./pages/ProductSelectionPage'));
const SuccessPage = lazy(() => import('./pages/SuccessPage'));
const FreeToolsPage = lazy(() => import('./pages/FreeToolsPage'));
const AIAutomationPage = lazy(() => import('./pages/AIAutomationPage'));
const VoiceAgentsPage = lazy(() => import('./pages/VoiceAgentsPage'));
const VoiceAILandingPage = lazy(() => import('./pages/VoiceAILandingPage'));
const MarketingAutomationPage = lazy(() => import('./pages/MarketingAutomationPage'));
const CRMPage = lazy(() => import('./pages/CRMPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const WebinarVSLPage = lazy(() => import('./pages/WebinarVSLPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const NicheAdPage = lazy(() => import('./pages/NicheAdPage'));
const AgentSetupPage = lazy(() => import('./pages/AgentSetupPage'));

const RouteFallback: React.FC = () => (
  <div
    aria-label="Loading"
    role="status"
    style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: '3px',
      background: 'linear-gradient(90deg, #3B82F6 0%, #10A37F 50%, #3B82F6 100%)',
      backgroundSize: '200% 100%',
      animation: 'kj-loadbar 1.2s linear infinite',
      zIndex: 9999,
    }}
  />
);

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const VisitorTracker: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const url = `${SUPABASE_URL}/functions/v1/track-visitor`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        page: pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {});
  }, [pathname]);

  return null;
};

const NAVBAR_HIDDEN_ROUTES: string[] = ['/dashboard', '/overview', '/setup'];

function ConditionalNavbar() {
  const { pathname } = useLocation();
  const hideNavbar = NAVBAR_HIDDEN_ROUTES.includes(pathname);

  if (hideNavbar) return null;

  return (
    <header role="banner">
      <Navbar />
    </header>
  );
}

function ConditionalFooter() {
  const { pathname } = useLocation();
  const hideFooter = NAVBAR_HIDDEN_ROUTES.includes(pathname);

  if (hideFooter) return null;

  return (
    <footer role="contentinfo">
      <Footer />
    </footer>
  );
}

function ConditionalWidgets() {
  const { pathname } = useLocation();
  const hideWidgets = NAVBAR_HIDDEN_ROUTES.includes(pathname);

  if (hideWidgets) return null;

  return (
    <>
      <QuickContact />
      <SocialProofToast />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <HolidayThemeProvider>
        <AutoFormattingProvider>
          <Router>
            <ScrollToTop />
            <VisitorTracker />
            <LinkValidator />
            <RedirectSystem />
            <SiteTracker />
            <ConsentBanner />
            <BrowserCompatibility />
            <OfflineIndicator />
            <ErrorLogger />
            <BackgroundLines className="min-h-screen bg-gray-900" svgOptions={{ duration: 12 }}>
              <div id="app-container" className="min-h-screen">
                <PerformanceOptimizer />
                <ConditionalNavbar />
                  <main id="main-content" role="main">
                    <Suspense fallback={<RouteFallback />}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/tools" element={<Navigate to="/free-tools" replace />} />
                      <Route path="/free-tools" element={<FreeToolsPage />} />
                      <Route path="/ai-automation" element={<AIAutomationPage />} />
                      <Route path="/voice-agents" element={<VoiceAgentsPage />} />
                      <Route path="/voice-ai" element={<VoiceAILandingPage />} />
                      <Route path="/marketing-automation" element={<MarketingAutomationPage />} />
                      <Route path="/crm" element={<CRMPage />} />
                      <Route path="/knowledge" element={<KnowledgeBasePage />} />
                      <Route path="/ai-education" element={<AIEducationPage />} />
                      <Route path="/blog" element={<BlogPage />} />
                      <Route path="/blog/:slug" element={<BlogPost />} />
                      <Route path="/paid-ads-for/:niche" element={<NicheAdPage />} />
                      <Route path="/pricing" element={<ProductSelectionPage />} />
                      <Route path="/success" element={<SuccessPage />} />
                      <Route path="/privacy" element={<PrivacyPolicyPage />} />
                      <Route path="/disclaimer" element={<DisclaimerPage />} />
                      <Route path="/terms" element={<TermsOfServicePage />} />
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/overview" element={<WebinarVSLPage />} />
                      <Route path="/setup" element={<AgentSetupPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                    </Suspense>
                  </main>
                <ConditionalFooter />
                <ConditionalWidgets />
              </div>
            </BackgroundLines>
          </Router>
        </AutoFormattingProvider>
      </HolidayThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
