import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, ArrowRight, Calendar, Zap, Shield, CreditCard, TrendingUp, Target, Rocket } from 'lucide-react';
import { ToolReplacementBar } from './ToolReplacementBar';

export function PricingNew() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handlePlanClick = async (url: string, planName: string) => {
    setIsLoading(planName);
    await new Promise(resolve => setTimeout(resolve, 500));
    window.location.href = url;
  };

  const monthlyFeatures = [
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
    "$25 Monthly Credit",
    "Daily Sales Training",
    "Standard Referral Program",
  ];

  const yearlyFeatures = [
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
    "$25 Monthly Credit ($300/Year Value)",
    "Daily Sales Training",
    "Premium Referral Program Access",
  ];

  const vipFeatures = [
    "Personal demo with Kenji expert",
    "See $500K+ success strategies",
    "Custom growth plan for your business",
    "Exclusive insider tips & secrets",
    "Priority onboarding & support",
  ];

  return (
    <div className="py-24 px-4" style={{backgroundColor: '#0B0E14'}}>
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto mb-16 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/40 rounded-full px-6 py-3 mb-6">
            <Rocket className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-semibold">One-of-a-Kind Growth Program</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold mb-6" style={{fontFamily: 'Inter, Montserrat, sans-serif'}}>
            <span style={{
              background: 'linear-gradient(90deg, #E9338E 0%, #4B52FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.02em'
            }}>
              The Last Growth Platform You'll Ever Need
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            Stop duct-taping 17 different tools together. Our Growth Program replaces your entire tech stack with one AI-powered platform that actually grows your business—not just your monthly bills.
          </p>

          {/* Value Props Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: TrendingUp,
                title: 'Performance-First',
                description: 'We only win when you win. Pay based on actual results, not empty promises.',
                color: 'from-green-400 to-emerald-500'
              },
              {
                icon: Target,
                title: 'Done-For-You',
                description: 'Expert team handles setup, ads, and support. You focus on closing deals.',
                color: 'from-blue-400 to-cyan-500'
              },
              {
                icon: Rocket,
                title: 'Scale on Autopilot',
                description: 'AI handles lead gen, nurturing, and follow-ups 24/7 while you sleep.',
                color: 'from-purple-400 to-pink-500'
              }
            ].map((prop, idx) => (
              <motion.div
                key={prop.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                className="group relative bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl blur-xl"
                     style={{background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`}}></div>

                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${prop.color} mb-4`}>
                  <prop.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{prop.title}</h3>
                <p className="text-gray-400 text-sm">{prop.description}</p>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shine-slow"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tool Replacement Bar */}
      <ToolReplacementBar />

      <div className="max-w-7xl mx-auto mt-16">
        {/* Pricing Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span style={{
              background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Choose Your Growth Path
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Select the plan that fits your revenue goals. Both include full done-for-you service, expert support, and all platform features.
          </p>
        </motion.div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Billing */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative bg-gray-900/60 backdrop-blur-sm border border-blue-500/30 rounded-3xl p-8 flex flex-col"
            style={{borderWidth: '1px'}}
          >
            {/* Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Monthly Plan
              </div>
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-6 mt-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white text-center mb-2">Monthly Billing</h3>
            <p className="text-gray-400 text-center mb-6 text-sm">Pay month-to-month with flexibility</p>

            {/* Price */}
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-white mb-2">
                $275
                <span className="text-2xl text-gray-400">/month</span>
              </div>
            </div>

            {/* Everything Included Box */}
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-blue-400" />
                <span className="text-white font-semibold">Everything Included</span>
              </div>
              <p className="text-gray-300 text-sm text-center">
                All features • Cancel anytime • 30-day guarantee
              </p>
            </div>

            <p className="text-gray-400 text-center text-sm mb-6">
              + 10% performance fee on ad-generated revenue
            </p>

            {/* Features List - Scrollable */}
            <div className="flex-1 mb-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-3">
                {monthlyFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <motion.button
              onClick={() => handlePlanClick('https://freedom.kenjiai.com/checkout-4912-2457-3370', 'monthly')}
              disabled={isLoading === 'monthly'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl"
              style={{
                background: 'linear-gradient(90deg, #E9338E 0%, #4B52FF 100%)'
              }}
            >
              {isLoading === 'monthly' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Redirecting...
                </>
              ) : (
                <>
                  Get Started Now
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            <div className="flex items-center justify-center gap-2 mt-4 text-gray-500 text-xs">
              <Shield className="w-4 h-4" />
              <span>30-day money-back guarantee</span>
            </div>
          </motion.div>

          {/* Yearly Billing - Best Value */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative bg-gray-900/60 backdrop-blur-sm border border-green-500/40 rounded-3xl p-8 flex flex-col"
            style={{borderWidth: '1px', boxShadow: '0 0 30px rgba(16, 185, 129, 0.2)'}}
          >
            {/* Best Value Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                <Star className="w-4 h-4" />
                Best Value - Save 21%
              </div>
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-6 mt-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white text-center mb-2">Yearly Billing</h3>
            <p className="text-gray-400 text-center mb-6 text-sm">Save big with annual commitment</p>

            {/* Price */}
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-white mb-2">
                $216.67
                <span className="text-2xl text-gray-400">/month</span>
              </div>
              <div className="text-green-400 font-semibold text-lg">
                Save $700/year (21% off)
              </div>
              <p className="text-gray-500 text-sm mt-1">Billed annually at $2600</p>
            </div>

            {/* Everything Included Box */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-400/30 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-green-400" />
                <span className="text-white font-semibold">Everything Included + Savings</span>
              </div>
              <p className="text-gray-300 text-sm text-center">
                All features • 2 months free • 30-day guarantee
              </p>
            </div>

            <p className="text-gray-400 text-center text-sm mb-6">
              + 5% performance fee on ad-generated revenue
            </p>

            {/* Features List - Scrollable */}
            <div className="flex-1 mb-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-3">
                {yearlyFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <motion.button
              onClick={() => handlePlanClick('https://freedom.kenjiai.com/checkout-4912-2457-3370', 'yearly')}
              disabled={isLoading === 'yearly'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl"
              style={{
                background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)'
              }}
            >
              {isLoading === 'yearly' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Redirecting...
                </>
              ) : (
                <>
                  Get Started Now - Save 21%
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            <div className="flex items-center justify-center gap-2 mt-4 text-gray-500 text-xs">
              <Shield className="w-4 h-4" />
              <span>30-day money-back guarantee • Secured by Stripe • SSL Encrypted • PCI Compliant</span>
            </div>
          </motion.div>

          {/* VIP Demo Walkthrough */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative bg-gradient-to-br from-amber-900/40 to-orange-900/40 backdrop-blur-sm border border-amber-500/40 rounded-3xl p-8 flex flex-col"
            style={{borderWidth: '1px'}}
          >
            {/* VIP Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                <Star className="w-4 h-4" />
                VIP EXCLUSIVE
              </div>
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-6 mt-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>

            <h3 className="text-3xl font-bold text-white text-center mb-2">VIP Demo Walkthrough</h3>
            <p className="text-gray-300 text-center mb-6 text-sm">See how Kenji helps businesses make $500K+/month</p>

            {/* Book Now CTA */}
            <div className="text-center mb-8">
              <div className="text-5xl font-bold mb-4" style={{color: '#FBBF24'}}>
                Book Now
              </div>
            </div>

            {/* Exclusive Opportunity Box */}
            <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-400/40 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-2xl">🎁</span>
                <span className="text-white font-bold text-lg">Exclusive Opportunity</span>
              </div>
              <ul className="space-y-3 text-gray-200 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">✨</span>
                  <span>Private 1-on-1 demo walkthrough</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">💰</span>
                  <span>Learn proven $500K+/month strategies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">🔓</span>
                  <span className="font-bold text-amber-300">Chance for LIFETIME ACCESS</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">🚀</span>
                  <span>See real business transformations</span>
                </li>
              </ul>
            </div>

            {/* Limited Slots */}
            <div className="bg-red-900/40 border border-red-500/40 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-red-400 font-bold text-sm">⚠️ Limited Slots Available</span>
              </div>
              <p className="text-gray-300 text-xs text-center">
                Only 5 demos per week - First come, first served
              </p>
            </div>

            <div className="flex-1 mb-6">
              <p className="text-green-400 font-semibold text-center mb-4">
                No performance fee • 100% Free Demo
              </p>

              <div className="space-y-3">
                {vipFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-200 text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2 text-amber-300 font-semibold text-sm">
                <p className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Opportunity for LIFETIME ACCESS
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <motion.a
              href="https://calendly.com/kenjiai-demo"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl"
              style={{
                background: 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)'
              }}
            >
              Book VIP Demo Now
              <ArrowRight className="w-5 h-5" />
            </motion.a>

            <div className="text-center mt-4">
              <p className="text-amber-400 text-sm font-semibold">
                Join 50+ VIP clients earning $500K+/month
              </p>
              <p className="text-gray-500 text-xs mt-2">
                100% Free Demo • No Credit Card Required
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }

        @keyframes shine-slow {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
          }
        }

        .animate-shine-slow {
          animation: shine-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
