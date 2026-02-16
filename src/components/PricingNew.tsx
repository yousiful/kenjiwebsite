import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, ArrowRight, Calendar, Zap, Shield, CreditCard, Target, Rocket, Video, LogIn, ChevronDown } from 'lucide-react';
import { ToolReplacementBar } from './ToolReplacementBar';
import { MoneyBackGuarantee } from './MoneyBackGuarantee';

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
    "Personal strategy session with our team",
    "Comprehensive platform walkthrough and demo",
    "Custom solutions designed for your business",
    "Lifetime platform access opportunity",
    "VIP support and dedicated account management",
  ];

  return (
    <div className="py-16 sm:py-24 px-4" style={{backgroundColor: '#0B0E14'}}>
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto mb-12 sm:mb-16 text-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight" style={{fontFamily: 'Inter, Montserrat, sans-serif'}}>
            <span style={{
              background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.01em'
            }}>
              Let's Grow Your Business Together
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-10 sm:mb-12 leading-relaxed">
            Choose the perfect plan for your business growth. All plans include done-for-you setup and expert support.
          </p>

          {/* Value Props Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Target,
                title: 'Done-For-You Ads',
                description: 'We create, launch, and optimize your ad campaigns to fill your CRM with qualified leads.',
                color: 'from-blue-400 to-cyan-500'
              },
              {
                icon: Rocket,
                title: 'Done-For-You Sites & Workflows',
                description: 'Complete website setup and automated workflows built specifically for your business needs.',
                color: 'from-blue-400 to-teal-500'
              },
              {
                icon: Shield,
                title: 'Done-For-You Expert Support',
                description: 'Industry experts handle strategy, management, and optimization so you can focus on revenue.',
                color: 'from-green-400 to-emerald-500'
              }
            ].map((prop, idx) => (
              <motion.div
                key={prop.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/60 rounded-2xl p-6 sm:p-8 hover:border-gray-600 hover:bg-gray-800/60 transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${prop.color} mb-4 sm:mb-5`}>
                  <prop.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 leading-snug">{prop.title}</h3>
                <p className="text-gray-300 text-base leading-relaxed">{prop.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tool Replacement Bar - hidden on mobile, shown on desktop */}
      <div className="hidden sm:block">
        <ToolReplacementBar />
      </div>

      <div className="max-w-7xl mx-auto mt-12 sm:mt-20">
        {/* Pricing Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mb-12 sm:mb-16 px-4"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            <span style={{
              background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.01em'
            }}>
              Choose Your Growth Plan
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transparent pricing for complete AI automation. Every plan includes done-for-you setup, AI voice agents, and ongoing expert support to help you succeed.
          </p>
        </motion.div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 px-4">
          {/* Monthly Billing */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative bg-gray-900/60 backdrop-blur-sm border border-blue-500/30 rounded-3xl p-5 sm:p-8 flex flex-col"
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

            <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-3">Monthly Billing</h3>
            <p className="text-gray-300 text-center mb-8 text-base leading-relaxed">Flexible monthly plan with full features</p>

            {/* Price */}
            <div className="text-center mb-8">
              <div className="text-5xl sm:text-6xl font-bold text-white mb-3">
                $375
                <span className="text-xl sm:text-2xl text-gray-400">/month</span>
              </div>
              <div className="mt-2 text-gray-400 text-base">
                Cancel anytime
              </div>
            </div>

            {/* Everything Included Box */}
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-blue-400" />
                <span className="text-white font-semibold text-base">Everything Included</span>
              </div>
              <p className="text-gray-200 text-base text-center leading-relaxed">
                All features • Full platform access
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4">
                <p className="text-purple-200 text-base text-center font-semibold leading-relaxed">
                  $1,000/month ad spend required
                </p>
              </div>

              <p className="text-gray-300 text-base text-center leading-relaxed">
                + 10% performance fee on ad-generated revenue
              </p>
            </div>

            {/* Features List */}
            <div className="flex-1 mb-8 relative">
              <div className="flex items-center gap-2 mb-4 lg:hidden">
                <ChevronDown className="w-4 h-4 text-gray-400 animate-bounce" />
                <span className="text-gray-400 text-sm">Scroll to see all features</span>
              </div>
              <div className="space-y-2 max-h-[280px] lg:max-h-none overflow-y-auto scrollbar-thin pr-2">
                {monthlyFeatures.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg group cursor-default hover:bg-gray-800/30 transition-colors"
                  >
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-100 text-base font-medium leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <motion.button
              onClick={() => handlePlanClick('https://freedom.kenjiai.com/checkout-4912-2457-3370', 'monthly')}
              disabled={isLoading === 'monthly'}
              whileHover={{ scale: isLoading === 'monthly' ? 1 : 1.02 }}
              whileTap={{ scale: isLoading === 'monthly' ? 1 : 0.98 }}
              className={`w-full text-white py-5 rounded-xl font-bold text-lg sm:text-xl flex items-center justify-center gap-3 shadow-xl transition-all duration-300 ${isLoading === 'monthly' ? 'opacity-90 cursor-wait' : ''}`}
              style={{
                background: 'linear-gradient(90deg, #E9338E 0%, #4B52FF 100%)'
              }}
            >
              {isLoading === 'monthly' ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                  />
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Redirecting to checkout...
                  </motion.span>
                </motion.div>
              ) : (
                <>
                  Get Started with Monthly
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            <div className="flex items-center justify-center gap-2 mt-5 text-gray-400 text-sm">
              <Shield className="w-4 h-4" />
              <span>Secured by Stripe • SSL Encrypted</span>
            </div>
          </motion.div>

          {/* Yearly Billing - Best Value */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative bg-gray-900/60 backdrop-blur-sm border border-green-500/40 rounded-3xl p-5 sm:p-8 flex flex-col"
            style={{borderWidth: '1px', boxShadow: '0 0 30px rgba(16, 185, 129, 0.2)'}}
          >
            {/* Most Popular Ribbon */}
            <div className="absolute -top-3 -right-3 z-20">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-4 py-2 rounded-lg text-xs font-black shadow-xl transform rotate-6">
                MOST POPULAR
              </div>
            </div>

            {/* Best Value Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                <Star className="w-4 h-4" />
                Best Value - Save 27%
              </div>
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-6 mt-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-3">Yearly Billing</h3>
            <p className="text-gray-300 text-center mb-8 text-base leading-relaxed">Best value for long-term growth</p>

            {/* Price */}
            <div className="text-center mb-8">
              <div className="text-5xl sm:text-6xl font-bold text-white mb-3">
                $275
                <span className="text-xl sm:text-2xl text-gray-400">/month</span>
              </div>
              <div className="text-green-400 font-semibold text-lg sm:text-xl">
                Save $1,200/year (27% off)
              </div>
              <p className="text-gray-400 text-base mt-2">Billed annually at $3,300</p>
            </div>

            {/* Everything Included Box */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-400/30 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-green-400" />
                <span className="text-white font-semibold text-base">Everything Included + Savings</span>
              </div>
              <p className="text-gray-200 text-base text-center leading-relaxed">
                All features • 2 months free • Best value
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-4">
                <p className="text-green-200 text-base text-center font-semibold leading-relaxed">
                  No ad spend required
                </p>
              </div>

              <p className="text-gray-300 text-base text-center leading-relaxed">
                + 5% performance fee on ad-generated revenue
              </p>
            </div>

            {/* Features List */}
            <div className="flex-1 mb-8 relative">
              <div className="flex items-center gap-2 mb-4 lg:hidden">
                <ChevronDown className="w-4 h-4 text-gray-400 animate-bounce" />
                <span className="text-gray-400 text-sm">Scroll to see all features</span>
              </div>
              <div className="space-y-2 max-h-[280px] lg:max-h-none overflow-y-auto scrollbar-thin pr-2">
                {yearlyFeatures.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg group cursor-default hover:bg-gray-800/30 transition-colors"
                  >
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-100 text-base font-medium leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <motion.button
              onClick={() => handlePlanClick('https://freedom.kenjiai.com/checkout-4912-2457-3370', 'yearly')}
              disabled={isLoading === 'yearly'}
              whileHover={{ scale: isLoading === 'yearly' ? 1 : 1.02 }}
              whileTap={{ scale: isLoading === 'yearly' ? 1 : 0.98 }}
              className={`w-full text-white py-5 rounded-xl font-bold text-lg sm:text-xl flex items-center justify-center gap-3 shadow-xl transition-all duration-300 ${isLoading === 'yearly' ? 'opacity-90 cursor-wait' : ''}`}
              style={{
                background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)'
              }}
            >
              {isLoading === 'yearly' ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                  />
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Redirecting to checkout...
                  </motion.span>
                </motion.div>
              ) : (
                <>
                  Get Started with Yearly
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            <div className="flex items-center justify-center gap-2 mt-5 text-gray-400 text-sm">
              <Shield className="w-4 h-4" />
              <span>Secured by Stripe • SSL Encrypted • PCI Compliant</span>
            </div>
          </motion.div>

          {/* VIP Demo Walkthrough */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative bg-gradient-to-br from-amber-900/40 to-orange-900/40 backdrop-blur-sm border border-amber-500/40 rounded-3xl p-5 sm:p-8 flex flex-col"
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

            <h3 className="text-3xl sm:text-4xl font-bold text-white text-center mb-3">Lifetime Access</h3>
            <p className="text-gray-200 text-center mb-8 text-base leading-relaxed">Exclusive access for serious business owners ready to scale with AI automation</p>

            {/* Book Now CTA */}
            <div className="text-center mb-8">
              <div className="text-4xl sm:text-5xl font-bold mb-3" style={{color: '#FBBF24'}}>
                Book Call
              </div>
            </div>

            {/* Book System Walkthrough Button */}
            <motion.a
              href="https://go.mediatraffics.com/leads"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-gradient-to-br from-blue-600/30 to-purple-600/30 backdrop-blur-sm border border-blue-400/50 rounded-2xl p-6 mb-5 overflow-hidden transition-all duration-300 hover:border-blue-400 block cursor-pointer"
            >
              {/* Animated background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 to-purple-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine-slow"></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Video className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                  <span className="text-white font-bold text-2xl">Book System Walkthrough</span>
                </div>
                <p className="text-gray-300 text-sm text-center mb-4 group-hover:text-white transition-colors duration-300">
                  See the platform in action and discover how it works for your business
                </p>
                <div className="flex items-center justify-center gap-2 text-blue-400 font-semibold group-hover:text-blue-300 transition-colors duration-300">
                  <span>Schedule Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                   style={{boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)'}}></div>
            </motion.a>

            {/* Availability Note */}
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-blue-300 font-semibold text-base">📅 Limited Availability</span>
              </div>
              <p className="text-gray-200 text-sm text-center leading-relaxed">
                We work with select businesses ready to scale
              </p>
            </div>

            <div className="flex-1 mb-8">
              <p className="text-amber-300 font-bold text-center mb-6 text-lg leading-relaxed">
                Exclusive lifetime platform access for serious business owners
              </p>

              <div className="space-y-2">
                {vipFeatures.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg transition-all duration-300 hover:bg-amber-500/10 hover:border-l-2 hover:border-amber-400 hover:pl-4 group cursor-default"
                  >
                    <Check className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5 transition-all duration-300 group-hover:text-amber-300 group-hover:scale-110" />
                    <span className="text-gray-100 text-base font-medium leading-relaxed transition-all duration-300 group-hover:text-white">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2 text-gray-300 text-base text-center">
                <p className="font-medium leading-relaxed">
                  Qualify for exclusive lifetime access to our platform
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <motion.a
              href="https://go.mediatraffics.com/leads"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-white py-5 rounded-xl font-bold text-lg sm:text-xl flex items-center justify-center gap-3 shadow-xl cursor-pointer"
              style={{
                background: 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)'
              }}
            >
              Book VIP Strategy Call
              <ArrowRight className="w-5 h-5" />
            </motion.a>

            <div className="text-center mt-5">
              <p className="text-gray-200 text-base leading-relaxed">
                Exclusive opportunity for qualified business owners
              </p>
              <p className="text-gray-300 text-sm mt-2 leading-relaxed">
                Discover lifetime platform access and VIP support
              </p>
            </div>
          </motion.div>
        </div>

        {/* CTA Section - 2 Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 sm:mt-28 max-w-5xl mx-auto"
        >
          <div className="text-center mb-10 sm:mb-12 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white leading-tight">
              Ready to Scale Your Business?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
              Book your VIP strategy call or access your dashboard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 px-4">
            {/* VIP Demo Button */}
            <motion.a
              href="https://go.mediatraffics.com/leads"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 flex flex-col items-center justify-center text-center overflow-hidden shadow-2xl w-full cursor-pointer"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine-slow"></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Video className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">VIP Strategy Call</h3>
                <p className="text-orange-100 text-base sm:text-lg mb-5 leading-relaxed">
                  Exclusive access for serious business owners ready to scale
                </p>
                <div className="flex items-center justify-center gap-2 text-white font-semibold text-lg">
                  <span>Book Strategy Call</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                   style={{boxShadow: '0 0 40px rgba(249, 115, 22, 0.6)'}}></div>
            </motion.a>

            {/* Login Button */}
            <motion.a
              href="https://app.kenjiai.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 flex flex-col items-center justify-center text-center overflow-hidden shadow-2xl"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine-slow"></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <LogIn className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">Login to KenjiAI</h3>
                <p className="text-blue-100 text-base sm:text-lg mb-5 leading-relaxed">
                  Access your dashboard and start automating
                </p>
                <div className="flex items-center justify-center gap-2 text-white font-semibold text-lg">
                  <span>Enter Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                   style={{boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)'}}></div>
            </motion.a>
          </div>

          {/* Money-Back Guarantee - Large and Prominent */}
          <div className="mt-20 sm:mt-24 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <MoneyBackGuarantee />
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style>{`
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

        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(107, 114, 128, 0.3);
          border-radius: 4px;
        }
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: rgba(107, 114, 128, 0.3) transparent;
        }
      `}</style>
    </div>
  );
}
