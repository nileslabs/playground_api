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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quickstart Guide — Playground API',
    description:
      'Make your first persistent REST and GraphQL requests in under 5 minutes with zero credentials.',
  },
};

export default function QuickstartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
