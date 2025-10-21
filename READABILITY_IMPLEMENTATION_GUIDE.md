# Readability & Accessibility Implementation Guide

## Quick Start

### Step 1: Import the CSS File

Add to your `src/main.tsx` or `src/index.tsx`:

```tsx
import './index.css';
import './styles/readability.css';  // Add this line
```

### Step 2: Integrate with Accessibility Controls

Update `AccessibilityControls.tsx` to apply readability classes:

```tsx
const applyPreferences = (prefs: AccessibilityPreferences) => {
  const root = document.documentElement;

  // Font size
  root.style.fontSize = `${prefs.fontSize}px`;

  // High contrast
  root.classList.toggle('high-contrast', prefs.highContrast);

  // Reduce motion
  root.classList.toggle('reduce-motion', prefs.reduceMotion);

  // Dyslexic font
  root.classList.toggle('dyslexia-friendly-text', prefs.dyslexicFont);
};
```

---

## Component-Specific Fixes

### Hero Component

#### Current Issues
```tsx
// Line 118 - Too large
className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white mb-8 leading-tight"

// Line 133 - Too wide, poor contrast
className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-6xl mx-auto leading-relaxed"

// Line 229 - Poor contrast
className="mt-16 flex items-center justify-center gap-8 text-gray-500 text-sm"
```

#### Fixed Version
```tsx
// Replace line 118
className="heading-accessible heading-accessible-h1 text-white mb-8"

// Replace line 133
className="text-readable-lg text-accessible-gray-light mb-12 max-w-readable mx-auto leading-relaxed-enhanced prose-enhanced"

// Replace line 229
className="mt-16 flex items-center justify-center gap-8 text-accessible-gray text-readable-base"
```

#### Complete Fixed Hero Snippet
```tsx
<h1 className="heading-accessible heading-accessible-h1 text-white mb-8">
  <span className="text-white">
    {text}
    <span className="animate-pulse text-pink-400">|</span>
  </span>
</h1>

<div className="prose-enhanced">
  <p className="text-readable-lg text-accessible-gray-light mb-4 max-w-readable mx-auto leading-relaxed-enhanced">
    {currentValue.text}
  </p>
  <p className="text-readable-xl font-bold text-yellow-300 max-w-readable mx-auto">
    {currentValue.highlight}
  </p>
</div>
```

---

### Features Component

#### Current Issues
```tsx
// Line 159 - OK structure, but could be smaller
className="text-4xl sm:text-5xl font-bold text-white mb-6"

// Line 164 - OK size, poor contrast
className="text-xl text-gray-400 max-w-4xl mx-auto"

// Line 196 - OK
className="text-lg font-semibold text-white mb-3"

// Line 199 - Too small, poor contrast
className="text-gray-400 text-sm leading-relaxed"
```

#### Fixed Version
```tsx
// Replace line 159
className="heading-accessible heading-accessible-h2 text-white mb-6"

// Replace line 164
className="text-readable-lg text-accessible-gray-light max-w-readable mx-auto"

// Replace line 196 (already good, enhance)
className="heading-accessible-h3 text-white mb-3 group-hover:text-blue-300 transition-colors"

// Replace line 199
className="text-accessible-gray text-readable-base leading-relaxed-enhanced group-hover:text-accessible-gray-light transition-colors mb-4"
```

---

### Knowledge Base Page

#### Current Issues
```tsx
// Line 62 - Extreme size range
className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4"

// Line 69 - Too wide
className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8"
```

#### Fixed Version
```tsx
// Replace line 62
className="heading-accessible heading-accessible-h1 text-white mb-4"

// Replace line 69
className="text-readable-lg text-accessible-gray-light max-w-readable mx-auto leading-relaxed-enhanced mb-8 prose-enhanced"
```

---

### Pricing Section

#### Current Issues
```tsx
// Various small text instances
className="text-gray-400 text-sm"
className="text-gray-500 text-xs"
```

#### Fixed Version
```tsx
// Replace small gray text
className="text-accessible-gray text-readable-sm"

// Replace very small text
className="text-accessible-gray-light text-readable-sm"
```

---

## Global Text Replacement Guide

### Find & Replace Patterns

#### Pattern 1: Gray Text Contrast
```tsx
// Find:
text-gray-500

// Replace with:
text-accessible-gray
```

```tsx
// Find:
text-gray-400

// Replace with:
text-accessible-gray
```

#### Pattern 2: Text Sizing
```tsx
// Find:
text-sm

// Replace with:
text-readable-sm
```

```tsx
// Find:
className="([^"]*\s)?(text-xl)(\s[^"]*)?

// Replace with:
className="$1text-readable-lg$3
```

#### Pattern 3: Line Heights
```tsx
// Find:
leading-relaxed

// Replace with:
leading-relaxed-enhanced
```

#### Pattern 4: Max Width
```tsx
// Find:
max-w-6xl

// Replace with (for text content):
max-w-readable
```

```tsx
// Find:
max-w-4xl

// Replace with (for text content):
max-w-readable
```

---

