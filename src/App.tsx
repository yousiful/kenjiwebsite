import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollProgressBar from './components/ScrollProgressBar';
import RedirectSystem from './components/RedirectSystem';
import PerformanceOptimizer from './components/PerformanceOptimizer';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import NotFoundPage from './components/NotFoundPage';
import AutoFormattingProvider from './components/AutoFormattingProvider';
import LinkValidator from './components/LinkValidator';
import { HolidayThemeProvider } from './contexts/HolidayThemeContext';
import { ErrorLogger } from './components/ErrorLogger';
import { BrowserCompatibility } from './components/BrowserCompatibility';
import { OfflineIndicator } from './components/OfflineIndicator';
import QuickContact from './components/QuickContact';

const HomePage = lazy(() => import('./pages/HomePage'));
const ToolsPage = lazy(() => import('./pages/ToolsPage'));
const KnowledgeBasePage = lazy(() => import('./pages/KnowledgeBasePage'));
const AIEducationPage = lazy(() => import('./pages/AIEducationPage'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const InvestorPage = lazy(() => import('./pages/InvestorPage'));
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

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const NAVBAR_HIDDEN_ROUTES = ['/pricing'];

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

function App() {
  return (
    <ErrorBoundary>
      <HolidayThemeProvider>
        <AutoFormattingProvider>
          <Router>
            <ScrollToTop />
            <LinkValidator />
            <RedirectSystem />
            <BrowserCompatibility />
            <OfflineIndicator />
            <ErrorLogger />
            <div className="min-h-screen bg-gray-900" id="app-container">
              <PerformanceOptimizer />
              <ScrollProgressBar />
              <ConditionalNavbar />
              <Suspense fallback={<LoadingSpinner />}>
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
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/investors" element={<InvestorPage />} />
                    <Route path="/pricing" element={<ProductSelectionPage />} />
                    <Route path="/success" element={<SuccessPage />} />
                    <Route path="/privacy" element={<PrivacyPolicyPage />} />
                    <Route path="/disclaimer" element={<DisclaimerPage />} />
                    <Route path="/terms" element={<TermsOfServicePage />} />
                    <Route path="/blog" element={<Navigate to="/knowledge" replace />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
              </Suspense>
              <footer role="contentinfo">
                <Footer />
              </footer>
              <QuickContact />
            </div>
          </Router>
        </AutoFormattingProvider>
      </HolidayThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
