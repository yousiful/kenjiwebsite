import { forwardRef } from 'react';
import InvitationCard, { THEMES, type CardData } from './InvitationCard';
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

/** Renders the stage to a JPEG and returns its base64 (no data: prefix). */
export async function snapshotOg(node: HTMLElement, theme: ThemeId): Promise<string | null> {
  const { captureNode } = await import('./snapshot');
  const url = await captureNode(node, theme, 1200, 630, 'jpeg');
  return url ? url.split(',')[1] || null : null;
}
