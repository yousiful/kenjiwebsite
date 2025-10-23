import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Zap, Users, Megaphone, Brain, Star, ArrowRight, Gift, Sparkles, Search, TrendingUp, Share2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import SocialProofNotifications from '../components/SocialProofNotifications';

const FreeToolsPage: React.FC = () => {
  const freeTools = [
    {
      name: "AI Prompt Generator",
      description: "Generate perfect AI prompts for any use case with our intelligent prompt engineering tool. Create optimized prompts for ChatGPT, Claude, GPT-4, and other AI models. Free forever, no signup required.",
      url: "https://prompt.kenjiai.com",
      icon: Brain,
      gradient: "from-purple-500 to-pink-600",
      features: ["Smart Templates", "Prompt Optimization", "Multi-Model Support", "Export Options"],
      category: "AI Tools",
      rating: 4.9,
      users: "50K+",
      keywords: ["prompt generator", "AI prompts", "ChatGPT prompts", "GPT-4 prompts", "Claude prompts", "prompt engineering"],
      revenue: "Saves $500/month on AI costs"
    },
    {
      name: "PR Pro - Free AI PR Tool",
      description: "AI-powered PR campaigns that get you noticed by the right people and media outlets. Generate press releases, media lists, and outreach templates. Free AI PR automation tool.",
      url: "https://prpro.kenjiai.com/",
      icon: Megaphone,
      gradient: "from-pink-500 to-purple-600",
      features: ["Media Outreach", "Press Releases", "Brand Monitoring", "Campaign Analytics"],
      category: "Marketing",
      rating: 4.8,
      users: "25K+",
      keywords: ["free PR tool", "AI PR", "press release generator", "media outreach", "PR automation", "public relations AI"],
      revenue: "Generates $10K+ in free publicity"
    },
    {
      name: "Sales Coach AI - Free Sales Training",
      description: "Your personal AI sales trainer that helps close more deals with data-driven insights, objection handling, and performance optimization. Free AI sales coaching and training.",
      url: "https://salescoach.kenjiai.com/",
      icon: Zap,
      gradient: "from-blue-500 to-cyan-600",
      features: ["Script Generation", "Objection Handling", "Performance Analytics", "Training Modules"],
      category: "Sales",
      rating: 4.9,
      users: "35K+",
      keywords: ["free sales coach", "AI sales training", "sales automation", "sales scripts", "objection handling", "sales AI"],
      revenue: "Increases deal close rate by 40%"
    },
    {
      name: "Investor Connect - Free Startup Tool",
      description: "Connect with investors and manage funding opportunities with AI-powered matching, pitch deck optimization, and due diligence preparation. Free startup and investor tools.",
      url: "https://investors.kenjiai.com/",
      icon: Users,
      gradient: "from-green-500 to-emerald-600",
      features: ["Pitch Deck Builder", "Investor Matching", "Due Diligence", "Funding Tracker"],
      category: "Business",
      rating: 4.7,
      users: "15K+",
      keywords: ["free investor tools", "startup tools", "pitch deck generator", "investor matching", "funding tools", "startup AI"],
      revenue: "Helps raise $50M+ in funding"
    },
    {
      name: "ViralPost Pro - Free Viral Content Creator",
      description: "Create viral social media content that gets maximum engagement and shares. AI-powered viral content templates, trending hashtags, and engagement optimization. Free viral content creation tool.",
      url: "https://viralpost.kenjiai.com",
      icon: Share2,
      gradient: "from-pink-500 to-rose-600",
      features: ["Viral Templates", "Trending Hashtags", "Engagement Analytics", "Content Optimization"],
      category: "Marketing",
      rating: 4.8,
      users: "20K+",
      keywords: ["free viral content creator", "viral social media posts", "AI content creation", "viral marketing", "social media automation", "viral post generator"],
      revenue: "Generates 500% more engagement"
    }
  ];

  const benefits = [
    {
      icon: Gift,
      title: "100% Free Forever",
      description: "No hidden costs, no credit card required, no time limits - start making money immediately"
    },
    {
      icon: Zap,
      title: "Instant Revenue Impact",
      description: "Start generating results immediately - no lengthy setup or learning curve required"
    },
    {
      icon: Star,
      title: "Premium Quality",
      description: "Same AI technology powering our paid platform that generates millions in revenue"
    },
    {
      icon: Users,
      title: "Success Community",
      description: "Join thousands of users sharing money-making tips and revenue strategies"
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Free AI Tools That Make Money - Revenue-Generating AI Tools by KenjiAI",
    "description": "Collection of free AI tools that help businesses generate revenue. No signup required, 100% free forever. Used by 125K+ entrepreneurs to make money with AI.",
    "url": "https://kenjiai.com/free-tools",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Free Revenue-Generating AI Tools",
      "itemListElement": freeTools.map((tool, index) => ({
        "@type": "SoftwareApplication",
        "position": index + 1,
        "name": tool.name,
        "description": tool.description,
        "url": tool.url,
        "applicationCategory": "BusinessApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": tool.rating,
          "ratingCount": parseInt(tool.users.replace('K+', '000'))
        }
      }))
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://kenjiai.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Free AI Tools That Make Money",
          "item": "https://kenjiai.com/free-tools"
        }
      ]
    }
  };

  return (
    <>
      <Helmet>
        <title>Free AI Tools That Make Money | KenjiAI - Revenue-Generating AI Tools, Prompt Generator, PR Tools, Sales Coach</title>
        <meta name="description" content="Free AI tools that help you make money: AI Prompt Generator for ChatGPT/GPT-4, PR Pro for media outreach, Sales Coach for closing deals, and Investor Connect for startups. No signup required, 100% free forever. Used by 125K+ entrepreneurs to generate revenue with AI." />
        <meta name="keywords" content="free AI tools that make money, revenue generating AI tools, AI prompt generator, free PR tools, AI sales coach, free startup tools, ChatGPT prompts, GPT-4 prompts, AI business tools, free marketing tools, AI automation tools, prompt engineering, free AI software, business automation, AI productivity tools, free AI apps, money making AI tools" />
        <link rel="canonical" href="https://kenjiai.com/free-tools" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <div className="pt-24 pb-16 bg-gray-900 min-h-screen">
        <SocialProofNotifications />
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
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-full px-6 py-3 mb-6"
            >
              <Gift className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">Free AI Tools That Make Money</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Free AI Tools That
              </span>
              <br />
              <span className="text-white">Generate Real Revenue</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed mb-8">
              Stop paying for tools that don't make you money. Access powerful AI tools that help you generate revenue, 
              close deals, and grow your business - completely free. No signup required, no credit card needed, 
              no time limits. Start making money with AI today.
            </p>

            {/* Enhanced Revenue Keywords Section */}
            <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6 mb-8 max-w-4xl mx-auto">
              <h2 className="text-lg font-semibold text-white mb-4">💰 Revenue-Generating Free Tools</h2>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "AI Prompt Generator", "ChatGPT Prompts", "GPT-4 Prompts", "Free PR Tools", 
                  "AI Sales Coach", "Startup Tools", "AI Marketing", "Business Automation",
                  "Prompt Engineering", "AI Content Creation", "Free AI Software", "AI Productivity",
                  "Revenue Generation", "Money Making AI", "Free Business Tools", "AI Profit Tools"
                ].map((keyword, index) => (
                  <span key={index} className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">125K+</div>
                <div className="text-gray-400 text-sm">Revenue Generators</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">$50M+</div>
                <div className="text-gray-400 text-sm">Revenue Generated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">100%</div>
                <div className="text-gray-400 text-sm">Free Forever</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400">0s</div>
                <div className="text-gray-400 text-sm">Setup Time</div>
              </div>
            </div>
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gray-800/50 border border-gray-700 hover:border-green-400/50 rounded-2xl p-6 text-center transition-all duration-300"
              >
                <benefit.icon className="w-10 h-10 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Free Tools Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              Choose Your Revenue-Generating AI Tool
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {freeTools.map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group relative bg-gray-800/50 border border-gray-700 hover:border-green-400/50 rounded-3xl p-8 transition-all duration-500"
                >
                  {/* Free Badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                    FREE
                  </div>

                  <div className="flex items-start gap-6">
                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-br ${tool.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <tool.icon className="w-8 h-8 text-white" />
                    </div>

                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-2xl font-bold text-white group-hover:text-green-300 transition-colors">
                            {tool.name}
                          </h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-green-400 font-semibold bg-green-400/10 px-2 py-1 rounded">
                              {tool.category}
                            </span>
                            <div className="flex items-center text-yellow-400 text-sm">
                              <Star className="w-4 h-4 mr-1 fill-current" />
                              {tool.rating}
                            </div>
                            <div className="text-gray-400 text-sm">
                              {tool.users} users
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-400 mb-6 leading-relaxed">
                        {tool.description}
                      </p>

                      {/* Revenue Impact */}
                      <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-3 mb-4">
                        <div className="text-green-400 font-semibold text-sm">💰 Revenue Impact</div>
                        <div className="text-green-300 text-sm">{tool.revenue}</div>
                      </div>

                      {/* Features */}
                      <div className="grid grid-cols-2 gap-2 mb-6">
                        {tool.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-300">
                            <div className={`w-1.5 h-1.5 bg-gradient-to-r ${tool.gradient} rounded-full mr-2`}></div>
                            {feature}
                          </div>
                        ))}
                      </div>

                      {/* Keywords for SEO */}
                      <div className="mb-4">
                        <div className="text-xs text-gray-500 mb-2">Popular searches:</div>
                        <div className="flex flex-wrap gap-1">
                          {tool.keywords.slice(0, 3).map((keyword, idx) => (
                            <span key={idx} className="text-xs bg-gray-700/50 text-gray-400 px-2 py-1 rounded">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <motion.a
                        href={tool.url}
                        target="_blank"
                        aria-label={`Start using ${tool.name}`}
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`inline-flex items-center gap-2 bg-gradient-to-r ${tool.gradient} text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg`}
                      >
                        <Sparkles className="w-5 h-5" />
                        Start Making Money Free
                        <ExternalLink className="w-4 h-4" />
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* SEO Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-20"
          >
            <div className="bg-gray-800/30 border border-gray-700 rounded-3xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                Why Choose KenjiAI's Revenue-Generating Free Tools?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-green-400 mb-3">💰 Revenue-Focused Design</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Unlike generic AI tools, ours are specifically designed to help you make money. 
                    Every feature is built to generate revenue, close deals, and grow your business.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-blue-400 mb-3">⚡ Instant Money-Making</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Start generating results immediately. No lengthy setup, no learning curve. 
                    Just click and start making money with AI automation.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-purple-400 mb-3">🎯 Proven Revenue Results</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Used by 125,000+ entrepreneurs worldwide. Our tools have helped generate over $50M 
                    in revenue and saved millions in costs.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-pink-400 mb-3">📈 Scalable Profit Systems</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Build systems that scale your revenue without scaling your workload. 
                    Automate the money-making process with AI.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">🔄 Continuous Revenue Optimization</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    We continuously improve our tools based on revenue data and user feedback. 
                    Get new money-making features automatically.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-cyan-400 mb-3">🤝 Success Community</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Join our active community of entrepreneurs making money with AI. 
                    Share strategies, get advice, and learn from others generating revenue.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Upgrade CTA */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center bg-gradient-to-r from-blue-900/30 to-green-900/30 border border-blue-400/30 rounded-3xl p-12"
          >
            <h3 className="text-4xl font-bold text-white mb-6">
              Ready for the Complete Money-Making Platform?
            </h3>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Love our free tools? Get access to the complete KenjiAI platform with voice agents that close deals 24/7, 
              automated workflows that generate revenue, and 50+ money-making features.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
                <div className="text-gray-400">Revenue-Generating Tools</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">425%</div>
                <div className="text-gray-400">Average ROI</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">$297</div>
                <div className="text-gray-400">Per Month</div>
              </div>
            </div>

            <motion.a
              href="https://freedom.kenjiai.com/checkout-4912-2457-3370"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-green-500 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-lg transition-all duration-300"
            >
              Get Started Now
              <ArrowRight className="w-6 h-6" />
            </motion.a>
            
            <p className="text-gray-500 text-sm mt-4">
              30-day money-back guarantee • Full access • 425% average ROI
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default FreeToolsPage;