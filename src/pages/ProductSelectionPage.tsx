import React from 'react';
import ProductSelection from '../components/ProductSelection';

const ProductSelectionPage: React.FC = () => {
  return (
    <>
      {/* SEO Head */}
      <title>Pricing Plans - KenjiAI Complete Business Automation Platform</title>
      <meta name="description" content="Choose your KenjiAI plan: Complete AI business automation with voice agents, CRM, marketing automation, and more. 16-day free trial, no credit card required." />
      <meta name="keywords" content="KenjiAI pricing, AI automation pricing, business automation plans, voice agents pricing, CRM pricing" />
      
      <div className="pt-16 bg-gray-900 min-h-screen">
        <ProductSelection />
      </div>
    </>
  );
};

export default ProductSelectionPage;