const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'data', 'backlinks.json');
const PUBLIC_STATUS_FILE = path.join(ROOT_DIR, 'public', 'backlinks-status.json');

function loadRegistry() {
  if (!fs.existsSync(DATA_FILE)) {
    console.error(`Registry file not found at: ${DATA_FILE}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

function saveRegistry(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function savePublicStatus(summary) {
  fs.writeFileSync(PUBLIC_STATUS_FILE, JSON.stringify(summary, null, 2), 'utf8');
}

function getWeekOfMonth() {
  const day = new Date().getDate();
  if (day <= 7) return 1;
  if (day <= 14) return 2;
  if (day <= 21) return 3;
  return 4;
}

function generateReport(data) {
  const items = data.backlinks || [];
  const total = items.length;
  const live = items.filter(i => i.status === 'live');
  const submitted = items.filter(i => i.status === 'submitted');
  const planned = items.filter(i => i.status === 'planned');

  const da80Plus = items.filter(i => i.da >= 80).length;
  const dofollow = items.filter(i => i.linkType === 'dofollow').length;
  const nofollow = items.filter(i => i.linkType === 'nofollow').length;
  const entity = items.filter(i => i.linkType === 'entity_citation').length;

  const avgDA = Math.round(items.reduce((acc, i) => acc + (i.da || 0), 0) / (total || 1));

  console.log('\n======================================================');
  console.log('       KENJIAI BACKLINK ACQUISITION & STATUS REPORT    ');
  console.log('======================================================');
  console.log(`Target Domain:             ${data.targetDomain}`);
  console.log(`Main Conversion Offer:     ${data.mainOfferUrl}`);
  console.log('------------------------------------------------------');
  console.log(`Total Opportunities in Pipeline: ${total}`);
  console.log(`  🟢 Live Backlinks:             ${live.length}`);
  console.log(`  🟡 Pending / In Review:        ${submitted.length}`);
  console.log(`  ⚪ Planned / In Rotation:      ${planned.length}`);
  console.log('------------------------------------------------------');
  console.log(`Average Domain Authority (DA):   ${avgDA}`);
  console.log(`Tier-1 High Authority (DA 80+):  ${da80Plus} (${Math.round((da80Plus/total)*100)}%)`);
  console.log(`Dofollow Target Ratio:           ${dofollow} (${Math.round((dofollow/total)*100)}%)`);
  console.log(`Nofollow / Citation Ratio:       ${nofollow + entity} (${Math.round(((nofollow + entity)/total)*100)}%)`);
  console.log('======================================================\n');

  console.log('--- WEEKLY BATCH BREAKDOWN ---');
  for (let w = 1; w <= 4; w++) {
    const batch = items.filter(i => i.weekBatch === w);
    const liveBatch = batch.filter(i => i.status === 'live').length;
    console.log(`[Week ${w} Batch] ${batch.length} targets (${liveBatch} live)`);
    batch.forEach(b => {
      const statusIcon = b.status === 'live' ? '🟢' : b.status === 'submitted' ? '🟡' : '⚪';
      console.log(`   ${statusIcon} [DA ${b.da}] ${b.name} (${b.category}) -> ${b.anchorText}`);
    });
  }
  console.log('\n');

  const summary = {
    lastGenerated: new Date().toISOString(),
    totalPipeline: total,
    liveCount: live.length,
    submittedCount: submitted.length,
    plannedCount: planned.length,
    averageDA: avgDA,
    tier1Count: da80Plus,
    dofollowCount: dofollow,
    nofollowAndCitationCount: nofollow + entity,
    currentWeekBatch: getWeekOfMonth()
  };

  savePublicStatus(summary);
  return summary;
}

function showWeeklyAction(data, targetWeek) {
  const week = targetWeek || getWeekOfMonth();
  const items = (data.backlinks || []).filter(i => i.weekBatch === week);

  console.log('\n======================================================');
  console.log(`   WEEK ${week} ACTION PLAN: HIGH-IMPACT BACKLINK SUBMISSIONS`);
  console.log('======================================================');
  console.log(`Executing consistent backlinks prevents spam velocity warnings and`);
  console.log(`steadily compounds Google search rankings and LLM knowledge authority.\n`);

  items.forEach((item, idx) => {
    console.log(`------------------------------------------------------`);
    console.log(`[TARGET #${idx + 1}] ${item.name.toUpperCase()} (DA ${item.da})`);
    console.log(`------------------------------------------------------`);
    console.log(`🔗 Submission URL: ${item.submissionUrl}`);
    console.log(`🎯 Target URL:     ${item.targetUrl}`);
    console.log(`⚓ Recommended Anchor: "${item.anchorText}"`);
    console.log(`🏷️ Link Type:      ${item.linkType.toUpperCase()}`);
    console.log(`📌 Title:          ${item.submissionKit.title}`);
    console.log(`💬 Tagline:        ${item.submissionKit.tagline}`);
    console.log(`📝 Short Summary:  ${item.submissionKit.shortDesc}`);
    console.log(`📚 Full Detail:    ${item.submissionKit.fullDesc}`);
    console.log(`🏷️ Tags:           ${item.submissionKit.tags.join(', ')}`);
    console.log(`\n👉 Action: Open ${item.submissionUrl} and paste the above kit.\n`);
  });
}

async function verifyUrl(targetUrl, expectedDomain) {
  return new Promise((resolve) => {
    try {
      const client = targetUrl.startsWith('https') ? https : http;
      const req = client.get(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        timeout: 10000
      }, (res) => {
        let body = '';
        res.on('data', chunk => {
          body += chunk;
          // limit to 500KB
          if (body.length > 500000) {
            res.destroy();
          }
        });
        res.on('end', () => {
          const hasLink = body.includes(expectedDomain || 'kenjiai.com');
          const isNofollow = /rel=["'][^"']*nofollow[^"']*["']/i.test(body);
          resolve({
            statusCode: res.statusCode,
            hasLink,
            isNofollow,
            error: null
          });
        });
      });

      req.on('error', (err) => {
        resolve({ statusCode: 0, hasLink: false, isNofollow: false, error: err.message });
      });
      req.on('timeout', () => {
        req.destroy();
        resolve({ statusCode: 0, hasLink: false, isNofollow: false, error: 'Request timed out' });
      });
    } catch (e) {
      resolve({ statusCode: 0, hasLink: false, isNofollow: false, error: e.message });
    }
  });
}

async function checkLiveBacklinks(data) {
  const liveItems = (data.backlinks || []).filter(i => i.status === 'live' && i.liveUrl);

  console.log('\n======================================================');
  console.log('          CHECKING VERIFIED LIVE BACKLINKS            ');
  console.log('======================================================');

  if (liveItems.length === 0) {
    console.log('ℹ️ No live URLs recorded yet. Ready to submit Week 1 targets!');
    console.log('Run "npm run backlinks:weekly" to view this week\'s submission kits.\n');
    return;
  }

  for (const item of liveItems) {
    process.stdout.write(`Checking ${item.name} (${item.liveUrl})... `);
    const result = await verifyUrl(item.liveUrl, 'kenjiai.com');
    if (result.statusCode === 200 && result.hasLink) {
      console.log(`🟢 OK (Status 200, Link Verified, ${result.isNofollow ? 'Nofollow' : 'Dofollow'})`);
      item.lastVerified = new Date().toISOString();
      item.verifiedLinkType = result.isNofollow ? 'nofollow' : 'dofollow';
    } else if (result.statusCode === 200 && !result.hasLink) {
      console.log(`⚠️ Status 200, but "kenjiai.com" not detected in HTML`);
    } else {
      console.log(`❌ Failed (Status: ${result.statusCode}, Error: ${result.error || 'None'})`);
    }
  }

  saveRegistry(data);
  generateReport(data);
}

// CLI Routing
const command = process.argv[2] || 'report';
const registry = loadRegistry();

if (command === 'report') {
  generateReport(registry);
} else if (command === 'weekly') {
  const argWeek = parseInt(process.argv[3], 10);
  showWeeklyAction(registry, isNaN(argWeek) ? null : argWeek);
} else if (command === 'check') {
  checkLiveBacklinks(registry);
} else {
  console.log('Usage: node scripts/backlink_manager.cjs [report | weekly <week_num> | check]');
}
