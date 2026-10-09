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
import ResultsDisclaimer from './components/ResultsDisclaimer';

import SEOHead from './components/SEOHead';

// HomePage stays eager — it is the LCP route.
import HomePage from './pages/HomePage';

/**
 * A dynamic import only fails when the browser is holding an index.html from a
 * previous deploy and asks for a chunk hash that no longer exists on the origin.
 * Reload once to pick up the current manifest; the sessionStorage guard stops a
 * genuinely missing chunk from looping.
 */
const lazyRoute = (factory: () => Promise<{ default: React.ComponentType<never> }>) =>
  lazy(() =>
    factory().catch((err) => {
      if (!sessionStorage.getItem('kj-chunk-reloaded')) {
        sessionStorage.setItem('kj-chunk-reloaded', '1');
        window.location.reload();
      }
      throw err;
    })
  );

// All other routes are code-split. Cuts main bundle ~60% and ships per-route
// chunks that load on navigation. Suspense fallback shows a thin loading bar
// so users never see a blank flash.
const KnowledgeBasePage = lazyRoute(() => import('./pages/KnowledgeBasePage'));
const AIEducationPage = lazyRoute(() => import('./pages/AIEducationPage'));
const BlogPost = lazyRoute(() => import('./pages/BlogPost'));
const ProductSelectionPage = lazyRoute(() => import('./pages/ProductSelectionPage'));
const SuccessPage = lazyRoute(() => import('./pages/SuccessPage'));
const FreeToolsPage = lazyRoute(() => import('./pages/FreeToolsPage'));
const AIAutomationPage = lazyRoute(() => import('./pages/AIAutomationPage'));
const VoiceAgentsPage = lazyRoute(() => import('./pages/VoiceAgentsPage'));
const VoiceAILandingPage = lazyRoute(() => import('./pages/VoiceAILandingPage'));
const MarketingAutomationPage = lazyRoute(() => import('./pages/MarketingAutomationPage'));
const CRMPage = lazyRoute(() => import('./pages/CRMPage'));
const PrivacyPolicyPage = lazyRoute(() => import('./pages/PrivacyPolicyPage'));
const DisclaimerPage = lazyRoute(() => import('./pages/DisclaimerPage'));
const TermsOfServicePage = lazyRoute(() => import('./pages/TermsOfServicePage'));
const DashboardPage = lazyRoute(() => import('./pages/DashboardPage'));
const WebinarVSLPage = lazyRoute(() => import('./pages/WebinarVSLPage'));
const WebinarVSLPageB = lazyRoute(() => import('./pages/WebinarVSLPageB'));
const BlogPage = lazyRoute(() => import('./pages/BlogPage'));
const NicheAdPage = lazyRoute(() => import('./pages/NicheAdPage'));
const AgentSetupPage = lazyRoute(() => import('./pages/AgentSetupPage'));
const FundingPage = lazyRoute(() => import('./pages/FundingPage'));
const PricingV2Page = lazyRoute(() => import('./pages/PricingV2Page'));
const HelpfulLinksPage = lazyRoute(() => import('./pages/HelpfulLinksPage'));
const PartnerUpPage = lazyRoute(() => import('./pages/PartnerUpPage'));
const ModernPage = lazyRoute(() => import('./pages/ModernPage'));
const GrowthQuizPage = lazyRoute(() => import('./pages/GrowthQuizPage'));
const GrowthQuizBookPage = lazyRoute(() => import('./pages/GrowthQuizPage').then((m) => ({ default: m.GrowthQuizBookPage })));
const GrowthQuizNextStepPage = lazyRoute(() => import('./pages/GrowthQuizPage').then((m) => ({ default: m.GrowthQuizNextStepPage })));
const WorkshopPage = lazyRoute(() => import('./pages/WorkshopPage'));
const MissedCallCalculatorPage = lazyRoute(() => import('./pages/MissedCallCalculatorPage'));
const SongPromptGeneratorPage = lazyRoute(() => import('./pages/SongPromptGeneratorPage'));
const ICPGeneratorPage = lazyRoute(() => import('./pages/ICPGeneratorPage'));
const ROASCalculatorPage = lazyRoute(() => import('./pages/ROASCalculatorPage'));
const ReviewLinkGeneratorPage = lazyRoute(() => import('./pages/ReviewLinkGeneratorPage'));
const TrendPulsePage = lazyRoute(() => import('./pages/TrendPulsePage'));
const NameGeneratorPage = lazyRoute(() => import('./pages/NameGeneratorPage'));
const BookPage = lazyRoute(() => import('./pages/BookPage'));
const Book2Page = lazyRoute(() => import('./pages/Book2Page'));

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

/**
 * index.html ships a static canonical/description/robots/og/twitter block. Those
 * are the homepage's values and they are the only metadata a non-rendering
 * crawler (every social link-preview scraper, for one) ever sees, so they have to
 * stay in the shell. But react-helmet-async only ever replaces tags it rendered
 * itself (data-rh="true"), so on every React route the static copies survived
 * alongside helmet's route-specific ones: two canonicals and two meta
 * descriptions per page, which means Google picks which canonical to honour
 * instead of us.
 *
 * These are the shell copies. They are removed once helmet's own tags are
 * actually in the DOM — never before, so a page is never left with no metadata
 * at all. Helmet writes inside a requestAnimationFrame, which does not fire while
 * the tab is hidden; in that case helmet writes nothing and this strip correctly
 * does nothing either, leaving the static block as the page's only metadata.
 */
