import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const EnhancedInteractiveElements: React.FC = () => {
  useEffect(() => {
    // Add enhanced gamified effects to all interactive elements
    const addGamifiedEffects = () => {
      const interactiveElements = document.querySelectorAll('button, a, [role="button"], [data-caption]');
      
      interactiveElements.forEach(element => {
        if (!element.hasAttribute('data-gamified')) {
          element.setAttribute('data-gamified', 'true');
          
          // Add enhanced classes
          element.classList.add('click-ripple', 'interactive-element');
          
          // Enhanced hover effect
          element.addEventListener('mouseenter', () => {
            element.classList.add('gamified-hover', 'breathe');
            
            // Add vibrant glow effect
            const glowElement = element as HTMLElement;
            glowElement.style.filter = 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 40px rgba(34, 197, 94, 0.4))';
          });
          
          element.addEventListener('mouseleave', () => {
            element.classList.remove('gamified-hover', 'breathe');
            
            // Remove glow effect
            const glowElement = element as HTMLElement;
            glowElement.style.filter = '';
          });
          
          // Enhanced click effect with color burst
          element.addEventListener('click', () => {
            element.classList.add('gamified-click');
            
            // Create color burst effect
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Create multiple colored particles
            for (let i = 0; i < 8; i++) {
              const particle = document.createElement('div');
              particle.className = 'fixed w-2 h-2 rounded-full pointer-events-none z-50';
              particle.style.background = `linear-gradient(45deg, hsl(${Math.random() * 360}, 70%, 60%), hsl(${Math.random() * 360}, 70%, 60%))`;
              particle.style.left = centerX + 'px';
              particle.style.top = centerY + 'px';
              
              document.body.appendChild(particle);
              
              // Animate particle
              const angle = (i / 8) * Math.PI * 2;
              const distance = 50 + Math.random() * 30;
              const endX = centerX + Math.cos(angle) * distance;
              const endY = centerY + Math.sin(angle) * distance;
              
              particle.animate([
                {
                  transform: 'translate(-50%, -50%) scale(0)',
                  opacity: 1
                },
                {
                  transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(1)`,
                  opacity: 1,
                  offset: 0.7
                },
                {
                  transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(0)`,
                  opacity: 0
                }
              ], {
                duration: 600,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }).onfinish = () => {
                particle.remove();
              };
            }
            
            setTimeout(() => {
              element.classList.remove('gamified-click');
            }, 300);
          });
          
          // Enhanced touch events for mobile
          element.addEventListener('touchstart', (e) => {
            element.classList.add('mobile-interactive');
            
            // Create touch ripple effect
            const touch = (e as TouchEvent).touches[0];
            const rect = element.getBoundingClientRect();
            const ripple = document.createElement('div');
            
            ripple.className = 'absolute rounded-full pointer-events-none';
            ripple.style.background = 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(34, 197, 94, 0.4) 50%, transparent 70%)';
            ripple.style.left = (touch.clientX - rect.left) + 'px';
            ripple.style.top = (touch.clientY - rect.top) + 'px';
            ripple.style.width = '0px';
            ripple.style.height = '0px';
            ripple.style.transform = 'translate(-50%, -50%)';
            
            element.appendChild(ripple);
            
            // Animate ripple
            ripple.animate([
              {
                width: '0px',
                height: '0px',
                opacity: 1
              },
              {
                width: '200px',
                height: '200px',
                opacity: 0
              }
            ], {
              duration: 600,
              easing: 'ease-out'
            }).onfinish = () => {
              ripple.remove();
            };
          });
          
          element.addEventListener('touchend', () => {
            element.classList.remove('mobile-interactive');
          });
        }
      });
    };

    // Initial setup
    addGamifiedEffects();
    
    // Disabled observer to prevent performance issues
    // const observer = new MutationObserver(addGamifiedEffects);
    // observer.observe(document.body, { childList: true, subtree: true });

    // Disabled global color shifting - causes performance issues
    // const addGlobalColorShift = () => {
    //   const body = document.body;
    //   body.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)';
    //   body.style.backgroundAttachment = 'fixed';
    //
    //   let hue = 0;
    //   const colorShiftInterval = setInterval(() => {
    //     hue = (hue + 0.5) % 360;
    //     body.style.filter = `hue-rotate(${hue * 0.1}deg) saturate(1.1)`;
    //   }, 100);
    //
    //   return () => clearInterval(colorShiftInterval);
    // };

    // const cleanupColorShift = addGlobalColorShift();

    return () => {
      // observer.disconnect();
      // cleanupColorShift();
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default EnhancedInteractiveElements;