import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Zap, Users, Megaphone, MessageSquare, Brain, Code, BarChart3, Globe, Palette, ArrowRight } from 'lucide-react';

const ToolsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const tools = [
    {
      name: "Prompt Generator",
      description: "Generate perfect AI prompts for any use case with our intelligent prompt engineering tool",
      url: "https://prompt.kenjiai.com",
      icon: Brain,
      gradient: "from-purple-500 to-pink-600",
      features: ["Smart Templates", "Prompt Optimization", "Multi-Model Support"],
      category: "AI Tools"
    },
    {
      name: "PR Pro",
      description: "AI-powered PR campaigns that get you noticed by the right people and media outlets",
      url: "https://prpro.kenjiai.com/",
      icon: Megaphone,
      gradient: "from-pink-500 to-purple-600",
      features: ["Media Outreach", "Press Releases", "Brand Monitoring"],
      category: "Marketing"
    },
    {
      name: "Sales Coach",
      description: "Your personal AI sales trainer that helps close more deals with data-driven insights",
      url: "https://salescoach.kenjiai.com/",
      icon: Zap,
      gradient: "from-blue-500 to-cyan-600",
      features: ["Script Generation", "Objection Handling", "Performance Analytics"],
      category: "Sales"
    },
    {
      name: "Investor Portal",
      description: "Connect with investors and manage funding opportunities with AI-powered matching",
      url: "https://investors.kenjiai.com/",
      icon: Users,
      gradient: "from-green-500 to-emerald-600",
      features: ["Pitch Decks", "Investor Matching", "Due Diligence"],
      category: "Business"
    },
    {
      name: "AI Content Creator",
      description: "Generate high-converting content for blogs, social media, and marketing campaigns",
      url: "https://app.kenjicrm.com",
      icon: Palette,
      gradient: "from-orange-500 to-red-600",
      features: ["Blog Posts", "Social Content", "Ad Copy"],
      category: "Content",
      insideKenjiAI: true
    },
    {
      name: "Smart Analytics Dashboard",
      description: "Comprehensive business intelligence and performance tracking across all platforms",
      url: "https://app.kenjicrm.com",
      icon: BarChart3,
      gradient: "from-indigo-500 to-blue-600",
      features: ["Real-time Data", "Custom Reports", "Predictive Analytics"],
      category: "Analytics",
      insideKenjiAI: true
    },
    {
      name: "AI Website Builder",
      description: "Create stunning, high-converting websites with AI-powered design and optimization",
      url: "https://app.kenjicrm.com",
      icon: Globe,
      gradient: "from-teal-500 to-green-600",
      features: ["Drag & Drop", "AI Design", "SEO Optimization"],
      category: "Web Tools",
      insideKenjiAI: true
    },
    {
      name: "Smart Chatbots",
      description: "Intelligent conversational AI that handles customer service and lead qualification",
      url: "https://app.kenjicrm.com",
      icon: MessageSquare,
      gradient: "from-cyan-500 to-blue-600",
      features: ["24/7 Support", "Lead Qualification", "Multi-language"],
      category: "AI Tools",
      insideKenjiAI: true
    },
    {
      name: "Social Media Planner",
      description: "AI-powered social media content creation and scheduling across all platforms",
      url: "https://app.kenjicrm.com",
      icon: Users,
      gradient: "from-pink-500 to-rose-600",
      features: ["Content Generation", "Auto-scheduling", "Analytics"],
      category: "Marketing",
      insideKenjiAI: true
    },
    {
      name: "API Playground",
      description: "Test and integrate KenjiAI's powerful APIs into your existing business systems",
      url: "#",
      icon: Code,
      gradient: "from-gray-500 to-gray-700",
      features: ["API Testing", "Documentation", "Code Examples"],
      category: "Developer",
      comingSoon: true
    }
  ];

  const categories = ["All", "AI Tools", "Marketing", "Sales", "Business", "Content", "Analytics", "Web Tools", "Developer"];

  const filteredTools = selectedCategory === "All" 
    ? tools 
    : tools.filter(tool => tool.category === selectedCategory);

  const searchFilteredTools = searchQuery 
    ? filteredTools.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredTools;

  return (
    <>
      {/* SEO Head */}
      <title>AI-Powered Business Tools | KenjiAI Platform</title>
      <meta name="description" content="Comprehensive suite of AI tools for business automation: voice agents, chatbots, content creation, analytics, CRM, and more. Many tools integrated into the KenjiAI platform." />
      <meta name="keywords" content="AI tools, business automation tools, AI chatbots, voice agents, content creation, analytics, CRM tools, marketing automation" />
      
      <div className="pt-24 pb-16 bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                AI-Powered Business Tools
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
              A comprehensive suite of AI tools designed to automate, optimize, and scale every aspect of your business operations
            </p>
            
            {/* KenjiAI Platform Highlight */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-blue-400/30 rounded-full px-6 py-3 mb-8"
            >
              <Zap className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-semibold">Many tools are built into the KenjiAI platform</span>
            </motion.div>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative mb-8">
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors"
              />
            </div>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {searchFilteredTools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="group relative"
              >
                <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-blue-400/50 rounded-3xl p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 h-full">
                  {/* Badge */}
                  {tool.comingSoon && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                      Coming Soon
                    </div>
                  )}
                  
                  {tool.insideKenjiAI && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                      Inside KenjiAI
                    </div>
                  )}

                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>
                  
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${tool.gradient} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <tool.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="mb-2">
                      <span className="text-xs text-blue-400 font-semibold uppercase tracking-wide">
                        {tool.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-gray-400 mb-4 leading-relaxed group-hover:text-gray-300 transition-colors text-sm">
                      {tool.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-1 mb-6">
                      {tool.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-xs text-gray-300">
                          <div className={`w-1.5 h-1.5 bg-gradient-to-r ${tool.gradient} rounded-full mr-2`}></div>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    {tool.comingSoon ? (
                      <div className="bg-gray-700 text-gray-400 px-4 py-2 rounded-xl font-semibold text-center cursor-not-allowed">
                        Coming Soon
                      </div>
                    ) : tool.insideKenjiAI ? (
                      <motion.a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Access ${tool.name}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`inline-flex items-center gap-2 bg-gradient-to-r ${tool.gradient} text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 text-sm w-full justify-center`}
                      >
                        Access in KenjiAI
                        <ArrowRight className="w-4 h-4" />
                      </motion.a>
                    ) : (
                      <motion.a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`inline-flex items-center gap-2 bg-gradient-to-r ${tool.gradient} text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 text-sm w-full justify-center`}
                      >
                        Launch Tool
                        <ExternalLink className="w-4 h-4" />
                      </motion.a>
                    )}
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {searchFilteredTools.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-bold text-gray-400 mb-2">No tools found</h3>
              <p className="text-gray-500">Try adjusting your search or browse different categories</p>
            </div>
          )}

          {/* Platform CTA */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-blue-900/30 to-green-900/30 border border-blue-400/30 rounded-3xl p-8">
              <h3 className="text-3xl font-bold text-white mb-4">
                Get All Tools in One Platform
              </h3>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                One platform. AI chatbots, social media planner, content creator, analytics, and more. All integrated.
              </p>
              <motion.a
                href="/pricing"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ToolsPage;