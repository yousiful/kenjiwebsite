"""Step 2 of the KenjiAI help center import: turn the cached article pages from
fetch.py into public/help-data/ JSON, white-labeled for KenjiAI.

    python scripts/help_import/build.py

- Agency/reseller-only categories and folders are skipped (EXCLUDE_* below).
- Brand names become KenjiAI, app links point at app.kenjiai.com, links between
  articles point at /help/article/<slug>, other links to the source company are
  unwrapped to plain text. Images are hotlinked (cdn.freshdesk.com) except the
  portal logo, which is dropped. YouTube/Loom/Vimeo/Wistia embeds are kept.
- If image_map.json exists (written by logo_clean.py), those image URLs are
  swapped for the logo-free copies in public/help-img/.
- Writes public/help-data/index.json and public/help-data/articles/<slug>.json
  and prints a report (counts, exclusions, leftover brand mentions).
"""
import json, os, re, shutil
from collections import Counter, defaultdict
from bs4 import BeautifulSoup, Comment

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CACHE = os.environ.get("HELP_CACHE") or os.path.join(os.path.dirname(__file__), ".help_cache")
OUT = os.path.join(ROOT, "public", "help-data")
IMG_MAP = os.path.join(os.path.dirname(__file__), "image_map.json")

# Whole categories about running the agency/reseller side, or about the source
# company itself. Sub-account clients never see these screens.
EXCLUDE_CATEGORIES = {
    "Customer Support", "Agency View", "SaaS Configurator", "HighLevel Affiliates Program",
    "University", "Reselling Products", "Agency Reporting", "Add-ons & Sales Trainings",
    "GoKollab", "Account Snapshots", "Eliza Agent Platform", "Developer Resources",
    "Logic & Fulfillment",
}
# Folder names (any category) matching this are agency-only.
EXCLUDE_FOLDER_RE = re.compile(
    r"\b(saas|agency|white[\s-]?label|reseller|reselling|rebill\w*|wallet|highlevel affiliates?|snapshots?|"
    r"highlevel (plans?|pricing|billing|university|partners?)|partner program|changelog|release notes|"
    r"product updates|what'?s new)\b", re.I)
EXCLUDE_TITLE_RE = re.compile(
    r"\b(saas mode|saas configurator|saas plan|agency (view|settings|billing|dashboard|level|owner|admin|wallet|plan|team)|"
    r"white[\s-]?label\w*|rebilling|reselling|resell|affiliate program|highlevel (plans?|pricing|university|billing)|"
    r"agency pro|snapshots?)\b", re.I)

CATEGORY_RENAME = {
    "Getting Started w/ HighLevel": "Getting Started",
    "Custom Objects.": "Custom Objects",
}

APP = "https://app.kenjiai.com"
SUPPORT = "support@mediatraffics.com"
KEEP_IFRAME = re.compile(r"(youtube\.com|youtube-nocookie\.com|youtu\.be|loom\.com|vimeo\.com|wistia\.(com|net))", re.I)

