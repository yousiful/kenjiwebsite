// Link previews for Kenji Invites. Message apps (iMessage, WhatsApp, Messenger, Android
// Messages, email) read Open Graph tags from the first HTML response and never run
// JavaScript, so the tags are written into the page here.
//   /i/<code>                -> that invitation's title, date/place line and card picture
//   /invites/manage, /join   -> a neutral private preview (the key is in the #fragment,
//                               which never reaches the server)
import type { Context } from 'https://edge.netlify.com';

const SITE = 'https://kenjiai.com';
const GENERIC = {
  title: "You're invited",
  description: 'Open your invitation and let the host know if you can come.',
  image: `${SITE}/invites-og.jpg`,
  width: 1200,
  height: 630,
  url: '',
};
const PRIVATE = {
  title: 'Kenji Invites: manage your invitation',
  description: 'A private link to manage an invitation. Only open it if it was sent to you.',
  image: `${SITE}/invites-og.jpg`,
  width: 1200,
  height: 630,
  url: '',
};

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default async (req: Request, context: Context) => {
  const res = await context.next();
  if (!(res.headers.get('content-type') || '').includes('text/html')) return res;
  const url = new URL(req.url);
  let meta = { ...GENERIC, url: `${SITE}${url.pathname}` };
  const code = (url.pathname.match(/^\/i\/([A-Za-z0-9_-]{12,32})\/?$/) || [])[1];
  if (code) {
    try {
      const r = await fetch(`${url.origin}/.netlify/functions/invites-api?op=og&code=${code}`, { headers: { accept: 'application/json' } });
      if (r.ok) meta = { ...meta, ...(await r.json()) };
    } catch { /* keep the generic preview */ }
  } else {
    meta = { ...PRIVATE, url: `${SITE}${url.pathname}` };
  }

  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Kenji Invites" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${esc(meta.url)}" />`,
    `<meta property="og:image" content="${esc(meta.image)}" />`,
    `<meta property="og:image:secure_url" content="${esc(meta.image)}" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:width" content="${meta.width}" />`,
    `<meta property="og:image:height" content="${meta.height}" />`,
    `<meta property="og:image:alt" content="${esc(meta.title)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${esc(meta.image)}" />`,
  ].join('\n    ');

  let html = await res.text();
  html = html
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta\s+(?:name|property)="(?:description|og:[^"]+|twitter:[^"]+)"[^>]*>\s*/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, '')
    .replace('</head>', `    ${tags}\n  </head>`);

  const headers = new Headers(res.headers);
  headers.delete('content-length');
  headers.delete('etag');
  headers.delete('content-encoding');
  headers.set('cache-control', 'no-cache, max-age=0, must-revalidate');
  // private invitations: keep them out of search results whatever the HTML says
  if (url.pathname.startsWith('/i/')) headers.set('x-robots-tag', 'noindex, nofollow');
  return new Response(html, { status: res.status, headers });
};

export const config = { path: ['/i/*', '/invites/manage', '/invites/join'] };
