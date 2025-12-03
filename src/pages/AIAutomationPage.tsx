import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, TrendingUp, Users, ArrowRight, CheckCircle, Star, Target, Rocket } from 'lucide-react';

const AIAutomationPage: React.FC = () => {
  const automationFeatures = [
    {
      icon: Brain,
      title: "Intelligent Workflows",
      description: "AI-powered workflows that adapt and optimize based on performance data",
      benefits: ["85% time savings", "99.9% accuracy", "24/7 operation"]
    },
    {
      icon: Zap,
      title: "Smart Decision Making",
      description: "AI makes complex business decisions using real-time data analysis",
      benefits: ["300% faster decisions", "Data-driven insights", "Predictive analytics"]
    },
    {
      icon: TrendingUp,
      title: "Performance Optimization",
      description: "Continuous learning and improvement of all automated processes",
      benefits: ["Self-improving systems", "ROI optimization", "Efficiency gains"]
    },
    {
      icon: Users,
      title: "Customer Intelligence",
      description: "AI understands customer behavior and personalizes every interaction",
      benefits: ["Personalized experiences", "Higher satisfaction", "Increased loyalty"]
    }
  ];

  const useCases = [
    {
      industry: "E-commerce",
      challenge: "Managing inventory and customer service at scale",
      solution: "AI automates inventory management, customer support, and personalized recommendations",
      results: ["40% reduction in stockouts", "90% of support tickets automated", "25% increase in sales"]
    },
    {
      industry: "SaaS",
      challenge: "Lead qualification and customer onboarding",
      solution: "AI qualifies leads, automates onboarding, and predicts churn risk",
      results: ["60% faster lead qualification", "80% onboarding automation", "35% churn reduction"]
    },
    {
      industry: "Professional Services",
      challenge: "Client communication and project management",
      solution: "AI handles client communications, schedules meetings, and tracks project progress",
      results: ["50% time savings", "95% client satisfaction", "200% capacity increase"]
    }
  ];

  const benefits = [
    { metric: "85%", label: "Time Savings", description: "Automate repetitive tasks" },
    { metric: "300%", label: "ROI Increase", description: "Maximize business efficiency" },
    { metric: "24/7", label: "Operation", description: "Never-stopping automation" },
    { metric: "99.9%", label: "Accuracy", description: "Eliminate human errors" }
  ];

  return (
    <>
      {/* SEO Head */}
      <title>AI Business Automation Platform | KenjiAI - Automate Operations & Scale Growth</title>
      <meta name="description" content="Transform your business with AI automation. Automate workflows, customer service, sales processes, and operations. 85% time savings, 300% ROI increase. Start free trial." />
      <meta name="keywords" content="AI automation, business automation, workflow automation, AI business processes, intelligent automation, business AI platform" />
      
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
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-full px-6 py-3 mb-6"
            >
              <Brain className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-semibold">AI Business Automation</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Automate Everything
              </span>
              <br />
              <span className="text-white">with Intelligent AI</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed mb-12">
              Transform your business operations with AI that thinks, learns, and optimizes. 
              Automate complex workflows, eliminate manual tasks, and scale without limits.
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-blue-400 mb-2">{benefit.metric}</div>
                  <div className="text-white font-semibold mb-1">{benefit.label}</div>
                  <div className="text-gray-400 text-sm">{benefit.description}</div>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="/pricing"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-lg transition-all duration-300"
            >
              <Rocket className="w-6 h-6" />
              Start Automating Today
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
              Intelligent Automation Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {automationFeatures.map((feature, index) => (
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

          {/* Use Cases */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-20"
          >
            <h2 className="text-4xl font-bold text-white mb-12 text-center">
              Real-World Success Stories
            </h2>
            
            <div className="space-y-8">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={useCase.industry}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 + index * 0.2 }}
                  className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-4">{useCase.industry}</h3>
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-red-400 mb-2">Challenge</h4>
                        <p className="text-gray-400 text-sm">{useCase.challenge}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-blue-400 mb-2">AI Solution</h4>
                      <p className="text-gray-400 text-sm">{useCase.solution}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-green-400 mb-2">Results</h4>
                      <div className="space-y-1">
                        {useCase.results.map((result, idx) => (
                          <div key={idx} className="flex items-center text-green-400 text-sm">
                            <Star className="w-3 h-3 mr-2 fill-current" />
                            {result}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-400/30 rounded-3xl p-12"
          >
            <h3 className="text-4xl font-bold text-white mb-6">
              Ready to Automate Your Business?
            </h3>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Join thousands of businesses using KenjiAI to automate operations, 
              reduce costs, and scale without limits. Start your free trial today.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.a
                href="/pricing"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-lg transition-all duration-300 flex items-center gap-3"
              >
                Start Free Trial
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
              16-day free trial • No credit card required • Cancel anytime
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AIAutomationPage;