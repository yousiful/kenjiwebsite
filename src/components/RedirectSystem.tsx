import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Component that handles redirects and route error handling
 */
const RedirectSystem: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Define valid routes and their redirects
  const redirectMap: Record<string, string> = {
    '/tools': '/free-tools',
    '/blog': '/knowledge',
    '/ai': '/ai-automation',
    '/voice': '/voice-agents',
    '/marketing': '/marketing-automation',
    '/customer': '/crm',
    '/about': '/',
    '/contact': '/',
    '/help': '/knowledge',
    '/support': '/knowledge',
    '/login': 'https://app.kenjicrm.com',
    '/signup': '/pricing',
    '/register': '/pricing',
    '/trial': '/pricing',
    '/demo': '/pricing',
  };
  
  // List of valid routes
  const validRoutes = [
    '/',
    '/free-tools',
    '/ai-automation',
    '/voice-agents',
    '/voice-ai',
    '/marketing-automation',
    '/crm',
    '/knowledge',
    '/investors',
    '/pricing',
    '/success'
  ];
  
  // Check if a route is valid
  const isValidRoute = (path: string): boolean => {
    // Exact match
    if (validRoutes.includes(path)) return true;
    
    // Check for blog posts
    if (path.startsWith('/blog/')) return true;
    
    // Check for other valid nested routes
    for (const route of validRoutes) {
      if (path.startsWith(`${route}/`)) return true;
    }
    
    return false;
  };
  
  // Handle redirects and 404s
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Skip for root path
    if (currentPath === '/') return;
    
    // Check if we need to redirect
    if (redirectMap[currentPath]) {
      console.log(`Redirecting from ${currentPath} to ${redirectMap[currentPath]}`);
      
      // Handle external redirects
      if (redirectMap[currentPath].startsWith('http')) {
        window.location.href = redirectMap[currentPath];
        return;
      }
      
      // Internal redirect
      navigate(redirectMap[currentPath], { replace: true });
      return;
    }
    
    // Check if current path is valid
    if (!isValidRoute(currentPath)) {
      console.warn(`Invalid route: ${currentPath}, redirecting to 404`);
      navigate('/not-found', { replace: true });
    }
  }, [location.pathname, navigate]);
  
  return null; // This component doesn't render anything
};

export default RedirectSystem;