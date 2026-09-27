/**
 * Runtime (rendered-DOM) SEO audit.
 *
 * scripts/seo_audit.cjs only reads raw .html source, so it is blind to every
 * React Router route whose <title>/description/canonical/OG/JSON-LD are injected
 * at runtime by react-helmet-async via src/components/SEOHead.tsx. That is ~60 of
 * the 75 URLs in public/sitemap.xml. This script renders each real route in a
 * headless browser against production and audits the DOM a crawler actually sees.
 *
 * Two things this catches that the static scanner structurally cannot:
 *   1. A page that never passed its own props to SEOHead silently inherits the
 *      hardcoded default title/description. An exact match is a real bug signal.
 *   2. index.html ships its own canonical/description/og tags. react-helmet-async
 *      only removes tags it owns (data-rh="true"), so the static ones survive and
 *      the route ends up serving duplicate, conflicting head tags.
 *
 * Because of (2), every tag lookup here prefers the helmet-owned (data-rh) tag as
 * the route's real intent, and reports the leftover shell duplicates separately.
 * Readings are only taken after helmet has flushed, otherwise a slow lazy chunk
 * looks exactly like a page with no SEO props at all.
 *
 * Additive only — does not touch seo_audit.cjs or public/seo-audit-report.json.
 *
 * Usage: npm run seo:audit:runtime
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT_DIR = path.resolve(__dirname, '..');
const BASE_URL = process.env.SEO_AUDIT_BASE_URL || 'https://kenjiai.com';
const THIN_CONTENT_WORDS = 300;
const CONCURRENCY = 3;
const NAV_TIMEOUT_MS = 45000;
const HELMET_TIMEOUT_MS = 25000;
// react-helmet-async can flush in more than one pass (SEOHead plus nested Helmet
// instances), so a single "tags exist" check reads a half-built head and reports
// a page as having no SEO props. Readings are only taken once the head has gone
// unchanged for several consecutive samples.
// SEOHead always emits a canonical, so a helmet-owned <link rel="canonical">
// appearing is the exact signal that this route's SEO props have flushed. Routes
// that genuinely emit none (a real bug) pay the full wait before being judged.
const SEO_FLUSH_TIMEOUT_MS = 14000;
const SETTLE_INTERVAL_MS = 500;
const SETTLE_STABLE_SAMPLES = 3;
const SETTLE_MIN_MS = 1500;
const SETTLE_MAX_MS = 8000;

// Routes that exist in App.tsx but are not indexable targets of their own.
const SKIP_ROUTES = {
  '*': 'router catchall (404 handler), not an indexable route',
  '/tools': 'client-side <Navigate> redirect to /free-tools',
  '/call-center-upgrade': 'redirects to static /call-center-upgrade/index.html (covered by seo_audit.cjs)'
};

// The home page legitimately owns the SEOHead default title, so an exact match
// there is correct rather than a missing-props bug.
const DEFAULT_TITLE_OWNER = '/';

const NOT_FOUND_TITLE = 'Page Not Found | KenjiAI';

// ---------------------------------------------------------------------------
// Discover what to audit from the real source files, so the list never drifts.
// ---------------------------------------------------------------------------

function readSeoHeadDefaults() {
  const src = fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'SEOHead.tsx'), 'utf8');
  const titleMatch = src.match(/title\s*=\s*"([^"]+)"/);
  const descMatch = src.match(/description\s*=\s*"([^"]+)"/);
  if (!titleMatch || !descMatch) {
    throw new Error('Could not parse default title/description out of SEOHead.tsx');
  }
  return { title: titleMatch[1], description: descMatch[1] };
}

function readAppRoutes() {
  const src = fs.readFileSync(path.join(ROOT_DIR, 'src', 'App.tsx'), 'utf8');
  return [...new Set([...src.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]))];
}

function readSlugs(relFile, indent) {
  const src = fs.readFileSync(path.join(ROOT_DIR, relFile), 'utf8');
  const re = new RegExp(`^${indent}slug: '([^']+)'`, 'gm');
  return [...src.matchAll(re)].map((m) => m[1]);
}

function buildRouteList() {
  const skipped = [];
  const routes = [];

  for (const route of readAppRoutes()) {
    if (SKIP_ROUTES[route]) {
      skipped.push({ route, reason: SKIP_ROUTES[route] });
      continue;
    }
    if (route.includes(':')) continue; // sampled below
    routes.push(route);
  }

  // Sample real slugs from the data sources that actually drive the dynamic routes.
  for (const slug of readSlugs('src/data/articles.ts', '  ').slice(0, 3)) {
    routes.push(`/blog/${slug}`);
  }
  for (const slug of readSlugs('src/data/niches.ts', '    ').slice(0, 3)) {
    routes.push(`/paid-ads-for/${slug}`);
  }

  return { routes, skipped };
}

// ---------------------------------------------------------------------------
// DOM extraction (runs inside the page)
// ---------------------------------------------------------------------------

function extractFromDom() {
  // Prefer the react-helmet-async-owned tag (data-rh="true") as the route's real
  // intent; fall back to the static index.html tag when the route sets none.
  const pick = (sel, attr) => {
    const all = [...document.querySelectorAll(sel)];
    const owned = all.find((el) => el.getAttribute('data-rh') === 'true');
    const el = owned || all[0];
    return {
      value: el ? (el.getAttribute(attr) || '').trim() : null,
      count: all.length,
      helmetOwned: !!owned
    };
  };

  const canonical = pick('link[rel="canonical"]', 'href');
  const description = pick('meta[name="description"]', 'content');
  const robots = pick('meta[name="robots"]', 'content');
  const og = {
    'og:title': pick('meta[property="og:title"]', 'content'),
    'og:description': pick('meta[property="og:description"]', 'content'),
    'og:image': pick('meta[property="og:image"]', 'content'),
    'og:url': pick('meta[property="og:url"]', 'content')
  };

  const main = document.querySelector('main#main-content');
  const text = (main ? main.innerText : document.body.innerText) || '';

  const duplicated = [];
  if (canonical.count > 1) duplicated.push(`canonical x${canonical.count}`);
  if (description.count > 1) duplicated.push(`meta description x${description.count}`);
  for (const [k, v] of Object.entries(og)) {
    if (v.count > 1) duplicated.push(`${k} x${v.count}`);
  }

  return {
    finalUrl: window.location.href,
    isSpaShell: !!document.querySelector('#root'),
    helmetFlushed: !!document.querySelector('[data-rh="true"]'),
    title: (document.title || '').trim(),
    canonical: canonical.value,
    canonicalHelmetOwned: canonical.helmetOwned,
    description: description.value,
    robots: robots.value,
    og: Object.fromEntries(Object.entries(og).map(([k, v]) => [k, v.value])),
    duplicatedHeadTags: duplicated,
    jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map(
      (el) => el.textContent || ''
    ),
    h1Count: document.querySelectorAll('h1').length,
    wordCount: text.split(/\s+/).filter(Boolean).length
  };
}

// Ready when the route has actually mounted AND helmet has flushed its head
// tags. Without the helmet gate, a slow lazy chunk reads as "page sets no SEO
// props", which is a false bug report.
function domIsReady() {
  if (!document.querySelector('#root')) return true; // server-served static HTML
  const main = document.querySelector('main#main-content');
  if (!main || (main.innerText || '').trim().length < 150) return false;
  return !!document.querySelector('[data-rh="true"]');
}

function headSignature() {
  const canonical = document.querySelector('link[rel="canonical"][data-rh="true"]');
  return JSON.stringify([
    document.title,
    document.querySelectorAll('[data-rh]').length,
    canonical ? canonical.getAttribute('href') : ''
  ]);
}

async function waitForHeadToSettle(page) {
  const started = Date.now();
  let previous = null;
  let stable = 0;

  while (Date.now() - started < SETTLE_MAX_MS) {
    const signature = await page.evaluate(headSignature).catch(() => null);
    if (signature !== null && signature === previous) {
      stable += 1;
      if (stable >= SETTLE_STABLE_SAMPLES && Date.now() - started >= SETTLE_MIN_MS) return;
    } else {
      stable = 0;
      previous = signature;
    }
    await new Promise((r) => setTimeout(r, SETTLE_INTERVAL_MS));
  }
}

// ---------------------------------------------------------------------------
// Per-route audit
// ---------------------------------------------------------------------------

async function auditRoute(browser, route, defaults) {
  const expectedUrl = `${BASE_URL}${route}`;
  const report = {
    route,
    url: expectedUrl,
    httpStatus: null,
    classification: 'audited',
    score: 100,
    penalties: [],
    details: {}
  };
  const page = await browser.newPage();

  try {
    await page.setViewport({ width: 1280, height: 900 });
    await page.setUserAgent(
      'Mozilla/5.0 (compatible; KenjiAI-SEO-Runtime-Audit/1.0; +https://kenjiai.com)'
    );

    const response = await page.goto(expectedUrl, {
      waitUntil: 'networkidle2',
      timeout: NAV_TIMEOUT_MS
    });
    report.httpStatus = response ? response.status() : null;

    await page.waitForFunction(domIsReady, { timeout: HELMET_TIMEOUT_MS }).catch(() => {});
    await page
      .waitForSelector('link[rel="canonical"][data-rh="true"]', { timeout: SEO_FLUSH_TIMEOUT_MS })
      .catch(() => {});
    await waitForHeadToSettle(page);

    const dom = await page.evaluate(extractFromDom);
    const isNoIndex = /noindex/i.test(dom.robots || '');

    report.details = {
      title: dom.title,
      description: dom.description,
      canonical: dom.canonical,
      canonicalExpected: expectedUrl,
      canonicalHelmetOwned: dom.canonicalHelmetOwned,
      robots: dom.robots,
      isNoIndex,
      helmetFlushed: dom.helmetFlushed,
      duplicatedHeadTags: dom.duplicatedHeadTags,
      wordCount: dom.wordCount,
      h1Count: dom.h1Count,
      jsonLdTypes: [],
      usingFallbackTitle: false,
      usingFallbackDescription: false
    };

    // A route that redirects away is not a page of ours to score, but it IS the
    // finding. Off-domain matters when the URL sits in sitemap.xml; on-domain
    // means the route is unreachable — typically because it is missing from
    // routeConfig.ts, so RedirectSystem bounces it to /not-found, whose
    // NotFoundPage then forwards to /pricing after 5s.
    const finalUrl = new URL(dom.finalUrl);
    const trimSlash = (p) => p.replace(/\/+$/, '') || '/';
    if (finalUrl.host !== new URL(BASE_URL).host) {
      report.classification = 'external-redirect';
      report.details.redirectedTo = dom.finalUrl;
      return report;
    }
    if (trimSlash(finalUrl.pathname) !== trimSlash(route)) {
      report.classification = 'internal-redirect';
      report.details.redirectedTo = finalUrl.pathname;
      report.details.landedOnTitle = dom.title;
      return report;
    }

    if (isNoIndex) report.classification = 'noindex';

    if (report.httpStatus && report.httpStatus >= 400) {
      report.score -= 40;
      report.penalties.push(`HTTP ${report.httpStatus} returned for route (-40)`);
    }

    if (dom.title === NOT_FOUND_TITLE) {
      report.score -= 40;
      report.penalties.push(
        'Route renders the 404 NotFoundPage — path is missing from src/utils/routeConfig.ts internalRoutes (-40)'
      );
    }

    // 1. Title
    if (!dom.title) {
      report.score -= 20;
      report.penalties.push('Missing/empty <title> in rendered DOM (-20)');
    } else if (dom.title === defaults.title && route !== DEFAULT_TITLE_OWNER) {
      report.details.usingFallbackTitle = true;
      report.score -= 25;
      report.penalties.push(
        'Title is the generic SEOHead/index.html default — page sets no title of its own (-25)'
      );
    } else if (dom.title.length < 25 || dom.title.length > 75) {
      report.score -= 5;
      report.penalties.push(
        `Title length (${dom.title.length} chars) outside optimal 25-75 range (-5)`
      );
    }

    // 2. Meta description
    if (!dom.description) {
      if (!isNoIndex) {
        report.score -= 20;
        report.penalties.push('Missing <meta name="description"> in rendered DOM (-20)');
      }
    } else if (dom.description === defaults.description && route !== DEFAULT_TITLE_OWNER) {
      report.details.usingFallbackDescription = true;
      report.score -= 25;
      report.penalties.push(
        'Description is the generic SEOHead/index.html default — page sets none of its own (-25)'
      );
    } else if (!isNoIndex && (dom.description.length < 60 || dom.description.length > 175)) {
      report.score -= 5;
      report.penalties.push(
        `Description length (${dom.description.length} chars) outside optimal 60-175 range (-5)`
      );
    }

    // 3. Canonical
    if (!dom.canonical) {
      if (!isNoIndex) {
        report.score -= 15;
        report.penalties.push('Missing <link rel="canonical"> in rendered DOM (-15)');
      }
    } else {
      const normalize = (u) => u.replace(/\/+$/, '').toLowerCase();
      if (!isNoIndex && normalize(dom.canonical) !== normalize(expectedUrl)) {
        report.score -= 15;
        report.penalties.push(
          `Effective canonical is ${dom.canonical} but route is ${expectedUrl} — duplicate-content risk (-15)`
        );
      }
    }

    // 4. Duplicate head tags left behind by the static shell
    if (dom.duplicatedHeadTags.length > 0) {
      report.score -= 10;
      report.penalties.push(
        `Duplicate head tags served (${dom.duplicatedHeadTags.join(', ')}) — index.html tags not replaced by react-helmet-async (-10)`
      );
    }

    // 5. OpenGraph
    if (!isNoIndex) {
      const missingOg = Object.keys(dom.og).filter((k) => !dom.og[k]);
      if (missingOg.length > 0) {
        report.score -= 10;
        report.penalties.push(`Incomplete OpenGraph tags: missing ${missingOg.join(', ')} (-10)`);
      }
    }

    // 6. JSON-LD
    if (dom.jsonLd.length === 0) {
      if (!isNoIndex) {
        report.score -= 15;
        report.penalties.push('No application/ld+json structured data in rendered DOM (-15)');
      }
    } else {
      const types = [];
      for (const block of dom.jsonLd) {
        try {
          const parsed = JSON.parse(block);
          for (const node of Array.isArray(parsed) ? parsed : [parsed]) {
            if (node && node['@type']) types.push(node['@type']);
            if (node && Array.isArray(node['@graph'])) {
              for (const g of node['@graph']) if (g && g['@type']) types.push(g['@type']);
            }
          }
        } catch (e) {
          report.score -= 10;
          report.penalties.push('Invalid JSON syntax inside application/ld+json block (-10)');
        }
      }
      report.details.jsonLdTypes = [...new Set(types)];
    }

    // 7. Thin content
    if (!isNoIndex && dom.wordCount < THIN_CONTENT_WORDS) {
      report.score -= 10;
      report.penalties.push(
        `Thin content: ${dom.wordCount} visible words (under ${THIN_CONTENT_WORDS}) (-10)`
      );
    }

    // 8. H1
    if (dom.h1Count === 0) {
      report.score -= 10;
      report.penalties.push('No <h1> in rendered DOM (-10)');
    } else if (dom.h1Count > 1) {
      report.score -= 5;
      report.penalties.push(`Multiple (${dom.h1Count}) <h1> tags in rendered DOM (-5)`);
    }
  } catch (err) {
    report.classification = 'render-failed';
    report.score = 0;
    report.penalties.push(`Render failed: ${err.message}`);
  } finally {
    await page.close().catch(() => {});
  }

  report.score = Math.max(0, report.score);
  return report;
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

async function runPool(items, size, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (cursor < items.length) {
        const i = cursor++;
        results[i] = await worker(items[i], i);
      }
    })
  );
  return results;
}

function badgeFor(score) {
  if (score === 100) return '🟢 100/100 PERFECT';
  if (score >= 90) return `🟢 ${score}/100 EXCELLENT`;
  if (score >= 75) return `🟡 ${score}/100 GOOD`;
  if (score >= 50) return `🟠 ${score}/100 NEEDS WORK`;
  return `🔴 ${score}/100 BROKEN`;
}

(async () => {
  const defaults = readSeoHeadDefaults();
  const { routes, skipped } = buildRouteList();

  console.log('====================================================');
  console.log('   KENJIAI RUNTIME (RENDERED DOM) SEO AUDIT REPORT   ');
  console.log('====================================================\n');
  console.log(`Target: ${BASE_URL}`);
  console.log(`Routes to render: ${routes.length}   Skipped: ${skipped.length}`);
  console.log(`SEOHead default-title guard: "${defaults.title}"\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });

  let all;
  try {
    all = await runPool(routes, CONCURRENCY, async (route, i) => {
      const res = await auditRoute(browser, route, defaults);
      const tag = res.classification === 'audited' ? `${res.score}/100` : res.classification;
      console.log(`  [${i + 1}/${routes.length}] rendered ${route} -> ${tag}`);
      return res;
    });
  } finally {
    await browser.close().catch(() => {});
  }

  const scored = all.filter((p) => p.classification === 'audited' || p.classification === 'noindex');
  const external = all.filter((p) => p.classification === 'external-redirect');
  const internal = all.filter((p) => p.classification === 'internal-redirect');

  console.log('\n--- 1. RENDERED ROUTE RESULTS ---\n');
  for (const res of [...scored].sort((a, b) => a.score - b.score)) {
    const label = res.details.isNoIndex ? `${badgeFor(res.score)} 🔒 NOINDEX` : badgeFor(res.score);
    console.log(`[${label}] ${res.route}`);
    for (const p of res.penalties) console.log(`    ⚠️  ${p}`);
    if (res.details.title) console.log(`    📌 Title: "${res.details.title}"`);
    if (res.details.canonical) {
      console.log(
        `    🔗 Canonical: ${res.details.canonical}${res.details.canonicalHelmetOwned ? '' : ' (from static shell, route set none)'}`
      );
    }
    if (res.details.jsonLdTypes && res.details.jsonLdTypes.length > 0) {
      console.log(`    📊 Schema Types: ${res.details.jsonLdTypes.join(', ')}`);
    }
    console.log(`    📝 Visible words: ${res.details.wordCount}`);
    console.log('');
  }

  console.log('--- 2. ROUTES THAT REDIRECT AWAY (not scored) ---\n');
  if (external.length === 0 && internal.length === 0) console.log('None.');
  for (const res of external) {
    console.log(`[🔀 OFF-DOMAIN] ${res.route} -> ${res.details.redirectedTo}`);
  }
  for (const res of internal) {
    console.log(
      `[🚧 UNREACHABLE] ${res.route} -> bounced to ${res.details.redirectedTo} ("${res.details.landedOnTitle}") — check src/utils/routeConfig.ts internalRoutes`
    );
  }
  console.log('');

  console.log('--- 3. SKIPPED ROUTES (not indexable targets) ---\n');
  for (const s of skipped) console.log(`[⏭️  SKIPPED] ${s.route} — ${s.reason}`);
  console.log('');

  const indexable = scored.filter((p) => !p.details.isNoIndex);
  const has = (p, prefix) => p.penalties.some((x) => x.startsWith(prefix));
  const fallbackTitle = scored.filter((p) => p.details.usingFallbackTitle);
  const fallbackDesc = scored.filter((p) => p.details.usingFallbackDescription);
  const badCanonical = scored.filter((p) => has(p, 'Effective canonical is'));
  const dupTags = scored.filter((p) => has(p, 'Duplicate head tags served'));
  const thin = scored.filter((p) => has(p, 'Thin content'));
  const notFound = scored.filter((p) => has(p, 'Route renders the 404'));

  const list = (arr) => (arr.length ? ' -> ' + arr.map((p) => p.route).join(', ') : '');

  console.log('--- 4. REAL BUG SIGNALS ---\n');
  console.log(`🚧 Unreachable routes (bounced elsewhere):          ${internal.length}${list(internal)}`);
  console.log(`🚨 Routes rendering the 404 page:                   ${notFound.length}${list(notFound)}`);
  console.log(`🚨 Routes serving the generic fallback title:       ${fallbackTitle.length}${list(fallbackTitle)}`);
  console.log(`🚨 Routes serving the generic fallback description: ${fallbackDesc.length}${list(fallbackDesc)}`);
  console.log(`🚨 Routes with a wrong effective canonical:         ${badCanonical.length}${list(badCanonical)}`);
  console.log(`🔁 Routes serving duplicate head tags:             ${dupTags.length}/${scored.length}`);
  console.log(`📝 Indexable routes under ${THIN_CONTENT_WORDS} visible words:      ${thin.length}${list(thin)}`);
  console.log(`🔀 Routes redirecting off-domain:                  ${external.length}${list(external)}`);
  console.log('');

  const runtimeScore = scored.length
    ? Math.round(scored.reduce((s, p) => s + p.score, 0) / scored.length)
    : 0;
  const indexableScore = indexable.length
    ? Math.round(indexable.reduce((s, p) => s + p.score, 0) / indexable.length)
    : 0;
  const perfect = scored.filter((p) => p.score === 100).length;

  console.log('====================================================');
  console.log(`ROUTES RENDERED & SCORED:         ${scored.length}`);
  console.log(`PERFECT (100/100) ROUTES:         ${perfect}/${scored.length}`);
  console.log(`INDEXABLE ROUTES ONLY:            ${indexableScore}/100`);
  console.log(`----------------------------------------------------`);
  console.log(`RUNTIME SEO RATING:               ${runtimeScore}/100`);
  console.log('====================================================\n');

  const reportData = {
    timestamp: new Date().toISOString(),
    mode: 'runtime-rendered-dom',
    target: BASE_URL,
    runtimeScore,
    indexableScore,
    routesScored: scored.length,
    perfectRoutes: perfect,
    thinContentThreshold: THIN_CONTENT_WORDS,
    seoHeadDefaults: defaults,
    summary: {
      notFoundRoutes: notFound.map((p) => p.route),
      fallbackTitleRoutes: fallbackTitle.map((p) => p.route),
      fallbackDescriptionRoutes: fallbackDesc.map((p) => p.route),
      wrongCanonicalRoutes: badCanonical.map((p) => p.route),
      duplicateHeadTagRoutes: dupTags.map((p) => p.route),
      thinContentRoutes: thin.map((p) => p.route),
      externalRedirectRoutes: external.map((p) => ({ route: p.route, to: p.details.redirectedTo })),
      unreachableRoutes: internal.map((p) => ({ route: p.route, bouncedTo: p.details.redirectedTo }))
    },
    pages: all,
    skippedRoutes: skipped
  };
  fs.writeFileSync(
    path.join(ROOT_DIR, 'public', 'seo-audit-runtime-report.json'),
    JSON.stringify(reportData, null, 2)
  );
  console.log('Saved machine-readable report to public/seo-audit-runtime-report.json');
})().catch((err) => {
  console.error('Runtime SEO audit failed:', err);
  process.exit(1);
});
