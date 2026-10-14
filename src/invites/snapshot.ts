import { THEME_FONTS, fontCssUrl } from './format';
import type { ThemeId } from './shared';

// Turns an on-page stage (the card in its design) into an image, in the browser.
// Used for link-preview pictures (wizard) and "Save invitation to my phone" (guest page).
// html-to-image is only loaded when a picture is actually made.

/** The design's Google Fonts (latin subset only) with the font files inlined, so the
 *  snapshot (an SVG image, which can't load remote fonts) uses the real typefaces. */
async function embeddedFontCss(keys: string[]): Promise<string> {
  const css = await (await fetch(fontCssUrl(keys))).text();
  const blocks = css.split('/* ').filter((b) => b.startsWith('latin */'));
  const out = await Promise.all(blocks.map(async (b) => {
    const face = b.slice(b.indexOf('@font-face'));
    const m = /url\((https:[^)]+)\)/.exec(face);
    if (!m) return '';
    const blob = await (await fetch(m[1])).blob();
    const dataUrl = await new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = rej; r.readAsDataURL(blob); });
    return face.replace(m[1], dataUrl);
  }));
  return out.join('\n');
}

let busy = false;
/** Renders `node` at width x height. Returns a data: URL, or null if it could not. */
/** `fonts`: a design (its fonts) or a list of font keys (a design plus a chosen pairing). */
export async function captureNode(node: HTMLElement, fonts: ThemeId | string[], width: number, height: number, type: 'jpeg' | 'png'): Promise<string | null> {
  if (busy) return null;
  busy = true;
  try {
    const lib = await import('html-to-image');
    let fontEmbedCSS = '';
    try { fontEmbedCSS = await embeddedFontCss(Array.isArray(fonts) ? fonts : THEME_FONTS[fonts]); } catch { /* fonts optional */ }
    await document.fonts.ready;
    const opts = { width, height, pixelRatio: 1, fontEmbedCSS, cacheBust: false, skipAutoScale: true };
    return type === 'png' ? await lib.toPng(node, opts) : await lib.toJpeg(node, { ...opts, quality: 0.86 });
  } catch {
    return null;
  } finally {
    busy = false;
  }
}
