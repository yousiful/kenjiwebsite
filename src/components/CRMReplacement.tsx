import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Zap } from 'lucide-react';

const CRMReplacement: React.FC = () => {
  const companyLogos = [
    { name: "Salesforce", text: "Salesforce" },
    { name: "HubSpot", text: "HubSpot" },
    { name: "Pipedrive", text: "Pipedrive" },
    { name: "Zoho CRM", text: "Zoho CRM" },
    { name: "Monday.com", text: "Monday.com" },
    { name: "Copper", text: "Copper" },
    { name: "ActiveCampaign", text: "ActiveCampaign" },
    { name: "Keap", text: "Keap" },
    { name: "Freshsales", text: "Freshsales" },
    { name: "Mailchimp", text: "Mailchimp" },
    { name: "Constant Contact", text: "Constant Contact" },
    { name: "SendGrid", text: "SendGrid" }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-full px-6 py-2 mb-6"
          >
            <DollarSign className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 font-semibold text-sm uppercase tracking-wide">Massive Cost Savings</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Replace Over{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              10+ Apps
            </span>
            <br />
            You Already Use
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
            Stop paying thousands in monthly subscriptions. KenjiAI consolidates your entire tech stack into one powerful platform.
          </p>

          {/* Value Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-400/30 rounded-2xl p-6"
            >
              <TrendingUp className="w-10 h-10 text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-black text-white mb-2">$3,000+</div>
              <p className="text-gray-400 text-sm">Average monthly savings</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-400/30 rounded-2xl p-6"
            >
              <Zap className="w-10 h-10 text-purple-400 mx-auto mb-3" />
              <div className="text-3xl font-black text-white mb-2">12+ Tools</div>
              <p className="text-gray-400 text-sm">Replaced by one platform</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-400/30 rounded-2xl p-6"
            >
              <DollarSign className="w-10 h-10 text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-black text-white mb-2">$275/mo</div>
              <p className="text-gray-400 text-sm">All-in-one pricing</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Scrolling Company Logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <p className="text-center text-gray-500 text-sm uppercase tracking-wider mb-6 font-semibold">
            Replace these expensive tools and save thousands every month
          </p>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-900 to-transparent z-10"></div>

            <motion.div
              className="flex gap-12"
              animate={{
                x: [0, -1800],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
            >
              {[...companyLogos, ...companyLogos, ...companyLogos].map((logo, index) => (
                <div
                  key={`${logo.name}-${index}`}
                  className="flex items-center justify-center px-8 py-4 bg-gray-800/30 border border-gray-700/50 rounded-xl min-w-[180px]"
                >
                  <span className="text-gray-400 font-bold text-lg whitespace-nowrap">{logo.text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <p className="text-gray-400 mb-6">
            Your competitors are wasting money on 10+ separate tools. You'll have everything in one place for less than the cost of a single CRM.
          </p>
          <motion.a
            href="https://freedom.kenjiai.com/checkout-4912-2457-3370"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
          >
            <DollarSign className="w-5 h-5" />
            Get Started Now
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default CRMReplacement;