# Text rebrand, most specific first. Applied to text nodes, titles and alt text.
TEXT_RULES = [
    (re.compile(r"\bhttps?://(?:help\.gohighlevel\.com|gohighlevelassist\.freshdesk\.com)[^\s<\"')]*", re.I), "kenjiai.com/help"),
    (re.compile(r"\bhelp\.gohighlevel\.com(/[^\s<\"')]*)?", re.I), "kenjiai.com/help"),
    (re.compile(r"\bapp\.gohighlevel\.com", re.I), "app.kenjiai.com"),
    (re.compile(r"\bsupport@gohighlevel\.com\b", re.I), SUPPORT),
    (re.compile(r"\b(?:www\.)?gohighlevel\.com\b", re.I), "kenjiai.com"),
    (re.compile(r"\bLead\s?Connector\s+(Phone|Email)\b", re.I), r"KenjiAI \1"),
    (re.compile(r"\bLC[\s-]+(Phone|Email)\b"), r"KenjiAI \1"),
    (re.compile(r"\bLC(Phone|Email)\b"), r"KenjiAI \1"),
    (re.compile(r"\bLeadConnector\s+(mobile\s+)?app\b", re.I), "KenjiAI mobile app"),
    (re.compile(r"\bHighLevel\s+(mobile\s+)?app\b", re.I), "KenjiAI mobile app"),
    (re.compile(r"\bGo\s?High\s?Level['’]s\b", re.I), "KenjiAI's"),
    (re.compile(r"\bHigh\s?Level['’]s\b"), "KenjiAI's"),
    (re.compile(r"\bGo\s?High\s?Level\b", re.I), "KenjiAI"),
    (re.compile(r"\bHighLevelers\b", re.I), "KenjiAI users"),
    (re.compile(r"\bHighLevels\b", re.I), "KenjiAI's"),
    (re.compile(r"\bHighLevel\b", re.I), "KenjiAI"),
    (re.compile(r"\bHigh Level\b"), "KenjiAI"),  # capitalized brand form only; "high level" prose untouched
    (re.compile(r"\bLeadConnector\b", re.I), "KenjiAI"),
    (re.compile(r"\bHL\b"), "KenjiAI"),
    (re.compile(r"\bKenjiAI\s+KenjiAI\b"), "KenjiAI"),
    # "HighLevel, LeadConnector, and Whitelabelled apps" style lists collapse to one name,
    # and mentions of white-labeled apps become the KenjiAI app.
    (re.compile(r"\bKenjiAI(?:(?:\s*(?:,|/|\band\b|\bor\b)\s*)+(?:the\s+|your\s+)?(?:KenjiAI|white[\s-]?label+ed|white[\s-]?label))+(\s+(?:mobile\s+)?apps?)?", re.I),
     lambda m: "KenjiAI" + (" mobile app" if m.group(1) else "")),
    (re.compile(r"\b(?:your\s+|the\s+|a\s+)?white[\s-]?label+(?:ed)?\s+(mobile\s+)?(apps?|application)\b", re.I), "the KenjiAI mobile app"),
    (re.compile(r"\b(the KenjiAI mobile app|KenjiAI mobile app|KenjiAI)(?:\s+(?:or|and)\s+(?:the\s+)?\1)+"), r"\1"),
    (re.compile(r"\bwhite[\s-]?label+(?:ed|ing)?\s+(sending\s+)?domains?\b", re.I), lambda m: "custom " + (m.group(1) or "") + "domain"),
    (re.compile(r"\bwhite[\s-]?label+(?:ed|ing)?\b", re.I), "branded"),
    (re.compile(r"\bKenjiAI\s*,\s*KenjiAI\b"), "KenjiAI"),
]
# Paragraphs that point people at the source company's own support desk/community.
SUPPORT_LINE_RE = re.compile(
    r"(contact (our |the )?(kenjiai |highlevel )?support|support ticket|submit a ticket|raise a ticket|"
    r"ideas board|feature request board|ideas\.gohighlevel|status page|community group|facebook group|"
    r"live chat with (our )?support|reach out to (our |the )?support)", re.I)


def rebrand(s):
    for rx, rep in TEXT_RULES:
        s = rx.sub(rep, s)
    return s


def anchor(s):
    s = re.sub(r"(?i)(%20|-|\s)?(go-?)?high-?level|lead-?connector", lambda m: (m.group(1) or "") + "KenjiAI", s)
    return s


def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-") or "general"


def parse(path):
    s = BeautifulSoup(open(path, encoding="utf-8").read(), "lxml")
    crumbs = [a.get_text(" ", strip=True) for a in s.select("ol.breadcrumb > li.breadcrumb-item > a")]
    crumbs = [c for c in crumbs if c not in ("Home", "Knowledge base")]
    title_el = s.select_one("h1.fw-page-title")
    body = s.select_one("div.fw-content--single-article") or s.select_one("div.fw-content")
    if not title_el or not body:
        return None
    mod = ""
    p = title_el.find_next("p")
    if p and "Modified on" in p.get_text():
        mod = re.sub(r"\s+", " ", p.get_text(" ", strip=True).replace("Modified on:", "")).strip()
    for sel in ["form", "svg", "script", "style", "noscript", "button", "input", "textarea"]:
        for el in body.select(sel):
            el.decompose()
    for c in body.find_all(string=lambda t: isinstance(t, Comment)):
        c.extract()
    return {"title": title_el.get_text(" ", strip=True), "crumbs": crumbs, "body": body, "updated": mod}


