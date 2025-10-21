import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, ChevronDown, ExternalLink, LogIn, ChevronRight } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [showSolutionsDropdown, setShowSolutionsDropdown] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tools = [
    { name: "Prompt Generator", href: "http://prompt.kenjiai.com", external: true, badge: "Free" },
    { name: "PR Pro", href: "https://prpro.kenjiai.com/", external: true, badge: "Free" },
    { name: "Sales Coach", href: "https://salescoach.kenjiai.com/", external: true, badge: "Free" },
    { name: "ViralPost Pro", href: "https://viralpost.kenjiai.com", external: true, badge: "Free" },
    { name: "Support", href: "https://support.kenjiai.com/", external: true },
    { name: "All Free Tools", href: "/free-tools", external: false, badge: "Popular" },
    { name: "All Tools", href: "/tools", external: false }
  ];

  const solutions = [
    { name: "AI Automation", href: "/ai-automation", description: "Complete business automation" },
    { name: "Voice Agents", href: "/voice-agents", description: "AI that handles calls 24/7" },
    { name: "Voice AI", href: "/voice-ai", description: "AI voice agents starting at $10/month" },
    { name: "Marketing Automation", href: "/marketing-automation", description: "Smart campaigns that convert" },
    { name: "CRM & Sales", href: "/crm", description: "Manage customers and close deals" }
  ];

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Solutions", href: "/ai-automation", hasDropdown: true, dropdownType: "solutions" },
    { name: "Free Tools", href: "/free-tools", hasDropdown: true, dropdownType: "tools" },
    { name: "Freedom Club", href: "https://learn.kenjiai.com/communities/groups/media-traffics'-freedom-closer/home?invite=68eeb20bcfc02a4072d11ac8", external: true }
  ];

  return (
    <motion.nav role="navigation" aria-label="Main Navigation"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-lg border-b border-gray-800' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group mobile-hover focus-ring">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
              KenjiAI
            </span>
            <ChevronRight className="w-4 h-4 text-blue-400 group-hover:text-purple-400 transition-colors" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8" role="menubar">
            {navItems.map((item) => (
              <div key={item.name} className="relative" role="none">
                {item.hasDropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={(e) => {
                      if (item.dropdownType === 'tools') setShowToolsDropdown(true);
                      if (item.dropdownType === 'solutions') setShowSolutionsDropdown(true);
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                      // Check if the mouse is moving to the dropdown
                      const relatedTarget = e.relatedTarget as HTMLElement;
                      const isMovingToDropdown = relatedTarget instanceof Element ? relatedTarget.closest('[role="menu"]') !== null : false;
                      
                      if (!isMovingToDropdown) {
                        // Only hide if not moving to the dropdown
                        if (item.dropdownType === 'tools') setShowToolsDropdown(false);
                        if (item.dropdownType === 'solutions') setShowSolutionsDropdown(false);
                      }
                    }}
                  >
                    <button 
                      className="flex items-center gap-1 text-gray-300 hover:text-blue-400 transition-colors font-medium mobile-hover focus-ring touch-target"
                      aria-expanded={
                        (item.dropdownType === 'tools' && showToolsDropdown) || 
                        (item.dropdownType === 'solutions' && showSolutionsDropdown)
                      }
                      aria-haspopup="true"
                      role="menuitem"
                    >
                      {item.name}
                      <ChevronDown className="w-4 h-4" aria-hidden="true" />
                    </button>
                    
                    {/* Tools Dropdown */}
                    {showToolsDropdown && item.dropdownType === 'tools' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden investor-card-shadow z-50"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="tools-menu-button"
                      >
                        {tools.map((tool) => (
                          tool.external ? (
                            <a
                              key={`${tool.name}-${tool.href}`}
                              href={tool.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors mobile-hover touch-target relative"
                              role="menuitem"
                            >
                              <div className="flex items-center justify-between">
                                <span>{tool.name}</span>
                                {tool.badge && (
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    tool.badge === 'Free' ? 'bg-green-500/20 text-green-400' :
                                    tool.badge === 'Popular' ? 'bg-blue-500/20 text-blue-400' :
                                    'bg-gray-500/20 text-gray-400'
                                  }`}>
                                    {tool.badge}
                                  </span>
                                )}
                              </div>
                            </a>
                          ) : (
                            <Link
                              key={`${tool.name}-${tool.href}`}
                              to={tool.href}
                              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors mobile-hover touch-target relative"
                              role="menuitem"
                              onClick={() => setShowToolsDropdown(false)}
                            >
                              <div className="flex items-center justify-between">
                                <span>{tool.name}</span>
                                {tool.badge && (
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    tool.badge === 'Free' ? 'bg-green-500/20 text-green-400' :
                                    tool.badge === 'Popular' ? 'bg-blue-500/20 text-blue-400' :
                                    'bg-gray-500/20 text-gray-400'
                                  }`}>
                                    {tool.badge}
                                  </span>
                                )}
                              </div>
                            </Link>
                          )
                        ))}
                      </motion.div>
                    )}

                    {/* Solutions Dropdown */}
                    {showSolutionsDropdown && item.dropdownType === 'solutions' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden investor-card-shadow z-50" 
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="solutions-menu-button"
                        onMouseEnter={() => setShowSolutionsDropdown(true)}
                        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                          // Check if moving back to the button
                          const relatedTarget = e.relatedTarget as HTMLElement;
                          const isMovingToButton = relatedTarget instanceof Element ? 
                            relatedTarget.closest('[aria-haspopup="true"]') !== null : false;
                          
                          if (!isMovingToButton) {
                            setShowSolutionsDropdown(false);
                          }
                        }}
                      >
                        {solutions.map((solution) => (
                          <Link
                            key={`${solution.name}-${solution.href}`}
                            to={solution.href}
                            className="block px-4 py-4 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors mobile-hover touch-target border-b border-gray-700 last:border-b-0"
                            role="menuitem"
                            onClick={() => setShowSolutionsDropdown(false)}
                          >
                            <div className="font-semibold text-white mb-1">{solution.name}</div>
                            <div className="text-sm text-gray-400">{solution.description}</div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ) : item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-gray-300 hover:text-blue-400 transition-colors font-medium mobile-hover focus-ring touch-target"
                    role="menuitem"
                  >
                    {item.name}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <Link
                    to={item.href}
                    className={`text-gray-300 hover:text-blue-400 transition-colors font-medium mobile-hover focus-ring touch-target ${
                      location.pathname === item.href ? 'text-blue-400' : ''
                    }`}
                    role="menuitem"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4" role="none">
            {/* Login Button */}
            <motion.a
              href="https://app.kenjicrm.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors font-medium mobile-hover focus-ring touch-target"
            >
              <LogIn className="w-4 h-4" aria-hidden="true" />
              Login
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </motion.a>

            {/* Pricing Button - Unique Design */}
            <Link
              to="/pricing"
              className={`relative px-6 py-2.5 rounded-xl font-bold transition-all duration-300 mobile-button focus-ring ${
                location.pathname === '/pricing'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50 animate-gradient'
              }`}
              style={{
                backgroundSize: '200% 200%',
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Pricing
              </span>
            </Link>

            {/* CTA Button */}
            <motion.a
              href="/pricing#plans"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="investor-gradient-blue text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 mobile-button focus-ring flex flex-col items-center"
            >
              <span className="font-bold text-sm">Start Using AI</span>
              <span className="text-xs opacity-90 font-normal">To finally profit and grow</span>
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-blue-400 transition-colors mobile-hover focus-ring touch-target"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            id="mobile-menu"
            role="menu"
            aria-label="Mobile Navigation Menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-800 border-t border-gray-700 mt-2 rounded-b-xl investor-card-shadow"
          >
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                item.external ? (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors font-medium mobile-hover touch-target py-2"
                    role="menuitem"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block text-gray-300 hover:text-blue-400 transition-colors font-medium mobile-hover touch-target py-2"
                    role="menuitem"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              <Link
                to="/free-tools"
                onClick={() => setIsOpen(false)}
                className="block text-green-400 hover:text-green-300 transition-colors font-medium mobile-hover touch-target py-2"
                role="menuitem"
              >
                Free Tools ✨
              </Link>
              <a
                href="https://support.kenjiai.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-300 hover:text-blue-400 transition-colors font-medium mobile-hover touch-target py-2"
                role="menuitem"
              >
                Support
              </a>
              
              {/* Mobile Pricing Button */}
              <Link
                to="/pricing"
                onClick={() => setIsOpen(false)}
                className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-4 py-3 rounded-xl font-bold text-center mobile-button animate-gradient"
                style={{ backgroundSize: '200% 200%' }}
                role="menuitem"
              >
                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" />
                  View Pricing
                </div>
              </Link>

              {/* Mobile Login Button */}
              <a
                href="https://app.kenjicrm.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors font-medium mobile-hover touch-target py-2"
                role="menuitem"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                Login to Dashboard
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>

              {/* Mobile CTA Button */}
              <a
                href="/pricing#plans"
                className="block investor-gradient-blue text-white px-4 py-3 rounded-xl font-semibold text-center mobile-button"
                role="menuitem"
              >
                <div className="font-bold">Start Using AI</div>
                <div className="text-xs opacity-90 font-normal">To finally profit and grow</div>
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;