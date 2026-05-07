import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 px-4 lg:px-8 max-w-6xl mx-auto">

          {/* Monthly Plan */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-gray-900/60 backdrop-blur-sm border border-gray-800 hover:border-blue-500/60 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] transition-all duration-500 rounded-2xl p-5 sm:p-6 flex flex-col order-2 lg:order-2"
          >
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">Monthly</h3>
              <p className="text-gray-400 text-sm">Start now. No long-term commitment.</p>
            </div>

            <div className="mb-5 bg-blue-500/5 border border-blue-500/10 rounded-lg p-3">
              <div className="text-blue-400 text-sm font-semibold">+ 10% of new revenue generated</div>
              <div className="text-gray-500 text-xs mt-0.5">Only from KenjiAI campaigns. No revenue = no fee.</div>
            </div>

            <motion.button
              onClick={() => handlePlanClick('https://freedom.kenjiai.com/checkout-4912-2457-3370', 'monthly')}
              disabled={isLoading === 'monthly'}
              className={`w-full py-3.5 rounded-xl font-bold text-base flex flex-col items-center justify-center transition-all duration-300 mb-2 relative overflow-hidden group ${isLoading === 'monthly' ? 'opacity-90 cursor-wait bg-amber-600 text-white' : 'bg-[#10A37F] text-white hover:bg-[#0E906F]'}`}
            >
              {isLoading === 'monthly' ? (
                <motion.div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Redirecting...</span>
                </motion.div>
              ) : (
                <span className="flex items-center gap-2">Claim Spot for $375/mo</span>
              )}
            </motion.button>
            <div className="text-center text-gray-500 text-xs mb-6">Secured by Stripe · 30-Day Guarantee</div>

            <div className="flex-1">
              <div className="text-white text-sm font-semibold mb-3">Everything included:</div>
              <div className="space-y-1">
                {MONTHLY_FEATURES.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-1.5 -mx-1.5 rounded-md hover:bg-white/5 transition-colors group cursor-default">
                    <Check className="w-4 h-4 text-gray-400 group-hover:text-amber-500 transition-colors flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 group-hover:text-white transition-colors text-sm leading-tight tracking-tight">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Yearly Plan */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="relative bg-gray-900/60 backdrop-blur-sm border-2 border-[#10A37F] hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(16,163,127,0.2)] transition-all duration-500 rounded-2xl p-5 sm:p-6 flex flex-col order-1 lg:order-1"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Annual</h3>
                <p className="text-gray-400 text-sm">For businesses serious about next year.</p>
              </div>
              <span className="bg-[#10A37F]/10 text-[#10A37F] text-xs font-bold px-2 py-1 rounded">MOST POPULAR</span>
            </div>

            <div className="mb-5 bg-[#10A37F]/5 border border-[#10A37F]/10 rounded-lg p-3">
              <div className="text-[#10A37F] text-sm font-semibold">+ 5% of new revenue generated</div>
              <div className="text-gray-500 text-xs mt-0.5">Only from KenjiAI campaigns. No fee if no revenue.</div>
            </div>

            <motion.button
              onClick={() => handlePlanClick('https://freedom.kenjiai.com/checkout-4912-2457-3370', 'yearly')}
              disabled={isLoading === 'yearly'}
              className={`w-full py-3.5 rounded-xl font-bold text-base flex flex-col items-center justify-center transition-all duration-300 mb-2 relative overflow-hidden group ${isLoading === 'yearly' ? 'opacity-90 cursor-wait bg-[#10A37F] text-white' : 'bg-[#10A37F] text-white hover:bg-[#0E906F]'}`}
            >
              {isLoading === 'yearly' ? (
                <motion.div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Redirecting...</span>
                </motion.div>
              ) : (
                <span className="flex items-center gap-2">Claim Spot for $270/mo ($3,250/yr)</span>
              )}
            </motion.button>
            <div className="text-center text-[#10A37F] font-semibold text-xs mb-6">🔥 You save $1,250/yr vs monthly</div>

            <div className="flex-1">
              <div className="text-white text-sm font-semibold mb-3">Everything in Monthly, plus:</div>
              <div className="space-y-1">
                {YEARLY_FEATURES.filter(f => !MONTHLY_FEATURES.includes(f)).map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-1.5 -mx-1.5 rounded-md hover:bg-white/5 transition-colors group cursor-default">
                    <Check className="w-4 h-4 text-[#10A37F] group-hover:text-emerald-400 transition-colors flex-shrink-0 mt-0.5" />
                    <span className="text-gray-200 group-hover:text-white transition-colors text-[13px] font-medium leading-tight tracking-tight">{feature}</span>
                  </div>
                ))}
                {MONTHLY_FEATURES.slice(0, 5).map((feature, idx) => (
                  <div key={`m-${idx}`} className="flex items-start gap-2 p-1.5 -mx-1.5 rounded-md hover:bg-white/5 transition-colors group cursor-default">
                    <Check className="w-4 h-4 text-gray-500 group-hover:text-gray-400 transition-colors flex-shrink-0 mt-0.5" />
                    <span className="text-gray-400 group-hover:text-gray-300 transition-colors text-[13px] leading-tight tracking-tight">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Lifetime */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="relative bg-gray-900/60 backdrop-blur-sm border border-gray-800 hover:border-blue-500/50 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] transition-all duration-500 rounded-2xl p-5 sm:p-6 flex flex-col order-3 lg:order-3"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Lifetime</h3>
                <p className="text-gray-400 text-sm">One-time payment. Fully custom.</p>
              </div>
              <span className="bg-gray-800 text-gray-300 text-xs font-bold px-2 py-1 rounded">CUSTOM</span>
            </div>

            <div className="mb-5 bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
              <div className="text-gray-300 text-sm font-semibold">Custom success fee</div>
              <div className="text-gray-500 text-xs mt-0.5">Determined during discovery call.</div>
            </div>

            <a
              href="https://go.mediatraffics.com/price"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-xl font-bold text-base flex flex-col items-center justify-center transition-all duration-300 mb-2 bg-[#10A37F] hover:bg-[#0E906F] text-white"
            >
              <span className="flex items-center gap-2">Need to see more proof? Book A Walkthrough Now!</span>
            </a>
            <div className="text-center text-gray-500 text-xs mb-6">Pricing revealed to qualified applicants</div>

            <div className="flex-1">
              <div className="text-white text-sm font-semibold mb-3">Enterprise benefits:</div>
              <div className="space-y-1">
                {VIP_FEATURES.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-1.5 -mx-1.5 rounded-md hover:bg-white/5 transition-colors group cursor-default">
                    <Check className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 group-hover:text-white transition-colors text-[13px] leading-tight tracking-tight">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
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
