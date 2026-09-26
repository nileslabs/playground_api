'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function CursorPaginationPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

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
          Perfect for infinite scrolling feeds and mobile apps. Eliminates page drift and duplicate item rendering when new records are inserted at the top of the collection.
        </p>
      </div>

      {/* 2. Interactive Cursor Runner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Live Cursor Window Runner</h3>
          <p className="text-xs text-slate-500">
            Fetch an initial cursor page, then pass the returned <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">nextCursor</code> token to load the next slice:
          </p>
        </div>

        <InteractiveConsole
          method="GET"
          path="/posts?_limit=5"
          title="Cursor Window Console"
          description="Returns records along with nextCursor and hasMore flag."
        />
      </div>

      {/* 3. Cursor vs Offset Comparison Grid */}
      <div id="comparison" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          When to Use Cursor Pagination
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Icon icon="ph:check-circle-bold" className="w-4 h-4 text-emerald-600" />
              <span>Cursor-Based (Recommended for Feeds)</span>
            </h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li>Stable pagination when new items are continuously created.</li>
              <li>O(1) indexing performance for large datasets.</li>
              <li>Returns base64-encoded opaque pointers: <code className="font-mono text-indigo-600">nextCursor</code>.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Icon icon="ph:number-circle-two-bold" className="w-4 h-4 text-indigo-600" />
              <span>Offset-Based (Recommended for Data Tables)</span>
            </h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li>Allows jumping directly to any arbitrary page number (e.g. Page 7).</li>
              <li>Provides total page count (<code className="font-mono text-indigo-600">totalPages</code>).</li>
              <li>Vulnerable to &quot;page drift&quot; if records are deleted during reading.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
