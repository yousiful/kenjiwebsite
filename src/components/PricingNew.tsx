import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { ExitIntentPopup } from './ExitIntentPopup';
import { SlashPrice } from './SlashPrice';

const CHECKOUT_URL = 'https://freedom.kenjiai.com/finishhere';
const CALL_URL = 'https://go.mediatraffics.com/leads';

// Yousif, 2026-10-03: plans include only these three deliverables. AI call center and closer placement are paid add-ons.
const MONTHLY_FEATURES = [
  'Paid ads set up and launched for you (setup only, no ongoing management)',
  'Done-for-you funnel',
  'Done-for-you workflows inside your CRM',
];

const YEARLY_FEATURES = [
  ...MONTHLY_FEATURES,
  'Half the performance fee (5% vs 10%)',
];

const VIP_FEATURES = [
  'Everything in Annual, paid once',
  'Zero performance fee, forever',
  'We migrate your current tools for you',
];

function FeatureList({ items, checkClass }: { items: string[]; checkClass: string }) {
  return (
    <ul className="space-y-2.5">
      {items.map((f) => (
        <li key={f} className="flex items-start gap-2.5">
          <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${checkClass}`} />
          <span className="text-gray-300 text-sm leading-snug">{f}</span>
        </li>
      ))}
    </ul>
  );
}

export function PricingNew() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handlePlanClick = (planName: string) => {
    setIsLoading(planName);
    window.location.href = CHECKOUT_URL;
  };

  const planButton = (planName: string, label: string) => (
    <button
      onClick={() => handlePlanClick(planName)}
      disabled={isLoading === planName}
      className="w-full py-3.5 rounded-xl font-bold text-base bg-[#10A37F] text-white hover:bg-[#0E906F] transition-colors disabled:opacity-80 disabled:cursor-wait"
    >
      {isLoading === planName ? 'Redirecting...' : label}
    </button>
  );

  return (
    <div className="py-16 sm:py-20 px-4" style={{ backgroundColor: '#0B0E14' }}>
      {/* Header + holiday offer. Yousif, 2026-10-03: $297/mo and $249.90/mo yearly, ends after the next 6 onboardings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto text-center mb-12 sm:mb-14"
      >
        <div className="inline-flex items-center gap-2 bg-red-500/15 border border-red-500/40 rounded-full px-4 py-1.5 mb-6">
          <span className="text-red-300 font-bold text-xs sm:text-sm uppercase tracking-widest">🎄 Holiday Season Discount</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-5">
          Simple pricing. <span className="text-emerald-400">Done for you.</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-300">
          Holiday pricing ends after the next <span className="text-amber-300 font-bold">6 onboardings</span>.
        </p>
      </motion.div>

      {/* Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto lg:px-4">

        {/* Annual */}
        <div className="relative bg-gray-900/60 border-2 border-[#10A37F] rounded-2xl p-6 sm:p-7 flex flex-col">
          <span className="absolute -top-3 left-6 bg-[#10A37F] text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>
          <h3 className="text-xl font-bold text-white mb-1">Annual</h3>
          <p className="text-gray-400 text-sm mb-5">Lowest monthly cost.</p>
          <div className="mb-1"><SlashPrice from={270} to={249.9} accentClass="text-[#10A37F]" /></div>
          <p className="text-gray-500 text-xs mb-6">Billed $2,998.80/yr · save $565.20 · 5% fee only on new revenue we generate</p>
          {planButton('yearly', 'Get Started')}
          <div className="mt-6 flex-1"><FeatureList items={YEARLY_FEATURES} checkClass="text-[#10A37F]" /></div>
        </div>

        {/* Monthly */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 sm:p-7 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-1">Monthly</h3>
          <p className="text-gray-400 text-sm mb-5">Cancel anytime.</p>
          <div className="mb-1"><SlashPrice from={375} to={297} accentClass="text-white" /></div>
          <p className="text-gray-500 text-xs mb-6">10% fee only on new revenue we generate</p>
          {planButton('monthly', 'Get Started')}
          <div className="mt-6 flex-1"><FeatureList items={MONTHLY_FEATURES} checkClass="text-gray-400" /></div>
        </div>

        {/* Lifetime */}
        <div className="bg-gray-900/60 border border-amber-500/50 rounded-2xl p-6 sm:p-7 flex flex-col">
          <h3 className="text-xl font-bold text-amber-300 mb-1">👑 Lifetime</h3>
          <p className="text-gray-400 text-sm mb-5">Pay once. Keep 100% of every sale.</p>
          <div className="text-3xl font-black text-white mb-1">Custom</div>
          <p className="text-gray-500 text-xs mb-6">By application, revealed on your call</p>
          <a
            href={CALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-xl font-bold text-base text-center bg-amber-500 hover:bg-amber-400 text-gray-950 transition-colors"
          >
            Apply
          </a>
          <div className="mt-6 flex-1"><FeatureList items={VIP_FEATURES} checkClass="text-amber-400" /></div>
        </div>
      </div>

      {/* Add-ons + call, one quiet line each */}
      <div className="max-w-3xl mx-auto mt-10 text-center space-y-3">
        <p className="text-gray-400 text-sm">
          <span className="text-white font-semibold">Add-ons:</span> AI Agent Call Center · Closer Placement. Ask on your onboarding call.
        </p>
        <p className="text-gray-400 text-sm">
          Not sure yet?{' '}
          <a href={CALL_URL} target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-2 hover:text-emerald-400">
            Book a free call
          </a>
        </p>
      </div>

      <ExitIntentPopup />
    </div>
  );
}
