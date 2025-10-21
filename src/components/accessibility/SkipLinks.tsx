import React from 'react';
import { Menu, Search, FileText } from 'lucide-react';

interface SkipLink {
  id: string;
  label: string;
  target: string;
  icon?: React.ReactNode;
}

const defaultSkipLinks: SkipLink[] = [
  {
    id: 'skip-to-content',
    label: 'Skip to main content',
    target: '#main-content',
    icon: <FileText className="w-4 h-4" aria-hidden="true" />
  },
  {
    id: 'skip-to-nav',
    label: 'Skip to navigation',
    target: '#main-navigation',
    icon: <Menu className="w-4 h-4" aria-hidden="true" />
  },
  {
    id: 'skip-to-search',
    label: 'Skip to search',
    target: '#search',
    icon: <Search className="w-4 h-4" aria-hidden="true" />
  }
];

interface SkipLinksProps {
  links?: SkipLink[];
}

const SkipLinks: React.FC<SkipLinksProps> = ({ links = defaultSkipLinks }) => {
  const handleSkipClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.setAttribute('tabindex', '-1');
      (target as HTMLElement).focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      target.addEventListener(
        'blur',
        () => {
          target.removeAttribute('tabindex');
        },
        { once: true }
      );
    }
  };

  return (
    <nav
      className="skip-links"
      aria-label="Skip navigation links"
      role="navigation"
    >
      <style jsx>{`
        .skip-links {
          position: fixed;
          top: -100%;
          left: 0;
          right: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          border-bottom: 3px solid #60a5fa;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
          transition: top 0.2s ease-in-out;
        }

        .skip-links:focus-within {
          top: 0;
        }

        .skip-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: white;
          color: #1e40af;
          font-weight: 600;
          text-decoration: none;
          border-radius: 0.5rem;
          border: 2px solid #3b82f6;
          transition: all 0.2s ease;
          max-width: fit-content;
        }

        .skip-link:hover,
        .skip-link:focus {
          background: #dbeafe;
          border-color: #1e40af;
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
          transform: translateY(-2px);
        }

        .skip-link:active {
          transform: translateY(0);
        }
      `}</style>

      {links.map((link) => (
        <a
          key={link.id}
          href={link.target}
          className="skip-link"
          onClick={(e) => handleSkipClick(e, link.target)}
        >
          {link.icon}
          <span>{link.label}</span>
        </a>
      ))}
    </nav>
  );
};

export default SkipLinks;
