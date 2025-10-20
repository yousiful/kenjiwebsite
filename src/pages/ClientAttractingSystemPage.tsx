import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Check,
  Sparkles,
  Users,
  TrendingUp,
  Target,
  Phone,
  Mail,
  Bot,
  Shield,
  Award,
  Zap,
  Rocket,
  DollarSign,
  Clock,
  Star,
  Gift,
  BarChart3,
  HeadphonesIcon,
  GraduationCap,
  ArrowRight
} from 'lucide-react';
import SEOHead from '../components/SEOHead';

const ClientAttractingSystemPage: React.FC = () => {
  const [showMoneyBack, setShowMoneyBack] = useState(false);

  const systemIncludes = [
    {
      icon: Users,
      title: "Ads Manager - Team of 3",
      description: "15 years experience managing your campaigns ($12,000/year value)",
      gradient: "from-blue-500 to-purple-500"
    },
    {
      icon: Target,
      title: "Operations Manager",
      description: "Finally save time with SOPs ($40,000/year value)",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      title: "AI Investor Search",
      description: "Find grants for ad spend ($99/year value)",
      gradient: "from-pink-500 to-red-500"
    },
    {
      icon: BarChart3,
      title: "AI Sales Coach",
      description: "Sell more, fast ($99/year value)",
      gradient: "from-red-500 to-orange-500"
    },
    {
      icon: Bot,
      title: "AI Virtual Assistant",
      description: "Email/text/call sales follow-up ($6,000/year value)",
      gradient: "from-orange-500 to-yellow-500"
    },
    {
      icon: Sparkles,
      title: "KenjiAI (LIFETIME)",
      description: "Complete AI business automation platform - yours forever ($3,600/year value)",
      gradient: "from-yellow-500 to-green-500"
    },
    {
      icon: Phone,
      title: "Voice AI Front Desk",
      description: "24/7 AI-powered receptionist ($900/year value)",
      gradient: "from-green-500 to-teal-500"
    },
    {
      icon: Rocket,
      title: "Funnel & Website (Optional)",
      description: "Professional sales funnel and website design ($1,000/year value)",
      gradient: "from-teal-500 to-cyan-500"
    },
    {
      icon: HeadphonesIcon,
      title: "Done-For-You VIP Support",
      description: "White-glove support from our expert team ($499/month value)",
      gradient: "from-cyan-500 to-blue-500"
    }
  ];

  const bonuses = [
    {
      icon: GraduationCap,
      title: "Close 4 Survival Course + Exam",
      description: "Unlock your sales potential with our comprehensive course. Guaranteed to boost your sales by 45%. Don't miss out on this opportunity to supercharge your career.",
      cta: "Get Started"
    },
    {
      icon: Users,
      title: "VIP Marketing Team Support",
      description: "Let our team guide you to get more traffic, leads, and sales using social media platforms and direct ads.",
      cta: "Get Started"
    }
  ];

  const stats = [
    { label: "Average Client ROI", value: "425%" },
    { label: "Businesses Served", value: "2,000+" },
    { label: "Calls Handled Daily", value: "10,000+" },
    { label: "Success Rate", value: "98%" }
  ];

  const handleGetStarted = () => {
    window.location.href = '/pricing';
  };

  return (
    <>
      <SEOHead
        title="Client Attracting System - One-Time Payment | KenjiAI"
        description="Get the complete Client Attracting System with done-for-you ads management, AI automation, and lifetime KenjiAI access for one payment of $4,670. 100% money-back guarantee."
        keywords="client attracting system, done for you marketing, AI automation, sales system, business growth"
        canonical="https://kenjiai.com/client-attracting-system"
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-full px-6 py-3 mb-6"
            >
              <Sparkles className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">One-Time Payment</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                'Client Attracting' System
              </span>
              <br />
              <span className="text-3xl sm:text-4xl lg:text-5xl">DONE FOR YOU</span>
            </h1>

            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Get everything you need to attract, convert, and retain clients with our complete done-for-you system.
              One payment, lifetime value.
            </p>

            {/* Price Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-2 border-green-400/30 rounded-3xl p-8 max-w-md mx-auto mb-8"
            >
              <div className="text-gray-400 mb-2">One-Time Investment</div>
              <div className="text-6xl font-bold text-white mb-2">$4,670</div>
              <div className="text-green-400 font-semibold mb-4">Pay once, benefit forever</div>
              <button
                onClick={handleGetStarted}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Zap className="w-6 h-6" />
                Get Instant Access
                <ArrowRight className="w-6 h-6" />
              </button>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* What's Included */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Everything You Need to <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Succeed</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                A complete ecosystem of tools, services, and support designed to attract clients on autopilot
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systemIncludes.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300 group"
                >
                  <div className={`w-14 h-14 bg-gradient-to-r ${item.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Value Comparison Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border-2 border-green-400/30 rounded-3xl p-8 sm:p-12 max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Total Value: <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">$68,986/year</span>
                </h2>
                <p className="text-xl text-gray-400">You pay only once</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-800/50 rounded-2xl p-6">
                  <div className="text-gray-400 text-sm mb-2">Annual Value</div>
                  <div className="text-4xl font-bold text-red-400 line-through mb-2">$68,986</div>
                  <div className="text-sm text-gray-400">If paid separately</div>
                </div>
                <div className="bg-gradient-to-br from-green-600/20 to-blue-600/20 rounded-2xl p-6 border-2 border-green-400/50">
                  <div className="text-green-400 text-sm mb-2 font-semibold">Your One-Time Investment</div>
                  <div className="text-4xl font-bold text-white mb-2">$4,670</div>
                  <div className="text-sm text-green-400 font-semibold">93% Savings + Lifetime Access</div>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-xl p-6 text-center">
                <p className="text-2xl font-bold text-white mb-2">
                  That's a <span className="text-green-400">$64,316</span> savings in year one alone!
                </p>
                <p className="text-gray-400">
                  Plus, you'll never pay again. Ever. While others pay $68,986 every year.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Bonuses Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-full px-6 py-3 mb-6">
                <Gift className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">Included Bonuses</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Plus These <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Exclusive Bonuses</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {bonuses.map((bonus, index) => (
                <motion.div
                  key={bonus.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border-2 border-yellow-500/30 rounded-2xl p-8 hover:border-yellow-400/50 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                    <bonus.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{bonus.title}</h3>
                  <p className="text-gray-400 mb-6">{bonus.description}</p>
                  <button
                    onClick={handleGetStarted}
                    className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-yellow-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {bonus.cta}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Money Back Guarantee */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <div
              onClick={() => setShowMoneyBack(!showMoneyBack)}
              className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-2 border-green-400/30 rounded-3xl p-8 sm:p-12 text-center cursor-pointer hover:border-green-400/50 transition-all duration-300 max-w-4xl mx-auto"
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Shield className="w-10 h-10 text-white" />
                </div>
              </div>

              <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-full px-6 py-2 mb-4">
                <span className="text-green-400 font-bold text-sm uppercase tracking-wider">TRY IT RISK FREE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                100% Money Back Guarantee
              </h2>

              <p className="text-xl text-gray-400 mb-6 max-w-2xl mx-auto">
                We're so confident in the Client Attracting System that we offer a complete money-back guarantee.
                If you're not satisfied, we'll refund every penny.
              </p>

              <div className="flex items-center justify-center gap-2 text-green-400">
                <Check className="w-6 h-6" />
                <span className="font-semibold">Get instant access with zero risk</span>
              </div>
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm border-2 border-green-400/30 rounded-3xl p-8 sm:p-12 max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Join 2,000+ businesses already using the Client Attracting System to scale their operations
              </p>

              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-400/30 rounded-2xl p-6 mb-8 max-w-md mx-auto">
                <div className="text-gray-400 text-sm mb-2">One-Time Payment</div>
                <div className="text-5xl font-bold text-white mb-2">$4,670</div>
                <div className="text-green-400 font-semibold">Lifetime Access • No Recurring Fees</div>
              </div>

              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-12 py-5 rounded-xl font-bold text-xl hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-300 flex items-center justify-center gap-3 mx-auto mb-6"
              >
                <Zap className="w-7 h-7" />
                Get Instant Access Now
                <ArrowRight className="w-7 h-7" />
              </button>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Instant setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Expert team included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>100% money-back guarantee</span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-700">
                <p className="text-gray-400 text-sm mb-4">
                  Need help deciding? Our AI front desk is here 24/7
                </p>
                <a
                  href="tel:+18312634402"
                  className="text-green-400 hover:text-green-300 font-semibold text-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  (831) 263-4402
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default ClientAttractingSystemPage;
