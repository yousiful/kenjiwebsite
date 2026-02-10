import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, ArrowRight, Calendar, Zap, Shield, CreditCard, TrendingUp, Target, Rocket, Video, LogIn, HelpCircle } from 'lucide-react';
import { ToolReplacementBar } from './ToolReplacementBar';
import { MoneyBackGuarantee } from './MoneyBackGuarantee';
import { BookingPopup } from './BookingPopup';

export function PricingNew() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

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
    <div className="py-24 px-4" style={{backgroundColor: '#0B0E14'}}>
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto mb-16 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl sm:text-6xl font-bold mb-6" style={{fontFamily: 'Inter, Montserrat, sans-serif'}}>
            <span style={{
              background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.02em'
            }}>
              Let's Grow Your Business Together
            </span>
          </h1>

          {/* Value Props Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
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
                color: 'from-purple-400 to-pink-500'
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
              Choose Your Growth Plan
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Transparent pricing for complete AI automation. Every plan includes done-for-you setup, AI voice agents, and ongoing expert support to help you succeed.
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
            <p className="text-gray-400 text-center mb-6 text-sm">Flexible monthly plan with full features</p>

            {/* Price */}
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-white mb-2">
                $375
                <span className="text-2xl text-gray-400">/month</span>
              </div>
              <div className="mt-2 text-gray-500 text-sm">
                Cancel anytime
              </div>
            </div>

            {/* Everything Included Box */}
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-blue-400" />
                <span className="text-white font-semibold">Everything Included</span>
              </div>
              <p className="text-gray-300 text-sm text-center">
                All features • Full platform access
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-3">
                <p className="text-purple-300 text-sm text-center font-semibold">
                  $1,000/month ad spend required
                </p>
              </div>

              <div className="group relative">
                <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                  <p className="text-center">
                    + 10% performance fee on ad-generated revenue
                  </p>
                  <div className="relative">
                    <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-950 border border-blue-400/50 rounded-xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 shadow-2xl">
                      <div className="text-xs text-white space-y-2">
                        <p className="font-bold text-green-400 text-center">Success Guarantee</p>
                        <p className="text-gray-300">We only win when you win. Our performance fee means we're invested in your success.</p>
                        <p className="text-blue-400 font-semibold">Your growth is our growth.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="flex-1 mb-6">
              <div className="space-y-2">
                {monthlyFeatures.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 rounded-lg transition-all duration-300 hover:bg-purple-500/10 hover:border-l-2 hover:border-purple-400 hover:pl-3 group cursor-default"
                  >
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5 transition-all duration-300 group-hover:text-green-300 group-hover:scale-110" />
                    <span className="text-gray-300 text-xs leading-relaxed transition-all duration-300 group-hover:text-white group-hover:font-medium">{feature}</span>
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
                  Get Started with Monthly
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            <div className="flex items-center justify-center gap-2 mt-4 text-gray-500 text-xs">
              <Shield className="w-4 h-4" />
              <span>Secured by Stripe • SSL Encrypted</span>
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

            <h3 className="text-2xl font-bold text-white text-center mb-2">Yearly Billing</h3>
            <p className="text-gray-400 text-center mb-6 text-sm">Best value for long-term growth</p>

            {/* Price */}
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-white mb-2">
                $275
                <span className="text-2xl text-gray-400">/month</span>
              </div>
              <div className="text-green-400 font-semibold text-lg">
                Save $1,200/year (27% off)
              </div>
              <p className="text-gray-500 text-sm mt-1">Billed annually at $3,300</p>
            </div>

            {/* Everything Included Box */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-400/30 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-green-400" />
                <span className="text-white font-semibold">Everything Included + Savings</span>
              </div>
              <p className="text-gray-300 text-sm text-center">
                All features • 2 months free • Best value
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-3">
                <p className="text-green-300 text-sm text-center font-semibold">
                  No ad spend required
                </p>
              </div>

              <div className="group relative">
                <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                  <p className="text-center">
                    + 5% performance fee on ad-generated revenue
                  </p>
                  <div className="relative">
                    <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-950 border border-green-400/50 rounded-xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 shadow-2xl">
                      <div className="text-xs text-white space-y-2">
                        <p className="font-bold text-green-400 text-center">Success Guarantee</p>
                        <p className="text-gray-300">We only win when you win. Our performance fee means we're invested in your success.</p>
                        <p className="text-blue-400 font-semibold">Your growth is our growth.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="flex-1 mb-6">
              <div className="space-y-2">
                {yearlyFeatures.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 rounded-lg transition-all duration-300 hover:bg-green-500/10 hover:border-l-2 hover:border-green-400 hover:pl-3 group cursor-default"
                  >
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5 transition-all duration-300 group-hover:text-green-300 group-hover:scale-110" />
                    <span className="text-gray-300 text-xs leading-relaxed transition-all duration-300 group-hover:text-white group-hover:font-medium">{feature}</span>
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
                  Get Started with Yearly
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            <div className="flex items-center justify-center gap-2 mt-4 text-gray-500 text-xs">
              <Shield className="w-4 h-4" />
              <span>Secured by Stripe • SSL Encrypted • PCI Compliant</span>
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

            <h3 className="text-3xl font-bold text-white text-center mb-2">Lifetime Access</h3>
            <p className="text-gray-300 text-center mb-6 text-sm">Exclusive access for serious business owners ready to scale with AI automation</p>

            {/* Book Now CTA */}
            <div className="text-center mb-8">
              <div className="text-5xl font-bold mb-4" style={{color: '#FBBF24'}}>
                Book Call
              </div>
            </div>

            {/* Book System Walkthrough Button */}
            <motion.button
              onClick={() => setIsBookingOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-gradient-to-br from-blue-600/30 to-purple-600/30 backdrop-blur-sm border border-blue-400/50 rounded-2xl p-8 mb-6 overflow-hidden transition-all duration-300 hover:border-blue-400"
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
            </motion.button>

            {/* Availability Note */}
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-blue-400 font-semibold text-sm">📅 Limited Availability</span>
              </div>
              <p className="text-gray-300 text-xs text-center">
                We work with select businesses ready to scale
              </p>
            </div>

            <div className="flex-1 mb-6">
              <p className="text-amber-400 font-semibold text-center mb-4">
                Exclusive lifetime platform access for serious business owners
              </p>

              <div className="space-y-2">
                {vipFeatures.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 rounded-lg transition-all duration-300 hover:bg-amber-500/10 hover:border-l-2 hover:border-amber-400 hover:pl-3 group cursor-default"
                  >
                    <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5 transition-all duration-300 group-hover:text-amber-300 group-hover:scale-110" />
                    <span className="text-gray-200 text-xs leading-relaxed font-medium transition-all duration-300 group-hover:text-white">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2 text-gray-400 text-sm text-center">
                <p>
                  Qualify for exclusive lifetime access to our platform
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <motion.button
              onClick={() => setIsBookingOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl"
              style={{
                background: 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)'
              }}
            >
              Book VIP Strategy Call
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <div className="text-center mt-4">
              <p className="text-gray-300 text-sm">
                Exclusive opportunity for qualified business owners
              </p>
              <p className="text-gray-400 text-xs mt-2">
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
          className="mt-20 max-w-4xl mx-auto"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              Ready to Scale Your Business?
            </h2>
            <p className="text-lg text-gray-400">
              Book your VIP strategy call or access your dashboard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
            {/* VIP Demo Button */}
            <motion.button
              onClick={() => setIsBookingOpen(true)}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 flex flex-col items-center justify-center text-center overflow-hidden shadow-2xl w-full"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine-slow"></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">VIP Strategy Call</h3>
                <p className="text-orange-100 text-sm mb-4">
                  Exclusive access for serious business owners ready to scale
                </p>
                <div className="flex items-center justify-center gap-2 text-white font-semibold">
                  <span>Book Strategy Call</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                   style={{boxShadow: '0 0 40px rgba(249, 115, 22, 0.6)'}}></div>
            </motion.button>

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
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <LogIn className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Login to KenjiAI</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Access your dashboard and start automating
                </p>
                <div className="flex items-center justify-center gap-2 text-white font-semibold">
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
          <div className="mt-16 px-4">
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
      `}</style>

      <BookingPopup isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
}
