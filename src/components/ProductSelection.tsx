import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Zap, Star, ArrowRight, Users, Brain, Globe, Calendar, DollarSign, Gift, AlertCircle, Shield, ExternalLink, LogIn, Headphones, Megaphone, Video, TrendingUp } from 'lucide-react';

const ProductSelection: React.FC = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  const handleSubscribe = async (url: string, planName: string) => {
    setIsLoading(planName);
    await new Promise(resolve => setTimeout(resolve, 500));
    window.location.href = url;
  };

  const plans = {
    monthly: {
      id: 'monthly',
      name: 'Performance Plan',
      performanceFee: '10% of ads generated revenue',
      period: 'month',
      popular: false,
      description: 'Website build, follow-up agents, ads and copy all included. Pay from results.',
      ctaUrl: 'https://freedom.kenjiai.com/checkout-4912-2457-3370'
    },
    yearly: {
      id: 'yearly',
      name: 'Annual Growth Plan',
      performanceFee: '6% on yearly revenue',
      period: 'year',
      popular: true,
      savings: 'Save 4% on performance fees',
      description: 'Everything in the stack, lower fees, and priority support for serious growth',
      ctaUrl: 'https://freedom.kenjiai.com/checkout-4912-2457-3370'
    }
  };

  const doneForYouServices = [
    {
      icon: Globe,
      title: "Proven Website, Built For You",
      worth: "Agencies charge $3,000+",
      description: "You don't start from a blank page. We install the same funnel and website layouts our winning clients already convert with, branded to your business, live in week one."
    },
    {
      icon: Headphones,
      title: "Proven Follow-Up Agents",
      worth: "A setter costs $3,000/mo",
      description: "AI agents that call, text, and email every lead within minutes, handle objections, and book appointments around the clock. Most leads die from slow follow-up. Yours won't."
    },
    {
      icon: Megaphone,
      title: "Ads + Copy That Already Work",
      worth: "A copywriter costs $2,000/mo",
      description: "We write your ads and pages from campaigns that have already produced sales in your niche, then manage and optimize them for you. No guessing, no testing on your dime."
    },
    {
      icon: Video,
      title: "Live Zoom Support",
      worth: "Included",
      description: "Real strategy and technical sessions with our team, not a ticket queue. We stay on it with you until the system produces."
    }
  ];

  const allFeatures = [
    "Unlimited AI Voice Agents",
    "Smart Workflows & Automation",
    "Advanced Email & SMS Campaigns",
    "Complete CRM with Custom Pipelines",
    "Community Builder & Management",
    "Course & Certification Platform",
    "Membership Management System",
    "AI Blog Writer & SEO Suite",
    "Social Media Planner & Scheduler",
    "Survey & Quiz Builder",
    "QR Code Generator & Tracking",
    "Affiliate Manager & Payouts",
    "AI Website & Funnel Builder",
    "Smart Chatbots & Live Chat",
    "Advanced Analytics & Reporting",
    "Payment Processing & Billing",
    "Review Management System",
    "API Access & Integrations",
    "White-label Options",
    "24/7 Priority Support",
    "Unlimited AI Interactions",
    "Custom Domains & Branding"
  ];

  const valueProps = [
    {
      icon: Brain,
      title: "AI-Powered Everything",
      description: "Voice agents, smart workflows, and intelligent automation that learns and improves"
    },
    {
      icon: TrendingUp,
      title: "Performance-Based Model",
      description: "Only pay based on your success - we grow when you grow"
    },
    {
      icon: Globe,
      title: "Scale Without Limits",
      description: "Unlimited users, interactions, and growth potential with enterprise-grade infrastructure"
    }
  ];

  return (
    <div className="py-24 bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Existing Customer Login Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 bg-gradient-to-r from-blue-900/50 to-green-900/50 border border-blue-400/30 rounded-2xl p-4"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-400" />
              <div>
                <h3 className="text-white font-semibold">Already a KenjiAI customer?</h3>
                <p className="text-gray-400 text-sm">Access your dashboard and manage your account</p>
              </div>
            </div>
            <motion.a
              href="https://app.kenjicrm.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Login to Dashboard
              <ExternalLink className="w-4 h-4" />
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Scarcity pill (closers-style: spots, not events) */}
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/50 bg-orange-500/10 px-5 py-2 mb-8">
            <span aria-hidden="true">🔥</span>
            <span className="text-orange-300 text-sm font-bold tracking-wide">
              Only 12 onboarding spots left this month. Enrollment closes soon.
            </span>
          </div>

          <h2 className="text-5xl sm:text-6xl font-bold mb-4 leading-tight">
            <span className="text-white">Spots Are Filling Fast.</span>
            <br />
            <span className="bg-gradient-to-r from-green-400 via-blue-400 to-green-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              Get Clients On Pure Performance
            </span>
          </h2>
          <p className="text-2xl text-gray-200 font-semibold mb-4">Before This Month's Onboarding Closes</p>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
            The only growth plan where we build your ads, run them, and support you on Zoom,
            and you pay from <span className="text-green-400 font-bold">results</span>, not retainers.
          </p>

          {/* Checkmark pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {[
              'We build and launch in week one',
              'You pay from results, not promises',
              '1,000+ clients onboarded',
              '100% done for you',
            ].map((pill) => (
              <span
                key={pill}
                className="inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-500/10 px-4 py-1.5 text-sm text-gray-200"
              >
                <Check className="w-4 h-4 text-green-400" />
                {pill}
              </span>
            ))}
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
            {[
              { icon: DollarSign, stat: '$50M+', label: 'Client revenue generated' },
              { icon: Users, stat: '1,000+', label: 'Businesses onboarded' },
              { icon: Zap, stat: '17+', label: 'Tools replaced by Kenji' },
            ].map(({ icon: Icon, stat, label }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-gray-800/60 backdrop-blur-sm p-5 text-center"
              >
                <Icon className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-3xl font-extrabold text-white">{stat}</div>
                <div className="text-gray-400 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Primary CTA (closers-style gradient) */}
          <motion.a
            href="#plans"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-950 px-10 py-5 rounded-2xl font-extrabold text-lg shadow-lg shadow-orange-500/30 transition-all duration-300"
          >
            Claim My Spot Before It's Gone
            <ArrowRight className="w-6 h-6" />
          </motion.a>
          <p className="text-gray-400 text-sm mt-4">
            <span className="text-orange-400 font-semibold">38 of 50 spots claimed.</span> Next onboarding wave starts soon.
          </p>
        </motion.div>

        {/* Done-For-You Services */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-center mb-3">
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              What Your Plan Actually Buys You
            </span>
          </h3>
          <p className="text-center text-gray-300 mb-8 max-w-2xl mx-auto">
            Hiring this out piece by piece runs <span className="text-white font-bold">$8,000+ every month</span>.
            Your plan includes all of it.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {doneForYouServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="bg-gradient-to-br from-blue-900/30 to-green-900/30 border border-blue-400/30 rounded-2xl p-6"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-green-500">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-bold px-3 py-1 whitespace-nowrap">
                    {service.worth}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{service.title}</h4>
                <p className="text-gray-300 text-sm">{service.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Price anchor strip */}
          <div className="max-w-3xl mx-auto mt-8 rounded-2xl border border-green-400/40 bg-green-500/10 p-6 text-center">
            <p className="text-gray-200 text-lg">
              A web designer, an appointment setter, a copywriter, and an ads manager would cost you
              <span className="text-white font-bold"> $8,000+/month</span> before you sell a thing.
            </p>
            <p className="text-2xl font-extrabold text-green-400 mt-2">
              With Kenji it's $375/month, and we only win when you do.
            </p>
          </div>
        </motion.div>

        {/* Value Propositions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {valueProps.map((prop, index) => (
            <motion.div
              key={prop.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="text-center"
            >
              <prop.icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{prop.title}</h3>
              <p className="text-gray-400 text-sm">{prop.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Plan Selection */}
        <div id="plans" className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16 scroll-mt-24">
          {Object.values(plans).map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 + index * 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`relative bg-gray-800/50 backdrop-blur-sm border rounded-3xl p-8 transition-all duration-500 cursor-pointer ${
                plan.popular
                  ? 'border-green-400/50 shadow-2xl shadow-green-500/20'
                  : 'border-gray-700 hover:border-blue-400/50'
              } ${
                selectedPlan === plan.id ? 'ring-2 ring-green-400' : ''
              }`}
              onClick={() => setSelectedPlan(plan.id as 'monthly' | 'yearly')}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Best Value
                  </div>
                </div>
              )}

              <div className="text-center mb-8 pt-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-green-500 to-blue-600'
                    : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                }`}>
                  {plan.id === 'yearly' ? <Calendar className="w-8 h-8 text-white" /> : <Zap className="w-8 h-8 text-white" />}
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-300 text-sm mb-6">{plan.description}</p>

                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-xl p-4 mb-4">
                  <div className="text-3xl font-bold text-white mb-2">
                    {plan.performanceFee}
                  </div>
                  <p className="text-gray-300 text-sm">Pay only when you earn</p>
                </div>

                {plan.savings && (
                  <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl text-sm font-semibold mb-4">
                    {plan.savings}
                  </div>
                )}
              </div>

              <div className="text-center mb-6">
                <div className={`w-6 h-6 rounded-full border-2 mx-auto transition-all duration-300 ${
                  selectedPlan === plan.id
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-400'
                }`}>
                  {selectedPlan === plan.id && (
                    <Check className="w-4 h-4 text-white m-0.5" />
                  )}
                </div>
              </div>

              <div className={`border rounded-xl p-4 ${
                plan.popular
                  ? 'bg-green-500/10 border-green-400/30'
                  : 'bg-blue-500/10 border-blue-400/30'
              }`}>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-white font-semibold">
                    {plan.id === 'yearly' ? 'Lower fees + Full support' : 'Flexible performance-based'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* VIP Demo Offer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm border border-purple-400/50 rounded-3xl p-8 shadow-2xl shadow-purple-500/20">
            <div className="text-center">
              <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white mb-4">
                VIP Demo Call - Exclusive One-Time Offer
              </h3>
              <p className="text-xl text-gray-300 mb-6">
                Book a personal demo call and get:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-purple-500/20 border border-purple-400/30 rounded-xl p-4">
                  <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">NO Performance Fee</p>
                  <p className="text-gray-300 text-sm">Zero commission on revenue</p>
                </div>
                <div className="bg-purple-500/20 border border-purple-400/30 rounded-xl p-4">
                  <Globe className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">Lifetime Access</p>
                  <p className="text-gray-300 text-sm">To KenjiAI.com platform</p>
                </div>
              </div>
              <motion.a
                href="https://go.mediatraffics.com/leads"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
              >
                <Video className="w-6 h-6" />
                VIP Demo
                <ArrowRight className="w-6 h-6" />
              </motion.a>
              <p className="text-gray-400 text-sm mt-4">
                Limited slots available - First come, first served
              </p>
            </div>
          </div>
        </motion.div>

        {/* Selected Plan Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Everything Included in Your Plan
            </h3>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
              {allFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-center text-gray-300">
                  <Check className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {/* Plan Summary */}
            <div className="bg-gradient-to-r from-blue-900/30 to-green-900/30 border border-green-400/30 rounded-2xl p-6 mb-8">
              <div className="text-center">
                <h4 className="text-xl font-bold text-white mb-2">
                  Selected: {plans[selectedPlan].name}
                </h4>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {plans[selectedPlan].performanceFee}
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  {plans[selectedPlan].description}
                </p>
                {selectedPlan === 'yearly' && plans.yearly.savings && (
                  <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl text-sm font-semibold inline-block">
                    {plans.yearly.savings}
                  </div>
                )}
              </div>
            </div>

            {/* CTA Button */}
            <motion.a
              href={plans[selectedPlan].ctaUrl}
              onClick={() => handleSubscribe(plans[selectedPlan].ctaUrl, `KenjiAI-${selectedPlan}`)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="block w-full bg-gradient-to-r from-green-600 to-blue-500 text-white py-6 rounded-2xl font-bold text-xl transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 text-center"
            >
              {isLoading === `KenjiAI-${selectedPlan}` ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Redirecting...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  Get Started with {plans[selectedPlan].name}
                  <ArrowRight className="w-6 h-6" />
                </span>
              )}
            </motion.a>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-4 text-center mt-6">
              <div className="flex items-center justify-center text-green-400 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                Performance-based pricing
              </div>
              <div className="flex items-center justify-center text-blue-400 text-sm">
                <Check className="w-4 h-4 mr-1" />
                Full done-for-you service
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-gray-400 text-xs mt-4">
              <Shield className="w-4 h-4" />
              <span>Secured Payment Processing • SSL Encrypted</span>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="text-center">
            <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400 text-sm mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span>Secure Stripe Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Instant Access</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
                <span>No Setup Fees</span>
              </div>
            </div>
            
            <p className="text-gray-400 mb-4">
              Join 50,000+ businesses already using KenjiAI to automate and scale their operations
            </p>
            
            <p className="text-gray-500 text-sm">
              Need help? Contact us at <a href="mailto:care@kenjiai.com" className="text-blue-400 hover:text-blue-300 underline">care@kenjiai.com</a> or <a href="tel:+18312634402" className="text-blue-400 hover:text-blue-300 underline">(831) 263-4402</a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductSelection;