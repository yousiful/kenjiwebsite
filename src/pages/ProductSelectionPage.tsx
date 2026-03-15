import React from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Bot, Video } from 'lucide-react';
import { PricingNew } from '../components/PricingNew';
import { LimitedTimeBonusBanner } from '../components/LimitedTimeBonusBanner';
import { ObjectionsHandler } from '../components/ObjectionsHandler';

const BENEFITS = [
  {
    icon: Megaphone,
    title: 'Done-For-You Ads',
    description: 'We build, launch, and manage your ad campaigns. Leads go straight into your CRM.',
    color: 'from-blue-500 to-cyan-500',
    border: 'border-blue-500/30',
    glow: 'rgba(59,130,246,0.15)',
  },
  {
    icon: Bot,
    title: 'Done-For-You AI Workflows & Funnels',
    description: 'Custom AI automations and high-converting funnels built for your business, ready from day one.',
    color: 'from-emerald-500 to-green-500',
    border: 'border-emerald-500/30',
    glow: 'rgba(16,185,129,0.15)',
  },
  {
    icon: Video,
    title: 'Done-For-You Zoom Support',
    description: 'Live strategy calls and hands-on support from our team whenever you need it.',
    color: 'from-amber-500 to-orange-500',
    border: 'border-amber-500/30',
    glow: 'rgba(245,158,11,0.15)',
  },
];

const ProductSelectionPage: React.FC = () => {
  return (
    <>
      <title>Pricing Plans - KenjiAI Complete Business Automation Platform</title>
      <meta name="description" content="Choose your KenjiAI plan: Complete AI business automation with voice agents, CRM, marketing automation, and more. Performance-based pricing." />
      <meta name="keywords" content="KenjiAI pricing, AI automation pricing, business automation plans, voice agents pricing, CRM pricing" />

      <div className="min-h-screen" style={{ backgroundColor: '#0B0E14' }}>
        <div className="pt-16">

          <LimitedTimeBonusBanner />

          {/* Core Benefits */}
          <section className="py-16 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
                  We Do the Heavy Lifting
                </h2>
                <p className="text-xl font-bold text-gray-300 max-w-2xl mx-auto">
                  Every plan includes three pillars that drive real revenue.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {BENEFITS.map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className={`relative bg-gray-900/60 backdrop-blur-sm border ${benefit.border} rounded-2xl p-8 flex flex-col items-center text-center`}
                    style={{ boxShadow: `0 0 32px ${benefit.glow}` }}
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-5`}>
                      <benefit.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-black text-white mb-3 leading-tight">{benefit.title}</h3>
                    <p className="text-gray-300 font-semibold text-base leading-relaxed">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <PricingNew />
          <ObjectionsHandler />

        </div>
      </div>
    </>
  );
};

export default ProductSelectionPage;
