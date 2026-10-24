// Tell Bing, Yandex, Seznam, Naver (and through Bing, ChatGPT search / Copilot) about every URL
// in the live sitemap. Run after a deploy is live: `node scripts/indexnow.mjs`
// Optional args: specific URLs to submit instead of the whole sitemap.
// api.indexnow.org resets connections from this machine, so this posts to Bing directly (Bing shares with the others).
// Key file: public/ccb8bd94891f43b3bda5bf36da3940b4.txt (must stay deployed).
const SITE = 'https://kenjiai.com';
const KEY = 'ccb8bd94891f43b3bda5bf36da3940b4';

let urls = process.argv.slice(2);
if (!urls.length) {
  const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}
const res = await fetch('https://www.bing.com/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: 'kenjiai.com', key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls }),
});
console.log(`indexnow: submitted ${urls.length} URLs -> HTTP ${res.status} ${await res.text()}`);
