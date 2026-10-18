import React from 'react';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Official TypeScript SDK — Typed Client for Playground API',
  description:
    'Fully typed TypeScript/JavaScript SDK with automatic session cookie forwarding, query builders, and zero-config client integration.',
  alternates: {
    canonical: `${siteConfig.url}/docs/toolkit/typescript-sdk`,
  },
  openGraph: {
    title: 'Official TypeScript SDK — Playground API',
    description:
      'Fully typed TypeScript/JavaScript client SDK with automatic session management and query helpers.',
    url: `${siteConfig.url}/docs/toolkit/typescript-sdk`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Official TypeScript SDK — Playground API',
    description:
      'Fully typed TypeScript/JavaScript client SDK with automatic session management and query helpers.',
  },
};

export default function TypeScriptSdkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
