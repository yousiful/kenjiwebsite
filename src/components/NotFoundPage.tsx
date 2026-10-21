import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight } from 'lucide-react';

/* Shown for in-app navigation to a URL that doesn't exist. Direct hits on an
   unknown URL get public/404.html from Netlify with a real HTTP 404 status;
   keep the two pages saying the same thing. */

const LINKS: { name: string; href: string; note: string }[] = [
  { name: 'Home', href: '/', note: 'Start from the homepage' },
  { name: 'Blog', href: '/blog', note: 'Guides on ads, follow-up and AI' },
  { name: 'Podcast', href: '/podcast', note: 'Real trainings and calls with Yousif Alias' },
  { name: 'Pricing', href: '/pricing', note: 'Plans and what each one includes' },
  { name: 'Free tools', href: '/free-tools', note: 'Calculators and generators for ads and sales' },
];

const NotFoundPage: React.FC = () => (
  <>
    <Helmet>
      <title>Page Not Found | KenjiAI</title>
      <meta name="description" content="This page doesn't exist. Head to the KenjiAI homepage, blog, podcast or pricing instead." />
      <meta name="robots" content="noindex, follow" />
    </Helmet>

    <div className="min-h-screen px-5 sm:px-8 pt-28 pb-20 text-[#F3EEE6]" style={{ backgroundColor: '#0B0E14' }}>
      <div className="max-w-2xl mx-auto">
        <p className="text-[#5EEAD4] font-bold tracking-widest text-sm">404</p>
        <h1 className="mt-3 text-[34px] sm:text-[48px] leading-[1.05] font-extrabold">This page isn&rsquo;t here.</h1>
        <p className="mt-4 text-[17px] sm:text-[18px] leading-relaxed text-[#C9D2DE]">
          The link might be old, or there&rsquo;s a typo in the address. These are the pages most people are looking for:
        </p>

        <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                to={l.href}
                className="group flex items-center justify-between gap-4 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5EEAD4]"
              >
                <span>
                  <span className="block text-[18px] font-semibold text-[#F3EEE6] group-hover:text-[#5EEAD4]">{l.name}</span>
                  <span className="block text-[15px] text-[#A9B4C4]">{l.note}</span>
                </span>
                <ArrowRight className="w-5 h-5 shrink-0 text-[#A9B4C4] group-hover:text-[#5EEAD4]" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-[15px] text-[#A9B4C4]">
          Need a hand? Call{' '}
          <a href="tel:+12133440705" className="text-[#F3EEE6] underline decoration-white/30 hover:decoration-[#5EEAD4]">(213) 344-0705</a>{' '}
          or email{' '}
          <a href="mailto:support@mediatraffics.com" className="text-[#F3EEE6] underline decoration-white/30 hover:decoration-[#5EEAD4] break-all">support@mediatraffics.com</a>.
        </p>
      </div>
    </div>
  </>
);

export default NotFoundPage;
