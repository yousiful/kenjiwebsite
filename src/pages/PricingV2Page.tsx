import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Rocket, TrendingUp, Crown, Clock, Wallet, ShieldCheck } from 'lucide-react';

const BOOKING_URL = 'https://go.mediatraffics.com/leads';

/**
 * Stripe Payment Link per tier. Each link should charge the one-time setup fee
 * and the recurring monthly price together on the first invoice.
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
  setup: string;
  monthly: string;
  monthlyNote?: string;
  /** What Stripe actually charges every 3 months. */
  quarterly: string;
  /** Setup + first quarter, i.e. what leaves their account on day one. */
  firstPayment: string;
  adSpend: string;
  features: string[];
  featured?: boolean;
  accent: string;
  border: string;
  glow: string;
  cta: string;
};

const PLANS: Plan[] = [
  {
    id: 'launch',
    name: 'Launch',
    tagline: 'The performance plan. Get your first campaign live and producing leads.',
    icon: Rocket,
    setup: '$1,000',
    monthly: '$375',
    quarterly: '$1,125',
    firstPayment: '$2,125',
    adSpend: '$1,000/mo minimum',
    accent: 'from-blue-500 to-cyan-500',
    border: 'border-blue-500/30',
    glow: 'rgba(59,130,246,0.15)',
    cta: 'Book your strategy call',
    features: [
      'One platform, Facebook or Google, your choice',
      'We build, launch, and manage the campaigns for you',
      'Landing page built and hosted for you',
      'KenjiAI follow-up workflows so leads get worked automatically',
      'Leads flow straight into your CRM, no manual exports',
      'Monthly performance report you can actually read',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'For businesses that have proven the offer and want to pour fuel on it.',
    icon: TrendingUp,
    setup: '$1,500',
    monthly: '$1,197',
    quarterly: '$3,591',
    firstPayment: '$5,091',
    adSpend: '$3,000/mo minimum',
    featured: true,
    accent: 'from-emerald-500 to-green-500',
    border: 'border-emerald-500/50',
    glow: 'rgba(16,185,129,0.22)',
    cta: 'Book your strategy call',
    features: [
      'Everything in Launch',
      'Two platforms running side by side',
      'Fresh ad creative produced for you every month',
      'Split testing on copy, creative, and audiences',
      'Appointment setter integration so booked calls hit your calendar',
      'Strategy call every two weeks with your campaign manager',
      'Qualified leads guarantee, or your next month is free',
    ],
  },
  {
    id: 'scale',
    name: 'Scale',
    tagline: 'For established operators spending real money who want a partner, not a vendor.',
    icon: Crown,
    setup: '$2,500',
    monthly: '$2,497',
    monthlyNote: 'or 10% of ad spend, whichever is greater',
    quarterly: '$7,491',
    firstPayment: '$9,991',
    adSpend: '$10,000/mo minimum',
    accent: 'from-amber-500 to-orange-500',
    border: 'border-amber-500/30',
    glow: 'rgba(245,158,11,0.15)',
    cta: 'Book your strategy call',
    features: [
      'Everything in Growth',
      'Unlimited platforms and unlimited ad spend',
      'A dedicated growth strategist assigned to your account',
      'Weekly calls, not monthly check-ins',
      'Custom reporting dashboard built for how you actually track revenue',
      'Direct line to the founding team',
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
          content="Done for you ad management from KenjiAI. Launch, Growth, and Scale plans with a 90 day initial term."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen" style={{ backgroundColor: '#0B0E14' }}>
        <div className="pt-16">

          {/* Hero */}
          <section className="pt-16 pb-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-6">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 font-bold text-sm">Every plan is billed 90 days at a time</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 leading-tight">
                  We run your ads.
                  <br />
                  You run your business.
                </h1>

                <p className="text-xl text-gray-300 font-semibold max-w-2xl mx-auto leading-relaxed">
                  Pick the plan that matches what you are ready to spend. We build the campaigns,
                  write the creative, and send the leads straight to your CRM.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Plans */}
          <section className="pb-16 px-4 sm:px-6">
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
                    <p className="text-gray-400 font-semibold text-sm leading-relaxed mb-6 min-h-[3rem]">
                      {plan.tagline}
                    </p>

                    {/* Price block */}
                    <div className="border-t border-b border-white/10 py-5 mb-6">
                      <div className="flex items-baseline gap-1.5 mb-1">
                        <span className="text-4xl font-black text-white">{plan.monthly}</span>
                        <span className="text-gray-400 font-bold">/mo</span>
                      </div>
                      {plan.monthlyNote && (
                        <p className="text-gray-500 font-semibold text-xs mb-2">{plan.monthlyNote}</p>
                      )}
                      <p className="text-gray-300 font-bold text-sm mb-3">
                        Billed quarterly at {plan.quarterly}, plus a {plan.setup} one time setup.
                      </p>
                      <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                        <p className="text-white font-black text-sm">
                          Day one: {plan.firstPayment}
                        </p>
                        <p className="text-gray-500 font-semibold text-xs">
                          Setup plus your first 90 days. Nothing else until the quarter renews.
                        </p>
                      </div>
                    </div>

                    {/* Ad spend requirement */}
                    <div className="flex items-start gap-2.5 bg-white/5 border border-white/10 rounded-xl p-3.5 mb-6">
                      <Wallet className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-white font-bold text-sm leading-snug">
                          Ad spend: {plan.adSpend}
                        </p>
                        <p className="text-gray-500 font-semibold text-xs leading-snug mt-0.5">
                          Paid directly to Facebook or Google from your own account. Not billed by us.
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                          <span className="text-gray-300 font-semibold text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={CHECKOUT_URLS[plan.id] ?? BOOKING_URL}
                      className={`w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r ${plan.accent} text-white font-black py-3.5 rounded-xl hover:opacity-90 transition-opacity`}
                    >
                      {CHECKOUT_URLS[plan.id] ? `Get started with ${plan.name}` : plan.cta}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </motion.div>
                ))}
              </div>

              {/* Annual */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="mt-8 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-white/10 rounded-2xl p-6 text-center"
              >
                <p className="text-white font-black text-lg mb-1">
                  Pay for the year, get two months free.
                </p>
                <p className="text-gray-400 font-semibold text-sm">
                  Any plan, paid annually: you pay ten months and get twelve. Ask about it on your call.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Why 90 days */}
          <section className="pb-20 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="bg-gray-900/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8 sm:p-10"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">Why we ask for 90 days</h2>
                </div>

                <div className="space-y-4 text-gray-300 font-semibold leading-relaxed">
                  <p>
                    Because that is how long it honestly takes. Paid ads need real data before the
                    algorithm knows who to show them to. Month one is learning. Month two is testing.
                    Month three is where it usually starts to compound.
                  </p>
                  <p>
                    We used to sell this month to month, and we watched people quit in week five,
                    right before the thing they paid for started working. That was not good for them
                    and it was not good for us.
                  </p>
                  <p>
                    So now we bill 90 days at a time. You pay for a quarter, we run your ads for a
                    quarter, and you can cancel any time before the next one renews. If we are not
                    willing to commit to the window that makes ads work, we should not be taking your
                    money.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="pb-24 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
                  Not sure which one fits?
                </h2>
                <p className="text-lg text-gray-300 font-semibold mb-8 max-w-xl mx-auto leading-relaxed">
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
