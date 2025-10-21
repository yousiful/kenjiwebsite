import { businessInfo } from '../config/businessInfo';

export interface GoogleBusinessProfileConfig {
  name: string;
  address: string;
  phone: string;
  website: string;
  categories: string[];
  description: string;
  hours: string[];
  services: string[];
  attributes: string[];
}

export const getGoogleBusinessProfileData = (): GoogleBusinessProfileConfig => {
  return {
    name: businessInfo.name,
    address: businessInfo.address.formatted,
    phone: businessInfo.contact.phoneDisplay,
    website: businessInfo.urls.website,
    categories: [
      'Software Company',
      'Business Management Consultant',
      'Marketing Agency',
      'Technology Company',
      'AI Platform'
    ],
    description: businessInfo.description,
    hours: businessInfo.openingHours,
    services: businessInfo.services.map(s => s.name),
    attributes: [
      'Online appointments',
      'Online estimates',
      'Virtual consultations',
      '24/7 customer support',
      'Free consultation',
      'Remote services'
    ]
  };
};

export const generateGoogleBusinessProfileInstructions = (): string => {
  const config = getGoogleBusinessProfileData();

  return `
# Google Business Profile Setup Instructions for ${config.name}

## Step 1: Claim or Create Your Business Profile
1. Go to https://business.google.com
2. Sign in with your business Google account
3. Click "Add business" or "Manage now"
4. Search for "${config.name}" to see if it exists
5. If exists, claim it. If not, create a new profile

## Step 2: Basic Information
- Business Name: ${config.name}
- Category: ${config.categories[0]} (Primary)
- Additional Categories: ${config.categories.slice(1).join(', ')}
- Phone: ${config.phone}
- Website: ${config.website}

## Step 3: Address Information
${config.address}

Service Area: Select "Yes, I serve customers at their locations"
Add service areas: All major US cities where you serve customers

## Step 4: Hours of Operation
${config.hours.map(h => `- ${h}`).join('\n')}

## Step 5: Business Description
${config.description}

Tips:
- Include primary keywords: AI automation, voice agents, CRM
- Mention serving businesses nationwide
- Highlight 24/7 service availability
- Include unique value propositions

## Step 6: Services
Add each service with descriptions:
${config.services.map(s => `- ${s}`).join('\n')}

For each service, include:
- Service name
- Detailed description
- Starting price or price range
- Link to service page on website

## Step 7: Attributes
Select all applicable attributes:
${config.attributes.map(a => `✓ ${a}`).join('\n')}

## Step 8: Photos
Upload high-quality photos:
- Logo (square, at least 720x720px)
- Cover photo (landscape, at least 1024x576px)
- Office/workspace photos (at least 3-5 images)
- Team photos
- Product screenshots
- Customer testimonials (visual format)

Recommended sizes:
- Logo: 720x720px (PNG with transparent background)
- Cover: 1920x1080px
- Photos: 1600x1200px minimum

## Step 9: Posts & Updates
Create regular posts (2-3 times per week):
- New features announcements
- Customer success stories
- Tips and best practices
- Special offers or promotions
- Industry insights

Post types:
- What's New: Feature updates
- Offer: Special promotions
- Event: Webinars, demos
- Product: Service highlights

## Step 10: Q&A
Pre-populate common questions:

Q: What services do you offer?
A: We provide AI voice agents, CRM automation, marketing automation, and complete business automation solutions.

Q: Do you offer a free trial?
A: We offer a 30-day money-back guarantee on all plans.

Q: What areas do you serve?
A: We serve businesses nationwide across the United States with 24/7 remote support.

Q: What is your pricing?
A: Plans start at $275/month. Visit ${config.website}/pricing for details.

Q: Do you offer customer support?
A: Yes, we offer 24/7 customer support via phone, email, and live chat.

## Step 11: Reviews Management
Set up review monitoring:
1. Enable email notifications for new reviews
2. Respond to all reviews within 24-48 hours
3. Thank positive reviewers
4. Address negative reviews professionally
5. Ask satisfied customers to leave reviews

Review request message template:
"Hi [Name], we hope you're enjoying KenjiAI! If you have a moment, we'd appreciate if you could share your experience on our Google Business Profile. Your feedback helps us improve and helps other businesses discover our platform. Thank you!"

## Step 12: Insights & Optimization
Monitor these metrics weekly:
- Search views (how customers find you)
- Map views (how many view your location)
- Website clicks
- Phone calls
- Direction requests
- Photo views

Optimize based on:
- Search queries used to find you
- Popular times for customer interactions
- Photo performance
- Post engagement

## Step 13: Verification
Complete verification:
1. Choose verification method (postcard, phone, email)
2. Follow instructions to receive verification code
3. Enter code in Google Business Profile dashboard
4. Wait for approval (usually 1-3 days)

## Step 14: Additional Integrations
- Link Google Analytics to track website traffic from GBP
- Connect Google Ads for local campaigns
- Enable messaging for direct customer communication
- Set up booking integration if applicable

## Step 15: Ongoing Maintenance
Monthly tasks:
- Update business hours for holidays
- Add new photos
- Create 8-12 posts per month
- Respond to all reviews and Q&A
- Update services and descriptions
- Check insights and optimize

Quarterly tasks:
- Review and update business description
- Audit photos and remove outdated ones
- Update pricing information
- Review attributes and add new ones
- Analyze competitor profiles

## Best Practices for Local SEO
1. Use consistent NAP (Name, Address, Phone) across all platforms
2. Encourage customers to leave reviews
3. Respond to all reviews (positive and negative)
4. Post regularly (at least 2-3 times per week)
5. Use relevant keywords in description and posts
6. Upload fresh photos monthly
7. Keep hours and information updated
8. Use all available features (Q&A, messaging, booking)
9. Monitor and respond to questions quickly
10. Track performance and optimize based on insights

## Citation Building
Ensure NAP consistency on these platforms:
- Yelp
- Facebook Business
- LinkedIn Company Page
- Better Business Bureau
- Industry-specific directories
- Local business directories
- Chamber of Commerce listings

## Troubleshooting
- Profile suspended? Contact Google My Business support
- Can't verify? Try alternative verification methods
- Duplicate listings? Request merge or mark as duplicate
- Incorrect information? Edit and resubmit for review
- Low visibility? Increase posting frequency and photo uploads

For assistance with Google Business Profile setup, contact:
Email: ${businessInfo.contact.supportEmail}
Phone: ${businessInfo.contact.phoneDisplay}
  `;
};

