import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Rocket, TrendingUp, Crown, ShieldCheck, Wallet } from 'lucide-react';

const BOOKING_URL = 'https://go.mediatraffics.com/leads';

/**
 * Stripe Payment Link per tier. Each link charges the one-time setup fee and the
 * first month together, then bills the monthly price on a normal subscription.
 *
 * Until a link is filled in, that tier's button falls back to BOOKING_URL so the
 * page never sends anyone to a dead checkout.
 */
const CHECKOUT_URLS: Record<string, string | null> = {
  launch: null,
  growth: null,
  scale: null,
};

type Plan = {
  id: string;
  name: string;
  tagline: string;
  icon: React.ElementType;
  /** Setup + first month. What actually leaves their account today. */
  today: string;
  /** What they pay every month after that. */
  monthly: string;
  /** Minimum ad budget, paid by them straight to the platform. */
  adSpend: string;
  features: string[];
  featured?: boolean;
  accent: string;
  border: string;
  glow: string;
};

const PLANS: Plan[] = [
  {
    id: 'launch',
    name: 'Launch',
    tagline: 'Get your first campaign live and bringing in leads.',
    icon: Rocket,
    today: '$1,375',
    monthly: '$375',
    adSpend: '$1,000',
    accent: 'from-blue-500 to-cyan-500',
    border: 'border-blue-500/30',
    glow: 'rgba(59,130,246,0.15)',
    features: [
      'One platform, Facebook or Google',
      'We build, launch, and manage your campaigns',
      'Landing page built for you',
      'Follow-up that works your leads automatically',
      'Leads land straight in your CRM',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'You know the offer works. Now pour fuel on it.',
    icon: TrendingUp,
    today: '$2,697',
    monthly: '$1,197',
    adSpend: '$3,000',
    featured: true,
    accent: 'from-emerald-500 to-green-500',
    border: 'border-emerald-500/50',
    glow: 'rgba(16,185,129,0.22)',
    features: [
      'Everything in Launch',
      'Two platforms running at once',
      'New ad creative every month',
      'We test your copy, creative, and audiences',
      'Booked calls land on your calendar',
      'A strategy call every two weeks',
    ],
  },
  {
    id: 'scale',
    name: 'Scale',
    tagline: 'You are spending real money and want a partner, not a vendor.',
    icon: Crown,
    today: '$4,997',
    monthly: '$2,497',
    adSpend: '$10,000',
    accent: 'from-amber-500 to-orange-500',
    border: 'border-amber-500/30',
    glow: 'rgba(245,158,11,0.15)',
    features: [
      'Everything in Growth',
      'Every platform, any budget',
      'Your own growth strategist',
      'Weekly calls, not monthly check-ins',
      'Reporting built around your revenue',
      'Direct line to the founder',
    ],
  },
];

const PricingV2Page: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Done For You Ads Pricing | KenjiAI</title>
        <meta
          name="description"
          content="Done for you ad management from KenjiAI. We agree on a lead target before you pay. Miss it and you get your setup fee back."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen" style={{ backgroundColor: '#0B0E14' }}>
        <div className="pt-16">

          {/* Hero */}
          <section className="pt-16 pb-10 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 leading-tight">
                  We run your ads.
                  <br />
                  You run your business.
                </h1>

                <p className="text-xl text-gray-300 font-semibold leading-relaxed">
                  We agree on a lead target before you pay a dollar. If we miss it in 90 days,
                  you get your setup fee back and we keep working for free until we hit it.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Plans */}
          <section className="pb-14 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {PLANS.map((plan, idx) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className={`relative bg-gray-900/60 backdrop-blur-sm border ${plan.border} rounded-2xl p-8 flex flex-col ${
                      plan.featured ? 'lg:-mt-4 lg:mb-4' : ''
                    }`}
                    style={{ boxShadow: `0 0 32px ${plan.glow}` }}
                  >
                    {plan.featured && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-black uppercase tracking-wide px-4 py-1.5 rounded-full">
                          Most popular
                        </span>
                      </div>
                    )}

                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.accent} flex items-center justify-center mb-5`}
                    >
                      <plan.icon className="w-7 h-7 text-white" />
                    </div>

                    <h2 className="text-2xl font-black text-white mb-2">{plan.name}</h2>
                    <p className="text-gray-400 font-semibold text-sm leading-relaxed mb-6 min-h-[2.5rem]">
                      {plan.tagline}
                    </p>

                    {/* Price: exactly two numbers. */}
                    <div className="border-t border-b border-white/10 py-6 mb-5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-white">{plan.today}</span>
                        <span className="text-gray-400 font-bold text-lg">today</span>
                      </div>
                      <p className="text-gray-300 font-bold text-lg mt-2">
                        then {plan.monthly} a month
                      </p>
                    </div>

                    {/* Ad budget: the third number, clearly not ours. */}
                    <div className="flex items-start gap-2.5 bg-white/5 border border-white/10 rounded-xl p-3.5 mb-6">
                      <Wallet className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <p className="text-gray-300 font-semibold text-sm leading-snug">
                        <span className="text-white font-bold">
                          Ad budget: {plan.adSpend} a month.
                        </span>{' '}
                        You pay Facebook directly. We never touch it.
                      </p>
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                          <span className="text-gray-300 font-semibold text-sm leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={CHECKOUT_URLS[plan.id] ?? BOOKING_URL}
                      className={`w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r ${plan.accent} text-white font-black py-3.5 rounded-xl hover:opacity-90 transition-opacity`}
                    >
                      Get started
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* The guarantee */}
          <section className="pb-16 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-2xl p-8 sm:p-10"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    The setup fee is on us if we miss
                  </h2>
                </div>

                <div className="space-y-4 text-gray-300 font-semibold leading-relaxed">
                  <p>
                    Before you pay anything, we look at your numbers together and agree on how many
                    qualified leads you should get in 90 days. We write it down.
                  </p>
                  <p>
                    If we miss that number, you get your setup fee back and we keep running your ads
                    for free until we hit it.
                  </p>
                  <p className="text-white">
                    Ninety days, because that is honestly how long paid ads take. Month one the
                    algorithm is still learning who to show your ads to. Month three is where it
                    compounds. Anyone promising you results in week two is selling you something.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="pb-24 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
                  Not sure which one fits?
                </h2>
                <p className="text-lg text-gray-300 font-semibold mb-8 leading-relaxed">
                  Book a call. Tell us what you sell and what you can spend, and we will tell you
                  straight whether ads are the right move for you right now.
                </p>
                <a
                  href={BOOKING_URL}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-black text-lg px-8 py-4 rounded-xl hover:opacity-90 transition-opacity"
                >
                  Book your strategy call
                  <ArrowRight className="w-5 h-5" />
                </a>
              </motion.div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default PricingV2Page;
