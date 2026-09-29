'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface SearchPreset {
  id: string;
  name: string;
  resource: string;
  term: string;
  badge: string;
  description: string;
}

const SEARCH_PRESETS: SearchPreset[] = [
  {
    id: 'post-title-body',
    name: 'Blog Post Content',
    resource: 'posts',
    term: 'optio',
    badge: 'Substring Match',
    description: 'Searches across both "title" and "body" text fields in blog posts.'
  },
  {
    id: 'user-names',
    name: 'User Directory',
    resource: 'users',
    term: 'Chelsey',
    badge: 'Profile Search',
    description: 'Searches across user "name", "username", and "email" fields.'
  },
  {
    id: 'deep-nested',
    name: 'Deep Nested JSON',
    resource: 'users',
    term: 'Gwenborough',
    badge: 'Nested Traversal',
    description: 'Recurses into nested object structures like "address.city" and "company.name".'
  },
  {
    id: 'discussion-comments',
    name: 'Comment Threads',
    resource: 'comments',
    term: 'quo vero',
    badge: 'Multi-Word Token',
    description: 'Finds reader discussion comments matching multi-word phrase fragments.'
  },
  {
    id: 'custom-products',
    name: 'E-Commerce Catalog',
    resource: 'custom/products',
    term: 'MacBook',
    badge: 'Custom Collection',
    description: 'Searches across dynamic schema-less custom collection attributes.'
  }
];

