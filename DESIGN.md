---
name: Media Traffics | KenjiAI
description: Ads agency first, follow-up software second. Dark ledger world for the homepage and growth quiz funnel.
colors:
  night-ground: "#0B0E14"
  harbor-glow: "#142133"
  warm-paper: "#F3EEE6"
  mist: "#C9D2DE"
  slate-mist: "#A9B4C4"
  dusk-gray: "#7D8899"
  signal-teal: "#5EEAD4"
  signal-teal-bright: "#7FF0DF"
  deep-kelp: "#06221E"
  burned-coral: "#FFB4A1"
  hairline: "rgba(255, 255, 255, 0.10)"
  control-stroke: "rgba(255, 255, 255, 0.12)"
  control-fill: "rgba(255, 255, 255, 0.035)"
typography:
  display:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(40px, 6vw, 68px)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.02em"
  stat:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(56px, 9vw, 104px)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(34px, 4.5vw, 48px)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(26px, 3vw, 30px)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  quote:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(24px, 3vw, 30px)"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body-lead:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.625
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.5
  meta:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  chip: "8px"
  control: "16px"
  panel: "24px"
  pill: "9999px"
spacing:
  gutter-mobile: "20px"
  gutter-desktop: "32px"
  section-mobile: "80px"
  section-desktop: "112px"
  ledger-column-gap: "40px"
  control-gap: "12px"
components:
  button-primary:
    backgroundColor: "{colors.signal-teal}"
    textColor: "{colors.deep-kelp}"
    typography: "{typography.body-lead}"
    rounded: "{rounded.control}"
    padding: "16px 28px"
  button-primary-hover:
    backgroundColor: "{colors.signal-teal-bright}"
    textColor: "{colors.deep-kelp}"
  answer-option:
    backgroundColor: "{colors.control-fill}"
    textColor: "{colors.warm-paper}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "16px"
  answer-option-index:
    backgroundColor: "rgba(255, 255, 255, 0.08)"
    textColor: "{colors.slate-mist}"
    rounded: "{rounded.chip}"
    size: "32px"
  answer-option-index-active:
    backgroundColor: "{colors.signal-teal}"
    textColor: "{colors.deep-kelp}"
  input-text:
    backgroundColor: "rgba(255, 255, 255, 0.04)"
    textColor: "{colors.warm-paper}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "14px 16px"
  progress-bar:
    backgroundColor: "{colors.hairline}"
    rounded: "{rounded.pill}"
    height: "6px"
---

# Design System: Media Traffics | KenjiAI

**Scope, stated honestly.** This system covers the new world shipped on 2026-10-08: the homepage (`src/pages/HomePage.tsx`) and the growth quiz funnel (`src/pages/GrowthQuizPage.tsx`, including its booking and next-step pages), plus the `home` variant of `ReviewsNative`. The global nav, footer and older pages still use the earlier blue/green gradient look and are not described here. That older look is not part of this system; new surfaces should use this one. Tokens live as literal values inside each page (scoped under `.kh` on the homepage and `.gq` on the quiz) rather than in a shared stylesheet or Tailwind theme.

## Overview

**Creative North Star: "The Ledger at Night"**

The world is one argument laid out like an account book: the same ad spend, without a system and with ours, line by line, ending in a result. A near-black blue ground with a soft harbor glow at the top, warm paper-colored type, and a single teal that means both "with us" and "do this". Coral is the only other voice, reserved for what is lost.

Density is low and the pages read top to bottom in long, quiet sections separated by hairlines, never boxed into tiles. The display face is a heavy, slightly quirky grotesque that does the shouting so the body copy can stay plain. Warmth comes from the cream type and generous spacing, not from decoration: no banners, no scarcity devices, no pulsing calls to action (a brand commitment in PRODUCT.md that this world honors).

**Key Characteristics:**
- Dark ground (night-ground) with a radial top glow (harbor-glow), never a flat black.
- One action color (signal-teal) that also carries every "with us" gain.
- Coral (burned-coral) only for losses and errors.
- Content separated by white hairlines and whitespace, not cards.
- Heavy Bricolage Grotesque display at -0.02em, system-stack body.
- Generously rounded controls (16px); motion is a short ease-out reveal, always skipped under reduced motion.

