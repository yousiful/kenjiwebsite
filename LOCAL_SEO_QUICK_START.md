# Local SEO Quick Start Guide

## 🚀 5-Minute Implementation

### Step 1: Add to Any Page
```tsx
import LocalBusinessSchema from '../components/LocalBusinessSchema';
import LocalSEO from '../components/LocalSEO';

<LocalBusinessSchema pageType="home" />
<LocalSEO
  title="Your Page Title"
  description="Your description"
  canonical="https://kenjiai.com/page"
/>
```

### Step 2: Add NAP to Footer
```tsx
import NAPInfo from '../components/NAPInfo';

<NAPInfo variant="compact" showIcons={true} />
```

### Step 3: Configure Business Info
Edit `src/config/businessInfo.ts`:
- Update address
- Update phone number
- Update email
- Update opening hours

## 📋 Component Cheat Sheet

### LocalBusinessSchema
```tsx
<LocalBusinessSchema
  pageType="home"              // home | service | about | contact | pricing
  serviceName="AI Voice Agents"
  serviceDescription="24/7 voice automation"
  serviceUrl="https://kenjiai.com/voice-agents"
/>
```

### LocalSEO
```tsx
<LocalSEO
  title="Page Title"
  description="Page description"
  locationCity="San Francisco"
  locationState="California"
  serviceType="AI Automation"
  canonical="https://kenjiai.com"
  additionalKeywords={['keyword1', 'keyword2']}
/>
```

### NAPInfo
```tsx
{/* Full - for contact pages */}
<NAPInfo variant="full" showIcons={true} />

{/* Compact - for footers/sidebars */}
<NAPInfo variant="compact" showIcons={true} />

{/* Inline - for headers */}
<NAPInfo variant="inline" showIcons={false} />
```

## 🎯 Priority Actions

### Week 1
1. ✅ Add LocalBusinessSchema to homepage
2. ✅ Add NAPInfo to footer
3. ✅ Update businessInfo.ts with real data
4. ✅ Test structured data: https://search.google.com/test/rich-results

### Week 2
1. Set up Google Business Profile
2. Add business to 5 major directories
3. Get first 5 customer reviews
4. Create first GBP post

### Week 3
1. Add LocalSEO to all pages
2. Create location-specific landing pages
3. Build 10 local citations
4. Optimize GBP with photos

### Month 2
1. Monitor GBP insights weekly
2. Respond to all reviews
3. Create 8-12 GBP posts/month
4. Build 20 more citations

## 🔧 Google Business Profile Setup

### Essential Steps
```typescript
import {
  generateGoogleBusinessProfileInstructions,
  generateReviewRequestEmail,
  generateGooglePostTemplate
} from './utils/googleBusinessProfile';

// Get full setup guide
const setupGuide = generateGoogleBusinessProfileInstructions();

// Request reviews
const reviewEmail = generateReviewRequestEmail('Customer Name', 'email@example.com');

// Create posts
const updatePost = generateGooglePostTemplate('update');
const offerPost = generateGooglePostTemplate('offer');
```

### Categories to Select
1. Software Company (Primary)
2. Business Management Consultant
3. Marketing Agency
4. Technology Company

### Must-Have Attributes
- ✅ Online appointments
- ✅ Online estimates
- ✅ Virtual consultations
- ✅ 24/7 customer support
- ✅ Free consultation

## 📊 NAP Consistency

### Correct Format
- **Name:** KenjiAI
- **Address:** 1234 Tech Valley Drive, San Francisco, CA 94105
- **Phone:** (888) 536-5424

### Check These Platforms
```typescript
import { NAP_CONSISTENCY_CHECKLIST } from './utils/googleBusinessProfile';
```

Priority platforms:
1. Google Business Profile
2. Yelp for Business
3. Facebook Business Page
4. LinkedIn Company Page
5. Better Business Bureau

## 🎨 Schema Types Included

Your site automatically includes:
- ✅ LocalBusiness
- ✅ Organization
- ✅ SoftwareApplication
- ✅ Service
- ✅ BreadcrumbList
- ✅ AggregateRating
- ✅ PostalAddress
- ✅ ContactPoint

