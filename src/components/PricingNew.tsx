import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check, Star, ArrowRight, Calendar, Zap, Shield,
  CreditCard, Target, Rocket, Video, LogIn, ChevronDown,
  Users, TrendingUp, Award
} from 'lucide-react';
import { ToolReplacementBar } from './ToolReplacementBar';
import { MoneyBackGuarantee } from './MoneyBackGuarantee';

const MONTHLY_FEATURES = [
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

const YEARLY_FEATURES = [
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

const VIP_FEATURES = [
  "1-on-1 strategy session with our senior team",
  "Full platform walkthrough custom to your business",
  "Dedicated account manager & priority support",
  "Custom AI workflows built for your exact use case",
  "Lifetime platform access — pay once, own it forever",
];

const SOCIAL_PROOF_STATS = [
  { icon: Users, value: "50,000+", label: "Active Businesses" },
  { icon: TrendingUp, value: "$500M+", label: "Revenue Generated" },
  { icon: Award, value: "4.9★", label: "Average Rating" },
];

export function PricingNew() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handlePlanClick = async (url: string, planName: string) => {
    setIsLoading(planName);
    await new Promise(resolve => setTimeout(resolve, 500));
    window.location.href = url;
  };

  return (
    <div className="py-16 sm:py-24 px-4" style={{ backgroundColor: '#0B0E14' }}>

      {/* Urgency Strip */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full -mt-16 sm:-mt-24 mb-6"
        style={{
          background: 'linear-gradient(90deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)',
          borderBottom: '1px solid rgba(0,255,255,0.15)'
        }}
      >
        <motion.div
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-4 py-2 text-xs sm:text-sm text-center"
          style={{
            background: 'linear-gradient(90deg, rgba(0,255,255,0.05), rgba(57,255,20,0.05), rgba(0,255,255,0.05))',
            backgroundSize: '200% 100%'
          }}
        >
          <motion.span
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-1.5"
          >
            <span
              style={{ color: '#FF4444', textShadow: '0 0 8px rgba(255,68,68,0.6)' }}
              className="font-bold"
            >
              Limited Onboarding Spots
            </span>
            <span className="text-gray-500">·</span>
            <span
              style={{ color: '#00FFFF', textShadow: '0 0 8px rgba(0,255,255,0.6)' }}
              className="font-semibold"
            >
              New clients this month filling fast
            </span>
          </motion.span>
          <span className="hidden sm:block text-gray-700">|</span>
          <span className="flex items-center gap-1.5">
            <span
              style={{ color: '#39FF14', textShadow: '0 0 8px rgba(57,255,20,0.6)' }}
              className="font-bold"
            >
              +$25
            </span>
            <span className="text-gray-400">free credit for Text, Email and AI calls</span>
          </span>
        </motion.div>
      </motion.div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto mb-12 sm:mb-16 text-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-2 mb-6 text-sm text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
            Trusted by 50,000+ businesses worldwide
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
              We Build It.
            </span>
            <br />
            <span className="text-white">You Grow It. Together.</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            KenjiAI replaces what costs $8,000 or more per month in tools and staff. Our team handles
            the setup, the ads, and the automation — so you can focus entirely on serving your clients and scaling your revenue.
          </p>

          {/* Social Proof Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mb-12 sm:mb-14">
            {SOCIAL_PROOF_STATS.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                  <stat.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Value Props Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Target,
                title: 'Done-For-You Ads',
                description: 'We create, launch, and optimize your ad campaigns to fill your CRM with qualified leads ready to buy.',
                color: 'from-blue-400 to-cyan-500'
              },
              {
                icon: Rocket,
                title: 'Done-For-You Sites & Workflows',
                description: 'Your entire tech stack — website, funnels, and automation — built and managed by our experts.',
                color: 'from-blue-400 to-teal-500'
              },
              {
                icon: Shield,
                title: 'Done-For-You Expert Support',
                description: 'A dedicated team handles strategy, management, and optimization. You focus on revenue, we handle the rest.',
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

      {/* Tool Replacement Bar */}
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
              Simple, Transparent Pricing
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-4">
            One platform replaces your CRM, email tool, ad agency, chatbot, course platform, and more.
            Our clients consistently save between $5,000 and $8,000 per month in tools and agency costs — and grow faster because of it.
          </p>
          <div className="inline-flex items-center gap-2 text-emerald-400 font-semibold text-base">
            <Check className="w-4 h-4" />
            <span>30-day money-back guarantee on all plans</span>
          </div>
        </motion.div>

        {/* 3-Column Pricing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 px-4">

          {/* Monthly Plan */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative bg-gray-900/60 backdrop-blur-sm border border-blue-500/30 rounded-3xl p-5 sm:p-8 flex flex-col"
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 whitespace-nowrap">
                <Calendar className="w-4 h-4" />
                Flexible Monthly
              </div>
            </div>

            <div className="flex justify-center mb-6 mt-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white" />
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">Monthly Plan</h3>
            <p className="text-gray-400 text-center mb-6 text-sm leading-relaxed">
              Start with full access and complete flexibility. We will be with you every step of the way.
            </p>

            <div className="text-center mb-5">
              <div className="text-5xl sm:text-6xl font-bold text-white mb-1">
                $375
                <span className="text-xl sm:text-2xl text-gray-400">/mo</span>
              </div>
              <div className="text-gray-400 text-sm mt-1">Replaces over $8,000 per month in tools and staff</div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/30 rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-white font-semibold text-sm">Everything Included</span>
              </div>
              <p className="text-gray-300 text-sm text-center">Full platform access · No feature limits · No hidden fees</p>
            </div>

            <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <span className="text-emerald-300 font-bold text-sm tracking-wide">COUPON CODE</span>
              </div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="font-mono font-black text-lg tracking-widest text-white bg-emerald-900/60 border border-emerald-500/50 px-3 py-1 rounded-lg select-all">KENJ4LFE</span>
              </div>
              <p className="text-emerald-300 text-xs text-center mt-2">Apply at checkout to save $76 on your first month</p>
            </div>

            <div className="flex-1 mb-6 relative">
              <div className="flex items-center gap-2 mb-3 lg:hidden">
                <ChevronDown className="w-4 h-4 text-gray-400 animate-bounce" />
                <span className="text-gray-400 text-xs">Scroll for full feature list</span>
              </div>
              <div className="space-y-1.5 max-h-[260px] lg:max-h-none overflow-y-auto scrollbar-thin pr-2">
                {MONTHLY_FEATURES.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-gray-800/30 transition-colors"
                  >
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-200 text-sm leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <motion.button
              onClick={() => handlePlanClick('https://freedom.kenjiai.com/checkout-4912-2457-3370', 'monthly')}
              disabled={isLoading === 'monthly'}
              whileHover={{ scale: isLoading === 'monthly' ? 1 : 1.02 }}
              whileTap={{ scale: isLoading === 'monthly' ? 1 : 0.98 }}
              className={`w-full text-white py-4 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-xl transition-all duration-300 ${isLoading === 'monthly' ? 'opacity-90 cursor-wait' : ''}`}
              style={{ background: 'linear-gradient(90deg, #2563EB 0%, #0891B2 100%)' }}
            >
              {isLoading === 'monthly' ? (
                <motion.div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    Redirecting to checkout...
                  </motion.span>
                </motion.div>
              ) : (
                <>
                  Let's Get Started Together
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>

            <div className="flex items-center justify-center gap-1.5 mt-4 text-gray-500 text-xs">
              <Shield className="w-3.5 h-3.5" />
              <span>Secured by Stripe · SSL Encrypted · Cancel anytime</span>
            </div>
          </motion.div>

          {/* Yearly Plan — Best Value */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative bg-gray-900/60 backdrop-blur-sm border border-emerald-500/40 rounded-3xl p-5 sm:p-8 flex flex-col"
            style={{ boxShadow: '0 0 40px rgba(16, 185, 129, 0.18)' }}
          >
            <div className="absolute -top-3 -right-3 z-20">
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 px-4 py-2 rounded-lg text-xs font-black shadow-xl transform rotate-6">
                MOST POPULAR
              </div>
            </div>

            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 whitespace-nowrap">
                <Star className="w-4 h-4" />
                Best Value — Save $1,200/yr
              </div>
            </div>

            <div className="flex justify-center mb-6 mt-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">Annual Plan</h3>
            <p className="text-gray-300 text-center mb-6 text-sm leading-relaxed">
              The plan our highest-growth clients choose. We commit more deeply when you do.
            </p>

            <div className="text-center mb-5">
              <div className="text-5xl sm:text-6xl font-bold text-white mb-1">
                $275
                <span className="text-xl sm:text-2xl text-gray-400">/mo</span>
              </div>
              <div className="text-emerald-400 font-bold text-base">
                Save $1,200 per year compared to monthly
              </div>
              <div className="text-gray-400 text-sm mt-1">Billed at $3,300 annually — 2 months completely free</div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="text-white font-semibold text-sm">Everything Included — Nothing Held Back</span>
              </div>
              <p className="text-gray-200 text-sm text-center">Full platform · 2 months free · Priority onboarding</p>
            </div>

            <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <span className="text-emerald-300 font-bold text-sm tracking-wide">COUPON CODE</span>
              </div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="font-mono font-black text-lg tracking-widest text-white bg-emerald-900/60 border border-emerald-500/50 px-3 py-1 rounded-lg select-all">KENJ4LFE</span>
              </div>
              <p className="text-emerald-300 text-xs text-center mt-2">Apply at checkout to save $76 on your first month</p>
            </div>

            <div className="flex-1 mb-6 relative">
              <div className="flex items-center gap-2 mb-3 lg:hidden">
                <ChevronDown className="w-4 h-4 text-gray-400 animate-bounce" />
                <span className="text-gray-400 text-xs">Scroll for full feature list</span>
              </div>
              <div className="space-y-1.5 max-h-[260px] lg:max-h-none overflow-y-auto scrollbar-thin pr-2">
                {YEARLY_FEATURES.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-gray-800/30 transition-colors"
                  >
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-200 text-sm leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <motion.button
              onClick={() => handlePlanClick('https://freedom.kenjiai.com/checkout-4912-2457-3370', 'yearly')}
              disabled={isLoading === 'yearly'}
              whileHover={{ scale: isLoading === 'yearly' ? 1 : 1.02 }}
              whileTap={{ scale: isLoading === 'yearly' ? 1 : 0.98 }}
              className={`w-full text-white py-4 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-xl transition-all duration-300 ${isLoading === 'yearly' ? 'opacity-90 cursor-wait' : ''}`}
              style={{ background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)' }}
            >
              {isLoading === 'yearly' ? (
                <motion.div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    Redirecting to checkout...
                  </motion.span>
                </motion.div>
              ) : (
                <>
                  Join Annually and Save $1,200
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>

            <div className="flex items-center justify-center gap-1.5 mt-4 text-gray-500 text-xs">
              <Shield className="w-3.5 h-3.5" />
              <span>Stripe Secured · 30-Day Guarantee · PCI Compliant</span>
            </div>
          </motion.div>

          {/* VIP Lifetime Access */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative bg-gradient-to-br from-amber-900/35 to-orange-900/35 backdrop-blur-sm border border-amber-500/40 rounded-3xl p-5 sm:p-8 flex flex-col"
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 whitespace-nowrap">
                <Star className="w-4 h-4" />
                By Application Only
              </div>
            </div>

            <div className="flex justify-center mb-6 mt-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">Lifetime Access</h3>
            <p className="text-gray-200 text-center mb-6 text-sm leading-relaxed">
              One payment. Lifetime access. We partner with you directly to build a business that compounds.
            </p>

            <div className="text-center mb-6">
              <div className="text-3xl sm:text-4xl font-bold mb-1" style={{ color: '#FBBF24' }}>
                Book a Call
              </div>
              <div className="text-gray-300 text-sm">Pricing revealed to qualified applicants</div>
            </div>

            <motion.a
              href="https://go.mediatraffics.com/leads"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-gradient-to-br from-blue-600/25 to-amber-600/25 border border-amber-400/40 rounded-2xl p-5 mb-5 overflow-hidden transition-all duration-300 hover:border-amber-400 block cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-amber-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2.5 mb-2">
                  <Video className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <span className="text-white font-bold text-lg">Book a System Walkthrough</span>
                </div>
                <p className="text-gray-300 text-xs text-center mb-3 group-hover:text-white transition-colors">
                  See exactly how KenjiAI would work for your business in 30 minutes
                </p>
                <div className="flex items-center justify-center gap-2 text-amber-400 font-semibold text-sm group-hover:text-amber-300 transition-colors">
                  <span>Schedule Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.a>

            <div className="bg-amber-900/20 border border-amber-500/25 rounded-xl p-3 mb-5">
              <p className="text-amber-200 text-xs text-center leading-relaxed">
                We work with a select group of businesses each quarter.
                8 of our last 10 accepted clients now generate $100K+/mo.
              </p>
            </div>

            <div className="flex-1 mb-6">
              <p className="text-amber-300 font-semibold text-center mb-4 text-sm">
                What's included with Lifetime Access:
              </p>
              <div className="space-y-2">
                {VIP_FEATURES.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg transition-all duration-300 hover:bg-amber-500/10 group cursor-default"
                  >
                    <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5 group-hover:text-amber-300 transition-colors" />
                    <span className="text-gray-200 text-sm leading-relaxed group-hover:text-white transition-colors">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <motion.a
              href="https://go.mediatraffics.com/leads"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-white py-4 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-xl cursor-pointer"
              style={{ background: 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)' }}
            >
              Apply for Lifetime Access
              <ArrowRight className="w-4 h-4" />
            </motion.a>

            <p className="text-gray-400 text-xs text-center mt-4 leading-relaxed">
              No commitment required for the discovery call
            </p>
          </motion.div>
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 sm:mt-28 max-w-5xl mx-auto"
        >
          <div className="text-center mb-10 sm:mb-12 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white leading-tight">
              Let's Build Something Real Together
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
              Book a no-pressure strategy call and we will show you exactly what KenjiAI would do for your specific business. Or jump straight into your dashboard if you are already a member.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 px-4">
            <motion.a
              href="https://go.mediatraffics.com/leads"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 flex flex-col items-center justify-center text-center overflow-hidden shadow-2xl w-full cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine-slow"></div>
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Video className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">Book a Strategy Call</h3>
                <p className="text-orange-100 text-base sm:text-lg mb-5 leading-relaxed">
                  30 minutes. We map out exactly how KenjiAI fits your business — no obligation, no pressure.
                </p>
                <div className="flex items-center justify-center gap-2 text-white font-semibold text-base">
                  <span>Let's Talk — Book Your Call</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: '0 0 40px rgba(249, 115, 22, 0.5)' }}></div>
            </motion.a>

            <motion.a
              href="https://app.kenjiai.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 flex flex-col items-center justify-center text-center overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine-slow"></div>
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <LogIn className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">Already a Member?</h3>
                <p className="text-blue-100 text-base sm:text-lg mb-5 leading-relaxed">
                  Jump straight into your dashboard and keep building momentum.
                </p>
                <div className="flex items-center justify-center gap-2 text-white font-semibold text-base">
                  <span>Log In to KenjiAI</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: '0 0 40px rgba(59, 130, 246, 0.5)' }}></div>
            </motion.a>
          </div>

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
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        .animate-shine-slow { animation: shine-slow 3s ease-in-out infinite; }

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
