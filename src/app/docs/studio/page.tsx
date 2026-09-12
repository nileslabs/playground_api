import React from 'react';
import type { Metadata } from 'next';
import { StudioClient } from '@/components/docs/StudioClient';
import { siteConfig } from '@/config/site';
import { getDocArticleSchema, getBreadcrumbSchema } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Interactive API Studio & Try-It Runner — Playground API',
  description:
    'Interactive web API studio: Run live REST requests, test CRUD lifecycle scenarios, inject network delay simulations, and inspect headers in real-time with isolated session persistence.',
  keywords: [
    'api studio online',
    'interactive api request tester',
    'mock rest api runner',
    'latency delay simulation tester',
    'crud testing playground',
  ],
  alternates: {
    canonical: `${siteConfig.url}/docs/studio`,
  },
  openGraph: {
    title: 'Interactive API Studio — Playground API',
    description:
      'Test stateful CRUD operations, simulate network conditions, and verify your isolated session overlay in real time.',
    url: `${siteConfig.url}/docs/studio`,
    type: 'article',
  },
};

export default function StudioPage() {
  const jsonLdArticle = getDocArticleSchema({
    title: 'Interactive API Studio & Try-It Runner — Playground API',
    description: 'Test stateful CRUD operations and simulate network conditions in real time.',
    url: `${siteConfig.url}/docs/studio`,
  });

  const jsonLdBreadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Docs', url: `${siteConfig.url}/docs` },
    { name: 'API Studio', url: `${siteConfig.url}/docs/studio` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />
      <StudioClient />
    </>
  );
}
