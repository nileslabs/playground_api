import React from 'react';
import type { Metadata } from 'next';
import { GraphqlExplorerClient } from '@/components/docs/GraphqlExplorerClient';
import { siteConfig } from '@/config/site';
import { getDocArticleSchema, getBreadcrumbSchema } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'GraphQL API Gateway & GraphiQL IDE — Playground API',
  description:
    'Interactive GraphQL Gateway & GraphiQL IDE: Execute persistent queries and mutations against unified GraphQL schemas for posts, users, comments, todos, and authentication.',
  keywords: [
    'mock graphql api',
    'graphiql explorer playground',
    'free graphql sandbox',
    'graphql mutations persistence',
    'fake graphql endpoint for react',
  ],
  alternates: {
    canonical: `${siteConfig.url}/docs/graphql`,
  },
  openGraph: {
    title: 'GraphQL API Gateway & Interactive IDE — Playground API',
    description:
      'Execute GraphQL queries and mutations against the unified mock gateway endpoint with session state persistence.',
    url: `${siteConfig.url}/docs/graphql`,
    type: 'article',
  },
};

export default function GraphqlPage() {
  const jsonLdArticle = getDocArticleSchema({
    title: 'GraphQL API Gateway & GraphiQL IDE — Playground API',
    description: 'Execute GraphQL queries and mutations against the unified gateway endpoint.',
    url: `${siteConfig.url}/docs/graphql`,
  });

  const jsonLdBreadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Docs', url: `${siteConfig.url}/docs` },
    { name: 'GraphQL Gateway', url: `${siteConfig.url}/docs/graphql` },
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
      <GraphqlExplorerClient />
    </>
  );
}
