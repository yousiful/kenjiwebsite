import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Target, Award, Crown, Sparkles, TrendingUp, ChevronDown, ChevronUp, Gift, Copy, Check } from 'lucide-react';

interface GamificationState {
  points: number;
  level: number;
  scrollProgress: number;
  clickCount: number;
  achievements: string[];
  streakDays: number;
  totalVisitTime: number;
  hasCompletedSite: boolean;
  hasClaimedDiscount: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  points: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const GamificationSystem: React.FC = () => {
  const [gameState, setGameState] = useState<GamificationState>({
    points: 0,
    level: 1,
    scrollProgress: 0,
    clickCount: 0,
    achievements: [],
    streakDays: 1,
    totalVisitTime: 0,
    hasCompletedSite: false,
    hasClaimedDiscount: false
  });

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showPointGain, setShowPointGain] = useState<{ points: number; reason: string } | null>(null);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  const [showCompletionReward, setShowCompletionReward] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const DISCOUNT_COUPON = 'promo_1RfOD8AFtO7OZUieJ46MvA4E';

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle scroll visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide based on scroll direction
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setIsVisible(false);
        setIsExpanded(false); // Close expanded view when hiding
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const achievements: Achievement[] = [
    {
      id: 'first_scroll',
      title: 'Explorer',
      description: 'Started exploring KenjiAI',
      icon: Target,
      points: 10,
      unlocked: false,
      rarity: 'common'
    },
    {
      id: 'scroll_master',
      title: 'Scroll Master',
      description: 'Scrolled through 50% of the page',
      icon: TrendingUp,
      points: 25,
      unlocked: false,
      rarity: 'common'
    },
    {
      id: 'page_complete',
      title: 'Page Conqueror',
      description: 'Reached the bottom of the page',
      icon: Trophy,
      points: 50,
      unlocked: false,
      rarity: 'rare'
    },
    {
      id: 'click_enthusiast',
      title: 'Click Enthusiast',
      description: 'Clicked 10 interactive elements',
      icon: Zap,
      points: 30,
      unlocked: false,
      rarity: 'common'
    },
    {
      id: 'interaction_master',
      title: 'Interaction Master',
      description: 'Clicked 25 interactive elements',
      icon: Star,
      points: 75,
      unlocked: false,
      rarity: 'rare'
    },
    {
      id: 'ai_enthusiast',
      title: 'AI Enthusiast',
      description: 'Spent 2 minutes exploring',
      icon: Sparkles,
      points: 40,
      unlocked: false,
      rarity: 'common'
    },
    {
      id: 'power_user',
      title: 'Power User',
      description: 'Reached level 5',
      icon: Crown,
      points: 100,
      unlocked: false,
      rarity: 'epic'
    },
    {
      id: 'site_master',
      title: 'KenjiAI Master',
      description: 'Completed full site exploration',
      icon: Award,
      points: 500,
      unlocked: false,
      rarity: 'legendary'
    }
  ];

  const calculateLevel = (points: number): number => {
    return Math.floor(points / 100) + 1;
  };

  const addPoints = useCallback((points: number, reason: string) => {
    setGameState(prev => {
      const newPoints = prev.points + points;
      const newLevel = calculateLevel(newPoints);
      const leveledUp = newLevel > prev.level;

      if (leveledUp) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 2000);
      }

      setShowPointGain({ points, reason });
      setTimeout(() => setShowPointGain(null), 1500);

      return {
        ...prev,
        points: newPoints,
        level: newLevel
      };
    });
  }, []);

  const checkSiteCompletion = useCallback(() => {
    const completionCriteria = {
      scrolledToBottom: gameState.scrollProgress >= 95,
      interactedEnough: gameState.clickCount >= 15,
      spentTime: gameState.totalVisitTime >= 120,
      reachedLevel: gameState.level >= 3
    };

    const isCompleted = Object.values(completionCriteria).every(Boolean);
    
    if (isCompleted && !gameState.hasCompletedSite) {
      setGameState(prev => ({
        ...prev,
        hasCompletedSite: true,
        achievements: [...prev.achievements, 'site_master'],
        points: prev.points + 500
      }));
      
      // Show completion reward
      setShowCompletionReward(true);
      
      // Store discount coupon in localStorage for checkout
      localStorage.setItem('kenjiai-discount-coupon', DISCOUNT_COUPON);
      localStorage.setItem('kenjiai-discount-earned', 'true');
    }
  }, [gameState]);

  const checkAchievements = useCallback(() => {
    achievements.forEach(achievement => {
      if (!gameState.achievements.includes(achievement.id)) {
        let shouldUnlock = false;

        switch (achievement.id) {
          case 'first_scroll':
            shouldUnlock = gameState.scrollProgress > 0;
            break;
          case 'scroll_master':
            shouldUnlock = gameState.scrollProgress >= 50;
            break;
          case 'page_complete':
            shouldUnlock = gameState.scrollProgress >= 95;
            break;
          case 'click_enthusiast':
            shouldUnlock = gameState.clickCount >= 10;
            break;
          case 'interaction_master':
            shouldUnlock = gameState.clickCount >= 25;
            break;
          case 'ai_enthusiast':
            shouldUnlock = gameState.totalVisitTime >= 120;
            break;
          case 'power_user':
            shouldUnlock = gameState.level >= 5;
            break;
          case 'site_master':
            // This is handled in checkSiteCompletion
            break;
        }

        if (shouldUnlock) {
          setGameState(prev => ({
            ...prev,
            achievements: [...prev.achievements, achievement.id],
            points: prev.points + achievement.points
          }));
          
          setShowAchievement({ ...achievement, unlocked: true });
          setTimeout(() => setShowAchievement(null), 3000);
        }
      }
    });
  }, [gameState]);

  const copyDiscountCode = () => {
    navigator.clipboard.writeText('LUCKY');
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  const claimDiscount = () => {
    setGameState(prev => ({ ...prev, hasClaimedDiscount: true }));
    setShowCompletionReward(false);
    // Redirect to pricing page
    window.location.href = '/pricing';
  };

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      setGameState(prev => {
        const newProgress = Math.min(100, Math.max(0, scrollPercent));
        const progressDiff = newProgress - prev.scrollProgress;
        
        if (progressDiff > 5) {
          addPoints(5, 'Exploring');
        }

        return {
          ...prev,
          scrollProgress: newProgress
        };
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [addPoints]);

  // Track clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('button, a, [role="button"], [data-caption]');
      
      if (isInteractive) {
        setGameState(prev => ({
          ...prev,
          clickCount: prev.clickCount + 1
        }));
        addPoints(2, 'Click');
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [addPoints]);

  // Track visit time
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        totalVisitTime: prev.totalVisitTime + 1
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Check achievements and site completion
  useEffect(() => {
    checkAchievements();
    checkSiteCompletion();
  }, [gameState, checkAchievements, checkSiteCompletion]);

  // Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem('kenjiai-gamification');
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        setGameState(prev => ({ ...prev, ...parsedState }));
      } catch (error) {
        console.error('Failed to load gamification state:', error);
      }
    }
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem('kenjiai-gamification', JSON.stringify(gameState));
  }, [gameState]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600';
      case 'rare': return 'from-blue-500 to-blue-600';
      case 'epic': return 'from-purple-500 to-purple-600';
      case 'legendary': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const progressToNextLevel = ((gameState.points % 100) / 100) * 100;

  return (
    <>
      {/* Enhanced Mobile-Friendly Gamification UI with Scroll Following */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: isVisible ? 1 : 0.7, 
          y: isVisible ? 0 : -10,
          scale: isVisible ? 1 : 0.9
        }}
        transition={{ duration: 0.3 }}
        className={`fixed ${isMobile ? 'top-20 right-2' : 'top-16 right-4'} z-40 transition-all duration-300`}
        style={{
          transform: `translateY(${isVisible ? '0' : '-20px'})`,
          pointerEvents: isVisible ? 'auto' : 'none'
        }}
      >
        {/* Enhanced Compact Display */}
        <motion.div
          className="bg-gray-900/95 backdrop-blur-sm border border-blue-400/30 rounded-lg px-3 py-2 shadow-lg cursor-pointer mobile-hover investor-card-shadow"
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: isVisible 
              ? "0 0 20px rgba(59, 130, 246, 0.3)" 
              : "0 0 10px rgba(59, 130, 246, 0.1)"
          }}
        >
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-yellow-400" />
            <div className="text-white text-sm font-medium">{gameState.level}</div>
            <div className="text-blue-400 text-sm font-bold">{gameState.points}</div>
            {gameState.hasCompletedSite && !gameState.hasClaimedDiscount && (
              <Gift className="w-4 h-4 text-green-400 animate-pulse" />
            )}
            {isExpanded ? <ChevronUp className="w-3 h-3 text-gray-400" /> : <ChevronDown className="w-3 h-3 text-gray-400" />}
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="w-16 bg-gray-700 rounded-full h-1 mt-1">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-green-400 h-1 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressToNextLevel}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Enhanced Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.9 }}
              className={`absolute top-full right-0 mt-2 bg-gray-900/95 backdrop-blur-sm border border-blue-400/30 rounded-lg p-3 shadow-xl investor-card-shadow ${
                isMobile ? 'min-w-[160px]' : 'min-w-[180px]'
              }`}
            >
              {/* Enhanced Stats */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-gray-800/50 rounded p-2 text-center mobile-hover">
                  <div className="text-green-400 font-bold text-sm">{Math.round(gameState.scrollProgress)}%</div>
                  <div className="text-gray-400 text-xs">Explored</div>
                </div>
                <div className="bg-gray-800/50 rounded p-2 text-center mobile-hover">
                  <div className="text-purple-400 font-bold text-sm">{gameState.clickCount}</div>
                  <div className="text-gray-400 text-xs">Interactions</div>
                </div>
              </div>

              {/* Enhanced Completion Status */}
              {gameState.hasCompletedSite && !gameState.hasClaimedDiscount && (
                <motion.button
                  onClick={() => setShowCompletionReward(true)}
                  className="w-full investor-gradient-green text-white text-xs font-bold py-2 px-3 rounded mb-3 animate-pulse mobile-button sparkle-effect"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🎉 Claim 10% OFF!
                </motion.button>
              )}

              {/* Enhanced Achievement Count */}
              <div className="text-center">
                <div className="text-yellow-400 text-sm font-medium mobile-hover">
                  {gameState.achievements.length}/8 🏆
                </div>
                <div className="text-gray-400 text-xs">
                  {100 - (gameState.points % 100)} to Lv.{gameState.level + 1}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Enhanced Completion Reward Modal */}
      <AnimatePresence>
        {showCompletionReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCompletionReward(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-blue-900 border border-yellow-400/50 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl investor-card-shadow"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Enhanced Celebration Animation */}
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="mb-6"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 investor-gradient-gold rounded-full mb-4 shadow-2xl sparkle-effect">
                  <Gift className="w-10 h-10 text-white" />
                </div>
              </motion.div>

              <h2 className="text-3xl font-bold text-white mb-4">
                🎉 Congratulations!
              </h2>
              
              <p className="text-gray-300 mb-6">
                You've completed your KenjiAI exploration! As a reward, you've unlocked a special discount.
              </p>

              {/* Enhanced Discount Code Display */}
              <div className="bg-gray-800/50 border border-yellow-400/30 rounded-2xl p-4 mb-6 mobile-hover">
                <div className="text-yellow-400 font-bold text-lg mb-2">10% OFF Coupon</div>
                <div className="flex items-center justify-center gap-2 bg-gray-900 rounded-lg p-3">
                  <code className="text-green-400 font-mono text-xl font-bold">LUCKY</code>
                  <button
                    onClick={copyDiscountCode}
                    className="text-blue-400 hover:text-blue-300 transition-colors mobile-hover touch-target"
                  >
                    {copiedCoupon ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                <div className="text-gray-400 text-sm mt-2">
                  {copiedCoupon ? 'Copied to clipboard!' : 'Click to copy'}
                </div>
              </div>

              <div className="space-y-3">
                <motion.button
                  onClick={claimDiscount}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full investor-gradient-green text-white font-bold py-3 px-6 rounded-xl shadow-lg mobile-button"
                >
                  Claim Discount & Go to Pricing
                </motion.button>
                
                <button
                  onClick={() => setShowCompletionReward(false)}
                  className="w-full text-gray-400 hover:text-white transition-colors py-2 mobile-hover touch-target"
                >
                  Continue Exploring
                </button>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                * Discount automatically applies at checkout
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0, x: 50 }}
            className={`fixed ${isMobile ? 'top-32 right-2' : 'top-20 right-4'} z-50 pointer-events-none`}
          >
            <div className="investor-gradient-gold text-white px-3 py-2 rounded-lg shadow-lg text-center level-up-glow">
              <Crown className="w-5 h-5 mx-auto" />
              <div className="text-sm font-bold">LV {gameState.level}!</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Point Gain Animation */}
      <AnimatePresence>
        {showPointGain && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -30, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.5 }}
            className={`fixed ${isMobile ? 'top-24 right-8' : 'top-16 right-20'} z-50 pointer-events-none`}
          >
            <div className="investor-gradient-green text-white px-2 py-1 rounded shadow-lg">
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span className="font-bold text-sm">+{showPointGain.points}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Achievement Notification */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className={`fixed ${isMobile ? 'top-36 right-2' : 'top-28 right-4'} z-50 pointer-events-none`}
          >
            <div className={`bg-gradient-to-r ${getRarityColor(showAchievement.rarity)} p-3 rounded-lg shadow-lg ${
              isMobile ? 'max-w-[140px]' : 'max-w-[160px]'
            } sparkle-effect`}>
              <div className="text-center text-white">
                <showAchievement.icon className="w-5 h-5 mx-auto mb-1" />
                <div className="text-sm font-bold">{showAchievement.title}</div>
                <div className="bg-white/20 rounded px-2 py-1 mt-1 inline-block">
                  <span className="font-bold text-xs">+{showAchievement.points}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GamificationSystem;