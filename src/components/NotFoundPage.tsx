import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, Zap, Users, Brain, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFoundPage: React.FC = () => {
  useEffect(() => {
    // Auto-redirect to pricing after 5 seconds
    const timer = setTimeout(() => {
      window.location.href = '/pricing';
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const popularPages = [
    { name: "Free AI Tools", href: "/free-tools", icon: Zap, description: "Access powerful AI tools completely free" },
    { name: "AI Knowledge Base", href: "/knowledge", icon: Brain, description: "Latest AI insights and tutorials" },
    { name: "Voice Agents", href: "/voice-agents", icon: Users, description: "AI that handles calls 24/7" },
    { name: "Get Started", href: "/pricing", icon: Zap, description: "Begin your AI transformation" }
  ];

  return (
    <>
      <Helmet>
        <title>Page Not Found | KenjiAI</title>
        <meta name="description" content="The page you're looking for doesn't exist. Explore our AI tools and content instead." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 pt-24">
        <div className="max-w-2xl w-full text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <AlertCircle className="w-24 h-24 text-blue-400 mx-auto mb-6" />
            <div className="text-8xl font-bold text-blue-400 mb-4">404</div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Oops! Page Not Found
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              The page you're looking for doesn't exist, but let's get you started with the perfect AI solution for your business!
            </p>
          </motion.div>

          {/* Auto-redirect notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-2xl p-4 mb-8"
          >
            <p className="text-green-300 text-sm font-semibold">
              🚀 Redirecting you to our pricing page in 5 seconds to get started with AI automation!
            </p>
          </motion.div>

          {/* Popular pages */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          >
            {popularPages.map((page, index) => (
              <Link key={page.name} to={page.href}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gray-800/50 border border-gray-700 hover:border-blue-400/50 rounded-2xl p-6 transition-all duration-300 group"
                >
                  <page.icon className="w-8 h-8 text-blue-400 mb-3 group-hover:text-green-400 transition-colors" />
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {page.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{page.description}</p>
                </motion.div>
              </Link>
            ))}
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/pricing">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-green-600 to-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all duration-300 flex items-center gap-3"
              >
                <Zap className="w-5 h-5" />
                View Pricing & Get Started
              </motion.button>
            </Link>

            <Link to="/">
              <button
                className="w-full bg-gray-800 border border-gray-600 hover:border-blue-400 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-3"
              >
                <Home className="w-5 h-5" />
                Go to Homepage
              </button>
            </Link>
          </motion.div>

          {/* Search suggestion */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-8 text-gray-500 text-sm"
          >
            <Search className="w-4 h-4 inline mr-2" />
            Looking for something specific? Try our{' '}
            <Link to="/knowledge" className="text-blue-400 hover:text-blue-300 underline">
              AI Knowledge Base
            </Link>
            {' '}or{' '}
            <Link to="/free-tools" className="text-green-400 hover:text-green-300 underline">
              Free Tools
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;