# Dynamic Holiday Celebration System

## Overview

The KenjiAI platform now features a dynamic holiday celebration system that automatically adjusts the website's look and feel based on the calendar year holidays. The system creates an engaging, festive experience for visitors during special occasions.

## Features

### 1. **Dynamic Holiday Detection**
- Automatically detects the current date and matches it against stored holidays
- Handles year-wrapping dates (e.g., New Year's spanning Dec 31 - Jan 1)
- Priority-based system for overlapping holidays
- Refreshes every hour to ensure accuracy

### 2. **Visual Effects**

#### Holiday Banner
- Colorful banner at the top of the page
- Custom gradient based on holiday theme colors
- Animated emoji icon
- Custom message for each holiday
- Dismissible (saved in session storage)

#### Confetti Animation
- Automatically triggers for high-priority holidays (priority ≥ 10)
- Uses holiday-specific colors
- Realistic falling physics with rotation
- Performance-optimized with requestAnimationFrame
- 50 pieces per burst, recurring every 3 seconds

#### Floating Holiday Elements
- 8 animated emoji elements floating across the screen
- Holiday-specific emojis (e.g., 🎄 for Christmas, 🎃 for Halloween)
- Gentle upward floating motion with slight horizontal drift
- Low opacity (20%) to avoid distracting from content
- Continuous loop animation

### 3. **Holiday CSS Animations**

The system includes custom CSS animations:
- `float-holiday` - Gentle floating motion
- `pulse-glow` - Glowing pulse effect
- `snow-fall` - Snowflake falling animation
- `sparkle` - Twinkling sparkle effect
- `firework-burst` - Explosive firework animation
- `bounce-in` - Bouncy entrance animation
- `shimmer` - Shimmering gradient effect

All animations respect `prefers-reduced-motion` for accessibility.

## Pre-loaded Holidays

The system comes pre-configured with these holidays:

| Holiday | Date Range | Theme Colors | Priority | Special Effects |
|---------|-----------|--------------|----------|-----------------|
| **New Year** | Dec 26 - Jan 2 | Gold/Yellow | 10 | Confetti |
| **Valentine's Day** | Feb 10 - Feb 15 | Pink/Rose | 8 | - |
| **St. Patrick's Day** | Mar 15 - Mar 18 | Green | 7 | - |
| **Easter** | Mar 25 - Apr 5 | Purple/Pastel | 8 | - |
| **Independence Day** | Jul 1 - Jul 5 | Red/White/Blue | 9 | - |
| **Halloween** | Oct 25 - Nov 1 | Orange/Purple | 10 | Confetti |
| **Thanksgiving** | Nov 20 - Nov 29 | Orange/Brown | 8 | - |
| **Black Friday** | Nov 24 - Nov 25 | Black/Gold | 15 | Confetti |
| **Cyber Monday** | Nov 27 - Nov 28 | Blue | 15 | Confetti |
| **Christmas** | Dec 15 - Dec 26 | Red/Green | 10 | Confetti |
| **New Year's Eve** | Dec 31 - Jan 1 | Purple/Gold | 12 | Confetti |

## Technical Architecture

### Database Schema

**Table: `holidays`**
```sql
- id (uuid, primary key)
- name (text) - Holiday name
- start_date (text) - MM-DD format
- end_date (text) - MM-DD format
- theme_color (text) - Primary hex color
- secondary_color (text) - Secondary hex color
- emoji (text) - Holiday emoji
- confetti_colors (jsonb) - Array of confetti colors
- banner_message (text) - Banner message
- is_active (boolean) - Enable/disable flag
- priority (integer) - Priority when overlapping
- created_at (timestamptz)
- updated_at (timestamptz)
```

### React Components

#### `useHoliday` Hook
**Location:** `/src/hooks/useHoliday.ts`

Custom React hook that:
- Fetches active holidays from Supabase
- Determines if current date falls within any holiday range
- Returns the highest priority active holiday
- Updates every hour automatically

```typescript
const { currentHoliday, loading } = useHoliday();
```

#### `HolidayThemeProvider` Component
**Location:** `/src/components/HolidayThemeProvider.tsx`

Wraps the entire application and provides:
- Holiday banner with gradient and animation
- Confetti system for high-priority holidays
- Session-based banner dismissal
- Performance-optimized animations

#### `FloatingHolidayElements` Component
**Location:** `/src/components/FloatingHolidayElements.tsx`

Creates ambient holiday atmosphere with:
- 8 floating emoji elements
- Holiday-specific emoji sets
- Smooth upward animation
- Randomized positioning and timing

### CSS Styling
**Location:** `/src/styles/holiday.css`

Contains all holiday-specific animations and utility classes.

## Row Level Security

The holidays table has RLS enabled with these policies:

- **Public Read**: Anyone can view active holidays
- **Authenticated Insert**: Logged-in users can add holidays
- **Authenticated Update**: Logged-in users can modify holidays
- **Authenticated Delete**: Logged-in users can remove holidays

## Adding New Holidays

### Via Database

```sql
INSERT INTO holidays (
  name,
  start_date,
  end_date,
  theme_color,
  secondary_color,
  emoji,
  confetti_colors,
  banner_message,
  priority
) VALUES (
  'Mother''s Day',
  '05-10',
  '05-15',
  '#ec4899',
  '#f9a8d4',
  '💐',
  '["#ec4899", "#f9a8d4", "#fecdd3", "#ffffff"]'::jsonb,
  'Happy Mother''s Day from KenjiAI!',
  8
);
```

### Holiday Configuration Guide

- **start_date/end_date**: Use MM-DD format (e.g., "12-25")
- **theme_color**: Primary color (hex format)
- **secondary_color**: Complementary color (hex format)
- **emoji**: Single emoji character
- **confetti_colors**: JSON array of hex colors
- **banner_message**: Short, engaging message (50 chars max)
- **priority**:
  - 1-5: Low priority (no confetti)
  - 6-9: Medium priority (no confetti)
  - 10+: High priority (with confetti)
  - 15+: Maximum priority (guaranteed to show)

## Performance Considerations

1. **Lazy Loading**: Holiday system loads asynchronously
2. **Memoization**: Components avoid unnecessary re-renders
3. **RequestAnimationFrame**: Smooth 60fps animations
4. **Session Storage**: Banner dismissal persists during session
5. **Conditional Rendering**: Effects only render when active
6. **GPU Acceleration**: CSS transforms use hardware acceleration

## Accessibility

- Respects `prefers-reduced-motion` settings
- Banner dismissible with keyboard (Tab + Enter)
- ARIA labels on interactive elements
- Low-opacity floating elements don't interfere with content
- No autoplay sound or jarring transitions

## Testing the System

To test different holidays during development:

1. Update the `start_date` and `end_date` in the database to include today's date
2. Refresh the page to see the holiday effects
3. Check the banner, confetti (if priority ≥ 10), and floating elements

### Quick Test Query
```sql
-- Make Halloween active today (example)
UPDATE holidays
SET start_date = to_char(CURRENT_DATE, 'MM-DD'),
    end_date = to_char(CURRENT_DATE + interval '1 day', 'MM-DD')
WHERE name = 'Halloween';
```

## Customization Examples

### Change Holiday Colors
```sql
UPDATE holidays
SET theme_color = '#ff6b6b',
    secondary_color = '#ffd93d'
WHERE name = 'Christmas';
```

### Update Banner Message
```sql
UPDATE holidays
SET banner_message = 'Special Holiday Offer - 20% Off!'
WHERE name = 'Black Friday';
```

### Disable a Holiday
```sql
UPDATE holidays
SET is_active = false
WHERE name = 'Cyber Monday';
```

### Add Confetti to a Holiday
```sql
UPDATE holidays
SET priority = 10
WHERE name = 'Thanksgiving';
```

## Future Enhancements

Potential additions to the system:
- Regional holiday support (based on user location)
- Custom holiday creation via admin panel
- A/B testing different holiday themes
- Analytics on holiday engagement
- Sound effects (optional, user-controlled)
- Special holiday offers/discounts integration
- Email notifications for upcoming holidays
- Social media sharing with holiday themes

## Files Modified

- `/src/hooks/useHoliday.ts` - Holiday detection hook
- `/src/components/HolidayThemeProvider.tsx` - Main theme provider
- `/src/components/FloatingHolidayElements.tsx` - Floating animations
- `/src/styles/holiday.css` - Holiday CSS animations
- `/src/App.tsx` - Integration into app
- `/src/main.tsx` - CSS import
- `/supabase/migrations/*_create_holidays_calendar.sql` - Database schema

## Maintenance

### Regular Updates
- Review holiday dates annually (especially Easter)
- Update Black Friday/Cyber Monday dates each year
- Test all holidays before their start dates
- Monitor performance during high-traffic holidays

### Monitoring
- Check Supabase for holiday fetch errors
- Monitor animation performance on mobile devices
- Track banner dismissal rates
- Gather user feedback on holiday experiences

---

**Built with:** React, TypeScript, Framer Motion, Supabase, Tailwind CSS

**Version:** 1.0.0
**Last Updated:** December 2025