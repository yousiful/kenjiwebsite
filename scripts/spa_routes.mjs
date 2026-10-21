// Post-build (runs last): one real HTML file per SPA route, server-side 301s, and
// real 404s for everything else.
//
// Before this, netlify.toml and public/_redirects ended in `/* /index.html 200`, so
// /wp-login.php, /assets/missing.js, /favicon.ico and every typo came back as the
// homepage with HTTP 200 (soft 404s), and every SPA route's raw HTML carried the
// homepage title and canonical until JavaScript ran.
//
// For each route from scripts/route_list.mjs this writes dist/<route>.html (or
// dist/index.html for "/"). Netlify serves /pricing from pricing.html, so no
// rewrite rule is needed, and a URL with no file falls through to dist/404.html.
// If scripts/route-snapshots.json has a snapshot for the route (made by
// scripts/snapshot_routes.mjs from the real rendered page), the file gets that
// page's own title, description, canonical, robots, OG/Twitter tags, JSON-LD and a
// plain-HTML copy of its text, so crawlers that don't run JS (Bing often, most AI
// crawlers, link previews) see the real page. Without a snapshot the file is the app
// shell with its canonical and og:url corrected to the route.
//
// The static text sits in #root as <div data-static-seo="route">. main.tsx replaces
// it with a fresh React render; index.html hides it while JS is on so visitors don't
// see a flash of the plain version.

import fs from 'node:fs';
import path from 'node:path';
import { ROOT, getRoutes } from './route_list.mjs';

const DIST = path.join(ROOT, 'dist');
const SITE = 'https://kenjiai.com';
const SNAP_FILE = path.join(ROOT, 'scripts/route-snapshots.json');

const shell = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
if (shell.includes('<div data-static-seo="route"')) throw new Error('spa_routes: dist/index.html is already processed; run a fresh vite build');
// App shell for the scoped dynamic-route rewrites (e.g. /invites/e/:id, private
// invitation pages). noindex and no homepage canonical in the raw HTML; the React
// page still sets its own head tags once it renders.
fs.writeFileSync(path.join(DIST, 'spa-shell.html'), shell
  .replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex, nofollow" />')
  .replace(/\s*<link rel="canonical"[^>]*>/, ''));

if (!fs.existsSync(SNAP_FILE)) throw new Error('spa_routes: scripts/route-snapshots.json is missing (run npm run seo:snapshot and commit it)');
const snapFile = JSON.parse(fs.readFileSync(SNAP_FILE, 'utf8'));
const snapshots = snapFile.routes || {};
if (Object.keys(snapshots).length < 50) throw new Error(`spa_routes: route-snapshots.json only has ${Object.keys(snapshots).length} routes`);
// Snapshot text (titles, descriptions, prices in copy) is baked into the raw HTML that
// link previews and non-JS crawlers read. Warn when it is old so it gets refreshed.
const snapAgeDays = snapFile.generated ? (Date.now() - Date.parse(snapFile.generated)) / 864e5 : Infinity;
if (snapAgeDays > 21) console.warn(`spa_routes: WARNING route-snapshots.json is ${Number.isFinite(snapAgeDays) ? Math.round(snapAgeDays) + ' days' : 'undated'} old. Re-run npm run seo:snapshot after copy or price changes.`);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const urlFor = (p) => (p === '/' ? `${SITE}/` : `${SITE}${p}`);

const HEAD_META = /^(description|robots|keywords|title|twitter:.*)$/;
const HEAD_PROP = /^(og:|twitter:|article:)/;

function stripShellHead(html) {
  return html
    .replace(/\s*<meta name="(title|description|robots|keywords)"[^>]*>/g, '')
    .replace(/\s*<meta property="(og|twitter|article):[^"]*"[^>]*>/g, '')
    .replace(/\s*<link rel="canonical"[^>]*>/g, '');
}

function siteNav() {
  return `<nav aria-label="Site"><a href="/">Home</a> · <a href="/blog">Blog</a> · <a href="/podcast">Podcast</a> · <a href="/pricing">Pricing</a> · <a href="/free-tools">Free tools</a> · <a href="/about-yousif-alias">About</a></nav>`;
}

