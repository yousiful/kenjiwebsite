const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

function findHtmlFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = [
  path.join(ROOT_DIR, 'index.html'),
  ...findHtmlFiles(PUBLIC_DIR)
];

const publicReports = [];
const privateReports = [];

for (const file of htmlFiles) {
  const relPath = path.relative(ROOT_DIR, file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf8');
  const isNoIndex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(content) ||
                    /<meta[^>]+content=["'][^"']*noindex[^"']*["'][^>]+name=["']robots["']/i.test(content);

  const pageReport = {
    file: relPath,
    isNoIndex,
    score: 100,
    penalties: [],
    details: {}
  };

  // 1. Title Check
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  if (!titleMatch) {
    pageReport.score -= 20;
    pageReport.penalties.push('Missing <title> tag (-20)');
  } else {
    const title = titleMatch[1].trim();
    pageReport.details.title = title;
    if (title.length < 25 || title.length > 75) {
      pageReport.score -= 5;
      pageReport.penalties.push(`Title length (${title.length} chars) outside optimal 25-75 range (-5)`);
    }
  }

  // 2. Meta Description Check (Only required for indexable pages)
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) ||
                    content.match(/<meta\s+content=["']([^"']+)["']\s+name=["']description["']/i);
  if (!descMatch) {
    if (!isNoIndex) {
      pageReport.score -= 20;
      pageReport.penalties.push('Missing <meta name="description"> tag (-20)');
    }
  } else {
    const desc = descMatch[1].trim();
    pageReport.details.description = desc;
    if (!isNoIndex && (desc.length < 60 || desc.length > 175)) {
      pageReport.score -= 5;
      pageReport.penalties.push(`Description length (${desc.length} chars) outside optimal 60-175 range (-5)`);
    }
  }

  // 3. Canonical Check (Only required for indexable pages)
  const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i) ||
                         content.match(/<link\s+href=["']([^"']+)["']\s+rel=["']canonical["']/i);
  if (!canonicalMatch) {
    if (!isNoIndex) {
      pageReport.score -= 15;
      pageReport.penalties.push('Missing canonical <link rel="canonical"> tag (-15)');
    }
  } else {
    pageReport.details.canonical = canonicalMatch[1];
  }

  // 4. OpenGraph Check (Only required for indexable pages)
  if (!isNoIndex) {
    const ogTitle = content.match(/property=["']og:title["']/i);
    const ogDesc = content.match(/property=["']og:description["']/i);
    const ogImage = content.match(/property=["']og:image["']/i);
    const ogUrl = content.match(/property=["']og:url["']/i);

    if (!ogTitle || !ogDesc || !ogImage || !ogUrl) {
      const missing = [];
      if (!ogTitle) missing.push('og:title');
      if (!ogDesc) missing.push('og:description');
      if (!ogImage) missing.push('og:image');
      if (!ogUrl) missing.push('og:url');
      pageReport.score -= 10;
      pageReport.penalties.push(`Incomplete OpenGraph tags: missing ${missing.join(', ')} (-10)`);
    }
  }

  // 5. Schema / JSON-LD Check (Only required for indexable pages)
  const jsonLdBlocks = [...content.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
  if (jsonLdBlocks.length === 0) {
    if (!isNoIndex) {
      pageReport.score -= 15;
      pageReport.penalties.push('No JSON-LD structured data detected (-15)');
    }
  } else {
    let validJsonLdCount = 0;
    const typesFound = [];
    for (const block of jsonLdBlocks) {
      try {
        const parsed = JSON.parse(block[1]);
        validJsonLdCount++;
        if (parsed['@type']) typesFound.push(parsed['@type']);
      } catch (e) {
        pageReport.score -= 10;
        pageReport.penalties.push('Invalid JSON syntax inside application/ld+json block (-10)');
      }
    }
    pageReport.details.jsonLdTypes = typesFound;
  }

  // 6. Heading hierarchy check (H1)
  const h1Matches = [...content.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
  if (h1Matches.length === 0) {
    if (relPath !== 'index.html' && !content.includes('root') && !isNoIndex) {
      pageReport.score -= 10;
      pageReport.penalties.push('Missing <h1> tag (-10)');
    }
  } else if (h1Matches.length > 1) {
    pageReport.score -= 5;
    pageReport.penalties.push(`Multiple (${h1Matches.length}) <h1> tags found (-5)`);
  }

  // 7. Image alt tag check (Applies to all pages for accessibility & compliance)
  const imgMatches = [...content.matchAll(/<img\b(?=[^>]*\bsrc=)(?![^>]*\balt=)[^>]*>/gi)];
  if (imgMatches.length > 0) {
    pageReport.score -= 5;
    pageReport.penalties.push(`${imgMatches.length} image(s) missing alt attribute (-5)`);
  }

  pageReport.score = Math.max(0, pageReport.score);
  if (isNoIndex) {
    privateReports.push(pageReport);
  } else {
    publicReports.push(pageReport);
  }
}

// Global Checks: Robots, Sitemap, LLMs
let globalScore = 100;
const globalChecks = [];

const robotsPath = path.join(PUBLIC_DIR, 'robots.txt');
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  if (robots.includes('Sitemap:') && robots.includes('GPTBot')) {
    globalChecks.push('robots.txt configured with AI bots and sitemap pointer [PASS]');
  } else {
    globalScore -= 10;
    globalChecks.push('robots.txt missing sitemap or AI crawler directives [WARN]');
  }
} else {
  globalScore -= 25;
  globalChecks.push('Missing robots.txt [FAIL]');
}

const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
let urlCount = 0;
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  urlCount = (sitemap.match(/<loc>/g) || []).length;
  globalChecks.push(`sitemap.xml active with ${urlCount} indexed URLs [PASS]`);
} else {
  globalScore -= 25;
  globalChecks.push('Missing sitemap.xml [FAIL]');
}

const llmsTxtPath = path.join(PUBLIC_DIR, 'llms.txt');
const llmsFullTxtPath = path.join(PUBLIC_DIR, 'llms-full.txt');
const aiKnowledgePath = path.join(PUBLIC_DIR, 'ai-knowledge.json');

if (fs.existsSync(llmsTxtPath) && fs.existsSync(llmsFullTxtPath) && fs.existsSync(aiKnowledgePath)) {
  globalChecks.push('AEO & LLM Engine Files (llms.txt, llms-full.txt, ai-knowledge.json) verified [PASS]');
} else {
  globalScore -= 15;
  globalChecks.push('Incomplete AI knowledge specification files [WARN]');
}

console.log('====================================================');
console.log('      KENJIAI SEARCH & AI ENGINE AUDIT REPORT       ');
console.log('====================================================\n');

console.log('--- 1. PUBLIC INDEXABLE PAGES (Target: 100/100) ---\n');
let publicScoreSum = 0;
for (const res of publicReports) {
  publicScoreSum += res.score;
  const badge = res.score === 100 ? '🟢 100/100 PERFECT' : res.score >= 90 ? '🟢 ' + res.score + '/100 EXCELLENT' : '🟡 ' + res.score + '/100 GOOD';
  console.log(`[${badge}] ${res.file}`);
  if (res.penalties.length > 0) {
    for (const p of res.penalties) console.log(`    ⚠️  ${p}`);
  }
  if (res.details.title) console.log(`    📌 Title: "${res.details.title}"`);
  if (res.details.canonical) console.log(`    🔗 Canonical: ${res.details.canonical}`);
  if (res.details.jsonLdTypes && res.details.jsonLdTypes.length > 0) {
    console.log(`    📊 Schema Types: ${res.details.jsonLdTypes.join(', ')}`);
  }
  console.log('');
}

console.log('--- 2. PRIVATE & UTILITY PAGES (noindex - Controlled Access) ---\n');
for (const res of privateReports) {
  console.log(`[🔒 NOINDEX - PROTECTED] ${res.file}`);
}
console.log('');

const avgPublicScore = Math.round(publicScoreSum / publicReports.length);
const masterSeoScore = Math.round((avgPublicScore * 0.75) + (globalScore * 0.25));

console.log('====================================================');
console.log(`PUBLIC PAGES SEO SCORE:           ${avgPublicScore}/100`);
console.log(`GLOBAL INFRASTRUCTURE SCORE:      ${globalScore}/100`);
console.log(`----------------------------------------------------`);
console.log(`MASTER SEO & AEO RATING:          ${masterSeoScore}/100`);
console.log('====================================================\n');

// Write machine-readable audit report
const reportData = {
  timestamp: new Date().toISOString(),
  masterScore: masterSeoScore,
  publicScore: avgPublicScore,
  infrastructureScore: globalScore,
  indexedUrlsCount: urlCount,
  publicPages: publicReports,
  globalChecks
};
fs.writeFileSync(path.join(ROOT_DIR, 'public', 'seo-audit-report.json'), JSON.stringify(reportData, null, 2));
console.log('Saved machine-readable report to public/seo-audit-report.json');
