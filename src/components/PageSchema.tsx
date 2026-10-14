import React from 'react';
import { Helmet } from 'react-helmet-async';
import { pageGraph, type PageGraphInput } from '../lib/schema';

/**
 * Emits the page's JSON-LD @graph (WebPage + BreadcrumbList + extra nodes) via
 * react-helmet-async. Helmet merges <script> tags from every instance, so this
 * can sit alongside SEOHead or a page's own <Helmet>.
 */
const PageSchema: React.FC<PageGraphInput> = (props) => (
  <Helmet>
    <script type="application/ld+json">{JSON.stringify(pageGraph(props))}</script>
  </Helmet>
);

export default PageSchema;
