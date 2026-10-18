import React from 'react';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Quickstart — 5-Minute Guide to Stateful Mock APIs',
  description:
    'Make your first persistent REST and GraphQL requests in under 5 minutes. Learn how to query, mutate, and isolate test data with zero setup.',
  alternates: {
    canonical: `${siteConfig.url}/docs/quickstart`,
  },
  openGraph: {
    title: 'Quickstart Guide — Playground API',
    description:
      'Make your first persistent REST and GraphQL requests in under 5 minutes with zero credentials.',
    url: `${siteConfig.url}/docs/quickstart`,
    siteName: 'Playground API Documentation',
    type: 'article',
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Quickstart Guide — Playground API',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quickstart Guide — Playground API',
    description:
      'Make your first persistent REST and GraphQL requests in under 5 minutes with zero credentials.',
    images: [`${siteConfig.url}/og-image.png`],
  },
};

export default function QuickstartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
