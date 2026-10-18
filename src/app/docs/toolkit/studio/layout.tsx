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
    siteName: 'Playground API Documentation',
    type: 'article',
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Interactive Studio — Playground API',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interactive Studio — Playground API',
    description:
      'Test live REST and GraphQL endpoints in your browser with real persistent mutations.',
    images: [`${siteConfig.url}/og-image.png`],
  },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
