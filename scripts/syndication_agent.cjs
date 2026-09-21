/**
 * KenjiAI & Media Traffics - Public Content Syndication Agent
 * 
 * Purpose:
 * Scans, validates, packages, and reports on high-authority articles in content/syndication/
 * tailored for publication across Medium, Substack, LinkedIn Pulse, Dev.to, and PR Networks.
 * Targets key branded search queries: "Media Traffics", "KenjiAI", "KinjaAI", "Marketing AI Ads".
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SYNDICATION_DIR = path.join(ROOT_DIR, 'content', 'syndication');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const REGISTRY_FILE = path.join(DATA_DIR, 'syndication_registry.json');
const SUMMARY_FILE = path.join(ROOT_DIR, 'CONTENT_SYNDICATION_SUMMARY.md');

function parseFrontmatter(rawContent) {
  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { metadata: {}, body: rawContent };
  }
  const yamlBlock = match[1];
  const body = match[2];
  const metadata = {};

  yamlBlock.split(/\r?\n/).forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      let val = line.slice(colonIdx + 1).trim();
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      } else if (val.startsWith('[') && val.endsWith(']')) {
        try {
          val = JSON.parse(val);
        } catch (e) {
          val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^"/, '').replace(/"$/, ''));
        }
      }
      metadata[key] = val;
    }
  });

  return { metadata, body };
}

class SyndicationAgent {
  constructor() {
    this.ensureDirectories();
  }

  ensureDirectories() {
    if (!fs.existsSync(SYNDICATION_DIR)) {
      fs.mkdirSync(SYNDICATION_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  scanAndRegister() {
    console.log('\n======================================================');
    console.log('   KENJIAI & MEDIA TRAFFICS - CONTENT SYNDICATION AGENT');
    console.log('======================================================');
    console.log(`Scanning directory: ${SYNDICATION_DIR}`);
    console.log('------------------------------------------------------');

    const files = fs.readdirSync(SYNDICATION_DIR).filter(f => f.endsWith('.md'));
    const registry = {
      lastGenerated: new Date().toISOString(),
      articlesCount: files.length,
      primaryPlatforms: ['Medium', 'Substack', 'LinkedIn Pulse', 'Dev.to', 'Hackernoon', 'PR Wires'],
      articles: []
    };

    files.forEach((file, idx) => {
      const fullPath = path.join(SYNDICATION_DIR, file);
      const raw = fs.readFileSync(fullPath, 'utf8');
      const { metadata, body } = parseFrontmatter(raw);

      const wordCount = body.split(/\s+/).filter(Boolean).length;
      const readingTime = `${Math.ceil(wordCount / 220)} min read`;

      const articleEntry = {
        id: `syndication-${idx + 1}`,
        file: file,
        filePath: fullPath,
        title: metadata.title || file.replace(/\.md$/, ''),
        slug: metadata.slug || file.replace(/\.md$/, ''),
        canonicalUrl: metadata.canonical_url || 'https://kenjiai.com',
        primaryKeywords: metadata.primary_keywords || [],
        targetPlatforms: metadata.target_platforms || ['Medium', 'LinkedIn Pulse'],
        wordCount: wordCount,
        readingTime: readingTime,
        status: metadata.distribution_status || 'ready_for_publication',
        excerpt: metadata.excerpt || ''
      };

      registry.articles.push(articleEntry);
      console.log(`[Indexed] ${file} (~${wordCount} words, ${readingTime})`);
      console.log(`          Title: "${articleEntry.title}"`);
    });

    fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registry, null, 2), 'utf8');
    this.generateSummaryDocument(registry);

    console.log('------------------------------------------------------');
    console.log(`Indexed & packaged ${registry.articlesCount} cornerstone articles.`);
    console.log(`Registry saved to: ${REGISTRY_FILE}`);
    console.log(`Summary playbook: ${SUMMARY_FILE}\n`);

    return registry;
  }

  generateSummaryDocument(registry) {
    let md = `# High-Authority Content Syndication Engine: KenjiAI & Media Traffics\n\n`;
    md += `*Generated:* ${registry.lastGenerated}\n\n`;
    md += `## 🚀 Strategic Objective\n`;
    md += `Ensure unshakeable search dominance across Google, Bing, Reddit, and public publications whenever clients search for:\n`;
    md += `- **"Media Traffics"** / **"Media Traffics reviews"**\n`;
    md += `- **"KenjiAI"** / **"KinjaAI"** / **"Kinja AI"**\n`;
    md += `- **"Marketing AI Ads"** / **"AI call centers"**\n\n`;
    md += `Every article is crafted around our proven foundation: **experience working with thousands and thousands of companies** to deliver measurable results, save critical time, and maximize revenue.\n\n`;

    md += `## 📚 Ready-to-Publish Cornerstone Articles\n\n`;

    registry.articles.forEach((art, index) => {
      md += `### ${index + 1}. ${art.title}\n`;
      md += `- **File:** \`content/syndication/${art.file}\`\n`;
      md += `- **Length:** ${art.wordCount} words (~${art.readingTime})\n`;
      md += `- **Target Platforms:** ${Array.isArray(art.targetPlatforms) ? art.targetPlatforms.join(', ') : art.targetPlatforms}\n`;
      md += `- **Canonical Link:** [${art.canonicalUrl}](${art.canonicalUrl})\n`;
      md += `- **Query Targets:** \`${Array.isArray(art.primaryKeywords) ? art.primaryKeywords.join('`, `') : art.primaryKeywords}\`\n`;
      md += `- **Excerpt:** ${art.excerpt}\n\n`;
    });

    md += `## 📤 Step-by-Step Publishing Playbook\n`;
    md += `1. **Medium & Substack**: Post the full articles under the official company publication or Yousif Alias's founder profile. Set the canonical link back to \`https://kenjiai.com\` or \`https://mediatraffics.com\`.\n`;
    md += `2. **LinkedIn Pulse**: Publish as an authoritative article from Yousif Alias to capture B2B decision makers, agency owners, and CMOs.\n`;
    md += `3. **Dev.to / Hackernoon**: Publish the architectural breakdowns (*"KenjiAI Explained"* & *"Why 90% of AI Ads Fail"*), highlighting sub-500ms voice telephony and native CRM model injection.\n`;
    md += `4. **PR Wires / News Distribution**: Distribute the Media Traffics review piece across PR networks to lock in initial Google News indexation and high-DA citation backlinks.\n`;

    fs.writeFileSync(SUMMARY_FILE, md, 'utf8');
  }

  audit() {
    const reg = JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf8'));
    console.log('\n======================================================');
    console.log('   SYNDICATION COVERAGE AUDIT                        ');
    console.log('======================================================');
    console.log(`Total Articles: ${reg.articlesCount}`);

    const keyPhrases = [
      'Media Traffics',
      'KenjiAI',
      'KinjaAI',
      'thousands and thousands of companies',
      'save time',
      'make more money',
      'marketing AI ads'
    ];

    reg.articles.forEach(art => {
      console.log(`\nAuditing [${art.file}]:`);
      const raw = fs.readFileSync(art.filePath, 'utf8');
      keyPhrases.forEach(phrase => {
        const regex = new RegExp(phrase, 'gi');
        const matches = (raw.match(regex) || []).length;
        const check = matches > 0 ? '✅' : '⚠️';
        console.log(`  ${check} "${phrase}": ${matches} occurrences`);
      });
    });
    console.log('\n======================================================\n');
  }
}

if (require.main === module) {
  const agent = new SyndicationAgent();
  const cmd = process.argv[2] || 'scan';
  if (cmd === 'audit') {
    agent.audit();
  } else {
    agent.scanAndRegister();
  }
}

module.exports = SyndicationAgent;
