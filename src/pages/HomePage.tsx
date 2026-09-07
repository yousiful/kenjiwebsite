import React from 'react';
import SEOHead from '../components/SEOHead';
import Hero from '../components/Hero';
import BusinessTransformation from '../components/BusinessTransformation';
import Features from '../components/Features';
import Tools from '../components/Tools';
import SocialProof from '../components/SocialProof';
import FinalCTA from '../components/FinalCTA';
import { ScrollControls } from '../components/ScrollControls';
import { ResultsDisclaimer } from '../components/ResultsDisclaimer';
import { TrustBadges } from '../components/TrustBadges';
import { MoneyBackGuarantee } from '../components/MoneyBackGuarantee';
import FAQ from '../components/FAQ';
import QuickContact from '../components/QuickContact';

const HomePage: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "KenjiAI - AI Voice Agents, CRM & Business Automation | Free AI Tools",
    "description": "AI voice agents, CRM, funnels, and workflow automation that run your business around the clock. Free AI tools available.",
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
          "price": "375",
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
      <SEOHead 
        title="AI Voice Agents, CRM & Business Automation | KenjiAI"
        description="AI voice agents, CRM, funnels, and workflow automation, built and managed for your business. Free AI tools available: prompt generator, PR tools, sales coach."
        keywords="AI voice agents, business automation, AI automation platform, free AI tools, AI prompt generator, AI sales automation, AI marketing automation, AI business platform, CRM automation, funnel automation"
        structuredData={structuredData}
      />
      
      <div className="pt-0">
        <Hero />
        <TrustBadges />
        <BusinessTransformation />
        <Features />
        <Tools />
        <SocialProof />
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <MoneyBackGuarantee />
        </div>
        <FAQ />
        <div className="py-4 px-4 sm:px-6 lg:px-8">
          <ResultsDisclaimer />
        </div>
        <FinalCTA />
        <QuickContact />
        <ScrollControls />
      </div>
    </>
  );
};

export default HomePage;