## Colors

A cool night palette warmed by cream type, with one teal accent and one coral counterpoint.

### Primary
- **Signal Teal** (signal-teal): the primary button fill, the "with us" column header and check marks, the result figure ("5x return on ad spend", "One funnel. $186K."), focus outlines, hover borders on answer options, the progress fill and the text-selection tint (at 35%).
- **Signal Teal Bright** (signal-teal-bright): primary button hover only.
- **Deep Kelp** (deep-kelp): text and numerals placed on Signal Teal.

### Secondary
- **Burned Coral** (burned-coral): the "without a system" column, its minus marks, the struck-through loss outcome, and form error messages. Loss rows sit at 75% opacity, the loss outcome at 80% with a 50% strikethrough.

### Neutral
- **Night Ground** (night-ground): page background and base color under the glow.
- **Harbor Glow** (harbor-glow): center of the radial top glow, `radial-gradient(120% 60% at 50% -5%, harbor-glow 0%, night-ground 55%)` on the homepage (120% 70% at 50% -10% on the quiz).
- **Warm Paper** (warm-paper): headings, primary text, "with us" row text, link text.
- **Mist** (mist): lead paragraphs and supporting body copy.
- **Slate Mist** (slate-mist): meta lines (proof lines, quiz helper text, phone line), unselected answer index numbers.
- **Dusk Gray** (dusk-gray): ledger row labels and input placeholders.
- **Hairline** (hairline): every section divider, ledger row rule and column divider.
- **Control Stroke / Control Fill** (control-stroke, control-fill): the resting border and fill of answer options.

### Named Rules
**The One Teal Rule.** Teal means two things only: the action, and the "with us" side of the argument. Never use it as decoration or as a second section color.

**The Coral Is Loss Rule.** Coral appears only for what the visitor loses without a system, or for an error. It never labels an action.

## Typography

**Display Font:** Bricolage Grotesque, weights 600 and 800, optical size 12..96 (Google Fonts, loaded per page), with ui-sans-serif, system-ui fallback
**Body Font:** System stack (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif)

**Character:** A heavy, characterful grotesque for every heading and figure, paired with an invisible system body so the argument reads like plain talk.

### Hierarchy
- **Display** (800, 40 / 56 / 68px by breakpoint, 0.98): the page H1. Balanced wrap, max about 4xl wide.
- **Stat** (800, 56 / 88 / 104px, 0.9): a single proof figure set in teal. One per page at most.
- **Headline** (800, 34 / 48px, 1.02): section H2s.
- **Title** (800, 26 / 30px): H3s and the quiz question legend (22 / 26px on the homepage quiz start).
- **Quote** (600, 24 / 30px, 1.3): the featured review excerpt.
- **Body Lead** (400, 18 to 20px, 1.625): the paragraph under a heading, measure 46 to 66ch.
- **Body** (400 or 500, 17px): ledger cells, answer options, lists.
- **Meta** (400, 15px): proof lines and helper text in slate-mist.
- **Label** (600, 14px, sentence case): ledger row headers in dusk-gray, column headers at 15px in their column color.

### Named Rules
**The Display Does The Shouting Rule.** Emphasis lives in size and weight of the display face. Body copy stays regular weight; no all-caps, no tracked-out small caps, no gradient or outlined text.

## Layout

Single-column flow inside a 1152px container (max-w-6xl), with 768px (max-w-3xl) for the closing section and quiz flow. Gutters are 20px on mobile and 32px from 640px up. Sections run 80px top and bottom on mobile and 112px from 640px, each opened by a top hairline.

The signature layout is the comparison ledger: from 768px it is a three-column grid (150px label, then two equal columns) with a 40px column gap, every row closed by a hairline, ending in an outcome row set in display type. Below 768px the label stacks above both cells and the column headers collapse to an inline key with minus and check icons. Two-part explanations use a two-column split with a hairline vertical divider from 768px. Answer options sit in a 12px-gap grid, two columns from 640px.

