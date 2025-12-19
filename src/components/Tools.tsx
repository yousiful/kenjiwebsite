import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Zap, Users, Megaphone, Brain } from 'lucide-react';

const Tools: React.FC = () => {
  const tools = [
    {
      name: "Prompt Generator",
      description: "Generate perfect AI prompts for any use case with intelligent optimization",
      url: "https://prompt.kenjiai.com",
      icon: Brain,
      gradient: "from-purple-500 to-pink-600",
      features: ["Smart Templates", "Prompt Optimization", "Multi-Model Support"]
    },
    {
      name: "PR Pro",
      description: "AI-powered PR campaigns that get you noticed by the right people",
      url: "https://prpro.kenjiai.com/",
      icon: Megaphone,
      gradient: "from-pink-500 to-purple-600",
      features: ["Media Outreach", "Press Releases", "Brand Monitoring"]
    },
    {
      name: "Sales Coach",
      description: "Your personal AI sales trainer that helps close more deals",
      url: "https://salescoach.kenjiai.com/",
      icon: Zap,
      gradient: "from-blue-500 to-cyan-600",
      features: ["Script Generation", "Objection Handling", "Performance Analytics"]
    },
    {
      name: "Investor Portal",
      description: "Connect with investors and manage funding opportunities",
      url: "https://investors.kenjiai.com/",
      icon: Users,
      gradient: "from-green-500 to-emerald-600",
      features: ["Pitch Decks", "Investor Matching", "Due Diligence"]
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 relative overflow-hidden" aria-labelledby="tools-heading">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
          role="region"
        >
          <h2 id="tools-heading" className="text-4xl sm:text-5xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Specialized AI Tools
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Purpose-built AI tools for specific business needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8" role="list">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ 
                scale: 1.02,
                y: -10,
                transition: { duration: 0.3 }
              }}
              role="listitem"
              className="group relative"
            >
              <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-blue-400/50 rounded-3xl p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 h-full">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${tool.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <tool.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-gray-400 mb-6 leading-relaxed group-hover:text-gray-300 transition-colors">
                    {tool.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-8">
                    {tool.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-300">
                        <div className={`w-2 h-2 bg-gradient-to-r ${tool.gradient} rounded-full mr-3`}></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <motion.a
                    href={tool.url}
                    aria-label={`Launch ${tool.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`inline-flex items-center gap-2 bg-gradient-to-r ${tool.gradient} text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30`}
                  >
                    Launch Tool
                    <ExternalLink className="w-4 h-4" />
                  </motion.a>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tools;