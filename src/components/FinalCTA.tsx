import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Zap, Rocket, Crown, Star } from 'lucide-react';
import { useHolidayTheme } from '../contexts/HolidayThemeContext';
import { LuxuryButton } from './LuxuryButton';
import { AmbientBackground } from './AmbientBackground';

const FinalCTA: React.FC = () => {
  const { currentHoliday } = useHolidayTheme();
  const benefits = [
    "Instant platform activation",
    "Complete automation toolkit",
    "Full access to all features",
    "24/7 AI support included",
    "Proven ROI framework",
    "Expert onboarding support"
  ];

  const urgencyIndicators = [
    { label: "Active Users", value: "50,000+", color: "text-blue-400" },
    { label: "Average ROI", value: "425%", color: "text-green-400" },
    { label: "Customer Rating", value: "4.9/5", color: "text-purple-400" }
  ];

  return (
    <section className="py-32 bg-gradient-to-br from-gray-900 via-blue-900/30 to-purple-900/30 relative overflow-hidden" aria-labelledby="cta-heading">
      <AmbientBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Crown Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 rounded-3xl mb-8 shadow-2xl"
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
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
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
          className="mb-12 flex justify-center"
          role="region"
          aria-labelledby="cta-button"
        >
          <div className="relative">
            <LuxuryButton href="#pricing" variant="primary" size="xl">
              {currentHoliday && (
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-3xl"
                >
                  {currentHoliday.emoji}
                </motion.span>
              )}
              <Rocket className="w-8 h-8" />
              <span>Start Building Your Empire</span>
              <ArrowRight className="w-8 h-8" />
            </LuxuryButton>
            {currentHoliday && (
              <motion.span
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -top-3 -right-3 bg-yellow-400 text-gray-900 text-xs font-black px-3 py-1.5 rounded-full uppercase shadow-lg z-20"
              >
                {currentHoliday.offer_badge}
              </motion.span>
            )}
          </div>
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