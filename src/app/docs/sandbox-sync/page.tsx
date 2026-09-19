import React from 'react';
import type { Metadata } from 'next';
import { SandboxSyncClient } from '@/components/docs/SandboxSyncClient';
import { siteConfig } from '@/config/site';
import { getDocArticleSchema, getBreadcrumbSchema } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Shareable Sandbox URLs & QR Code Sync — Playground API',
  description:
    'Share and synchronize your isolated mock database state across physical mobile devices, team pull requests, and automated test runners using 1-click shareable URLs and camera QR code scanning.',
  keywords: [
    'shareable mock api sandbox',
    'qr code api sync',
    'mock api mobile testing',
    'cross-device mock backend sync',
    'pr preview mock database',
  ],
  alternates: {
    canonical: `${siteConfig.url}/docs/sandbox-sync`,
  },
  openGraph: {
    title: 'Shareable Sandbox URLs & QR Code Sync — Playground API',
    description:
      'Instantly connect mobile devices, teammates, and automated CI pipelines to your custom mock API sandbox state via QR code or URL parameters.',
    url: `${siteConfig.url}/docs/sandbox-sync`,
    type: 'article',
  },
};

export default function SandboxSyncPage() {
  const jsonLdArticle = getDocArticleSchema({
    title: 'Shareable Sandbox URLs & QR Code Sync — Playground API',
    description:
      'Instantly connect mobile devices, teammates, and automated CI pipelines to your custom mock API sandbox state via QR code or URL parameters.',
    url: `${siteConfig.url}/docs/sandbox-sync`,
  });

  const jsonLdBreadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Docs', url: `${siteConfig.url}/docs` },
    { name: 'Sandbox & QR Sync', url: `${siteConfig.url}/docs/sandbox-sync` },
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
      <SandboxSyncClient />
    </>
  );
}
