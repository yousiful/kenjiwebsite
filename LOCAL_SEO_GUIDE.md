# Local SEO Implementation Guide for KenjiAI

## 📋 Overview

This guide provides a complete local SEO implementation for the KenjiAI platform, including structured data markup, NAP consistency, Google Business Profile optimization, and location-specific content strategies.

## 🎯 Components Implemented

### 1. Business Information Config (`src/config/businessInfo.ts`)

Central source of truth for all business information:

```typescript
import { businessInfo, getNAPInfo, getStructuredDataForPage } from './config/businessInfo';
```

**Features:**
- NAP (Name, Address, Phone) information
- Business hours and services
- Social media profiles
- Target service areas
- Customer reviews aggregation
- Business awards and recognition

**Key Data:**
- **Name:** KenjiAI
- **Phone:** (888) 536-5424
- **Email:** hello@kenjiai.com
- **Address:** 1234 Tech Valley Drive, San Francisco, CA 94105
- **Rating:** 4.8/5 (347 reviews)

### 2. LocalBusinessSchema Component (`src/components/LocalBusinessSchema.tsx`)

Implements comprehensive Schema.org structured data:

**Schemas Included:**
- `LocalBusiness` - Core business information
- `Organization` - Company details and contact points
- `SoftwareApplication` - Product information
- `BreadcrumbList` - Navigation structure
- `Service` - Service-specific details (optional)

**Usage:**
```tsx
<LocalBusinessSchema
  pageType="home"
  serviceName="AI Voice Agents"
  serviceDescription="24/7 AI-powered voice agents"
  serviceUrl="https://kenjiai.com/voice-agents"
/>
```

**Page Types:**
- `home` - Homepage
- `service` - Service pages
- `about` - About page
- `contact` - Contact page
- `pricing` - Pricing page

### 3. NAPInfo Component (`src/components/NAPInfo.tsx`)

Consistent NAP display across all pages with Schema.org microdata:

**Variants:**

**Full Variant:**
```tsx
<NAPInfo variant="full" showIcons={true} />
```
- Complete business card layout
- Large icons with colored backgrounds
- Detailed address breakdown
- Perfect for contact pages

**Compact Variant:**
```tsx
<NAPInfo variant="compact" showIcons={true} />
```
- Space-efficient layout
- Suitable for sidebars and footers
- All NAP info with Schema.org markup

**Inline Variant:**
```tsx
<NAPInfo variant="inline" showIcons={false} />
```
- Single-line display
- Horizontal layout
- Perfect for headers or bottom bars

**Features:**
- Automatic Schema.org microdata
- Click-to-call phone links
- Click-to-email links
- Structured address markup
- SEO-friendly formatting

### 4. LocalSEO Component (`src/components/LocalSEO.tsx`)

Location-specific SEO optimization:

**Usage:**
```tsx
<LocalSEO
  title="AI Automation Platform"
  description="Complete business automation with AI"
  locationCity="San Francisco"
  locationState="California"
  serviceType="Business Automation"
  canonical="https://kenjiai.com"
  additionalKeywords={['AI automation', 'voice agents']}
/>
```

**Features:**
- Localized title and description
- Geo meta tags
- Location-specific keywords
- Service area markup
- Business data meta tags
- Open Graph business tags

### 5. Google Business Profile Integration (`src/utils/googleBusinessProfile.ts`)

Complete GBP setup and management tools:

**Functions:**

**Get Profile Data:**
```typescript
import { getGoogleBusinessProfileData } from './utils/googleBusinessProfile';
const profileData = getGoogleBusinessProfileData();
```

**Generate Setup Instructions:**
```typescript
import { generateGoogleBusinessProfileInstructions } from './utils/googleBusinessProfile';
const instructions = generateGoogleBusinessProfileInstructions();
```

**Review Request Email:**
```typescript
import { generateReviewRequestEmail } from './utils/googleBusinessProfile';
const email = generateReviewRequestEmail('John Doe', 'john@example.com');
```

**Post Templates:**
```typescript
import { generateGooglePostTemplate } from './utils/googleBusinessProfile';
const updatePost = generateGooglePostTemplate('update');
const offerPost = generateGooglePostTemplate('offer');
const eventPost = generateGooglePostTemplate('event');
const productPost = generateGooglePostTemplate('product');
```

**NAP Consistency Check:**
```typescript
import { NAP_CONSISTENCY_CHECKLIST } from './utils/googleBusinessProfile';
// Use checklist to audit NAP across platforms
```

## 🚀 Implementation Steps

### Step 1: Update Your Pages

Add local SEO components to all pages:

```tsx
import LocalBusinessSchema from '../components/LocalBusinessSchema';
import LocalSEO from '../components/LocalSEO';
import NAPInfo from '../components/NAPInfo';

const YourPage = () => {
  return (
    <>
      <LocalBusinessSchema pageType="service" />
      <LocalSEO
        title="Your Page Title"
        description="Your page description"
        locationCity="San Francisco"
        locationState="California"
        canonical="https://kenjiai.com/your-page"
      />

      {/* Your page content */}

      <footer>
        <NAPInfo variant="compact" />
      </footer>
    </>
  );
};
```

### Step 2: Add NAP to Footer

The Footer component now includes NAP info:

```tsx
import NAPInfo from './NAPInfo';

// In footer component:
<NAPInfo variant="compact" showIcons={true} />
```

### Step 3: Configure Business Information