const STATIC_SHELL_HEAD_TAGS = [
  'link[rel="canonical"]:not([data-rh])',
  'meta[name="description"]:not([data-rh])',
  'meta[name="robots"]:not([data-rh])',
  'meta[property^="og:"]:not([data-rh])',
  'meta[property^="twitter:"]:not([data-rh])',
].join(',');

/**
 * Site-wide head defaults, owned by react-helmet-async, plus the shell cleanup
 * above. Helmet dedupes by name/property (and by rel for canonical), so any page
 * that sets its own title/description/canonical/og/robots — via SEOHead or a bare
 * <Helmet> — overrides what is set here and the DOM ends up with exactly one of
 * each. Pages that set nothing fall back to these rather than to nothing, which
 * is what keeps the bare-<Helmet> pages from losing their OpenGraph tags when the
 * static block is stripped.
 */
const DefaultSEO: React.FC = () => {
  const { pathname } = useLocation();
  const canonical = `https://kenjiai.com${pathname === '/' ? '/' : pathname.replace(/\/+$/, '')}`;

  useEffect(() => {
    // SEOHead always emits a canonical, so a helmet-owned one appearing is the
    // signal that helmet has flushed and the shell copies are now redundant.
    // Watching <head> rather than waiting a fixed number of frames means this
    // still fires if helmet's write is delayed, and never fires early.
    const stripShellTags = () => {
      if (!document.querySelector('link[rel="canonical"][data-rh="true"]')) return false;
      document.head.querySelectorAll(STATIC_SHELL_HEAD_TAGS).forEach((el) => el.remove());
      return true;
    };

    if (stripShellTags()) return;

    const observer = new MutationObserver(() => {
      if (stripShellTags()) observer.disconnect();
    });
    observer.observe(document.head, { childList: true });
    return () => observer.disconnect();
  }, []);

  return <SEOHead canonical={canonical} />;
};

const NAVBAR_HIDDEN_ROUTES: string[] = ['/dashboard', '/overview', '/overview-b', '/setup', '/helpful-links', '/partnerup', '/workshop', '/growth-quiz', '/growth-quiz/book', '/growth-quiz/next-step'];

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

  if (hideFooter) {
    return (
      <footer role="contentinfo" className="relative z-20 px-4 pb-12 pt-6">
        <ResultsDisclaimer />
      </footer>
    );
  }

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
    </>
  );
}

const CallCenterUpgradeRedirect: React.FC = () => {
  useEffect(() => {
    window.location.replace('/call-center-upgrade/index.html');
  }, []);
  return null;
};

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
            <DefaultSEO />
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
                      <Route path="/call-center-upgrade" element={<CallCenterUpgradeRedirect />} />
                      <Route path="/tools" element={<Navigate to="/free-tools" replace />} />
                      <Route path="/tools/missed-call-calculator" element={<MissedCallCalculatorPage />} />
                      <Route path="/tools/song-prompt-generator" element={<SongPromptGeneratorPage />} />
                      <Route path="/tools/icp-generator" element={<ICPGeneratorPage />} />
                      <Route path="/tools/roas-calculator" element={<ROASCalculatorPage />} />
                      <Route path="/tools/google-review-link-generator" element={<ReviewLinkGeneratorPage />} />
                      <Route path="/tools/name-generator" element={<NameGeneratorPage />} />
                      <Route path="/tools/business-name-generator" element={<Navigate to="/tools/name-generator" replace />} />
                      <Route path="/trendpulse" element={<TrendPulsePage />} />
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
                      <Route path="/pricing2" element={<PricingV2Page />} />
                      <Route path="/book" element={<BookPage />} />
                      <Route path="/book2" element={<Book2Page />} />
                      <Route path="/success" element={<SuccessPage />} />
                      <Route path="/privacy" element={<PrivacyPolicyPage />} />
                      <Route path="/disclaimer" element={<DisclaimerPage />} />
                      <Route path="/terms" element={<TermsOfServicePage />} />
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/overview" element={<WebinarVSLPage />} />
                      <Route path="/overview-b" element={<WebinarVSLPageB />} />
                      <Route path="/helpful-links" element={<HelpfulLinksPage />} />
                      <Route path="/partnerup" element={<PartnerUpPage />} />
                      <Route path="/modern" element={<ModernPage />} />
                      <Route path="/growth-quiz" element={<GrowthQuizPage />} />
                      <Route path="/growth-quiz/book" element={<GrowthQuizBookPage />} />
                      <Route path="/growth-quiz/next-step" element={<GrowthQuizNextStepPage />} />
                      <Route path="/workshop" element={<WorkshopPage />} />
                      <Route path="/setup" element={<AgentSetupPage />} />
                      <Route path="/funding" element={<FundingPage />} />
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
