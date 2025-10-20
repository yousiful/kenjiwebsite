import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Search, TrendingUp, Users, Zap, Brain, Filter, BookOpen, Star, Eye, GraduationCap, Award, PlayCircle, CheckCircle, Target, DollarSign, Calculator, PieChart } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useAutoFormatting } from '../components/AutoFormattingProvider';

const KnowledgeBasePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMobile, setIsMobile] = useState(false);
  const { fixFormatting } = useAutoFormatting();

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Run formatting fix after component mounts
    fixFormatting();
    
    // Run formatting fix again after a short delay to catch any lazy-loaded content
    const timer = setTimeout(() => {
      fixFormatting();
    }, 500);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, [fixFormatting]);

  const featuredArticles = [
    {
      slug: "how-to-set-up-ai-voice-agents",
      title: "Complete Guide: Setting Up AI Voice Agents in 10 Minutes",
      excerpt: "Step-by-step tutorial on creating AI voice agents that answer calls 24/7, qualify leads, and book appointments automatically. Includes real examples and templates.",
      category: "Voice AI Setup",
      readTime: "8 min read",
      date: "2025-10-15",
      image: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800",
      featured: true,
      views: "15.2K",
      author: "KenjiAI Team",
      tags: ["Voice AI", "Setup Guide", "Tutorial", "Getting Started"],
      keywords: ["voice AI setup", "AI phone agents", "conversation AI tutorial"]
    },
    {
      slug: "conversation-ai-best-practices",
      title: "Conversation AI Best Practices: Training Your Bot for Success",
      excerpt: "Learn how to train Conversation AI bots with optimal response modes, intent recognition, and natural language understanding. Real-world examples from 1,000+ implementations.",
      category: "Conversation AI",
      readTime: "12 min read",
      date: "2025-10-12",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
      views: "12.8K",
      author: "KenjiAI Team",
      tags: ["Conversation AI", "Bot Training", "NLP", "Best Practices"],
      keywords: ["conversation AI training", "chatbot best practices", "AI response modes"]
    },
    {
      slug: "workflow-ai-automation-guide",
      title: "Workflow AI Assistant: Automate Your Business Processes",
      excerpt: "Master the Workflow AI Assistant to generate custom automation code, build complex workflows, and integrate AI across your business operations.",
      category: "Workflow AI",
      readTime: "10 min read",
      date: "2025-10-10",
      image: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800",
      views: "18.5K",
      author: "KenjiAI Team",
      tags: ["Workflow Automation", "AI Assistant", "Business Process", "Integration"],
      keywords: ["workflow automation", "AI workflow builder", "business automation"]
    }
  ];

  const blogArticles = [
    {
      slug: "ai-agent-studio-complete-guide",
      title: "Mastering AI Agent Studio: Intent-Based Routing Made Easy",
      excerpt: "Learn how to use the AI Agent Studio to create sophisticated intent-based routing systems that deliver personalized customer experiences at scale.",
      category: "Agent Studio",
      readTime: "15 min read",
      date: "2025-10-08",
      views: "14.2K",
      author: "KenjiAI Team",
      tags: ["Agent Studio", "Intent Routing", "Advanced AI", "Customization"],
      keywords: ["AI agent studio", "intent routing", "AI customization"]
    },
    {
      slug: "using-free-ai-prompt-generator",
      title: "How to Use KenjiAI's Free Prompt Generator for Perfect Results",
      excerpt: "Master prompt engineering with KenjiAI's free tool. Learn advanced techniques to generate perfect prompts for any AI use case, from content creation to data analysis.",
      category: "KenjiAI Tools",
      readTime: "6 min read",
      date: "2025-10-08",
      views: "22.1K",
      author: "KenjiAI Team",
      tags: ["Prompt Engineering", "Free Tools", "AI Prompts", "Tutorial"],
      keywords: ["prompt generator", "AI prompts", "prompt engineering"]
    },
    {
      slug: "content-ai-social-media-automation",
      title: "Content AI: Automate Your Social Media with AI-Powered Tools",
      excerpt: "Discover how to use Content AI in Social Planner, Email Builder, and Website tools to create engaging content 10x faster while maintaining quality.",
      category: "Content AI",
      readTime: "10 min read",
      date: "2025-10-05",
      views: "19.4K",
      author: "KenjiAI Team",
      tags: ["Content Creation", "Social Media", "Email Marketing", "Automation"],
      keywords: ["content AI", "social media automation", "AI content creation"]
    },
    {
      slug: "pr-pro-media-outreach-guide",
      title: "PR Pro: AI-Powered Media Outreach That Gets Results",
      excerpt: "Complete guide to using KenjiAI's PR Pro tool for automated media outreach, press release distribution, and building relationships with journalists.",
      category: "KenjiAI Tools",
      readTime: "12 min read",
      date: "2025-10-03",
      views: "11.7K",
      author: "KenjiAI Team",
      tags: ["PR Tools", "Media Outreach", "Press Release", "Marketing"],
      keywords: ["PR tool", "media outreach", "press release automation"]
    },
    {
      slug: "sales-coach-ai-deal-closing",
      title: "Sales Coach AI: Train Your Team to Close More Deals",
      excerpt: "Use KenjiAI's Sales Coach AI to provide real-time guidance, objection handling scripts, and proven sales frameworks that increase close rates by 40%.",
      category: "KenjiAI Tools",
      readTime: "8 min read",
      date: "2025-10-01",
      views: "16.9K",
      author: "KenjiAI Team",
      tags: ["Sales Training", "AI Coach", "Deal Closing", "Sales Tools"],
      keywords: ["sales coach AI", "sales training", "close deals"]
    },
    {
      slug: "viralpost-pro-content-strategy",
      title: "ViralPost Pro: Create Viral Social Media Content with AI",
      excerpt: "Master the art of viral content creation using KenjiAI's ViralPost Pro. Learn data-driven strategies, trending topic identification, and engagement optimization.",
      category: "KenjiAI Tools",
      readTime: "9 min read",
      date: "2024-09-28",
      views: "24.3K",
      author: "KenjiAI Team",
      tags: ["Viral Marketing", "Content Strategy", "Social Media", "Engagement"],
      keywords: ["viral content", "social media marketing", "content creation"]
    },
    {
      slug: "ask-ai-business-automation",
      title: "Ask AI: Your Intelligent Business Assistant for Everything",
      excerpt: "Discover how Ask AI's Contact Summary Agent, Funnel Creation Agent, and other AI assistants can automate complex business tasks and boost productivity.",
      category: "Ask AI",
      readTime: "11 min read",
      date: "2024-09-25",
      views: "13.5K",
      author: "KenjiAI Team",
      tags: ["Ask AI", "AI Assistant", "Productivity", "Automation"],
      keywords: ["AI assistant", "business automation", "ask AI"]
    },
    {
      slug: "workflow-triggers-actions-guide",
      title: "Ultimate Guide to Workflow Triggers and Actions",
      excerpt: "Master workflow automation with this comprehensive guide to triggers, actions, conditions, and advanced automation recipes for every business scenario.",
      category: "Workflows",
      readTime: "18 min read",
      date: "2024-09-22",
      views: "20.8K",
      author: "KenjiAI Team",
      tags: ["Workflows", "Triggers", "Actions", "Automation Recipes"],
      keywords: ["workflow triggers", "automation actions", "workflow builder"]
    },
    {
      slug: "crm-automation-complete-setup",
      title: "CRM Automation: Complete Setup Guide for Maximum ROI",
      excerpt: "Transform your CRM with KenjiAI automation. Learn to set up automated lead capture, nurturing sequences, deal pipelines, and reporting dashboards.",
      category: "CRM",
      readTime: "14 min read",
      date: "2024-09-20",
      views: "17.2K",
      author: "KenjiAI Team",
      tags: ["CRM Setup", "Lead Management", "Sales Pipeline", "Automation"],
      keywords: ["CRM automation", "lead management", "sales pipeline"]
    }
  ];

  const categories = [
    { name: "All", count: 42, icon: BookOpen, color: "text-blue-400" },
    { name: "Voice AI Setup", count: 12, icon: Brain, color: "text-purple-400" },
    { name: "Conversation AI", count: 8, icon: Zap, color: "text-green-400" },
    { name: "Workflow AI", count: 7, icon: Target, color: "text-cyan-400" },
    { name: "KenjiAI Tools", count: 6, icon: Award, color: "text-pink-400" },
    { name: "Agent Studio", count: 4, icon: Star, color: "text-yellow-400" },
    { name: "Content AI", count: 3, icon: PlayCircle, color: "text-orange-400" },
    { name: "Ask AI", count: 2, icon: CheckCircle, color: "text-indigo-400" }
  ];

  const allArticles = [...featuredArticles, ...blogArticles];
  const filteredArticles = selectedCategory === 'All'
    ? allArticles
    : allArticles.filter(article => article.category === selectedCategory);

  const searchFilteredArticles = searchQuery
    ? filteredArticles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.keywords && article.keywords.some(keyword =>
          keyword.toLowerCase().includes(searchQuery.toLowerCase())
        )) ||
        (article.tags && article.tags.some(tag =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      )
    : filteredArticles;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "KenjiAI Knowledge Base - AI Setup Guides & Tutorials",
    "description": "Expert guides and tutorials on setting up AI voice agents, conversation AI, workflow automation, and using KenjiAI tools for business growth.",
    "url": "https://kenjiai.com/knowledge",
    "publisher": {
      "@type": "Organization",
      "name": "KenjiAI"
    },
    "blogPost": [
      {
        "@type": "BlogPosting",
        "headline": "Complete Guide: Setting Up AI Voice Agents in 10 Minutes",
        "url": "https://kenjiai.com/blog/how-to-set-up-ai-voice-agents"
      }
    ]
  };

  const quickStartGuides = [
    {
      title: "Voice AI Quick Start",
      description: "Set up your first AI voice agent in under 10 minutes",
      articles: 5,
      icon: Brain,
      color: "from-purple-500 to-blue-500"
    },
    {
      title: "KenjiAI Tools Mastery",
      description: "Master all free KenjiAI tools for maximum productivity",
      articles: 6,
      icon: Award,
      color: "from-pink-500 to-orange-500"
    },
    {
      title: "Automation Expert Track",
      description: "Complete workflow automation from beginner to pro",
      articles: 8,
      icon: Zap,
      color: "from-green-500 to-cyan-500"
    }
  ];

  return (
    <> 
      <Helmet>
        <title>KenjiAI Knowledge Base - AI Setup Guides, Tutorials & How-To Articles</title>
        <meta name="description" content="Expert guides on setting up AI voice agents, conversation AI, workflow automation, and using KenjiAI's free tools. Step-by-step tutorials with real examples and templates." />
        <meta name="keywords" content="AI setup guide, voice AI tutorial, conversation AI guide, workflow automation, KenjiAI tools, AI agent setup, prompt generator guide, AI tutorials, business automation guides" />
        <link rel="canonical" href="https://kenjiai.com/knowledge" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <div className="pt-24 pb-16 bg-gray-900 min-h-screen" role="region" aria-labelledby="knowledge-base-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-full px-4 py-2 sm:px-6 sm:py-3 mb-4 sm:mb-6"
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <span className="text-purple-400 font-semibold text-sm sm:text-base">Knowledge Base</span>
            </motion.div>

            <h1 id="knowledge-base-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                AI Setup Guides & Tutorials
              </span>
              <br />
              <span className="text-white">Master KenjiAI Tools</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed mb-6 sm:mb-8">
              Expert tutorials on setting up AI voice agents, conversation AI, workflow automation, and using
              KenjiAI's free tools. Step-by-step guides with real examples, templates, and best practices.
            </p>

            {/* Blog Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto mb-6 sm:mb-8">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-purple-400">42+</div>
                <div className="text-gray-400 text-xs sm:text-sm">Expert Guides</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-400">25K+</div>
                <div className="text-gray-400 text-xs sm:text-sm">Monthly Readers</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-400">100%</div>
                <div className="text-gray-400 text-xs sm:text-sm">Free Content</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-pink-400">Weekly</div>
                <div className="text-gray-400 text-xs sm:text-sm">New Articles</div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-xl sm:max-w-2xl mx-auto relative mb-6 sm:mb-8" role="search">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search guides: Voice AI, automation, KenjiAI tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl sm:rounded-2xl pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors text-sm sm:text-base"
                aria-label="Search guides"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </motion.div>

          {/* Quick Start Guides */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 sm:mb-16"
            role="region"
            aria-labelledby="quick-start-heading"
          >
            <h2 id="quick-start-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center">
              🚀 Quick Start Guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6" role="list">
              {quickStartGuides.map((guide, index) => (
                <motion.div
                  key={guide.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  role="listitem"
                  className={`bg-gradient-to-br ${guide.color}/20 border border-gray-700 hover:border-purple-400/50 rounded-xl sm:rounded-3xl p-4 sm:p-6 text-center transition-all duration-300 cursor-pointer`}
                >
                  <guide.icon className="w-10 h-10 sm:w-12 sm:h-12 text-white mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{guide.title}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">{guide.description}</p>
                  <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs text-gray-300">
                    <span>{guide.articles} articles</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 sm:mb-16 overflow-x-auto pb-2" 
            role="navigation"
            aria-label="Course categories"
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <h2 className="text-lg sm:text-xl font-bold text-white">Browse Articles by Topic</h2>
            </div>
            <div className="flex flex-nowrap sm:grid sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 min-w-max sm:min-w-0">
              {categories.map((category, index) => (
                <motion.button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl text-center transition-all duration-300 cursor-pointer flex-shrink-0 ${
                    selectedCategory === category.name
                      ? 'bg-gradient-to-br from-purple-600/30 to-blue-600/30 border border-purple-400/50'
                      : 'bg-gray-800/50 border border-gray-700 hover:border-purple-400/50'
                  }`}
                >
                  <category.icon className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 ${
                    selectedCategory === category.name ? 'text-purple-400' : category.color
                  }`} />
                  <h3 className={`font-semibold mb-0 sm:mb-1 text-xs sm:text-sm ${
                    selectedCategory === category.name ? 'text-white' : 'text-gray-300'
                  }`}>{category.name}</h3>
                  <p className="text-gray-400 text-xs hidden sm:block">{category.count} articles</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Featured Article */}
          {selectedCategory === 'All' && !searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-12 sm:mb-16"
              role="region"
              aria-labelledby="featured-article-heading"
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                <h2 id="featured-article-heading" className="text-2xl sm:text-3xl font-bold text-white">Featured Guide</h2>
              </div>
              <Link to={`/blog/${featuredArticles[0].slug}`}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group relative bg-gray-800/50 border border-gray-700 hover:border-purple-400/50 rounded-xl sm:rounded-3xl overflow-hidden transition-all duration-500"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2 relative">
                      <img
                        src={featuredArticles[0].image}
                        alt={featuredArticles[0].title}
                        className="w-full h-48 sm:h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold">
                        FEATURED
                      </div>
                      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 bg-blue-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold">
                        {featuredArticles[0].readTime}
                      </div>
                    </div>
                    <div className="md:w-1/2 p-4 sm:p-6 md:p-8">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                        <span className="bg-gradient-to-r from-purple-500 to-blue-400 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-lg text-xs font-semibold">
                          {featuredArticles[0].category}
                        </span>
                        <span className="flex items-center gap-1 text-gray-400 text-xs sm:text-sm">
                          <Calendar className="w-3 h-3" />
                          {new Date(featuredArticles[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-purple-300 transition-colors">
                        {featuredArticles[0].title}
                      </h3>
                      <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                        {featuredArticles[0].excerpt}
                      </p>

                      {/* Article Stats */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{featuredArticles[0].readTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{featuredArticles[0].views} views</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="mb-4 sm:mb-6">
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-300 mb-2">Topics Covered:</h4>
                        <div className="flex flex-wrap gap-2">
                          {featuredArticles[0].tags.map((tag, idx) => (
                            <span key={idx} className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-lg text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs sm:text-sm text-gray-400">
                          By {featuredArticles[0].author}
                        </div>
                        <div className="flex items-center text-purple-400 font-semibold group-hover:text-blue-400 transition-colors text-xs sm:text-sm">
                          Read Article
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          )}

          {/* Articles Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            role="region"
            aria-labelledby="articles-heading"
          >
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 id="articles-heading" className="text-2xl sm:text-3xl font-bold text-white">
                {searchQuery ? `Search Results (${searchFilteredArticles.length})` :
                 selectedCategory === 'All' ? 'All Articles' : `${selectedCategory} Articles`}
              </h2>
              {searchFilteredArticles.length > 0 && (
                <div className="text-gray-400 text-xs sm:text-sm">
                  {searchFilteredArticles.length} articles available
                </div>
              )}
            </div>

            {searchFilteredArticles.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-400 mb-2">No articles found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your search or browse different topics</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8" role="list">
                {searchFilteredArticles.map((article, index) => (
                  <Link key={article.slug} to={`/blog/${article.slug}`}>
                    <motion.article
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      role="listitem"
                      className="group bg-gray-800/50 border border-gray-700 hover:border-purple-400/50 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col article-card"
                    >
                      {article.image && (
                        <div className="relative">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="bg-purple-500/90 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                              {article.category}
                            </span>
                          </div>
                          <div className="absolute top-3 right-3">
                            <span className="bg-blue-500/90 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                              {article.readTime}
                            </span>
                          </div>
                          <div className="absolute bottom-3 left-3 flex items-center gap-1">
                            <Eye className="w-3 h-3 text-white" />
                            <span className="bg-gray-900/80 text-white px-2 py-1 rounded-lg text-xs">
                              {article.views}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="p-4 sm:p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 mb-2 sm:mb-3">
                          {!article.image && (
                            <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-lg text-xs font-semibold">
                              {article.category}
                            </span>
                          )}
                          <div className="flex items-center text-gray-400 text-xs">
                            <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                            {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 group-hover:text-purple-300 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed line-clamp-3">
                          {article.excerpt}
                        </p>

                        {/* Article Stats */}
                        <div className="grid grid-cols-2 gap-2 mb-3 sm:mb-4 text-xs text-gray-400">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                            {article.readTime}
                          </div>
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1 flex-shrink-0" />
                            {article.views}
                          </div>
                        </div>

                        {/* Tags Preview */}
                        <div className="mb-3 sm:mb-4">
                          <div className="flex flex-wrap gap-1">
                            {article.tags.slice(0, 2).map((tag, idx) => (
                              <span key={idx} className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                            {article.tags.length > 2 && (
                              <span className="text-gray-400 text-xs">+{article.tags.length - 2} more</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          <div className="text-xs text-gray-400 truncate max-w-[120px] sm:max-w-none">
                            By {article.author}
                          </div>
                          <div className="flex items-center text-purple-400 text-xs sm:text-sm font-semibold group-hover:text-blue-400 transition-colors">
                            Read More
                            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16 sm:mt-20 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-400/30 rounded-xl sm:rounded-3xl p-6 sm:p-12 text-center"
            role="complementary"
            aria-labelledby="newsletter-heading"
          >
            <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400 mx-auto mb-4 sm:mb-6" />
            <h3 id="newsletter-heading" className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
              Get Weekly AI Insights & Tutorials
            </h3>
            <p className="text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
              Join 25,000+ readers getting weekly guides on AI voice agents, automation tools, and KenjiAI updates.
              New tutorials every week to help you master AI business automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto" role="form" aria-label="Newsletter signup">
              <input
                type="email"
                placeholder="Enter your email for weekly guides"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg sm:rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none text-sm sm:text-base"
                aria-label="Email for weekly guides"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
              >
                Subscribe Free
              </motion.button>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm mt-4">
              Free guides • Expert tutorials • Weekly updates • 25,000+ subscribers
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default KnowledgeBasePage;