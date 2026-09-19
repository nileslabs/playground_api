import React from 'react';
import type { Metadata } from 'next';
import { TypeScriptSdkClient } from '@/components/docs/TypeScriptSdkClient';
import { siteConfig } from '@/config/site';
import { getDocArticleSchema, getBreadcrumbSchema } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Official TypeScript SDK (playground-api) — Playground API',
  description:
    'Official zero-dependency, isomorphic TypeScript SDK (playground-api) for React, Next.js, Vue, Svelte, Node.js, and browser environments with built-in per-session sandboxing.',
  keywords: [
    'playground-api typescript sdk',
    'mock api client npm',
    'isomorphic mock api sdk',
    'free fake rest api sdk',
    'jsonplaceholder typescript sdk',
  ],
  alternates: {
    canonical: `${siteConfig.url}/docs/sdk`,
  },
  openGraph: {
    title: 'Official TypeScript SDK (playground-api) — Playground API',
    description:
      'Zero-dependency isomorphic TypeScript SDK for interacting with Playground API across modern web frameworks.',
    url: `${siteConfig.url}/docs/sdk`,
    type: 'article',
  },
};

export default function TypeScriptSdkPage() {
  const jsonLdArticle = getDocArticleSchema({
    title: 'Official TypeScript SDK (playground-api) — Playground API',
    description:
      'Official zero-dependency, isomorphic TypeScript SDK for React, Next.js, Vue, Node.js, and browser environments.',
    url: `${siteConfig.url}/docs/sdk`,
  });

  const jsonLdBreadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Docs', url: `${siteConfig.url}/docs` },
    { name: 'TypeScript SDK', url: `${siteConfig.url}/docs/sdk` },
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
      <TypeScriptSdkClient />
    </>
  );
}
