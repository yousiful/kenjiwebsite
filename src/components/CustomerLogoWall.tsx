import React from 'react';
import { motion } from 'framer-motion';

interface Logo {
  name: string;
  industryType: string;
  milestone: string;
}

const CUSTOMER_LOGOS: Logo[] = [
  { name: 'TechStartup Inc', industryType: 'SaaS', milestone: '250K+/mo' },
  { name: 'Digital Agency Pro', industryType: 'Marketing', milestone: '$1.2M/yr' },
  { name: 'E-Commerce Titans', industryType: 'Retail', milestone: '5x growth' },
  { name: 'Consulting Elite', industryType: 'B2B', milestone: '500K/mo' },
  { name: 'Growth Labs', industryType: 'Education', milestone: '3x leads' },
  { name: 'Service Solutions', industryType: 'Services', milestone: '80% less admin' },
  { name: 'Revenue Systems', industryType: 'Finance', milestone: '425% ROI' },
  { name: 'Digital Forge', industryType: 'Design', milestone: '10x efficiency' },
  { name: 'Enterprise Scale', industryType: 'Corporate', milestone: '$2.5M saved' },
  { name: 'Growth Engine', industryType: 'SaaS', milestone: '150K+/mo' },
  { name: 'Brand Builders', industryType: 'Creative', milestone: '6x productivity' },
  { name: 'Scale Masters', industryType: 'Operations', milestone: '92% automation' },
];

// Color schemes for logos
const getLogoGradient = (index: number) => {
  const gradients = [
    'from-blue-600 to-cyan-600',
    'from-purple-600 to-pink-600',
    'from-emerald-600 to-teal-600',
    'from-orange-600 to-red-600',
    'from-indigo-600 to-blue-600',
    'from-green-600 to-emerald-600',
  ];
  return gradients[index % gradients.length];
};

export function CustomerLogoWall() {
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
          <p className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-3">
            Trusted by Industry Leaders
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Join 50,000+ Successful <span className="text-emerald-400">Businesses</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            From scrappy startups to enterprise teams, businesses across every industry are using KenjiAI to automate their operations and scale faster.
          </p>
        </motion.div>

        {/* Logo Wall Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {CUSTOMER_LOGOS.map((logo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }}
              className="relative bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300 group overflow-hidden"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getLogoGradient(index)} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Logo Placeholder */}
                <div className={`h-16 bg-gradient-to-br ${getLogoGradient(index)} rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}>
                  <span className="text-white font-bold text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                    {logo.name.split(' ')[0][0]}{logo.name.split(' ')[1]?.[0] || ''}
                  </span>
                </div>

                {/* Company Info */}
                <h3 className="font-bold text-white text-sm leading-tight mb-2 line-clamp-2">
                  {logo.name}
                </h3>

                {/* Industry Type */}
                <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide font-semibold">
                  {logo.industryType}
                </p>

                {/* Milestone Badge */}
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 rounded-lg px-3 py-1.5">
                  <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full"></span>
                  <span className="text-emerald-300 text-xs font-bold">{logo.milestone}</span>
                </div>
              </div>

              {/* Hover Border */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: 'inset 0 0 20px rgba(16, 185, 129, 0.1)' }}
              ></div>
            </motion.div>
          ))}
        </div>

        {/* Social Proof Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {[
            { label: 'Active Businesses', value: '50,000+', icon: '🏢' },
            { label: 'Revenue Generated', value: '$500M+', icon: '💰' },
            { label: 'Average ROI', value: '425%', icon: '📈' },
            { label: 'Happy Clients', value: '4.9★', icon: '⭐' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="text-center bg-gray-900/40 border border-gray-700/30 rounded-2xl p-6"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-3xl sm:text-4xl font-black text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-400 font-semibold">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Industries Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-gray-900/40 to-emerald-900/20 border border-gray-700/30 rounded-3xl p-10 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Works for Every Industry</h3>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              'SaaS',
              'E-Commerce',
              'Marketing Agencies',
              'Consulting',
              'Real Estate',
              'Education',
              'Services',
              'Membership Sites',
              'Coaching',
              'Nonprofits',
              'B2B',
              'Fitness'
            ].map((industry) => (
              <motion.div
                key={industry}
                whileHover={{ scale: 1.05, y: -2 }}
                className="px-4 py-2 bg-gray-800/60 border border-gray-700 rounded-full text-gray-300 text-sm font-semibold hover:border-emerald-500/50 hover:text-emerald-300 transition-all"
              >
                {industry}
              </motion.div>
            ))}
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            Regardless of your industry, KenjiAI's automation platform can help you save time, reduce costs, and grow revenue. Our platform is flexible enough to work for any business model.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
