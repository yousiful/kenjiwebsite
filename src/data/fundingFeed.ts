/**
 * Funding feed data for /funding.
 *
 * This file is designed to be refreshed by a daily automation: a scheduled job
 * rewrites `lastUpdated`, `grants`, and `fundingIdeas` with current info, then
 * commits + pushes so Netlify redeploys. Keep the shape stable.
 *
 * Partners are managed separately in FundingPage.tsx (they change rarely).
 */

export type FeedLink = {
  title: string;
  description: string;
  url: string;
  tag?: string;
};

// Set by the daily automation to the date it last refreshed (YYYY-MM-DD).
export const lastUpdated = '2026-06-06';

// Evergreen government funding programs.
export const govPrograms: FeedLink[] = [
  {
    title: 'SBA 7(a) Loan Program',
    description:
      'The SBA’s primary program: loans up to $5M for working capital, equipment, real estate, and expansion, partially guaranteed by the government.',
    url: 'https://www.sba.gov/funding-programs/loans/7a-loans',
    tag: 'Loans up to $5M',
  },
  {
    title: 'SBA 504 Loan Program',
    description:
      'Long-term, fixed-rate financing up to $5.5M for major assets like real estate and heavy equipment.',
    url: 'https://www.sba.gov/funding-programs/loans/504-loans',
    tag: 'Fixed-rate',
  },
  {
    title: 'SBA Microloans',
    description:
      'Loans up to $50K for startups and small businesses, often paired with free business mentoring.',
    url: 'https://www.sba.gov/funding-programs/loans/microloans',
    tag: 'Up to $50K',
  },
  {
    title: 'SBIR / STTR Programs',
    description:
      'Non-dilutive federal R&D funding for small businesses developing innovative technology. No repayment required.',
    url: 'https://www.sbir.gov/',
    tag: 'Non-dilutive',
  },
  {
    title: 'SBA Lender Match',
    description:
      'Free tool that connects you with SBA-approved lenders based on your business needs in minutes.',
    url: 'https://www.sba.gov/funding-programs/loans/lender-match',
    tag: 'Free tool',
  },
];

// Grants — refreshed by the daily automation with current open opportunities.
export const grants: FeedLink[] = [
  {
    title: 'Grants.gov',
    description:
      'The federal clearinghouse for grant opportunities across every agency. Search, filter, and apply for current open grants.',
    url: 'https://www.grants.gov/',
    tag: 'Federal',
  },
  {
    title: 'USDA Rural Business Grants',
    description:
      'Grants and loan guarantees for businesses in rural areas, including the Rural Business Development Grant (RBDG).',
    url: 'https://www.rd.usda.gov/programs-services/business-programs',
    tag: 'Rural',
  },
  {
    title: 'MBDA Business Grants',
    description:
      'Minority Business Development Agency grants and centers helping minority-owned firms access capital and contracts.',
    url: 'https://www.mbda.gov/',
    tag: 'Minority-owned',
  },
  {
    title: 'State & Local Economic Development Grants',
    description:
      'Most states run grant and incentive programs for small businesses. Check your state’s economic development office for current openings.',
    url: 'https://www.sba.gov/local-assistance',
    tag: 'State / local',
  },
];

// Business funding ideas — rotated/refreshed daily by the automation.
export const fundingIdeas: FeedLink[] = [
  {
    title: 'Business line of credit',
    description:
      'Flexible, revolving access to cash you only pay interest on when you use it. Great for managing cash flow and seizing opportunities.',
    url: 'https://www.freedompath.com/Victorjonas/bolt-funding',
    tag: 'Flexible',
  },
  {
    title: 'Build business credit first',
    description:
      'Establishing tradelines and a strong business credit profile unlocks better funding terms and separates your personal credit from the business.',
    url: 'https://www.freedompath.com/Victorjonas/bca',
    tag: 'Foundation',
  },
  {
    title: '0% intro APR business cards',
    description:
      'Stack 0% introductory-APR business credit cards to fund short-term needs interest-free, then pay off before the promo ends.',
    url: 'https://go.thrivepfg.com/club',
    tag: 'Short-term',
  },
  {
    title: 'Revenue-based financing',
    description:
      'Get capital repaid as a percentage of future sales — ideal for businesses with steady revenue but limited collateral.',
    url: 'https://www.freedompath.com/Victorjonas/bolt-funding',
    tag: 'Revenue share',
  },
];
