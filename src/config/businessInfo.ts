export const businessInfo = {
  name: "KenjiAI",
  legalName: "KenjiAI, Inc.",
  description: "Complete AI business automation platform featuring voice agents, CRM, marketing automation, and smart workflows that help businesses automate operations and scale efficiently.",

  contact: {
    phone: "+1-831-263-4402",
    phoneDisplay: "(831) 263-4402",
    email: "care@kenjiai.com",
    supportEmail: "care@kenjiai.com",
    salesEmail: "care@kenjiai.com"
  },

  address: {
    streetAddress: "1234 Tech Valley Drive",
    addressLocality: "San Francisco",
    addressRegion: "CA",
    postalCode: "94105",
    addressCountry: "US",
    formatted: "1234 Tech Valley Drive, San Francisco, CA 94105"
  },

  urls: {
    website: "https://kenjiai.com",
    app: "https://app.kenjicrm.com",
    support: "https://support.kenjiai.com",
    blog: "https://kenjiai.com/knowledge",
    pricing: "https://kenjiai.com/pricing"
  },

  social: {
    twitter: "https://twitter.com/KenjiAI",
    linkedin: "https://linkedin.com/company/kenjiai",
    facebook: "https://facebook.com/KenjiAI",
    youtube: "https://youtube.com/@KenjiAI",
    instagram: "https://instagram.com/kenjiai"
  },

  business: {
    foundingDate: "2023",
    founders: ["KenjiAI Team"],
    numberOfEmployees: "20-50",
    industry: "Software Development",
    category: "AI & Automation Platform",
    slogan: "Your AI-Powered Business Operating System"
  },

  services: [
    {
      name: "AI Voice Agents",
      description: "24/7 AI-powered voice agents that handle calls, qualify leads, and close deals automatically",
      url: "https://kenjiai.com/voice-agents",
      priceRange: "$$$"
    },
    {
      name: "Business Automation",
      description: "Complete AI business automation platform with smart workflows and integrations",
      url: "https://kenjiai.com/ai-automation",
      priceRange: "$$$"
    },
    {
      name: "CRM & Sales Automation",
      description: "Intelligent CRM with automated sales processes and pipeline management",
      url: "https://kenjiai.com/crm",
      priceRange: "$$$"
    },
    {
      name: "Marketing Automation",
      description: "AI-powered marketing campaigns, email sequences, and customer engagement",
      url: "https://kenjiai.com/marketing-automation",
      priceRange: "$$$"
    }
  ],

  features: [
    "AI Voice Agents",
    "CRM & Sales Automation",
    "Marketing Automation",
    "Smart Workflows",
    "Community Building",
    "Course Creation",
    "AI Chatbots",
    "Business Intelligence",
    "24/7 Support"
  ],

  targetAreas: [
    {
      city: "San Francisco",
      state: "California",
      region: "Bay Area",
      keywords: ["AI automation San Francisco", "voice agents Bay Area", "CRM software San Francisco"]
    },
    {
      city: "Los Angeles",
      state: "California",
      region: "Southern California",
      keywords: ["AI automation Los Angeles", "voice agents LA", "CRM software Los Angeles"]
    },
    {
      city: "New York",
      state: "New York",
      region: "NYC Metro",
      keywords: ["AI automation NYC", "voice agents New York", "CRM software NYC"]
    },
    {
      city: "Austin",
      state: "Texas",
      region: "Central Texas",
      keywords: ["AI automation Austin", "voice agents Texas", "CRM software Austin"]
    },
    {
      city: "Chicago",
      state: "Illinois",
      region: "Midwest",
      keywords: ["AI automation Chicago", "voice agents Chicago", "CRM software Chicago"]
    }
  ],

  reviews: {
    aggregateRating: {
      ratingValue: 4.8,
      reviewCount: 347,
      bestRating: 5,
      worstRating: 1
    }
  },

  openingHours: [
    "Monday-Friday 9:00-18:00",
    "Saturday 10:00-16:00"
  ],

  paymentAccepted: ["Credit Card", "Debit Card", "Stripe"],
  currenciesAccepted: "USD",

  awards: [
    "Best AI Automation Platform 2024",
    "Top Voice AI Solution 2024",
    "Customer Choice Award 2024"
  ]
};

export const getNAPInfo = () => ({
  name: businessInfo.name,
  address: businessInfo.address.formatted,
  phone: businessInfo.contact.phoneDisplay
});

export const getStructuredDataForPage = (pageType: 'home' | 'service' | 'about' | 'contact' | 'pricing') => {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": businessInfo.urls.website,
    name: businessInfo.name,
    legalName: businessInfo.legalName,
    description: businessInfo.description,
    url: businessInfo.urls.website,
    telephone: businessInfo.contact.phone,
    email: businessInfo.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: businessInfo.address.streetAddress,
      addressLocality: businessInfo.address.addressLocality,
      addressRegion: businessInfo.address.addressRegion,
      postalCode: businessInfo.address.postalCode,
      addressCountry: businessInfo.address.addressCountry
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: businessInfo.reviews.aggregateRating.ratingValue,
      reviewCount: businessInfo.reviews.aggregateRating.reviewCount,
      bestRating: businessInfo.reviews.aggregateRating.bestRating,
      worstRating: businessInfo.reviews.aggregateRating.worstRating
    },
    openingHoursSpecification: businessInfo.openingHours.map(hours => {
      const [days, time] = hours.split(' ');
      const [open, close] = time.split('-');
      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: days.split('-'),
        opens: open,
        closes: close
      };
    }),
    sameAs: Object.values(businessInfo.social),
    priceRange: "$$$"
  };

  return baseSchema;
};
