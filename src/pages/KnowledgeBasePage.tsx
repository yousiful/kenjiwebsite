import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, MessageSquare, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useAutoFormatting } from '../components/AutoFormattingProvider';
import AIKnowledgeChat from '../components/AIKnowledgeChat';

const KnowledgeBasePage: React.FC = () => {
  const { fixFormatting } = useAutoFormatting();

  useEffect(() => {
    fixFormatting();

    const timer = setTimeout(() => {
      fixFormatting();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [fixFormatting]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "name": "KenjiAI Knowledge Assistant - AI-Powered Help Center",
    "description": "Get instant AI-powered answers about KenjiAI, GoHighLevel integration, AI voice agents, conversation AI, and workflow automation.",
    "url": "https://kenjiai.com/knowledge",
  };

  return (
    <>
      <Helmet>
        <title>KenjiAI Knowledge Assistant - AI-Powered Help Center</title>
        <meta name="description" content="Get instant AI-powered answers about KenjiAI, GoHighLevel integration, AI voice agents, conversation AI, and workflow automation. Real-time support from our AI assistant." />
        <meta name="keywords" content="KenjiAI help, AI assistant, GoHighLevel support, voice AI help, conversation AI guide, workflow automation help, AI knowledge base" />
        <link rel="canonical" href="https://kenjiai.com/knowledge" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="pt-24 pb-16 bg-gray-900 min-h-screen" role="region" aria-labelledby="knowledge-base-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-full px-4 py-2 sm:px-6 sm:py-3 mb-4 sm:mb-6"
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              <span className="text-blue-400 font-semibold text-sm sm:text-base">Education Center</span>
            </motion.div>

            <h1 id="knowledge-base-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight">
              Ask Our
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI Knowledge Assistant
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
              Get instant answers from GoHighLevel support center, Google, and our expert knowledge base.
              Just ask anything about KenjiAI, AI automation, workflows, or integrations.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-400/30 rounded-full px-4 py-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-semibold">AI-Powered Answers</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-400/30 rounded-full px-4 py-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 text-sm font-semibold">Real-Time Support</span>
              </div>
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-400/30 rounded-full px-4 py-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-semibold">Multi-Source Search</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16"
          >
            <AIKnowledgeChat />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default KnowledgeBasePage;