## 📍 Location Pages Template

Create pages like `/locations/san-francisco`:

```tsx
import LocalBusinessSchema from '../components/LocalBusinessSchema';
import LocalSEO from '../components/LocalSEO';
import NAPInfo from '../components/NAPInfo';

const SanFranciscoPage = () => {
  return (
    <>
      <LocalBusinessSchema pageType="service" />
      <LocalSEO
        title="AI Automation Platform in San Francisco"
        description="Serving San Francisco businesses with AI voice agents and automation"
        locationCity="San Francisco"
        locationState="California"
        canonical="https://kenjiai.com/locations/san-francisco"
        additionalKeywords={[
          'AI automation San Francisco',
          'voice agents Bay Area',
          'CRM software San Francisco'
        ]}
      />

      <h1>AI Business Automation in San Francisco</h1>

      {/* Local content */}
      <section>
        <h2>Serving San Francisco Bay Area Businesses</h2>
        <p>Local case studies and testimonials...</p>
      </section>

      <NAPInfo variant="full" />
    </>
  );
};
```

## 🎯 Quick Wins

### Day 1
- Add components to homepage ✅
- Update businessInfo.ts ✅
- Test structured data ✅

### Week 1
- Claim Google Business Profile
- Add to 5 directories
- Get 5 reviews

### Month 1
- 20 local citations
- 15+ reviews (target 4.5+ stars)
- 12 GBP posts
- Location pages for top 5 cities

## 📞 Review Request Template

```typescript
import { generateReviewRequestEmail } from './utils/googleBusinessProfile';

const email = generateReviewRequestEmail('John Doe', 'john@example.com');

// Returns:
// {
//   subject: "We'd love to hear about your experience with KenjiAI!",
//   body: "..." // Full email template
// }
```

## 🎬 GBP Post Templates

```typescript
import { generateGooglePostTemplate } from './utils/googleBusinessProfile';

// New feature announcement
const update = generateGooglePostTemplate('update');

// Special promotion
const offer = generateGooglePostTemplate('offer');

// Webinar or event
const event = generateGooglePostTemplate('event');

// Service highlight
const product = generateGooglePostTemplate('product');
```

## ✅ Monthly Checklist

### Content
- [ ] 8-12 GBP posts
- [ ] Respond to all reviews
- [ ] Update photos
- [ ] Answer Q&A

### Technical
- [ ] Verify NAP consistency
- [ ] Check schema validation
- [ ] Monitor local rankings
- [ ] Review GBP insights

### Citations
- [ ] Build 5 new citations
- [ ] Audit existing listings
- [ ] Update changed information
- [ ] Remove duplicate listings

## 📈 KPIs to Track

### Google Business Profile
- Profile views: +20% monthly
- Website clicks: +15% monthly
- Phone calls: +25% monthly
- Review count: +5 reviews/month
- Average rating: Maintain 4.5+

### Website
- Local organic traffic: +30% quarterly
- Local keyword rankings: Top 10 for primary terms
- Citation count: +20 citations/quarter
- NAP consistency: 100%

## 🆘 Troubleshooting

**Problem:** Schema validation errors
- Solution: Use Google's Rich Results Test
- Check all required fields in businessInfo.ts

**Problem:** GBP not showing in search
- Solution: Complete all profile sections
- Add photos (minimum 5)
- Get at least 5 reviews
- Post 2-3 times per week

**Problem:** Inconsistent NAP
- Solution: Use NAP_CONSISTENCY_CHECKLIST
- Update all platforms simultaneously
- Use exact same format everywhere

## 📚 Full Documentation

See `LOCAL_SEO_GUIDE.md` for complete details on:
- Schema.org implementation
- Google Business Profile optimization
- Citation building strategies
- Location content creation
- Review management
- Analytics and reporting

## 🎓 Next Steps

1. ✅ Implement components on all pages
2. ✅ Configure businessInfo.ts
3. Set up Google Business Profile
4. Build first 10 citations
5. Get 10 customer reviews
6. Create 5 location pages
7. Monitor and optimize monthly

---

**Need Help?**
- Email: support@kenjiai.com
- Phone: (888) 536-5424
- Docs: /knowledge
