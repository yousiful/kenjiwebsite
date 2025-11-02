import React from 'react';
import PricingSection from '../components/PricingSection';
import SocialProofNotifications from '../components/SocialProofNotifications';

const ProductSelectionPage: React.FC = () => {
  return (
    <>
      {/* SEO Head */}
      <title>Pricing Plans - KenjiAI Complete Business Automation Platform</title>
      <meta name="description" content="Choose your KenjiAI plan: Complete AI business automation with voice agents, CRM, marketing automation, and more. 30-day money-back guarantee, risk-free." />
      <meta name="keywords" content="KenjiAI pricing, AI automation pricing, business automation plans, voice agents pricing, CRM pricing" />

      <div className="pt-16 bg-gray-900 min-h-screen">
        <SocialProofNotifications />
        <PricingSection />
      </div>
    </>
  );
};

export default ProductSelectionPage;