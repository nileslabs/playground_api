'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';

export default function OffsetPaginationPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const [resource, setResource] = useState<string>('posts');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [codeTab, setCodeTab] = useState<'tanstack' | 'react' | 'fetch' | 'curl'>('tanstack');

  const currentEndpoint = `/${resource}?_page=${page}&_limit=${limit}`;

  const tanstackCode = `// queries/usePaginatedPosts.ts
import { useQuery, keepPreviousData } from '@tanstack/react-query';

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface PostsResponse {
  data: any[];
  pagination: PaginationMeta;
}

export function usePaginatedPosts(page = 1, limit = 10) {
  return useQuery<PostsResponse>({
    queryKey: ['posts', 'paginated', page, limit],
    queryFn: async () => {
      const res = await fetch(
        \`${publicApiUrl}/posts?_page=\${page}&_limit=\${limit}\`,
        { credentials: 'include' }
      );
      if (!res.ok) throw new Error('Failed to load page');
      return res.json();
    },
    // keepPreviousData prevents layout flickering during page navigation
    placeholderData: keepPreviousData
  });
}`;

  const reactComponentCode = `// components/PaginationControls.tsx
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export function PaginationControls({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-1.5 rounded-lg border text-sm font-semibold disabled:opacity-40"
      >
        Previous
      </button>

      <span className="text-sm font-mono font-bold">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-1.5 rounded-lg border text-sm font-semibold disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}`;

  const fetchCode = `// Vanilla JavaScript / TypeScript Fetch
async function fetchPage(pageNumber = 1, pageSize = 10) {
  const response = await fetch(
    \`${publicApiUrl}/posts?_page=\${pageNumber}&_limit=\${pageSize}\`,
    { credentials: 'include' }
  );

  // Response includes data rows + complete pagination metadata
  const { data, pagination } = await response.json();
  
  // Also accessible via standard HTTP response headers
  const totalCount = response.headers.get('X-Total-Count');
  const linkHeader = response.headers.get('Link');

  return { items: data, meta: pagination, totalCount, linkHeader };
}`;

  const curlCode = `# Fetch page 2 with limit 5 (records 6 to 10)
curl -i -X GET "${publicApiUrl}/posts?_page=2&_limit=5" \\
  -H "Accept: application/json"

# Inspect response headers:
# X-Total-Count: 100
# X-Total-Pages: 20
# Link: <...>; rel="first", <...>; rel="prev", <...>; rel="next", <...>; rel="last"`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:number-circle-two-bold" className="w-3.5 h-3.5" />
          <span>Data & Query Engine</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Offset-Based Pagination
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Standard numbered page navigation using <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-bold">_page</code> and <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-bold">_limit</code>. Playground computes complete pagination metadata payload alongside standard RFC 5988 <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">Link</code> headers.
        </p>
      </div>

      {/* 2. Interactive Paginator Runner */}
      <div id="interactive-runner" className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Interactive Page Navigator</h3>
            <p className="text-xs text-slate-500">Test numbered page offsets and limit sizes against live data:</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl border border-slate-200 p-0.5 bg-slate-50">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 hover:bg-slate-200"
              >
                <Icon icon="ph:caret-left-bold" className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <span className="px-3 text-xs font-mono font-bold text-indigo-600">
                Page {page}
              </span>

              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                className="px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 text-slate-700 hover:bg-slate-200"
              >
                <span>Next</span>
                <Icon icon="ph:caret-right-bold" className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Configuration Controls */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Target Collection
              </label>
              <select
                value={resource}
                onChange={(e) => {
                  setResource(e.target.value);
                  setPage(1);
                }}
                className="w-full text-xs font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 font-semibold cursor-pointer"
              >
                <option value="posts">posts (100 base items)</option>
                <option value="users">users (10 base profiles)</option>
                <option value="comments">comments (500 base records)</option>
                <option value="todos">todos (200 base checklist tasks)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Page Size Limit (_limit)
              </label>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="w-full text-xs font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 font-semibold cursor-pointer"
              >
                <option value={5}>5 items per page</option>
                <option value={10}>10 items per page</option>
                <option value={25}>25 items per page</option>
                <option value={50}>50 items per page</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-200/60">
            <span>
              Requesting page <span className="font-bold text-slate-800">{page}</span> with limit of <span className="font-bold text-slate-800">{limit}</span> records.
            </span>
            <code className="font-mono text-indigo-600 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">
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

      {/* 3. Metadata Schema & HTTP Headers Table */}
      <div id="metadata-reference" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Pagination Metadata & Response Headers
          </h2>
          <p className="text-sm text-slate-600">
            Playground returns calculated navigation metadata in both the JSON payload and standard HTTP response headers:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Icon icon="ph:brackets-curly-bold" className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-900">JSON Payload Object</h3>
            </div>
            <pre className="text-xs font-mono bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto">
{`{
  "data": [ /* page items */ ],
  "pagination": {
    "page": 2,
    "limit": 5,
    "total": 100,
    "totalPages": 20,
    "hasNextPage": true,
    "hasPrevPage": true
  }
}`}
            </pre>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Icon icon="ph:paper-plane-tilt-bold" className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900">HTTP Response Headers</h3>
            </div>
            <pre className="text-xs font-mono bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto">
{`X-Total-Count: 100
X-Page: 2
X-Limit: 5
X-Total-Pages: 20
Link: <..._page=1>; rel="first",
      <..._page=1>; rel="prev",
      <..._page=3>; rel="next",
      <..._page=20>; rel="last"`}
            </pre>
          </div>
        </div>
      </div>

      {/* 4. Production Client Code Recipes */}
      <div id="code-recipes" className="space-y-4 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Client Integration Recipes</h2>
            <p className="text-sm text-slate-600">Production patterns for smooth pagination without screen flickers:</p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            {(['tanstack', 'react', 'fetch', 'curl'] as const).map((tab) => (
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
                {tab === 'tanstack' ? 'TanStack Query' : tab === 'react' ? 'React Component' : tab === 'fetch' ? 'Fetch API' : 'cURL'}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          {codeTab === 'tanstack' && (
            <CodeBlock
              code={tanstackCode}
              language="typescript"
              title="queries/usePaginatedPosts.ts"
            />
          )}
          {codeTab === 'react' && (
            <CodeBlock
              code={reactComponentCode}
              language="typescript"
              title="components/PaginationControls.tsx"
            />
          )}
          {codeTab === 'fetch' && (
            <CodeBlock
              code={fetchCode}
              language="javascript"
              title="api/paginationClient.js"
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
          href="/docs/query/pagination-cursor"
          className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/30 transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs text-slate-500 font-semibold">Next Query Feature</span>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 flex items-center gap-1.5 mt-0.5">
              <span>Cursor-Based Pagination (Infinite Scroll)</span>
              <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5" />
            </h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Icon icon="ph:infinite-bold" className="w-4 h-4" />
          </div>
        </Link>

        <Link
          href="/docs/query/csv-excel-export"
          className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/30 transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs text-slate-500 font-semibold">Related Query Feature</span>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 flex items-center gap-1.5 mt-0.5">
              <span>CSV & Excel Export & Import</span>
              <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5" />
            </h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Icon icon="ph:file-xls-bold" className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </div>
  );
}
