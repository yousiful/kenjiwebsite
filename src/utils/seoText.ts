// Search-result length rules for <title> and meta description.
// Used by BlogPost.tsx and, via scripts/seo_text.mjs, by the static HTML generators.

/** Trim to ~155 chars on a sentence boundary (word boundary + ellipsis as a last resort). */
export function metaDescription(text: string, max = 155): string {
  const s = text.replace(/\s+/g, ' ').trim();
  if (s.length <= 160) return s;
  let out = '';
  for (const sentence of s.match(/[^.!?]+[.!?]+(?=\s|$)/g) || []) {
    if ((out + sentence).trim().length > max) break;
    out += sentence;
  }
  out = out.trim();
  if (out.length >= 70) return out;
  const cut = s.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:\s]+$/, '') + '…';
}

/** Brand suffix only while it fits ~60 chars; podcast episodes fall back to the part before the colon. */
export function pageTitle(title: string, seoTitle?: string): string {
  const t = seoTitle || title;
  const base = t.replace(/ \(Podcast Ep\. \d+\)$/, '');
  const short = `${base.split(': ')[0]} | KenjiAI Podcast`;
  const options = [`${t} | KenjiAI Blog`, `${t} | KenjiAI`, t];
  if (base !== t) options.push(`${base} | KenjiAI Podcast`, base);
  const fit = options.find((x) => x.length <= 60);
  if (fit) return fit;
  if (base !== t) return base.length <= 70 ? base : short;
  return t;
}
