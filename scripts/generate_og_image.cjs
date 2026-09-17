const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('Launching puppeteer for OG image rendering...');
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
      body {
        width: 1200px;
        height: 630px;
        background: #07090E;
        color: #FFFFFF;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 56px 64px;
        position: relative;
        overflow: hidden;
      }
      .glow-1 {
        position: absolute;
        top: -120px;
        right: -80px;
        width: 520px;
        height: 520px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, rgba(59, 130, 246, 0) 70%);
        filter: blur(40px);
        pointer-events: none;
      }
      .glow-2 {
        position: absolute;
        bottom: -100px;
        left: -80px;
        width: 480px;
        height: 480px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(16, 185, 129, 0) 70%);
        filter: blur(40px);
        pointer-events: none;
      }
      .grid-pattern {
        position: absolute;
        inset: 0;
        background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
        background-size: 40px 40px;
        pointer-events: none;
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        z-index: 2;
      }
      .logo-box {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .logo-icon {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #3B82F6 0%, #10B981 100%);
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        font-size: 26px;
        color: #FFF;
        box-shadow: 0 0 24px rgba(59, 130, 246, 0.5);
      }
      .logo-text {
        font-size: 32px;
        font-weight: 900;
        letter-spacing: -0.03em;
        background: linear-gradient(90deg, #FFFFFF 0%, #E2E8F0 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .badge {
        background: rgba(59, 130, 246, 0.12);
        border: 1px solid rgba(59, 130, 246, 0.35);
        color: #60A5FA;
        padding: 8px 18px;
        border-radius: 9999px;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .badge-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10B981;
        box-shadow: 0 0 8px #10B981;
      }
      .main {
        position: relative;
        z-index: 2;
        margin: 20px 0;
      }
      .h1 {
        font-size: 54px;
        font-weight: 900;
        line-height: 1.14;
        letter-spacing: -0.03em;
        margin-bottom: 16px;
        max-width: 1040px;
      }
      .grad-text {
        background: linear-gradient(135deg, #60A5FA 0%, #34D399 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .desc {
        font-size: 22px;
        color: #94A3B8;
        line-height: 1.45;
        max-width: 960px;
        font-weight: 400;
      }
      .pills {
        display: flex;
        gap: 16px;
        margin-top: 28px;
      }
      .pill {
        background: rgba(15, 23, 42, 0.75);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 12px 22px;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        color: #E2E8F0;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
      }
      .pill-icon {
        color: #34D399;
        font-size: 18px;
      }
      .footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        z-index: 2;
        padding-top: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .foot-left {
        font-size: 15px;
        color: #64748B;
        font-weight: 500;
      }
      .foot-right {
        display: flex;
        align-items: center;
        gap: 20px;
        font-size: 16px;
        font-weight: 700;
        color: #94A3B8;
      }
      .domain {
        color: #60A5FA;
        font-weight: 800;
        letter-spacing: -0.01em;
      }
    </style>
  </head>
  <body>
    <div class="glow-1"></div>
    <div class="glow-2"></div>
    <div class="grid-pattern"></div>

    <div class="header">
      <div class="logo-box">
        <div class="logo-icon">K</div>
        <span class="logo-text">KenjiAI</span>
      </div>
      <div class="badge">
        <span class="badge-dot"></span>
        Enterprise AI Call Centers & CRM
      </div>
    </div>

    <div class="main">
      <h1 class="h1">Done-For-You Inbound &amp; Outbound <span class="grad-text">AI Call Centers.</span></h1>
      <p class="desc">24/7 autonomous receptionists, sub-60-second speed-to-lead outbound dialing, and native CRM lead conversion with zero clunky third-party connections.</p>
      <div class="pills">
        <div class="pill"><span class="pill-icon">⚡</span> &lt;500ms Voice Latency</div>
        <div class="pill"><span class="pill-icon">📞</span> 60s Outbound Speed-to-Lead</div>
        <div class="pill"><span class="pill-icon">🔄</span> Database Reactivation</div>
        <div class="pill"><span class="pill-icon">🔒</span> Zero Middleware Needed</div>
      </div>
    </div>

    <div class="footer">
      <div class="foot-left">Founded in 2020 as CRM · KenjiAI in 2022 · Media Traffics LLC (Est. 2013)</div>
      <div class="foot-right">
        <span>San Diego, CA</span>
        <span>•</span>
        <span class="domain">kenjiai.com</span>
      </div>
    </div>
  </body>
  </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  const outPath = path.resolve('public/og-image.png');
  await page.screenshot({ path: outPath, type: 'png' });
  console.log('SUCCESS: Generated 1200x630 OG image at:', outPath);
  await browser.close();
})().catch(err => {
  console.error('OG image generation failed:', err);
  process.exit(1);
});
