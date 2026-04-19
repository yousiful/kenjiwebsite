import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check, Star, ArrowRight, Calendar, Zap, Shield,
  CreditCard, Video
} from 'lucide-react';
import { ToolReplacementBar } from './ToolReplacementBar';
import { MoneyBackGuarantee } from './MoneyBackGuarantee';
import { ExitIntentPopup } from './ExitIntentPopup';
import FAQ from './FAQ';
import { getSeasonCopy } from '../utils/seasonCopy';

const MONTHLY_FEATURES = [
  "A Real Team of Experts Managing Setup",
  "Dedicated Account Manager & Support",
  "Unlimited Custom AI Agents",
  "Done-For-You Automated Workflows",
  "Done-For-You Ads to Fill Your Pipeline",
  "Complete CRM with Custom Pipelines",
  "Advanced Email & SMS Campaigns",
  "$20/mo in Email/Text AI token credits",
  "Community Builder & Management",
  "Blog Writer & SEO Suite",
  "Social Media Planner & Scheduler",
  "Daily Sales Training",
  "Standard Referral Program",
];

const YEARLY_FEATURES = [
  "A Real Team of Experts Managing Setup",
  "Dedicated Account Manager & Support",
  "Unlimited Custom AI Agents",
  "Done-For-You Automated Workflows",
  "Done-For-You Ads to Fill Your Pipeline",
  "Complete CRM with Custom Pipelines",
  "Advanced Email & SMS Campaigns",
  "$30/mo in Email/Text AI token credits",
  "Community Builder & Management",
  "Blog Writer & SEO Suite",
  "Social Media Planner & Scheduler",
  "Daily Sales Training",
  "Sales Team Placement included",
  "Premium Referral Program Access",
];

const VIP_FEATURES = [
  "Personal strategy session with our senior team",
  "Custom platform setup for your business",
  "Dedicated account manager and priority support",
  "Custom workflows built specifically for you",
  "Pay once, use forever. No recurring fees.",
];

