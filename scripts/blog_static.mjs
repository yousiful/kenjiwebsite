// Post-build: give /blog and every blog article its own real HTML, and make sure
// every article is in dist/sitemap.xml.
//
// Same idea as scripts/podcast_static.mjs (read that header first). The SPA shell
// ships the homepage <title>, description and canonical (https://kenjiai.com/) on
// every URL until JavaScript runs, so crawlers that don't render JS (Bing often,
// most AI crawlers, link previews) see every article as a copy of the homepage.
// This writes dist/blog.html and dist/blog/<slug>.html with the article's own head
// tags, BlogPosting JSON-LD and body inside #root, marked data-static-seo so
// main.tsx replaces it instead of hydrating.
//
// Podcast episode pages are skipped here; podcast_static.mjs owns them.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://kenjiai.com';
const ORG_ID = `${SITE}/#organization`;
const WEBSITE_ID = `${SITE}/#website`;

// Load src/data/articles.ts (TypeScript + a JSON import) by bundling it to a temp ESM file.
const tmp = path.join(os.tmpdir(), `kenji-articles-${process.pid}.mjs`);
await build({
  entryPoints: [path.join(ROOT, 'src/data/articles.ts')],
  bundle: true, platform: 'node', format: 'esm', outfile: tmp, logLevel: 'error',
});
const { articles } = await import(pathToFileURL(tmp).href);
fs.rmSync(tmp, { force: true });

const all = Object.values(articles);
const posts = all.filter((a) => !a.podcast);
const blogList = all.filter((a) => !a.isCourse).sort((a, b) => new Date(b.date) - new Date(a.date));

const shell = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const crumbs = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: url })),
});

function render({ url, title, description, image, ogType, graph, body }) {
  const set = (html, re, tag) => {
    if (!re.test(html)) throw new Error(`blog_static: index.html no longer has ${re}`);
    return html.replace(re, tag);
  };
  let html = shell;
  html = set(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = set(html, /<meta name="title"[^>]*>/, `<meta name="title" content="${esc(title)}" />`);
  html = set(html, /<meta name="description"[^>]*>/, `<meta name="description" content="${esc(description)}" />`);
  html = set(html, /<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`);
  for (const [prop, val] of [['og:type', ogType], ['og:url', url], ['og:title', title], ['og:description', description],
    ['og:image', image], ['og:image:alt', title], ['twitter:url', url], ['twitter:title', title],
    ['twitter:description', description], ['twitter:image', image], ['twitter:image:alt', title]]) {
    html = set(html, new RegExp(`<meta property="${prop}"[^>]*>`), `<meta property="${prop}" content="${esc(val)}" />`);
  }
  if (image !== `${SITE}/og-image.png`) html = html.replace(/\s*<meta property="og:image:(width|height)"[^>]*>/g, '');
  html = html.replace('</head>', `<script type="application/ld+json" data-static-seo>${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>\n</head>`);
  html = set(html, /<div id="root"><\/div>/, `<div id="root"><div data-static-seo class="pt-24 pb-16 bg-gray-900 min-h-screen"><div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">${body}</div></div></div>`);
  return html;
}

function write(rel, html) {
  const file = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

// /blog
const BLOG_TITLE = 'Blog: AI Insights, Guides & Industry News';
const BLOG_DESC = 'Read the latest AI automation guides, lead generation strategies, voice agent breakdowns, and industry analysis from the KenjiAI team.';
write('blog.html', render({
  url: `${SITE}/blog`,
  title: `${BLOG_TITLE} | KenjiAI`,
  description: BLOG_DESC,
  image: `${SITE}/og-image.png`,
  ogType: 'website',
  graph: [
    { '@type': 'CollectionPage', '@id': `${SITE}/blog#webpage`, url: `${SITE}/blog`, name: BLOG_TITLE, description: BLOG_DESC, isPartOf: { '@id': WEBSITE_ID } },
    crumbs([['Home', `${SITE}/`], ['Blog', `${SITE}/blog`]]),
  ],
  body: `<nav class="flex items-center gap-2 text-xs text-gray-500 mb-8 uppercase tracking-widest font-bold"><a href="/">Home</a><span>/</span><a href="/blog">Blog</a></nav>
<h1 class="text-white text-3xl sm:text-4xl font-bold mb-3">${esc(BLOG_TITLE)}</h1>
<p class="text-gray-300 leading-relaxed mb-8">${esc(BLOG_DESC)} <a class="text-cyan-400" href="/podcast">The KenjiAI Podcast</a></p>
${blogList.map((a) => `<article class="mb-8"><h2 class="text-white text-xl font-bold"><a href="/blog/${a.slug}">${esc(a.title)}</a></h2>
<p class="text-gray-300 leading-relaxed">${esc(a.excerpt)}</p></article>`).join('\n')}`,
}));

// /blog/<slug> for each non-podcast article
for (const a of posts) {
  const url = `${SITE}/blog/${a.slug}`;
  const section = a.isCourse ? ['Academy', `${SITE}/knowledge`] : ['Blog', `${SITE}/blog`];
  write(`blog/${a.slug}.html`, render({
    url,
    title: `${a.title} | KenjiAI Blog`,
    description: a.excerpt,
    image: a.image,
    ogType: 'article',
    graph: [
      { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: a.title, description: a.excerpt, isPartOf: { '@id': WEBSITE_ID } },
      crumbs([['Home', `${SITE}/`], section, [a.title, url]]),
      {
        '@type': a.isCourse ? 'Article' : 'BlogPosting', '@id': `${url}#article`, headline: a.title, description: a.excerpt,
        image: a.image, datePublished: a.date, dateModified: a.date,
        author: { '@type': 'Organization', name: a.author, url: `${SITE}/` }, publisher: { '@id': ORG_ID },
        articleSection: a.category, keywords: (a.keywords || []).join(', '), inLanguage: 'en-US',
        mainEntityOfPage: { '@id': `${url}#webpage` }, isPartOf: { '@id': WEBSITE_ID },
      },
    ],
    body: `<nav class="flex items-center gap-2 text-xs text-gray-500 mb-8 uppercase tracking-widest font-bold"><a href="/">Home</a><span>/</span><a href="${section[1].replace(SITE, '')}">${section[0]}</a></nav>
<h1 class="text-3xl md:text-5xl font-bold text-white mb-6">${esc(a.title)}</h1>
<p class="text-gray-400 mb-6">${esc(a.author)} · ${esc(a.readTime)}</p>
<img src="${esc(a.image)}" alt="${esc(a.title)}" class="w-full rounded-2xl mb-10" />
<article class="prose prose-lg prose-invert max-w-none mb-16 blog-content-styles">${a.content || ''}</article>`,
  }));
}

// Sitemap safety net: any article missing from dist/sitemap.xml gets an entry.
const smPath = path.join(DIST, 'sitemap.xml');
let sm = fs.readFileSync(smPath, 'utf8');
const missing = all.filter((a) => !sm.includes(`<loc>${SITE}/blog/${a.slug}</loc>`));
if (missing.length) {
  const entries = missing.map((a) => `  <url>\n    <loc>${SITE}/blog/${a.slug}</loc>\n    <lastmod>${a.date}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`).join('');
  sm = sm.replace('</urlset>', `${entries}</urlset>`);
  fs.writeFileSync(smPath, sm);
}

console.log(`blog_static: wrote blog.html + ${posts.length} article pages; sitemap gaps filled: ${missing.map((a) => a.slug).join(', ') || 'none'}`);
