import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import InteractiveMouseCaption from './components/InteractiveMouseCaption';
import GamificationSystem from './components/GamificationSystem';
import GamifiedInteractions from './components/GamifiedInteractions';
import ScrollProgressBar from './components/ScrollProgressBar';
import RedirectSystem from './components/RedirectSystem';
import EnhancedInteractiveElements from './components/EnhancedInteractiveElements';
import PerformanceOptimizer from './components/PerformanceOptimizer';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import NotFoundPage from './components/NotFoundPage';
import AutoFormattingProvider from './components/AutoFormattingProvider';
import LinkValidator from './components/LinkValidator';
import { HolidayThemeProvider } from './contexts/HolidayThemeContext';
import { LiveNotification } from './components/LiveNotification';
import { HolidayFloatingElements } from './components/HolidayFloatingElements';
import { HolidaySnowfall } from './components/HolidaySnowfall';
import { HolidaySparkles } from './components/HolidaySparkles';
import { ChatButton } from './components/ChatButton';
import { ScrollTriggeredProof } from './components/ScrollTriggeredProof';
import { ErrorLogger } from './components/ErrorLogger';

// Lazy load pages for better performance
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

// ScrollToTop component to scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <ErrorBoundary>
      <HolidayThemeProvider>
        <AutoFormattingProvider>
          <Router>
            <ScrollToTop />
            <LinkValidator />
            <RedirectSystem />
            <LiveNotification />
            <ErrorLogger />
            <InteractiveMouseCaption>
              <div className="min-h-screen bg-gray-900" id="app-container">
                <PerformanceOptimizer />
                <ScrollProgressBar />
                <GamificationSystem />
                <GamifiedInteractions />
                <EnhancedInteractiveElements />
                <ScrollTriggeredProof />
                <ChatButton />
                <HolidayFloatingElements />
                <HolidaySnowfall />
                <HolidaySparkles />
                <header role="banner">
                  <Navbar />
                </header>
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

                    {/* Legal Pages */}
                    <Route path="/privacy" element={<PrivacyPolicyPage />} />
                    <Route path="/disclaimer" element={<DisclaimerPage />} />
                    <Route path="/terms" element={<TermsOfServicePage />} />

                    {/* Redirect legacy routes */}
                    <Route path="/blog" element={<Navigate to="/knowledge" replace />} />

                    {/* Catch all route for 404s */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
              </Suspense>
              <footer role="contentinfo">
                <Footer />
              </footer>
            </div>
          </InteractiveMouseCaption>
        </Router>
      </AutoFormattingProvider>
      </HolidayThemeProvider>
    </ErrorBoundary>
  );
}

export default App;