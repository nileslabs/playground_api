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

  const paginationSnippet = `// 1. Traditional Offset Pagination with limit and page
fetch('${publicApiUrl}/posts?_page=1&_limit=10')

// 2. Cursor-Based Pagination for Infinite Scroll
fetch('${publicApiUrl}/posts?limit=10')
// Response includes: pagination: { limit: 10, nextCursor: "eyJpZCI6MTB9", prevCursor: null, hasMore: true }

// 3. Fetching the next page with cursor
fetch('${publicApiUrl}/posts?cursor=eyJpZCI6MTB9&limit=10')

// 4. Sorting by title descending
fetch('${publicApiUrl}/posts?_sort=title&_order=desc')

// 5. Full-text search across title and body
fetch('${publicApiUrl}/posts?q=javascript')`;

  const infiniteQuerySnippet = `import { useInfiniteQuery } from '@tanstack/react-query';

export function InfinitePostList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
    queryKey: ['posts', 'infinite'],
    queryFn: async ({ pageParam = null }) => {
      const url = new URL('${publicApiUrl}/posts');
      url.searchParams.set('limit', '10');
      if (pageParam) url.searchParams.set('cursor', pageParam);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => (lastPage.pagination?.hasMore ? lastPage.pagination.nextCursor : undefined),
  });

  return (
    <div>
      {data?.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.data.map((post) => (
            <article key={post.id} className="p-4 border-b">
              <h3 className="font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-600">{post.body}</p>
            </article>
          ))}
        </React.Fragment>
      ))}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-4 px-4 py-2 bg-primary text-white rounded"
        >
          {isFetchingNextPage ? 'Loading more...' : 'Load More'}
        </button>
      )}
    </div>
  );
}`;

  const swrInfiniteSnippet = `import useSWRInfinite from 'swr/infinite';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function SWRPostFeed() {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.pagination?.hasMore) return null; // reached the end
    if (pageIndex === 0) return '${publicApiUrl}/posts?limit=10'; // first page
    return \`${publicApiUrl}/posts?cursor=\${encodeURIComponent(previousPageData.pagination.nextCursor)}&limit=10\`;
  };

  const { data, size, setSize, isValidating } = useSWRInfinite(getKey, fetcher);
  const posts = data ? data.flatMap(page => page.data) : [];
  const isEnd = data && data[data.length - 1]?.pagination?.hasMore === false;

  return (
    <div>
      <ul>
        {posts.map(p => <li key={p.id}>{p.title}</li>)}
      </ul>
      {!isEnd && (
        <button onClick={() => setSize(size + 1)} disabled={isValidating}>
          {isValidating ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}`;

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
          Query Filtering, Pagination & Relations
        </h1>
        <p className="text-base text-text-secondary leading-relaxed">
          Playground API provides full JSONPlaceholder parity with query parameters for offset and cursor-based pagination, multi-field sorting, full-text search, and relational sub-resources.
        </p>
      </div>

      {/* Pagination & Sorting */}
      <div id="pagination-sorting" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          Pagination, Sorting & Search
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          All collection endpoints support standard offset pagination, cursor-based pagination, sorting, and full-text search parameters:
        </p>
        <CodeBlock code={paginationSnippet} language="javascript" title="Pagination & Filtering" />
      </div>

      {/* Cursor-Based Pagination & Infinite Scroll */}
      <div id="cursor-pagination" className="space-y-4 pt-6 border-t border-border-theme scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-text-primary">
            Cursor-Based Pagination & Infinite Scroll
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Pass <code className="text-xs bg-bg-card px-1.5 py-0.5 rounded border border-border-theme text-primary font-mono">cursor</code> (or <code className="text-xs bg-bg-card px-1.5 py-0.5 rounded border border-border-theme text-primary font-mono">_cursor</code>) to seamlessly paginate through large datasets and feed infinite-scroll hooks without managing offset calculations.
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border-theme bg-bg-card p-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border-theme text-text-muted">
                <th className="pb-2 font-mono">Field</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-theme/50 font-mono text-text-secondary">
              <tr>
                <td className="py-2 text-primary">cursor / _cursor</td>
                <td className="py-2 text-text-muted">string (base64)</td>
                <td className="py-2 font-sans">Base64-encoded token of the last seen item ID (e.g. <code className="text-[11px] font-mono">eyJpZCI6MTB9</code>).</td>
              </tr>
              <tr>
                <td className="py-2 text-primary">limit / _limit</td>
                <td className="py-2 text-text-muted">integer (1–200)</td>
                <td className="py-2 font-sans">Number of records per page (default: 10).</td>
              </tr>
              <tr>
                <td className="py-2 text-accent-green">nextCursor</td>
                <td className="py-2 text-text-muted">string | null</td>
                <td className="py-2 font-sans">Opaque token to pass into the subsequent request. Returns <code className="text-[11px] font-mono">null</code> when at the end of data.</td>
              </tr>
              <tr>
                <td className="py-2 text-accent-green">hasMore</td>
                <td className="py-2 text-text-muted">boolean</td>
                <td className="py-2 font-sans">Indicates whether additional items exist beyond the current page.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-base font-semibold text-text-primary pt-2">
          TanStack Query (React Query) Infinite Scroll
        </h3>
        <CodeBlock code={infiniteQuerySnippet} language="tsx" title="React Query useInfiniteQuery Recipe" />

        <h3 className="text-base font-semibold text-text-primary pt-2">
          Vercel SWR Infinite Feed
        </h3>
        <CodeBlock code={swrInfiniteSnippet} language="tsx" title="SWR useSWRInfinite Recipe" />
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