function bodyFromBlocks(blocks, links, route) {
  const out = [];
  let inList = false;
  let h1Seen = false;
  for (const b of blocks) {
    if (b.tag === 'li') {
      if (!inList) { out.push('<ul>'); inList = true; }
      out.push(`<li>${esc(b.text)}</li>`);
      continue;
    }
    if (inList) { out.push('</ul>'); inList = false; }
    let tag = b.tag;
    if (tag === 'h1') { if (h1Seen) tag = 'h2'; h1Seen = true; }
    if (tag === 'h4') tag = 'h3';
    if (!/^h[1-3]$/.test(tag)) tag = 'p';
    out.push(`<${tag}>${esc(b.text)}</${tag}>`);
  }
  if (inList) out.push('</ul>');
  const rel = (links || []).filter((l) => l.href !== route);
  if (rel.length) {
    out.push(`<h2>Links on this page</h2><ul>${rel.map((l) => `<li><a href="${esc(l.href)}">${esc(l.text)}</a></li>`).join('')}</ul>`);
  }
  return out.join('\n');
}

// Like blog_static's set(): fail the build if index.html no longer has what we patch.
function must(html, re, replacement) {
  if (!re.test(html)) throw new Error(`spa_routes: index.html no longer has ${re}`);
  return html.replace(re, replacement);
}

function render(route, snap) {
  const url = urlFor(route);
  let html = shell;
  if (!snap) {
    html = must(html, /<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`);
    html = html.replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`);
    html = html.replace(/<meta property="twitter:url"[^>]*>/, `<meta property="twitter:url" content="${url}" />`);
    return html;
  }
  const h = snap.head;
  const metas = (h.metas || []).filter((m) => (m.name && HEAD_META.test(m.name)) || (m.property && HEAD_PROP.test(m.property)));
  const tags = [
    ...metas.map((m) => (m.name
      ? `<meta name="${esc(m.name)}" content="${esc(m.content ?? '')}" />`
      : `<meta property="${esc(m.property)}" content="${esc(m.content ?? '')}" />`)),
    `<link rel="canonical" href="${esc(h.canonical || url)}" />`,
    ...(h.jsonld || []).map((j) => `<script type="application/ld+json" data-static-seo>${j.replace(/</g, '\\u003c')}</script>`),
  ];
  html = stripShellHead(html);
  html = must(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(h.title)}</title>\n    ${tags.join('\n    ')}`);
  const body = bodyFromBlocks(snap.blocks || [], snap.links || [], route);
  html = must(
    html,
    /<div id="root"><\/div>/,
    `<div id="root"><div data-static-seo="route" class="pt-24 pb-16 min-h-screen"><div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-300 leading-relaxed">${siteNav()}\n${body}</div></div></div>`,
  );
  return html;
}

const { pages, redirects, prefixes, skipped } = await getRoutes();

let withSnap = 0;
const missingSnap = [];
for (const route of pages) {
  const snap = snapshots[route];
  if (snap) withSnap++; else missingSnap.push(route);
  const rel = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
  const file = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, render(route, snap));
}

// Server-side rules appended after the hand-written public/_redirects rules.
const seen = new Set();
const rules = [];
for (const [from, to] of redirects) {
  if (seen.has(from)) continue;
  seen.add(from);
  rules.push(`${from.padEnd(34)} ${to.padEnd(40)} 301`);
}
for (const p of prefixes) rules.push(`${(p + '*').padEnd(34)} ${'/spa-shell.html'.padEnd(40)} 200`);
rules.push(`${'/not-found'.padEnd(34)} ${'/404.html'.padEnd(40)} 404`);
fs.appendFileSync(path.join(DIST, '_redirects'), `\n# ---- generated by scripts/spa_routes.mjs ----\n${rules.join('\n')}\n`);

if (!fs.existsSync(path.join(DIST, '404.html'))) throw new Error('spa_routes: dist/404.html missing (public/404.html)');

console.log(`spa_routes: wrote ${pages.length} route files (${withSnap} with snapshot), ${rules.length} redirect rules; prefixes: ${prefixes.join(', ') || 'none'}`);
if (missingSnap.length) console.log(`spa_routes: no snapshot (shell only) for: ${missingSnap.join(', ')}`);
if (skipped.length) console.log(`spa_routes: left to other owners: ${skipped.join('; ')}`);
