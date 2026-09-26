'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function FilteringPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const [filterType, setFilterType] = useState<'user' | 'status' | 'multiple'>('user');

  const filterExamples = {
    user: {
      path: '/posts?userId=1',
      description: 'Filters posts where the author user_id is exactly 1.',
      curl: `curl "${publicApiUrl}/posts?userId=1"`,
      fetch: `fetch('${publicApiUrl}/posts?userId=1', { credentials: 'include' })\n  .then(res => res.json())\n  .then(console.log);`,
    },
    status: {
      path: '/todos?completed=true',
      description: 'Filters todos where the completed boolean is strictly true.',
      curl: `curl "${publicApiUrl}/todos?completed=true"`,
      fetch: `fetch('${publicApiUrl}/todos?completed=true', { credentials: 'include' })\n  .then(res => res.json())\n  .then(console.log);`,
    },
    multiple: {
      path: '/todos?userId=1&completed=false',
      description: 'Combines multiple relational filters using AND evaluation.',
      curl: `curl "${publicApiUrl}/todos?userId=1&completed=false"`,
      fetch: `fetch('${publicApiUrl}/todos?userId=1&completed=false', { credentials: 'include' })\n  .then(res => res.json())\n  .then(console.log);`,
    },
  };

  const current = filterExamples[filterType];

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:funnel-bold" className="w-3.5 h-3.5" />
          <span>Data & Query Engine</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Relational Filtering
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Filter records by exact property values, foreign keys, or booleans. Query filters are validated, type-cast, and evaluated in memory against your active session overlay.
        </p>
      </div>

      {/* 2. Interactive Filter Selector & TryItRunner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Live Filter Playground</h3>
            <p className="text-xs text-slate-500">Select a preset filter scenario to execute against the live backend:</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterType('user')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterType === 'user'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Author ID
            </button>
            <button
              type="button"
              onClick={() => setFilterType('status')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterType === 'status'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Boolean Status
            </button>
            <button
              type="button"
              onClick={() => setFilterType('multiple')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterType === 'multiple'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Multi-Field
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-600">{current.description}</p>

        <InteractiveConsole
          method="GET"
          path={current.path}
          title="Relational Filter Request"
          description={current.description}
        />
      </div>

      {/* 3. Filter Parameters Reference */}
      <div id="parameters" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Supported Filter Query Parameters
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-4">Parameter</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">userId / user_id</td>
                <td className="py-3 px-4 font-mono">Integer</td>
                <td className="py-3 px-4">Filters posts or todos created by a specific user.</td>
                <td className="py-3 px-4 font-mono text-slate-800">?userId=2</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">postId / post_id</td>
                <td className="py-3 px-4 font-mono">Integer</td>
                <td className="py-3 px-4">Filters comments belonging to a parent post.</td>
                <td className="py-3 px-4 font-mono text-slate-800">?postId=5</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">completed</td>
                <td className="py-3 px-4 font-mono">Boolean</td>
                <td className="py-3 px-4">Filters todos by completion state (<code className="font-mono bg-slate-100 px-1 py-0.5 rounded">true</code> or <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">false</code>).</td>
                <td className="py-3 px-4 font-mono text-slate-800">?completed=false</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">[field]</td>
                <td className="py-3 px-4 font-mono">String</td>
                <td className="py-3 px-4">Matches exact string equality against any top-level entity property.</td>
                <td className="py-3 px-4 font-mono text-slate-800">?category=electronics</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Code Sample */}
      <div id="code-examples" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Client Implementation Snippet
        </h2>
        <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 shadow-inner">
          <pre className="font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto">
            {current.fetch}
          </pre>
        </div>
      </div>
    </div>
  );
}
