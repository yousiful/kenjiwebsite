import React from 'react';
import { Helmet } from 'react-helmet-async';
import { businessInfo, getStructuredDataForPage } from '../config/businessInfo';

interface LocalBusinessSchemaProps {
  pageType?: 'home' | 'service' | 'about' | 'contact' | 'pricing';
  serviceName?: string;
  serviceDescription?: string;
  serviceUrl?: string;
  additionalSchema?: Record<string, any>;
}

const LocalBusinessSchema: React.FC<LocalBusinessSchemaProps> = ({
  pageType = 'home',
  serviceName,
  serviceDescription,
  serviceUrl,
  additionalSchema
}) => {
  const baseSchema = getStructuredDataForPage(pageType);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: businessInfo.name,
    legalName: businessInfo.legalName,
    url: businessInfo.urls.website,
    logo: `${businessInfo.urls.website}/logo.png`,
    description: businessInfo.description,
    email: businessInfo.contact.email,
    telephone: businessInfo.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: businessInfo.address.streetAddress,
      addressLocality: businessInfo.address.addressLocality,
      addressRegion: businessInfo.address.addressRegion,
      postalCode: businessInfo.address.postalCode,
      addressCountry: businessInfo.address.addressCountry
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: businessInfo.contact.phone,
        contactType: "customer service",
        email: businessInfo.contact.supportEmail,
        areaServed: "US",
        availableLanguage: ["English"]
      },
      {
        "@type": "ContactPoint",
        telephone: businessInfo.contact.phone,
        contactType: "sales",
        email: businessInfo.contact.salesEmail,
        areaServed: "US",
        availableLanguage: ["English"]
      }
    ],
    sameAs: Object.values(businessInfo.social),
    foundingDate: businessInfo.business.foundingDate,
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: businessInfo.business.numberOfEmployees
    },
    slogan: businessInfo.business.slogan,
    award: businessInfo.awards
  };

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: businessInfo.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android",
    offers: {
      "@type": "Offer",
      price: "275",
      priceCurrency: "USD",
      priceValidUntil: "2025-12-31",
      availability: "https://schema.org/InStock",
      url: businessInfo.urls.pricing
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: businessInfo.reviews.aggregateRating.ratingValue,
      reviewCount: businessInfo.reviews.aggregateRating.reviewCount,
      bestRating: businessInfo.reviews.aggregateRating.bestRating
    },
    featureList: businessInfo.features.join(", ")
  };

  let serviceSchema = null;
  if (serviceName && serviceDescription) {
    serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: serviceName,
      provider: {
        "@type": "Organization",
        name: businessInfo.name,
        url: businessInfo.urls.website
      },
      description: serviceDescription,
      url: serviceUrl || businessInfo.urls.website,
      areaServed: {
        "@type": "Country",
        name: "United States"
      },
      audience: {
        "@type": "BusinessAudience",
        audienceType: "Small and Medium Businesses"
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: "275",
        priceValidUntil: "2025-12-31"
      }
    };
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: businessInfo.urls.website
      }
    ]
  };

  const schemas = [
    baseSchema,
    organizationSchema,
    softwareApplicationSchema,
    breadcrumbSchema
  ];

  if (serviceSchema) {
    schemas.push(serviceSchema);
  }

  if (additionalSchema) {
    schemas.push(additionalSchema);
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemas)}
      </script>
    </Helmet>
  );
};

export default LocalBusinessSchema;
