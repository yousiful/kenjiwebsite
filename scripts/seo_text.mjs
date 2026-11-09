// Loads src/utils/seoText.ts for the plain-Node build scripts (same esbuild trick blog_static uses
// for articles.ts), so static HTML and the React pages share one title/description rule.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const tmp = path.join(os.tmpdir(), `kenji-seotext-${process.pid}-${Date.now()}.mjs`);
await build({
  entryPoints: [path.join(ROOT, 'src/utils/seoText.ts')],
  bundle: true, platform: 'node', format: 'esm', outfile: tmp, logLevel: 'error',
});
const mod = await import(pathToFileURL(tmp).href);
fs.rmSync(tmp, { force: true });

export const { metaDescription, pageTitle } = mod;
