import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Target, BarChart3, ArrowRight, CheckCircle, Star, Calendar, DollarSign } from 'lucide-react';

const CRMPage: React.FC = () => {
  const crmFeatures = [
    {
      icon: Users,
      title: "Contact Management",
      description: "Centralize all customer data with AI-powered insights and relationship tracking",
      benefits: ["360° customer view", "Interaction history", "AI-powered insights"]
    },
    {
      icon: Target,
      title: "Sales Pipeline",
      description: "Visual pipeline management with automated deal progression and forecasting",
      benefits: ["Visual pipeline", "Automated workflows", "Sales forecasting"]
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Real-time dashboards and reports to track performance and identify opportunities",
      benefits: ["Real-time dashboards", "Custom reports", "Performance tracking"]
    },
    {
      icon: Calendar,
      title: "Task Automation",
      description: "Automate follow-ups, reminders, and routine tasks to never miss an opportunity",
      benefits: ["Automated follow-ups", "Smart reminders", "Task scheduling"]
    }
  ];

  const pipelineStages = [
    {
      stage: "Lead Generation",
      description: "Capture and qualify leads from multiple sources automatically",
      features: ["Multi-channel capture", "Lead scoring", "Auto-qualification"],
      icon: Target
    },
    {
      stage: "Opportunity Management",
      description: "Track deals through your sales process with intelligent insights",
      features: ["Deal tracking", "Win probability", "Next best actions"],
      icon: TrendingUp
    },
    {
      stage: "Customer Success",
      description: "Manage relationships and identify upsell opportunities",
      features: ["Relationship mapping", "Upsell alerts", "Satisfaction tracking"],
      icon: Users
    }
  ];

  const results = [
    { metric: "35%", label: "Faster Sales Cycle", description: "Automated workflows speed up deals" },
    { metric: "250%", label: "More Qualified Leads", description: "AI-powered lead scoring and routing" },
    { metric: "40%", label: "Higher Close Rate", description: "Better insights and follow-up automation" },
    { metric: "60%", label: "Time Savings", description: "Automated data entry and task management" }
  ];

  return (
    <>
      {/* SEO Head */}
      <title>AI-Powered CRM Platform | KenjiAI - Sales Pipeline, Contact Management & Analytics</title>
      <meta name="description" content="Complete CRM solution with AI automation. Manage contacts, sales pipeline, and customer relationships. 35% faster sales cycle, 250% more qualified leads." />
      <meta name="keywords" content="CRM software, sales pipeline, contact management, customer relationship management, sales automation, AI CRM" />
      
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
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-full px-6 py-3 mb-6"
            >
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-semibold">AI-Powered CRM</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                CRM That Actually
              </span>
              <br />
              <span className="text-white">Helps You Sell More</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed mb-12">
              Stop managing spreadsheets. Start with an AI-powered CRM that automates data entry, 
              predicts deal outcomes, and helps you close more deals faster.
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
                  <div className="text-3xl font-bold text-blue-400 mb-2">{result.metric}</div>
                  <div className="text-white font-semibold mb-1">{result.label}</div>
                  <div className="text-gray-400 text-sm">{result.description}</div>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="/pricing"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-lg transition-all duration-300"
            >
              <Users className="w-6 h-6" />
              Start Managing Customers
              <ArrowRight className="w-6 h-6" />
            </motion.a>
          </motion.div>

          {/* CRM Features */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-20"
          >
            <h2 className="text-4xl font-bold text-white mb-12 text-center">
              Complete CRM Solution
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {crmFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gray-800/50 border border-gray-700 hover:border-blue-400/50 rounded-2xl p-8 transition-all duration-300"
                >
                  <feature.icon className="w-12 h-12 text-blue-400 mb-6" />
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

          {/* Pipeline Stages */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-20"
          >
            <h2 className="text-4xl font-bold text-white mb-12 text-center">
              Sales Pipeline Management
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {pipelineStages.map((stage, index) => (
                <motion.div
                  key={stage.stage}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="bg-gray-800/50 border border-gray-700 hover:border-cyan-400/50 rounded-2xl p-8 text-center transition-all duration-300"
                >
                  <stage.icon className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">{stage.stage}</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">{stage.description}</p>
                  
                  <div className="space-y-2">
                    {stage.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center justify-center text-blue-400 text-sm">
                        <Star className="w-3 h-3 mr-2 fill-current" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Integration Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-20"
          >
            <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-400/30 rounded-3xl p-12">
              <h3 className="text-4xl font-bold text-white mb-8 text-center">
                Integrates with Everything You Use
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
                {[
                  "Email Platforms",
                  "Calendar Apps",
                  "Social Media",
                  "Accounting Software",
                  "Marketing Tools",
                  "Communication Apps",
                  "E-commerce Platforms",
                  "Analytics Tools",
                  "Project Management",
                  "Document Storage",
                  "Payment Processors",
                  "Custom APIs"
                ].map((integration, index) => (
                  <motion.div
                    key={integration}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 + index * 0.05 }}
                    className="bg-gray-800/50 rounded-xl p-4 text-center hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="text-blue-400 font-semibold text-sm">{integration}</div>
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center">
                <p className="text-gray-400 mb-6">
                  Connect your existing tools or use our built-in alternatives. 
                  Everything syncs automatically.
                </p>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
                  View All Integrations
                </button>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-400/30 rounded-3xl p-12"
          >
            <h3 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Sales Process?
            </h3>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Join thousands of sales teams using KenjiAI CRM to close more deals faster. 
              Get started risk-free with our 30-day money-back guarantee and see results immediately.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.a
                href="/pricing"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-lg transition-all duration-300 flex items-center gap-3"
              >
                Get Started Risk-Free
                <ArrowRight className="w-6 h-6" />
              </motion.a>
              
              <motion.a
                href="/free-tools"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-800 border border-gray-600 hover:border-blue-400 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300"
              >
                Try Free Tools First
              </motion.a>
            </div>
            
            <p className="text-gray-500 text-sm mt-6">
              30-day money-back guarantee • Full access • Import your existing data
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CRMPage;