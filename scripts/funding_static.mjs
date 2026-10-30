// Post-build: real HTML for /funding and every /funding/<slug> landing page, written
// from public/funding-data.json so the raw HTML always matches the current listings.
//
// Same idea as blog_static.mjs (read its header). The Funding Finder's data changes
// every week (C:\Users\y_you\tools-crew\funding\refresh.mjs commits only the data file),
// so these pages are NOT taken from scripts/route-snapshots.json, which would go stale
// the moment a deadline passed. route_list.mjs leaves /funding routes to this script.
// Page copy comes from src/funding/topics.ts and the filter logic from
// src/funding/logic.ts, the same modules the React page uses.

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
const OG_IMAGE = `${SITE}/og-image.png`;

async function loadTs(rel) {
  const tmp = path.join(os.tmpdir(), `kenji-${path.basename(rel, '.ts')}-${process.pid}-${Date.now()}.mjs`);
  await build({ entryPoints: [path.join(ROOT, rel)], bundle: true, platform: 'node', format: 'esm', outfile: tmp, logLevel: 'error' });
  try { return await import(pathToFileURL(tmp).href); } finally { fs.rmSync(tmp, { force: true }); }
}

const L = await loadTs('src/funding/logic.ts');
const T = await loadTs('src/funding/topics.ts');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/funding-data.json'), 'utf8'));
if (!data.items?.length) throw new Error('funding_static: public/funding-data.json has no items');
const today = data.asOf;
const shell = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
if (shell.includes('<div data-static-seo="route"')) throw new Error('funding_static: dist/index.html is already processed; run a fresh vite build');

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const crumbs = (items) => ({ '@type': 'BreadcrumbList', itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: url })) });

