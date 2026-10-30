// Funding Finder landing pages (/funding/<slug>), one per high-intent search that
// Google autocomplete confirmed on 2026-10-30. Each page shows real filtered listings
// from public/funding-data.json plus a plain explainer. scripts/funding_static.mjs
// prerenders them from the same data, so keep this file free of React.
// Copy rules: no em dashes, no hype, no all-caps, honest about what each type costs.
import type { Filters, FundType, Opportunity } from './logic';

export interface FundingTopic {
  slug: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  linkText: string;
  /** preset filters applied to the listings on this page */
  filters: Partial<Filters>;
  /** extra test on top of the filters (e.g. only items limited to one state) */
  only?: (o: Opportunity) => boolean;
  /** show SEC Form D venture funds, optionally limited to one state */
  funds?: { state?: string };
  /** a second list under the main one ("Also open to you") */
  more?: { h: string; p: string; filters: Partial<Filters>; only?: (o: Opportunity) => boolean };
  sections: { h: string; p: string[] }[];
  faq: [string, string][];
  related: string[];
}

const grantish: FundType[] = ['grant', 'competition'];

export const FUNDING_TOPICS: FundingTopic[] = [
  {
    slug: 'small-business-grants',
    title: 'Small Business Grants Open Now, Checked Weekly | KenjiAI Funding Finder',
    description: 'Every small business grant we can confirm is open right now: federal grants from Grants.gov, SBIR awards and private grants, each with its deadline, amount and official link. Updated every week.',
    h1: 'Small business grants that are open right now',
    lead: 'Grants are money you do not pay back. Below is every grant we could confirm on its official page: private and corporate grants first, then federal SBIR awards, then federal grants on Grants.gov that list small or for-profit businesses as eligible. Expired ones drop off on their own.',
    linkText: 'Small business grants',
    filters: { types: grantish },
    sections: [
      {
        h: 'What a small business grant really is',
        p: [
          'A grant is money given for a stated purpose that you do not repay and that does not cost you ownership. That is why there are far fewer of them than people expect, and why each one has strict rules about who can apply and what the money can pay for.',
          'Most federal grants are for research, public health, energy or community projects, not for general working capital. The federal government does not hand out grants to start or run an ordinary business. If a website promises a free federal grant for any business, it is not telling you the truth.',
        ],
      },
      {
        h: 'Where real grants for a for-profit business come from',
        p: [
          'Private grants come from companies and foundations, often as a contest with a short window and a small number of winners. Federal money for small businesses mostly comes through SBIR and STTR, which fund research and development at companies under 500 employees. Grants.gov also lists federal notices where for-profit businesses are one of several eligible applicant types.',
          'State and city programs are the third source. They open and close with budgets, so check your state economic development office as well as the listings here.',
        ],
      },
      {
        h: 'How to raise your odds',
        p: [
          'Read the eligibility rules before anything else and skip the ones you do not fit. Keep a short business plan, last year\'s tax return or a profit and loss statement, and a one paragraph answer to "what will you do with the money" ready to paste. Federal applications need a SAM.gov registration and a Unique Entity ID, which can take a few weeks, so start that early.',
        ],
      },
    ],
    faq: [
      ['Are there free government grants to start a business?', 'Not in the way most ads suggest. Federal grants for for-profit companies are mostly SBIR and STTR research awards, plus specific programs listed on Grants.gov. Starting or running an ordinary business is usually funded with loans, savings or investors.'],
      ['Do I have to pay back a small business grant?', 'No. A grant is not repaid as long as you use it the way the rules say. Loans and revenue-based financing are repaid, which is why every listing here is labeled by type.'],
      ['How often is this list updated?', 'Every Monday morning. Each listing shows the date it was last checked, and anything past its deadline is removed automatically.'],
    ],
    related: ['grants-for-women', 'sba-loans', 'small-business-grants-california', 'small-business-grants-texas'],
  },
  {
    slug: 'grants-for-women',
    title: 'Grants for Women-Owned Businesses, Open Now | KenjiAI Funding Finder',
    description: 'Grants and funding built for women-owned businesses, checked on each official page with its deadline, amount and who qualifies. Plus open grants any small business can apply for.',
    h1: 'Grants for women-owned businesses',
    lead: 'These programs are built for women founders or require majority women ownership. Each one is checked on its official page. Below them are open grants and competitions any small business can apply for, because women-owned businesses qualify for those too.',
    linkText: 'Grants for women',
    filters: { audience: 'women' },
    more: { h: 'Open grants and competitions any small business can apply for', p: 'These are not limited to one group, so you qualify on the same terms as anyone else.', filters: { types: grantish, srcs: ['curated', 'sbir'] }, only: (o) => !o.audience.length && o.states.includes('US') },
    sections: [
      {
        h: 'What "women-owned" usually means in the rules',
        p: [
          'Most programs ask for at least 51 percent ownership and day to day control by one or more women. Some also ask for a minimum time in business or a revenue cap. Read the official rules on each listing, since a program that looks like a fit can exclude you on one line.',
        ],
      },
      {
        h: 'Federal options for women-owned businesses',
        p: [
          'There is no federal grant that pays women-owned businesses simply for being women-owned. The federal Women-Owned Small Business (WOSB) program helps certified firms win government contracts, and SBA Women\'s Business Centers give free counseling. SBA loans are open to women-owned businesses on the same terms as everyone else.',
        ],
      },
    ],
    faq: [
      ['Is there a government grant just for women-owned businesses?', 'No federal grant pays a business only for being women-owned. Women-specific grants come from private programs like the ones listed here, while federal help comes through contracting set-asides, counseling and loans.'],
      ['Can a women-owned business apply to general grants too?', 'Yes. Women-owned businesses can apply for any grant they meet the rules for, so check the full list of open grants as well.'],
    ],
    related: ['small-business-grants', 'startup-funding', 'sba-loans'],
  },
  {
    slug: 'startup-funding',
    title: 'Startup Funding Open Now: Accelerators, Angels, Grants | KenjiAI Funding Finder',
    description: 'Startup funding you can apply for right now: accelerator deadlines, angel networks that take applications, SBIR and NSF grants, pitch competitions and new venture funds from SEC filings.',
    h1: 'Startup funding you can apply for right now',
    lead: 'Funding for founders at the idea or early stage, sorted by what it costs you. Grants and competitions cost nothing, accelerators and angels take equity, and venture funds from fresh SEC filings show who is raising money to invest this quarter.',
    linkText: 'Startup funding',
    filters: { stage: 'early', srcs: ['curated', 'sbir'] },
    funds: {},
    sections: [
      {
        h: 'The stages of startup funding, in plain words',
        p: [
          'Most startups start with savings, friends and family, or a small grant. A pre-seed or seed round from angels or an accelerator usually comes next, in exchange for a slice of the company. Series A and later rounds come from venture capital funds once there is real traction.',
          'Non-dilutive money such as SBIR grants, competitions and revenue-based financing lets you grow without giving up ownership. If your company does real research, SBIR is often the largest check you can get without selling equity.',
        ],
      },
      {
        h: 'How to read the venture fund list',
        p: [
          'The venture funds below filed a new Form D with the SEC in the latest quarterly data set. A Form D means the fund is raising money from its own investors. It does not mean the fund invests in your industry or takes cold pitches, and some are vehicles for a single deal. Look up the fund\'s own website and portfolio before you reach out.',
        ],
      },
    ],
    faq: [
      ['What is the easiest startup funding to get?', 'For most founders it is money that matches what they already have: savings, revenue, a small loan or a grant they clearly qualify for. Accelerators and angels are competitive and take equity.'],
      ['Do accelerators take equity?', 'Most do. Y Combinator and Techstars invest a set amount for a set share, which is shown on each listing when the official page states it.'],
    ],
    related: ['ai-startup-funding', 'revenue-based-financing', 'small-business-grants'],
  },
  {
    slug: 'revenue-based-financing',
    title: 'Revenue-Based Financing Companies for Small Business | KenjiAI Funding Finder',
    description: 'Revenue-based financing providers that fund US businesses today, with funding ranges and requirements taken from each provider\'s own site. How RBF works, what it costs and when it makes sense.',
    h1: 'Revenue-based financing companies',
    lead: 'Revenue-based financing gives you cash now and takes a share of your future revenue until a set amount is repaid. You keep ownership, but it is not free money. Each provider below was checked on its own site.',
    linkText: 'Revenue-based financing',
    filters: { types: ['rbf'] },
    sections: [
      {
        h: 'How revenue-based financing works',
        p: [
          'A provider advances a lump sum. You repay a fixed total, usually the advance plus a flat fee, by sending a percentage of revenue each month or each payout. When sales are slow you pay less, when sales are strong you pay it off faster.',
          'Because the fee is fixed, paying it back quickly can make the effective annual cost high. Ask for the total repayment amount and the expected payback time in writing, then compare it with a bank or SBA loan.',
        ],
      },
      {
        h: 'Who it fits',
        p: [
          'RBF fits businesses with steady, trackable revenue, such as ecommerce stores and subscription software, that need money for inventory or marketing with a clear payback. It is a poor fit before you have revenue, or when margins are thin.',
        ],
      },
    ],
    faq: [
      ['Is revenue-based financing a loan?', 'It is a form of financing you repay, so treat it like debt even when the provider calls it something else. You do not give up equity.'],
      ['What do RBF companies usually require?', 'Usually a minimum monthly revenue, some months of trading history and connected bank, payment or store accounts. The listings show each provider\'s stated requirements when their site gives them.'],
    ],
    related: ['sba-loans', 'startup-funding', 'small-business-grants'],
  },
  {
    slug: 'sba-loans',
    title: 'SBA Loans Explained: 7(a), 504, Microloans and SSBCI | KenjiAI Funding Finder',
    description: 'The main SBA loan programs and state SSBCI programs, with maximum amounts taken from SBA.gov and Treasury, plus state lenders. Loans are repaid, and this page says so plainly.',
    h1: 'SBA loans and other small business loans',
    lead: 'The SBA does not lend most of this money itself. It guarantees part of a loan made by a bank, credit union or nonprofit lender, which makes lenders more willing to say yes. These are loans and must be repaid. Program limits below come from SBA.gov and Treasury.',
    linkText: 'SBA loans',
    filters: { types: ['loan'] },
    sections: [
      {
        h: 'Which SBA loan fits which need',
        p: [
          '7(a) loans are the general purpose option for working capital, equipment, buying a business or refinancing. 504 loans fund big fixed assets like real estate and heavy equipment at a long fixed rate. Microloans are smaller loans made through nonprofit intermediaries, often with coaching included.',
          'SSBCI is a Treasury program that sends money to states, which run their own loan, guarantee and investment programs. What you can get depends on your state.',
        ],
      },
      {
        h: 'Getting ready to apply',
        p: [
          'Lenders look at credit history, cash flow that can cover the payment, time in business, collateral and a personal guarantee from owners with 20 percent or more. Have two to three years of tax returns, current financial statements and a short plan for the money. SBA Lender Match on SBA.gov connects you with participating lenders for free.',
        ],
      },
    ],
    faq: [
      ['Are SBA loans grants?', 'No. SBA loans are repaid with interest. The SBA guarantees part of the loan to the lender, it does not give the money away.'],
      ['Can a startup get an SBA loan?', 'Yes, but it is harder without revenue history. Microloans and some 7(a) lenders work with startups, usually with a strong plan, owner investment and good personal credit.'],
    ],
    related: ['revenue-based-financing', 'small-business-grants', 'small-business-grants-texas'],
  },
  {
    slug: 'ai-startup-funding',
    title: 'AI Startup Funding: Accelerators, SBIR and NSF Grants | KenjiAI Funding Finder',
    description: 'Funding open to AI startups right now: accelerator deadlines, NSF America\'s Seed Fund and SBIR topics, technology grants on Grants.gov and new venture funds, each with its official link.',
    h1: 'AI startup funding open right now',
    lead: 'Funding that AI and software founders can apply for today. Non-dilutive options come first: NSF\'s Seed Fund and SBIR topics for technical R&D, then accelerators and investors who back early AI companies.',
    linkText: 'AI startup funding',
    filters: { industry: 'tech', types: ['grant', 'equity', 'competition'] },
    funds: {},
    sections: [
      {
        h: 'Non-dilutive money for AI companies',
        p: [
          'NSF\'s America\'s Seed Fund backs new technology with real technical risk, including AI. You start with a short Project Pitch, and only invited pitches can submit a full Phase I proposal. A product that uses existing AI APIs to run a service is usually not enough; NSF wants research into something that does not exist yet.',
          'Other SBIR agencies publish specific topics, many of them in AI, autonomy and data. Each topic is a problem the agency wants solved, with its own close date.',
        ],
      },
      {
        h: 'Equity funding for AI startups',
        p: [
          'Accelerators like Y Combinator, Techstars and a16z speedrun run batches with fixed deadlines and fixed terms. Angels and seed funds are more flexible but harder to reach without an introduction. Show traction with real users before pitching, since AI demos are easy to build and investors know it.',
        ],
      },
    ],
    faq: [
      ['Does NSF fund AI startups?', 'Yes, when the work is genuine research and development with technical risk. Start with the Project Pitch on seedfund.nsf.gov.'],
      ['Which accelerators fund AI startups?', 'General accelerators such as Y Combinator, Techstars and a16z speedrun accept AI companies. Each listing shows its current deadline and terms from the official page.'],
    ],
    related: ['startup-funding', 'small-business-grants', 'revenue-based-financing'],
  },
  {
    slug: 'small-business-grants-california',
    title: 'California Small Business Grants and Funding, Open Now | KenjiAI Funding Finder',
    description: 'California small business grants, state and local loan programs, angel networks and venture funds that filed with the SEC from California, each with its deadline and official link.',
    h1: 'California small business grants and funding',
    lead: 'Programs run by California, its cities and California-based lenders and investors, checked on their official pages. Venture funds that filed a new Form D from California are listed below them. Nationwide grants are open to California businesses too.',
    linkText: 'California',
    filters: { state: 'CA' },
    only: (o) => o.states.includes('CA') || (o.hq || []).includes('CA'),
    more: { h: 'Nationwide programs open to California businesses', p: 'Hand-checked programs that accept applicants from any state, including California.', filters: { srcs: ['curated'] }, only: (o) => o.states.includes('US') && !o.audience.includes('student') },
    funds: { state: 'CA' },
    sections: [
      {
        h: 'Where California funding comes from',
        p: [
          'The Governor\'s Office of Business and Economic Development (GO-Biz) runs state programs including the California Competes tax credit and grant, and its Office of Small Business Advocate funds local partners. IBank runs state loan guarantee programs through lenders. Many cities, including Los Angeles and San Francisco, run their own grant and loan programs that open with each budget year.',
          'California also has the largest share of venture funds in the country, which shows in the Form D list below.',
        ],
      },
    ],
    faq: [
      ['Does California give grants to small businesses?', 'Some, through specific programs that open with state and city budgets. Most ongoing state help comes as loan guarantees and technical help. The listings show what is open or recurring right now.'],
      ['Can a California business apply for federal grants?', 'Yes. Nationwide grants, SBIR topics and SBA loans are open to California businesses; see the full Funding Finder.'],
    ],
    related: ['small-business-grants', 'small-business-grants-texas', 'startup-funding'],
  },
  {
    slug: 'small-business-grants-texas',
    title: 'Texas Small Business Grants and Funding, Open Now | KenjiAI Funding Finder',
    description: 'Texas small business grants, state and local loan programs, Texas lenders, angel networks and venture funds that filed with the SEC from Texas, each with its deadline and official link.',
    h1: 'Texas small business grants and funding',
    lead: 'Programs run by Texas, its cities and Texas-based lenders and investors, checked on their official pages. Venture funds that filed a new Form D from Texas are listed below them. Nationwide grants are open to Texas businesses too.',
    linkText: 'Texas',
    filters: { state: 'TX' },
    only: (o) => o.states.includes('TX') || (o.hq || []).includes('TX'),
    more: { h: 'Nationwide programs open to Texas businesses', p: 'Hand-checked programs that accept applicants from any state, including Texas.', filters: { srcs: ['curated'] }, only: (o) => o.states.includes('US') && !o.audience.includes('student') },
    funds: { state: 'TX' },
    sections: [
      {
        h: 'Where Texas funding comes from',
        p: [
          'Texas economic development programs mostly target companies creating jobs, through programs such as the Texas Enterprise Fund. For smaller businesses the main state tools are loan programs such as the Texas Capital Access Program, plus nonprofit lenders that serve the whole state.',
          'Cities including Houston, Dallas, Austin and San Antonio run small business programs that open with their budgets, so check your city economic development office too.',
        ],
      },
    ],
    faq: [
      ['Are there grants for small businesses in Texas?', 'A few, mostly tied to job creation or specific cities. Most Texas help for small businesses comes as loans and lender programs. The listings show what is open or recurring right now.'],
      ['Can a Texas business apply for federal grants?', 'Yes. Nationwide grants, SBIR topics and SBA loans are open to Texas businesses; see the full Funding Finder.'],
    ],
    related: ['small-business-grants', 'small-business-grants-california', 'sba-loans'],
  },
];

export const topicBySlug = (slug: string) => FUNDING_TOPICS.find((t) => t.slug === slug);
export const topicLinkText = (slug: string) => topicBySlug(slug)?.linkText || slug;

/** Shared FAQ for /funding and every landing page. */
export const FUNDING_FAQ: [string, string][] = [
  ['Is the Funding Finder free?', 'Yes. Browsing, filtering and the weekly match email are free. You never need an account to see the listings.'],
  ['Where do the listings come from?', 'Federal grants come from the Grants.gov API, SBIR and STTR topics from SBIR.gov, venture funds from the SEC Form D quarterly data set, and every other program was checked by hand on its official page. Each listing links to its source.'],
  ['How do you keep it current?', 'A refresh runs every Monday morning. It pulls the federal data again, removes anything past its deadline, re-checks every official link and hides programs whose page has gone dead.'],
  ['Do you take a cut if I get funded?', 'No. KenjiAI does not take a fee or commission from any program listed in the Finder. Apply directly on the official site.'],
];
