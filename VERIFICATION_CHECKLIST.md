# Site Verification Checklist

## ✅ Quick Health Check

### 1. Build Verification
```bash
npm run build
```
**Expected:** No errors, successful build message

### 2. Development Server
```bash
npm run dev
```
**Expected:** Server starts on port 5173

### 3. Check Service Worker
Open browser DevTools → Application → Service Workers
**Expected:**
- Service Worker registered
- Cache: `kenjiai-v2-2025`
- Status: Activated and running

### 4. Test All Routes

Navigate to each route and verify it loads:

**Main Pages:**
- [ ] `/` - HomePage loads
- [ ] `/free-tools` - FreeToolsPage loads
- [ ] `/pricing` - ProductSelectionPage loads
- [ ] `/knowledge` - KnowledgeBasePage loads
- [ ] `/voice-agents` - VoiceAgentsPage loads
- [ ] `/ai-automation` - AIAutomationPage loads
- [ ] `/voice-ai` - VoiceAILandingPage loads
- [ ] `/marketing-automation` - MarketingAutomationPage loads
- [ ] `/crm` - CRMPage loads

**Other Pages:**
- [ ] `/ai-education` - AIEducationPage loads
- [ ] `/investors` - InvestorPage loads
- [ ] `/success` - SuccessPage loads
- [ ] `/privacy` - PrivacyPolicyPage loads
- [ ] `/terms` - TermsOfServicePage loads
- [ ] `/disclaimer` - DisclaimerPage loads

**Special Routes:**
- [ ] `/nonexistent-page` - Shows 404 page with auto-redirect
- [ ] `/tools` - Redirects to `/free-tools`
- [ ] `/blog` - Redirects to `/knowledge`

### 5. Test New Components

**Chat Button (Right Side):**
- [ ] Visible on bottom-right corner
- [ ] Has pulsing green indicator
- [ ] Opens chat window on click
- [ ] Quick action buttons work
- [ ] Can type messages

**Scroll-Triggered Notifications (Left Side):**
- [ ] First notification appears after 3 seconds
- [ ] New notifications appear as you scroll
- [ ] Different notification types/colors
- [ ] Smooth animations
- [ ] Auto-hide after 5 seconds

### 6. Browser Compatibility

Test in multiple browsers:

**Desktop:**
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)

**Mobile:**
- [ ] Chrome Mobile
- [ ] Safari iOS

### 7. Console Check

Open browser DevTools → Console

**Should NOT see:**
- ❌ Red errors
- ❌ Failed resource loads
- ❌ 404 errors

**May see (normal):**
- ℹ️ Service worker logs
- ℹ️ Performance metrics (LCP, FID, CLS)
- ⚠️ Warning if external chatbot fails to load (non-critical)

### 8. Network Tab Check

Open DevTools → Network

**Verify:**
- [ ] All JS/CSS files load successfully (200 status)
- [ ] Images load properly
- [ ] No failed requests (except optional external services)
- [ ] Service worker caching after first load

### 9. Cache Test

1. Load homepage
2. Go offline (DevTools → Network → Offline)
3. Refresh page
4. **Expected:** Page still loads from cache

### 10. Error Handling Test

Open console and run:
```javascript
throw new Error('Test error');
```
**Expected:** Error is caught and logged, site doesn't crash

## 🔧 If Issues Found

### Problem: Service Worker Issues
**Solution:**
```bash
# Clear service worker
# DevTools → Application → Service Workers → Unregister

# Clear cache
# DevTools → Application → Clear storage → Clear site data

# Reload page
```

### Problem: Stale Content
**Solution:**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Or increment cache version in `public/sw.js`

### Problem: Route Not Found
**Solution:**
- Check route exists in `src/App.tsx`
- Verify corresponding page file exists in `src/pages/`
- Check for typos in URL

### Problem: Component Not Loading
**Solution:**
- Check browser console for errors
- Verify all imports in `src/App.tsx`
- Check ErrorBoundary isn't catching an error

## 📊 Performance Check

### Core Web Vitals

Run in Chrome DevTools → Lighthouse

**Target Scores:**
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 95

### Load Time
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s

## ✅ Final Verification

All checks passed? Site is ready! ✨

### Additional Tips:

1. **Monitor in Production:**
   - Check Google Search Console for errors
   - Monitor Core Web Vitals
   - Watch for 404s in analytics

2. **Regular Maintenance:**
   - Update dependencies monthly
   - Test after each deployment
   - Clear old caches periodically

3. **User Testing:**
   - Test on different devices
   - Check different network speeds
   - Verify on different browsers

---

**Last Updated:** 2025-01-19
**Site Version:** 2.0
**Cache Version:** kenjiai-v2-2025
