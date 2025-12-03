import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import BusinessTransformation from '../components/BusinessTransformation';
import IntelligentCore from '../components/IntelligentCore';
import ReliabilityEngine from '../components/ReliabilityEngine';
import EngagementEngine from '../components/EngagementEngine';
import FutureProofFramework from '../components/FutureProofFramework';
import Features from '../components/Features';
import CRMReplacement from '../components/CRMReplacement';
import Tools from '../components/Tools';
import LiveBusinessDemo from '../components/LiveBusinessDemo';
import PricingSection from '../components/PricingSection';
import SocialProof from '../components/SocialProof';
import FinalCTA from '../components/FinalCTA';
import SocialProofNotifications from '../components/SocialProofNotifications';
import LocalBusinessSchema from '../components/LocalBusinessSchema';
import LocalSEO from '../components/LocalSEO';

const HomePage: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "KenjiAI - AI That Closes Deals While You Sleep | Free AI Tools & Business Automation",
    "description": "AI voice agents that close deals 24/7, smart workflows that run your business, and automation that generates revenue while you sleep. 425% average ROI. Free AI tools available.",
    "url": "https://kenjiai.com",
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "KenjiAI",
      "applicationCategory": "BusinessApplication",
      "offers": [
        {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "description": "Free AI tools available"
        },
        {
          "@type": "Offer",
          "price": "275",
          "priceCurrency": "USD",
          "description": "Complete AI business automation platform"
        }
      ]
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://kenjiai.com"
        }
      ]
    }
  };

  return (
    <>
      <LocalBusinessSchema pageType="home" />
      <LocalSEO
        title="AI Business Automation Platform"
        description="AI voice agents that close deals 24/7, smart workflows that run your business, and automation that generates revenue while you sleep. 425% average ROI."
        additionalKeywords={['AI automation platform', 'voice agents', 'business automation software', 'CRM automation', 'marketing automation']}
        canonical="https://kenjiai.com"
      />
      <Helmet>
        <title>KenjiAI - AI That Closes Deals While You Sleep | Free AI Tools & Revenue-Generating Automation</title>
        <meta name="description" content="AI voice agents that close deals 24/7, smart workflows that run your business, and automation that generates revenue while you sleep. 425% average ROI in 90 days. Free AI tools available: prompt generator, PR tools, sales coach. Start making money with AI today." />
        <meta name="keywords" content="AI that makes money, AI voice agents, revenue generating AI, business automation that pays, AI that closes deals, free AI tools, AI prompt generator, AI sales automation, AI marketing automation, AI that works while you sleep, profitable AI, ROI AI automation, money making AI tools, AI business platform, automated revenue generation" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div>
        <SocialProofNotifications />
        <Hero />
        <BusinessTransformation />
        <IntelligentCore />
        <ReliabilityEngine />
        <EngagementEngine />
        <FutureProofFramework />
        <Features />
        <CRMReplacement />
        <Tools />
        <LiveBusinessDemo />
        <PricingSection />
        <SocialProof />
        <FinalCTA />
      </div>
    </>
  );
};

export default HomePage;