import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, ChevronDown, ExternalLink, LogIn, ChevronRight, Calendar, DollarSign } from 'lucide-react';

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
    { name: "Prompt Generator", href: "http://prompt.kenjiai.com", external: true },
    { name: "PR Pro", href: "https://prpro.kenjiai.com/", external: true },
    { name: "Sales Coach", href: "https://salescoach.kenjiai.com/", external: true },
    { name: "Support", href: "https://support.kenjiai.com/", external: true },
    { name: "All Free Tools", href: "/free-tools", external: false },
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
    { name: "AI Education", href: "https://startlearning.kenjiai.com/", external: true },
    { name: "Pricing", href: "/pricing" },
    { name: "Investors", href: "/investors" }
  ];

  return (
    <motion.nav role="navigation" aria-label="Main Navigation"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-950/95 backdrop-blur-lg'
          : 'bg-transparent'
      }`}
      style={isScrolled ? {
        borderBottom: '1px solid rgba(0,255,255,0.12)',
        boxShadow: '0 1px 30px rgba(0,255,255,0.05)'
      } : {}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group mobile-hover focus-ring">
              <span
                className="text-xl font-bold transition-all duration-300"
                style={{
                  background: 'linear-gradient(90deg, #00FFFF, #39FF14)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 8px rgba(0,255,255,0.5))'
                }}
              >
                KenjiAI
              </span>
              <ChevronRight className="w-4 h-4 transition-colors" style={{ color: '#00FFFF' }} />
            </Link>
          </div>

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
                      className="flex items-center gap-1 text-gray-300 hover:text-cyan-400 transition-colors font-medium mobile-hover focus-ring touch-target"
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
                        className="absolute top-full left-0 mt-2 w-64 rounded-xl overflow-hidden z-50"
                        style={{ background: '#0a0f1a', border: '1px solid rgba(0,255,255,0.2)', boxShadow: '0 10px 40px rgba(0,255,255,0.12)' }}
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
                              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-cyan-950/40 transition-colors mobile-hover touch-target relative"
                              role="menuitem"
                            >
                              <span>{tool.name}</span>
                            </a>
                          ) : (
                            <Link
                              key={`${tool.name}-${tool.href}`}
                              to={tool.href}
                              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-cyan-950/40 transition-colors mobile-hover touch-target relative"
                              role="menuitem"
                              onClick={() => setShowToolsDropdown(false)}
                            >
                              <span>{tool.name}</span>
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
                        className="absolute top-full left-0 mt-2 w-80 rounded-xl overflow-hidden z-50"
                        style={{ background: '#0a0f1a', border: '1px solid rgba(0,255,255,0.2)', boxShadow: '0 10px 40px rgba(0,255,255,0.12)' }} 
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
                            className="block px-4 py-4 text-gray-300 hover:text-white hover:bg-cyan-950/40 transition-colors mobile-hover touch-target border-b last:border-b-0"
                            style={{ borderColor: 'rgba(0,255,255,0.08)' }}
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
                    className="text-gray-300 hover:text-cyan-400 transition-colors font-medium mobile-hover focus-ring touch-target"
                    role="menuitem"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    to={item.href}
                    className={`text-gray-300 hover:text-cyan-400 transition-colors font-medium mobile-hover focus-ring touch-target ${
                      location.pathname === item.href ? 'text-cyan-400' : ''
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
          <div className="hidden md:flex items-center gap-3" role="none">
            {/* Login Button */}
            <motion.a
              href="https://app.kenjiai.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors font-medium mobile-hover focus-ring touch-target"
            >
              <LogIn className="w-4 h-4" aria-hidden="true" />
              Login
            </motion.a>

            {/* VIP Demo Button */}
            <motion.a
              href="https://go.mediatraffics.com/leads"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 mobile-button focus-ring"
              style={{
                background: 'transparent',
                border: '1px solid rgba(0,255,255,0.3)',
                color: '#00FFFF',
                textShadow: '0 0 8px rgba(0,255,255,0.5)',
                boxShadow: '0 0 10px rgba(0,255,255,0.1)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(0,255,255,0.35), inset 0 0 10px rgba(0,255,255,0.05)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,255,255,0.6)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 10px rgba(0,255,255,0.1)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,255,255,0.3)';
              }}
            >
              <Calendar className="w-4 h-4" aria-hidden="true" />
              VIP Demo
            </motion.a>

            {/* See Pricing Button */}
            <Link to="/pricing">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-gray-900 px-4 py-2 rounded-xl font-bold transition-all duration-300 mobile-button focus-ring"
                style={{
                  background: 'linear-gradient(90deg, #39FF14, #00FFFF)',
                  boxShadow: '0 0 18px rgba(57,255,20,0.45), 0 0 6px rgba(0,255,255,0.3)',
                }}
              >
                <DollarSign className="w-4 h-4" aria-hidden="true" />
                See Pricing
              </motion.div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-cyan-400 transition-colors mobile-hover focus-ring touch-target p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X className="w-7 h-7" aria-hidden="true" /> : <Menu className="w-7 h-7" aria-hidden="true" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-menu"
              role="menu"
              aria-label="Mobile Navigation Menu"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: -20,
                scale: 0.95,
                transition: { duration: 0.2, ease: "easeInOut" }
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="md:hidden mt-2 rounded-b-xl overflow-hidden"
              style={{ background: '#0a0f1a', borderTop: '1px solid rgba(0,255,255,0.15)', boxShadow: '0 10px 40px rgba(0,255,255,0.08)' }}
            >
              <motion.div
                className="px-4 py-5 space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {navItems.map((item, index) => (
                  item.external ? (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-gray-300 hover:text-cyan-400 transition-colors font-medium mobile-hover touch-target py-3 min-h-[44px] flex items-center text-base"
                      role="menuitem"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {item.name}
                    </motion.a>
                  ) : (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block text-gray-300 hover:text-cyan-400 transition-colors font-medium mobile-hover touch-target py-3 min-h-[44px] flex items-center text-base"
                        role="menuitem"
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  )
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                >
                  <Link
                    to="/free-tools"
                    onClick={() => setIsOpen(false)}
                    className="block text-green-400 hover:text-green-300 transition-colors font-medium mobile-hover touch-target py-3 min-h-[44px] flex items-center text-base"
                    role="menuitem"
                  >
                    Free Tools ✨
                  </Link>
                </motion.div>
                <motion.a
                  href="https://support.kenjiai.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-300 hover:text-cyan-400 transition-colors font-medium mobile-hover touch-target py-3 min-h-[44px] flex items-center text-base"
                  role="menuitem"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navItems.length + 1) * 0.05 }}
                >
                  Support
                </motion.a>

                {/* Divider */}
                <div className="border-t my-3" style={{ borderColor: 'rgba(0,255,255,0.12)' }}></div>

                {/* Mobile Login Button */}
                <motion.a
                  href="https://app.kenjiai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors font-medium mobile-hover touch-target py-3 min-h-[44px] text-base"
                  role="menuitem"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navItems.length + 2) * 0.05 }}
                >
                  <LogIn className="w-5 h-5" aria-hidden="true" />
                  Login to Dashboard
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </motion.a>

                {/* Mobile VIP Demo Button */}
                <motion.a
                  href="https://go.mediatraffics.com/leads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-4 rounded-xl font-semibold mobile-button mt-4 min-h-[48px] text-base transition-all touch-manipulation"
                  role="menuitem"
                  style={{
                    border: '1px solid rgba(0,255,255,0.35)',
                    color: '#00FFFF',
                    background: 'rgba(0,255,255,0.05)',
                    textShadow: '0 0 8px rgba(0,255,255,0.5)',
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (navItems.length + 3) * 0.05 }}
                >
                  <Calendar className="w-5 h-5" aria-hidden="true" />
                  VIP Demo
                </motion.a>

                {/* Mobile See Pricing Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (navItems.length + 4) * 0.05 }}
                >
                  <Link
                    to="/pricing"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 text-gray-900 px-5 py-4 rounded-xl font-bold mobile-button min-h-[48px] text-base touch-manipulation"
                    role="menuitem"
                    style={{
                      background: 'linear-gradient(90deg, #39FF14, #00FFFF)',
                      boxShadow: '0 0 18px rgba(57,255,20,0.4)',
                    }}
                  >
                    <DollarSign className="w-5 h-5" aria-hidden="true" />
                    See Pricing
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;