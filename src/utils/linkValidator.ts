/**
 * Utility functions for validating and fixing links
 */

// List of valid routes in the application
export const validRoutes = [
  '/',
  '/tools',
  '/free-tools',
  '/ai-automation',
  '/voice-agents',
  '/voice-ai',
  '/marketing-automation',
  '/crm',
  '/knowledge',
  '/blog',
  '/investors',
  '/pricing',
  '/success'
];

// List of external domains that are valid
export const validExternalDomains = [
  'app.kenjicrm.com',
  'support.kenjiai.com',
  'prompt.kenjiai.com',
  'prpro.kenjiai.com',
  'salescoach.kenjiai.com',
  'investors.kenjiai.com',
  'calendly.com',
  'images.pexels.com',
  'assets.cdn.filesafe.space',
  'beta.leadconnectorhq.com',
  'js.stripe.com',
  'twitter.com',
  'linkedin.com',
  'github.com',
  'buy.stripe.com'
];

/**
 * Check if a route is valid
 * @param route - The route to check
 * @returns boolean indicating if the route is valid
 */
export const isValidRoute = (route: string): boolean => {
  // External links are always valid
  if (route.startsWith('http') || route.startsWith('mailto:') || route.startsWith('tel:')) {
    // For http/https links, check if they're to known domains
    if (route.startsWith('http')) {
      try {
        const url = new URL(route);
        const domain = url.hostname;
        // If it's not a known domain, log it but still return true
        if (!validExternalDomains.some(validDomain => domain.includes(validDomain))) {
          console.warn(`External link to unknown domain: ${domain} in ${route}`);
        }
      } catch (e) {
        console.warn(`Invalid URL format: ${route}`);
      }
    }
    return true;
  }
  
  // Hash links are valid
  if (route === '#' || route.startsWith('#')) {
    return true;
  }
  
  // Check if the route is in our list of valid routes
  return validRoutes.some(validRoute => {
    // Exact match
    if (route === validRoute) return true;
    
    // Check if it's a blog post
    if (validRoute === '/blog' && route.startsWith('/blog/')) return true;

    // Check if it's a nested route of a valid route
    if (route.startsWith(`${validRoute}/`)) return true;
    
    return false;
  });
};

/**
 * Get a fallback route if the provided route is invalid
 * @param route - The potentially invalid route
 * @returns A valid fallback route
 */
export const getFallbackRoute = (route: string): string => {
  // If it's a blog post with an invalid slug, redirect to knowledge base
  if (route.startsWith('/blog/')) {
    return '/knowledge';
  }
  
  // Special case: if route is /tools, redirect to /free-tools
  if (route === '/tools') {
    return '/free-tools';
  }
  
  // If it's a nested route, try the parent route
  const parentRoute = route.split('/').slice(0, 2).join('/');
  if (parentRoute !== '' && isValidRoute(parentRoute)) {
    return parentRoute;
  }
  
  // For other invalid routes, redirect to home
  return '/';
};

/**
 * Hook to validate all links on a page and fix any broken ones
 */
export const useLinkValidator = () => {
  return {
    validateLinks: () => {
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
        }
      });
    }
  };
};

export default {
  isValidRoute,
  getFallbackRoute,
  useLinkValidator,
  validRoutes,
  validExternalDomains
};