import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
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
  title = "KenjiAI - Free AI Tools, Business Automation Platform & AI Knowledge Base",
  description = "Free AI tools + Complete AI business automation platform: Voice agents that close deals 24/7, smart workflows, community building, course creation, CRM, marketing automation. Plus comprehensive AI knowledge base with latest insights.",
  keywords = "free AI tools, AI automation, business automation, AI voice agents, AI marketing, AI sales, smart workflows, CRM automation, AI chatbots, business intelligence, AI platform, AI knowledge base, AI blog, AI tutorials, prompt generator",
  canonical,
  ogImage = "https://kenjiai.com/og-image.jpg",
  ogType = "website",
  article,
  structuredData
}) => {
  const fullTitle = title.includes('KenjiAI') ? title : `${title} | KenjiAI`;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://kenjiai.com';
  const canonicalUrl = canonical || currentUrl;
  
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
      <meta name="keywords" content={keywords} />
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
      <meta property="og:site_name" content="KenjiAI" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      <meta property="twitter:creator" content="@KenjiAI" />
      <meta property="twitter:site" content="@KenjiAI" />
      
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