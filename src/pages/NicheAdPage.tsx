import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, TrendingUp, Users, Zap, Brain, Star, Rocket } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import ResultsDisclaimer from '../components/ResultsDisclaimer';
import niches from '../data/niches';

const FEATURE_ICONS = [Brain, Zap, TrendingUp];

export default function NicheAdPage() {
  const { niche: slug } = useParams<{ niche: string }>();
  const niche = niches.find(n => n.slug === slug);

  if (!niche) {
    // During prerender (headless Chrome) avoid navigation-driven redirect — it
    // destroys puppeteer's execution context and the route fails to capture.
    // Render an inert 404 placeholder so the page snapshot completes.
    if (typeof navigator !== 'undefined' && /HeadlessChrome|Prerender/i.test(navigator.userAgent)) {
      return <div data-prerender-skip="true" />;
    }
    return <Navigate to="/404" replace />;
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `KenjiAI — ${niche.name} Paid Ads Agency`,
    description: niche.metaDescription,
    provider: {
      '@type': 'Organization',
      name: 'KenjiAI',
      url: 'https://kenjiai.com',
    },
    areaServed: 'US',
    serviceType: [`${niche.name} Paid Advertising`, 'AI Marketing Automation'],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '500',
    },
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <SEOHead
        title={niche.metaTitle}
        description={niche.metaDescription}
        keywords={`${niche.name.toLowerCase()} paid ads agency, ${niche.name.toLowerCase()} digital marketing, AI automation ${niche.name.toLowerCase()}, KenjiAI`}
        canonicalUrl={`https://kenjiai.com/paid-ads-for/${niche.slug}`}
        structuredData={structuredData}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-900 to-purple-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium mb-6"
            >
              <Rocket className="w-4 h-4" />
              {niche.badge}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {niche.headlineTop}
              </span>
              <br />
              <span className="text-white">{niche.headlineBottom}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-400 max-w-3xl mx-auto mb-10"
            >
              {niche.subheadline}
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-10"
            >
              {niche.stats.map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-4"
                >
                  <div className="text-2xl font-bold text-blue-400">{stat.value}</div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.a
                href="/pricing"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                {niche.cta} <ArrowRight className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="/free-tools"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 border border-gray-600 text-gray-300 font-semibold rounded-xl hover:border-blue-400/50 hover:text-white transition-all"
              >
                See Free Tools <ArrowRight className="w-5 h-5" />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Why Most {niche.namePlural} Waste Their Ad Budget
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The same three problems kill ROI for {niche.namePlural.toLowerCase()} running paid ads — and most agencies don't address any of them.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {niche.painPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800/50 border border-red-500/20 rounded-xl p-6 hover:border-red-400/40 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4">
                  <span className="text-red-400 font-bold text-sm">{i + 1}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{point.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{point.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              The KenjiAI Difference for {niche.namePlural}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              You get a senior operator managing your ads AND the AI platform to automate every lead — in one package.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {niche.features.map((feature, i) => {
              const Icon = FEATURE_ICONS[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02, borderColor: 'rgba(96,165,250,0.5)' }}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.bullets.map((bullet, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-12 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, value: '500+', label: 'Clients Served' },
              { icon: TrendingUp, value: '$3.35M+', label: 'Revenue Generated' },
              { icon: Star, value: '36,490+', label: 'Leads Delivered' },
              { icon: Zap, value: '45+', label: 'Accounts Automated' },
            ].map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <Icon className="w-6 h-6 text-blue-400" />
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-sm text-gray-400">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Scale Your {niche.name} Business?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Get a free growth audit. We'll analyze your current ads, identify what's leaking revenue, and show you exactly what KenjiAI would do differently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/pricing"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                {niche.cta} <ArrowRight className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="/ai-automation"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 border border-gray-600 text-gray-300 font-semibold rounded-xl hover:border-blue-400/50 hover:text-white transition-all"
              >
                See the AI Platform <ArrowRight className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <ResultsDisclaimer />
    </div>
  );
}
