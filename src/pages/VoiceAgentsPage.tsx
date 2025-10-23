import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Phone, MessageCircle, TrendingUp, ArrowRight, CheckCircle, Star, Clock, DollarSign } from 'lucide-react';

const VoiceAgentsPage: React.FC = () => {
  const voiceFeatures = [
    {
      icon: Mic,
      title: "Natural Conversations",
      description: "AI voice agents that sound human and understand context, emotion, and intent",
      benefits: ["Human-like speech", "Emotional intelligence", "Context awareness"]
    },
    {
      icon: Phone,
      title: "24/7 Availability",
      description: "Never miss a call or opportunity with AI agents working around the clock",
      benefits: ["Always available", "No breaks needed", "Global time zones"]
    },
    {
      icon: MessageCircle,
      title: "Smart Call Handling",
      description: "Qualify leads, book appointments, handle objections, and close deals automatically",
      benefits: ["Lead qualification", "Appointment booking", "Deal closing"]
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Track call performance, conversion rates, and optimize for better results",
      benefits: ["Call analytics", "Conversion tracking", "Performance optimization"]
    }
  ];

  const callTypes = [
    {
      type: "Sales Calls",
      description: "AI agents that qualify leads, present offers, handle objections, and close deals",
      metrics: ["85% qualification accuracy", "60% faster sales cycle", "300% more calls handled"],
      icon: DollarSign
    },
    {
      type: "Customer Support",
      description: "Handle customer inquiries, troubleshoot issues, and provide instant solutions",
      metrics: ["90% issue resolution", "< 30 second response", "24/7 availability"],
      icon: MessageCircle
    },
    {
      type: "Appointment Booking",
      description: "Schedule meetings, confirm appointments, and manage calendars automatically",
      metrics: ["95% booking accuracy", "Zero double bookings", "Instant confirmations"],
      icon: Clock
    }
  ];

  const results = [
    { metric: "85%", label: "Lead Qualification Rate", description: "Accurately identify qualified prospects" },
    { metric: "300%", label: "More Calls Handled", description: "Scale without hiring more staff" },
    { metric: "60%", label: "Faster Sales Cycle", description: "Close deals in record time" },
    { metric: "24/7", label: "Availability", description: "Never miss an opportunity" }
  ];

  return (
    <>
      {/* SEO Head */}
      <title>AI Voice Agents for Sales & Customer Service | KenjiAI - 24/7 Automated Calling</title>
      <meta name="description" content="AI voice agents that handle sales calls, customer service, and appointment booking 24/7. 85% qualification rate, 300% more calls handled. Human-like conversations that close deals." />
      <meta name="keywords" content="AI voice agents, automated calling, AI phone calls, voice AI, sales automation, customer service automation, AI receptionist" />
      
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
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-blue-400/30 rounded-full px-6 py-3 mb-6"
            >
              <Mic className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-semibold">AI Voice Agents</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                AI Voice Agents
              </span>
              <br />
              <span className="text-white">That Close Deals 24/7</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed mb-12">
              Human-like AI voice agents that handle sales calls, customer service, and appointment booking. 
              Never miss a lead, always available, and consistently high-performing.
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
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-green-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-lg transition-all duration-300"
            >
              <Phone className="w-6 h-6" />
              Start Your Voice Agent
              <ArrowRight className="w-6 h-6" />
            </motion.a>
          </motion.div>

          {/* Voice Features */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-20"
          >
            <h2 className="text-4xl font-bold text-white mb-12 text-center">
              Advanced Voice AI Capabilities
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {voiceFeatures.map((feature, index) => (
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

          {/* Call Types */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-20"
          >
            <h2 className="text-4xl font-bold text-white mb-12 text-center">
              What Our Voice Agents Can Do
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {callTypes.map((callType, index) => (
                <motion.div
                  key={callType.type}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="bg-gray-800/50 border border-gray-700 hover:border-green-400/50 rounded-2xl p-8 text-center transition-all duration-300"
                >
                  <callType.icon className="w-16 h-16 text-green-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">{callType.type}</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">{callType.description}</p>
                  
                  <div className="space-y-2">
                    {callType.metrics.map((metric, idx) => (
                      <div key={idx} className="flex items-center justify-center text-blue-400 text-sm">
                        <Star className="w-3 h-3 mr-2 fill-current" />
                        {metric}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Demo Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-20"
          >
            <div className="bg-gradient-to-r from-blue-900/30 to-green-900/30 border border-blue-400/30 rounded-3xl p-12 text-center">
              <h3 className="text-4xl font-bold text-white mb-6">
                Hear Your Voice Agent in Action
              </h3>
              <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
                Listen to real conversations between our AI voice agents and customers. 
                Experience the natural, human-like interactions that close deals.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800/50 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-white mb-2">Sales Call Demo</h4>
                  <p className="text-gray-400 text-sm mb-4">AI agent qualifying a lead and booking a demo</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    ▶ Play Demo
                  </button>
                </div>
                
                <div className="bg-gray-800/50 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-white mb-2">Support Call Demo</h4>
                  <p className="text-gray-400 text-sm mb-4">AI agent resolving a customer issue</p>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    ▶ Play Demo
                  </button>
                </div>
                
                <div className="bg-gray-800/50 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-white mb-2">Booking Call Demo</h4>
                  <p className="text-gray-400 text-sm mb-4">AI agent scheduling an appointment</p>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    ▶ Play Demo
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center bg-gradient-to-r from-blue-900/30 to-green-900/30 border border-blue-400/30 rounded-3xl p-12"
          >
            <h3 className="text-4xl font-bold text-white mb-6">
              Ready to Deploy Your Voice Agent?
            </h3>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Test our AI voice agents risk-free with our 30-day money-back guarantee.
              No setup fees, no long-term contracts, just results.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.a
                href="/pricing"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-lg transition-all duration-300 flex items-center gap-3"
              >
                Get Started Now
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
              30-day money-back guarantee • Setup in minutes • Cancel anytime
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default VoiceAgentsPage;