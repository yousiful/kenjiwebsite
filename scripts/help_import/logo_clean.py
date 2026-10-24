"""Step 4 (optional): find the source platform's logo inside article screenshots and
make logo-free copies.

    python scripts/help_import/logo_clean.py detect   # scan, write hits.json + review sheets
    python scripts/help_import/logo_clean.py apply    # write public/help-img/*.webp + image_map.json
    python scripts/help_import/build.py               # re-run so articles use the clean copies

How it works: a cheap colour pass (the logo is always yellow + green + blue arrows
close together) proposes spots, then multi-scale template matching against the real
logo crops in logo_templates/ confirms them. Only confirmed boxes are touched: each
is covered with the surrounding background colour (or inpainted when the background
isn't flat). Images with no confirmed logo stay hotlinked as they were.
Animated GIFs are skipped (reported).
"""
import glob, hashlib, json, os, sys
import cv2
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
CACHE = os.environ.get("HELP_IMG_CACHE") or os.path.join(HERE, ".help_img_cache")
REVIEW = os.environ.get("HELP_REVIEW_DIR") or os.path.join(CACHE, "_review")
OUT_DIR = os.path.join(ROOT, "public", "help-img")
HITS = os.path.join(CACHE, "_hits.json")
MAP = os.path.join(HERE, "image_map.json")
THRESH = float(os.environ.get("LOGO_THRESH", "0.80"))
WORK = 1600  # long side used for detection

TEMPLATES = []
for p in sorted(glob.glob(os.path.join(HERE, "logo_templates", "*.png"))):
    t = cv2.cvtColor(np.array(Image.open(p).convert("RGB")), cv2.COLOR_RGB2BGR)
    TEMPLATES.append((os.path.basename(p)[:-4], t))


def hue_mask(hsv, h0, h1):
    return ((hsv[..., 0] >= h0) & (hsv[..., 0] <= h1) & (hsv[..., 1] >= 110) & (hsv[..., 2] >= 140)).astype(np.float32)


def candidates(bgr):
    """Centres (in bgr coords) where yellow, green and blue pixels sit close together."""
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    k = 15
    ys = cv2.boxFilter(hue_mask(hsv, 18, 30), -1, (k, k), normalize=False)
    gs = cv2.boxFilter(hue_mask(hsv, 45, 75), -1, (k, k), normalize=False)
    bs = cv2.boxFilter(hue_mask(hsv, 98, 115), -1, (k, k), normalize=False)
    m = (np.minimum(np.minimum(ys, gs), bs) >= 3).astype(np.uint8)
    n, lab, stats, cent = cv2.connectedComponentsWithStats(m)
    return [(int(cent[i][0]), int(cent[i][1])) for i in range(1, min(n, 40))]


def match_at(bgr, cx, cy):
    """Best template match in a window around a candidate. Returns (score, name, x, y, w, h)."""
    H, W = bgr.shape[:2]
    best = (0, None, 0, 0, 0, 0)
    for name, t in TEMPLATES:
        th, tw = t.shape[:2]
        for target_h in np.geomspace(12, 260, 22):
            s = target_h / th
            w, h = max(6, int(tw * s)), max(6, int(th * s))
            if w > W or h > H:
                continue
            pad = int(max(w, h) * 1.2) + 10
            x0, y0 = max(0, cx - pad), max(0, cy - pad)
            x1, y1 = min(W, cx + pad), min(H, cy + pad)
            win = bgr[y0:y1, x0:x1]
            if win.shape[0] < h or win.shape[1] < w:
                continue
            ts = cv2.resize(t, (w, h), interpolation=cv2.INTER_AREA if s < 1 else cv2.INTER_CUBIC)
            r = cv2.matchTemplate(win, ts, cv2.TM_CCOEFF_NORMED)
            _, v, _, loc = cv2.minMaxLoc(r)
            if v > best[0]:
                best = (float(v), name, x0 + loc[0], y0 + loc[1], w, h)
    return best


def extend_right(bgr, x, y, w, h):
    """The arrows icon is often followed by the wordmark. Grow the box right over the
    first word only (the wordmark), never further, so neighbouring text survives."""
    H, W = bgr.shape[:2]
    y0, y1 = max(0, y), min(H, y + h)
    ring = np.concatenate([bgr[y0:y1, max(0, x - 4):x].reshape(-1, 3), bgr[max(0, y - 3):y, x:x + w].reshape(-1, 3),
                           bgr[y1:min(H, y1 + 3), x:x + w].reshape(-1, 3)])
    if not len(ring):
        return w
    bg = np.median(ring, axis=0)
    band = bgr[y0:y1, x + w:min(W, x + w + int(4.6 * h))].astype(np.int16)
    if not band.size:
        return w
    ink = (np.abs(band - bg).max(axis=2) > 45).any(axis=0)
    start = next((i for i, v in enumerate(ink) if v), None)
    if start is None or start > 0.45 * h:
        return w  # nothing right next to the icon
    last, gap = start, 0
    for i in range(start, len(ink)):
        if ink[i]:
            last, gap = i, 0
        else:
            gap += 1
            if gap > max(2, h * 0.18):  # end of the word
                break
    if last >= len(ink) - 1:
        return w  # ran into the cap: it's a sentence, not the wordmark; leave it
    return w + last + 1