export default function SearchPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const [selectedPresetId, setSelectedPresetId] = useState<string>('post-title-body');
  const [searchResource, setSearchResource] = useState<string>('posts');
  const [searchTerm, setSearchTerm] = useState<string>('optio');
  const [codeTab, setCodeTab] = useState<'hook' | 'abort' | 'tanstack' | 'curl'>('hook');

  const selectedPreset = SEARCH_PRESETS.find((p) => p.id === selectedPresetId) || SEARCH_PRESETS[0];

  const handleSelectPreset = (preset: SearchPreset) => {
    setSelectedPresetId(preset.id);
    setSearchResource(preset.resource);
    setSearchTerm(preset.term);
  };

  const currentEndpoint = `/${searchResource}?q=${encodeURIComponent(searchTerm)}`;

  const debouncedHookCode = `// hooks/useDebouncedSearch.ts
import { useState, useEffect } from 'react';

export function useDebouncedSearch<T>(resource: string, query: string, delay = 300) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // AbortController cancels obsolete inflight requests on fast typing
    const controller = new AbortController();

    const handler = setTimeout(async () => {
      try {
        const res = await fetch(
          \`${publicApiUrl}/\${resource}?q=\${encodeURIComponent(query.trim())}\`,
          {
            signal: controller.signal,
            credentials: 'include'
          }
        );

        if (!res.ok) throw new Error('Search query returned non-200 status');
        const json = await res.json();
        setData(json.data || json);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Search failed');
        }
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [resource, query, delay]);

  return { data, loading, error };
}`;

  const abortFetchCode = `// Autocomplete Search with AbortController
let currentAbortController = null;

async function executeSearch(resource, query) {
  // Cancel previous pending search query to prevent out-of-order race conditions
  if (currentAbortController) {
    currentAbortController.abort();
  }
  currentAbortController = new AbortController();

  const response = await fetch(
    \`${publicApiUrl}/\${resource}?q=\${encodeURIComponent(query)}\`,
    {
      signal: currentAbortController.signal,
      credentials: 'include'
    }
  );

  const { data, pagination } = await response.json();
  return { results: data, total: pagination?.total || data.length };
}`;

  const tanstackCode = `// queries/useSearchQuery.ts
import { useQuery } from '@tanstack/react-query';

export function useSearchQuery(resource: string, query: string) {
  return useQuery({
    queryKey: ['search', resource, query],
    queryFn: async ({ signal }) => {
      const res = await fetch(
        \`${publicApiUrl}/\${resource}?q=\${encodeURIComponent(query)}\`,
        { signal, credentials: 'include' }
      );
      if (!res.ok) throw new Error('Search failed');
      return res.json();
    },
    enabled: query.trim().length >= 2, // Only trigger after 2+ characters
    staleTime: 1000 * 60 * 2 // Cache search results for 2 minutes
  });
}`;

  const curlCode = `# Full-text search across posts
curl -X GET "${publicApiUrl}/posts?q=optio" \\
  -H "Accept: application/json"

# Deep nested object search across user addresses
curl -X GET "${publicApiUrl}/users?q=Gwenborough" \\
  -H "Accept: application/json"`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:magnifying-glass-bold" className="w-3.5 h-3.5" />
          <span>Data & Query Engine</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Full-Text Search Engine
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Instantly search across any collection or resource with the global <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-bold">?q=</code> parameter. Matches case-insensitively across top-level string and numeric fields, as well as deeply nested JSON objects.
        </p>
      </div>

      {/* 2. Interactive Search Tester */}
      <div id="interactive-runner" className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Live Search Workbench</h3>
            <p className="text-xs text-slate-500">Pick a preset search or test custom queries across any resource:</p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {SEARCH_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedPresetId === preset.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>&quot;{preset.term}&quot;</span>
                <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${
                  selectedPresetId === preset.id ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-500'
                }`}>
                  {preset.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Parameter Inputs */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Target Resource
              </label>
              <select
                value={searchResource}
                onChange={(e) => setSearchResource(e.target.value)}
                className="w-full text-xs font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 font-semibold cursor-pointer"
              >
                <option value="posts">posts (Articles)</option>
                <option value="users">users (Directory)</option>
                <option value="comments">comments (Discussions)</option>
                <option value="todos">todos (Tasks)</option>
                <option value="custom/products">custom/products (Catalog)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Search Term (?q=)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Type any keyword or substring..."
                  className="w-full text-xs font-mono bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                />
                <Icon icon="ph:magnifying-glass-bold" className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-200/60">
            <span>{selectedPreset.description}</span>
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

      {/* 3. Deep Search Mechanics & Traversal */}
      <div id="search-mechanics" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Search Traversal & Matching Mechanics
          </h2>
          <p className="text-sm text-slate-600">
            How the Playground search engine evaluates queries across records in your session overlay:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Icon icon="ph:text-t-bold" className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Case-Insensitive Substrings</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Searching for <code className="font-mono text-indigo-600">?q=laptop</code> matches <code className="font-mono">"Laptops"</code>, <code className="font-mono">"Gaming Laptop"</code>, and <code className="font-mono">"LAPTOP"</code> identically.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Icon icon="ph:tree-structure-bold" className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Recursive Object Traversal</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The query engine inspects top-level properties and recursively crawls nested child objects (such as <code className="font-mono">address.city</code> or <code className="font-mono">company.bs</code>).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Icon icon="ph:git-merge-bold" className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Session Overlay Awareness</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Newly created records, local edits, and custom collections in your active visitor session are instantly searchable alongside global baseline data.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Production Client Code Recipes */}
      <div id="code-recipes" className="space-y-4 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Frontend Integration Recipes</h2>
            <p className="text-sm text-slate-600">Production patterns featuring debouncing, AbortController, and query cancellation:</p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            {(['hook', 'abort', 'tanstack', 'curl'] as const).map((tab) => (
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
                {tab === 'hook' ? 'React 19 Debounce' : tab === 'abort' ? 'AbortController' : tab === 'tanstack' ? 'TanStack Query' : 'cURL'}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          {codeTab === 'hook' && (
            <CodeBlock
              code={debouncedHookCode}
              language="typescript"
              title="hooks/useDebouncedSearch.ts"
            />
          )}
          {codeTab === 'abort' && (
            <CodeBlock
              code={abortFetchCode}
              language="javascript"
              title="api/searchClient.js"
            />
          )}
          {codeTab === 'tanstack' && (
            <CodeBlock
              code={tanstackCode}
              language="typescript"
              title="queries/useSearchQuery.ts"
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
          href="/docs/query/sorting"
          className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/30 transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs text-slate-500 font-semibold">Next Query Feature</span>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 flex items-center gap-1.5 mt-0.5">
              <span>Dynamic Multi-Type Sorting</span>
              <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5" />
            </h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Icon icon="ph:arrows-down-up-bold" className="w-4 h-4" />
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
