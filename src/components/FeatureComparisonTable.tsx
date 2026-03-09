import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Zap } from 'lucide-react';

interface Feature {
  name: string;
  category: string;
  monthly: boolean | string;
  annual: boolean | string;
  lifetime: boolean | string;
  tooltip?: string;
}

const FEATURES: Feature[] = [
  // AI & Automation
  { name: 'AI Voice Agents', category: 'AI & Automation', monthly: true, annual: true, lifetime: true, tooltip: 'Unlimited AI voice agents that answer calls 24/7' },
  { name: 'Smart Workflows', category: 'AI & Automation', monthly: true, annual: true, lifetime: true, tooltip: 'Create custom automation workflows' },
  { name: 'Advanced AI Training', category: 'AI & Automation', monthly: true, annual: true, lifetime: true },
  { name: 'AI Blog Writer & SEO Suite', category: 'AI & Automation', monthly: true, annual: true, lifetime: true },
  { name: 'Custom AI Workflows', category: 'AI & Automation', monthly: false, annual: false, lifetime: true, tooltip: 'Our team builds custom workflows for you' },

  // Marketing & Sales
  { name: 'Email & SMS Campaigns', category: 'Marketing & Sales', monthly: 'Basic', annual: 'Advanced', lifetime: 'Enterprise' },
  { name: 'Social Media Planner & Scheduler', category: 'Marketing & Sales', monthly: true, annual: true, lifetime: true },
  { name: 'Lead Scoring & Qualification', category: 'Marketing & Sales', monthly: true, annual: true, lifetime: true },
  { name: 'Conversion Analytics', category: 'Marketing & Sales', monthly: true, annual: true, lifetime: true },
  { name: 'Done-For-You Ad Setup', category: 'Marketing & Sales', monthly: false, annual: true, lifetime: true, tooltip: 'Our team sets up paid ads for you' },

  // CRM & Business Tools
  { name: 'Complete CRM System', category: 'CRM & Business', monthly: true, annual: true, lifetime: true },
  { name: 'Custom Pipelines & Stages', category: 'CRM & Business', monthly: true, annual: true, lifetime: true },
  { name: 'Contact Management', category: 'CRM & Business', monthly: 'Basic', annual: 'Advanced', lifetime: 'Enterprise' },
  { name: 'Payment Processing', category: 'CRM & Business', monthly: true, annual: true, lifetime: true },
  { name: 'Survey & Quiz Builder', category: 'CRM & Business', monthly: true, annual: true, lifetime: true },

  // Community & Learning
  { name: 'Community Builder', category: 'Community & Learning', monthly: true, annual: true, lifetime: true },
  { name: 'Course Platform', category: 'Community & Learning', monthly: true, annual: true, lifetime: true },
  { name: 'Membership Management', category: 'Community & Learning', monthly: true, annual: true, lifetime: true },
  { name: 'Certifications System', category: 'Community & Learning', monthly: true, annual: true, lifetime: true },

  // Support & Training
  { name: 'Email Support', category: 'Support & Training', monthly: true, annual: true, lifetime: true },
  { name: 'Priority Support', category: 'Support & Training', monthly: false, annual: true, lifetime: true },
  { name: 'Dedicated Account Manager', category: 'Support & Training', monthly: false, annual: false, lifetime: true },
  { name: 'Setup & Team Training', category: 'Support & Training', monthly: 'Basic', annual: 'Done-For-You', lifetime: 'Done-For-You' },
  { name: 'Daily Sales Training', category: 'Support & Training', monthly: true, annual: true, lifetime: true },
];

const CATEGORIES = ['AI & Automation', 'Marketing & Sales', 'CRM & Business', 'Community & Learning', 'Support & Training'];

function FeatureValue({ value }: { value: boolean | string }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="w-6 h-6 text-emerald-400" />
    ) : (
      <X className="w-6 h-6 text-gray-600" />
    );
  }
  return <span className="text-sm font-semibold text-emerald-300">{value}</span>;
}

