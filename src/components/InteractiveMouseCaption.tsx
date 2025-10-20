import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MouseCaptionProps {
  children: React.ReactNode;
}

const InteractiveMouseCaption: React.FC<MouseCaptionProps> = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [caption, setCaption] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile devices
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMobile) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const captionText = target.getAttribute('data-caption') || target.closest('[data-caption]')?.getAttribute('data-caption');
      if (captionText && !isMobile) {
        setCaption(captionText);
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const relatedTarget = e.relatedTarget as HTMLElement;
      
      // Check if we're still within an element with data-caption
      if (!relatedTarget || (!relatedTarget.getAttribute('data-caption') && !relatedTarget.closest('[data-caption]'))) {
        setIsHovering(false);
        setCaption('');
      }
    };

    // Touch events for mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (isMobile) {
        const target = e.target as HTMLElement;
        const captionText = target.getAttribute('data-caption') || target.closest('[data-caption]')?.getAttribute('data-caption');
        if (captionText) {
          setCaption(captionText);
          setIsHovering(true);
          
          // Auto-hide after 3 seconds on mobile
          setTimeout(() => {
            setIsHovering(false);
            setCaption('');
          }, 3000);
        }
      }
    };

    const handleTouchEnd = () => {
      if (isMobile) {
        // Delay hiding to allow for quick taps
        setTimeout(() => {
          setIsHovering(false);
          setCaption('');
        }, 1000);
      }
    };

    if (!isMobile) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseover', handleMouseOver);
      document.addEventListener('mouseout', handleMouseOut);
    } else {
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  return (
    <>
      {children}
      <AnimatePresence>
        {isHovering && caption && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`fixed z-[9999] pointer-events-none bg-gray-900/95 backdrop-blur-sm border border-blue-400/50 rounded-xl px-4 py-3 text-white text-sm font-medium shadow-2xl max-w-xs ${
              isMobile ? 'bottom-4 left-4 right-4 mx-auto' : ''
            }`}
            style={!isMobile ? {
              left: Math.min(mousePosition.x + 15, window.innerWidth - 300),
              top: Math.max(mousePosition.y - 60, 10),
            } : {}}
          >
            <div className="relative">
              {caption}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-400/20 rounded-xl blur-xl -z-10"></div>
            </div>
            {/* Arrow pointing to cursor (desktop only) */}
            {!isMobile && (
              <div 
                className="absolute w-2 h-2 bg-gray-900 border-r border-b border-blue-400/50 transform rotate-45"
                style={{
                  left: '12px',
                  bottom: '-4px'
                }}
              ></div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InteractiveMouseCaption;