def load(path):
    im = Image.open(path)
    frames = getattr(im, "n_frames", 1)
    return im, frames


def detect():
    keys = json.load(open(os.path.join(CACHE, "_keys.json")))
    used = used_urls()
    hits, skipped_gif, n = {}, 0, 0
    scan_file = os.path.join(CACHE, "_scan.json")  # per-image results, so re-runs only scan new images
    scan = json.load(open(scan_file)) if os.path.exists(scan_file) and not os.environ.get("RESCAN") else {}
    limit = int(os.environ.get("LIMIT", "0"))
    for key, url in keys.items():
        if limit and n >= limit:
            break
        if url not in used:
            continue
        p = os.path.join(CACHE, key)
        if not os.path.exists(p):
            continue
        if key in scan:
            if scan[key] == "gif":
                skipped_gif += 1
            elif scan[key]:
                hits[key] = {"url": url, **scan[key]}
            n += 1
            continue
        try:
            im, frames = load(p)
            if frames > 1:
                skipped_gif += 1
                scan[key] = "gif"
                continue
            rgb = np.array(im.convert("RGB"))
        except Exception:
            continue
        n += 1
        H, W = rgb.shape[:2]
        s = min(1.0, WORK / max(H, W))
        bgr = cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
        small = cv2.resize(bgr, (int(W * s), int(H * s)), interpolation=cv2.INTER_AREA) if s < 1 else bgr
        boxes = []
        for cx, cy in candidates(small):
            sc, name, x, y, w, h = match_at(small, cx, cy)
            if sc >= THRESH and name in ("arrows_dark", "arrows_light"):
                w = extend_right(small, x, y, w, h)
            if sc >= THRESH - 0.15:  # keep near-misses for review; apply() uses THRESH
                boxes.append({"score": round(sc, 3), "tpl": name,
                              "box": [int(x / s), int(y / s), int(w / s), int(h / s)]})
        scan[key] = {"size": [W, H], "boxes": dedupe(boxes)} if boxes else None
        if boxes:
            hits[key] = {"url": url, **scan[key]}
        if n % 500 == 0:
            print(n, "scanned,", sum(1 for v in hits.values() if any(b["score"] >= THRESH for b in v["boxes"])), "with logo", flush=True)
    json.dump(scan, open(scan_file, "w"))
    json.dump(hits, open(HITS, "w"), indent=1)
    confirmed = {k: v for k, v in hits.items() if any(b["score"] >= THRESH for b in v["boxes"])}
    print(f"scanned {n}, animated GIFs skipped {skipped_gif}, images with logo {len(confirmed)}, near-miss {len(hits) - len(confirmed)}")
    review_sheet(hits)


def dedupe(boxes):
    boxes = sorted(boxes, key=lambda b: -b["box"][2] * b["box"][3] * (b["score"] >= THRESH))
    out = []
    for b in boxes:
        x, y, w, h = b["box"]
        if any(overlap((x, y, w, h), o["box"]) > 0.3 for o in out):
            continue
        out.append(b)
    return out


def overlap(a, b):
    ax, ay, aw, ah = a
    bx, by, bw, bh = b
    ix = max(0, min(ax + aw, bx + bw) - max(ax, bx))
    iy = max(0, min(ay + ah, by + bh) - max(ay, by))
    return ix * iy / float(min(aw * ah, bw * bh) or 1)


def erase(rgb, box):
    H, W = rgb.shape[:2]
    x, y, w, h = box
    m = max(3, int(min(w, h) * 0.14))  # grow a little so anti-aliased edges go too
    x0, y0, x1, y1 = max(0, x - m), max(0, y - m), min(W, x + w + m), min(H, y + h + m)
    r = max(3, m)
    ring = np.concatenate([
        rgb[max(0, y0 - r):y0, x0:x1].reshape(-1, 3), rgb[y1:min(H, y1 + r), x0:x1].reshape(-1, 3),
        rgb[y0:y1, max(0, x0 - r):x0].reshape(-1, 3), rgb[y0:y1, x1:min(W, x1 + r)].reshape(-1, 3),
    ])
    if len(ring):
        # Most common ring colour (quantised). A flat background, even with a stray
        # edge or two in the ring, gets a clean solid fill instead of an inpaint smear.
        q = (ring // 8).astype(np.int32)
        codes = q[:, 0] * 1024 + q[:, 1] * 32 + q[:, 2]
        vals, counts = np.unique(codes, return_counts=True)
        top = vals[counts.argmax()]
        share = counts.max() / len(codes)
    if len(ring) and share >= 0.55:
        sel = ring[codes == top]
        rgb[y0:y1, x0:x1] = np.median(sel, axis=0).astype(np.uint8)
    else:
        mask = np.zeros((H, W), np.uint8)
        mask[y0:y1, x0:x1] = 255
        bgr = cv2.inpaint(cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR), mask, 7, cv2.INPAINT_TELEA)
        rgb[:] = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    return rgb


