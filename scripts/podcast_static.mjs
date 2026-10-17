// Post-build: give /podcast and every podcast episode page its own real HTML.
//
// The site is a client-only SPA (prerender was disabled 2026-05-29, see
// vite.config.ts), so every URL ships the homepage's <title>, description and
// canonical until JavaScript runs. Google renders JS; Bing, AI crawlers and link
// previews mostly do not. This writes dist/podcast.html and
// dist/blog/<slug>.html with the right head tags, PodcastSeries/PodcastEpisode
// JSON-LD, and the episode write-up + transcript inside #root. main.tsx sees the
// data-static-seo marker and does a fresh createRoot render over it, not hydrate.
//
// Files are written as <path>.html (not <path>/index.html) so Netlify serves the
// clean URL without adding a trailing-slash redirect.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://kenjiai.com';
const SERIES_ID = `${SITE}/podcast#series`;
const SERIES_DESC =
  "Ads, sales and AI for business owners, cut from Yousif Alias's real Zoom trainings, webinars and team calls. Every episode comes with a full write-up.";

const shell = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const episodes = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/podcastEpisodes.json'), 'utf8'))
  .sort((a, b) => b.number - a.number);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const mins = (s) => Math.round(s / 60);

const series = {
  '@type': 'PodcastSeries', '@id': SERIES_ID, name: 'The KenjiAI Podcast', url: `${SITE}/podcast`,
  description: SERIES_DESC, image: `${SITE}/podcast/cover.jpg`, webFeed: `${SITE}/podcast/feed.xml`,
  inLanguage: 'en-US', author: { '@type': 'Person', name: 'Yousif Alias' }, publisher: { '@id': `${SITE}/#organization` },
};

const episodeNode = (ep) => ({
  '@type': 'PodcastEpisode', '@id': `${SITE}/blog/${ep.slug}#episode`, url: `${SITE}/blog/${ep.slug}`,
  name: ep.title, episodeNumber: ep.number, description: ep.summary, datePublished: ep.date,
  timeRequired: `PT${Math.floor(ep.duration / 60)}M${ep.duration % 60}S`, image: ep.image, inLanguage: 'en-US',
  author: { '@type': 'Person', name: 'Yousif Alias' },
  partOfSeries: { '@id': SERIES_ID, '@type': 'PodcastSeries', name: 'The KenjiAI Podcast', url: `${SITE}/podcast` },
  associatedMedia: { '@type': 'MediaObject', contentUrl: ep.audioUrl, encodingFormat: 'audio/mpeg' },
  ...(ep.transcriptUrl ? { transcript: ep.transcriptUrl } : {}),
});

const crumbs = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: url })),
});