def clean(body, slug_by_id, kept_ids):
    st = Counter()
    for el in body.find_all(string=re.compile(r"(Did you find it helpful|Feedback sent|We appreciate your effort)", re.I)):
        par = el.find_parent(["p", "div"])
        if par is not None and par is not body:
            par.decompose()
        else:
            el.extract()
    for img in body.find_all("img"):
        src = img.get("src") or img.get("data-src") or ""
        if not src or "/logo/" in src or "no-results.png" in src or src.startswith("data:"):
            img.decompose(); st["img_dropped"] += 1; continue
        if src.startswith("/"):
            src = "https://help.gohighlevel.com" + src
        attrs = {"src": src, "alt": rebrand(img.get("alt") or ""), "loading": "lazy"}
        img.attrs = attrs
        st["img"] += 1
    for fr in body.find_all(["iframe", "embed", "object", "video"]):
        src = fr.get("src") or fr.get("data-src") or ""
        if fr.name == "iframe" and KEEP_IFRAME.search(src):
            if src.startswith("//"):
                src = "https:" + src
            fr.attrs = {"src": src, "allowfullscreen": "", "loading": "lazy", "title": "Video",
                        "allow": "accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"}
            st["video"] += 1
        elif fr.name == "video" and (fr.get("src") or fr.find("source")):
            s2 = fr.get("src") or fr.find("source").get("src", "")
            fr.clear()
            fr.attrs = {"controls": "", "preload": "metadata", "src": s2}
            st["video"] += 1
        else:
            fr.decompose()
    for a in body.find_all("a"):
        href = (a.get("href") or "").strip()
        new = None
        m = re.search(r"/support/solutions/articles/(\d+)", href)
        if href.startswith("#"):
            new = href
        elif m:
            new = f"/help/article/{slug_by_id[m.group(1)]}" if m.group(1) in kept_ids and m.group(1) in slug_by_id else None
        elif re.search(r"help\.gohighlevel\.com|^/support/", href, re.I):
            new = "/help"
        elif re.search(r"//app\.gohighlevel\.com", href, re.I):
            new = re.sub(r"(https?:)?//app\.gohighlevel\.com", APP, href, flags=re.I)
        elif re.search(r"mailto:.*(gohighlevel|leadconnector)", href, re.I):
            new = f"mailto:{SUPPORT}"
        elif re.search(r"gohighlevel|leadconnector|highlevel|gokollab", href, re.I):
            new = None
        elif href.startswith(("http://", "https://", "mailto:", "tel:")):
            new = href
        if new is None:
            if a.find("img") and re.search(r"gohighlevel\.com", href, re.I):
                a.decompose(); st["promo_dropped"] += 1; continue
            a.unwrap(); st["link_unwrapped"] += 1; continue
        a.attrs = {"href": new}
        if new.startswith("http"):
            a.attrs.update({"target": "_blank", "rel": "noopener noreferrer"})
    for el in body.find_all(True):
        if el.name in ("img", "iframe", "a", "video"):
            if el.name == "a" and el.get("href", "").startswith("#"):
                el["href"] = anchor(el["href"])
            continue
        keep = {k: v for k, v in el.attrs.items() if k in ("id", "colspan", "rowspan")}
        if "id" in keep:
            keep["id"] = anchor(keep["id"])
        if "fd-toc" in (el.get("class") or []):
            keep["class"] = "toc"
        el.attrs = keep
    for t in list(body.find_all(string=True)):
        nt = rebrand(str(t))
        if nt != str(t):
            t.replace_with(nt)
    for el in body.find_all(["p", "li"]):
        txt = el.get_text(" ", strip=True)
        if SUPPORT_LINE_RE.search(txt) and len(txt) < 400:
            el.clear(); el.append(f"Still stuck? Email {SUPPORT} and we'll help.")
            st["support_line"] += 1
    for el in body.find_all(["p", "div", "span", "strong", "em"]):
        if not el.get_text(strip=True) and not el.find(["img", "iframe", "video", "br", "table", "hr"]):
            el.decompose()
    html = body.decode_contents()
    html = re.sub(r"(<p>\s*<br/?>\s*</p>\s*)+", "<p><br/></p>", html)
    html = re.sub(r"\s*\n\s*", "\n", html).strip()
    return html, st


