/**
 * EXAMPLE: AI Automation Page with Full Internal Linking Implementation
 *
 * This is a complete example showing how to implement the internal linking strategy
 * on a solution page. Use this as a reference for implementing on other pages.
 *
 * Key Features Demonstrated:
 * 1. Breadcrumbs navigation
 * 2. In-content contextual links
 * 3. Related Solutions section
 * 4. Multiple CTAs with varied anchor text
 * 5. Proper link attributes
 * 6. Accessible markup
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { RelatedSolutions } from '../components/RelatedSolutions';
import {
  Phone, Zap, Users, Bot, Workflow, TrendingUp,
  CheckCircle, ArrowRight, Star
} from 'lucide-react';

export function AIAutomationPageExample() {
  // Define related solutions for cross-linking
  const relatedSolutions = [
    {
      title: 'AI Voice Agents',
      description: 'Add 24/7 voice automation to handle calls and qualify leads automatically. Perfect complement to your AI workflows.',
      path: '/voice-agents',
      icon: Phone,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Marketing Automation',
      description: 'Automate email campaigns, social media, and lead nurturing workflows to maximize your reach.',
      path: '/marketing-automation',
      icon: Zap,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'CRM & Sales',
      description: 'Manage customers and automate your entire sales pipeline with intelligent data tracking.',
      path: '/crm',
      icon: Users,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const features = [
    {
      icon: Bot,
      title: 'Intelligent Workflows',
      description: 'Build custom automation that adapts to your business needs'
    },
    {
      icon: Workflow,
      title: 'Smart Integration',
      description: 'Connect with your existing tools seamlessly'
    },
    {
      icon: TrendingUp,
      title: 'Performance Analytics',
      description: 'Track ROI and optimize your automation'
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0B0E14' }}>
      {/*
        BREADCRUMBS
        - Provides hierarchical navigation
        - Improves SEO with structured data
        - Helps users understand their location
      */}
      <Breadcrumbs />

      {/*
        HERO SECTION
        - Include contextual internal links in hero copy
        - Use natural anchor text variations
        - Link to complementary solutions
      */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                AI Automation
              </span>
              {' '}That Scales Your Business
            </h1>

            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Save 85% of your time with intelligent workflows that handle repetitive tasks automatically.
              Combine with our{' '}
              {/* Example: Contextual link with descriptive anchor text */}
              <Link
                to="/voice-agents"
                className="text-green-400 hover:text-green-300 underline decoration-dotted hover:decoration-solid transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
              >
                AI voice agents
              </Link>
              {' '}and{' '}
              <Link
                to="/marketing-automation"
                className="text-green-400 hover:text-green-300 underline decoration-dotted hover:decoration-solid transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
              >
                marketing automation
              </Link>
              {' '}to create a complete growth engine that works 24/7.
            </p>

            {/*
              PRIMARY CTAs
              - Multiple options at different commitment levels
              - Varied anchor text (not all "Get Started")
            */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/pricing"
                className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center gap-2"
              >
                <span>See Pricing & Plans</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/free-tools"
                className="border-2 border-green-500 text-green-400 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-500/10 transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center gap-2"
              >
                <span>Try Free Tools First</span>
                <Star className="w-5 h-5" />
              </Link>
            </div>

            {/* Secondary CTA with different anchor text */}
            <p className="mt-6 text-gray-500 text-sm">
              Want to learn first?{' '}
              <Link
                to="/knowledge"
                className="text-green-400 hover:underline focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-1"
              >
                Explore our knowledge base
              </Link>
              {' '}with 156 free courses.
            </p>
          </motion.div>
        </div>
      </section>

      {/*
        FEATURES SECTION
        - Can include contextual links to related pages
        - Show how features work together
      */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Powerful Automation Features
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Built to integrate seamlessly with your{' '}
              <Link to="/crm" className="text-green-400 hover:underline">
                CRM system
              </Link>
              {' '}and existing workflows
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/*
        HOW IT WORKS SECTION
        - Include in-content links naturally
        - Reference other solutions contextually
      */}
      <section className="py-16 px-4" style={{ backgroundColor: 'rgba(11, 14, 20, 0.5)' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-400">
              Get started in minutes, scale in hours
            </p>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex gap-6"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Connect Your Tools
                </h3>
                <p className="text-gray-400">
                  Integrate with your existing{' '}
                  <Link to="/crm" className="text-green-400 hover:underline">
                    CRM
                  </Link>
                  , email platform, and{' '}
                  <Link to="/marketing-automation" className="text-green-400 hover:underline">
                    marketing tools
                  </Link>
                  {' '}in just a few clicks. No coding required.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex gap-6"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Build Your Workflows
                </h3>
                <p className="text-gray-400">
                  Create custom automation flows using our visual builder. Add{' '}
                  <Link to="/voice-agents" className="text-green-400 hover:underline">
                    AI voice agents
                  </Link>
                  {' '}for phone calls and{' '}
                  <Link to="/marketing-automation" className="text-green-400 hover:underline">
                    automated campaigns
                  </Link>
                  {' '}for nurturing leads.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex gap-6"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Scale & Optimize
                </h3>
                <p className="text-gray-400">
                  Watch your automation work 24/7 while you focus on growth.
                  Need help? Check out our{' '}
                  <Link to="/knowledge" className="text-green-400 hover:underline">
                    training library
                  </Link>
                  {' '}or{' '}
                  <a
                    href="https://support.kenjiai.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:underline"
                  >
                    contact support
                  </a>
                  .
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/*
        BENEFITS SECTION
        - Quantifiable results
        - Link to relevant case studies or knowledge base articles
      */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Businesses Choose KenjiAI
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { stat: '85%', label: 'Time Saved', description: 'Average time savings on repetitive tasks' },
              { stat: '300%', label: 'ROI Increase', description: 'Average return on investment within 6 months' },
              { stat: '24/7', label: 'Always Active', description: 'Your automation never sleeps' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center"
              >
                <div className="text-5xl font-bold text-green-400 mb-2">
                  {item.stat}
                </div>
                <div className="text-xl font-bold text-white mb-2">
                  {item.label}
                </div>
                <p className="text-gray-400 text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-gray-400 mb-4">
              Want to see detailed results?
            </p>
            <Link
              to="/knowledge"
              className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1"
            >
              <span>Read our case studies</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/*
        RELATED SOLUTIONS
        - Cross-promotion to complementary pages
        - Increases internal page discovery
        - Keeps users engaged
      */}
      <RelatedSolutions
        solutions={relatedSolutions}
        title="Complete Your Automation Stack"
        subtitle="Combine multiple solutions for maximum impact and 10x your results"
      />

      {/*
        TRUST SIGNALS & SOCIAL PROOF
        - Can include links to investor page, knowledge base testimonials
      */}
      <section className="py-16 px-4" style={{ backgroundColor: 'rgba(11, 14, 20, 0.5)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-8">
              Trusted by Growing Businesses
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[
                { icon: CheckCircle, text: 'SOC 2 Certified' },
                { icon: CheckCircle, text: 'GDPR Compliant' },
                { icon: CheckCircle, text: '99.9% Uptime' },
                { icon: CheckCircle, text: '24/7 Support' }
              ].map((badge, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 p-4 bg-gray-900/40 rounded-xl"
                >
                  <badge.icon className="w-6 h-6 text-green-400" />
                  <span className="text-sm text-gray-300">{badge.text}</span>
                </div>
              ))}
            </div>

            <p className="text-gray-400">
              Backed by top investors.{' '}
              <Link to="/investors" className="text-green-400 hover:underline">
                Learn about our mission
              </Link>
            </p>
          </motion.div>
        </div>
      </section>

      {/*
        FINAL CTA SECTION
        - Multiple conversion paths
        - Different commitment levels
        - Varied anchor text
      */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/30 rounded-3xl p-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Automate Your Business?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of businesses using KenjiAI to scale with AI automation
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              {/* Primary CTA - Pricing */}
              <Link
                to="/pricing"
                className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center gap-2"
              >
                <span>View Plans & Pricing</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              {/* Secondary CTA - Demo */}
              <a
                href="https://go.mediatraffics.com/leads"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-green-500 text-green-400 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-500/10 transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center gap-2"
              >
                <span>Book VIP Demo</span>
                <Star className="w-5 h-5" />
              </a>
            </div>

            {/* Alternative paths for different user segments */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <Link
                to="/free-tools"
                className="text-green-400 hover:text-green-300 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2"
              >
                Try free tools first →
              </Link>
              <span className="text-gray-600 hidden sm:inline">•</span>
              <Link
                to="/knowledge"
                className="text-green-400 hover:text-green-300 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2"
              >
                Learn more in our knowledge base →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/*
        FAQ SECTION (Optional)
        - Can include internal links in answers
        - Link to knowledge base articles
      */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-gray-900/60 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-2">
                How does AI automation integrate with my existing tools?
              </h3>
              <p className="text-gray-400">
                KenjiAI seamlessly connects with your{' '}
                <Link to="/crm" className="text-green-400 hover:underline">
                  CRM system
                </Link>
                ,{' '}
                <Link to="/marketing-automation" className="text-green-400 hover:underline">
                  marketing platforms
                </Link>
                , and hundreds of other tools through our API. Learn more in our{' '}
                <Link to="/knowledge" className="text-green-400 hover:underline">
                  integration guides
                </Link>
                .
              </p>
            </div>

            <div className="bg-gray-900/60 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-2">
                Can I try it before committing?
              </h3>
              <p className="text-gray-400">
                Absolutely! Start with our{' '}
                <Link to="/free-tools" className="text-green-400 hover:underline">
                  free AI tools
                </Link>
                {' '}to experience the power of automation, or explore our{' '}
                <Link to="/knowledge" className="text-green-400 hover:underline">
                  knowledge base
                </Link>
                {' '}with 156 free courses.
              </p>
            </div>

            <div className="bg-gray-900/60 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-2">
                What kind of support do you offer?
              </h3>
              <p className="text-gray-400">
                We provide 24/7 support through our{' '}
                <a
                  href="https://support.kenjiai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:underline"
                >
                  help center
                </a>
                , live chat, and dedicated account managers for premium plans.
                Check our{' '}
                <Link to="/pricing" className="text-green-400 hover:underline">
                  pricing page
                </Link>
                {' '}for details on each plan's support level.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * KEY TAKEAWAYS FROM THIS EXAMPLE:
 *
 * 1. BREADCRUMBS: Always at the top for navigation and SEO
 *
 * 2. CONTEXTUAL LINKS: Naturally embedded in content, not forced
 *    - Example: "Combine with our AI voice agents and marketing automation"
 *    - Links are relevant to the topic being discussed
 *
 * 3. ANCHOR TEXT VARIETY: Multiple variations used throughout
 *    - "AI voice agents", "voice automation", "AI voice assistants"
 *    - "Marketing automation", "marketing tools", "automated campaigns"
 *    - Avoid repeating exact same anchor text
 *
 * 4. MULTIPLE CONVERSION PATHS:
 *    - Primary: Direct to pricing
 *    - Secondary: Free tools (low commitment)
 *    - Tertiary: Knowledge base (nurture)
 *    - Quaternary: Demo booking (high intent)
 *
 * 5. RELATED SOLUTIONS: Dedicated section for cross-promotion
 *    - Uses RelatedSolutions component
 *    - Shows 3 complementary solutions
 *    - Encourages exploration
 *
 * 6. PROPER LINK ATTRIBUTES:
 *    - Internal: <Link to="/path">
 *    - External: target="_blank" rel="noopener noreferrer"
 *    - Focus states for accessibility
 *    - ARIA labels where needed
 *
 * 7. STRATEGIC PLACEMENT:
 *    - Hero: Main CTAs + contextual links
 *    - Features: Technical details with links
 *    - How It Works: Process with integration mentions
 *    - Benefits: Results with case study links
 *    - Related Solutions: Cross-promotion
 *    - FAQ: Support and resource links
 *    - Final CTA: Multiple conversion options
 *
 * Apply these patterns to ALL solution pages for consistency!
 */
