// Single source of truth for "which URLs are real pages" on kenjiai.com.
//
// Netlify no longer has a blanket `/* -> /index.html 200` fallback (that made every
// junk URL a soft 404). Instead every real SPA route gets its own HTML file in dist/
// (written by scripts/spa_routes.mjs) and anything else gets public/404.html with a
// real 404 status. This module works out the route list straight from the code, so a
// route added to src/App.tsx is picked up automatically on the next build:
//
//   - every <Route path="..."> in src/App.tsx
//   - /paid-ads-for/:niche expanded from src/data/niches.ts
//   - /blog/:slug is NOT listed here: blog_static.mjs / podcast_static.mjs write one
//     file per real article, so unknown slugs 404 on their own
//   - <Navigate> routes and RedirectSystem's redirectMap become server 301s
//   - paths owned by public/_redirects or a public/<dir>/index.html static page are
//     left alone (those are served as-is)
//   - routes with an unenumerable param (/invites/e/:id, /i/:code) get a scoped
//     rewrite for that prefix only

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function loadTs(rel) {
  const tmp = path.join(os.tmpdir(), `kenji-${path.basename(rel, '.ts')}-${process.pid}-${Date.now()}.mjs`);
  await build({ entryPoints: [path.join(ROOT, rel)], bundle: true, platform: 'node', format: 'esm', outfile: tmp, logLevel: 'error' });
  try {
    return await import(pathToFileURL(tmp).href);
  } finally {
    fs.rmSync(tmp, { force: true });
  }
}

/** Sources of public/_redirects rules, normalised without a trailing slash. */
export function redirectSources() {
  const file = path.join(ROOT, 'public/_redirects');
  const out = new Set();
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const from = t.split(/\s+/)[0];
    out.add(from.length > 1 ? from.replace(/\/+$/, '') : from);
  }
  return out;
}

/** Top-level folders in public/ that ship their own index.html (static funnel pages). */
export function staticFolders() {
  const pub = path.join(ROOT, 'public');
  return new Set(
    fs.readdirSync(pub, { withFileTypes: true })
      .filter((d) => d.isDirectory() && fs.existsSync(path.join(pub, d.name, 'index.html')))
      .map((d) => `/${d.name}`),
  );
}

export async function getRoutes() {
  const app = fs.readFileSync(path.join(ROOT, 'src/App.tsx'), 'utf8');
  const routeRe = /<Route\s+path="([^"]+)"\s+element=\{<(\w+)([^}]*)\}/g;
  const raw = [];
  for (const m of app.matchAll(routeRe)) {
    const [, p, comp, rest] = m;
    const nav = comp === 'Navigate' ? /to="([^"]+)"/.exec(rest)?.[1] : undefined;
    raw.push({ path: p, component: comp, navigateTo: nav });
  }
  if (raw.length < 20) throw new Error(`route_list: only found ${raw.length} routes in App.tsx, parser is out of date`);

  // RedirectSystem.tsx redirects these client-side; serve them as real 301s instead.
  const rs = fs.readFileSync(path.join(ROOT, 'src/components/RedirectSystem.tsx'), 'utf8');
  const mapBody = /redirectMap[^=]*=\s*\{([\s\S]*?)\};/.exec(rs)?.[1] || '';
  const redirectMap = new Map([...mapBody.matchAll(/'([^']+)':\s*'([^']+)'/g)].map((m) => [m[1], m[2]]));

  const { default: niches } = await loadTs('src/data/niches.ts');
  const owned = new Set([...redirectSources(), ...staticFolders()]);

  const pages = [];       // real pages that need dist/<path>.html
  const redirects = [];   // [from, to]
  const prefixes = new Set(); // dynamic prefixes that need a scoped SPA rewrite
  const skipped = [];

  for (const r of raw) {
    if (r.path === '*') continue;
    if (r.navigateTo) { redirects.push([r.path, r.navigateTo]); continue; }
    if (redirectMap.has(r.path)) continue; // handled below
    if (r.path === '/paid-ads-for/:niche') {
      for (const n of niches) pages.push(`/paid-ads-for/${n.slug}`);
      continue;
    }
    if (r.path === '/blog/:slug' || r.path === '/blog' || r.path === '/podcast') { skipped.push(`${r.path} (blog_static/podcast_static)`); continue; }
    if (r.path.includes(':')) {
      const prefix = r.path.slice(0, r.path.indexOf(':'));
      if (owned.has(prefix.replace(/\/+$/, '')) || [...owned].some((o) => o.endsWith('/*') && prefix.startsWith(o.slice(0, -1)))) {
        skipped.push(`${r.path} (public/_redirects)`);
      } else {
        prefixes.add(prefix);
      }
      continue;
    }
    if (owned.has(r.path)) { skipped.push(`${r.path} (static page)`); continue; }
    pages.push(r.path);
  }
  for (const [from, to] of redirectMap) redirects.push([from, to]);

  return { pages: [...new Set(pages)], redirects, prefixes: [...prefixes], skipped };
}
