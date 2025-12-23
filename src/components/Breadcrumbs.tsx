import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbsProps {
  customItems?: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ customItems, className = '' }: BreadcrumbsProps) {
  const location = useLocation();

  const routeLabels: Record<string, string> = {
    'ai-automation': 'AI Automation',
    'voice-agents': 'Voice Agents',
    'voice-ai': 'Voice AI',
    'marketing-automation': 'Marketing Automation',
    'crm': 'CRM & Sales',
    'free-tools': 'Free Tools',
    'knowledge': 'Knowledge Base',
    'pricing': 'Pricing',
    'investors': 'Investors',
    'privacy': 'Privacy Policy',
    'terms': 'Terms of Service',
    'disclaimer': 'Disclaimer',
    'success': 'Success',
    'blog': 'Blog',
    'tools': 'Tools'
  };

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) return customItems;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [{ label: 'Home', path: '/' }];

    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const label = routeLabels[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      items.push({ label, path: currentPath });
    });

    return items;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (location.pathname === '/') return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`py-4 px-4 ${className}`}
      style={{ backgroundColor: 'rgba(11, 14, 20, 0.5)' }}
    >
      <ol className="flex items-center space-x-2 max-w-7xl mx-auto text-sm flex-wrap">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isFirst = index === 0;

          return (
            <li key={item.path} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-500 mx-2" aria-hidden="true" />
              )}
              {isLast ? (
                <span className="text-gray-400 flex items-center gap-2" aria-current="page">
                  {isFirst && <Home className="w-4 h-4" aria-hidden="true" />}
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="text-green-400 hover:text-green-300 transition-colors flex items-center gap-2 hover:underline focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-1"
                >
                  {isFirst && <Home className="w-4 h-4" aria-hidden="true" />}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `https://kenjiai.com${item.path}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
