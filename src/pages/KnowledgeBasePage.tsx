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

  const featuredCourses = [
    {
      slug: "ai-automation-business-growth-2025",
      title: "Complete AI Business Automation Mastery",
      excerpt: "Master AI automation from beginner to expert. Learn how to build AI systems that generate $2.3M+ in revenue. Complete with hands-on projects, real case studies, and certification.",
      category: "AI Mastery",
      level: "Beginner to Advanced",
      duration: "8 weeks",
      lessons: 24,
      students: "15,247",
      date: "2025-01-15",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
      featured: true,
      views: "25.2K",
      rating: 4.9,
      price: "Free",
      instructor: "Dr. Sarah Chen",
      skills: ["AI Strategy", "Business Automation", "Revenue Generation", "ROI Optimization"],
      keywords: ["AI automation course", "business automation training", "AI revenue generation", "AI certification"]
    },
    {
      slug: "voice-ai-sales-conversion-optimization",
      title: "Voice AI Sales Mastery: Close Deals 24/7",
      excerpt: "Learn to deploy AI voice agents that close $500K+ in deals while you sleep. Master conversation design, objection handling, and sales automation with real recordings and proven frameworks.",
      category: "AI Sales",
      level: "Intermediate",
      duration: "4 weeks",
      lessons: 16,
      students: "8,934",
      date: "2025-01-12",
      image: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800",
      views: "18.8K",
      rating: 4.8,
      price: "Free",
      instructor: "Marcus Johnson",
      skills: ["Voice AI", "Sales Automation", "Conversation Design", "Lead Qualification"],
      keywords: ["voice AI course", "sales automation training", "AI sales agent", "conversation AI"]
    },
    {
      slug: "tax-optimization-ai-strategies",
      title: "AI-Powered Tax Optimization for Entrepreneurs",
      excerpt: "Master tax strategies using AI tools to minimize liability and maximize deductions. Learn advanced techniques that save entrepreneurs $50K+ annually with automated tax planning.",
      category: "Tax Strategy",
      level: "Intermediate",
      duration: "6 weeks",
      lessons: 18,
      students: "12,456",
      date: "2025-01-10",
      image: "https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=800",
      views: "32.5K",
      rating: 4.9,
      price: "Free",
      instructor: "Jennifer Martinez, CPA",
      skills: ["Tax Planning", "AI Tax Tools", "Deduction Strategies", "Business Structure"],
      keywords: ["tax optimization course", "AI tax planning", "entrepreneur tax strategies", "business tax course"]
    }
  ];

  const courseCategories = [
    {
      slug: "smart-investment-ai-analytics",
      title: "Smart Investment Strategies with AI Analytics",
      excerpt: "Learn to use AI for investment analysis, portfolio optimization, and risk management. Master techniques used by hedge funds to generate consistent 15%+ annual returns.",
      category: "Investment AI",
      level: "Advanced",
      duration: "10 weeks",
      lessons: 30,
      students: "6,789",
      date: "2025-01-08",
      views: "15.2K",
      rating: 4.7,
      price: "Free",
      instructor: "David Park, CFA",
      skills: ["AI Analytics", "Portfolio Optimization", "Risk Management", "Algorithmic Trading"],
      keywords: ["AI investment course", "portfolio optimization", "algorithmic trading", "investment AI"]
    },
    {
      slug: "chatbot-customer-service-automation",
      title: "AI Customer Service Excellence",
      excerpt: "Build intelligent chatbots that provide exceptional customer service while reducing costs by 70%. Learn conversation design, sentiment analysis, and automation workflows.",
      category: "AI Customer Service",
      level: "Beginner",
      duration: "3 weeks",
      lessons: 12,
      students: "11,234",
      date: "2025-01-08",
      views: "15.2K",
      rating: 4.7,
      price: "Free",
      instructor: "Lisa Thompson",
      skills: ["Chatbot Development", "Customer Service", "Conversation AI", "Automation"],
      keywords: ["chatbot course", "customer service AI", "conversation design", "service automation"]
    },
    {
      slug: "retirement-planning-ai-optimization",
      title: "AI-Optimized Retirement Planning",
      excerpt: "Use AI to create personalized retirement strategies that maximize wealth accumulation. Learn advanced planning techniques and tax-efficient withdrawal strategies.",
      category: "Retirement Planning",
      level: "Intermediate",
      duration: "5 weeks",
      lessons: 15,
      students: "9,567",
      date: "2025-01-05",
      views: "21.4K",
      rating: 4.8,
      price: "Free",
      instructor: "Robert Chen, CFP",
      skills: ["Retirement Planning", "Wealth Accumulation", "Tax Efficiency", "AI Analytics"],
      keywords: ["retirement planning course", "AI retirement planning", "wealth building", "retirement strategies"]
    },
    {
      slug: "crm-automation-pipeline-optimization",
      title: "CRM Automation & Sales Pipeline Mastery",
      excerpt: "Transform your CRM into a revenue-generating machine with AI. Learn to automate lead nurturing, predict deal outcomes, and increase deal size by 300%.",
      category: "Sales AI",
      level: "Intermediate",
      duration: "4 weeks",
      lessons: 14,
      students: "7,892",
      date: "2025-01-03",
      views: "12.7K",
      rating: 4.6,
      price: "Free",
      instructor: "Alex Rivera",
      skills: ["CRM Automation", "Sales Pipeline", "Lead Nurturing", "Revenue Optimization"],
      keywords: ["CRM automation course", "sales pipeline optimization", "lead nurturing", "sales AI"]
    },
    {
      slug: "cryptocurrency-ai-trading-strategies",
      title: "AI-Powered Cryptocurrency Trading",
      excerpt: "Master cryptocurrency trading using AI algorithms and machine learning. Learn risk management, technical analysis, and automated trading strategies for consistent profits.",
      category: "Crypto Trading",
      level: "Advanced",
      duration: "8 weeks",
      lessons: 24,
      students: "5,432",
      date: "2025-01-01",
      views: "19.1K",
      rating: 4.9,
      price: "Free",
      instructor: "Elena Rodriguez",
      skills: ["Crypto Trading", "AI Algorithms", "Risk Management", "Technical Analysis"],
      keywords: ["cryptocurrency course", "AI trading", "crypto strategies", "algorithmic trading"]
    },
    {
      slug: "business-valuation-ai-analysis",
      title: "AI-Enhanced Business Valuation",
      excerpt: "Learn to value businesses using AI-powered financial analysis. Master DCF models, comparable analysis, and market-based valuation with machine learning insights.",
      category: "Business Finance",
      level: "Advanced",
      duration: "6 weeks",
      lessons: 18,
      students: "4,123",
      date: "2024-12-28",
      views: "11.3K",
      rating: 4.5,
      price: "Free",
      instructor: "Michael Foster, CFA",
      skills: ["Business Valuation", "Financial Analysis", "DCF Modeling", "AI Analytics"],
      keywords: ["business valuation course", "financial analysis", "DCF modeling", "investment analysis"]
    }
  ];

  const categories = [
    { name: "All", count: 156, icon: BookOpen, color: "text-blue-400" },
    { name: "AI Mastery", count: 34, icon: Brain, color: "text-purple-400" },
    { name: "AI Sales", count: 28, icon: Target, color: "text-green-400" },
    { name: "Tax Strategy", count: 22, icon: Calculator, color: "text-yellow-400" },
    { name: "Investment AI", count: 18, icon: TrendingUp, color: "text-cyan-400" },
    { name: "Retirement Planning", count: 15, icon: PieChart, color: "text-pink-400" },
    { name: "Crypto Trading", count: 12, icon: DollarSign, color: "text-orange-400" },
    { name: "Business Finance", count: 27, icon: Award, color: "text-indigo-400" }
  ];

  const allCourses = [...featuredCourses, ...courseCategories];
  const filteredCourses = selectedCategory === 'All' 
    ? allCourses 
    : allCourses.filter(course => course.category === selectedCategory);

  const searchFilteredCourses = searchQuery 
    ? filteredCourses.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.keywords && course.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchQuery.toLowerCase())
        )) ||
        (course.skills && course.skills.some(skill => 
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      )
    : filteredCourses;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "KenjiAI Educational Hub - AI, Tax & Investment Courses",
    "description": "Free online courses in AI automation, tax optimization, and investment strategies. Learn from industry experts with hands-on projects and real-world case studies.",
    "url": "https://kenjiai.com/knowledge",
    "courseMode": "online",
    "educationalLevel": "beginner to advanced",
    "teaches": ["AI Automation", "Tax Optimization", "Investment Strategies", "Business Finance"],
    "hasCredential": {
      "@type": "EducationalOccupationalCredential",
      "name": "AI Business Automation Certificate"
    }
  };

  const learningPaths = [
    {
      title: "AI Entrepreneur Track",
      description: "Complete path from AI beginner to business automation expert",
      courses: 6,
      duration: "16 weeks",
      icon: Brain,
      color: "from-purple-500 to-blue-500"
    },
    {
      title: "Tax Optimization Expert",
      description: "Master tax strategies for entrepreneurs and investors",
      courses: 4,
      duration: "12 weeks",
      icon: Calculator,
      color: "from-yellow-500 to-orange-500"
    },
    {
      title: "Investment AI Specialist",
      description: "Use AI for advanced investment analysis and trading",
      courses: 5,
      duration: "14 weeks",
      icon: TrendingUp,
      color: "from-green-500 to-cyan-500"
    }
  ];

  return (
    <> 
      <Helmet>
        <title>AI Educational Hub - Free Courses in AI, Tax & Investment Strategies | KenjiAI</title>
        <meta name="description" content="Master AI automation, tax optimization, and investment strategies with free online courses. Learn from industry experts with hands-on projects, real case studies, and professional certification." />
        <meta name="keywords" content="AI courses, tax optimization course, investment strategies, AI automation training, business finance education, cryptocurrency trading, retirement planning, AI certification, free online courses" />
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
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <span className="text-purple-400 font-semibold text-sm sm:text-base">AI Educational Hub</span>
            </motion.div>

            <h1 id="knowledge-base-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Master AI, Tax & Investment
              </span>
              <br />
              <span className="text-white">Strategies for Success</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed mb-6 sm:mb-8">
              Professional-grade courses in AI automation, tax optimization, and investment strategies. 
              Learn from industry experts with hands-on projects, real case studies, and earn certifications 
              that advance your career and business.
            </p>

            {/* Learning Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto mb-6 sm:mb-8">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-purple-400">50K+</div>
                <div className="text-gray-400 text-xs sm:text-sm">Students Enrolled</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-400">156</div>
                <div className="text-gray-400 text-xs sm:text-sm">Expert Courses</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-400">100%</div>
                <div className="text-gray-400 text-xs sm:text-sm">Free Access</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-pink-400">4.8★</div>
                <div className="text-gray-400 text-xs sm:text-sm">Average Rating</div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-xl sm:max-w-2xl mx-auto relative mb-6 sm:mb-8" role="search">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search courses: AI automation, tax strategies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl sm:rounded-2xl pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors text-sm sm:text-base"
                aria-label="Search courses"
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

          {/* Learning Paths */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 sm:mb-16" 
            role="region"
            aria-labelledby="learning-paths-heading"
          >
            <h2 id="learning-paths-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center">
              🎯 Structured Learning Paths
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6" role="list">
              {learningPaths.map((path, index) => (
                <motion.div
                  key={path.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  role="listitem"
                  className={`bg-gradient-to-br ${path.color}/20 border border-gray-700 hover:border-purple-400/50 rounded-xl sm:rounded-3xl p-4 sm:p-6 text-center transition-all duration-300 cursor-pointer`}
                >
                  <path.icon className="w-10 h-10 sm:w-12 sm:h-12 text-white mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{path.title}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">{path.description}</p>
                  <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs text-gray-300">
                    <span>{path.courses} courses</span>
                    <span>•</span>
                    <span>{path.duration}</span>
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
              <h2 className="text-lg sm:text-xl font-bold text-white">Browse Courses by Category</h2>
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
                  <p className="text-gray-400 text-xs hidden sm:block">{category.count} courses</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Featured Course */}
          {selectedCategory === 'All' && !searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-12 sm:mb-16" 
              role="region"
              aria-labelledby="featured-course-heading"
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                <h2 id="featured-course-heading" className="text-2xl sm:text-3xl font-bold text-white">Featured Course</h2>
              </div>
              <Link to={`/blog/${featuredCourses[0].slug}`}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group relative bg-gray-800/50 border border-gray-700 hover:border-purple-400/50 rounded-xl sm:rounded-3xl overflow-hidden transition-all duration-500"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2 relative">
                      <img
                        src={featuredCourses[0].image}
                        alt={featuredCourses[0].title}
                        className="w-full h-48 sm:h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold">
                        FEATURED
                      </div>
                      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 bg-green-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold">
                        {featuredCourses[0].price}
                      </div>
                    </div>
                    <div className="md:w-1/2 p-4 sm:p-6 md:p-8">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                        <span className="bg-gradient-to-r from-purple-500 to-blue-400 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-lg text-xs font-semibold">
                          {featuredCourses[0].category}
                        </span>
                        <span className="text-gray-400 text-xs sm:text-sm">{featuredCourses[0].level}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-purple-300 transition-colors">
                        {featuredCourses[0].title}
                      </h3>
                      <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                        {featuredCourses[0].excerpt}
                      </p>
                      
                      {/* Course Stats */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{featuredCourses[0].duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                          <PlayCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{featuredCourses[0].lessons} lessons</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                          <Users className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{featuredCourses[0].students} students</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-yellow-400">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current flex-shrink-0" />
                          <span>{featuredCourses[0].rating}</span>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="mb-4 sm:mb-6">
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-300 mb-2">You'll Learn:</h4>
                        <div className="flex flex-wrap gap-2">
                          {featuredCourses[0].skills.map((skill, idx) => (
                            <span key={idx} className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-lg text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs sm:text-sm text-gray-400">
                          By {featuredCourses[0].instructor}
                        </div>
                        <div className="flex items-center text-purple-400 font-semibold group-hover:text-blue-400 transition-colors text-xs sm:text-sm">
                          Start Learning
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          )}

          {/* Courses Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            role="region"
            aria-labelledby="courses-heading"
          >
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 id="courses-heading" className="text-2xl sm:text-3xl font-bold text-white">
                {searchQuery ? `Search Results (${searchFilteredCourses.length})` : 
                 selectedCategory === 'All' ? 'All Courses' : `${selectedCategory} Courses`}
              </h2>
              {searchFilteredCourses.length > 0 && (
                <div className="text-gray-400 text-xs sm:text-sm">
                  {searchFilteredCourses.length} courses available
                </div>
              )}
            </div>

            {searchFilteredCourses.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-400 mb-2">No courses found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your search or browse different categories</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8" role="list">
                {searchFilteredCourses.map((course, index) => (
                  <Link key={course.slug} to={`/blog/${course.slug}`}>
                    <motion.article
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      role="listitem"
                      className="group bg-gray-800/50 border border-gray-700 hover:border-purple-400/50 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col course-card"
                    >
                      {course.image && (
                        <div className="relative">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="bg-purple-500/90 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                              {course.category}
                            </span>
                          </div>
                          <div className="absolute top-3 right-3">
                            <span className="bg-green-500/90 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                              {course.price}
                            </span>
                          </div>
                          <div className="absolute bottom-3 left-3">
                            <span className="bg-gray-900/80 text-white px-2 py-1 rounded-lg text-xs">
                              {course.level}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="p-4 sm:p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 mb-2 sm:mb-3">
                          {!course.image && (
                            <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-lg text-xs font-semibold">
                              {course.category}
                            </span>
                          )}
                          <div className="flex items-center text-yellow-400 text-xs">
                            <Star className="w-3 h-3 mr-1 fill-current flex-shrink-0" />
                            {course.rating}
                          </div>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 group-hover:text-purple-300 transition-colors line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed line-clamp-3">
                          {course.excerpt}
                        </p>

                        {/* Course Stats */}
                        <div className="grid grid-cols-2 gap-2 mb-3 sm:mb-4 text-xs text-gray-400">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                            {course.duration}
                          </div>
                          <div className="flex items-center">
                            <PlayCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                            {course.lessons} lessons
                          </div>
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1 flex-shrink-0" />
                            {course.students}
                          </div>
                          <div className="flex items-center">
                            <GraduationCap className="w-3 h-3 mr-1 flex-shrink-0" />
                            Certificate
                          </div>
                        </div>

                        {/* Skills Preview */}
                        <div className="mb-3 sm:mb-4">
                          <div className="flex flex-wrap gap-1">
                            {course.skills.slice(0, 2).map((skill, idx) => (
                              <span key={idx} className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                            {course.skills.length > 2 && (
                              <span className="text-gray-400 text-xs">+{course.skills.length - 2} more</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          <div className="text-xs text-gray-400 truncate max-w-[120px] sm:max-w-none">
                            By {course.instructor}
                          </div>
                          <div className="flex items-center text-purple-400 text-xs sm:text-sm font-semibold group-hover:text-blue-400 transition-colors">
                            Start Course
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
            <GraduationCap className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400 mx-auto mb-4 sm:mb-6" />
            <h3 id="newsletter-heading" className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
              Get Weekly Learning Updates
            </h3>
            <p className="text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
              Join 50,000+ learners getting weekly course updates, expert insights, and exclusive content 
              on AI automation, tax strategies, and investment techniques.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto" role="form" aria-label="Newsletter signup">
              <input
                type="email"
                placeholder="Enter email for course updates"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg sm:rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none text-sm sm:text-base"
                aria-label="Email for course updates"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
              >
                Start Learning
              </motion.button>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm mt-4">
              Free courses • Expert instructors • Professional certificates • 50,000+ students
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default KnowledgeBasePage;