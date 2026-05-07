import React, { useEffect } from 'react';
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

import HomePage from './pages/HomePage';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import AIEducationPage from './pages/AIEducationPage';
import BlogPost from './pages/BlogPost';
import ProductSelectionPage from './pages/ProductSelectionPage';
import SuccessPage from './pages/SuccessPage';
import FreeToolsPage from './pages/FreeToolsPage';
import AIAutomationPage from './pages/AIAutomationPage';
import VoiceAgentsPage from './pages/VoiceAgentsPage';
import VoiceAILandingPage from './pages/VoiceAILandingPage';
import MarketingAutomationPage from './pages/MarketingAutomationPage';
import CRMPage from './pages/CRMPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import DisclaimerPage from './pages/DisclaimerPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import DashboardPage from './pages/DashboardPage';
import WebinarVSLPage from './pages/WebinarVSLPage';
import BlogPage from './pages/BlogPage';
import NicheAdPage from './pages/NicheAdPage';
import AgentSetupPage from './pages/AgentSetupPage';

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
