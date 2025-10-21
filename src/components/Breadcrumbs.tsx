import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbsProps {
  customItems?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ customItems, className = '' }) => {
  const location = useLocation();

  const pathSegments = location.pathname.split('/').filter(segment => segment);

  const pathMap: Record<string, string> = {
    'ai-automation': 'AI Automation',
    'voice-agents': 'Voice Agents',
    'voice-ai': 'Voice AI',
    'marketing-automation': 'Marketing Automation',
    'crm': 'CRM & Sales',
    'free-tools': 'Free AI Tools',
    'knowledge': 'Knowledge Base',
    'blog': 'Blog',
    'pricing': 'Pricing',
    'investors': 'Investors',
    'success': 'Success',
    'solutions': 'Solutions',
    'resources': 'Resources',
    'tools': 'Tools'
  };

  const categoryMap: Record<string, string> = {
    'ai-automation': 'Solutions',
    'voice-agents': 'Solutions',
    'voice-ai': 'Solutions',
    'marketing-automation': 'Solutions',
    'crm': 'Solutions',
    'free-tools': 'Resources',
    'knowledge': 'Resources',
    'blog': 'Resources'
  };

  const breadcrumbItems: BreadcrumbItem[] = customItems || [
    { label: 'Home', path: '/' }
  ];

  if (!customItems) {
    pathSegments.forEach((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      const label = pathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

      if (index === 0 && categoryMap[segment]) {
        breadcrumbItems.push({
          label: categoryMap[segment],
          path: '#'
        });
      }

      breadcrumbItems.push({
        label,
        path
      });
    });
  }

  if (breadcrumbItems.length === 1) {
    return null;
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.path !== '#' ? `https://kenjiai.com${item.path}` : undefined
    }))
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <nav
        aria-label="Breadcrumb"
        className={`bg-gray-800/30 backdrop-blur-sm border-b border-gray-700/50 ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center space-x-2 text-sm" itemScope itemType="https://schema.org/BreadcrumbList">
            {breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1;
              const isCategory = item.path === '#';

              return (
                <li
                  key={item.path + index}
                  className="flex items-center"
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/ListItem"
                >
                  {index > 0 && (
                    <ChevronRight className="w-4 h-4 text-gray-500 mx-2" aria-hidden="true" />
                  )}

                  {isLast || isCategory ? (
                    <span
                      className={`${
                        isLast
                          ? 'text-white font-medium'
                          : 'text-gray-400'
                      } flex items-center gap-2`}
                      itemProp="name"
                      aria-current={isLast ? 'page' : undefined}
                    >
                      {index === 0 && <Home className="w-4 h-4" aria-hidden="true" />}
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      to={item.path}
                      className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 hover:underline"
                      itemProp="item"
                    >
                      {index === 0 && <Home className="w-4 h-4" aria-hidden="true" />}
                      <span itemProp="name">{item.label}</span>
                    </Link>
                  )}

                  <meta itemProp="position" content={String(index + 1)} />
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </>
  );
};

export default Breadcrumbs;
