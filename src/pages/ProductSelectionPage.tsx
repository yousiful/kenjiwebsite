import React from 'react';
import { PricingNew } from '../components/PricingNew';
import { LimitedTimeBonusBanner } from '../components/LimitedTimeBonusBanner';
import { ROICalculator } from '../components/ROICalculator';
import { VideoShowcase } from '../components/VideoShowcase';
import { CustomerLogoWall } from '../components/CustomerLogoWall';
import { FeatureComparisonTable } from '../components/FeatureComparisonTable';
import { ObjectionsHandler } from '../components/ObjectionsHandler';

const ProductSelectionPage: React.FC = () => {
  return (
    <>
      <title>Pricing Plans - KenjiAI Complete Business Automation Platform</title>
      <meta name="description" content="Choose your KenjiAI plan: Complete AI business automation with voice agents, CRM, marketing automation, and more. Performance-based pricing." />
      <meta name="keywords" content="KenjiAI pricing, AI automation pricing, business automation plans, voice agents pricing, CRM pricing" />

      <div className="min-h-screen" style={{backgroundColor: '#0B0E14'}}>
        <div className="pt-16">
          <LimitedTimeBonusBanner />
          <PricingNew />
          <ROICalculator />
          <VideoShowcase />
          <CustomerLogoWall />
          <FeatureComparisonTable />
          <ObjectionsHandler />
        </div>
      </div>
    </>
  );
};

export default ProductSelectionPage;