export const generateReviewRequestEmail = (customerName: string, customerEmail: string) => {
  return {
    subject: `We'd love to hear about your experience with ${businessInfo.name}!`,
    body: `
Hi ${customerName},

Thank you for choosing ${businessInfo.name}! We hope our AI automation platform is helping your business grow and succeed.

We'd really appreciate if you could take a moment to share your experience by leaving a review on Google. Your feedback not only helps us improve but also helps other businesses discover how AI automation can transform their operations.

📝 Leave a Review: [Google Review Link]

It takes less than 2 minutes and means the world to us!

As a thank you, we'll send you early access to our upcoming features and exclusive tips for maximizing your automation results.

If you have any questions or need assistance, we're here 24/7:
📧 ${businessInfo.contact.supportEmail}
📞 ${businessInfo.contact.phoneDisplay}

Thank you for being part of the ${businessInfo.name} community!

Best regards,
The ${businessInfo.name} Team

P.S. If you're not completely satisfied, please reach out to us directly before leaving a review. We're committed to making things right!
    `.trim()
  };
};

export const generateGooglePostTemplate = (type: 'update' | 'offer' | 'event' | 'product') => {
  const templates = {
    update: {
      title: '🚀 New Feature Alert!',
      body: `We've just launched [Feature Name]!

[Brief description of the feature and its benefits]

This means you can now:
✅ [Benefit 1]
✅ [Benefit 2]
✅ [Benefit 3]

Already available in your dashboard. Check it out now!

Learn more: ${businessInfo.urls.website}`,
      cta: {
        text: 'Learn More',
        url: businessInfo.urls.website
      }
    },
    offer: {
      title: '🎁 Limited Time Offer!',
      body: `Special promotion for new customers!

[Offer details]

✨ What you get:
• [Benefit 1]
• [Benefit 2]
• [Benefit 3]

Valid until [End Date]. Terms apply.

Claim your offer today!`,
      cta: {
        text: 'Claim Offer',
        url: businessInfo.urls.pricing
      }
    },
    event: {
      title: '📅 Join Our Free Webinar!',
      body: `Topic: [Webinar Topic]

Date: [Date]
Time: [Time]

You'll learn:
📌 [Key Takeaway 1]
📌 [Key Takeaway 2]
📌 [Key Takeaway 3]

Reserve your spot now - limited seats available!`,
      cta: {
        text: 'Register Now',
        url: businessInfo.urls.website
      }
    },
    product: {
      title: '💼 AI Voice Agents',
      body: `Automate your customer conversations 24/7!

Our AI voice agents:
🤖 Handle inbound & outbound calls
💰 Qualify leads automatically
📈 Close deals while you sleep
⚡ Integrate with your CRM

Starting at $275/month.

See how it works:`,
      cta: {
        text: 'View Demo',
        url: businessInfo.urls.website + '/voice-agents'
      }
    }
  };

  return templates[type];
};

export const NAP_CONSISTENCY_CHECKLIST = {
  platforms: [
    {
      name: 'Google Business Profile',
      url: 'https://business.google.com',
      fields: ['Name', 'Address', 'Phone', 'Website', 'Hours', 'Services']
    },
    {
      name: 'Yelp for Business',
      url: 'https://biz.yelp.com',
      fields: ['Name', 'Address', 'Phone', 'Website', 'Hours', 'Categories']
    },
    {
      name: 'Facebook Business Page',
      url: 'https://business.facebook.com',
      fields: ['Name', 'Address', 'Phone', 'Website', 'Hours', 'Services']
    },
    {
      name: 'LinkedIn Company Page',
      url: 'https://linkedin.com/company',
      fields: ['Name', 'Address', 'Phone', 'Website', 'Industry', 'Company Size']
    },
    {
      name: 'Better Business Bureau',
      url: 'https://bbb.org',
      fields: ['Name', 'Address', 'Phone', 'Website', 'Business Type']
    },
    {
      name: 'Apple Maps',
      url: 'https://mapsconnect.apple.com',
      fields: ['Name', 'Address', 'Phone', 'Website', 'Hours']
    },
    {
      name: 'Bing Places',
      url: 'https://bingplaces.com',
      fields: ['Name', 'Address', 'Phone', 'Website', 'Hours', 'Categories']
    }
  ],
  correctFormat: {
    name: businessInfo.name,
    address: businessInfo.address.formatted,
    phone: businessInfo.contact.phoneDisplay,
    website: businessInfo.urls.website
  }
};
