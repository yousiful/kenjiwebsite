import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Phone, MessageCircle, TrendingUp, ArrowRight, CheckCircle, Star, Clock, DollarSign, Users, Zap, Crown, Play, Volume2, PhoneCall, Target, Award, Shield, Sparkles } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const VoiceAILandingPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pricingPlans = [
    {
      id: 'starter',
      name: 'Voice AI Starter',
      price: 10,
      description: 'Perfect for small businesses getting started with AI voice automation',
      paymentLink: 'https://buy.stripe.com/aFa9AS95X4xO5HFdtpaMU1i',
      features: [
        '1 AI Voice Agent',
        '100 calls per month',
        'Basic conversation flows',
        'Email support',
        'Call analytics dashboard',
        'Lead qualification'
      ],
      popular: false,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'pro',
      name: 'Voice AI Professional',
      price: 49,
      description: 'Most popular plan for growing businesses that want to scale their sales',
      paymentLink: 'https://buy.stripe.com/4gM14mdmde8ofif895aMU1k',
      features: [
        '5 AI Voice Agents',
        '1,000 calls per month',
        'Advanced conversation flows',
        'Priority support',
        'Advanced analytics',
        'CRM integration',
        'Custom voice training',
        'A/B testing'
      ],
      popular: true,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'enterprise',
      name: 'Voice AI Enterprise',
      price: 99,
      description: 'For businesses that need unlimited AI voice agents and premium features',
      paymentLink: 'https://buy.stripe.com/aFaeVc4PH9S8fifahdaMU1j',
      features: [
        'Unlimited AI Voice Agents',
        'Unlimited calls',
        'Custom conversation flows',
        'White-glove support',
        'Advanced AI training',
        'Multi-language support',
        'API access',
        'Custom integrations',
        'Dedicated account manager'
      ],
      popular: false,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "TechStart Solutions",
      role: "CEO",
      content: "Our AI voice agent closed $47K in deals in the first month. It's like having a top sales rep working 24/7.",
      result: "$47K in 30 days",
      avatar: "SJ"
    },
    {
      name: "Marcus Chen",
      company: "Digital Growth Co",
      role: "Sales Director", 
      content: "We went from 20 qualified leads per week to 150. The AI never sleeps and never has a bad day.",
      result: "650% lead increase",
      avatar: "MC"
    },
    {
      name: "Lisa Rodriguez",
      company: "E-commerce Plus",
      role: "Founder",
      content: "The voice AI handles all our customer inquiries and books appointments automatically. Game changer!",
      result: "90% automation",
      avatar: "LR"
    }
  ];

  const features = [
    {
      icon: Phone,
      title: "24/7 Sales Calls",
      description: "AI agents that never sleep, never take breaks, and consistently deliver your sales pitch",
      benefit: "300% more opportunities"
    },
    {
      icon: Target,
      title: "Lead Qualification",
      description: "Automatically qualify leads based on your criteria and route hot prospects to your team",
      benefit: "85% qualification accuracy"
    },
    {
      icon: MessageCircle,
      title: "Natural Conversations",
      description: "Human-like conversations that build rapport and handle objections professionally",
      benefit: "95% customer satisfaction"
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Track call performance, conversion rates, and optimize for better results",
      benefit: "Real-time insights"
    }
  ];

  const results = [
    { metric: "300%", label: "More Calls Handled", description: "Scale without hiring" },
    { metric: "85%", label: "Lead Qualification Rate", description: "Accurate prospect identification" },
    { metric: "60%", label: "Faster Sales Cycle", description: "Close deals quicker" },
    { metric: "24/7", label: "Availability", description: "Never miss opportunities" }
  ];

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleGetStarted = (planId: string) => {
    const plan = pricingPlans.find(p => p.id === planId);
    if (plan) {
      // Track conversion with Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'begin_checkout', {
          currency: 'USD',
          value: plan.price,
          items: [{
            item_id: plan.id,
            item_name: plan.name,
            category: 'Voice AI',
            quantity: 1,
            price: plan.price
          }]
        });
      }
      
      // Track conversion with Meta Pixel
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'InitiateCheckout', {
          content_name: plan.name,
          content_category: 'Voice AI',
          content_ids: [plan.id],
          content_type: 'product',
          value: plan.price,
          currency: 'USD'
        });
        
        // Send conversion API event
        fetch('https://graph.facebook.com/v17.0/2406747486323295/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: [{
              event_name: 'InitiateCheckout',
              event_time: Math.floor(Date.now() / 1000),
              action_source: 'website',
              user_data: {
                client_ip_address: '{{client_ip_address}}',
                client_user_agent: '{{client_user_agent}}'
              },
              custom_data: {
                content_name: plan.name,
                content_category: 'Voice AI',
                content_ids: [plan.id],
                content_type: 'product',
                value: plan.price,
                currency: 'USD'
              }
            }],
            access_token: 'EAAG9A5px4gMBOZC9Dzoca4bGAvSOSVI0gVZCxTjYPJfsPhQApTcPldJaLxE3q2dzgXw0fzs7UmZBFWj5HD4YfKfO5QnX6BVfxS6wRZCcZBcGMN4BsXzqXQTwYe53519apNj0OWi1IIa6eY5zqKamSymenEROmFMTvQ0JDXrPidOJpSs8tZBRn5ZCZADfZChrtUlc6sAZDZD'
          })
        }).catch(error => {
          console.error('Meta Conversion API error:', error);
        });
      }
      
      window.open(plan.paymentLink, '_blank');
    }
  };

  // Scroll to section function
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Meta Pixel Code */}
      <Helmet>
        <script>
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2406747486323295');
            fbq('track', 'PageView');
          `}
        </script>
        <noscript>
          {`<img height="1" width="1" style="display:none"
          src="https://www.facebook.com/tr?id=2406747486323295&ev=PageView&noscript=1"
          />`}
        </noscript>
        <title>AI Voice Agents That Close Deals 24/7 | KenjiAI Voice AI Platform</title>
        <meta name="description" content="Deploy AI voice agents that handle sales calls, qualify leads, and close deals 24/7. 85% qualification rate, 300% more calls handled. Starting at $10/month." />
        <meta name="keywords" content="AI voice agents, automated sales calls, voice AI, AI phone calls, sales automation, lead qualification, 24/7 sales" />
      </Helmet>
      
      <div className="pt-16 bg-gray-900 min-h-screen">
        {/* Accessible Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 group">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{
                    backgroundImage: `url('https://assets.cdn.filesafe.space/q5L4ttbBMHNxieXIcTVJ/media/5adccaae-527e-49d4-befc-6410b918c624.gif')`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.4))',
                    mixBlendMode: 'screen'
                  }}
                  aria-hidden="true"
                />
                <span className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  KenjiAI
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => link.href.startsWith('#') ? scrollToSection(link.href.substring(1)) : window.location.href = link.href}
                    className="text-gray-300 hover:text-blue-400 transition-colors font-medium"
                    aria-label={`Navigate to ${link.name}`}
                  >
                    {link.name}
                  </button>
                ))}
              </div>

              {/* CTA Button */}
              <div className="hidden md:block">
                <motion.button
                  onClick={() => handleGetStarted(selectedPlan)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  aria-label="Get started with Voice AI"
                >
                  Get Started
                </motion.button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-white hover:text-blue-400 transition-colors p-2"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-gray-800 border-t border-gray-700"
            >
              <div className="px-4 py-4 space-y-4">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => link.href.startsWith('#') ? scrollToSection(link.href.substring(1)) : window.location.href = link.href}
                    className="block text-gray-300 hover:text-blue-400 transition-colors font-medium py-2"
                    aria-label={`Navigate to ${link.name}`}
                  >
                    {link.name}
                  </button>
                ))}
                <motion.button
                  onClick={() => handleGetStarted(selectedPlan)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 mt-4"
                  aria-label="Get started with Voice AI"
                >
                  Get Started
                </motion.button>
              </div>
            </motion.div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden" id="home">
          {/* Animated Background */}
          <div className="absolute inset-0" aria-hidden="true">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-blue-400/30 rounded-full px-6 py-3 mb-6"
                >
                  <Mic className="w-5 h-5 text-blue-400" aria-hidden="true" />
                  <span className="text-blue-400 font-semibold">AI Voice Agents</span>
                </motion.div>

                <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                    AI Voice Agents
                  </span>
                  <br />
                  That Close Deals
                  <br />
                  <span className="text-yellow-400">While You Sleep</span>
                </h1>

                <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                  Deploy human-like AI voice agents that handle sales calls, qualify leads, and close deals 24/7. 
                  Never miss another opportunity with AI that works around the clock.
                </p>

                {/* Results Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {results.map((result, index) => (
                    <motion.div
                      key={result.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      className="text-center bg-gray-800/50 rounded-xl p-4"
                    >
                      <div className="text-2xl font-bold text-blue-400 mb-1">{result.metric}</div>
                      <div className="text-white font-semibold text-sm mb-1">{result.label}</div>
                      <div className="text-gray-400 text-xs">{result.description}</div>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  onClick={() => handleGetStarted(selectedPlan)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-lg transition-all duration-300 flex items-center gap-3 mb-4"
                  aria-label="Start your Voice AI agent now"
                >
                  <Phone className="w-6 h-6" aria-hidden="true" />
                  Start Your Voice Agent Now
                  <ArrowRight className="w-6 h-6" aria-hidden="true" />
                </motion.button>

                <p className="text-gray-500 text-sm">
                  ✓ Setup in 5 minutes ✓ No contracts ✓ Cancel anytime
                </p>
              </motion.div>

              {/* Right Column - Demo */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Live Voice AI Demo</h3>
                    <div className="flex items-center gap-2 text-green-400">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" aria-hidden="true"></div>
                      <span className="text-sm font-semibold">LIVE</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6" aria-label="Voice AI conversation demo">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center" aria-label="AI Voice Agent">
                        <Mic className="w-4 h-4 text-white" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-blue-500/20 rounded-lg p-3">
                          <p className="text-white text-sm">"Hi! I'm calling about your interest in our AI automation services. Do you have 2 minutes to discuss how we can help scale your business?"</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center" aria-label="Customer">
                        <Users className="w-4 h-4 text-white" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-700/50 rounded-lg p-3">
                          <p className="text-gray-300 text-sm">"Yes, I'm interested but I'm not sure if it's right for my business size..."</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center" aria-label="AI Voice Agent">
                        <Mic className="w-4 h-4 text-white" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-blue-500/20 rounded-lg p-3">
                          <p className="text-white text-sm">"I understand that concern! Can you tell me how many leads you're currently handling per month? This will help me show you the exact ROI you can expect..."</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => setIsPlaying(!isPlaying)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3"
                    aria-label={isPlaying ? "Pause demo call" : "Listen to full demo call"}
                  >
                    {isPlaying ? <Volume2 className="w-5 h-5" aria-hidden="true" /> : <Play className="w-5 h-5" aria-hidden="true" />}
                    {isPlaying ? 'Playing Demo Call...' : 'Listen to Full Demo Call'}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-16 bg-gray-800/30" id="testimonials">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                Trusted by 10,000+ Businesses Worldwide
              </h2>
              <p className="text-gray-400">See what our customers are saying about their results</p>
            </motion.div>

            <div className="relative max-w-4xl mx-auto">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800/50 border border-gray-700 rounded-3xl p-8 text-center"
                aria-live="polite"
              >
                <div className="flex items-center justify-center mb-6" aria-label={`Rating: 5 out of 5 stars`}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" aria-hidden="true" />
                  ))}
                </div>
                
                <blockquote className="text-xl text-white mb-6 leading-relaxed">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-400 rounded-full flex items-center justify-center text-white font-bold" aria-hidden="true">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold">{testimonials[currentTestimonial].name}</div>
                    <div className="text-gray-400 text-sm">{testimonials[currentTestimonial].role}, {testimonials[currentTestimonial].company}</div>
                  </div>
                  <div className="ml-8 bg-green-500/20 text-green-400 px-4 py-2 rounded-lg">
                    <div className="font-bold">{testimonials[currentTestimonial].result}</div>
                  </div>
                </div>
              </motion.div>

              {/* Testimonial Navigation */}
              <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Testimonial navigation">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentTestimonial ? 'bg-blue-400' : 'bg-gray-600'
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                    aria-selected={index === currentTestimonial}
                    role="tab"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Why Choose Our AI Voice Agents?
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Advanced AI technology that delivers human-like conversations and real business results
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gray-800/50 border border-gray-700 hover:border-blue-400/50 rounded-2xl p-8 transition-all duration-300"
                >
                  <feature.icon className="w-12 h-12 text-blue-400 mb-6" aria-hidden="true" />
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">{feature.description}</p>
                  <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg text-sm font-semibold inline-block">
                    {feature.benefit}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-gray-800/30" id="pricing">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Choose Your Voice AI Plan
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Start small and scale up as your business grows. All plans include our core AI voice technology.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`relative bg-gray-800/50 border rounded-3xl p-8 transition-all duration-300 ${
                    plan.popular 
                      ? 'border-green-400/50 shadow-2xl shadow-green-500/20' 
                      : 'border-gray-700 hover:border-blue-400/50'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={selectedPlan === plan.id}
                  aria-label={`Select ${plan.name} plan at $${plan.price} per month`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedPlan(plan.id);
                      e.preventDefault();
                    }
                  }}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                        <Crown className="w-4 h-4" aria-hidden="true" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8 pt-4">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl mb-4`} aria-hidden="true">
                      <PhoneCall className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                    
                    <div className="flex items-baseline justify-center mb-6">
                      <span className="text-5xl font-bold text-white">${plan.price}</span>
                      <span className="text-gray-400 ml-2">/month</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8" aria-label={`Features included in ${plan.name} plan`}>
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" aria-hidden="true" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGetStarted(plan.id);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg'
                    }`}
                    aria-label={`Get started with ${plan.name} plan at $${plan.price} per month`}
                  >
                    Get Started Now
                  </motion.button>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-400" aria-hidden="true" />
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-400" aria-hidden="true" />
                  <span>Setup in 5 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-400" aria-hidden="true" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20" id="contact">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-r from-blue-900/30 to-green-900/30 border border-blue-400/30 rounded-3xl p-12"
            >
              <Sparkles className="w-16 h-16 text-blue-400 mx-auto mb-6" aria-hidden="true" />
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Deploy Your AI Sales Team?
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of businesses using AI voice agents to close more deals, 
                qualify more leads, and never miss another opportunity.
              </p>
              
              <motion.button
                onClick={() => handleGetStarted(selectedPlan)}
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(59, 130, 246, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-12 py-6 rounded-2xl font-bold text-2xl hover:shadow-lg transition-all duration-300 flex items-center gap-4 mx-auto"
                aria-label="Start your Voice AI agent today"
              >
                <Phone className="w-8 h-8" aria-hidden="true" />
                Start Your Voice Agent Today
                <ArrowRight className="w-8 h-8" aria-hidden="true" />
              </motion.button>
              
              <p className="text-gray-500 text-sm mt-6">
                ✓ 5-minute setup ✓ 30-day guarantee ✓ Cancel anytime ✓ 24/7 support
              </p>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-gray-900 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-white font-semibold mb-4">Voice AI</h3>
                <ul className="space-y-2">
                  <li><a href="#features" className="text-gray-400 hover:text-blue-400 transition-colors">Features</a></li>
                  <li><a href="#pricing" className="text-gray-400 hover:text-blue-400 transition-colors">Pricing</a></li>
                  <li><a href="#testimonials" className="text-gray-400 hover:text-blue-400 transition-colors">Testimonials</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors">Home</Link></li>
                  <li><Link to="/knowledge" className="text-gray-400 hover:text-blue-400 transition-colors">Education</Link></li>
                  <li><Link to="/free-tools" className="text-gray-400 hover:text-blue-400 transition-colors">Free Tools</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">API Reference</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Support</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Contact</h3>
                <ul className="space-y-2">
                  <li className="text-gray-400">Email: care@kenjiai.com</li>
                  <li className="text-gray-400">Phone: (831) 263-4402</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} KenjiAI. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default VoiceAILandingPage;