'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function SearchPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const [searchQuery, setSearchQuery] = useState('qui');

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:magnifying-glass-bold" className="w-3.5 h-3.5" />
          <span>Data & Query Engine</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Full-Text Search
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Instantly search across any collection or resource with the global <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">?q=</code> parameter. Matches case-insensitively across all string, numeric, and nested object fields.
        </p>
      </div>

      {/* 2. Interactive Search Tester */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Live Search Tester</h3>
            <p className="text-xs text-slate-500">Type a keyword or choose a suggested term to search across posts:</p>
          </div>

          <div className="flex items-center gap-2">
            {['qui', 'architecto', 'magnam'].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setSearchQuery(term)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  searchQuery === term
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                &quot;{term}&quot;
              </button>
            ))}
          </div>
        </div>

        <InteractiveConsole
          method="GET"
          path={`/posts?q=${encodeURIComponent(searchQuery)}`}
          title="Full-Text Search Console"
          description={`Searching for "${searchQuery}" across all post attributes.`}
        />
      </div>

      {/* 3. Query Behavior Details */}
      <div id="search-mechanics" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Search Engine Mechanics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <Icon icon="ph:text-t-bold" className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Case-Insensitive</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Searches ignore uppercase and lowercase distinctions. Searching for &quot;REACT&quot; matches &quot;react&quot;, &quot;React&quot;, and &quot;ReAcT&quot;.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <Icon icon="ph:tree-structure-bold" className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Deep Object Inspection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Recursively serializes nested JSON objects and arrays, allowing matching inside user address, company, or custom attributes.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Icon icon="ph:combine-bold" className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Composable</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Combine search queries with sorting and pagination seamlessly: <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">?q=react&_sort=id&_order=desc</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
