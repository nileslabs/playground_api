import React from 'react';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Interactive Studio — Live API Request Console',
  description:
    'Test live REST and GraphQL endpoints in your browser. Inspect headers, payload mutations, cookies, and network delay simulation in real time.',
  alternates: {
    canonical: `${siteConfig.url}/docs/toolkit/studio`,
  },
  openGraph: {
    title: 'Interactive Studio — Playground API',
    description:
      'Test live REST and GraphQL endpoints in your browser with real persistent mutations.',
    url: `${siteConfig.url}/docs/toolkit/studio`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interactive Studio — Playground API',
    description:
      'Test live REST and GraphQL endpoints in your browser with real persistent mutations.',
  },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
