import React from 'react';
import type { Metadata } from 'next';
import { ExportImportClient } from '@/components/docs/ExportImportClient';
import { siteConfig } from '@/config/site';
import { getDocArticleSchema, getBreadcrumbSchema } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Export & Import Session Sandbox Snapshots — Playground API',
  description:
    'Save and restore your complete mock state with JSON sandbox snapshots. Share test environments across teams, backup mock collections, and load deterministic data into Playwright E2E suites.',
  keywords: [
    'mock api export snapshot',
    'restore mock database json',
    'deterministic test fixtures api',
    'sandbox snapshot export import',
    'playwright e2e fixture loader',
  ],
  alternates: {
    canonical: `${siteConfig.url}/docs/export-import`,
  },
  openGraph: {
    title: 'Export & Import Session Sandbox Snapshots — Playground API',
    description:
      'Save your complete sandboxed mutation state into a portable JSON snapshot or restore mock data across devices.',
    url: `${siteConfig.url}/docs/export-import`,
    type: 'article',
  },
};

export default function ExportImportPage() {
  const jsonLdArticle = getDocArticleSchema({
    title: 'Export & Import Session Sandbox — Playground API',
    description: 'Save and restore your mock state with JSON sandbox snapshots.',
    url: `${siteConfig.url}/docs/export-import`,
  });

  const jsonLdBreadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Docs', url: `${siteConfig.url}/docs` },
    { name: 'Export & Import', url: `${siteConfig.url}/docs/export-import` },
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
      <ExportImportClient />
    </>
  );
}