export function PricingNew() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const season = getSeasonCopy();

  const handlePlanClick = async (url: string, planName: string) => {
    setIsLoading(planName);
    await new Promise(resolve => setTimeout(resolve, 500));
    window.location.href = url;
  };

  return (
    <div className="py-16 sm:py-24 px-4" style={{ backgroundColor: '#0B0E14' }}>

      {/* High-Octane Spots Remaining Meter */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full -mt-16 sm:-mt-24 mb-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(90deg, #111827 0%, #1f2937 50%, #111827 100%)',
          borderBottom: '1px solid rgba(245, 158, 11, 0.3)'
        }}
      >
        <div className="absolute inset-0 bg-amber-500/5 animate-pulse"></div>
        <div className="flex flex-wrap items-center justify-center gap-4 px-4 py-3 text-sm sm:text-base text-center relative z-10">
          <div className="flex items-center gap-2 bg-red-500/20 px-3 py-1 rounded-full border border-red-500/30">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-red-400 font-bold uppercase tracking-wider text-xs">Closing Soon</span>
          </div>
          <motion.span
            className="flex items-center gap-1.5 font-bold text-white tracking-wide"
          >
            ONLY 8 SPOTS REMAINING IN THE CURRENT COHORT
          </motion.span>
        </div>
      </motion.div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto mb-12 sm:mb-16 text-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 rounded-full px-5 py-2 mb-6">
            <span className="text-amber-300 font-bold text-xs sm:text-sm uppercase tracking-widest">
              {season.badge}
            </span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight"
            style={{ fontFamily: 'Inter, Montserrat, sans-serif' }}
          >
            <span style={{
              background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.01em'
            }}>
              Stop Leaving Money
            </span>
            <br />
            <span className="text-white">on the Table This Season</span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-200 font-semibold max-w-3xl mx-auto mb-8 leading-relaxed">
            {season.subheadline}
          </p>
        </motion.div>
      </div>

      {/* Tool Replacement Bar */}
      <div className="hidden sm:block">
        <ToolReplacementBar />
      </div>

      <div className="max-w-7xl mx-auto mt-12 sm:mt-16">
        {/* Live Social Proof Ticker */}
        <div className="w-full overflow-hidden mb-12 py-3 bg-gray-900/50 border-y border-gray-800">
          <div className="flex gap-12 whitespace-nowrap animate-scroll items-center h-8">
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                <span className="text-gray-400 font-medium flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Mark T. just locked in the Yearly Plan</span>
                <span className="text-gray-400 font-medium flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Sarah K. closed 3 deals in her first 48 hours</span>
                <span className="text-gray-400 font-medium flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> 8 spots remaining for this month's cohort</span>
                <span className="text-gray-400 font-medium flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> David R. added $22K ARR using KenjiAI</span>
              </React.Fragment>
            ))}
          </div>
          <style>{`
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-scroll { animation: scroll 20s linear infinite; }
          `}</style>
        </div>

        {/* 3-Column Pricing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 px-4">

          {/* Monthly Plan */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-gray-900/60 backdrop-blur-sm border border-blue-500/30 rounded-3xl p-5 sm:p-8 flex flex-col order-2 lg:order-2"
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 whitespace-nowrap">
                <Calendar className="w-4 h-4" />
                {season.planBadge}
              </div>
            </div>

            <div className="flex justify-center mb-6 mt-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white" />
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">Monthly</h3>
            <p className="text-gray-300 text-center mb-6 text-base leading-relaxed">
              Start now. No long-term commitment.
            </p>

            <div className="text-center mb-5">
              <div className="text-blue-300 font-semibold text-sm mt-2">
                + 10% of new revenue we help generate
              </div>
              <div className="text-gray-500 text-xs mt-1">
                Only applies to revenue from KenjiAI campaigns. No revenue = no fee.
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/30 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-5 h-5 text-blue-400" />
                <span className="text-white font-bold text-base">Everything Included</span>
              </div>
            </div>

            <div className="flex-1 mb-6 relative">
              <div className="space-y-1.5 pr-2">
                {MONTHLY_FEATURES.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-gray-800/30 transition-colors"
                  >
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-200 text-sm leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <motion.button
              onClick={() => handlePlanClick('https://freedom.kenjiai.com/checkout-4912-2457-3370', 'monthly')}
              disabled={isLoading === 'monthly'}
              whileHover={{ scale: isLoading === 'monthly' ? 1 : 1.02 }}
              whileTap={{ scale: isLoading === 'monthly' ? 1 : 0.98 }}
              className={`w-full py-5 rounded-2xl font-black text-lg sm:text-xl flex flex-col items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all duration-300 mb-3 border border-amber-400/50 relative overflow-hidden group ${isLoading === 'monthly' ? 'opacity-90 cursor-wait bg-amber-600 text-white' : 'bg-gradient-to-br from-amber-500 to-orange-600 text-white hover:shadow-[0_0_40px_rgba(245,158,11,0.4)]'}`}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {isLoading === 'monthly' ? (
                <motion.div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                    Redirecting...
                  </motion.span>
                </motion.div>
              ) : (
                <>
                  <span className="flex items-center gap-2">Claim Your Spot <ArrowRight className="w-5 h-5" /></span>
                  <span className="text-sm font-bold text-amber-100 uppercase tracking-wide opacity-90 mt-1">Start for $375/mo</span>
                </>
              )}
            </motion.button>

            <div className="flex flex-col items-center justify-center gap-2 mt-4 text-gray-400 text-xs font-semibold">
              <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-full">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>Secured by Stripe · 30-Day Guarantee</span>
              </div>
            </div>
          </motion.div>

          {/* Yearly Plan */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="relative bg-gray-900/60 backdrop-blur-sm border border-emerald-500/40 rounded-3xl p-5 sm:p-8 flex flex-col order-1 lg:order-1"
            style={{ boxShadow: '0 0 40px rgba(16, 185, 129, 0.18)' }}
          >
            <div className="absolute -top-3 -right-3 z-20">
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 px-4 py-2 rounded-lg text-xs font-black shadow-xl transform rotate-6">
                MOST POPULAR
              </div>
            </div>

            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 whitespace-nowrap">
                <Star className="w-4 h-4" />
                {season.annualBadge}
              </div>
            </div>

            <div className="flex justify-center mb-6 mt-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">Annual</h3>
            <p className="text-gray-300 text-center mb-6 text-base leading-relaxed">
              The plan for businesses serious about next year.
            </p>

            <div className="text-center mb-5">
              <div className="text-emerald-300 font-semibold text-sm mt-2">
                + 5% of new revenue we help generate
              </div>
              <div className="text-gray-500 text-xs mt-1 mb-3">
                Only applies to revenue from KenjiAI campaigns. No revenue = no fee.
              </div>
              <div className="text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg inline-block font-bold text-sm">
                🔥 You save $1,250/yr vs monthly
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                <span className="text-white font-bold text-base">Everything Included</span>
              </div>
            </div>

            <div className="flex-1 mb-6 relative">
              <div className="space-y-1.5 pr-2">
                {YEARLY_FEATURES.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-gray-800/30 transition-colors"
                  >
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-200 text-sm leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <motion.button
              onClick={() => handlePlanClick('https://freedom.kenjiai.com/checkout-4912-2457-3370', 'yearly')}
              disabled={isLoading === 'yearly'}
              whileHover={{ scale: isLoading === 'yearly' ? 1 : 1.02 }}
              whileTap={{ scale: isLoading === 'yearly' ? 1 : 0.98 }}
              className={`w-full py-5 rounded-2xl font-black text-lg sm:text-xl flex flex-col items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.3)] transition-all duration-300 mb-3 border border-amber-400/60 relative overflow-hidden group ${isLoading === 'yearly' ? 'opacity-90 cursor-wait bg-amber-600 text-white' : 'bg-gradient-to-br from-amber-400 to-orange-500 text-gray-900 hover:shadow-[0_0_50px_rgba(245,158,11,0.5)]'}`}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {isLoading === 'yearly' ? (
                <motion.div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full"
                  />
                  <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                    Redirecting...
                  </motion.span>
                </motion.div>
              ) : (
                <>
                  <span className="flex items-center gap-2">Claim Your Spot <ArrowRight className="w-5 h-5" /></span>
                  <span className="text-sm font-bold text-amber-900 uppercase tracking-wide opacity-90 mt-1">Start for $270/mo ($3,250/yr)</span>
                </>
              )}
            </motion.button>

            <div className="flex flex-col items-center justify-center gap-2 mt-4 text-gray-400 text-xs font-semibold">
              <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-full">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>Stripe Secured · 30-Day Guarantee</span>
              </div>
            </div>
          </motion.div>

          {/* Lifetime */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="relative bg-gradient-to-br from-amber-900/35 to-orange-900/35 backdrop-blur-sm border border-amber-500/40 rounded-3xl p-5 sm:p-8 flex flex-col order-3 lg:order-3"
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 whitespace-nowrap">
                <Star className="w-4 h-4" />
                By Application Only
              </div>
            </div>

            <div className="flex justify-center mb-6 mt-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">Lifetime</h3>
            <p className="text-gray-300 text-center mb-6 text-sm leading-relaxed">
              One-time investment. Fully custom. No recurring fees.
            </p>

            <div className="text-center mb-6">
              <div className="text-3xl sm:text-4xl font-bold mb-1" style={{ color: '#FBBF24' }}>
                Book a Call
              </div>
              <div className="text-gray-300 text-sm">Pricing revealed to qualified applicants</div>
            </div>

            <motion.a
              href="https://go.mediatraffics.com/leads"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-gradient-to-br from-blue-600/25 to-amber-600/25 border border-amber-400/40 rounded-2xl p-5 mb-5 overflow-hidden transition-all duration-300 hover:border-amber-400 block cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-amber-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2.5 mb-2">
                  <Video className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <span className="text-white font-bold text-lg">Book a Demo</span>
                </div>
                <p className="text-gray-300 text-xs text-center mb-3 group-hover:text-white transition-colors">
                  15 minutes. We'll show you how it works for your business.
                </p>
                <div className="flex items-center justify-center gap-2 text-amber-400 font-semibold text-sm group-hover:text-amber-300 transition-colors">
                  <span>Schedule Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.a>

            <div className="bg-amber-900/20 border border-amber-500/25 rounded-xl p-3 mb-5">
              <p className="text-amber-200 text-xs text-center leading-relaxed">
                We work with a select group of businesses each quarter.
                8 of our last 10 clients now generate $100K+/mo.
              </p>
            </div>

            <div className="flex-1 mb-6">
              <p className="text-amber-300 font-semibold text-center mb-4 text-sm">
                What's included with Lifetime Access:
              </p>
              <div className="space-y-2">
                {VIP_FEATURES.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg transition-all duration-300 hover:bg-amber-500/10 group cursor-default"
                  >
                    <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5 group-hover:text-amber-300 transition-colors" />
                    <span className="text-gray-200 text-sm leading-relaxed group-hover:text-white transition-colors">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <motion.a
              href="https://go.mediatraffics.com/leads"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-white py-4 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-xl cursor-pointer"
              style={{ background: 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)' }}
            >
              Apply for Lifetime Access
              <ArrowRight className="w-4 h-4" />
            </motion.a>

            <p className="text-gray-400 text-xs text-center mt-4 leading-relaxed">
              No commitment required for the discovery call
            </p>
          </motion.div>
        </div>

        {/* Secondary Conversion / Unsure Leads */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-12 max-w-3xl mx-auto text-center bg-gray-900/40 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm"
        >
          <h4 className="text-2xl font-bold text-white mb-3">Not Sure Which Plan Is Right For You?</h4>
          <p className="text-gray-400 mb-6">
            Hop on a quick 15-minute discovery call with our team. We'll show you exactly how KenjiAI works and help you decide the best path forward.
          </p>
          <a
            href="https://go.mediatraffics.com/leads"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-8 py-3 rounded-xl font-bold transition-all duration-300"
          >
            <span>Book a Free Strategy Call</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>

        <div className="mt-16 sm:mt-20 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <MoneyBackGuarantee />
          </motion.div>
        </div>
      </div>

      <FAQ />

      <ExitIntentPopup />

      <style>{`
        @keyframes shine-slow {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        .animate-shine-slow { animation: shine-slow 2s ease-in-out infinite; }

        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(107, 114, 128, 0.3);
          border-radius: 4px;
        }
        .scrollbar-thin { scrollbar-width: thin; scrollbar-color: rgba(107, 114, 128, 0.3) transparent; }
      `}</style>
    </div>
  );
}
