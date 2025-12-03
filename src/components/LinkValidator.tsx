import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { isValidRoute, getFallbackRoute, validRoutes } from '../utils/linkValidator';

/**
 * Component that validates all links on a page and fixes any broken ones
 */
const LinkValidator: React.FC = () => {
  const location = useLocation();
  
  // Check if current route is valid
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Skip validation for root path
    if (currentPath === '/') return;
    
    // Check if current path is valid
    const isCurrentRouteValid = isValidRoute(currentPath);
    
    if (!isCurrentRouteValid) {
      console.warn(`Current route is invalid: ${currentPath}`);
      const fallbackRoute = getFallbackRoute(currentPath);
      console.log(`Redirecting to: ${fallbackRoute}`);
      
      // Use history API to avoid full page reload
      window.history.replaceState(null, '', fallbackRoute);
    }
  }, [location.pathname]);
  
  useEffect(() => {
    const validateLinks = () => {
      // Get all links on the page
      const links = document.querySelectorAll('a');
      
      links.forEach(link => {
        const href = link.getAttribute('href');
        
        // Skip if no href
        if (!href) return;
        
        // Handle hash links properly
        if (href === '#' || href.startsWith('#')) return;
        
        // Skip external links
        if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
        
        // Check if it's a valid route
        if (!isValidRoute(href)) {
          console.warn(`Found invalid link: ${href}`);
          
          // Fix the link
          const fallbackRoute = getFallbackRoute(href);
          link.setAttribute('href', fallbackRoute);
          
          // Add a visual indicator in development
          if (process.env.NODE_ENV === 'development') {
            link.style.border = '1px dashed red';
            link.title = `Invalid link: ${href}, redirected to ${fallbackRoute}`;
          }
        }
      });
    };
    
    // Run validation whenever the location changes
    validateLinks();
    
    // Create a MutationObserver to watch for DOM changes
    const observer = new MutationObserver(validateLinks);
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['href']
    });
    
    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [location]);

  return null; // This component doesn't render anything
};

export default LinkValidator;