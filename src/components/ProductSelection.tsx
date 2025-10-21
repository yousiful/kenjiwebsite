import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Crown, Zap, Star, ArrowRight, Users, Brain, Globe, Calendar, DollarSign, Shield, AlertCircle, ExternalLink, LogIn } from 'lucide-react';
import { redirectToPaymentLink, STRIPE_PAYMENT_LINKS, validateCheckoutPrerequisites, prepareCheckoutData } from '../lib/stripe';

const ProductSelection: React.FC = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'onetime'>('yearly');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleSubscribe = async (planType: 'monthly' | 'yearly' | 'onetime', planName: string) => {
    try {
      // Clear any previous errors
      setCheckoutError(null);
      setIsLoading(planName);
      
      // Validate prerequisites
      validateCheckoutPrerequisites();
      
      // Prepare checkout data
      const checkoutData = prepareCheckoutData(planType);
      console.log('Starting payment redirect for:', planName, 'with data:', checkoutData);
      
      // Add small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await redirectToPaymentLink(planType);
    } catch (error) {
      console.error('Payment error:', error);
      
      let errorMessage = 'Payment failed. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('not found') || error.message.includes('not available')) {
          errorMessage = 'Payment option not available. Please contact support at care@kenjiai.com';
        } else if (error.message.includes('network') || error.message.includes('connection')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (error.message.includes('browser')) {
          errorMessage = 'Your browser does not support modern payment features. Please update your browser or try a different one.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setCheckoutError(errorMessage);
      
      // Auto-clear error after 10 seconds
      setTimeout(() => {
        setCheckoutError(null);
      }, 10000);
    } finally {
      setIsLoading(null);
    }
  };

  const plans = {
    monthly: {
      id: 'monthly',
      name: 'Monthly Plan',
      price: 275,
      period: 'month',
      popular: true,
      savings: null,
      description: 'Perfect for getting started with complete business automation',
      revenueShare: '+ 10% performance-based revenue share'
    },
    yearly: {
      id: 'yearly',
      name: 'Yearly Plan',
      price: 2600,
      monthlyEquivalent: 216.67,
      period: 'year',
      popular: false,
      savings: 'Save $700/year',
      description: 'Best value - save 21% when you pay annually',
      revenueShare: '+ 6% annual revenue share'
    }
  };

  const allFeatures = [
    "Done-For-You Setup & Team Training",
    "Done-For-You Ads to Fill Your CRM",
    "Done-For-You Support & Management",
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
    "Priority Support & Training",
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
      icon: Users,
      title: "Complete Business Hub",
      description: "CRM, communities, courses, memberships, and affiliate management in one platform"
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
        {/* Error Display */}
        {checkoutError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-red-900/50 border border-red-500/50 rounded-2xl p-4 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-300 text-sm">{checkoutError}</p>
              <p className="text-red-400 text-xs mt-1">
                Need help? Contact us at <a href="mailto:care@kenjiai.com" className="underline">care@kenjiai.com</a> or <a href="tel:+18312634402" className="underline">(831) 263-4402</a>
              </p>
            </div>
            <button
              onClick={() => setCheckoutError(null)}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              ×
            </button>
          </motion.div>
        )}

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
          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Choose Your Plan
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-4xl mx-auto mb-8">
            One platform with everything you need. No tiers, no limits—just complete business automation power.
          </p>
          
          {/* Money-Back Guarantee Highlight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-full px-6 py-3 mb-8"
          >
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-semibold">💯 30-Day Risk-Free Money-Back Guarantee</span>
          </motion.div>
        </motion.div>

        {/* Done-For-You Services Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-r from-orange-900/40 to-red-900/40 border-2 border-orange-400/50 rounded-3xl p-8 mb-16 max-w-5xl mx-auto"
        >
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold text-white mb-3">
              🎁 <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Done-For-You Services Included FREE
              </span>
            </h3>
            <p className="text-xl text-gray-300">Everything set up and managed for you - no tech skills required!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 border border-orange-400/30 rounded-2xl p-6 text-center">
              <div className="text-5xl mb-3">🚀</div>
              <h4 className="text-xl font-bold text-white mb-2">Done-For-You Setup</h4>
              <p className="text-gray-400">Complete platform setup + team training for instant success</p>
            </div>
            <div className="bg-gray-800/50 border border-orange-400/30 rounded-2xl p-6 text-center">
              <div className="text-5xl mb-3">📢</div>
              <h4 className="text-xl font-bold text-white mb-2">Done-For-You Ads</h4>
              <p className="text-gray-400">We create and run ads to fill your CRM with new clients</p>
            </div>
            <div className="bg-gray-800/50 border border-orange-400/30 rounded-2xl p-6 text-center">
              <div className="text-5xl mb-3">🛟</div>
              <h4 className="text-xl font-bold text-white mb-2">Done-For-You Support</h4>
              <p className="text-gray-400">White-glove support managing everything for you 24/7</p>
            </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {Object.values(plans).map((plan, index) => {
            const CardWrapper = plan.link ? Link : 'div';
            const cardProps = plan.link ? { to: plan.link } : { onClick: () => setSelectedPlan(plan.id as 'monthly' | 'yearly' | 'onetime') };

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.2 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="relative"
              >
                <CardWrapper
                  {...cardProps}
                  className={`block relative bg-gray-800/50 backdrop-blur-sm border rounded-3xl p-8 transition-all duration-500 cursor-pointer ${
                    plan.popular
                      ? 'border-purple-400/50 shadow-2xl shadow-purple-500/20'
                      : 'border-gray-700 hover:border-blue-400/50'
                  } ${
                    selectedPlan === plan.id && !plan.link ? 'ring-2 ring-blue-400' : ''
                  }`}
                >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8 pt-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-purple-500 to-pink-600'
                    : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                }`}>
                  {plan.id === 'onetime' ? <Crown className="w-8 h-8 text-white" /> : plan.id === 'yearly' ? <Calendar className="w-8 h-8 text-white" /> : <Zap className="w-8 h-8 text-white" />}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                
                {/* Money-Back Guarantee Banner */}
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-xl p-3 mb-4">
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-semibold text-sm">30-Day Money-Back Guarantee</span>
                  </div>
                </div>
                
                <div className="flex items-baseline justify-center mb-4">
                  {plan.id === 'yearly' ? (
                    <>
                      <span className="text-5xl font-bold text-white">${plan.monthlyEquivalent}</span>
                      <span className="text-gray-400 ml-2">/month</span>
                    </>
                  ) : (
                    <>
                      <span className="text-5xl font-bold text-white">${plan.price}</span>
                      <span className="text-gray-400 ml-2">/{plan.period}</span>
                    </>
                  )}
                </div>
                
                {plan.savings && (
                  <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl text-sm font-semibold mb-4">
                    {plan.savings}
                  </div>
                )}

                {plan.id === 'yearly' && (
                  <div className="text-gray-400 text-sm mb-4">
                    Billed annually at ${plan.price}
                  </div>
                )}

                {plan.revenueShare && (
                  <div className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-xl text-sm font-semibold mb-4 border border-blue-400/30">
                    {plan.revenueShare}
                  </div>
                )}
              </div>

              {/* Selection Indicator */}
              {!plan.link && (
                <div className="text-center mb-6">
                  <div className={`w-6 h-6 rounded-full border-2 mx-auto transition-all duration-300 ${
                    selectedPlan === plan.id
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-gray-400'
                  }`}>
                    {selectedPlan === plan.id && (
                      <Check className="w-4 h-4 text-white m-0.5" />
                    )}
                  </div>
                </div>
              )}

              {/* Value Highlight */}
              <div className={`border rounded-xl p-4 mb-6 ${
                plan.popular
                  ? 'bg-purple-500/10 border-purple-400/30'
                  : 'bg-blue-500/10 border-blue-400/30'
              }`}>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-white font-semibold">
                    {plan.id === 'onetime' ? 'Pay Once, Own Forever' : plan.id === 'yearly' ? 'Best Value - 2 Months Free' : 'Flexible Monthly Billing'}
                  </span>
                </div>
              </div>

              {/* Link indicator for one-time plan */}
              {plan.link && (
                <div className="text-center mt-4">
                  <div className="inline-flex items-center gap-2 text-blue-400 font-semibold">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              )}
            </CardWrapper>
          </motion.div>
            );
          })}
        </div>

        {/* Selected Plan Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
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
            <div className="bg-gradient-to-r from-blue-900/30 to-green-900/30 border border-blue-400/30 rounded-2xl p-6 mb-8">
              <div className="text-center">
                <h4 className="text-xl font-bold text-white mb-2">
                  Selected: {plans[selectedPlan].name}
                </h4>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-3xl font-bold text-blue-400">
                    ${selectedPlan === 'yearly' ? plans.yearly.monthlyEquivalent : plans.monthly.price}
                    <span className="text-lg text-gray-400">
                      /{selectedPlan === 'yearly' ? 'month' : 'month'}
                    </span>
                  </div>
                  {selectedPlan === 'yearly' && (
                    <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg text-sm font-semibold">
                      {plans.yearly.savings}
                    </div>
                  )}
                </div>
                {selectedPlan === 'yearly' && (
                  <p className="text-gray-400 text-sm">
                    Billed annually at ${plans.yearly.price}
                  </p>
                )}
                <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl text-sm font-semibold mt-4 inline-block">
                  💯 30-Day Money-Back Guarantee
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <motion.button
              onClick={() => handleSubscribe(selectedPlan, `KenjiAI-${selectedPlan}`)}
              disabled={isLoading === `KenjiAI-${selectedPlan}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-6 rounded-2xl font-bold text-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading === `KenjiAI-${selectedPlan}` ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Preparing Checkout...</span>
                </>
              ) : (
                <>
                  Get Started Risk-Free
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </motion.button>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-4 text-center mt-6">
              <div className="flex items-center justify-center text-green-400 text-sm">
                <Star className="w-4 h-4 mr-1" />
                30-day money-back guarantee
              </div>
              <div className="flex items-center justify-center text-blue-400 text-sm">
                <Check className="w-4 h-4 mr-1" />
                Cancel anytime
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-gray-400 text-xs mt-4">
              <Shield className="w-4 h-4" />
              <span>Secured by Stripe • SSL Encrypted • PCI Compliant</span>
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