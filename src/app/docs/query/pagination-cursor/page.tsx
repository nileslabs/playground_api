'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';

export default function CursorPaginationPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const [activeCursor, setActiveCursor] = useState<string>('');
  const [limit, setLimit] = useState<number>(5);
  const [codeTab, setCodeTab] = useState<'tanstack' | 'hook' | 'fetch' | 'curl'>('tanstack');

  const currentEndpoint = activeCursor
    ? `/posts?_cursor=${encodeURIComponent(activeCursor)}&_limit=${limit}`
    : `/posts?_limit=${limit}`;

  const tanstackInfiniteCode = `// hooks/useInfinitePosts.ts
import { useInfiniteQuery } from '@tanstack/react-query';

interface CursorPaginationResponse {
  data: any[];
  pagination: {
    limit: number;
    total: number;
    nextCursor: string | null;
    hasMore: boolean;
  };
}

export function useInfinitePosts(pageSize = 10) {
  return useInfiniteQuery<CursorPaginationResponse>({
    queryKey: ['posts', 'infinite', pageSize],
    queryFn: async ({ pageParam }) => {
      const cursorParam = pageParam ? \`&_cursor=\${encodeURIComponent(String(pageParam))}\` : '';
      const res = await fetch(
        \`${publicApiUrl}/posts?_limit=\${pageSize}\${cursorParam}\`,
        { credentials: 'include' }
      );
      if (!res.ok) throw new Error('Failed to fetch cursor page');
      return res.json();
    },
    initialPageParam: null,
    // Extract opaque nextCursor returned by server
    getNextPageParam: (lastPage) => lastPage.pagination.hasMore ? lastPage.pagination.nextCursor : null
  });
}

// In your feed component:
// const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfinitePosts(10);
// const allPosts = data?.pages.flatMap((page) => page.data) || [];`;

  const reactFeedHook = `// hooks/useCursorFeed.ts
import { useState, useEffect, useCallback } from 'react';

export function useCursorFeed(resource: string, limit = 5) {
  const [items, setItems] = useState<any[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const cursorQuery = nextCursor ? \`&_cursor=\${encodeURIComponent(nextCursor)}\` : '';
      const res = await fetch(\`${publicApiUrl}/\${resource}?_limit=\${limit}\${cursorQuery}\`, {
        credentials: 'include'
      });
      const json = await res.json();

      setItems((prev) => [...prev, ...(json.data || [])]);
      setNextCursor(json.pagination?.nextCursor || null);
      setHasMore(Boolean(json.pagination?.hasMore));
    } catch (err) {
      console.error('Cursor load failed', err);
    } finally {
      setLoading(false);
    }
  }, [resource, limit, nextCursor, hasMore, loading]);

  useEffect(() => {
    // Initial fetch
    loadMore();
  }, []);

  return { items, hasMore, loading, loadMore };
}`;

  const fetchCode = `// Vanilla JavaScript / TypeScript Fetch
async function fetchCursorWindow(cursorToken = null, limit = 5) {
  const params = new URLSearchParams({ _limit: String(limit) });
  if (cursorToken) {
    params.set('_cursor', cursorToken);
  }

  const res = await fetch(\`${publicApiUrl}/posts?\${params}\`, {
    credentials: 'include'
  });

  const { data, pagination } = await res.json();
  console.log('Returned items:', data.length);
  console.log('Next cursor token:', pagination.nextCursor);
  console.log('Are more items available:', pagination.hasMore);

  return { data, nextCursor: pagination.nextCursor, hasMore: pagination.hasMore };
}`;

  const curlCode = `# 1. Fetch initial window
curl -X GET "${publicApiUrl}/posts?_limit=5" \\
  -H "Accept: application/json"

# 2. Extract nextCursor token from response (e.g., "b2Zmc2V0OjU6ZGVzYzoxMDA=")
# 3. Request the subsequent slice
curl -X GET "${publicApiUrl}/posts?_cursor=b2Zmc2V0OjU6ZGVzYzoxMDA=&_limit=5" \\
  -H "Accept: application/json"`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:infinite-bold" className="w-3.5 h-3.5" />
          <span>Data & Query Engine</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Cursor-Based Pagination
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Engineered for infinite scrolling feeds, mobile applications, and high-frequency real-time updates. Eliminates <strong className="text-slate-900 font-semibold">page drift</strong> and prevents duplicate items when new records are continuously added to the top of collections.
        </p>
      </div>

      {/* 2. Interactive Cursor Runner */}
      <div id="interactive-runner" className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Live Cursor Window Runner</h3>
            <p className="text-xs text-slate-500">
              Fetch initial slice, or test passing an opaque <code className="font-mono text-xs text-indigo-600">_cursor</code> token:
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveCursor('')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                !activeCursor
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Icon icon="ph:arrow-counter-clockwise-bold" className="w-3.5 h-3.5" />
              <span>Reset to First Page</span>
            </button>
          </div>
        </div>

        {/* Cursor Parameters & Status */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Batch Size (_limit)
              </label>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full text-xs font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 font-semibold cursor-pointer"
              >
                <option value={3}>3 items per window</option>
                <option value={5}>5 items per window</option>
                <option value={10}>10 items per window</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Active Cursor Token (_cursor)
              </label>
              <input
                type="text"
                value={activeCursor}
                onChange={(e) => setActiveCursor(e.target.value)}
                placeholder="Leave blank for initial window, or paste nextCursor token..."
                className="w-full text-xs font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 pt-1 border-t border-slate-200/60">
            <span>
              {activeCursor ? 'Fetching subsequent slice with forward cursor pointer.' : 'Requesting initial cursor window (start of collection).'}
            </span>
            <code className="font-mono text-indigo-600 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px] self-start sm:self-auto">
              GET {currentEndpoint}
            </code>
          </div>
        </div>

        {/* Live Interactive Console */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Live API Runner</label>
            <span className="text-[11px] text-slate-500 font-mono">Method: GET</span>
          </div>
          <InteractiveConsole
            key={currentEndpoint}
            initialMethod="GET"
            initialEndpoint={currentEndpoint}
          />
        </div>
      </div>

      {/* 3. Architectural Comparison: Offset vs Cursor */}
      <div id="comparison" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Architectural Comparison: Offset vs Cursor
          </h2>
          <p className="text-sm text-slate-600">
            Understand the trade-offs between traditional offset numbering and modern opaque cursors:
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-4">Evaluation Metric</th>
                <th className="py-3 px-4">Offset Pagination (?_page=2)</th>
                <th className="py-3 px-4">Cursor Pagination (?_cursor=...)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 text-xs">
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-900">Page Drift Vulnerability</td>
                <td className="py-3 px-4 text-rose-600 font-medium">
                  High. If a new post is inserted while reading page 1, item #10 shifts to page 2 and is seen twice.
                </td>
                <td className="py-3 px-4 text-emerald-600 font-semibold">
                  Zero. Pointer anchors to the exact record boundary regardless of new items created above.
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-900">Database Query Performance</td>
                <td className="py-3 px-4">
                  Degrades at scale (<code className="font-mono text-xs">OFFSET 50000</code> scans and discards 50,000 rows).
                </td>
                <td className="py-3 px-4 text-emerald-600 font-semibold">
                  Instant O(1) indexed seek (<code className="font-mono text-xs">WHERE id &lt; cursor LIMIT 10</code>).
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-900">Direct Page Number Jump</td>
                <td className="py-3 px-4 text-emerald-600 font-semibold">
                  Supported. Users can jump directly to &quot;Page 14&quot; via table pagination bars.
                </td>
                <td className="py-3 px-4 text-amber-600 font-medium">
                  Sequential only. Ideal for infinite scrolling, feeds, and &quot;Load More&quot; buttons.
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-900">Payload Signature</td>
                <td className="py-3 px-4 font-mono">
                  &#123; total, totalPages, page, limit &#125;
                </td>
                <td className="py-3 px-4 font-mono text-indigo-600">
                  &#123; nextCursor, hasMore, limit, total &#125;
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Production Client Code Recipes */}
      <div id="code-recipes" className="space-y-4 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Infinite Feed Client Recipes</h2>
            <p className="text-sm text-slate-600">Production patterns for TanStack Query Infinite and custom React feeds:</p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            {(['tanstack', 'hook', 'fetch', 'curl'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setCodeTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  codeTab === tab
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab === 'tanstack' ? 'TanStack Infinite' : tab === 'hook' ? 'React Feed Hook' : tab === 'fetch' ? 'Fetch API' : 'cURL'}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          {codeTab === 'tanstack' && (
            <CodeBlock
              code={tanstackInfiniteCode}
              language="typescript"
              title="hooks/useInfinitePosts.ts"
            />
          )}
          {codeTab === 'hook' && (
            <CodeBlock
              code={reactFeedHook}
              language="typescript"
              title="hooks/useCursorFeed.ts"
            />
          )}
          {codeTab === 'fetch' && (
            <CodeBlock
              code={fetchCode}
              language="javascript"
              title="api/cursorClient.js"
            />
          )}
          {codeTab === 'curl' && (
            <CodeBlock
              code={curlCode}
              language="bash"
              title="Terminal cURL Commands"
            />
          )}
        </div>
      </div>

      {/* 5. Navigation Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
        <Link
          href="/docs/query/csv-excel-export"
          className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/30 transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs text-slate-500 font-semibold">Next Query Feature</span>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 flex items-center gap-1.5 mt-0.5">
              <span>CSV & Excel Export & Import</span>
              <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5" />
            </h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Icon icon="ph:file-xls-bold" className="w-4 h-4" />
          </div>
        </Link>

        <Link
          href="/docs/query/pagination-offset"
          className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/30 transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs text-slate-500 font-semibold">Related Query Feature</span>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 flex items-center gap-1.5 mt-0.5">
              <span>Offset-Based Pagination</span>
              <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5" />
            </h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Icon icon="ph:number-circle-two-bold" className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </div>
  );
}