export function FeatureComparisonTable() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(CATEGORIES[0]);

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Detailed Feature <span className="text-emerald-400">Comparison</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Compare all features across our three plans. Everything is included—no hidden fees or surprise limitations.
          </p>
        </motion.div>

        {/* Mobile View */}
        <div className="lg:hidden space-y-6">
          {CATEGORIES.map((category) => {
            const categoryFeatures = FEATURES.filter(f => f.category === category);
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
                className="bg-gray-900/60 border border-gray-700/50 rounded-2xl overflow-hidden"
              >
                <motion.button
                  onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                  className="w-full px-6 py-4 flex items-center justify-between font-bold text-white transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-emerald-400" />
                    {category}
                  </span>
                  <motion.div
                    animate={{ rotate: expandedCategory === category ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-gray-400">▼</span>
                  </motion.div>
                </motion.button>

                <motion.div
                  initial={false}
                  animate={{
                    height: expandedCategory === category ? 'auto' : 0,
                    opacity: expandedCategory === category ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden border-t border-gray-700/50"
                >
                  <div className="p-6 space-y-4">
                    {categoryFeatures.map((feature, idx) => (
                      <div key={idx} className="border-b border-gray-800 pb-4 last:border-0 last:pb-0">
                        <h4 className="font-semibold text-white mb-3">{feature.name}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Monthly</span>
                            <FeatureValue value={feature.monthly} />
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Annual</span>
                            <FeatureValue value={feature.annual} />
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Lifetime</span>
                            <FeatureValue value={feature.lifetime} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-3xl">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="px-8 py-6 text-left">
                  <h3 className="text-lg font-bold text-white">Feature</h3>
                </th>
                <th className="px-8 py-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm text-gray-400 uppercase font-bold tracking-wider">Monthly</span>
                    <span className="text-2xl font-black text-blue-400">$375</span>
                    <span className="text-xs text-gray-500">/month</span>
                  </div>
                </th>
                <th className="px-8 py-6 text-center bg-emerald-950/30 border-l border-r border-emerald-500/30">
                  <div className="flex flex-col items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/20 px-2 py-1 rounded">
                      ⭐ Best Value
                    </span>
                    <span className="text-sm text-gray-400 uppercase font-bold tracking-wider">Annual</span>
                    <span className="text-2xl font-black text-emerald-400">$275</span>
                    <span className="text-xs text-gray-500">/month</span>
                  </div>
                </th>
                <th className="px-8 py-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm text-gray-400 uppercase font-bold tracking-wider">Lifetime</span>
                    <span className="text-2xl font-black text-amber-400">Custom</span>
                    <span className="text-xs text-gray-500">One-time</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {CATEGORIES.map((category, catIdx) => {
                const categoryFeatures = FEATURES.filter(f => f.category === category);
                return (
                  <React.Fragment key={category}>
                    <tr className={catIdx > 0 ? 'border-t border-gray-700/50' : ''}>
                      <td colSpan={4} className="px-8 py-4 bg-gray-800/30">
                        <span className="font-bold text-white flex items-center gap-2">
                          <Zap className="w-5 h-5 text-emerald-400" />
                          {category}
                        </span>
                      </td>
                    </tr>
                    {categoryFeatures.map((feature, idx) => (
                      <tr key={feature.name} className={idx < categoryFeatures.length - 1 ? 'border-b border-gray-700/20' : ''}>
                        <td className="px-8 py-5 text-white font-semibold">
                          <div className="flex items-center gap-2">
                            {feature.name}
                            {feature.tooltip && (
                              <div className="group relative">
                                <span className="text-gray-500 cursor-help">?</span>
                                <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 border border-gray-700 text-gray-300 text-xs p-3 rounded-lg whitespace-nowrap z-10">
                                  {feature.tooltip}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <FeatureValue value={feature.monthly} />
                        </td>
                        <td className="px-8 py-5 text-center bg-emerald-950/20 border-l border-r border-emerald-500/20">
                          <FeatureValue value={feature.annual} />
                        </td>
                        <td className="px-8 py-5 text-center">
                          <FeatureValue value={feature.lifetime} />
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Ready to See These Features in Action?</h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Schedule a demo with our team and we'll show you exactly how each feature will help your business grow.
          </p>
          <motion.a
            href="https://go.mediatraffics.com/leads"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300"
          >
            Book Your Free Demo
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}