function render({ url, title, description, graph, body }) {
  const set = (html, re, tag) => {
    if (!re.test(html)) throw new Error(`funding_static: index.html no longer has ${re}`);
    return html.replace(re, tag);
  };
  let html = shell;
  html = set(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = set(html, /<meta name="title"[^>]*>/, `<meta name="title" content="${esc(title)}" />`);
  html = set(html, /<meta name="description"[^>]*>/, `<meta name="description" content="${esc(description)}" />`);
  html = set(html, /<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`);
  for (const [prop, val] of [['og:type', 'website'], ['og:url', url], ['og:title', title], ['og:description', description],
    ['og:image', OG_IMAGE], ['og:image:alt', title], ['twitter:url', url], ['twitter:title', title],
    ['twitter:description', description], ['twitter:image', OG_IMAGE], ['twitter:image:alt', title]]) {
    html = set(html, new RegExp(`<meta property="${prop}"[^>]*>`), `<meta property="${prop}" content="${esc(val)}" />`);
  }
  html = html.replace('</head>', `<script type="application/ld+json" data-static-seo>${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>\n</head>`);
  html = set(html, /<div id="root"><\/div>/, `<div id="root"><div data-static-seo="route" class="pt-24 pb-16 bg-gray-900 min-h-screen"><div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-300 leading-relaxed">${body}</div></div></div>`);
  return html;
}

function write(rel, html) {
  const file = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

const nav = `<nav aria-label="Site" class="text-sm text-gray-500 mb-6"><a href="/">Home</a> · <a href="/free-tools">Free tools</a> · <a href="/funding">Funding Finder</a> · <a href="/blog">Blog</a></nav>`;

const item = (o) => `<article class="mb-6"><h3 class="text-white text-lg font-bold"><a href="${esc(o.url)}" rel="noopener">${esc(o.title)}</a></h3>
<p><strong>${esc(L.TYPE_LABEL[o.type])}</strong> (${esc(L.TYPE_NOTE[o.type].toLowerCase())}) · ${esc(o.provider)}${o.number ? ` · ${esc(o.number)}` : ''}</p>
<p>Amount: ${esc(L.amountLine(o))} · ${esc(L.deadlineLine(o, today))} · ${esc(L.statesLine(o))}</p>
<p>Who qualifies: ${esc(o.who)}</p>${o.summary ? `\n<p>${esc(o.summary)}</p>` : ''}
<p>Source: ${esc(L.SOURCE_LABEL[o.src])} · Last verified ${esc(L.niceDate(o.verified))} · <a href="${esc(o.url)}" rel="noopener">Apply on the official site</a></p></article>`;

const fundRow = (f) => `<li>${esc(f.name)}, ${esc([f.city, L.STATE_NAME[f.state] || f.state].filter(Boolean).join(', '))}. Fund size ${esc(L.money(f.size))}${f.filed ? `, filed ${esc(L.niceDate(f.filed))}` : ''}${f.phone ? `, phone ${esc(f.phone)} (from the filing)` : ''}. <a href="${esc(f.url)}" rel="noopener">SEC filing</a></li>`;

const faqHtml = (faq) => `<h2 class="text-white text-2xl font-bold mt-12 mb-4">Questions</h2>${faq.map(([q, a]) => `<h3 class="text-white font-bold">${esc(q)}</h3><p>${esc(a)}</p>`).join('\n')}`;
const faqLd = (url, faq) => ({ '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
const appLd = (url, name, description) => ({
  '@type': 'WebApplication', '@id': `${url}#app`, name, url, description, applicationCategory: 'BusinessApplication', operatingSystem: 'Any',
  isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, publisher: { '@id': ORG_ID },
});
const listLd = (url, name, list) => ({
  '@type': 'ItemList', '@id': `${url}#list`, name, numberOfItems: list.length,
  itemListElement: list.slice(0, 30).map((o, i) => ({ '@type': 'ListItem', position: i + 1, name: o.title, url: o.url })),
});
const guides = (current) => `<h2 class="text-white text-xl font-bold mt-12 mb-3">Funding guides</h2><ul>${T.FUNDING_TOPICS.filter((t) => t.slug !== current).map((t) => `<li><a href="/funding/${t.slug}">${esc(t.linkText)}</a></li>`).join('')}${current ? '<li><a href="/funding">All funding in the Finder</a></li>' : ''}</ul>
<p class="mt-8 text-sm">Sources: Grants.gov, SBIR.gov, the SEC Form D data set and each program's official page. KenjiAI takes no fee from any program listed here. Data refreshed ${esc(L.niceDate(today))}; the refresh runs every Monday. See also our <a href="/funding-partners">funding and credit partners</a> and other <a href="/free-tools">free tools</a>.</p>`;

const items = data.items;
const counts = L.countBy(items);
const countLine = L.TYPE_ORDER.filter((t) => counts[t]).map((t) => `${counts[t]} ${L.TYPE_LABEL[t].toLowerCase()}${counts[t] === 1 || t === 'rbf' ? '' : 's'}`).join(', ');
const E = L.EMPTY_FILTERS;

// ---------- /funding ----------
{
  const url = `${SITE}/funding`;
  const title = 'Funding Finder: Grants, Loans and Investors Open Now | KenjiAI';
  const description = 'Free directory of every funding opportunity a US small business or founder can apply for right now: grants, SBA loans, revenue-based financing, accelerators, angels and competitions. Each with its deadline, official link and last-verified date.';
  const sorted = L.sortItems(items, 'best');
  const curated = sorted.filter((o) => o.src === 'curated');
  const sbir = sorted.filter((o) => o.src === 'sbir');
  const gg = L.sortItems(items.filter((o) => o.src === 'grants.gov' && o.status === 'open'), 'deadline').slice(0, 120);
  const ggTotal = items.filter((o) => o.src === 'grants.gov').length;
  const byType = (t) => curated.filter((o) => o.type === t);
  const body = `${nav}
<h1 class="text-white text-3xl sm:text-4xl font-bold mb-4">Find funding for your business that is open right now</h1>
<p>Grants, SBA loans, revenue-based financing, accelerators, angel networks and competitions for US small businesses and founders. Every listing links to its official page and shows its deadline and the date we last checked it. Anything past its deadline drops off on its own.</p>
<p><strong>${items.length} open opportunities</strong> as of ${esc(L.niceDate(today))}: ${esc(countLine)}. Plus ${data.funds.length} US venture funds that filed a new Form D with the SEC in ${esc(data.sources.formD?.quarter || 'the latest quarter')}.</p>
<h2 class="text-white text-2xl font-bold mt-10 mb-3">How to read each listing</h2>
<ul><li>Grant and Competition: money you do not pay back.</li><li>Loan: repaid with interest. SBA programs are loans, never grants.</li><li>Revenue-based financing: repaid from a share of your revenue until a set total is paid.</li><li>Equity investment: an accelerator, angel group or fund buys part of your company.</li><li>Forecast: a federal notice the agency plans to post. Dates are the agency's estimate.</li></ul>
${L.TYPE_ORDER.map((t) => (byType(t).length ? `<h2 class="text-white text-2xl font-bold mt-10 mb-4">${esc(L.TYPE_LABEL[t])}s checked on their official pages</h2>\n${byType(t).map(item).join('\n')}` : '')).join('\n')}
<h2 class="text-white text-2xl font-bold mt-10 mb-4">SBIR and STTR topics open now</h2>
<p>Federal research and development awards for US small businesses, from SBIR.gov. No repayment and no equity.</p>
${sbir.map(item).join('\n')}
<h2 class="text-white text-2xl font-bold mt-10 mb-4">Federal grants on Grants.gov open to businesses</h2>
<p>${ggTotal} posted and forecasted federal notices list small or for-profit businesses as eligible. The ${gg.length} posted ones with the nearest deadlines are below; the Finder shows all of them.</p>
${gg.map(item).join('\n')}
<h2 class="text-white text-2xl font-bold mt-10 mb-4">Venture funds raising money this quarter</h2>
<p>US venture funds sized $10M to $150M that filed a new Form D with the SEC in ${esc(data.sources.formD?.quarter || 'the latest data set')}. A filing means the fund is raising money from its own investors, not that it takes pitches.</p>
<ul>${data.funds.slice(0, 60).map(fundRow).join('\n')}</ul>
${faqHtml(T.FUNDING_FAQ)}
${guides('')}`;
  write('funding.html', render({
    url, title, description, body,
    graph: [
      { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: 'Funding Finder', description, isPartOf: { '@id': WEBSITE_ID }, dateModified: today },
      crumbs([['Home', `${SITE}/`], ['Free Tools', `${SITE}/free-tools`], ['Funding Finder', url]]),
      appLd(url, 'KenjiAI Funding Finder', description),
      faqLd(url, T.FUNDING_FAQ),
      listLd(url, 'Open funding opportunities for US small businesses', sorted),
      {
        '@type': 'Dataset', '@id': `${url}#dataset`, name: 'Open US small business funding opportunities',
        description: `Grants, loans, revenue-based financing, equity programs and competitions open to US small businesses, compiled from Grants.gov, SBIR.gov, SEC Form D data and official program pages. Refreshed weekly. ${items.length} opportunities as of ${today}.`,
        url, dateModified: today, isAccessibleForFree: true, creator: { '@id': ORG_ID },
        distribution: { '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: `${SITE}/funding-data.json` },
        isBasedOn: ['https://www.grants.gov/', 'https://www.sbir.gov/', data.sources.formD?.url].filter(Boolean),
      },
    ],
  }));
}

// ---------- /funding/<slug> ----------
let pages = 0;
for (const topic of T.FUNDING_TOPICS) {
  const url = `${SITE}/funding/${topic.slug}`;
  const f = { ...E, ...topic.filters };
  const main = L.sortItems(items.filter((o) => L.matches(o, f, today) && (!topic.only || topic.only(o))), 'best', f.state);
  const ids = new Set(main.map((o) => o.id));
  const more = topic.more ? L.sortItems(items.filter((o) => !ids.has(o.id) && L.matches(o, { ...E, ...topic.more.filters }, today) && (!topic.more.only || topic.more.only(o))), 'best') : [];
  const funds = topic.funds ? data.funds.filter((x) => !topic.funds.state || x.state === topic.funds.state) : [];
  const faq = [...topic.faq, ...T.FUNDING_FAQ];
  const shownMain = main.slice(0, 80);
  const body = `${nav}
<nav class="text-sm mb-4" aria-label="Breadcrumb"><a href="/funding">Funding Finder</a> / ${esc(topic.linkText)}</nav>
<h1 class="text-white text-3xl sm:text-4xl font-bold mb-4">${esc(topic.h1)}</h1>
<p>${esc(topic.lead)}</p>
<p><strong>${main.length} ${main.length === 1 ? 'listing' : 'listings'}</strong> open as of ${esc(L.niceDate(today))}.${main.length > shownMain.length ? ` The first ${shownMain.length} are below; <a href="/funding">the Finder</a> shows them all with filters.` : ''}</p>
${main.length ? shownMain.map(item).join('\n') : '<p>This week we could not confirm any open program built only for this group on its official page, so none is listed here. The open programs below accept everyone who meets their rules.</p>'}
${more.length ? `<h2 class="text-white text-2xl font-bold mt-10 mb-3">${esc(topic.more.h)}</h2><p>${esc(topic.more.p)}</p>\n${more.slice(0, 12).map(item).join('\n')}` : ''}
${funds.length ? `<h2 class="text-white text-2xl font-bold mt-10 mb-3">${topic.funds.state ? `Venture funds raising money in ${esc(L.STATE_NAME[topic.funds.state])}` : 'Venture funds raising money this quarter'}</h2><p>${funds.length} US venture funds sized $10M to $150M filed a new Form D with the SEC${topic.funds.state ? ` from ${esc(L.STATE_NAME[topic.funds.state])}` : ''} in ${esc(data.sources.formD?.quarter || 'the latest data set')}. A filing means the fund is raising money from its own investors, not that it takes cold pitches. Check each fund's own site first.</p><ul>${funds.slice(0, 40).map(fundRow).join('\n')}</ul>` : ''}
${topic.sections.map((s) => `<h2 class="text-white text-2xl font-bold mt-10 mb-3">${esc(s.h)}</h2>${s.p.map((p) => `<p>${esc(p)}</p>`).join('')}`).join('\n')}
${faqHtml(faq)}
${guides(topic.slug)}`;
  write(`funding/${topic.slug}.html`, render({
    url, title: topic.title, description: topic.description, body,
    graph: [
      { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: topic.h1, description: topic.description, isPartOf: { '@id': WEBSITE_ID }, dateModified: today },
      crumbs([['Home', `${SITE}/`], ['Funding Finder', `${SITE}/funding`], [topic.linkText, url]]),
      appLd(url, `KenjiAI Funding Finder: ${topic.linkText}`, topic.description),
      faqLd(url, faq),
      listLd(url, topic.h1, main),
    ],
  }));
  pages++;
}

// Sitemap: make sure every funding URL is listed, with lastmod = the data date.
const smPath = path.join(DIST, 'sitemap.xml');
let sm = fs.readFileSync(smPath, 'utf8');
const urls = [`${SITE}/funding`, ...T.FUNDING_TOPICS.map((t) => `${SITE}/funding/${t.slug}`)];
for (const u of urls) {
  const re = new RegExp(`(<loc>${u.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}</loc>\\s*<lastmod>)[^<]*(</lastmod>)`);
  if (re.test(sm)) sm = sm.replace(re, `$1${today}$2`);
  else sm = sm.replace('</urlset>', `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${u.endsWith('/funding') ? '0.9' : '0.8'}</priority>\n  </url>\n</urlset>`);
}
fs.writeFileSync(smPath, sm);
console.log(`funding_static: wrote funding.html + ${pages} landing pages from ${items.length} listings (${countLine}), ${data.funds.length} funds, data ${today}`);
