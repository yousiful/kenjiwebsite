import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, ShieldCheck, Building2, Sparkles, Landmark, Award, Lightbulb, ExternalLink } from 'lucide-react';
import { govPrograms, grants, fundingIdeas, lastUpdated, type FeedLink } from '../data/fundingFeed';

/**
 * Funding & Credit Partners page.
 *
 * Data-driven: to add a new partner, append to the PARTNERS array below.
 * Each partner can list one or more offers. No other code changes needed.
 */

type Offer = {
  title: string;
  description: string;
  points?: string[];
  url: string;
  cta?: string;
};

type Partner = {
  name: string;
  tagline: string;
  blurb: string;
  offers: Offer[];
};

const PARTNERS: Partner[] = [
  {
    name: 'Thrive Point Financial Group',
    tagline: 'Your financial command center',
    blurb:
      'Get real clarity on your credit, debt, and funding readiness. Thrive Club gives entrepreneurs the dashboards and tools to understand their numbers and prepare for future funding opportunities.',
    offers: [
      {
        title: 'Thrive Club Membership',
        description:
          'A financial health dashboard with a credit simulator, debt strategy planning, loan comparison tools, and funding-readiness resources, plus an entrepreneur community.',
        points: [
          'Credit simulator & optimization tools',
          'Debt payoff & loan comparison planning',
          'Month-to-month, cancel anytime',
        ],
        url: 'https://go.thrivepfg.com/club',
        cta: 'Join Thrive Club',
      },
    ],
  },
  {
    name: 'Victor Jonas Consulting LLC',
    tagline: 'Get funded in 90 days — no money down, bad credit OK',
    blurb:
      'A proven, step-by-step system that has helped people get funded in as little as 90 days, even with no money up front, bad credit, and no bank statements. You get insider knowledge and direct coach access to secure capital, build business credit, and protect your personal credit.',
    offers: [
      {
        title: 'Bolt Funding',
        description:
          'Tailored financing for businesses at any stage, with fast lender matching across lines of credit, term loans, startup funding, and SBA loans.',
        points: [
          'Lines of credit $5K–$500K (1–3 days)',
          'Term loans $5K–$2M • Startup funding $5K–$150K',
          'SBA loans up to $2M',
        ],
        url: 'https://www.freedompath.com/Victorjonas/bolt-funding',
        cta: 'Get Funded',
      },
      {
        title: 'Business Credit Academy',
        description:
          'Step-by-step guidance to make your business bankable, building tradelines, accurate database listings, and access to 3,000+ credit vendors.',
        points: [
          'Build business credit the right way',
          'Establish vendor tradelines',
          'Access 3,000+ credit vendors',
        ],
        url: 'https://www.freedompath.com/Victorjonas/bca',
        cta: 'Build Business Credit',
      },
      {
        title: 'Freedom Wealth',
        description:
          'Credit profile monitoring and identity verification so you always know where your personal credit stands as you grow.',
        points: [
          'Ongoing credit profile monitoring',
          'Identity verification',
          'Available in English & Spanish',
        ],
        url: 'https://www.freedompath.com/victorjonas/freedom-wealth/enrollment',
        cta: 'Enroll Now',
      },
    ],
  },
];

const VALUE_PROPS = [
  {
    icon: Building2,
    title: 'Vetted partners',
    description: 'We only point you to funding and credit partners we trust to do right by our clients.',
  },
  {
    icon: TrendingUp,
    title: 'Capital to grow',
    description: 'Access the funding you need to invest in marketing, AI, and the systems that scale your business.',
  },
  {
    icon: ShieldCheck,
    title: 'Get funding-ready',
    description: 'Build business credit and clean up your profile so you qualify for better terms down the road.',
  },
];

const FeedSection: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  subtitle: string;
  items: FeedLink[];
}> = ({ icon: Icon, eyebrow, title, subtitle, items }) => (
  <motion.section
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <div className="mb-8">
      <div className="inline-flex items-center gap-2 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-blue-400 text-sm font-semibold tracking-widest uppercase">{eyebrow}</span>
      </div>
      <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 leading-tight">{title}</h2>
      <p className="text-gray-300 max-w-3xl leading-relaxed">{subtitle}</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((item) => (
        <a
          key={item.title}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col bg-gray-900/60 backdrop-blur-sm border border-gray-800 hover:border-blue-500/50 rounded-2xl p-6 transition-all duration-300"
        >
          {item.tag && (
            <span className="self-start text-xs font-semibold text-green-300 bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1 mb-3">
              {item.tag}
            </span>
          )}
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            {item.title}
            <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400 transition-colors" />
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
        </a>
      ))}
    </div>
  </motion.section>
);

const FundingPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Funding & Credit Partners | KenjiAI</title>
        <meta
          name="description"
          content="KenjiAI's trusted funding and credit partners. Access business funding, build business credit, and get funding-ready to grow your business."
        />
        <link rel="canonical" href="https://kenjiai.com/funding" />
      </Helmet>

      <div className="min-h-screen" style={{ backgroundColor: '#0B0E14' }}>
        <div className="pt-24 pb-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">

            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 mb-6">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-semibold tracking-wide">Trusted Funding Partners</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-white mb-5 leading-tight">
                Funding &amp; Credit to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                  Grow Your Business
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 font-medium max-w-2xl mx-auto">
                We've partnered with vetted funding and credit experts to help you access capital,
                build business credit, and get funding-ready, so you can invest in what moves your business forward.
              </p>
            </motion.div>

            {/* Value props */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
              {VALUE_PROPS.map((vp, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-7 text-center"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center mx-auto mb-4">
                    <vp.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{vp.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{vp.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Partners */}
            <div className="space-y-16">
              {PARTNERS.map((partner, pIdx) => (
                <motion.section
                  key={partner.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-8">
                    <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-2">
                      Partner {String(pIdx + 1).padStart(2, '0')}
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 leading-tight">
                      {partner.name}
                    </h2>
                    <p className="text-green-400 font-semibold mb-3">{partner.tagline}</p>
                    <p className="text-gray-300 max-w-3xl leading-relaxed">{partner.blurb}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {partner.offers.map((offer) => (
                      <div
                        key={offer.title}
                        className="flex flex-col bg-gray-900/60 backdrop-blur-sm border border-gray-800 hover:border-blue-500/50 rounded-2xl p-6 transition-all duration-300"
                      >
                        <h3 className="text-xl font-bold text-white mb-2">{offer.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">{offer.description}</p>

                        {offer.points && (
                          <ul className="space-y-2 mb-6">
                            {offer.points.map((point, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        <a
                          href={offer.url}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="group mt-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white transition-all duration-300"
                          style={{
                            background: 'linear-gradient(135deg, #3B82F6, #10B981)',
                            boxShadow: '0 0 20px rgba(59,130,246,0.25)',
                          }}
                        >
                          {offer.cta || 'Learn More'}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                      </div>
                    ))}
                  </div>
                </motion.section>
              ))}
            </div>

            {/* Government programs, grants, daily funding ideas */}
            <div className="mt-20 space-y-16">
              <FeedSection
                icon={Landmark}
                eyebrow="Government Programs"
                title="Government Funding Programs"
                subtitle="Federal loan and financing programs every business owner should know, from SBA loans to non-dilutive R&D funding."
                items={govPrograms}
              />

              <FeedSection
                icon={Award}
                eyebrow="Grants"
                title="Grants & Free Capital"
                subtitle="Money you don't pay back. We keep an eye on federal, state, and niche grant opportunities worth applying for."
                items={grants}
              />

              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-green-300 bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Updated daily
                  </span>
                  <span className="text-gray-500 text-xs">Last updated {lastUpdated}</span>
                </div>
                <FeedSection
                  icon={Lightbulb}
                  eyebrow="Funding Ideas"
                  title="Business Funding Ideas"
                  subtitle="Fresh, actionable ways to fund and grow your business, refreshed regularly so you always have a current playbook."
                  items={fundingIdeas}
                />
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-20 max-w-3xl mx-auto text-center">
              <p className="text-gray-500 text-xs leading-relaxed">
                KenjiAI partners with independent funding and credit providers. These partners are not owned or
                operated by KenjiAI, and KenjiAI may receive referral compensation. Funding, credit approval, and
                results are determined solely by the provider and are never guaranteed. Review each partner's terms
                before enrolling.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default FundingPage;
