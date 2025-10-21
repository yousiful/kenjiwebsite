# Readability & Accessibility Quick Reference Card

## 🚨 Critical Issues Found

| Issue | Current | Impact | Fix |
|-------|---------|--------|-----|
| **Contrast** | text-gray-500 (2.1:1) | ❌ WCAG Fail | text-accessible-gray (4.9:1) |
| **Contrast** | text-gray-400 (3.2:1) | ❌ WCAG Fail | text-accessible-gray (4.9:1) |
| **Font Size** | text-sm (14px) | ⚠️ Too Small | text-readable-base (16px) |
| **Line Length** | max-w-6xl (1152px) | ❌ Too Wide | max-w-readable (75ch) |
| **Heading Size** | text-8xl (96px) | ❌ Excessive | text-4xl (48px) max |

---

## ✅ Quick Fixes

### Replace These Classes

```css
/* CONTRAST FIXES */
text-gray-500      → text-accessible-gray
text-gray-400      → text-accessible-gray
text-gray-300      → text-accessible-gray-light (when needed)

/* SIZING FIXES */
text-xs            → text-readable-sm (14px minimum)
text-sm            → text-readable-sm or text-readable-base
text-base          → text-readable-base
text-xl            → text-readable-lg
text-2xl           → text-readable-xl

/* LINE HEIGHT FIXES */
leading-tight      → leading-tight-enhanced (1.1)
leading-normal     → leading-normal-enhanced (1.6)
leading-relaxed    → leading-relaxed-enhanced (1.7)

/* LINE LENGTH FIXES */
max-w-6xl          → max-w-readable (for text)
max-w-4xl          → max-w-readable (for text)
max-w-3xl          → max-w-readable-narrow
```

---

## 📏 Typography Scale

### Font Sizes (Mobile-First)

| Class | Size | Use For |
|-------|------|---------|
| `text-readable-sm` | 14px | Captions, fine print (minimum) |
| `text-readable-base` | 16px | Body text (ideal) |
| `text-readable-lg` | 18px | Comfortable body text |
| `text-readable-xl` | 20px | Large body text, emphasis |

### Headings

| Element | Class | Size Range |
|---------|-------|------------|
| `<h1>` | `heading-accessible-h1` | 32px-48px |
| `<h2>` | `heading-accessible-h2` | 24px-32px |
| `<h3>` | `heading-accessible-h3` | 20px-24px |
| `<h4>` | `heading-accessible-h4` | 18px-20px |

---

## 🎨 Accessible Colors (on bg-gray-900)

| Class | Hex | Contrast | Status |
|-------|-----|----------|--------|
| `text-white` | #FFFFFF | 14.5:1 | ✅ AAA |
| `text-accessible-gray-light` | #E5E7EB | 6.4:1 | ✅ AAA |
| `text-accessible-gray` | #D1D5DB | 4.9:1 | ✅ AA |
| `text-gray-300` | #D1D5DB | 4.9:1 | ✅ AA |
| `text-gray-400` | #9CA3AF | 3.2:1 | ❌ FAIL |
| `text-gray-500` | #6B7280 | 2.1:1 | ❌ FAIL |

**Rule**: Only use gray-300 or lighter on dark backgrounds!

---

## 📖 Component Templates

### Heading
```tsx
<h1 className="heading-accessible heading-accessible-h1 text-white mb-6">
  Page Title
</h1>
```

### Body Text
```tsx
<p className="text-readable-base text-accessible-gray-light leading-relaxed-enhanced max-w-readable">
  Body paragraph with optimal readability.
</p>
```

### Button
```tsx
<button className="button-readable bg-blue-600 text-white">
  Click Me
</button>
```

### Link
```tsx
<a href="/page" className="link-accessible">Link Text</a>
```

### Form Label
```tsx
<label className="form-label-accessible">Field Name</label>
```

### Form Input
```tsx
<input className="form-input-accessible" />
```

---

## 🔍 Line Length Guide

| Content Type | Max Width | Characters |
|--------------|-----------|------------|
| Body text | `max-w-readable` | ~75 chars |
| Narrow text | `max-w-readable-narrow` | ~60 chars |
| Wide content | `max-w-readable-wide` | ~85 chars |
| Stats/Metrics | `max-w-4xl` | OK (not text) |

**Rule**: Paragraphs should NEVER exceed 75 characters per line!

---

## ♿ Dyslexia Support

### Enable for Entire Section
```tsx
<div className="dyslexia-friendly-text prose-enhanced-dyslexic">
  {/* All content here becomes dyslexia-friendly */}
</div>
```

### Features
- OpenDyslexic font family
- Increased letter spacing (0.12em)
- Increased word spacing (0.16em)
- Increased line height (1.8)
- Left-aligned text (no justify)
- Larger paragraph spacing

