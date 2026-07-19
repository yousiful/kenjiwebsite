import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Rocket, Mail, Calendar, ArrowRight, Gift, Star, Users, Zap, Crown, Trophy, Sparkles, Download, Play, MessageCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const SuccessPage: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Get session ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sessionIdParam = urlParams.get('session_id');
    setSessionId(sessionIdParam);

    // Track successful payment
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'purchase', {
        transaction_id: sessionIdParam || Date.now().toString(),
        value: 297,
        currency: 'USD',
        items: [{
          item_id: 'kenjiai_subscription',
          item_name: 'KenjiAI Subscription',
          category: 'Software',
          quantity: 1,
          price: 297
        }]
      });
    }

    // Track conversion for other analytics platforms
    if (typeof window !== 'undefined') {
      // Facebook Pixel
      if ((window as any).fbq) {
        (window as any).fbq('track', 'Purchase', {
          value: 297,
          currency: 'USD'
        });
      }

      // Custom analytics
      if ((window as any).analytics) {
        (window as any).analytics.track('Subscription Created', {
          plan: 'KenjiAI Complete',
          value: 297,
          currency: 'USD',
          session_id: sessionIdParam
        });
      }
    }

    // Clear any stored discount codes since they've been used
    localStorage.removeItem('kenjiai-discount-earned');
    localStorage.removeItem('kenjiai-discount-coupon');

    // Hide confetti after 3 seconds
    setTimeout(() => setShowConfetti(false), 3000);

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const quickActions = [
    {
      icon: Rocket,
      title: "Access Dashboard",
      description: "Start building your AI empire immediately",
      action: "Launch Dashboard",
      link: "https://app.kenjiai.com",
      color: "from-blue-600 to-cyan-500",
      priority: "HIGH"
    },
    {
      icon: Calendar,
      title: "Book Onboarding",
      description: "Free 15-min setup call with AI experts",
      action: "Schedule Now",
      link: "https://go.mediatraffics.com/leads",
      color: "from-green-600 to-emerald-500",
      priority: "RECOMMENDED"
    },
    {
      icon: Download,
      title: "Quick Start Guide",
      description: "Download your personalized setup guide",
      action: "Download PDF",
      link: "#",
      color: "from-purple-600 to-pink-500",
      priority: "BONUS"
    }
  ];

  const welcomeGifts = [
    {
      icon: Crown,
      title: "VIP Mastermind Access",
      description: "Exclusive community of successful entrepreneurs",
      value: "$497/month",
      status: "UNLOCKED"
    },
    {
      icon: Trophy,
      title: "AI Automation Playbook",
      description: "Step-by-step guide to 10x your business",
      value: "$297",
      status: "UNLOCKED"
    },
    {
      icon: Sparkles,
      title: "Priority Support",
      description: "White-glove support for your first 30 days",
      value: "$197/month",
      status: "UNLOCKED"
    },
    {
      icon: Star,
      title: "Weekly Live Training",
      description: "Exclusive training sessions with our experts",
      value: "$97/week",
      status: "UNLOCKED"
    }
  ];

  const nextSteps = [
    {
      step: 1,
      title: "Check Your Email",
      description: "Login credentials and welcome guide sent",
      icon: Mail,
      estimated: "Now"
    },
    {
      step: 2,
      title: "Complete Setup",
      description: "Follow the quick setup wizard",
      icon: Zap,
      estimated: "5 mins"
    },
    {
      step: 3,
      title: "First AI Agent",
      description: "Deploy your first voice agent",
      icon: MessageCircle,
      estimated: "10 mins"
    },
    {
      step: 4,
      title: "Start Automating",
      description: "Begin your business transformation",
      icon: Rocket,
      estimated: "15 mins"
    }
  ];

  return (
    <>
      {/* SEO Head */}
      <title>🎉 Welcome to Your AI Empire! | KenjiAI Success</title>
      <meta name="description" content="Welcome to KenjiAI! Your payment was successful. Access your dashboard, claim bonuses, and start your AI business transformation journey." />
      <meta name="robots" content="noindex, nofollow" />
      
      {/* Confetti Background */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: -10,
                rotate: 0,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{
                y: window.innerHeight + 10,
                rotate: 360,
                transition: {
                  duration: Math.random() * 3 + 2,
                  ease: "easeOut"
                }
              }}
            />
          ))}
        </div>
      )}
      
      <div className="pt-24 pb-16 bg-gray-900 min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Success Section */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 rounded-full mb-8 shadow-2xl sparkle-effect relative">
              <CheckCircle className="w-16 h-16 text-white" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/50 to-emerald-400/50 animate-ping"></div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-6xl sm:text-7xl font-bold text-white mb-6"
            >
              🎉 <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Welcome to Your Empire!
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-2xl text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto"
            >
              🚀 <strong className="text-green-400">Payment Successful!</strong> You're now part of the AI revolution. 
              Your business transformation starts <em>right now</em>.
            </motion.p>

            {/* Success Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8"
            >
              <div className="bg-green-500/20 border border-green-400/30 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-green-400">✓</div>
                <div className="text-white font-semibold text-sm">Payment Confirmed</div>
              </div>
              <div className="bg-blue-500/20 border border-blue-400/30 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">1</div>
                <div className="text-white font-semibold text-sm">Day Setup Time</div>
              </div>
              <div className="bg-purple-500/20 border border-purple-400/30 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">∞</div>
                <div className="text-white font-semibold text-sm">Unlimited Access</div>
              </div>
              <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">24/7</div>
                <div className="text-white font-semibold text-sm">Support Included</div>
              </div>
            </motion.div>

            {sessionId && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="bg-gray-800/50 border border-gray-700 rounded-2xl p-4 mb-8 inline-block"
              >
                <p className="text-gray-300 text-sm">
                  <strong>Transaction ID:</strong> <code className="text-green-400 bg-gray-900 px-2 py-1 rounded">{sessionId}</code>
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Urgent Action Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-400/50 rounded-3xl p-6 mb-12 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-2">⏰ Quick Start Bonus Expires Soon!</h3>
            <p className="text-gray-300 mb-4">Complete your setup in the next {formatTime(timeLeft)} to unlock exclusive bonuses</p>
            <div className="text-3xl font-mono font-bold text-red-400">{formatTime(timeLeft)}</div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.3 + index * 0.2 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="relative bg-gray-800/50 border border-gray-700 hover:border-blue-400/50 rounded-3xl p-8 transition-all duration-300 group"
              >
                {/* Priority Badge */}
                <div className={`absolute -top-3 -right-3 px-3 py-1 rounded-full text-xs font-bold ${
                  action.priority === 'HIGH' ? 'bg-red-500 text-white' :
                  action.priority === 'RECOMMENDED' ? 'bg-green-500 text-white' :
                  'bg-purple-500 text-white'
                }`}>
                  {action.priority}
                </div>
                
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${action.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">{action.title}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">{action.description}</p>
                
                <a
                  href={action.link}
                  target={action.link.startsWith('http') ? '_blank' : undefined}
                  rel={action.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`inline-flex items-center gap-2 bg-gradient-to-r ${action.color} text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 w-full justify-center`}
                >
                  {action.action}
                  <ArrowRight className="w-5 h-5" />
                </a>
              </motion.div>
            ))}
          </motion.div>

          {/* Welcome Gifts */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <Gift className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-white mb-4">
                🎁 <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Welcome Bonuses Unlocked!
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                As a new member, you've automatically unlocked <strong className="text-green-400">$1,088 worth</strong> of exclusive bonuses
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {welcomeGifts.map((gift, index) => (
                <motion.div
                  key={gift.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.7 + index * 0.1 }}
                  className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-400/30 rounded-2xl p-6 text-center relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    {gift.status}
                  </div>
                  
                  <gift.icon className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
                  <h4 className="text-lg font-bold text-white mb-2">{gift.title}</h4>
                  <p className="text-gray-400 text-sm mb-3">{gift.description}</p>
                  <div className="text-green-400 font-bold">{gift.value}</div>
                  <div className="text-xs text-gray-500 mt-1">Value</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Next Steps Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.7 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              🚀 Your Success Roadmap
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {nextSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.9 + index * 0.1 }}
                  className="relative bg-gray-800/50 border border-gray-700 rounded-2xl p-6 text-center"
                >
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-blue-500 to-green-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                  
                  <step.icon className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                  <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                  <p className="text-gray-400 text-sm mb-3">{step.description}</p>
                  <div className="text-green-400 text-xs font-semibold">{step.estimated}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.1 }}
            className="text-center mb-12"
          >
            <motion.a
              href="https://app.kenjiai.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 60px rgba(59, 130, 246, 0.8)",
                y: -5
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 hover:from-blue-500 hover:via-purple-500 hover:to-green-400 text-white px-12 py-6 rounded-3xl font-bold text-2xl transition-all duration-500 shadow-2xl"
            >
              <Rocket className="w-8 h-8 group-hover:animate-bounce" />
              <span>Launch Your AI Empire Now</span>
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
              
              {/* Epic Glow Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 opacity-0 group-hover:opacity-40 blur-2xl transition-opacity duration-500"></div>
            </motion.a>
          </motion.div>

          {/* Support & Resources */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.3 }}
            className="bg-gradient-to-r from-gray-800/50 to-blue-900/20 border border-gray-700 rounded-3xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              🤝 We're Here to Help You Succeed
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <a href="mailto:care@kenjiai.com" className="flex items-center gap-3 text-blue-400 hover:text-blue-300 transition-colors p-3 rounded-xl hover:bg-gray-700/30">
                <Mail className="w-5 h-5" />
                <div>
                  <div className="font-semibold">Email Support</div>
                  <div className="text-xs text-gray-400">care@kenjiai.com</div>
                </div>
              </a>
              
              <a href="tel:+18312634402" className="flex items-center gap-3 text-green-400 hover:text-green-300 transition-colors p-3 rounded-xl hover:bg-gray-700/30">
                <Phone className="w-5 h-5" />
                <div>
                  <div className="font-semibold">Call Support</div>
                  <div className="text-xs text-gray-400">(831) 263-4402</div>
                </div>
              </a>
              
              <a href="https://support.kenjiai.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-purple-400 hover:text-purple-300 transition-colors p-3 rounded-xl hover:bg-gray-700/30">
                <MessageCircle className="w-5 h-5" />
                <div>
                  <div className="font-semibold">Help Center</div>
                  <div className="text-xs text-gray-400">24/7 Resources</div>
                </div>
              </a>
              
              <Link to="/" className="flex items-center gap-3 text-yellow-400 hover:text-yellow-300 transition-colors p-3 rounded-xl hover:bg-gray-700/30">
                <Star className="w-5 h-5" />
                <div>
                  <div className="font-semibold">Homepage</div>
                  <div className="text-xs text-gray-400">Return to site</div>
                </div>
              </Link>
            </div>
            
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Your success is our priority. We're committed to helping you build your AI-powered business empire.
              </p>
              <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
                <span>✓ 30-day money-back guarantee</span>
                <span>✓ 24/7 priority support</span>
                <span>✓ Lifetime updates included</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SuccessPage;