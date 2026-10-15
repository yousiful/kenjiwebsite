import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Rss, ArrowRight } from 'lucide-react';
import PageSchema from '../components/PageSchema';
import { getPodcastEpisodes } from '../data/articles';
import { PODCAST_LINKS, PODCAST_FEED } from '../components/PodcastPlayer';

const DESCRIPTION =
  "Ads, sales and AI for business owners, cut from Yousif Alias's real Zoom trainings, webinars and team calls. Every episode comes with a full write-up.";

const PodcastPage: React.FC = () => {
  const episodes = getPodcastEpisodes();
  return (
    <>
      <PageSchema path="/podcast" name="The KenjiAI Podcast" description={DESCRIPTION} type="CollectionPage" />
      <Helmet>
        <title>The KenjiAI Podcast with Yousif Alias | KenjiAI</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href="https://kenjiai.com/podcast" />
        <link rel="alternate" type="application/rss+xml" title="The KenjiAI Podcast" href={PODCAST_FEED} />
        <meta property="og:title" content="The KenjiAI Podcast with Yousif Alias" />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image" content="https://kenjiai.com/podcast/cover.jpg" />
      </Helmet>

      <div className="min-h-screen px-4 py-16 sm:py-20" style={{ backgroundColor: '#0B0E14' }}>
        <div className="max-w-4xl mx-auto">
          <header className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start mb-12">
            <img
              src="/podcast/cover.jpg"
              alt="The KenjiAI Podcast cover"
              className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl border border-white/10 flex-shrink-0"
            />
            <div>
              <h1 className="text-white text-3xl sm:text-4xl font-bold mb-3">The KenjiAI Podcast</h1>
              <p className="text-gray-300 leading-relaxed mb-5">{DESCRIPTION}</p>
              <div className="flex flex-wrap gap-2 text-sm">
                {PODCAST_LINKS.filter((l) => l.href).map((l) => (
                  <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                     className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700">
                    {l.label}
                  </a>
                ))}
                <a href={PODCAST_FEED} className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 inline-flex items-center gap-1.5">
                  <Rss className="w-3.5 h-3.5" /> RSS feed
                </a>
              </div>
            </div>
          </header>

          <div className="space-y-6">
            {episodes.map((ep) => (
              <article key={ep.slug} className="rounded-2xl border border-white/10 bg-gray-900/60 overflow-hidden">
                <Link to={`/blog/${ep.slug}`}>
                  <img src={ep.image} alt={ep.title} className="w-full aspect-video object-cover" loading="lazy" />
                </Link>
                <div className="p-5 sm:p-6 space-y-3">
                  <p className="text-sm text-cyan-400">Episode {ep.number} · {Math.round(ep.duration / 60)} min</p>
                  <h2 className="text-white text-xl sm:text-2xl font-bold">
                    <Link to={`/blog/${ep.slug}`} className="hover:underline">{ep.title}</Link>
                  </h2>
                  <p className="text-gray-300 leading-relaxed">{ep.summary}</p>
                  <audio controls preload="none" src={ep.audioUrl} className="w-full" />
                  <Link to={`/blog/${ep.slug}`} className="inline-flex items-center gap-1.5 text-cyan-400 hover:underline text-sm">
                    Read the write-up <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PodcastPage;
