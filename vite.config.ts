import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
// @ts-expect-error - rollup plugin types are CJS-style
import prerender from '@prerenderer/rollup-plugin';

// Routes to prerender — give bots and humans real per-page HTML.
// Skip /dashboard (private), /success (transient), /* (404 catchall).
const STATIC_ROUTES = [
  '/',
  '/ai-automation',
  '/ai-education',
  '/blog',
  '/crm',
  '/disclaimer',
  '/free-tools',
  '/knowledge',
  '/marketing-automation',
  '/overview',
  '/pricing',
  '/privacy',
  '/setup',
  '/terms',
  '/tools',
  '/voice-agents',
  '/voice-ai',
];

const BLOG_SLUGS = [
  'ai-automation-business-growth-2025',
  'voice-ai-sales-conversion-optimization',
  'tax-optimization-ai-strategies',
  'smart-investment-ai-analytics',
  'chatbot-customer-service-automation',
  'retirement-planning-ai-optimization',
  'crm-automation-pipeline-optimization',
  'cryptocurrency-ai-trading-strategies',
  'business-valuation-ai-analysis',
  'automate-follow-ups-never-lose-lead',
  'ai-voice-agents-what-they-cost-are-they-worth-it',
  'signs-you-need-crm-losing-money',
  'get-more-google-reviews-autopilot',
  'what-marketing-automation-actually-does',
  'ai-agents-the-next-10-trillion-dollar-market',
  'openai-strawberry-project-agi-breakthrough',
  'nvidia-blackwell-nuclear-reactor-ai',
  'why-your-marketing-agency-is-fired-ai-agents',
  'top-5-ai-tools-saving-billion-dollar-companies',
];

const NICHE_SLUGS = [
  'saas', 'real-estate', 'med-spa', 'coaches', 'home-services',
  'ecommerce', 'insurance', 'mortgage', 'dental', 'roofing',
  'solar', 'legal', 'financial-advisors', 'staffing', 'hvac',
  'chiropractic', 'fitness', 'pest-control', 'recruiting', 'contractors',
];

const PRERENDER_ROUTES = [
  ...STATIC_ROUTES,
  ...BLOG_SLUGS.map((s) => `/blog/${s}`),
  ...NICHE_SLUGS.map((s) => `/paid-ads-for/${s}`),
];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression({ algorithm: 'brotliCompress', ext: '.br' }),
    viteCompression({ algorithm: 'gzip', ext: '.gz' }),
    {
      ...prerender({
        routes: PRERENDER_ROUTES,
        renderer: '@prerenderer/renderer-puppeteer',
        rendererOptions: {
          renderAfterTime: 3000,
          maxConcurrentRoutes: 4,
          headless: true,
          timeout: 60000,
        },
        postProcess(renderedRoute: { html: string; route: string }) {
          const canonical = `https://kenjiai.com${renderedRoute.route === '/' ? '' : renderedRoute.route}`;
          renderedRoute.html = renderedRoute.html
            // Strip the loading screen — prerendered content is already in #root
            .replace(/<div class="loading-screen" id="app-loading">[\s\S]*?<\/div>/g, '')
            // Force per-route canonical (override or insert into <head>)
            .replace(
              /<link rel="canonical" href="[^"]*"\s*\/?>/,
              `<link rel="canonical" href="${canonical}" />`
            )
            // Insert canonical if none was present
            .replace(
              /<\/head>/,
              (match) =>
                renderedRoute.html.includes('rel="canonical"')
                  ? match
                  : `<link rel="canonical" href="${canonical}" />${match}`
            )
            // Force per-route og:url and twitter:url
            .replace(
              /<meta property="og:url" content="[^"]*"\s*\/?>/,
              `<meta property="og:url" content="${canonical}" />`
            )
            .replace(
              /<meta property="twitter:url" content="[^"]*"\s*\/?>/,
              `<meta property="twitter:url" content="${canonical}" />`
            );
        },
      }),
      enforce: 'post' as const,
      apply: 'build' as const,
    },
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          motion: ['framer-motion'],
          stripe: ['@stripe/stripe-js'],
          icons: ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,
    host: true,
    open: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
});