## Heading Structure Template

### Correct Implementation

```tsx
// Page Title (H1)
<h1 className="heading-accessible heading-accessible-h1 text-white mb-6">
  Your Page Title
</h1>

// Section Title (H2)
<h2 className="heading-accessible heading-accessible-h2 text-white mb-4">
  Section Title
</h2>

// Subsection Title (H3)
<h3 className="heading-accessible-h3 text-white mb-3">
  Subsection Title
</h3>

// Minor Heading (H4)
<h4 className="heading-accessible-h4 text-accessible-gray-light mb-2">
  Minor Heading
</h4>
```

### Body Text Template

```tsx
// Standard paragraph
<p className="text-readable-base text-accessible-gray-light leading-relaxed-enhanced mb-4">
  Your paragraph text here.
</p>

// Important paragraph
<p className="text-readable-lg text-white leading-relaxed-enhanced mb-4">
  Important text that needs emphasis.
</p>

// Small text (captions, footnotes)
<p className="text-readable-sm text-accessible-gray leading-normal-enhanced">
  Small supporting text.
</p>

// In a prose container
<div className="prose-enhanced max-w-readable mx-auto">
  <p>First paragraph.</p>
  <p>Second paragraph with automatic spacing.</p>
</div>
```

---

## Button Text Template

```tsx
// Standard button
<button className="button-readable bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
  Click Me
</button>

// Large button
<button className="button-readable-lg bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
  Primary Action
</button>

// With icon
<button className="button-readable bg-blue-600 text-white rounded-lg flex items-center gap-2">
  <IconComponent className="w-5 h-5" />
  <span>Button Text</span>
</button>
```

---

## Link Text Template

```tsx
// Inline link
<a href="/page" className="link-accessible">
  Link text
</a>

// Text link in paragraph
<p className="text-readable-base text-accessible-gray-light">
  This is a paragraph with an <a href="/link" className="text-link-accessible">inline link</a> inside it.
</p>

// Navigation link
<nav>
  <a href="/page" className="link-accessible focus-enhanced">
    Navigation Item
  </a>
</nav>
```

---

## Form Elements Template

```tsx
// Complete form example
<form className="space-y-4">
  <div>
    <label htmlFor="email" className="form-label-accessible">
      Email Address
      <span className="text-accessible-error" aria-label="required">*</span>
    </label>
    <input
      type="email"
      id="email"
      className="form-input-accessible w-full"
      required
      aria-describedby="email-help"
    />
    <p id="email-help" className="form-help-accessible">
      We'll never share your email with anyone else.
    </p>
  </div>

  <div>
    <label htmlFor="message" className="form-label-accessible">
      Message
    </label>
    <textarea
      id="message"
      className="form-input-accessible w-full"
      rows={4}
      aria-describedby="message-error"
    />
    <p id="message-error" className="form-error-accessible" role="alert">
      Please enter at least 10 characters.
    </p>
  </div>

  <button type="submit" className="button-readable-lg bg-blue-600 text-white">
    Submit Form
  </button>
</form>
```

---

## List Templates

```tsx
// Readable unordered list
<ul className="list-readable">
  <li>First item with proper spacing</li>
  <li>Second item with comfortable line height</li>
  <li>Third item with accessible marker color</li>
</ul>

// Readable ordered list
<ol className="list-readable">
  <li>Step one with clear numbering</li>
  <li>Step two with adequate spacing</li>
  <li>Step three with readable text</li>
</ol>
```

---

## Table Template

```tsx
<table className="table-readable">
  <thead>
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
      <th>Column 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
      <td>Data 3</td>
    </tr>
    <tr>
      <td>Data 4</td>
      <td>Data 5</td>
      <td>Data 6</td>
    </tr>
  </tbody>
</table>
```

---

## Dyslexia-Friendly Mode

### Enable for Entire Page

```tsx
// In your main layout or App component
<div className={isDyslexiaMode ? 'dyslexia-friendly-text' : ''}>
  {/* All your content */}
</div>
```

### Enable for Specific Sections

```tsx
<article className="dyslexia-friendly-text prose-enhanced-dyslexic">
  <h1>Article Title</h1>
  <p>Article content with dyslexia-friendly typography.</p>
  <p>Automatic paragraph spacing and optimal line height.</p>
</article>
```

---

## Responsive Text Examples

```tsx
// Mobile-optimized text
<p className="responsive-text-base text-accessible-gray-light leading-relaxed-enhanced">
  This text will be 16px on all screens, perfect for mobile reading.
</p>

// Adaptive heading
<h1 className="heading-accessible-h1 text-white">
  This heading scales from 32px to 48px using clamp()
</h1>
```

---

## Testing Checklist

### After Making Changes

1. **Contrast Testing**
```bash
# Use browser DevTools Lighthouse
# Or install aXe DevTools extension
```

2. **Font Size Testing**
```bash
# Zoom to 200% in browser (Cmd/Ctrl + +)
# Ensure all text is readable
```