function render({ url, title, description, image, ogType, graph, body }) {
  const set = (html, re, tag) => {
    if (!re.test(html)) throw new Error(`podcast_static: index.html no longer has ${re}`);
    return html.replace(re, tag);
  };
  let html = shell;
  html = set(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = set(html, /<meta name="description"[^>]*>/, `<meta name="description" content="${esc(description)}" />`);
  html = set(html, /<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />\n    <link rel="alternate" type="application/rss+xml" title="The KenjiAI Podcast" href="${SITE}/podcast/feed.xml" />`);
  for (const [prop, val] of [['og:type', ogType], ['og:url', url], ['og:title', title], ['og:description', description],
    ['og:image', image], ['og:image:alt', title], ['twitter:url', url], ['twitter:title', title],
    ['twitter:description', description], ['twitter:image', image], ['twitter:image:alt', title]]) {
    html = set(html, new RegExp(`<meta property="${prop}"[^>]*>`), `<meta property="${prop}" content="${esc(val)}" />`);
  }
  // The shell's og:image is 1200x630; ours are not, so drop the stale size hints.
  html = html.replace(/\s*<meta property="og:image:(width|height)"[^>]*>/g, '');
  html = html.replace('</head>', `<script type="application/ld+json" data-static-seo>${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>\n</head>`);
  html = set(html, /<div id="root"><\/div>/, `<div id="root"><div data-static-seo class="pt-24 pb-16 bg-gray-900 min-h-screen"><div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">${body}</div></div></div>`);
  return html;
}

const nav = (extra = '') =>
  `<nav class="flex items-center gap-2 text-xs text-gray-500 mb-8 uppercase tracking-widest font-bold"><a href="/">Home</a><span>/</span><a href="/podcast">Podcast</a>${extra}</nav>`;

function write(rel, html) {
  const file = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

// /podcast
write('podcast.html', render({
  url: `${SITE}/podcast`,
  title: 'The KenjiAI Podcast with Yousif Alias | KenjiAI',
  description: SERIES_DESC,
  image: `${SITE}/podcast/cover.jpg`,
  ogType: 'website',
  graph: [
    { '@type': 'CollectionPage', '@id': `${SITE}/podcast#webpage`, url: `${SITE}/podcast`, name: 'The KenjiAI Podcast', description: SERIES_DESC, isPartOf: { '@id': `${SITE}/#website` } },
    crumbs([['Home', `${SITE}/`], ['Podcast', `${SITE}/podcast`]]),
    series,
    ...episodes.map(episodeNode),
  ],
  body: `${nav()}<h1 class="text-white text-3xl sm:text-4xl font-bold mb-3">The KenjiAI Podcast</h1>
<p class="text-gray-300 leading-relaxed mb-8">${esc(SERIES_DESC)} <a class="text-cyan-400" href="/podcast/feed.xml">RSS feed</a></p>
${episodes.map((ep) => `<article class="mb-10"><p class="text-sm text-cyan-400">Episode ${ep.number} · ${mins(ep.duration)} min</p>
<h2 class="text-white text-2xl font-bold"><a href="/blog/${ep.slug}">${esc(ep.title)}</a></h2>
<p class="text-gray-300 leading-relaxed">${esc(ep.summary)}</p></article>`).join('\n')}`,
}));

// /blog/<slug> for each episode
for (const ep of episodes) {
  const url = `${SITE}/blog/${ep.slug}`;
  const fullTitle = `${ep.title} (Podcast Ep. ${ep.number})`;
  const transcript = (ep.transcript || []).map((p) =>
    `<p class="text-gray-300 leading-relaxed"><span class="text-cyan-400 font-mono text-xs mr-2">${esc(p.t)}</span>${esc(p.text)}</p>`).join('\n');
  write(`blog/${ep.slug}.html`, render({
    url,
    title: `${fullTitle} | KenjiAI Blog`,
    description: ep.summary,
    image: ep.image,
    ogType: 'article',
    graph: [
      { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: fullTitle, description: ep.summary, isPartOf: { '@id': `${SITE}/#website` } },
      crumbs([['Home', `${SITE}/`], ['Podcast', `${SITE}/podcast`], [ep.title, url]]),
      {
        '@type': 'BlogPosting', '@id': `${url}#article`, headline: fullTitle, description: ep.summary, image: ep.image,
        datePublished: ep.date, dateModified: ep.date, author: { '@type': 'Person', name: 'Yousif Alias' },
        publisher: { '@id': `${SITE}/#organization` }, articleSection: 'Podcast', keywords: ep.keywords.join(', '),
        inLanguage: 'en-US', mainEntityOfPage: { '@id': `${url}#webpage` },
      },
      episodeNode(ep),
    ],
    body: `${nav()}<h1 class="text-3xl md:text-5xl font-bold text-white mb-6">${esc(fullTitle)}</h1>
<p class="text-gray-400 mb-6">Yousif Alias · ${esc(ep.date)} · ${mins(ep.duration)} min listen</p>
<img src="${ep.image}" alt="${esc(ep.title)}" class="w-full rounded-2xl mb-6" />
<audio controls preload="none" src="${ep.audioUrl}" class="w-full mb-10"></audio>
<article class="prose prose-lg prose-invert max-w-none mb-16 blog-content-styles">${ep.content}</article>
${transcript ? `<section class="mb-16"><h2 class="text-white text-2xl font-bold mb-4">Full episode transcript</h2>${transcript}</section>` : ''}`,
  }));
}

console.log(`podcast_static: wrote podcast.html + ${episodes.length} episode pages`);
