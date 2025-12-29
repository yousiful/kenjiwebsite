import React from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Zap, Star, ArrowRight, Users, Brain, Globe, Calendar, DollarSign, Gift, AlertCircle, Shield, ExternalLink, RefreshCw } from 'lucide-react';
import { redirectToPaymentLink, STRIPE_PAYMENT_LINKS, validateCheckoutPrerequisites, prepareCheckoutData, testStripeIntegration } from '../lib/stripe';

const PricingSection: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState<string | null>(null);
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'yearly'>('monthly');
  const [hasEarnedDiscount, setHasEarnedDiscount] = React.useState(false);
  const [checkoutError, setCheckoutError] = React.useState<string | null>(null);

  // Check if user has earned the discount
  React.useEffect(() => {
    const earnedDiscount = localStorage.getItem('kenjiai-discount-earned');
    setHasEarnedDiscount(earnedDiscount === 'true');
    
    // Test Stripe integration in development
    if (process.env.NODE_ENV === 'development') {
      testStripeIntegration().then(result => {
        console.log('Stripe integration test:', result);
      });
    }
  }, []);

  const handleSubscribe = async (planType: 'monthly' | 'yearly', planName: string) => {
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
      
      // Enhanced error handling with specific messages
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

  const pricing = {
    monthly: {
      price: 377,
      discountedPrice: 339, // 10% off
      savings: null
    },
    yearly: {
      price: 3770, // $314.17/month when billed yearly
      discountedPrice: 3393, // 10% off yearly
      monthlyEquivalent: 314.17,
      discountedMonthlyEquivalent: 282.75, // 10% off monthly equivalent
      savings: "Save $754/year"
    }
  };

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
    "Priority Support & Training",
    "Unlimited AI Interactions",
    "Custom Domains & Branding"
  ];

  const featureCategories = [
    { 
      title: "AI Automation", 
      icon: Brain,
      features: ["Voice Agents", "Smart Workflows", "AI Training", "Chatbots"]
    },
    { 
      title: "Marketing Hub", 
      icon: Zap,
      features: ["Email/SMS Campaigns", "Social Media", "SEO Suite", "Analytics"]
    },
    { 
      title: "Business Platform", 
      icon: Users,
      features: ["CRM & Pipelines", "Payment Processing", "API Access", "Integrations"]
    },
    { 
      title: "Community & Learning", 
      icon: Globe,
      features: ["Community Builder", "Course Platform", "Memberships", "Certifications"]
    }
  ];

  return (
    <section id="pricing" className="py-16 bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error Display */}
        {checkoutError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-900/50 border border-red-500/50 rounded-2xl p-4 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-300 text-sm font-semibold mb-1">Payment Error</p>
              <p className="text-red-200 text-sm">{checkoutError}</p>
              <p className="text-red-400 text-xs mt-2">
                Need help? Contact us at <a href="mailto:care@kenjiai.com" className="underline hover:text-red-300">care@kenjiai.com</a> or <a href="tel:+18312634402" className="underline hover:text-red-300">(831) 263-4402</a>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.location.reload()}
                className="text-red-400 hover:text-red-300 transition-colors p-1"
                title="Refresh page"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCheckoutError(null)}
                className="text-red-400 hover:text-red-300 transition-colors text-lg leading-none"
                title="Close error"
              >
                ×
              </button>
            </div>
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
              <ExternalLink className="w-4 h-4" />
              Login to Dashboard
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Urgency Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <span className="animate-pulse">🚨</span>
              <span>PRICE INCREASING EVERY 15 DAYS - Lock in your rate now!</span>
              <span className="animate-pulse">🚨</span>
            </div>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            <span className="text-gradient-blue">
              One Platform, Infinite Possibilities
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-6">
            Everything you need to automate, scale, and dominate your market.
            No tiers, no limits—just complete business automation power.
          </p>
          
          {/* Value Proposition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 investor-gradient-green text-white border border-green-400/50 rounded-full px-6 py-3 mb-6 mobile-hover"
          >
            <Zap className="w-5 h-5" />
            <span className="font-semibold">Complete Business Automation Platform</span>
          </motion.div>

          {/* Enhanced Earned Discount Banner */}
          {hasEarnedDiscount && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 investor-gradient-gold text-white border border-yellow-400/50 rounded-full px-6 py-3 mb-6 mobile-hover sparkle-effect"
            >
              <Gift className="w-5 h-5 animate-bounce" />
              <span className="font-bold">🎉 You've Earned 10% OFF! Use code LUCKY at checkout</span>
            </motion.div>
          )}
          
          {/* Compact Feature Categories Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {featureCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gray-800/30 border border-gray-700 hover:border-blue-400/50 rounded-xl p-3 text-center mobile-hover investor-card-shadow touch-target"
                data-caption={`${category.title}: ${category.features.join(', ')}`}
              >
                <category.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <h4 className="text-white font-semibold text-sm mb-1">{category.title}</h4>
                <p className="text-gray-400 text-xs">{category.features.length} tools</p>
              </motion.div>
            ))}
          </div>

          {/* Compact Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-flex items-center bg-gray-800/50 border border-gray-700 rounded-2xl p-2 mb-8 mobile-hover"
          >
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 mobile-button ${
                billingCycle === 'monthly'
                  ? 'investor-gradient-blue text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 relative mobile-button ${
                billingCycle === 'yearly'
                  ? 'investor-gradient-blue text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </motion.div>
        </motion.div>

        {/* Compact Single Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative bg-gray-800/50 backdrop-blur-sm border border-purple-400/50 rounded-3xl p-6 shadow-2xl shadow-purple-500/20 investor-card-shadow">
            {/* Enhanced Popular Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="investor-gradient-purple text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 mobile-hover">
                <Crown className="w-4 h-4" />
                Complete Business Platform
              </div>
            </div>

            {/* Compact Pricing Header */}
            <div className="text-center mb-6 pt-4">
              <div className="inline-flex items-center justify-center w-16 h-16 investor-gradient-purple rounded-3xl mb-4 mobile-hover">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">KenjiAI Complete</h3>
              <p className="text-gray-400 mb-4">
                The ultimate AI-powered business automation platform
              </p>
              
              {/* Platform Access Banner */}
              <div className="investor-gradient-green border border-green-400/30 rounded-xl p-3 mb-4 mobile-hover">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Zap className="w-4 h-4" />
                  <span className="text-white font-bold">Instant Platform Access</span>
                </div>
                <div className="text-white text-sm">
                  Full features • Complete automation • Unlimited usage
                </div>
              </div>
              
              <div className="flex items-baseline justify-center mb-3">
                {billingCycle === 'yearly' ? (
                  <div className="text-center">
                    {hasEarnedDiscount ? (
                      <>
                        <div className="flex items-baseline justify-center gap-2">
                          <span className="text-3xl font-bold text-gray-500 line-through">${pricing.yearly.monthlyEquivalent}</span>
                          <span className="text-5xl font-bold text-green-400">${pricing.yearly.discountedMonthlyEquivalent}</span>
                          <span className="text-gray-400 ml-2">/month</span>
                        </div>
                        <div className="text-green-400 font-semibold text-sm mt-1">
                          Use code LUCKY for 10% OFF! 🎉
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-5xl font-bold text-white">${pricing.yearly.monthlyEquivalent}</span>
                        <span className="text-gray-400 ml-2">/month</span>
                      </>
                    )}
                    <div className="mt-2 text-yellow-400 font-bold text-xs flex items-center justify-center gap-2">
                      <span className="animate-pulse">⚠️</span>
                      Price increasing every 15 days
                      <span className="animate-pulse">⚠️</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    {hasEarnedDiscount ? (
                      <>
                        <div className="flex items-baseline justify-center gap-2">
                          <span className="text-3xl font-bold text-gray-500 line-through">${pricing.monthly.price}</span>
                          <span className="text-5xl font-bold text-green-400">${pricing.monthly.discountedPrice}</span>
                          <span className="text-gray-400 ml-2">/month</span>
                        </div>
                        <div className="text-green-400 font-semibold text-sm mt-1">
                          Use code LUCKY for 10% OFF! 🎉
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-5xl font-bold text-white">${pricing.monthly.price}</span>
                        <span className="text-gray-400 ml-2">/month</span>
                      </>
                    )}
                    <div className="mt-2 text-yellow-400 font-bold text-xs flex items-center justify-center gap-2">
                      <span className="animate-pulse">⚠️</span>
                      Price increasing every 15 days
                      <span className="animate-pulse">⚠️</span>
                    </div>
                  </div>
                )}
              </div>
              
              {billingCycle === 'yearly' && (
                <div className="text-center mb-4">
                  <div className="text-green-400 font-semibold mb-1">{pricing.yearly.savings}</div>
                  <div className="text-gray-400 text-sm">
                    Billed annually at ${hasEarnedDiscount ? pricing.yearly.discountedPrice : pricing.yearly.price}
                  </div>
                </div>
              )}
              
              <div className="investor-gradient-blue border border-blue-400/30 rounded-xl p-3 mb-4 mobile-hover">
                <div className="text-white font-semibold mb-1">🚀 Everything Included</div>
                <div className="text-white text-sm">
                  No limits, no restrictions, no hidden fees. Complete access to all features.
                </div>
              </div>
            </div>

            {/* Compact Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6 max-h-60 overflow-y-auto smooth-scroll">
              {allFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-center text-gray-300 mobile-hover text-sm">
                  <Check className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Enhanced CTA Button */}
            <motion.button
              onClick={() => handleSubscribe(billingCycle, `KenjiAI-${billingCycle}`)}
              disabled={isLoading === `KenjiAI-${billingCycle}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full investor-gradient-purple text-white py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mb-4 mobile-button focus-ring"
            >
              {isLoading === `KenjiAI-${billingCycle}` ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Preparing Checkout...</span>
                </>
              ) : (
                <>
                  Get Started Now
                  {hasEarnedDiscount && <span className="text-yellow-300">+ Use LUCKY</span>}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            {/* Compact Security & Guarantees */}
            <div className="grid grid-cols-2 gap-4 text-center mb-3">
              <div className="flex items-center justify-center text-green-400 text-sm mobile-hover">
                <Star className="w-4 h-4 mr-1" />
                Instant activation
              </div>
              <div className="flex items-center justify-center text-blue-400 text-sm mobile-hover">
                <Check className="w-4 h-4 mr-1" />
                Full platform access
              </div>
            </div>

            {/* Enhanced Security Badge */}
            <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
              <Shield className="w-4 h-4" />
              <span>Secured by Stripe • SSL Encrypted • PCI Compliant</span>
            </div>
          </div>
        </motion.div>

        {/* Compact Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-blue-900/30 to-green-900/30 border border-blue-400/30 rounded-3xl p-6 investor-card-shadow">
            <h3 className="text-2xl font-bold text-white mb-3">
              Why Choose One Platform Over Multiple Tools?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center mobile-hover">
                <div className="text-3xl font-bold text-red-400 mb-2">$2,000+</div>
                <div className="text-gray-400 text-sm">Cost of separate tools monthly</div>
              </div>
              <div className="text-center mobile-hover">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  ${hasEarnedDiscount 
                    ? (billingCycle === 'yearly' ? Math.round(pricing.yearly.discountedMonthlyEquivalent) : pricing.monthly.discountedPrice)
                    : (billingCycle === 'yearly' ? Math.round(pricing.yearly.monthlyEquivalent) : pricing.monthly.price)
                  }
                </div>
                <div className="text-gray-400 text-sm">KenjiAI complete platform</div>
              </div>
              <div className="text-center mobile-hover">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {hasEarnedDiscount ? '89%' : '85%'}
                </div>
                <div className="text-gray-400 text-sm">Savings vs buying separately</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Compact Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-8"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm mb-6">
            <div className="flex items-center gap-2 mobile-hover">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span>Secure Stripe Payments</span>
            </div>
            <div className="flex items-center gap-2 mobile-hover">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Instant Access</span>
            </div>
            <div className="flex items-center gap-2 mobile-hover">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2 mobile-hover">
              <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
              <span>No Setup Fees</span>
            </div>
          </div>
          
          <p className="text-gray-400 text-lg mb-3">
            Join 50,000+ businesses already using KenjiAI to automate and scale their operations
          </p>
          
          <p className="text-gray-500 text-sm">
            Need help? Contact us at <a href="mailto:care@kenjiai.com" className="text-blue-400 hover:text-blue-300 underline">care@kenjiai.com</a> or <a href="tel:+18312634402" className="text-blue-400 hover:text-blue-300 underline">(831) 263-4402</a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;