import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Zap, Rocket, Crown, Star } from 'lucide-react';

const FinalCTA: React.FC = () => {
  const benefits = [
    "Risk-free 30-day money-back guarantee",
    "Cancel anytime, no questions asked",
    "Full access to all features",
    "24/7 AI support included",
    "100% satisfaction guaranteed",
    "White-glove onboarding"
  ];

  const urgencyIndicators = [
    { label: "Active Users", value: "50,000+", color: "text-blue-400" },
    { label: "Average ROI", value: "425%", color: "text-green-400" },
    { label: "Customer Rating", value: "4.9/5", color: "text-purple-400" }
  ];

  return (
    <section className="py-32 bg-gradient-to-br from-gray-900 via-blue-900/30 to-purple-900/30 relative overflow-hidden" aria-labelledby="cta-heading">
      {/* Epic Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-red-500/15 via-orange-500/15 via-yellow-500/15 via-green-500/15 via-blue-500/15 via-indigo-500/15 to-violet-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/5 to-green-400/5"></div>
      </div>

      {/* Animated Particles - Reduced for mobile performance */}
      <div className="absolute inset-0 hidden md:block">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              opacity: 0,
            }}
            animate={{
              y: [null, -30],
              opacity: [0, 0.6, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Crown Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 rounded-3xl mb-8 shadow-2xl"
          role="presentation"
        >
          <Crown className="w-12 h-12 text-white" />
        </motion.div>

        {/* Epic Headline */}
        <motion.h2
          id="cta-heading"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight"
        >
          Ready to Build Your{' '}
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
            Business Empire?
          </span>
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-2xl sm:text-3xl text-gray-300 mb-12 leading-relaxed max-w-5xl mx-auto"
        >
          Join the AI revolution that's creating the next generation of business empires. 
          One platform, infinite possibilities, unlimited growth.
        </motion.p>

        {/* Success Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          role="list"
        >
          {urgencyIndicators.map((indicator, index) => (
            <motion.div
              key={indicator.label}
              whileHover={{ scale: 1.05, y: -5 }}
              role="listitem"
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-blue-400/50 rounded-2xl p-6 transition-all duration-300"
              data-caption={`${indicator.label}: ${indicator.value} - Join the success`}
            >
              <div className={`text-3xl font-bold ${indicator.color} mb-2`}>{indicator.value}</div>
              <div className="text-gray-400">{indicator.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16"
          role="list"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
              role="listitem"
              className="flex items-center gap-3 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-4"
              data-caption={benefit}
            >
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-gray-300 text-sm font-medium">{benefit}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Epic CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mb-12"
          role="region"
          aria-labelledby="cta-button"
        >
          <motion.a
            id="cta-button"
            href="/pricing"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 0 60px rgba(59, 130, 246, 0.8)",
              y: -5
            }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-pink-600 via-purple-600 via-blue-600 to-green-500 hover:from-pink-500 hover:via-purple-500 hover:via-blue-500 hover:to-green-400 text-white px-16 py-8 rounded-3xl font-bold text-2xl transition-all duration-500 shadow-2xl"
            data-caption="Start your business transformation today - complete automation platform"
          >
            <Rocket className="w-8 h-8 group-hover:animate-bounce" />
            <span>Start Building Your Empire</span>
            <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            
            {/* Epic Glow Effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-400 via-purple-400 via-blue-400 to-green-400 opacity-0 group-hover:opacity-40 blur-2xl transition-opacity duration-500"></div>
            
            {/* Shine Effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:animate-pulse"></div>
          </motion.a>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-12"
          role="presentation"
        >
          <div className="flex items-center gap-2" data-caption="Join 50,000+ successful entrepreneurs">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-400 rounded-full border-2 border-gray-900 flex items-center justify-center text-white font-semibold text-sm">
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <span className="text-gray-300 ml-2">50,000+ entrepreneurs building empires</span>
          </div>
          
          <div className="flex items-center gap-2" data-caption="Average customer ROI of 425%">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-gray-300">425% Average ROI</span>
          </div>
        </motion.div>

        {/* Final Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="text-gray-400 text-xl mb-8"
        >
          The future belongs to those who embrace AI today. Your business empire starts now.
        </motion.p>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="flex flex-wrap items-center justify-center gap-8 text-gray-500 text-sm"
          role="presentation"
        >
          <div className="flex items-center gap-2" data-caption="Bank-level security for your data">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span>Bank-Level Security</span>
          </div>
          <div className="flex items-center gap-2" data-caption="GDPR and SOC 2 compliant">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <span>Enterprise Compliant</span>
          </div>
          <div className="flex items-center gap-2" data-caption="99.97% uptime guarantee">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
            <span>99.97% Uptime</span>
          </div>
          <div className="flex items-center gap-2" data-caption="24/7 expert support">
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
            <span>24/7 Support</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;