3. **Dyslexia Testing**
```tsx
// Enable dyslexia mode via AccessibilityControls
// Read sample paragraphs
// Check letter spacing and line height
```

4. **Screen Reader Testing**
```bash
# Mac: Enable VoiceOver (Cmd+F5)
# Windows: Use NVDA (free) or JAWS
# Test heading navigation
```

---

## Before & After Examples

### Example 1: Hero Subheading

**Before** (Poor contrast, too wide):
```tsx
<p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-6xl mx-auto leading-relaxed">
  Stop losing money to manual work. Our AI voice agents close deals 24/7.
</p>
```

**After** (Good contrast, optimal width):
```tsx
<p className="text-readable-lg text-accessible-gray-light mb-12 max-w-readable mx-auto leading-relaxed-enhanced prose-enhanced">
  Stop losing money to manual work. Our AI voice agents close deals 24/7.
</p>
```

### Example 2: Feature Description

**Before** (Too small, poor contrast):
```tsx
<p className="text-gray-400 text-sm leading-relaxed">
  AI agents that handle sales calls, qualify leads, and close deals 24/7 - generating revenue while you sleep
</p>
```

**After** (Readable size, good contrast):
```tsx
<p className="text-accessible-gray text-readable-base leading-relaxed-enhanced">
  AI agents that handle sales calls, qualify leads, and close deals 24/7 - generating revenue while you sleep
</p>
```

### Example 3: Trust Indicator

**Before** (Fails contrast):
```tsx
<span className="text-gray-500 text-sm">Bank-Level Security</span>
```

**After** (Passes contrast):
```tsx
<span className="text-accessible-gray text-readable-base">Bank-Level Security</span>
```

---

## CSS Custom Properties (Optional Enhancement)

Add to your `index.css` for theme-wide control:

```css
:root {
  /* Readable font sizes */
  --text-readable-sm: 0.875rem;  /* 14px */
  --text-readable-base: 1rem;     /* 16px */
  --text-readable-lg: 1.125rem;   /* 18px */
  --text-readable-xl: 1.25rem;    /* 20px */

  /* Accessible colors */
  --text-accessible-primary: #FFFFFF;
  --text-accessible-secondary: #E5E7EB;
  --text-accessible-tertiary: #D1D5DB;

  /* Line heights */
  --leading-tight: 1.1;
  --leading-normal: 1.6;
  --leading-relaxed: 1.7;
  --leading-loose: 1.8;

  /* Line length */
  --max-w-readable: 75ch;
}
```

---

## Common Mistakes to Avoid

### ❌ Don't Do This

```tsx
// TOO SMALL
<p className="text-xs text-gray-500">Important text</p>

// TOO WIDE
<p className="max-w-7xl">Long paragraph of text</p>

// POOR CONTRAST
<span className="text-gray-400">Button label</span>

// TOO LARGE
<h1 className="text-9xl">Page title</h1>

// JUSTIFIED TEXT (bad for dyslexia)
<p className="text-justify">Paragraph text</p>
```

### ✅ Do This Instead

```tsx
// READABLE SIZE
<p className="text-readable-sm text-accessible-gray">Important text</p>

// OPTIMAL WIDTH
<p className="max-w-readable">Long paragraph of text</p>

// GOOD CONTRAST
<span className="text-accessible-gray-light">Button label</span>

// APPROPRIATE SIZE
<h1 className="heading-accessible-h1">Page title</h1>

// LEFT-ALIGNED (good for dyslexia)
<p className="text-left">Paragraph text</p>
```

---

## Migration Strategy

### Phase 1: Critical Fixes (Day 1-2)
1. Replace all `text-gray-500` with `text-accessible-gray`
2. Replace all `text-gray-400` with `text-accessible-gray`
3. Fix Hero component contrast
4. Add `readability.css` to imports

### Phase 2: Typography Improvements (Day 3-5)
5. Update all headings to use heading classes
6. Fix text sizing (sm → readable-sm, etc.)
7. Adjust line heights
8. Fix line lengths (max-w-*)

### Phase 3: Polish (Day 6-7)
9. Add dyslexia-friendly mode toggle
10. Test with screen readers
11. Validate contrast ratios
12. User testing

---

## Success Metrics

After implementation, you should see:

- ✅ **Lighthouse Accessibility Score**: 95+ (from ~75)
- ✅ **Contrast Ratio**: All text 4.5:1 or better
- ✅ **Minimum Font Size**: 14px (nothing smaller)
- ✅ **Optimal Line Length**: 45-75 characters
- ✅ **Heading Hierarchy**: Clear H1-H6 structure
- ✅ **Screen Reader**: Perfect heading navigation
- ✅ **Dyslexia Support**: Adjustable typography available

---

## Support Resources

- **Audit Report**: `READABILITY_ACCESSIBILITY_AUDIT.md`
- **CSS File**: `src/styles/readability.css`
- **Test with**: aXe DevTools, WAVE, Lighthouse
- **Validate**: WebAIM Contrast Checker

---

## Questions?

Review the audit report for detailed explanations of each issue and the reasoning behind these recommendations.
