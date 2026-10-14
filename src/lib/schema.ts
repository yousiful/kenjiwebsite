/**
 * Shared Schema.org JSON-LD builders.
 *
 * The site-wide Organization and WebSite nodes live in the index.html shell
 * (served for every SPA route) under the @ids below. Per-page nodes reference
 * them by @id instead of repeating the organization on every page.
 *
 * Rule for anything added here: only facts that are visible on the page or
 * otherwise verifiable. No AggregateRating, review counts or invented stats.
 */

export const SITE_URL = 'https://kenjiai.com';
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const orgRef = { '@id': ORG_ID };

export interface Crumb {
  name: string;
  path: string;
}

const SEGMENT_LABELS: Record<string, string> = {
  'ai-automation': 'AI Automation',
  'ai-education': 'AI Education',
  'voice-agents': 'Voice Agents',
  'voice-ai': 'Voice AI',
  'marketing-automation': 'Marketing Automation',
  crm: 'CRM',
  'free-tools': 'Free Tools',
  tools: 'Free Tools',
  knowledge: 'Academy',
  pricing: 'Pricing',
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
  disclaimer: 'Disclaimer',
  blog: 'Blog',
  invites: 'Kenji Invites',
};

/** Parent paths that have no page of their own get pointed at the real hub.
 *  Segments with no label and no page (e.g. /paid-ads-for) are skipped. */
const SEGMENT_PATHS: Record<string, string> = {
  '/tools': '/free-tools',
};

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  if (path === '/' || path === '') return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`.replace(/\/+$/, '');
}

/** Home > parent segments > this page, using the page's own name for the last crumb. */
export function defaultCrumbs(path: string, pageName: string): Crumb[] {
  const segments = path.split('/').filter(Boolean);
  const crumbs: Crumb[] = [{ name: 'Home', path: '/' }];
  let current = '';
  segments.forEach((segment, i) => {
    current += `/${segment}`;
    const isLast = i === segments.length - 1;
    if (isLast) {
      crumbs.push({ name: pageName, path: current });
    } else if (SEGMENT_LABELS[segment]) {
      crumbs.push({ name: SEGMENT_LABELS[segment], path: SEGMENT_PATHS[current] || current });
    }
  });
  return crumbs;
}

export function breadcrumbList(crumbs: Crumb[], pageUrl: string) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export interface PageGraphInput {
  path: string;
  name: string;
  description?: string;
  /** WebPage subtype, e.g. CollectionPage, AboutPage, ContactPage. */
  type?: string;
  /** Override the auto-generated breadcrumb trail. Pass [] to omit it (homepage). */
  crumbs?: Crumb[];
  /** Extra nodes for the same page (Service, FAQPage, BlogPosting, ...). No @context needed. */
  extra?: object[];
}

/** One @graph per page: WebPage (+ BreadcrumbList) + any page-specific nodes. */
export function pageGraph({ path, name, description, type = 'WebPage', crumbs, extra = [] }: PageGraphInput) {
  const url = absoluteUrl(path);
  const trail = crumbs ?? (path === '/' ? [] : defaultCrumbs(path, name));
  const page: Record<string, unknown> = {
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name,
    isPartOf: { '@id': WEBSITE_ID },
    publisher: orgRef,
    inLanguage: 'en-US',
  };
  if (description) page.description = description;
  if (trail.length > 1) page.breadcrumb = { '@id': `${url}#breadcrumb` };

  return {
    '@context': 'https://schema.org',
    '@graph': [page, ...(trail.length > 1 ? [breadcrumbList(trail, url)] : []), ...extra],
  };
}

export function faqPage(path: string, items: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    '@id': `${absoluteUrl(path)}#faq`,
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

/** A free browser tool. Price 0 is the real price: every tool is free with no signup. */
export function freeWebApp(input: {
  path: string;
  name: string;
  description: string;
  category?: string;
}) {
  const url = absoluteUrl(input.path);
  return {
    '@type': 'WebApplication',
    '@id': `${url}#app`,
    name: input.name,
    url,
    description: input.description,
    applicationCategory: input.category || 'BusinessApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: orgRef,
  };
}

/** A service KenjiAI / Media Traffics provides. Offers only when the page shows a real price. */
export function service(input: {
  path: string;
  name: string;
  description: string;
  serviceType?: string | string[];
  offers?: object[];
}) {
  const url = absoluteUrl(input.path);
  const node: Record<string, unknown> = {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: input.name,
    url,
    description: input.description,
    provider: orgRef,
    areaServed: { '@type': 'Country', name: 'United States' },
  };
  if (input.serviceType) node.serviceType = input.serviceType;
  if (input.offers?.length) node.offers = input.offers;
  return node;
}
