import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isValidInternalRoute } from '../utils/routeConfig';

const RedirectSystem: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const redirectMap: Record<string, string> = {
    '/tools': '/free-tools',
    '/ai': '/ai-automation',
    '/voice': '/voice-agents',
    '/marketing': '/marketing-automation',
    '/customer': '/crm',
    '/about': '/',
    '/contact': '/',
    '/help': 'https://support.kenjiai.com/',
    '/support': 'https://support.kenjiai.com/',
    '/login': 'https://app.kenjicrm.com',
    '/signup': '/pricing',
    '/register': '/pricing',
    '/trial': '/pricing',
    '/start': '/pricing',
    '/demo': '/pricing',
    '/ai-education': 'https://startlearning.kenjiai.com/',
    '/education': 'https://startlearning.kenjiai.com/',
    '/learn': 'https://startlearning.kenjiai.com/',
    '/community': 'https://startlearning.kenjiai.com/',
    '/partner': 'https://closers.kenjiai.com/',
    '/partners': 'https://closers.kenjiai.com/',
    '/become-partner': 'https://closers.kenjiai.com/',
  };

  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath === '/') return;

    if (redirectMap[currentPath]) {
      if (redirectMap[currentPath].startsWith('http')) {
        window.location.href = redirectMap[currentPath];
        return;
      }

      navigate(redirectMap[currentPath], { replace: true });
      return;
    }

    if (!isValidInternalRoute(currentPath)) {
      console.warn(`Invalid route: ${currentPath}`);
      navigate('/not-found', { replace: true });
    }
  }, [location.pathname, navigate]);

  return null;
};

export default RedirectSystem;
