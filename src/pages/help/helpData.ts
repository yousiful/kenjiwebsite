// Help center data lives in public/help-data/ (built by scripts/help_import/build.py),
// fetched at runtime so ~2,500 article bodies never land in the JS bundle.

export type HelpIndexEntry = {
  id: string;
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  folder: string;
  excerpt: string;
};

export type HelpArticle = {
  title: string;
  category: string;
  categorySlug: string;
  folder: string;
  html: string;
  updated: string;
};

let indexPromise: Promise<HelpIndexEntry[]> | null = null;

export function loadHelpIndex(): Promise<HelpIndexEntry[]> {
  if (!indexPromise) {
    indexPromise = fetch('/help-data/index.json')
      .then((r) => {
        if (!r.ok) throw new Error(`help index ${r.status}`);
        return r.json();
      })
      .catch((e) => {
        indexPromise = null;
        throw e;
      });
  }
  return indexPromise;
}

export async function loadHelpArticle(slug: string): Promise<HelpArticle | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const r = await fetch(`/help-data/articles/${slug}.json`);
  if (!r.ok) return null;
  const type = r.headers.get('content-type') || '';
  if (!type.includes('json')) return null; // unknown slug falls through to the HTML 404 page
  return r.json();
}

export type HelpCategory = { name: string; slug: string; count: number; folders: string[] };

export function groupCategories(index: HelpIndexEntry[]): HelpCategory[] {
  const map = new Map<string, HelpCategory>();
  for (const a of index) {
    let c = map.get(a.categorySlug);
    if (!c) {
      c = { name: a.category, slug: a.categorySlug, count: 0, folders: [] };
      map.set(a.categorySlug, c);
    }
    c.count++;
    if (!c.folders.includes(a.folder)) c.folders.push(a.folder);
  }
  return [...map.values()].sort((a, b) => (a.slug === 'getting-started' ? -1 : b.slug === 'getting-started' ? 1 : a.name.localeCompare(b.name)));
}

export function searchHelp(index: HelpIndexEntry[], q: string, limit = 30): HelpIndexEntry[] {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const scored: [number, HelpIndexEntry][] = [];
  for (const a of index) {
    const title = a.title.toLowerCase();
    const rest = `${a.folder} ${a.category} ${a.excerpt}`.toLowerCase();
    let score = 0;
    for (const w of words) {
      if (title.includes(w)) score += 3;
      else if (rest.includes(w)) score += 1;
      else { score = 0; break; }
    }
    if (score) scored.push([score + (title.startsWith(words[0]) ? 2 : 0), a]);
  }
  return scored.sort((x, y) => y[0] - x[0]).slice(0, limit).map((s) => s[1]);
}

export const HELP_SUPPORT_EMAIL = 'support@mediatraffics.com';
