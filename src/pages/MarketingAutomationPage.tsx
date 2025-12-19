import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Users, TrendingUp, Target, ArrowRight, CheckCircle, Star, Calendar, BarChart3 } from 'lucide-react';

const MarketingAutomationPage: React.FC = () => {
  const automationFeatures = [
    {
      icon: Mail,
      title: "Smart Email Campaigns",
      description: "AI-powered email sequences that adapt based on subscriber behavior and engagement",
      benefits: ["400% higher open rates", "Personalized content", "Optimal send times"]
    },
    {
      icon: Users,
      title: "Lead Nurturing",
      description: "Automatically nurture leads through personalized journeys based on their interests",
      benefits: ["300% more qualified leads", "Automated scoring", "Behavioral triggers"]
    },
    {
      icon: Calendar,
      title: "Social Media Automation",
      description: "Schedule, create, and optimize social media content across all platforms",
      benefits: ["Consistent posting", "AI content creation", "Performance optimization"]
    },
    {
      icon: BarChart3,
      title: "Analytics & Optimization",
      description: "Real-time performance tracking with AI-powered insights and recommendations",
      benefits: ["ROI tracking", "A/B testing", "Predictive analytics"]
    }
  ];

  const campaignTypes = [
    {
      type: "Welcome Series",
      description: "Onboard new subscribers with personalized welcome sequences that convert",
      metrics: ["85% open rate", "45% click rate", "25% conversion rate"],
      icon: Users
    },
    {
      type: "Abandoned Cart",
      description: "Recover lost sales with intelligent cart abandonment campaigns",
      metrics: ["30% recovery rate", "15% revenue increase", "Automated follow-ups"],
      icon: Target
    },
    {
      type: "Re-engagement",
      description: "Win back inactive subscribers with targeted re-engagement campaigns",
      metrics: ["40% reactivation", "20% unsubscribe reduction", "Behavioral triggers"],
      icon: TrendingUp
    }
  ];

  const results = [
    { metric: "400%", label: "Higher Open Rates", description: "AI-optimized subject lines and timing" },
    { metric: "300%", label: "More Qualified Leads", description: "Intelligent lead scoring and nurturing" },
    { metric: "250%", label: "ROI Increase", description: "Automated optimization and testing" },
    { metric: "85%", label: "Time Savings", description: "Fully automated campaign management" }
  ];

  return (
    <>
      {/* SEO Head */}
      <title>AI Marketing Automation Platform | KenjiAI - Email, Social Media & Lead Nurturing</title>
      <meta name="description" content="Automate your marketing with AI. Smart email campaigns, social media automation, lead nurturing, and analytics. 400% higher open rates, 300% more qualified leads." />
      <meta name="keywords" content="marketing automation, email automation, social media automation, lead nurturing, AI marketing, email marketing platform" />
      
      <div className="pt-24 pb-16 bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-full px-6 py-3 mb-6"
            >
              <Mail className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 font-semibold">Marketing Automation</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI Marketing Automation
              </span>
              <br />
              <span className="text-white">That Actually Works</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed mb-12">
              Stop sending generic emails. Start with AI-powered marketing automation that personalizes 
              every touchpoint, optimizes performance, and drives real results.
            </p>

            {/* Results Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {results.map((result, index) => (
                <motion.div
                  key={result.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-purple-400 mb-2">{result.metric}</div>
                  <div className="text-white font-semibold mb-1">{result.label}</div>
                  <div className="text-gray-400 text-sm">{result.description}</div>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="/pricing"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-lg transition-all duration-300"
            >
              <Mail className="w-6 h-6" />
              Start Automating Marketing
              <ArrowRight className="w-6 h-6" />
            </motion.a>
          </motion.div>

          {/* Automation Features */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-20"
          >
            <h2 className="text-4xl font-bold text-white mb-12 text-center">
              Complete Marketing Automation Suite
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {automationFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gray-800/50 border border-gray-700 hover:border-purple-400/50 rounded-2xl p-8 transition-all duration-300"
                >
                  <feature.icon className="w-12 h-12 text-purple-400 mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">{feature.description}</p>
                  
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center text-green-400">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Campaign Types */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-20"
          >
            <h2 className="text-4xl font-bold text-white mb-12 text-center">
              Pre-Built Campaign Templates
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {campaignTypes.map((campaign, index) => (
                <motion.div
                  key={campaign.type}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="bg-gray-800/50 border border-gray-700 hover:border-pink-400/50 rounded-2xl p-8 text-center transition-all duration-300"
                >
                  <campaign.icon className="w-16 h-16 text-pink-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">{campaign.type}</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">{campaign.description}</p>
                  
                  <div className="space-y-2">
                    {campaign.metrics.map((metric, idx) => (
                      <div key={idx} className="flex items-center justify-center text-purple-400 text-sm">
                        <Star className="w-3 h-3 mr-2 fill-current" />
                        {metric}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Features Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-20"
          >
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-400/30 rounded-3xl p-12">
              <h3 className="text-4xl font-bold text-white mb-8 text-center">
                Everything You Need for Marketing Success
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  "Drag & Drop Email Builder",
                  "A/B Testing & Optimization",
                  "Behavioral Triggers",
                  "Lead Scoring & Grading",
                  "Social Media Scheduling",
                  "Landing Page Builder",
                  "SMS Marketing",
                  "Advanced Segmentation",
                  "Real-time Analytics",
                  "CRM Integration",
                  "Webhook Automation",
                  "Custom Fields & Tags"
                ].map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 + index * 0.05 }}
                    className="flex items-center text-gray-300"
                  >
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-400/30 rounded-3xl p-12"
          >
            <h3 className="text-4xl font-bold text-white mb-6">
              Ready to Automate Your Marketing?
            </h3>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Join thousands of marketers using KenjiAI to create campaigns that convert.
              Get started today and see results in the first week.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.a
                href="/pricing"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-lg transition-all duration-300 flex items-center gap-3"
              >
                Get Started Now
                <ArrowRight className="w-6 h-6" />
              </motion.a>

              <motion.a
                href="/free-tools"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-800 border border-gray-600 hover:border-purple-400 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300"
              >
                Try Free Tools First
              </motion.a>
            </div>

            <p className="text-gray-500 text-sm mt-6">
              Quick setup • See results fast • Full feature access
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default MarketingAutomationPage;