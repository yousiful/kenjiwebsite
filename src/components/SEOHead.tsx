import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  structuredData?: object;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Done-For-You Inbound & Outbound AI Call Centers | KenjiAI",
  description = "KenjiAI deploys 24/7 autonomous Inbound & Outbound AI voice call centers for high-ticket businesses. Sub-500ms inbound answering, 60-second speed-to-lead outbound dialing, and automated database reactivation.",
  keywords = "AI call center, inbound AI receptionist, outbound speed to lead, database reactivation, AI voice agents, business automation CRM, KenjiAI",
  canonical,
  canonicalUrl: canonicalUrlProp,
  ogImage = "https://kenjiai.com/og-image.png",
  ogType = "website",
  article,
  structuredData
}) => {
  const fullTitle = title.includes('KenjiAI') ? title : `${title} | KenjiAI`;
  // Fallback canonical strips query strings and hash (e.g. ?utm_source=...) so
  // tracked/shared links don't create duplicate canonical URLs.
  const currentUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}`
    : 'https://kenjiai.com';
  const canonicalUrl = canonical || canonicalUrlProp || currentUrl;
  
  // Ensure structuredData is a string
  const structuredDataString = typeof structuredData === 'string' 
    ? structuredData 
    : JSON.stringify(structuredData);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="language" content="English" />
      <meta name="author" content="KenjiAI" />
      <meta name="publisher" content="KenjiAI" />
      <meta name="copyright" content="KenjiAI" />
      <meta name="revisit-after" content="1 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="KenjiAI - AI Business Automation Platform with Voice Agents, Smart CRM, and Free AI Tools" />
      <meta property="og:site_name" content="KenjiAI" />
      <meta property="og:locale" content="en_US" />

      {/* Additional Meta Tags for Better Indexing */}
      <meta name="format-detection" content="telephone=yes" />
      <meta name="HandheldFriendly" content="true" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      <meta property="twitter:image:alt" content="KenjiAI - AI Business Automation Platform" />
      <meta property="twitter:creator" content="@KenjiAI" />
      <meta property="twitter:site" content="@KenjiAI" />
      <meta name="twitter:label1" content="Built for" />
      <meta name="twitter:data1" content="Business Owners & Entrepreneurs" />
      <meta name="twitter:label2" content="Pricing" />
      <meta name="twitter:data2" content="Performance-Based" />
      
      {/* Article specific meta tags */}
      {article && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && (
            <meta property="article:author" content={article.author} />
          )}
          {article.section && (
            <meta property="article:section" content={article.section} />
          )}
          {article.tags && article.tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">{structuredDataString}</script>
      )}
    </Helmet>
  );
};

export default SEOHead;