Update `src/config/businessInfo.ts` with your actual:
- Business address
- Phone number
- Email addresses
- Opening hours
- Service areas
- Social media links

### Step 4: Set Up Google Business Profile

1. Run the instructions generator:
```typescript
import { generateGoogleBusinessProfileInstructions } from './utils/googleBusinessProfile';
console.log(generateGoogleBusinessProfileInstructions());
```

2. Follow the detailed setup guide
3. Verify your business
4. Complete all profile sections
5. Add photos and posts

### Step 5: Implement Review Strategy

Use the review request system:

```typescript
import { generateReviewRequestEmail } from './utils/googleBusinessProfile';

// After successful service delivery
const reviewEmail = generateReviewRequestEmail(
  customer.name,
  customer.email
);

// Send via your email system
sendEmail(reviewEmail.subject, reviewEmail.body, customer.email);
```

### Step 6: Create Regular GBP Posts

Schedule posts using templates:

```typescript
import { generateGooglePostTemplate } from './utils/googleBusinessProfile';

// Weekly updates
const template = generateGooglePostTemplate('update');
// Customize and post to GBP
```

## 📊 SEO Best Practices

### NAP Consistency

**Critical Rules:**
1. Use EXACT same format everywhere
2. No variations in:
   - Business name spelling
   - Address format
   - Phone number format
3. Update all platforms simultaneously

**Format Standards:**
- **Name:** KenjiAI (no variations)
- **Address:** 1234 Tech Valley Drive, San Francisco, CA 94105
- **Phone:** (888) 536-5424 or +1-888-536-5424

### Citation Building

Build citations on these platforms:
- Google Business Profile ⭐ (Priority #1)
- Yelp for Business
- Facebook Business Page
- LinkedIn Company Page
- Better Business Bureau
- Apple Maps
- Bing Places for Business
- Foursquare
- Yellow Pages
- Manta
- Local Chamber of Commerce
- Industry-specific directories

### Location Pages

Create dedicated pages for each target city:

```tsx
// Example: /locations/san-francisco
<LocalSEO
  title="AI Automation Platform in San Francisco"
  description="KenjiAI serves San Francisco businesses with AI voice agents, CRM automation, and marketing automation."
  locationCity="San Francisco"
  locationState="California"
  serviceType="AI Business Automation"
  canonical="https://kenjiai.com/locations/san-francisco"
  additionalKeywords={[
    'AI automation San Francisco',
    'voice agents Bay Area',
    'CRM software San Francisco'
  ]}
/>
```

### Content Localization

Include local elements:
- City-specific case studies
- Local business testimonials
- Regional industry insights
- Local events and partnerships
- Area-specific success metrics

## 🎯 Target Service Areas

Currently configured for:
1. **San Francisco, CA** (Primary)
2. Los Angeles, CA
3. New York, NY
4. Austin, TX
5. Chicago, IL

To add more locations:
1. Update `businessInfo.targetAreas` array
2. Create location-specific landing pages
3. Add local keywords
4. Build local citations
5. Create localized content

## 📈 Tracking & Optimization

### Monitor These Metrics

**Google Business Profile:**
- Search views
- Map views
- Website clicks
- Phone calls
- Direction requests
- Photo views
- Review count and rating

**Website Analytics:**
- Local organic traffic
- Local keyword rankings
- Citation mentions
- NAP consistency score
- Schema validation

### Monthly Tasks

1. **Week 1:** Review GBP insights, respond to reviews
2. **Week 2:** Create 4-6 GBP posts
3. **Week 3:** Update photos, check NAP consistency
4. **Week 4:** Analyze local rankings, plan content

### Quarterly Tasks

1. Audit all citations for NAP consistency
2. Update business information across platforms
3. Analyze competitor local strategies
4. Refresh location-specific content
5. Request reviews from satisfied customers

## 🔧 Testing & Validation

### Schema Validation

Test structured data:
1. Go to https://search.google.com/test/rich-results
2. Enter your URL
3. Verify all schemas pass validation
4. Fix any errors or warnings

### NAP Consistency Audit

Use the checklist:
```typescript
import { NAP_CONSISTENCY_CHECKLIST } from './utils/googleBusinessProfile';
```

Verify NAP on each platform matches exactly.

### Local SEO Tools

Test with:
- **Moz Local:** NAP consistency check
- **BrightLocal:** Local citation tracker
- **Whitespark:** Local rank tracker
- **Google Search Console:** Local performance
- **Bing Webmaster Tools:** Local rankings

## 📞 Support

For questions about local SEO implementation:
- Email: support@kenjiai.com
- Phone: (888) 536-5424
- Documentation: /knowledge

## 🎓 Additional Resources

### Google Resources
- [Google Business Profile Help](https://support.google.com/business)
- [Local SEO Guide](https://support.google.com/business/answer/7091)
- [Schema.org Documentation](https://schema.org/LocalBusiness)

### Best Practices
- [Moz Local SEO Guide](https://moz.com/learn/seo/local)
- [Search Engine Journal Local SEO](https://www.searchenginejournal.com/local-seo-guide/)
- [BrightLocal Resources](https://www.brightlocal.com/learn/)

## 🔄 Updates

Keep this implementation current:
- Review quarterly
- Update with Google algorithm changes
- Adjust based on analytics
- Expand to new locations
- Optimize based on performance

---

**Last Updated:** October 2025
**Version:** 1.0
**Maintained By:** KenjiAI Development Team
