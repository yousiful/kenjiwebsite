import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, ArrowRight, Share2, BookOpen, ExternalLink, Eye, Star, User, Tag, GraduationCap, PlayCircle, CheckCircle, Award, Users, Target, Download, FileText } from 'lucide-react';
import { useAutoFormatting } from '../components/AutoFormattingProvider';
import { Helmet } from 'react-helmet-async';

const BlogPost: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { fixFormatting } = useAutoFormatting();

  // Validate slug and redirect if needed
  useEffect(() => {
    if (!slug) {
      console.warn('No slug provided, redirecting to knowledge base');
      navigate('/knowledge', { replace: true });
    }
  }, [slug, navigate]);

  // Auto-fix formatting issues on load
  useEffect(() => {
    // Run formatting fix after component mounts
    fixFormatting();
    
    // Run formatting fix again after a short delay to catch any lazy-loaded content
    const timer = setTimeout(() => {
      fixFormatting();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [fixFormatting]);

  // Enhanced course-style content
  const course = {
    title: "Complete AI Business Automation Mastery",
    excerpt: "Master AI automation from beginner to expert. Learn how to build AI systems that generate $2.3M+ in revenue with hands-on projects, real case studies, and professional certification.",
    content: `
      <div class="course-header bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-400/30 rounded-2xl p-8 mb-8">
        <h2 class="text-3xl font-bold text-white mb-4">🎯 Course Overview</h2>
        <p class="text-gray-300 text-lg leading-relaxed">
          This comprehensive course takes you from AI automation beginner to expert practitioner. You'll learn to build, deploy, and optimize AI systems that generate real revenue for businesses. By the end of this course, you'll have the skills to implement AI automation strategies that have generated over $2.3M in documented revenue.
        </p>
      </div>

      <div class="learning-objectives bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-8">
        <h3 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span class="text-green-400">✓</span> What You'll Learn
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-start gap-3">
            <span class="text-green-400 mt-1">•</span>
            <span class="text-gray-300">Build AI voice agents that close deals 24/7</span>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-green-400 mt-1">•</span>
            <span class="text-gray-300">Create automated marketing workflows</span>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-green-400 mt-1">•</span>
            <span class="text-gray-300">Implement CRM automation systems</span>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-green-400 mt-1">•</span>
            <span class="text-gray-300">Design revenue-generating chatbots</span>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-green-400 mt-1">•</span>
            <span class="text-gray-300">Optimize AI systems for maximum ROI</span>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-green-400 mt-1">•</span>
            <span class="text-gray-300">Scale automation across business operations</span>
          </div>
        </div>
      </div>

      <h2 class="text-3xl font-bold text-white mb-6">📚 Course Curriculum</h2>
      
      <div class="curriculum-section mb-8">
        <div class="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
          <div class="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-4 border-b border-gray-700">
            <h3 class="text-xl font-bold text-white">Module 1: AI Automation Fundamentals (Week 1-2)</h3>
            <p class="text-gray-400 text-sm">6 lessons • 3 hours • Beginner level</p>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                <PlayCircle class="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <h4 class="text-white font-semibold text-sm sm:text-base">Lesson 1.1: Introduction to AI Business Automation</h4>
                  <p class="text-gray-400 text-xs sm:text-sm">Understanding the AI automation landscape and opportunities</p>
                </div>
                <span class="text-gray-400 text-xs whitespace-nowrap">25 min</span>
              </div>
              <div class="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                <PlayCircle class="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <h4 class="text-white font-semibold text-sm sm:text-base">Lesson 1.2: AI Tools and Platforms Overview</h4>
                  <p class="text-gray-400 text-xs sm:text-sm">Comprehensive review of available AI automation tools</p>
                </div>
                <span class="text-gray-400 text-xs whitespace-nowrap">30 min</span>
              </div>
              <div class="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                <PlayCircle class="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <h4 class="text-white font-semibold text-sm sm:text-base">Lesson 1.3: Setting Up Your AI Automation Stack</h4>
                  <p class="text-gray-400 text-xs sm:text-sm">Hands-on setup of essential tools and platforms</p>
                </div>
                <span class="text-gray-400 text-xs whitespace-nowrap">45 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="curriculum-section mb-8">
        <div class="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
          <div class="bg-gradient-to-r from-green-600/20 to-emerald-600/20 p-4 border-b border-gray-700">
            <h3 class="text-xl font-bold text-white">Module 2: Voice AI Implementation (Week 3-4)</h3>
            <p class="text-gray-400 text-sm">8 lessons • 4 hours • Intermediate level</p>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                <PlayCircle class="w-5 h-5 text-green-400 flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <h4 class="text-white font-semibold text-sm sm:text-base">Lesson 2.1: Voice AI Architecture and Design</h4>
                  <p class="text-gray-400 text-xs sm:text-sm">Building conversational flows that convert</p>
                </div>
                <span class="text-gray-400 text-xs whitespace-nowrap">35 min</span>
              </div>
              <div class="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                <PlayCircle class="w-5 h-5 text-green-400 flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <h4 class="text-white font-semibold text-sm sm:text-base">Lesson 2.2: Training Your First Voice Agent</h4>
                  <p class="text-gray-400 text-xs sm:text-sm">Step-by-step voice agent creation and training</p>
                </div>
                <span class="text-gray-400 text-xs whitespace-nowrap">50 min</span>
              </div>
              <div class="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                <CheckCircle class="w-5 h-5 text-green-400 flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <h4 class="text-white font-semibold text-sm sm:text-base">Project: Deploy Your Sales Voice Agent</h4>
                  <p class="text-gray-400 text-xs sm:text-sm">Hands-on project to build and deploy a working voice agent</p>
                </div>
                <span class="text-gray-400 text-xs whitespace-nowrap">2 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="case-study bg-gradient-to-r from-blue-900/30 to-green-900/30 border border-blue-400/30 rounded-2xl p-6 sm:p-8 mb-8">
        <h3 class="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Target class="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0" />
          <span>Real-World Case Study: TechCorp's $2.3M Success</span>
        </h3>
        <p class="text-gray-300 mb-6 leading-relaxed text-sm sm:text-base">
          Learn from TechCorp, a mid-sized software company that implemented our AI automation strategies and generated $2.3M in additional revenue within 6 months. We'll break down their exact implementation, challenges faced, and results achieved.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div class="bg-gray-800/50 rounded-xl p-4 text-center">
            <div class="text-2xl sm:text-3xl font-bold text-green-400 mb-2">$2.3M</div>
            <div class="text-gray-400 text-xs sm:text-sm">Additional Revenue</div>
          </div>
          <div class="bg-gray-800/50 rounded-xl p-4 text-center">
            <div class="text-2xl sm:text-3xl font-bold text-blue-400 mb-2">300%</div>
            <div class="text-gray-400 text-xs sm:text-sm">Lead Increase</div>
          </div>
          <div class="bg-gray-800/50 rounded-xl p-4 text-center">
            <div class="text-2xl sm:text-3xl font-bold text-purple-400 mb-2">85%</div>
            <div class="text-gray-400 text-xs sm:text-sm">Cost Reduction</div>
          </div>
        </div>
      </div>

      <h2 class="text-3xl font-bold text-white mb-6">🛠️ Hands-On Projects</h2>
      <p class="text-gray-300 mb-6 leading-relaxed">
        This course includes 5 comprehensive projects that you'll build throughout the program. Each project is designed to reinforce your learning and provide you with portfolio pieces you can showcase to employers or clients.
      </p>

      <div class="projects-grid grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
          <h4 class="text-lg font-bold text-white mb-3">Project 1: Sales Voice Agent</h4>
          <p class="text-gray-400 text-sm mb-4">Build a voice agent that qualifies leads and books appointments automatically.</p>
          <div class="flex items-center gap-2 text-xs text-green-400">
            <CheckCircle class="w-4 h-4 flex-shrink-0" />
            <span>Portfolio Ready</span>
          </div>
        </div>
        <div class="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
          <h4 class="text-lg font-bold text-white mb-3">Project 2: Marketing Automation</h4>
          <p class="text-gray-400 text-sm mb-4">Create an automated email campaign that nurtures leads to conversion.</p>
          <div class="flex items-center gap-2 text-xs text-green-400">
            <CheckCircle class="w-4 h-4 flex-shrink-0" />
            <span>Real Revenue Impact</span>
          </div>
        </div>
        <div class="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
          <h4 class="text-lg font-bold text-white mb-3">Project 3: Customer Service Bot</h4>
          <p class="text-gray-400 text-sm mb-4">Deploy an intelligent chatbot that handles 90% of customer inquiries.</p>
          <div class="flex items-center gap-2 text-xs text-green-400">
            <CheckCircle class="w-4 h-4 flex-shrink-0" />
            <span>Cost Savings Focus</span>
          </div>
        </div>
        <div class="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
          <h4 class="text-lg font-bold text-white mb-3">Project 4: CRM Integration</h4>
          <p class="text-gray-400 text-sm mb-4">Automate your entire sales pipeline from lead to close.</p>
          <div class="flex items-center gap-2 text-xs text-green-400">
            <CheckCircle class="w-4 h-4 flex-shrink-0" />
            <span>Enterprise Ready</span>
          </div>
        </div>
      </div>

      <div class="certification bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-400/30 rounded-2xl p-6 sm:p-8 mb-8">
        <h3 class="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Award class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 flex-shrink-0" />
          <span>Professional Certification</span>
        </h3>
        <p class="text-gray-300 mb-6 leading-relaxed text-sm sm:text-base">
          Upon successful completion of all modules and projects, you'll receive a professional AI Business Automation Certificate. This industry-recognized credential demonstrates your expertise in implementing AI automation solutions that drive real business results.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-3">
            <h4 class="text-lg font-semibold text-white">Certificate Includes:</h4>
            <ul class="space-y-2 text-gray-300 text-sm">
              <li class="flex items-center gap-2">
                <CheckCircle class="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>Digital certificate with verification</span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle class="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>LinkedIn credential badge</span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle class="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>Portfolio of completed projects</span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle class="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>Industry recognition</span>
              </li>
            </ul>
          </div>
          <div class="space-y-3">
            <h4 class="text-lg font-semibold text-white">Career Benefits:</h4>
            <ul class="space-y-2 text-gray-300 text-sm">
              <li class="flex items-center gap-2">
                <Star class="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span>Qualify for AI automation roles</span>
              </li>
              <li class="flex items-center gap-2">
                <Star class="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span>Command higher consulting rates</span>
              </li>
              <li class="flex items-center gap-2">
                <Star class="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span>Join exclusive alumni network</span>
              </li>
              <li class="flex items-center gap-2">
                <Star class="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span>Access to job placement assistance</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <h2 class="text-3xl font-bold text-white mb-6">💡 Key Takeaways</h2>
      <div class="takeaways bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="text-lg font-semibold text-white mb-3">Technical Skills:</h4>
            <ul class="space-y-2 text-gray-300 text-sm">
              <li class="flex items-start gap-2">
                <span class="text-green-400 mt-1">•</span>
                <span>AI platform configuration and management</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-green-400 mt-1">•</span>
                <span>Voice agent development and training</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-green-400 mt-1">•</span>
                <span>Marketing automation workflow design</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-green-400 mt-1">•</span>
                <span>CRM integration and optimization</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-green-400 mt-1">•</span>
                <span>Performance monitoring and analytics</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-semibold text-white mb-3">Business Skills:</h4>
            <ul class="space-y-2 text-gray-300 text-sm">
              <li class="flex items-start gap-2">
                <span class="text-green-400 mt-1">•</span>
                <span>ROI calculation and optimization</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-green-400 mt-1">•</span>
                <span>Process automation strategy</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-green-400 mt-1">•</span>
                <span>Change management and adoption</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-green-400 mt-1">•</span>
                <span>Vendor evaluation and selection</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-green-400 mt-1">•</span>
                <span>Team training and development</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="next-steps bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-400/30 rounded-2xl p-6 sm:p-8">
        <h3 class="text-xl sm:text-2xl font-bold text-white mb-4">🚀 Ready to Get Started?</h3>
        <p class="text-gray-300 mb-6 leading-relaxed text-sm sm:text-base">
          Join thousands of professionals who have transformed their careers and businesses with AI automation. This comprehensive course provides everything you need to become an AI automation expert and start generating real results immediately.
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <a href="https://freedom.kenjiai.com/checkout-4912-2457-3370" class="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-4 rounded-xl font-bold text-base sm:text-lg hover:shadow-lg transition-all duration-300 text-center">
            Get Started Now
          </a>
          <a href="/free-tools" class="bg-gray-800 border border-gray-600 hover:border-purple-400 text-white px-6 py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 text-center">
            Try Free Tools First
          </a>
        </div>
      </div>
    `,
    category: "AI Mastery",
    level: "Beginner to Advanced",
    duration: "8 weeks",
    lessons: 24,
    students: "15,247",
    date: "2025-01-15",
    author: "Dr. Sarah Chen",
    authorTitle: "AI Research Director & Course Instructor",
    authorBio: "Leading AI researcher with 10+ years in machine learning and business automation. PhD in Computer Science from Stanford. Has helped 500+ companies implement AI automation.",
    image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200",
    views: "15.2K",
    rating: 4.9,
    price: "Free",
    tags: ["AI Automation", "Business Growth", "Machine Learning", "ROI", "Digital Transformation"],
    estimatedReadTime: 45,
    publishedDate: "2025-01-15T10:00:00Z",
    lastModified: "2025-01-15T10:00:00Z",
    skills: ["AI Strategy", "Business Automation", "Revenue Generation", "ROI Optimization"],
    prerequisites: ["Basic computer skills", "Business fundamentals", "Willingness to learn"],
    courseResources: [
      "24 video lessons (8+ hours)",
      "5 hands-on projects",
      "Downloadable templates",
      "Community access",
      "1-on-1 mentoring session",
      "Professional certificate"
    ]
  };

  const relatedCourses = [
    {
      name: "Voice AI Sales Mastery",
      description: "Learn to deploy AI voice agents that close deals 24/7",
      url: "/blog/voice-ai-sales-conversion-optimization",
      level: "Intermediate",
      duration: "4 weeks"
    },
    {
      name: "Tax Optimization with AI",
      description: "AI-powered tax strategies that save entrepreneurs $50K+ annually",
      url: "/blog/tax-optimization-ai-strategies",
      level: "Intermediate", 
      duration: "6 weeks"
    },
    {
      name: "Investment AI Analytics",
      description: "Use AI for portfolio optimization and risk management",
      url: "/blog/smart-investment-ai-analytics",
      level: "Advanced",
      duration: "10 weeks"
    }
  ];

  const courseModules = [
    { module: 1, title: "AI Automation Fundamentals", lessons: 6, duration: "2 weeks" },
    { module: 2, title: "Voice AI Implementation", lessons: 8, duration: "2 weeks" },
    { module: 3, title: "Marketing Automation", lessons: 6, duration: "2 weeks" },
    { module: 4, title: "Advanced Integration", lessons: 4, duration: "2 weeks" }
  ];

  return (
    <>
      <Helmet>
        <title>{course.title} | KenjiAI Educational Hub</title>
        <meta name="description" content={course.excerpt} />
        <meta name="keywords" content={course.tags.join(', ')} />
        <meta name="author" content={course.author} />
        <meta property="article:published_time" content={course.publishedDate} />
        <meta property="article:modified_time" content={course.lastModified} />
        <meta property="article:author" content={course.author} />
        <meta property="article:section" content={course.category} />
        {course.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            "name": course.title,
            "description": course.excerpt,
            "provider": {
              "@type": "Organization",
              "name": "KenjiAI",
              "sameAs": "https://kenjiai.com"
            },
            "author": {
              "@type": "Person",
              "name": course.author
            },
            "datePublished": course.publishedDate,
            "dateModified": course.lastModified,
            "keywords": course.tags.join(', '),
            "teaches": course.skills.join(', '),
            "educationalLevel": course.level,
            "timeRequired": `PT${course.duration.replace(/\D/g, '')}W`
          })}
        </script>
      </Helmet>
      
      <div className="pt-24 pb-16 bg-gray-900 min-h-screen" role="region" aria-labelledby="blog-post-title">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link 
              role="navigation"
              aria-label="Back to Educational Hub"
              to="/knowledge"
              className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Educational Hub
            </Link>
          </motion.div>

          {/* Course Header */}
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-6">
              <span className="bg-gradient-to-r from-purple-500 to-blue-400 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2">
                <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4" />
                {course.category}
              </span>
              <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded-lg text-xs sm:text-sm">
                {course.level}
              </span>
              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-lg text-xs sm:text-sm font-bold">
                {course.price}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {course.title}
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 leading-relaxed mb-8">
              {course.excerpt}
            </p>

            {/* Course Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <div className="text-center">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-base sm:text-lg font-bold text-white">{course.duration}</div>
                <div className="text-gray-400 text-xs sm:text-sm">Duration</div>
              </div>
              <div className="text-center">
                <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mx-auto mb-2" />
                <div className="text-base sm:text-lg font-bold text-white">{course.lessons}</div>
                <div className="text-gray-400 text-xs sm:text-sm">Lessons</div>
              </div>
              <div className="text-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-base sm:text-lg font-bold text-white">{course.students}</div>
                <div className="text-gray-400 text-xs sm:text-sm">Students</div>
              </div>
              <div className="text-center">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-base sm:text-lg font-bold text-white">{course.rating}</div>
                <div className="text-gray-400 text-xs sm:text-sm">Rating</div>
              </div>
            </div>

            {/* Skills & Prerequisites */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3">Skills You'll Gain:</h3>
                <div className="flex flex-wrap gap-2">
                  {course.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-lg text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3">Prerequisites:</h3>
                <ul className="space-y-1">
                  {course.prerequisites.map((prereq, index) => (
                    <li key={index} className="text-gray-400 text-xs sm:text-sm flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                      {prereq}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Instructor Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between bg-gray-800/50 rounded-2xl p-4 sm:p-6 mb-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4 sm:mb-0">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold mr-0 mb-3 sm:mb-0 sm:mr-4 text-xl">
                  {course.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-white font-semibold text-lg">{course.author}</div>
                  <div className="text-purple-400 text-sm">{course.authorTitle}</div>
                  <div className="text-gray-400 text-xs sm:text-sm mt-1 max-w-xs">{course.authorBio}</div>
                </div>
              </div>
              <button className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
                <Share2 className="w-4 h-4" />
                Share Course
              </button>
            </div>
          </motion.header>

          {/* Course Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-3xl"
              loading="lazy"
            />
          </motion.div>

          {/* Course Modules Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">📋 Course Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {courseModules.map((module, index) => (
                <div key={module.module} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                      {module.module}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white">{module.title}</h3>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
                    <span>{module.lessons} lessons</span>
                    <span>•</span>
                    <span>{module.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Course Content */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="prose prose-lg prose-invert max-w-none mb-16 course-content"
            role="article"
            dangerouslySetInnerHTML={{ __html: course.content }}
          />

          {/* Course Resources */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="bg-gradient-to-br from-gray-800/50 to-purple-900/20 border border-gray-700 rounded-3xl p-6 sm:p-8 mb-12"
            role="complementary"
            aria-labelledby="course-resources-heading"
          >
            <div className="flex items-center gap-3 mb-6">
              <Download className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 flex-shrink-0" />
              <h3 id="course-resources-heading" className="text-xl sm:text-2xl font-bold text-white">Course Resources</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4" role="list">
              {course.courseResources.map((resource, index) => (
                <div key={index} className="flex items-center gap-3 text-gray-300 text-sm" role="listitem">
                  <FileText className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>{resource}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Related Courses */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-12"
            role="navigation"
            aria-labelledby="related-courses-heading"
          >
            <h3 id="related-courses-heading" className="text-2xl font-bold text-white mb-6">Related Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6" role="list">
              {relatedCourses.map((relatedCourse, index) => (
                <Link key={relatedCourse.name} to={relatedCourse.url}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    role="listitem"
                    className="bg-gray-800/50 border border-gray-700 hover:border-purple-400/50 rounded-2xl p-4 sm:p-6 transition-all duration-300 group h-full"
                  >
                    <h4 className="text-white font-semibold mb-2 group-hover:text-purple-300 transition-colors text-sm sm:text-base">
                      {relatedCourse.name}
                    </h4>
                    <p className="text-gray-400 text-xs sm:text-sm mb-4">{relatedCourse.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{relatedCourse.level}</span>
                      <span>{relatedCourse.duration}</span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Enrollment CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-center bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-400/30 rounded-3xl p-6 sm:p-8"
            role="complementary"
            aria-labelledby="enrollment-cta-heading"
          >
            <GraduationCap className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400 mx-auto mb-4 sm:mb-6" />
            <h3 id="enrollment-cta-heading" className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
              Ready to Master AI Automation?
            </h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
              Join {course.students} students who are already transforming their careers and businesses with AI automation.
            </p>
            <motion.a
              href="https://freedom.kenjiai.com/checkout-4912-2457-3370"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
            >
              Get Started Now
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.a>
            <p className="text-gray-500 text-xs sm:text-sm mt-4">
              Free access • Professional certificate • Lifetime updates
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default BlogPost;