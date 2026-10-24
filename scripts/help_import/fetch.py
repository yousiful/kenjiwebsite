"""Step 1 of the KenjiAI help center import: download every article page from the
white-label source help portal into a local cache (raw HTML, one file per article id).
Re-running only fetches what's missing. Cache dir: HELP_CACHE env var or ./.help_cache
    python scripts/help_import/fetch.py
"""
import os, re, sys, time, concurrent.futures as cf
import requests

SRC = "https://help.gohighlevel.com"
CACHE = os.environ.get("HELP_CACHE") or os.path.join(os.path.dirname(__file__), ".help_cache")
os.makedirs(CACHE, exist_ok=True)
S = requests.Session()
S.headers["User-Agent"] = "Mozilla/5.0 (KenjiAI help import)"


def urls():
    xml = S.get(f"{SRC}/support/sitemap.xml", timeout=60).text
    out = []
    for loc, mod in re.findall(r"<loc>([^<]+/articles/[^<]+)</loc>\s*(?:<lastmod>([^<]*)</lastmod>)?", xml):
        out.append(loc)
    return out


def get(url):
    aid = re.search(r"/articles/(\d+)", url).group(1)
    path = os.path.join(CACHE, f"{aid}.html")
    if os.path.exists(path) and os.path.getsize(path) > 5000:
        return "cached"
    for i in range(6):
        try:
            r = S.get(url, timeout=60)
            if r.status_code == 200:
                open(path, "w", encoding="utf-8").write(r.text)
                time.sleep(4.0)
                return "ok"
            if r.status_code == 404:
                return "404"
            # 429: the portal's Cloudflare blocks bursts; one request at a time, long back-off.
            wait = int(r.headers.get("Retry-After", "0") or 0) or 300 * (i + 1)
            time.sleep(min(wait, 1800))
        except requests.RequestException:
            time.sleep(5 * (i + 1))
    return "fail"


if __name__ == "__main__":
    us = urls()
    cached = os.path.join(CACHE, "_urls.txt")
    if len(us) < 1000 and os.path.exists(cached):  # sitemap blocked/empty: reuse the last good list
        us = open(cached, encoding="utf-8").read().split()
        print("sitemap empty, using cached url list", flush=True)
    else:
        open(os.path.join(CACHE, "_urls.txt"), "w", encoding="utf-8").write("\n".join(us))
    print(len(us), "article urls", flush=True)
    stats = {}
    with cf.ThreadPoolExecutor(1) as ex:
        for n, res in enumerate(ex.map(get, us), 1):
            stats[res] = stats.get(res, 0) + 1
            if n % 200 == 0:
                print(n, stats, flush=True)
    print("done", stats)
