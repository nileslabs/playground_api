'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function SortingPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:arrows-down-up-bold" className="w-3.5 h-3.5" />
          <span>Data & Query Engine</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Dynamic Multi-Type Sorting
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Order API responses by any numerical, string, or boolean field. Sort order is determined with type-aware comparison, ensuring proper integer sorting instead of lexicographical surprises.
        </p>
      </div>

      {/* 2. Interactive Sort Runner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Live Sorting Playground</h3>
            <p className="text-xs text-slate-500">Pick a sort key and direction to test on <code className="font-mono text-xs">/posts</code>:</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800"
            >
              <option value="id">Sort by ID</option>
              <option value="title">Sort by Title</option>
              <option value="userId">Sort by User ID</option>
            </select>

            <div className="flex items-center rounded-xl border border-slate-200 p-0.5 bg-slate-50">
              <button
                type="button"
                onClick={() => setSortOrder('asc')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  sortOrder === 'asc' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                ASC
              </button>
              <button
                type="button"
                onClick={() => setSortOrder('desc')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  sortOrder === 'desc' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                DESC
              </button>
            </div>
          </div>
        </div>

        <InteractiveConsole
          method="GET"
          path={`/posts?_sort=${sortField}&_order=${sortOrder}`}
          title="Dynamic Sort Console"
          description={`Sorting by ${sortField} in ${sortOrder.toUpperCase()} order.`}
        />
      </div>

      {/* 3. Parameters Table */}
      <div id="parameters" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Sorting Parameters
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-4">Parameter</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Default</th>
                <th className="py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">_sort</td>
                <td className="py-3 px-4 font-mono">string</td>
                <td className="py-3 px-4 font-mono text-slate-400">id</td>
                <td className="py-3 px-4">Target property to sort on (e.g., <code className="font-mono text-xs">id</code>, <code className="font-mono text-xs">title</code>, <code className="font-mono text-xs">createdAt</code>).</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">_order</td>
                <td className="py-3 px-4 font-mono">&apos;asc&apos; | &apos;desc&apos;</td>
                <td className="py-3 px-4 font-mono text-slate-400">asc</td>
                <td className="py-3 px-4">Sorting direction: ascending (<code className="font-mono text-xs">asc</code>) or descending (<code className="font-mono text-xs">desc</code>).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