## Elevation & Depth

Flat and tonal. Depth comes from the radial glow behind the first viewport and from translucent white fills on controls, not from shadows. The one recurring shadow is a soft teal bloom under the primary button. The quiz's booking page frames the third-party calendar embed in a white rounded panel with a dark drop shadow so it reads as a separate surface; that is a containment device for an embed, not a pattern.

### Shadow Vocabulary
- **Teal bloom** (`box-shadow: 0 14px 34px -14px rgba(94,234,212,0.7)`): under the primary button only.

### Named Rules
**The Hairline Not Box Rule.** Group and separate with white/10 hairlines and space. Don't wrap content in cards to make sections.

## Shapes

Generously rounded controls (16px) on buttons, answer options and inputs; small 8px squares for the numbered answer index; full pills for the progress track. Focus outlines are 2px teal, offset 3px, with a 14px radius so they follow the controls. Content blocks themselves are unframed. The 24px radius is used only for the embedded calendar frame and the single $7 offer panel on the quiz next-step page.

## Components

### Buttons
Confident, warm, one per view.
- **Shape:** generously rounded (16px).
- **Primary:** Signal Teal fill, Deep Kelp text, bold 18px, 16px by 28px padding, trailing arrow icon, teal bloom shadow.
- **Hover / Focus:** fill shifts to Signal Teal Bright (color transition only, no movement); focus shows the 2px teal outline.
- **Text link:** Warm Paper semibold with a white/30 underline offset 4px; the underline turns teal on hover.

### Answer Options (signature)
The quiz's tappable answers, reused as the homepage's inline quiz start.
- **Style:** full-width row, 16px radius, control-stroke border, control-fill background, 17 to 18px medium text, an 8px-radius 32px numbered index on the left (white/8 fill, slate-mist numeral, tabular figures), arrow on the right on the homepage.
- **State:** hover (hover-capable devices only) or selected turns the border teal, the fill teal at 12%, and the index teal with Deep Kelp numeral. Selection drives navigation, so there is no separate submit.

### Inputs / Fields
- **Style:** 16px radius, white/15 border, white/4 fill, 17px text, Dusk Gray placeholder, teal caret.
- **Focus:** border turns Signal Teal; default outline removed in favor of the border shift.
- **Error:** a 15px semibold Burned Coral message with `role="alert"` above the submit.

### Progress
- 6px pill track in hairline white with a teal fill that eases to the new width over 0.45s.

### Comparison Ledger (signature)
- Column headers in their column color (coral, teal); loss cells in coral at 75% with a minus icon; gain cells in Warm Paper medium with a teal check; outcome row in display type, loss struck through, gain in teal. On load the gain cells light up one after another (opacity 0.25 to 1, 6px slide, 0.55s, 0.18s stagger, ease `cubic-bezier(0.16, 1, 0.3, 1)`); with reduced motion everything is visible immediately.

## Do's and Don'ts

### Do:
- **Do** set every new surface in this world on the night-ground with the harbor-glow radial at the top.
- **Do** use Signal Teal for the one action and the "with us" side, with Deep Kelp text on it.
- **Do** separate sections and rows with white/10 hairlines and open each section with a top hairline.
- **Do** set headings and figures in Bricolage Grotesque 800 at -0.02em, and keep body in the system stack.
- **Do** honor reduced motion: every entrance and reveal renders in its final state when it is set.
- **Do** keep the 16px control radius and 2px teal focus outline on anything interactive.

### Don't:
- **Don't** build card grids, feature tiles or boxed sections; the world groups with hairlines and space.
- **Don't** put gradients, outlines or clip effects on text.
- **Don't** use coral for anything but loss or error.
- **Don't** bring in the older site's blue/green gradients, or Tailwind gray text, inside this world.
- **Don't** add banners, scarcity badges, exit popups or pulsing buttons (PRODUCT.md brand commitment).
