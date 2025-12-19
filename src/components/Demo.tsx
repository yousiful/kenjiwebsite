import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, Tablet, ArrowRight } from 'lucide-react';

const Demo: React.FC = () => {
  const demoFeatures = [
    {
      title: "AI Voice Agents",
      description: "Watch our AI handle real sales calls and close deals",
      time: "0:45",
      category: "Sales Automation"
    },
    {
      title: "Smart Workflows",
      description: "See campaigns that run themselves with AI optimization",
      time: "2:30",
      category: "Marketing Automation"
    },
    {
      title: "Complete Dashboard",
      description: "Comprehensive business management and analytics hub",
      time: "4:15",
      category: "Business Intelligence"
    },
    {
      title: "CRM Integration",
      description: "Seamless customer relationship management automation",
      time: "6:20",
      category: "Customer Management"
    }
  ];

  return (
    <section className="py-24 bg-gray-900/50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-green-400/5"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Experience KenjiAI in Action
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            See how our AI platform transforms businesses with real-time automation and intelligent workflows
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Demo Interface Mockup */}
          <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-700">
            <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-400 text-sm">KenjiAI Dashboard</span>
                </div>
                <div className="flex items-center gap-4">
                  <Monitor className="w-5 h-5 text-blue-400" />
                  <Tablet className="w-5 h-5 text-gray-400" />
                  <Smartphone className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-green-900/20 relative">
              {/* Dashboard Preview */}
              <div className="absolute inset-4 bg-gray-900/80 rounded-2xl border border-gray-600 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                  {/* Live Metrics */}
                  <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4">
                    <h4 className="text-blue-400 font-semibold mb-2">Live AI Activity</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-gray-300 text-sm">Voice agent handling call</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <span className="text-gray-300 text-sm">Campaign optimizing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                        <span className="text-gray-300 text-sm">Lead scoring update</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Chart */}
                  <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-4">
                    <h4 className="text-green-400 font-semibold mb-2">Performance</h4>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-white">$47,293</div>
                      <div className="text-green-400 text-sm">+201% today</div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full w-3/4"></div>
                      </div>
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div className="bg-purple-500/10 border border-purple-400/30 rounded-xl p-4">
                    <h4 className="text-purple-400 font-semibold mb-2">AI Insights</h4>
                    <div className="space-y-2">
                      <div className="text-gray-300 text-sm">Best call time: 2-4 PM</div>
                      <div className="text-gray-300 text-sm">Top keyword: "automation"</div>
                      <div className="text-gray-300 text-sm">Conversion rate: 34.2%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Play Button Overlay */}
              <motion.div
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: "0 0 40px rgba(59, 130, 246, 0.4)"
                }}
                whileTap={{ scale: 0.9 }}
                className="absolute inset-0 flex items-center justify-center cursor-pointer group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-green-500 w-20 h-20 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Demo Info */}
            <div className="bg-gray-800/50 p-6">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <h3 className="font-semibold mb-1">KenjiAI Platform Demo</h3>
                  <p className="text-sm text-gray-300">Complete Business Automation Walkthrough</p>
                </div>
                <motion.a
                  href="/pricing"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  Try It Free
                  <ArrowRight className="w-4 h-4" />
                </motion.a>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {demoFeatures.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 cursor-pointer hover:border-blue-400/50 transition-all duration-300"
                data-caption={`${item.title}: ${item.description}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                  <span className="text-sm text-blue-400 bg-blue-400/10 px-2 py-1 rounded-lg">
                    Demo
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3">{item.description}</p>
                <div className="text-blue-400 text-xs font-semibold">{item.category}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.a
            href="/pricing"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-green-500 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
            data-caption="Start your business transformation today"
          >
            Get Started Now
            <ArrowRight className="w-6 h-6" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Demo;