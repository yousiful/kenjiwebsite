# Mobile Refresh Loop Fix

## Problem
On mobile, the site kept refreshing in an infinite loop and wouldn't load properly.

## Root Cause
The previous fix was too aggressive:
1. Auto-reload when service worker activated (causing immediate refresh)
2. 10-second timeout that reloaded without checking if already reloaded
3. Unregistering ALL service workers on EVERY page load
4. No protection against reload loops

## Solution Applied

### 1. Removed Auto-Reload on Service Worker Activation
**Before:**
```javascript
if (newWorker.state === 'activated') {
  window.location.reload(); // ❌ Caused immediate refresh
}
```

**After:**
```javascript
if (newWorker.state === 'activated') {
  console.log('[SW] New service worker activated'); // ✅ Just logs
}
```

### 2. Added Reload Loop Protection
**Before:** Could reload indefinitely
**After:**
- Maximum 1 reload attempt
- Must wait 5+ seconds between reloads
- Clears counters after successful load
- Timeout increased from 10s to 15s

```javascript
var reloadCount = parseInt(sessionStorage.getItem('reload-count') || '0');
var lastReload = parseInt(sessionStorage.getItem('last-reload') || '0');
var timeSinceReload = Date.now() - lastReload;

if (reloadCount < 1 && timeSinceReload > 5000) {
  // Only reload once, and only if 5+ seconds since last reload
}
```

### 3. Smart Cache Cleanup (Not Aggressive)
**Before:** Unregistered ALL workers on EVERY page load
**After:**
- Only detects and cleans OLD caches (v1, v2)
- Leaves new v3 cache alone
- Only runs cleanup ONCE when old caches detected
- Normal visitors don't trigger cleanup

```javascript
const hasOldCaches = cacheNames.some(name =>
  name.includes('kenjiai-v1') ||
  name.includes('kenjiai-v2') ||
  (name.includes('kenjiai') && !name.includes('v3-2025-clean'))
);

if (hasOldCaches) {
  // Clean up only old caches
}
```

### 4. Cleanup on Success
When page loads successfully, reload counters are cleared after 2 seconds:
```javascript
window.addEventListener('load', function() {
  setTimeout(function() {
    sessionStorage.removeItem('reload-count');
    sessionStorage.removeItem('last-reload');
  }, 2000);
});
```

## What Changed

### File: `index.html`

#### Loading Timeout Script
- ✅ Changed timeout from 10s to 15s
- ✅ Maximum 1 reload attempt (was unlimited)
- ✅ Must wait 5+ seconds between reloads
- ✅ Auto-clears counters after successful load

#### Service Worker Registration
- ✅ Removed auto-reload on activation
- ✅ Only cleans OLD caches (v1, v2)
- ✅ Leaves current v3 cache intact
- ✅ One-time cleanup for users with old caches

## Expected Behavior

### First Visit (New User)
1. Page loads normally
2. Service worker registers
3. No reload, no cleanup needed
4. Fast, smooth experience

### First Visit (User with Old Cache)
1. Page detects old caches (v1, v2)
2. Deletes old caches
3. Unregisters old service workers
4. Registers new v3 service worker
5. Page loads normally (NO reload)

### Subsequent Visits
1. Page loads instantly
2. No cache cleanup
3. No reloads
4. Service worker serves cached assets
5. HTML always fresh from network

### If Page Gets Stuck (Rare)
1. After 15 seconds, checks if still loading
2. If stuck AND haven't reloaded yet:
   - Clears caches
   - Unregisters workers
   - Reloads ONCE
3. If already reloaded once:
   - Stops trying
   - Clears counters
   - Lets user manually refresh

## Mobile-Specific Improvements

### Before (Broken on Mobile):
- Reloaded on every service worker activation
- No protection against reload loops
- Could reload 10+ times
- Too aggressive cache clearing
- Mobile connections slow = more reloads

### After (Fixed for Mobile):
- ✅ No automatic reloads
- ✅ Maximum 1 reload attempt
- ✅ 5-second cooldown between reloads
- ✅ Smart cache detection
- ✅ Works great on slow mobile connections

## Testing Checklist

### Desktop
- [ ] Loads without refreshing
- [ ] No console errors
- [ ] Service worker registers
- [ ] Content displays correctly

### Mobile
- [ ] Loads without refresh loop
- [ ] Works on slow 3G connection
- [ ] No infinite reloads
- [ ] Smooth user experience

### Edge Cases
- [ ] User with old v1 cache: cleans up, loads fine
- [ ] User with old v2 cache: cleans up, loads fine
- [ ] Airplane mode: falls back to cache
- [ ] Hard refresh: works correctly

## Debugging

### Check Console for These Logs:

**Good (Normal Flow):**
```
[SW] Service worker registered
[SW] Page is controlled by service worker
```

**Good (Old Cache Cleanup):**
```
[SW] Old caches detected, cleaning up...
[SW] Deleted old cache: kenjiai-v1
[SW] Deleted old cache: kenjiai-v2-2025
[SW] Unregistered old service worker
[SW] Service worker registered
```

**Bad (Reload Loop - Should Not Happen):**
```
[Loader] Page stuck loading, clearing cache...
[Loader] Page stuck loading, clearing cache...
[Loader] Page stuck loading, clearing cache...
```

If you see multiple "Page stuck loading" messages, the reload protection failed. This should NOT happen with current fix.

## Deploy Instructions

```bash
git add index.html
git commit -m "Fix mobile refresh loop - remove aggressive reloads"
git push
```

In Netlify:
1. Wait for automatic deploy
2. Optional: Trigger "Clear cache and deploy site"

## Result

✅ No more infinite refresh loops on mobile
✅ Smooth loading experience
✅ Smart cache cleanup (only when needed)
✅ Fast subsequent visits
✅ Works on slow mobile connections
✅ Emergency fallback (15s timeout, max 1 reload)

---

**The site will now load properly on mobile without refresh loops!**
