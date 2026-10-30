// Dev tool, run locally (not part of the Netlify build):
//
//   npm run build && npm run seo:snapshot && npm run build
//
// Renders every SPA route from scripts/route_list.mjs in real Chrome against the
// built dist/, with every third-party request blocked (the 2026-05-29 prerender was
// disabled because the DataTagManager pixel injected a $7 overlay into the
// snapshot; with third-party requests aborted that can't happen). For each route it
// saves the helmet-managed head tags (title, description, canonical, robots, OG,
// Twitter, JSON-LD) and the visible text of #main-content to
// scripts/route-snapshots.json. scripts/spa_routes.mjs turns that into per-route
// static HTML at build time.
//
// Re-run it after changing a page's title, description or main copy, then commit
// route-snapshots.json. A stale snapshot only affects what non-JS crawlers see.

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import puppeteer from 'puppeteer';
import { ROOT, getRoutes } from './route_list.mjs';

const DIST = path.join(ROOT, 'dist');
const OUT = path.join(ROOT, 'scripts/route-snapshots.json');
const PORT = 4199;
const ORIGIN = `http://localhost:${PORT}`;
const SITE = 'https://kenjiai.com';
const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const shellFile = fs.existsSync(path.join(DIST, 'spa-shell.html')) ? 'spa-shell.html' : 'index.html';
const TYPES = { '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };

const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, ORIGIN).pathname);
  const file = path.join(DIST, p);
  // Any extensionless path gets the untouched app shell so React renders it fresh.
  if (path.extname(p) && file.startsWith(DIST) && fs.existsSync(file) && fs.statSync(file).isFile()) {
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
    return;
  }
  if (path.extname(p)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(fs.readFileSync(path.join(DIST, shellFile)));
});
await new Promise((r) => server.listen(PORT, r));

const extract = () => {
  const head = {
    title: document.title,
    metas: [...document.head.querySelectorAll('meta[data-rh]')].map((m) => ({
      name: m.getAttribute('name') || undefined,
      property: m.getAttribute('property') || undefined,
      content: m.getAttribute('content') || '',
    })),
    canonical: document.querySelector('link[rel="canonical"][data-rh]')?.getAttribute('href') || null,
    jsonld: [...document.head.querySelectorAll('script[type="application/ld+json"][data-rh]')].map((s) => s.textContent),
  };
  const main = document.querySelector('#main-content') || document.body;
  const TAGS = 'h1,h2,h3,h4,p,li,blockquote,summary,dt,dd,figcaption,tr';
  const fixed = [...main.querySelectorAll('*')].filter((e) => getComputedStyle(e).position === 'fixed');
  const blocks = [];
  const seen = new Set();
  for (const el of main.querySelectorAll(TAGS)) {
    if (el.querySelector(TAGS)) continue;
    if (el.closest('[aria-hidden="true"],[role="status"],[role="alert"],[role="dialog"],nav,footer,button,form,label,[data-no-snapshot]')) continue;
    if (fixed.some((f) => f.contains(el))) continue;
    const st = getComputedStyle(el);
    if (st.display === 'none' || st.visibility === 'hidden') continue;
    const text = (el.innerText || '').replace(/\s+/g, ' ').trim();
    if (text.length < 2 || seen.has(text)) continue;
    seen.add(text);
    blocks.push({ tag: el.tagName.toLowerCase(), text });
  }
  const links = [];
  const seenL = new Set();
  for (const a of main.querySelectorAll('a[href]')) {
    let u;
    try { u = new URL(a.href, location.href); } catch { continue; }
    if (u.origin !== location.origin) continue;
    const t = (a.innerText || a.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim();
    if (!t || seenL.has(u.pathname)) continue;
    seenL.add(u.pathname);
    links.push({ href: u.pathname, text: t.slice(0, 100) });
  }
  return { head, blocks: blocks.slice(0, 400), links: links.slice(0, 80) };
};

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });
const { pages: allPages } = await getRoutes();
// SNAP_ONLY=/invites/ re-snapshots just the routes starting with that prefix and keeps
// every other route's existing snapshot, so one section can be refreshed on its own.
const ONLY = process.env.SNAP_ONLY || '';
const pages = ONLY ? allPages.filter((r) => r.startsWith(ONLY)) : allPages;
const prevFile = ONLY && fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : null;
const out = prevFile ? { ...prevFile.routes } : {};
const problems = [];

for (const route of pages) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  // Not "HeadlessChrome": NicheAdPage and the SW registration special-case that UA.
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 KenjiSnapshot');
  await page.setRequestInterception(true);
  page.on('request', (r) => (r.url().startsWith(ORIGIN) || r.url().startsWith('data:') ? r.continue() : r.abort()));
  try {
    await page.goto(`${ORIGIN}${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.waitForFunction(() => {
      const main = document.querySelector('#main-content');
      return main && main.innerText.trim().length > 0 && !document.querySelector('[role="status"][aria-label="Loading"]');
    }, { timeout: 15000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 1200));
    const finalPath = new URL(page.url()).pathname;
    if (finalPath !== route) { problems.push(`${route}: redirected to ${finalPath}, skipped`); continue; }
    const snap = await page.evaluate(extract);
    // Pages that build their canonical from window.location see the local origin.
    const fix = (s) => (typeof s === 'string' ? s.split(ORIGIN).join(SITE) : s);
    snap.head.title = fix(snap.head.title);
    snap.head.canonical = fix(snap.head.canonical);
    snap.head.metas = snap.head.metas.map((m) => ({ ...m, content: fix(m.content) }));
    snap.head.jsonld = snap.head.jsonld.map(fix);
    if (!snap.blocks.length) problems.push(`${route}: no text captured`);
    out[route] = snap;
  } catch (e) {
    problems.push(`${route}: ${e.message.split('\n')[0]}`);
  } finally {
    await page.close();
  }
}

await browser.close();
server.close();

const sorted = Object.fromEntries(Object.keys(out).sort().map((k) => [k, out[k]]));
fs.writeFileSync(OUT, `${JSON.stringify({ note: 'Generated by scripts/snapshot_routes.mjs. Do not edit by hand.', generated: prevFile?.generated || new Date().toISOString().slice(0, 10), routes: sorted }, null, 1)}\n`);
console.log(`snapshot_routes: ${pages.length} route(s) snapshotted${ONLY ? ` (SNAP_ONLY=${ONLY})` : ''}, ${Object.keys(out).length} total saved to ${path.relative(ROOT, OUT)}`);
for (const p of problems) console.log(`  ! ${p}`);
