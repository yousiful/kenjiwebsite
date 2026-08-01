import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { ToolReplacementBar } from './ToolReplacementBar';
import { MoneyBackGuarantee } from './MoneyBackGuarantee';
import { ExitIntentPopup } from './ExitIntentPopup';
import FAQ from './FAQ';
import { getSeasonCopy } from '../utils/seasonCopy';

const MONTHLY_FEATURES = [
  "Proven website and funnel built for you, the same layouts our winning clients convert with",
  "Proven follow-up AI agents that call, text, and book appointments around the clock",
  "Replace 17+ tools (CRM, funnels, email, SMS, calendar, ads, more)",
  "We build and launch your first ad campaign in week one",
  "Live onboarding call within 48 hours of signup",
  "Real human support, not chatbots, usually back to you in under 2 hours",
];

const YEARLY_FEATURES = [
  "Everything in Monthly, with the performance fee cut in half (5% vs 10%)",
  "Quarterly strategy call with our growth team to plan your next 90 days",
  "Custom workflow built for your business in week one",
  "Sales team placement included if you need help closing",
  "Save $1,260 vs paying monthly",
];

const VIP_FEATURES = [
  "Everything in Annual, paid one time, never billed again",
  "Zero performance fee, forever, keep 100% of every sale",
  "Trained sales people placed into your company, free (Golden Members only)",
  "We migrate your current tools for you (white-glove)",
  "Direct line to the founding team",
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
            Only 8 spots left in this month's cohort
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

      {/* Low-pressure call CTA up top, catches visitors who want to talk before they buy */}
      <div className="max-w-3xl mx-auto mb-12 sm:mb-16 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-900/60 border border-gray-700/50 rounded-2xl p-5 sm:p-6 text-center sm:text-left">
          <p className="text-gray-200 font-semibold">
            Not ready to pick a plan? Book a free 15-minute call and we'll walk you through it, no pressure, no pitch.
          </p>
          <a
            href="https://go.mediatraffics.com/leads"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center justify-center gap-2 bg-white text-gray-900 hover:bg-gray-200 px-6 py-3 rounded-xl font-bold transition-all duration-300 whitespace-nowrap"
          >
            Book a Free Call
          </a>
        </div>
      </div>

      {/* Value stack: what $375 actually buys (price anchored against hiring) */}
      <div className="max-w-5xl mx-auto mb-12 sm:mb-16 px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            What Your Plan Actually Buys You
          </h2>
          <p className="text-lg font-semibold text-gray-300 max-w-2xl mx-auto">
            Hiring this out piece by piece runs <span className="text-white font-bold">$8,000+ every month</span>.
            Your plan includes all of it.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              worth: 'Agencies charge $3,000+',
              title: 'Proven Website, Built For You',
              body: "No blank page. We install the funnel and website layouts our winning clients already convert with, branded to you, live in week one.",
            },
            {
              worth: 'A setter costs $3,000/mo',
              title: 'Proven Follow-Up Agents',
              body: 'AI agents call, text, and email every lead within minutes, handle objections, and book appointments 24/7. Most leads die from slow follow-up. Yours won’t.',
            },
            {
              worth: 'A copywriter costs $2,000/mo',
              title: 'Copy That Already Works',
              body: 'Your ads and pages are written from campaigns that have already produced sales in your niche, then managed and optimized for you.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-gray-900/60 border border-emerald-500/25 rounded-2xl p-6"
              style={{ boxShadow: '0 0 24px rgba(16,185,129,0.10)' }}
            >
              <span className="inline-block rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold px-3 py-1 mb-4">
                {item.worth}
              </span>
              <h3 className="text-lg font-black text-white mb-2 leading-tight">{item.title}</h3>
              <p className="text-gray-300 text-sm font-medium leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-center">
          <p className="text-gray-200 font-semibold">
            A web designer, an appointment setter, and a copywriter would cost
            <span className="text-white font-bold"> $8,000+/month</span> before you sell a thing.
          </p>
          <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
            With Kenji it's $375/month, and we only win when you do.
          </p>
        </div>
      </div>

      {/* Tool Replacement Bar */}
      <div className="hidden sm:block">
        <ToolReplacementBar />
      </div>

      <div className="max-w-7xl mx-auto mt-12 sm:mt-16">
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
              <p className="text-gray-400 text-sm">Test KenjiAI without committing to a year. Cancel anytime.</p>
            </div>

            <div className="mb-5 bg-blue-500/5 border border-blue-500/10 rounded-lg p-3">
              <div className="text-blue-400 text-sm font-semibold">10% performance fee on new revenue we generate</div>
              <div className="text-gray-500 text-xs mt-0.5">You only pay it after we make you money. No revenue, no fee.</div>
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
            <div className="text-center text-gray-500 text-xs mb-1">Secured by Stripe · 30-Day Guarantee</div>
            <a
              href="https://go.mediatraffics.com/leads"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-gray-400 hover:text-white text-xs underline underline-offset-2 mb-6"
            >
              Not sure yet? Book a free call instead
            </a>

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
                <p className="text-gray-400 text-sm">Lowest monthly cost. For owners ready to scale.</p>
              </div>
              <span className="bg-[#10A37F]/10 text-[#10A37F] text-xs font-bold px-2 py-1 rounded">Most Popular</span>
            </div>

            <div className="mb-5 bg-[#10A37F]/5 border border-[#10A37F]/10 rounded-lg p-3">
              <div className="text-[#10A37F] text-sm font-semibold">5% performance fee on new revenue we generate</div>
              <div className="text-gray-500 text-xs mt-0.5">Half the rate of monthly. Still $0 if we don't make you money.</div>
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
                <span className="flex items-center gap-2">Claim Spot for $270/mo ($3,240/yr)</span>
              )}
            </motion.button>
            <div className="text-center text-[#10A37F] font-semibold text-xs mb-1">You save $1,260/yr vs monthly</div>
            <a
              href="https://go.mediatraffics.com/leads"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-gray-400 hover:text-white text-xs underline underline-offset-2 mb-6"
            >
              Not sure yet? Book a free call instead
            </a>

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

          {/* Lifetime — Golden Member */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="relative bg-gradient-to-b from-amber-950/40 via-gray-900/70 to-gray-900/60 backdrop-blur-sm border-2 border-amber-500/60 hover:border-amber-400 hover:-translate-y-2 transition-all duration-500 rounded-2xl p-5 sm:p-6 flex flex-col order-3 lg:order-3"
            style={{ boxShadow: '0 0 45px rgba(245,158,11,0.18)' }}
          >
            {/* Golden ribbon */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-gray-950 px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-500/40 whitespace-nowrap">
                👑 Golden Member
              </div>
            </div>

            <div className="mb-4 mt-2 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-black bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent mb-1">Lifetime</h3>
                <p className="text-gray-300 text-sm">Pay once. Own KenjiAI forever. Then keep 100% of everything you make.</p>
              </div>
            </div>

            <div className="mb-3 bg-amber-500/10 border border-amber-500/40 rounded-lg p-3">
              <div className="text-amber-300 text-sm font-bold">Zero fees forever = the plan pays for itself</div>
              <div className="text-gray-300 text-xs mt-1 leading-relaxed">
                Annual members pay $3,240/yr plus a 5% success fee. Golden Members never pay
                either again, at $1M in tracked sales that's <span className="text-amber-300 font-bold">$50,000+ kept</span>, not counting the subscription you stopped paying.
              </div>
            </div>

            <div className="mb-5 bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
              <div className="text-gray-200 text-sm font-semibold">Custom one-time investment</div>
              <div className="text-gray-400 text-xs mt-0.5">Revealed on your discovery call. Limited to a handful of Golden Members per quarter.</div>
            </div>

            <a
              href="https://go.mediatraffics.com/leads"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-xl font-black text-base flex flex-col items-center justify-center transition-all duration-300 mb-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-gray-950 shadow-lg shadow-amber-500/30"
            >
              <span className="flex items-center gap-2">Apply for Golden Membership</span>
            </a>
            <div className="text-center text-amber-300/70 text-xs mb-6">By application only</div>

            <div className="flex-1">
              <div className="text-white text-sm font-semibold mb-3">Golden Member benefits:</div>
              <div className="space-y-1">
                {VIP_FEATURES.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-1.5 -mx-1.5 rounded-md hover:bg-amber-500/5 transition-colors group cursor-default">
                    <Check className="w-4 h-4 text-amber-400 group-hover:text-amber-300 transition-colors flex-shrink-0 mt-0.5" />
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
