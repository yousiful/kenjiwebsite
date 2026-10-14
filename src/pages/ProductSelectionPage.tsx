import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageSchema from '../components/PageSchema';
import { service } from '../lib/schema';
import { PricingNew } from '../components/PricingNew';
import { PricingVSL } from '../components/PricingVSL';
import { ReviewsNative } from '../components/ReviewsNative';
import FAQ from '../components/FAQ';

// Prices mirror what PricingNew renders. Update both together.
const PRICING_SCHEMA = [
  service({
    path: '/pricing',
    name: 'KenjiAI Done-For-You Ads Setup, Funnel and Workflows',
    description:
      'Done-for-you paid ads setup, funnel, and workflows on an all-in-one CRM. AI agent call center and closer placement available as add-ons.',
    serviceType: ['Paid Advertising Management', 'Funnel Building', 'Marketing Automation'],
    offers: [
      {
        '@type': 'Offer',
        name: 'Monthly',
        price: '297',
        priceCurrency: 'USD',
        url: 'https://kenjiai.com/pricing',
        availability: 'https://schema.org/InStock',
        description: '10% performance fee on new revenue generated. Cancel anytime.',
        priceSpecification: { '@type': 'UnitPriceSpecification', price: '297', priceCurrency: 'USD', unitCode: 'MON', unitText: 'month' },
      },
      {
        '@type': 'Offer',
        name: 'Annual',
        price: '2998.80',
        priceCurrency: 'USD',
        url: 'https://kenjiai.com/pricing',
        availability: 'https://schema.org/InStock',
        description: '$249.90/mo billed annually at $2,998.80/yr. 5% performance fee on new revenue generated.',
        priceSpecification: { '@type': 'UnitPriceSpecification', price: '2998.80', priceCurrency: 'USD', unitCode: 'ANN', unitText: 'year' },
      },
    ],
  }),
];

const ProductSelectionPage: React.FC = () => {
  return (
    <>
      <PageSchema path="/pricing" name="KenjiAI Pricing" description="KenjiAI pricing: done-for-you paid ads setup, funnel, and workflows. Monthly $297, annual $249.90/mo, lifetime custom. Performance-based fees, cancel anytime." extra={PRICING_SCHEMA} />
      <Helmet>
        <title>KenjiAI Pricing | Done-For-You Ads Setup, Funnels and Workflows</title>
        <meta name="description" content="KenjiAI pricing: done-for-you paid ads setup, funnel, and workflows. Monthly $297, annual $249.90/mo, lifetime custom. Performance-based fees, cancel anytime." />
        <link rel="canonical" href="https://kenjiai.com/pricing" />
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
