import React from 'react';
import { Helmet } from 'react-helmet-async';
import { PricingNew } from '../components/PricingNew';
import { PricingVSL } from '../components/PricingVSL';
import { ReviewsNative } from '../components/ReviewsNative';
import FAQ from '../components/FAQ';

const PRICING_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "KenjiAI",
  "description": "Done-for-you paid ads setup, funnel, and workflows on an all-in-one CRM. AI agent call center and closer placement available as add-ons.",
  "brand": {
    "@type": "Brand",
    "name": "KenjiAI",
  },
  "offers": [
    {
      "@type": "Offer",
      "name": "Monthly",
      "price": "297",
      "priceCurrency": "USD",
      "url": "https://kenjiai.com/pricing",
      "priceValidUntil": "2027-08-01",
      "availability": "https://schema.org/InStock",
      "description": "10% performance fee on new revenue generated. Cancel anytime.",
    },
    {
      "@type": "Offer",
      "name": "Annual",
      "price": "249.90",
      "priceCurrency": "USD",
      "url": "https://kenjiai.com/pricing",
      "priceValidUntil": "2027-08-01",
      "availability": "https://schema.org/InStock",
      "description": "5% performance fee on new revenue generated, billed annually at $2,998.80/yr.",
    },
  ],
};

const ProductSelectionPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>KenjiAI Pricing | Done-For-You Ads Setup, Funnels and Workflows</title>
        <meta name="description" content="KenjiAI pricing: done-for-you paid ads setup, funnel, and workflows. Monthly $297, annual $249.90/mo, lifetime custom. Performance-based fees, cancel anytime." />
        <link rel="canonical" href="https://kenjiai.com/pricing" />
        <script type="application/ld+json">{JSON.stringify(PRICING_STRUCTURED_DATA)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ backgroundColor: '#0B0E14' }}>
        <div className="pt-16">
          <PricingVSL />
          <PricingNew />
          <ReviewsNative />
          <FAQ />
        </div>
      </div>
    </>
  );
};

export default ProductSelectionPage;
