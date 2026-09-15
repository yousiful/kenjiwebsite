import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { validateLink, isValidInternalRoute } from '../utils/routeConfig';

const LinkValidator: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Completely disable in production to avoid DOM thrashing and frame drops
    if (process.env.NODE_ENV !== 'development' && !import.meta.env.DEV) {
      return;
    }
    const validateLinks = () => {
      const links = document.querySelectorAll('a[href]');

      links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        const validation = validateLink(href);

        if (!validation.valid) {
          console.warn(`Invalid link detected: ${href}`, validation.reason);

          if (process.env.NODE_ENV === 'development') {
            link.style.outline = '2px dashed red';
            link.title = `Invalid link: ${validation.reason}`;
          }
        }
      });
    };

    validateLinks();

    const observer = new MutationObserver(validateLinks);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['href']
    });

    return () => {
      observer.disconnect();
    };
  }, [location]);

  return null;
};

export default LinkValidator;