def main():
    urls = open(os.path.join(CACHE, "_urls.txt"), encoding="utf-8").read().split()
    img_map = json.load(open(IMG_MAP, encoding="utf-8")) if os.path.exists(IMG_MAP) else {}
    parsed, excluded, missing = {}, Counter(), 0
    slug_by_id, used = {}, set()
    for u in urls:
        m = re.search(r"/articles/(\d+)-?([^/?#]*)", u)
        aid = m.group(1)
        slug = re.sub(r"[^a-z0-9]+", "-", (m.group(2) or "").lower()).strip("-")
        slug = slugify(rebrand(slug.replace("-", " ")))[:90].strip("-") or aid
        if slug in used:
            slug = f"{slug}-{aid[-5:]}"
        used.add(slug)
        slug_by_id[aid] = slug
        f = os.path.join(CACHE, f"{aid}.html")
        if not os.path.exists(f):
            missing += 1; continue
        p = parse(f)
        if not p:
            missing += 1; continue
        cat = p["crumbs"][0] if p["crumbs"] else "General"
        folder = p["crumbs"][1] if len(p["crumbs"]) > 1 else cat
        if cat in EXCLUDE_CATEGORIES:
            excluded[f"category: {cat}"] += 1; continue
        if EXCLUDE_FOLDER_RE.search(folder):
            excluded[f"folder: {cat} / {folder}"] += 1; continue
        if EXCLUDE_TITLE_RE.search(p["title"]):
            excluded[f"title: {cat} / {folder}"] += 1; continue
        p["cat"], p["folder"] = cat, folder
        parsed[aid] = p
    kept = set(parsed)
    shutil.rmtree(os.path.join(OUT, "articles"), ignore_errors=True)
    os.makedirs(os.path.join(OUT, "articles"), exist_ok=True)
    index, tot = [], Counter()
    for aid, p in parsed.items():
        html, st = clean(p["body"], slug_by_id, kept)
        tot.update(st)
        for old, new in img_map.items():
            if old in html:
                html = html.replace(old, new); tot["img_logo_cleaned"] += 1
        cat = rebrand(CATEGORY_RENAME.get(p["cat"], p["cat"])).strip(". ")
        folder = rebrand(p["folder"]).strip(". ")
        title = rebrand(p["title"])
        text = re.sub(r"\s+", " ", BeautifulSoup(html, "lxml").get_text(" ", strip=True))
        text = re.sub(r"^.*?TABLE OF CONTENTS.*?(?=Related Articles|$)", lambda mm: mm.group(0).split("TABLE OF CONTENTS")[0], text, count=1)
        excerpt = text[:160].rsplit(" ", 1)[0] + ("..." if len(text) > 160 else "")
        slug = slug_by_id[aid]
        index.append({"id": aid, "slug": slug, "title": title, "category": cat, "categorySlug": slugify(cat),
                      "folder": folder, "excerpt": excerpt})
        with open(os.path.join(OUT, "articles", f"{slug}.json"), "w", encoding="utf-8") as fh:
            json.dump({"title": title, "category": cat, "categorySlug": slugify(cat), "folder": folder,
                       "html": html, "updated": p["updated"]}, fh, ensure_ascii=False, separators=(",", ":"))
    index.sort(key=lambda r: (r["category"], r["folder"], r["title"]))
    with open(os.path.join(OUT, "index.json"), "w", encoding="utf-8") as fh:
        json.dump(index, fh, ensure_ascii=False, separators=(",", ":"))

    size = sum(os.path.getsize(os.path.join(dp, f)) for dp, _, fs in os.walk(OUT) for f in fs)
    print(f"published {len(index)}  excluded {sum(excluded.values())}  missing/unparsed {missing}  size {size/1e6:.1f} MB")
    print("stats", dict(tot))
    for k, v in sorted(excluded.items(), key=lambda x: (x[0].split(":")[0], -x[1])):
        print(f"  excluded {v:4d}  {k}")
    left, vis = Counter(), 0
    for fn in os.listdir(os.path.join(OUT, "articles")):
        d = json.load(open(os.path.join(OUT, "articles", fn), encoding="utf-8"))
        t = BeautifulSoup(d["html"], "lxml").get_text(" ") + " " + d["title"] + " " + d["folder"]
        for mm in re.findall(r"[\w.@/-]*(?:highlevel|leadconnector)[\w.@/-]*", t, re.I):
            left[mm.lower()] += 1; vis += 1
        for mm in re.findall(r"(?:src|href)=\"([^\"]*(?:highlevel|leadconnector)[^\"]*)\"", d["html"], re.I):
            left["URL " + re.sub(r"^https?://([^/]+).*", r"\1", mm)] += 1
    print("leftover visible-text mentions:", vis)
    for k, v in left.most_common(30):
        print(f"  {v:5d} {k}")
    print("categories:", dict(Counter(r["category"] for r in index)))


if __name__ == "__main__":
    main()
