"""Step 3 helper: download every article image (deduped by URL) into a local cache so
logo_clean.py can scan them. Cache: HELP_IMG_CACHE env var or ./.help_img_cache
    python scripts/help_import/images.py
"""
import concurrent.futures as cf, hashlib, json, os, re
import requests

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ART = os.path.join(ROOT, "public", "help-data", "articles")
CACHE = os.environ.get("HELP_IMG_CACHE") or os.path.join(os.path.dirname(__file__), ".help_img_cache")
os.makedirs(CACHE, exist_ok=True)
S = requests.Session()
S.headers["User-Agent"] = "Mozilla/5.0 (KenjiAI help import)"


def key(url):
    return hashlib.sha1(url.encode()).hexdigest()[:16]


def all_urls():
    urls = set()
    for fn in os.listdir(ART):
        html = json.load(open(os.path.join(ART, fn), encoding="utf-8"))["html"]
        for u in re.findall(r'<img[^>]+src="([^"]+)"', html):
            if u.startswith("http"):
                urls.add(u)
    return sorted(urls)


def get(url):
    path = os.path.join(CACHE, key(url))
    if os.path.exists(path):
        return "cached"
    for _ in range(3):
        try:
            r = S.get(url, timeout=60)
            ctype = r.headers.get("content-type", "")
            if r.status_code == 200 and (ctype.startswith("image") or ctype == "application/octet-stream") and len(r.content) > 200:
                open(path, "wb").write(r.content)
                return "ok"
            if r.status_code in (403, 404):
                return str(r.status_code)
        except requests.RequestException:
            pass
    return "fail"


if __name__ == "__main__":
    us = all_urls()
    json.dump({key(u): u for u in us}, open(os.path.join(CACHE, "_keys.json"), "w"))
    print(len(us), "images", flush=True)
    stats = {}
    with cf.ThreadPoolExecutor(8) as ex:
        for n, res in enumerate(ex.map(get, us), 1):
            stats[res] = stats.get(res, 0) + 1
            if n % 500 == 0:
                print(n, stats, flush=True)
    print("done", stats, flush=True)
