'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function OffsetPaginationPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

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
          Standard numbered page navigation. Playground API computes full metadata including <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">totalPages</code>, <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">hasNextPage</code>, and <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">hasPrevPage</code>.
        </p>
      </div>

      {/* 2. Interactive Paginator Runner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Interactive Page Navigator</h3>
            <p className="text-xs text-slate-500">Cycle through pages or adjust page size limit:</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 disabled:opacity-40"
              >
                Prev
              </button>
              <span className="px-2 text-xs font-mono font-bold text-indigo-600">Page {page}</span>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700"
              >
                Next
              </button>
            </div>

            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800"
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
            </select>
          </div>
        </div>

        <InteractiveConsole
          method="GET"
          path={`/posts?_page=${page}&_limit=${limit}`}
          title="Offset Pagination Console"
          description={`Requesting page ${page} with a limit of ${limit} records.`}
        />
      </div>

      {/* 3. Pagination Schema */}
      <div id="metadata-schema" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Response Pagination Object
        </h2>
        <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 shadow-inner">
          <pre className="font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto leading-relaxed">
{`{
  "data": [ /* Array of records */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false,
    "hasMore": true
  }
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
