import React from 'react';
import type { Metadata } from 'next';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';
import { siteConfig } from '@/config/site';
import { getDocArticleSchema, getBreadcrumbSchema } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Query Filtering & Relational Sub-Resources — Search, Sort & Paginate',
  description:
    'Complete guide to filtering, pagination, sorting, and querying relational sub-resources in Playground API. JSONPlaceholder parity with ?_page, ?_limit, ?_sort, ?q, and /users/:id/posts.',
  keywords: [
    'mock api filtering',
    'relational sub-resources api',
    'jsonplaceholder query filtering',
    'rest api sorting and pagination',
    'full-text search mock api',
  ],
  alternates: {
    canonical: `${siteConfig.url}/docs/filtering`,
  },
  openGraph: {
    title: 'Query Filtering & Relational Sub-Resources — Playground API',
    description:
      'Learn how to filter, paginate, sort, and query relational sub-resources in Playground API.',
    url: `${siteConfig.url}/docs/filtering`,
    type: 'article',
  },
};

export default function FilteringPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const paginationSnippet = `// 1. Pagination with limit and page
fetch('${publicApiUrl}/posts?_page=1&_limit=10')

// 2. Sorting by title descending
fetch('${publicApiUrl}/posts?_sort=title&_order=desc')

// 3. Full-text search across title and body
fetch('${publicApiUrl}/posts?q=javascript')`;

  const relationSnippet = `// 1. Fetch all posts written by user ID 1
fetch('${publicApiUrl}/users/1/posts')

// 2. Fetch all comments under post ID 1
fetch('${publicApiUrl}/posts/1/comments')

// 3. Fetch all todos assigned to user ID 1
fetch('${publicApiUrl}/users/1/todos')

// 4. Alternatively, use query parameter filtering
fetch('${publicApiUrl}/posts?user_id=1')`;

  const jsonLdArticle = getDocArticleSchema({
    title: 'Query Filtering & Relational Sub-Resources — Playground API',
    description: 'Learn how to filter, paginate, sort, and query sub-resources in Playground API.',
    url: `${siteConfig.url}/docs/filtering`,
  });

  const jsonLdBreadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Docs', url: `${siteConfig.url}/docs` },
    { name: 'Query Filtering & Relations', url: `${siteConfig.url}/docs/filtering` },
  ]);

  return (
    <div className="space-y-10 w-full max-w-none text-text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />

      {/* 1. Header */}
      <div id="overview" className="space-y-2 scroll-mt-20">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
          Query Filtering & Relations
        </h1>
        <p className="text-base text-text-secondary leading-relaxed">
          Playground API provides full JSONPlaceholder parity with query parameters for pagination, multi-field sorting, full-text search, and relational sub-resources.
        </p>
      </div>

      {/* Pagination & Sorting */}
      <div id="pagination-sorting" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          Pagination, Sorting & Search
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          All collection endpoints support standard pagination, sorting, and search query parameters:
        </p>
        <CodeBlock code={paginationSnippet} language="javascript" title="Pagination & Filtering" />
      </div>

      {/* Relational Endpoints */}
      <div id="relations" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          Nested Relational Sub-Resources
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Access nested relational data using intuitive nested paths or query parameters:
        </p>
        <CodeBlock code={relationSnippet} language="javascript" title="Relational Queries" />
      </div>
    </div>
  );
}
