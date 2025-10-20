import React from 'react';
import { Helmet } from 'react-helmet-async';
import { businessInfo } from '../config/businessInfo';

interface LocalSEOProps {
  title?: string;
  description?: string;
  locationCity?: string;
  locationState?: string;
  serviceType?: string;
  canonical?: string;
  additionalKeywords?: string[];
}

const LocalSEO: React.FC<LocalSEOProps> = ({
  title,
  description,
  locationCity,
  locationState,
  serviceType,
  canonical,
  additionalKeywords = []
}) => {
  const getLocationKeywords = () => {
    const baseKeywords = [
      `${businessInfo.name}`,
      'AI automation platform',
      'voice agents',
      'CRM software',
      'marketing automation',
      'business automation'
    ];

    if (locationCity || locationState) {
      const location = locationCity || locationState;
      const locationKeywords = [
        `AI automation ${location}`,
        `voice agents ${location}`,
        `CRM software ${location}`,
        `marketing automation ${location}`,
        `business automation ${location}`,
        `AI platform ${location}`,
        `sales automation ${location}`
      ];
      baseKeywords.push(...locationKeywords);
    }

    baseKeywords.push(...additionalKeywords);

    return baseKeywords.join(', ');
  };

  const getLocalizedTitle = () => {
    if (title) {
      if (locationCity && locationState) {
        return `${title} | ${locationCity}, ${locationState} | ${businessInfo.name}`;
      } else if (locationCity || locationState) {
        return `${title} | ${locationCity || locationState} | ${businessInfo.name}`;
      }
      return `${title} | ${businessInfo.name}`;
    }
    return businessInfo.name;
  };

  const getLocalizedDescription = () => {
    if (description) {
      if (locationCity && locationState) {
        return `${description} Serving ${locationCity}, ${locationState} and surrounding areas.`;
      } else if (locationCity || locationState) {
        return `${description} Serving ${locationCity || locationState} and surrounding areas.`;
      }
      return description;
    }
    return businessInfo.description;
  };

  const geoSchema = locationCity && locationState ? {
    "@context": "https://schema.org",
    "@type": "GeoCoordinates",
    addressCountry: "US"
  } : null;

  const serviceAreaSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    provider: {
      "@type": "Organization",
      name: businessInfo.name
    },
    areaServed: locationCity && locationState ? {
      "@type": "City",
      name: locationCity,
      containedInPlace: {
        "@type": "State",
        name: locationState
      }
    } : {
      "@type": "Country",
      name: "United States"
    }
  };

  return (
    <Helmet>
      <title>{getLocalizedTitle()}</title>
      <meta name="description" content={getLocalizedDescription()} />
      <meta name="keywords" content={getLocationKeywords()} />

      {canonical && <link rel="canonical" href={canonical} />}

      {locationCity && (
        <>
          <meta property="og:locale" content="en_US" />
          <meta property="business:contact_data:locality" content={locationCity} />
          {locationState && (
            <meta property="business:contact_data:region" content={locationState} />
          )}
          <meta property="business:contact_data:country_name" content="United States" />
        </>
      )}

      <meta property="og:type" content="business.business" />
      <meta property="og:title" content={getLocalizedTitle()} />
      <meta property="og:description" content={getLocalizedDescription()} />
      <meta property="og:url" content={canonical || businessInfo.urls.website} />

      <meta property="business:contact_data:street_address" content={businessInfo.address.streetAddress} />
      <meta property="business:contact_data:postal_code" content={businessInfo.address.postalCode} />
      <meta property="business:contact_data:phone_number" content={businessInfo.contact.phone} />
      <meta property="business:contact_data:email" content={businessInfo.contact.email} />
      <meta property="business:contact_data:website" content={businessInfo.urls.website} />

      <meta name="geo.region" content={`US-${businessInfo.address.addressRegion}`} />
      <meta name="geo.placename" content={locationCity || businessInfo.address.addressLocality} />

      <meta name="rating" content={businessInfo.reviews.aggregateRating.ratingValue.toString()} />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="target" content="all" />
      <meta name="audience" content="Businesses, Entrepreneurs, Startups, SMBs" />

      {geoSchema && (
        <script type="application/ld+json">
          {JSON.stringify(geoSchema)}
        </script>
      )}

      {serviceAreaSchema && (
        <script type="application/ld+json">
          {JSON.stringify(serviceAreaSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default LocalSEO;
