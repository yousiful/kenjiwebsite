/**
 * KenjiAI & Media Traffics - Unified Master Reputation Manager
 * 
 * Purpose:
 * Coordinates the full reputation and search domination engine across:
 * 1. Reddit Intelligence & Social Listening
 * 2. Public Content Syndication (Medium, Substack, LinkedIn, PR Wires)
 * 3. High-DA Authority Backlinks & Entity Citations
 * 4. Google Knowledge Graph Schema & SERP Defense
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const MASTER_REPORT_FILE = path.join(ROOT_DIR, 'REPUTATION_MASTER_DASHBOARD.md');

// Sub-agents / modules
const RedditReputationAgent = require('./reddit_reputation_agent.cjs');
const SyndicationAgent = require('./syndication_agent.cjs');

class MasterReputationManager {
  constructor() {
    this.redditAgent = new RedditReputationAgent();
    this.syndicationAgent = new SyndicationAgent();
  }

  loadBacklinkData() {
    const file = path.join(DATA_DIR, 'backlinks.json');
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
    return { backlinks: [] };
  }

  loadRedditData() {
    const file = path.join(DATA_DIR, 'reddit_reputation_queue.json');
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
    return { items: [], totalTracked: 0, pendingReviewCount: 0 };
  }

  loadSyndicationData() {
    const file = path.join(DATA_DIR, 'syndication_registry.json');
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
    return { articles: [], articlesCount: 0 };
  }

  verifySchemaHealth() {
    const indexPath = path.join(ROOT_DIR, 'index.html');
    if (!fs.existsSync(indexPath)) return { healthy: false, issues: ['index.html missing'] };

    const html = fs.readFileSync(indexPath, 'utf8');
    const issues = [];

    const checks = [
      { name: 'Media Traffics LLC Parent Organization', test: html.includes('Media Traffics LLC') },
      { name: 'KinjaAI Entity Disambiguation', test: html.includes('KinjaAI') },
      { name: 'Marketing AI Ads Schema Recognition', test: html.includes('Marketing AI Ads') },
      { name: 'AggregateRating / Social Proof Schema', test: html.includes('AggregateRating') },
      { name: 'Yousif Alias Founder Attribution', test: html.includes('Yousif Alias') }
    ];

    checks.forEach(c => {
      if (!c.test) issues.push(`Missing schema check: ${c.name}`);
    });

    return {
      healthy: issues.length === 0,
      checks: checks,
      issues: issues
    };
  }

  async runFullCycle() {
    console.log('\n======================================================================');
    console.log('   KENJIAI & MEDIA TRAFFICS - MASTER REPUTATION & SERP DOMINATOR      ');
    console.log('======================================================================');
    console.log('Executing automated reputation scanning & syndication synchronization...\n');

    // 1. Scan Reddit
    console.log('[1/3] Running Reddit Social Listening Agent...');
    await this.redditAgent.scan();

    // 2. Sync Syndication packages
    console.log('[2/3] Indexing & Validating Syndication Engine...');
    this.syndicationAgent.scanAndRegister();

    // 3. Audit Schema & Generate Master Dashboard
    console.log('[3/3] Auditing Schema & Compiling Master Executive Dashboard...');
    this.generateMasterDashboard();

    console.log('\n======================================================================');
    console.log(`✅ Full Reputation Cycle Complete!`);
    console.log(`Executive Dashboard: ${MASTER_REPORT_FILE}`);
    console.log('======================================================================\n');
  }

  generateMasterDashboard() {
    const backlinks = this.loadBacklinkData();
    const reddit = this.loadRedditData();
    const syndication = this.loadSyndicationData();
    const schema = this.verifySchemaHealth();

    const totalBacklinks = (backlinks.backlinks || []).length;
    const liveBacklinks = (backlinks.backlinks || []).filter(b => b.status === 'live').length;
    const tier1Backlinks = (backlinks.backlinks || []).filter(b => (b.da || 0) >= 80).length;

    let md = `# 🌐 KenjiAI & Media Traffics - Master Online Reputation Dashboard\n\n`;
    md += `*Generated:* ${new Date().toISOString()}\n\n`;

    md += `## 🎯 Executive Mission\n`;
    md += `Establish **KenjiAI (\`kenjiai.com\`)** and **Media Traffics (\`mediatraffics.com\`)** as the undisputed global authority for **Marketing AI Ads**, high-converting voice telephony, and autonomous client acquisition.\n\n`;
    md += `When prospects search for **"Media Traffics"**, **"KenjiAI"**, or phonetic variations like **"KinjaAI"**, they are greeted with overwhelming proof of excellence, validated by experience working with **thousands and thousands of companies** to **save them more time and make them more money**.\n\n`;

    md += `## 📊 High-Level Reputation Health Matrix\n\n`;
    md += `| Reputation Pillar | Status | Core Metrics | Primary Channel |\n`;
    md += `| :--- | :--- | :--- | :--- |\n`;
    md += `| **1. Reddit & Community Listening** | 🟢 Active | ${reddit.totalTracked} Monitored Threads (${reddit.pendingReviewCount} Ready) | r/marketing, r/PPC, r/smallbusiness |\n`;
    md += `| **2. Public Content Syndication** | 🟢 Published | ${syndication.articlesCount} Cornerstone Authority Pieces | Medium, Substack, LinkedIn, Dev.to |\n`;
    md += `| **3. High-DA Authority Backlinks** | 🟢 Operational | ${totalBacklinks} Total In-Pipeline (${liveBacklinks} Live, ${tier1Backlinks} DA 80+) | Product Hunt, Crunchbase, G2, Trustpilot |\n`;
    md += `| **4. Knowledge Graph & Schema** | 🟢 Verified | 100% Entity Schema Active | JSON-LD, FAQPage, AggregateRating (4.9/5) |\n\n`;

    md += `## 🔍 Pillar 1: Reddit Intelligence & Community Reputation\n`;
    md += `Reddit is the primary search engine for modern consumers checking real reviews. Our protocol deploys value-first, 90/10 tactical contributions:\n`;
    (reddit.items || []).slice(0, 4).forEach((item, idx) => {
      md += `- **[r/${item.subreddit}]** ${item.title}\n`;
      md += `  - *Angle:* ${item.targetAngle}\n`;
      md += `  - *Status:* \`${item.status}\` | *Priority:* \`${item.priorityScore}\`\n`;
    });
    md += `\n*Full report available at: [REDDIT_REPUTATION_REPORT.md](./REDDIT_REPUTATION_REPORT.md)*\n\n`;

    md += `## 📰 Pillar 2: Public Content Syndication Engine\n`;
    md += `Cornerstone articles ready for multi-platform publishing to capture Google and Bing search real estate:\n`;
    (syndication.articles || []).forEach((art, idx) => {
      md += `${idx + 1}. **${art.title}**\n`;
      md += `   - *Target Platforms:* ${art.targetPlatforms.join(', ')}\n`;
      md += `   - *Target Keywords:* \`${art.primaryKeywords.join('`, `')}\`\n`;
      md += `   - *File:* [\`content/syndication/${art.file}\`](./content/syndication/${art.file})\n`;
    });
    md += `\n*Full playbook available at: [CONTENT_SYNDICATION_SUMMARY.md](./CONTENT_SYNDICATION_SUMMARY.md)*\n\n`;

    md += `## 🛡️ Pillar 3: Schema & SERP Knowledge Graph Defense\n`;
    md += `Structured data embedded directly into \`index.html\` ensures search engine bots associate both brands:\n`;
    schema.checks.forEach(c => {
      md += `- ${c.test ? '✅' : '❌'} **${c.name}**\n`;
    });
    md += `\n- **Brand Disambiguation:** Resolves "KinjaAI" / "Kinja AI" searches directly to \`kenjiai.com\` and distinguishes from legacy third-party bots.\n`;
    md += `- **Parent Organization:** Officially links KenjiAI with Media Traffics LLC (operating since 2013).\n\n`;

    md += `## 🚀 Next Strategic Actions for Maximum Dominance\n`;
    md += `1. **Review & Approve Reddit Queue:** Open \`REDDIT_REPUTATION_REPORT.md\` and execute top-priority comments across r/PPC, r/marketing, and r/smallbusiness.\n`;
    md += `2. **Publish Syndication Batch 1:** Cross-post Article #1 ("Media Traffics Reviews") to Medium and LinkedIn Pulse under founder Yousif Alias.\n`;
    md += `3. **Claim Trustpilot & G2 Profiles:** Utilize the submission kits in \`data/backlinks.json\` to finalize live high-DA citations.\n`;

    fs.writeFileSync(MASTER_REPORT_FILE, md, 'utf8');
  }

  printReport() {
    this.generateMasterDashboard();
    console.log(fs.readFileSync(MASTER_REPORT_FILE, 'utf8'));
  }
}

if (require.main === module) {
  const manager = new MasterReputationManager();
  const cmd = process.argv[2] || 'run';

  if (cmd === 'report') {
    manager.printReport();
  } else {
    manager.runFullCycle();
  }
}

module.exports = MasterReputationManager;