---

## 🎯 WCAG 2.1 Requirements

### Text Contrast (1.4.3 - Level AA)
- **Normal text**: 4.5:1 minimum
- **Large text** (18pt+): 3:1 minimum

### Text Spacing (1.4.12 - Level AA)
- **Line height**: 1.5x font size minimum
- **Paragraph spacing**: 2x font size minimum
- **Letter spacing**: 0.12x font size
- **Word spacing**: 0.16x font size

### Resize Text (1.4.4 - Level AA)
- Text must scale to **200%** without loss of content

---

## 🛠️ Testing Tools

### Browser Extensions
- [aXe DevTools](https://www.deque.com/axe/devtools/) - Automated testing
- [WAVE](https://wave.webaim.org/) - Visual feedback
- [Lighthouse](chrome://settings/) - Built into Chrome DevTools

### Online Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Hemingway Editor](http://hemingwayapp.com/) - Readability score

### Screen Readers
- **Mac**: VoiceOver (Cmd+F5)
- **Windows**: NVDA (free download)
- **Test**: Navigate using headings (H key in screen reader)

---

## ✨ Before & After

### Hero Heading
```tsx
// ❌ Before - Too large, poor contrast
<h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white">
  <span className="bg-gradient-to-r from-red-400 via-yellow-400 to-violet-400 bg-clip-text text-transparent">
    Title
  </span>
</h1>

// ✅ After - Appropriate size, solid contrast
<h1 className="heading-accessible heading-accessible-h1 text-white">
  Title
</h1>
```

### Body Paragraph
```tsx
// ❌ Before - Poor contrast, too wide
<p className="text-xl text-gray-300 max-w-6xl mx-auto">
  Long paragraph of text
</p>

// ✅ After - Good contrast, optimal width
<p className="text-readable-lg text-accessible-gray-light max-w-readable mx-auto leading-relaxed-enhanced">
  Long paragraph of text
</p>
```

### Feature Description
```tsx
// ❌ Before - Too small, poor contrast
<p className="text-gray-400 text-sm">
  Feature description
</p>

// ✅ After - Readable size, good contrast
<p className="text-accessible-gray text-readable-base leading-relaxed-enhanced">
  Feature description
</p>
```

---

## 📋 Implementation Checklist

### Phase 1: Critical (Day 1)
- [ ] Import `readability.css` in main.tsx
- [ ] Replace all `text-gray-500` → `text-accessible-gray`
- [ ] Replace all `text-gray-400` → `text-accessible-gray`
- [ ] Fix Hero component heading size

### Phase 2: Typography (Day 2-3)
- [ ] Update all headings to use heading classes
- [ ] Fix font sizes (no text below 14px)
- [ ] Fix line lengths (max-w-readable for text)
- [ ] Update line heights

### Phase 3: Testing (Day 4)
- [ ] Run Lighthouse accessibility audit
- [ ] Test with aXe DevTools
- [ ] Validate contrast ratios
- [ ] Test at 200% zoom
- [ ] Test with screen reader

---

## 🚀 Expected Results

After implementation:

| Metric | Before | After |
|--------|--------|-------|
| **Lighthouse Score** | ~75 | 95+ |
| **Contrast Failures** | 15+ | 0 |
| **Minimum Font Size** | 12px | 14px |
| **Readable Line Length** | 180 chars | 75 chars |
| **Heading Structure** | Inconsistent | Perfect |

---

## 💡 Pro Tips

1. **Always test contrast**: Use browser DevTools color picker
2. **Test zoom**: Ctrl/Cmd + to 200%
3. **Use semantic HTML**: Correct heading levels (H1→H2→H3)
4. **Avoid all-caps**: Harder to read, especially for dyslexic users
5. **Left-align text**: Never justify (creates rivers of white space)
6. **Break up long text**: Use headings, lists, short paragraphs
7. **Sufficient spacing**: White space improves comprehension
8. **Test with real users**: Best validation method

---

## 📞 Support Files

- **Full Audit**: `READABILITY_ACCESSIBILITY_AUDIT.md`
- **Implementation Guide**: `READABILITY_IMPLEMENTATION_GUIDE.md`
- **CSS File**: `src/styles/readability.css`
- **Component Examples**: See implementation guide

---

## 🎓 Key Takeaways

1. **4.5:1** minimum contrast ratio for all text
2. **16px** minimum font size for body text
3. **45-75** characters per line for optimal readability
4. **1.6-1.8** line height for body text
5. **1.1-1.3** line height for headings
6. **Left-aligned** text (never justified)
7. **Clear hierarchy** with proper heading structure

---

**Remember**: Accessibility benefits everyone, not just users with disabilities!
