export const internalRoutes = [
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
  '/success',
  '/privacy',
  '/disclaimer',
  '/terms',
  '/not-found',
  '/overview',
  '/dashboard',
  '/setup'
] as const;

export const externalRoutes = {
  'ai-education': 'https://startlearning.kenjiai.com/',
  'education': 'https://startlearning.kenjiai.com/',
  'community': 'https://startlearning.kenjiai.com/',
  'learn': 'https://startlearning.kenjiai.com/',
  'partner': 'https://closers.kenjiai.com/',
  'partners': 'https://closers.kenjiai.com/',
  'become-partner': 'https://closers.kenjiai.com/',
  'login': 'https://app.kenjicrm.com',
  'dashboard': 'https://app.kenjicrm.com',
  'support': 'https://support.kenjiai.com/',
  'help': 'https://support.kenjiai.com/',
  'prompt-generator': 'https://prompt.kenjiai.com',
  'pr-pro': 'https://prpro.kenjiai.com/',
  'sales-coach': 'https://salescoach.kenjiai.com/',
  'calendly': 'https://calendly.com/care-kenjiai/30min'
} as const;

export function isValidInternalRoute(path: string): boolean {
  if (internalRoutes.includes(path as any)) return true;
  if (path.startsWith('/blog/')) return true;

  for (const route of internalRoutes) {
    if (path.startsWith(`${route}/`)) return true;
  }

  return false;
}

export function getExternalRoute(key: string): string | undefined {
  return externalRoutes[key as keyof typeof externalRoutes];
}

export function validateLink(href: string): { valid: boolean; reason?: string } {
  if (!href) {
    return { valid: false, reason: 'Empty href' };
  }

  if (href.startsWith('http://') || href.startsWith('https://')) {
    return { valid: true };
  }

  if (href.startsWith('/')) {
    if (isValidInternalRoute(href)) {
      return { valid: true };
    }
    return { valid: false, reason: `Invalid internal route: ${href}` };
  }

  if (href.startsWith('mailto:') || href.startsWith('tel:')) {
    return { valid: true };
  }

  return { valid: false, reason: `Unknown link format: ${href}` };
}
