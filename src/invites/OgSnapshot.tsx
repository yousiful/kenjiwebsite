import { forwardRef } from 'react';
import InvitationCard, { THEMES, type CardData } from './InvitationCard';
import { THEME_FONTS, fontCssUrl } from './format';
import type { ThemeId } from './shared';

// Link-preview image (Open Graph) for an invitation: a 1200x630 picture of the card in
// its design, made in the host's own browser from the live preview and uploaded with
// the event. Link previews (iMessage, WhatsApp, Messenger, email) show this image.

/** Hidden 1200x630 stage holding the card, rendered off screen inside the wizard. */
export const OgStage = forwardRef<HTMLDivElement, { data: CardData }>(function OgStage({ data }, ref) {
  const [bg, ink] = THEMES[data.theme]?.swatch || ['#fbf6ea', '#b8913f'];
  return (
    <div className="kv-og-host" aria-hidden="true">
      <div ref={ref} className="kv-og" style={{ background: `radial-gradient(120% 120% at 50% 0%, ${bg} 0%, color-mix(in srgb, ${bg} 82%, ${ink}) 100%)` }}>
        <div className="kv-og-card">
          <InvitationCard data={{ ...data, personalMessage: '' }} />
        </div>
      </div>
    </div>
  );
});

/** The design's Google Fonts (latin subset only) with the font files inlined, so the
 *  snapshot (an SVG image, which can't load remote fonts) uses the real typefaces. */
async function embeddedFontCss(theme: ThemeId): Promise<string> {
  const css = await (await fetch(fontCssUrl(THEME_FONTS[theme]))).text();
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
/** Renders the stage to a JPEG and returns its base64 (no data: prefix). */
export async function snapshotOg(node: HTMLElement, theme: ThemeId): Promise<string | null> {
  if (busy) return null;
  busy = true;
  try {
    const { toJpeg } = await import('html-to-image');
    let fontEmbedCSS = '';
    try { fontEmbedCSS = await embeddedFontCss(theme); } catch { /* fonts optional */ }
    await document.fonts.ready;
    const url = await toJpeg(node, { quality: 0.86, width: 1200, height: 630, pixelRatio: 1, fontEmbedCSS, cacheBust: false, skipAutoScale: true });
    return url.split(',')[1] || null;
  } catch {
    return null;
  } finally {
    busy = false;
  }
}
