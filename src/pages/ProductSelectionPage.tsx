import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Megaphone, Bot, Video, Gift, Zap, FileText, Rocket, Target, Sparkles } from 'lucide-react';
import { PricingNew } from '../components/PricingNew';

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

const SHOW_BONUSES = [
  { icon: Target, title: 'Free Live Audit', description: 'Offer a no-cost teardown of the thing your client cares about, done live. The promise of real answers pulls people in.' },
  { icon: Gift, title: 'Show-Up-Only Discount', description: 'A price or offer unlocked only if they attend live and on time. Miss it and the deal is gone.' },
  { icon: FileText, title: 'Swipe File or Template Pack', description: 'Hand over a ready-to-use template or script they would normally pay for. High value, zero delivery cost.' },
  { icon: Zap, title: 'Fast-Action Bonus', description: 'An extra reward for the first few who show up live. Scarcity plus speed gets people in their seat.' },
  { icon: Rocket, title: 'Priority Scheduling', description: 'Show up live and they jump the line for onboarding, delivery, or their next appointment.' },
  { icon: Sparkles, title: 'Leave With a Deliverable', description: 'Promise they walk away with something finished and usable, not just notes. The strongest one.' },
];

const ProductSelectionPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>KenjiAI Pricing | Voice Agents, CRM, and AI Automation Plans</title>
        <meta name="description" content="KenjiAI pricing for business owners replacing 17+ tools. Monthly $375, annual $270/mo, lifetime custom. Performance-based fees, 30-day money-back guarantee." />
        <link rel="canonical" href="https://kenjiai.com/pricing" />
      </Helmet>

      <div className="min-h-screen" style={{ backgroundColor: '#0B0E14' }}>
        <div className="pt-16">



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

          {/* Show-Up Bonus Stack */}
          <section className="py-16 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-5">
                  <Gift className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 text-sm font-bold tracking-wide">Show-Up Bonus</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
                  Show Up Live,<br className="hidden sm:block" /> Walk Away With Both
                </h2>
                <p className="text-lg font-bold text-gray-300 max-w-2xl mx-auto">
                  Book your call, show up live, and complete a free situation analysis of your current marketing. You leave with two things: our swipe file of 20 show-up bonuses you can use on your own clients, plus the 35x playbook. Here is a taste of the bonuses.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SHOW_BONUSES.map((bonus, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="relative bg-gray-900/60 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-7 flex flex-col"
                    style={{ boxShadow: '0 0 28px rgba(16,185,129,0.12)' }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mb-4">
                      <bonus.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-black text-white mb-2 leading-tight">{bonus.title}</h3>
                    <p className="text-gray-400 font-medium text-sm leading-relaxed">{bonus.description}</p>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-10">
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <a
                    href="/20-show-up-bonuses.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-gray-900"
                    style={{ background: 'linear-gradient(90deg, #34d399, #60a5fa)', boxShadow: '0 0 22px rgba(52,211,153,0.35)' }}
                  >
                    <Gift className="w-5 h-5" />
                    Preview the 20 Bonuses
                  </a>
                  <a
                    href="/the-35x-playbook.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-white border border-emerald-400/40"
                    style={{ background: 'rgba(16,185,129,0.10)' }}
                  >
                    <FileText className="w-5 h-5 text-emerald-400" />
                    Plus: The 35x Playbook
                  </a>
                </div>
                <p className="text-gray-500 text-sm mt-3">Both are yours when you show up live and complete your marketing situation analysis.</p>
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