def used_urls():
    urls = set()
    import re
    for fn in os.listdir(os.path.join(ROOT, "public", "help-data", "articles")):
        html = json.load(open(os.path.join(ROOT, "public", "help-data", "articles", fn), encoding="utf-8"))["html"]
        urls.update(re.findall(r'<img[^>]+src="(http[^"]+)"', html))
    urls_clean = {u for u in urls if not u.startswith("/help-img/")}
    # Also count the original URL of images already swapped by an earlier apply.
    if os.path.exists(MAP):
        urls_clean |= set(json.load(open(MAP)).keys())
    return urls_clean


def apply():
    hits = json.load(open(HITS))
    os.makedirs(OUT_DIR, exist_ok=True)
    mapping, total = {}, 0
    for key, v in hits.items():
        boxes = [b for b in v["boxes"] if b["score"] >= THRESH]
        if not boxes:
            continue
        im = Image.open(os.path.join(CACHE, key))
        has_alpha = im.mode in ("RGBA", "LA", "P")
        rgba = np.array(im.convert("RGBA"))
        rgb = np.ascontiguousarray(rgba[..., :3])
        for b in boxes:
            rgb = erase(rgb, b["box"])
        out = Image.fromarray(rgb)
        if has_alpha and rgba[..., 3].min() < 255:
            out = Image.fromarray(np.dstack([rgb, rgba[..., 3]]), "RGBA")
        W, H = out.size
        if W > 2400:  # docs screenshots are often 3x retina; 2400 wide is plenty
            out = out.resize((2400, int(H * 2400 / W)), Image.LANCZOS)
        name = hashlib.sha1(v["url"].encode()).hexdigest()[:16] + ".webp"
        path = os.path.join(OUT_DIR, name)
        out.save(path, "WEBP", quality=80, method=6)
        total += os.path.getsize(path)
        mapping[v["url"]] = f"/help-img/{name}"
    json.dump(mapping, open(MAP, "w"), indent=1)
    print(f"cleaned {len(mapping)} images, {total / 1e6:.1f} MB in public/help-img")


def review_sheet(hits, limit=120):
    """Crops around every box, coloured by verdict, so a person can sanity-check."""
    from PIL import ImageDraw
    os.makedirs(REVIEW, exist_ok=True)
    rows = []
    for key, v in hits.items():
        for b in v["boxes"]:
            rows.append((b["score"], key, b))
    rows.sort(key=lambda r: abs(r[0] - THRESH))  # closest to the line first: the ones worth eyeballing
    rows = rows[:limit]
    cw, ch, cols = 300, 170, 6
    sheet = Image.new("RGB", (cw * cols, ch * ((len(rows) + cols - 1) // cols or 1)), "white")
    d = ImageDraw.Draw(sheet)
    for i, (sc, key, b) in enumerate(rows):
        im = Image.open(os.path.join(CACHE, key)).convert("RGB")
        x, y, w, h = b["box"]
        pad = max(w, h)
        crop = im.crop((max(0, x - pad), max(0, y - pad), x + w + pad, y + h + pad))
        dd = ImageDraw.Draw(crop)
        ox, oy = max(0, x - pad), max(0, y - pad)
        dd.rectangle([x - ox, y - oy, x - ox + w, y - oy + h], outline=(0, 200, 0) if sc >= THRESH else (220, 0, 0), width=max(2, w // 40))
        crop.thumbnail((cw - 4, ch - 18))
        sheet.paste(crop, ((i % cols) * cw + 2, (i // cols) * ch + 16))
        d.text(((i % cols) * cw + 4, (i // cols) * ch + 2), f"{sc:.2f} {b['tpl']} {key[:6]}", fill=(0, 140, 0) if sc >= THRESH else (200, 0, 0))
    p = os.path.join(REVIEW, "threshold_review.jpg")
    sheet.save(p, quality=85)
    print("review sheet:", p)


if __name__ == "__main__":
    {"detect": detect, "apply": apply}[sys.argv[1]]()
