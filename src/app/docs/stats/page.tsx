import React from 'react';
import type { Metadata } from 'next';
import { StatsClient } from '@/components/docs/StatsClient';
import { siteConfig } from '@/config/site';
import { getDocArticleSchema, getBreadcrumbSchema } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Session Quotas & Mutation Dashboard — Playground API',
  description:
    'Live dashboard for monitoring your personal identity sandbox: View total overlay mutations, per-resource quotas, inactivity retention TTL, and manage token copies.',
  keywords: [
    'session quota dashboard',
    'sandbox metrics monitor',
    'mock api overlay activity',
    'session identity token manager',
  ],
  alternates: {
    canonical: `${siteConfig.url}/docs/stats`,
  },
  openGraph: {
    title: 'Session Quotas & Mutation Dashboard — Playground API',
    description:
      'Comprehensive overview of your personal identity token, sandbox mutation usage, rate limit status, and resource quotas.',
    url: `${siteConfig.url}/docs/stats`,
    type: 'article',
  },
};

export default function StatsPage() {
  const jsonLdArticle = getDocArticleSchema({
    title: 'Session Quotas & Mutation Dashboard — Playground API',
    description: 'Comprehensive overview of your personal identity token and resource quotas.',
    url: `${siteConfig.url}/docs/stats`,
  });

  const jsonLdBreadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Docs', url: `${siteConfig.url}/docs` },
    { name: 'Session Stats', url: `${siteConfig.url}/docs/stats` },
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
      <StatsClient />
    </>
  );
}
