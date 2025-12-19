import React from 'react';
import { PricingNew } from '../components/PricingNew';

const ProductSelectionPage: React.FC = () => {
  return (
    <>
      {/* SEO Head */}
      <title>Pricing Plans - KenjiAI Complete Business Automation Platform</title>
      <meta name="description" content="Choose your KenjiAI plan: Complete AI business automation with voice agents, CRM, marketing automation, and more. Performance-based pricing." />
      <meta name="keywords" content="KenjiAI pricing, AI automation pricing, business automation plans, voice agents pricing, CRM pricing" />

      <div className="pt-16 min-h-screen" style={{backgroundColor: '#0B0E14'}}>
        <PricingNew />
      </div>
    </>
  );
};

export default ProductSelectionPage;