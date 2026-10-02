'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface FilterPreset {
  id: string;
  name: string;
  badge: string;
  endpoint: string;
  description: string;
  params: { key: string; value: string; description: string }[];
}

const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'author-posts',
    name: 'Author Foreign Key',
    badge: 'Numeric FK',
    endpoint: '/posts?userId=1',
    description: 'Matches exact foreign key userId=1 across all merged global and session-created blog posts.',
    params: [
      { key: 'userId', value: '1', description: 'Coerced to integer matching posts authored by user 1' }
    ]
  },
  {
    id: 'completed-todos',
    name: 'Boolean Status Flag',
    badge: 'Boolean Coercion',
    endpoint: '/todos?completed=true',
    description: 'Coerces string "true" to boolean true and returns completed checklist tasks.',
    params: [
      { key: 'completed', value: 'true', description: 'Evaluated as strict boolean against todo records' }
    ]
  },
  {
    id: 'compound-and',
    name: 'Multi-Attribute AND',
    badge: 'Compound Logic',
    endpoint: '/todos?userId=1&completed=false',
    description: 'Combines multiple relational filters using logical AND evaluation.',
    params: [
      { key: 'userId', value: '1', description: 'Target user author id' },
      { key: 'completed', value: 'false', description: 'Incomplete tasks only' }
    ]
  },
  {
    id: 'nested-field',
    name: 'Nested Object Path',
    badge: 'Dot Notation',
    endpoint: '/users?address.city=Gwenborough',
    description: 'Matches nested JSON fields using dot notation traversal across user directory profiles.',
    params: [
      { key: 'address.city', value: 'Gwenborough', description: 'Deep object property match inside address object' }
    ]
  },
  {
    id: 'custom-collection',
    name: 'Custom Collection Field',
    badge: 'Dynamic Schema',
    endpoint: '/custom/products?category=Laptops',
    description: 'Filters custom visitor collection records by arbitrary schema properties with zero migration.',
    params: [
      { key: 'category', value: 'Laptops', description: 'Matches category property on seeded custom products' }
    ]
  }
];

export default function FilteringPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const [selectedPresetId, setSelectedPresetId] = useState<string>('author-posts');
  const [customPath, setCustomPath] = useState<string>('/posts?userId=1');
  const [codeTab, setCodeTab] = useState<'react' | 'tanstack' | 'fetch' | 'curl'>('react');

  const selectedPreset = FILTER_PRESETS.find((p) => p.id === selectedPresetId) || FILTER_PRESETS[0];

  const handleSelectPreset = (preset: FilterPreset) => {
    setSelectedPresetId(preset.id);
    setCustomPath(preset.endpoint);
  };

  const reactHookCode = `// hooks/useFilteredResources.ts
import { useState, useEffect } from 'react';

export function useFilteredPosts(userId?: number) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (userId !== undefined) {
      params.set('userId', String(userId));
    }

    const url = \`${publicApiUrl}/posts\${params.toString() ? \`?\${params.toString()}\` : ''}\`;

    fetch(url, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.data || data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Filter request failed', err);
        setLoading(false);
      });
  }, [userId]);

  return { posts, loading };
}`;

  const tanstackCode = `// queries/useTodosQuery.ts
import { useQuery } from '@tanstack/react-query';

interface TodoFilters {
  userId?: number;
  completed?: boolean;
}

export function useTodosQuery(filters: TodoFilters = {}) {
  return useQuery({
    // TanStack Query cache key mirrors relational query parameters
    queryKey: ['todos', filters],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (filters.userId !== undefined) searchParams.set('userId', String(filters.userId));
      if (filters.completed !== undefined) searchParams.set('completed', String(filters.completed));

      const res = await fetch(\`${publicApiUrl}/todos?\${searchParams.toString()}\`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to load filtered todos');
      return res.json();
    }
  });
}`;

  const fetchCode = `// Vanilla JavaScript / TypeScript
const queryParams = new URLSearchParams({
  userId: '1',
  completed: 'false'
});

const response = await fetch(\`${publicApiUrl}/todos?\${queryParams}\`, {
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  },
  credentials: 'include'
});

const { data, pagination } = await response.json();
console.log('Filtered todos count:', data.length);`;

  const curlCode = `# Relational filtering with multiple AND conditions
curl -X GET "${publicApiUrl}/todos?userId=1&completed=false" \\
  -H "Accept: application/json"

# Deep dot-notation filtering on nested properties
curl -X GET "${publicApiUrl}/users?address.city=Gwenborough" \\
  -H "Accept: application/json"`;

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
          Query records by exact property values, foreign keys, nested object paths, and boolean status flags. Query filters are automatically parsed, type-coerced, and evaluated in memory against your active session overlay.
        </p>
      </div>

      {/* 2. Interactive Filter Selector & TryItRunner */}
      <div id="interactive-runner" className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Filter Query Builder</h3>
            <p className="text-xs text-slate-500">Pick a preset scenario or test custom query parameters against the live API:</p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {FILTER_PRESETS.map((preset) => (
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
                <span>{preset.name}</span>
                <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${
                  selectedPresetId === preset.id ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-500'
                }`}>
                  {preset.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Preset Details */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-slate-900">{selectedPreset.name}</span>
              <p className="text-xs text-slate-600 mt-0.5">{selectedPreset.description}</p>
            </div>
            <code className="text-xs font-mono font-bold bg-white px-2 py-1 rounded border border-slate-200 text-indigo-600 self-start sm:self-auto">
              GET {selectedPreset.endpoint}
            </code>
          </div>

          {/* Query Parameters Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1 border-t border-slate-200/60">
            {selectedPreset.params.map((param) => (
              <div key={param.key} className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-indigo-600">{param.key}</span>
                  <span className="font-mono bg-indigo-50 text-indigo-700 px-1 py-0.5 rounded text-[10px] font-semibold">{param.value}</span>
                </div>
                <span className="text-slate-500 text-[11px] block">{param.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Interactive Console */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Live API Runner</label>
            <span className="text-[11px] text-slate-500 font-mono">Method: GET</span>
          </div>
          <InteractiveConsole
            key={customPath}
            initialMethod="GET"
            initialEndpoint={customPath}
          />
        </div>
      </div>

      {/* 3. Filter Operators & Type Coercion Matrix */}
      <div id="operators-matrix" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Type Coercion & Evaluation Rules
          </h2>
          <p className="text-sm text-slate-600">
            Because URL query parameters are inherently strings, the engine automatically detects and coerces values before filtering.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-4">Filter Type</th>
                <th className="py-3 px-4">Example Query</th>
                <th className="py-3 px-4">Coerced Type</th>
                <th className="py-3 px-4">Evaluation Logic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-600 text-xs">
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-900 font-sans">Integer / Foreign Key</td>
                <td className="py-3 px-4 text-indigo-600">?userId=1</td>
                <td className="py-3 px-4"><span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">Number</span></td>
                <td className="py-3 px-4 font-sans text-slate-600">Strict numeric comparison (<code className="font-mono text-xs">item.userId === 1</code>).</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-900 font-sans">Boolean Flag</td>
                <td className="py-3 px-4 text-indigo-600">?completed=true</td>
                <td className="py-3 px-4"><span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Boolean</span></td>
                <td className="py-3 px-4 font-sans text-slate-600">Coerces <code className="font-mono text-xs">"true"|"false"</code> to strict boolean values.</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-900 font-sans">String / Category</td>
                <td className="py-3 px-4 text-indigo-600">?category=Laptops</td>
                <td className="py-3 px-4"><span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">String</span></td>
                <td className="py-3 px-4 font-sans text-slate-600">Case-insensitive exact string match across record values.</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-900 font-sans">Nested Dot-Notation</td>
                <td className="py-3 px-4 text-indigo-600">?address.city=Gwenborough</td>
                <td className="py-3 px-4"><span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">Deep Object</span></td>
                <td className="py-3 px-4 font-sans text-slate-600">Safely traverses nested JSON objects without throwing null references.</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-900 font-sans">Compound Logical AND</td>
                <td className="py-3 px-4 text-indigo-600">?userId=1&completed=false</td>
                <td className="py-3 px-4"><span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">Multiple</span></td>
                <td className="py-3 px-4 font-sans text-slate-600">All specified query filters must evaluate to <code className="font-mono text-xs">true</code> simultaneously.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Production Client Code Recipes */}
      <div id="code-recipes" className="space-y-4 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Client Integration Recipes</h2>
            <p className="text-sm text-slate-600">Clean code patterns for dynamic query parameters in production applications:</p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            {(['react', 'tanstack', 'fetch', 'curl'] as const).map((tab) => (
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
                {tab === 'react' ? 'React 19 Hook' : tab === 'tanstack' ? 'TanStack Query' : tab === 'fetch' ? 'Fetch API' : 'cURL'}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          {codeTab === 'react' && (
            <CodeBlock
              code={reactHookCode}
              language="typescript"
              title="hooks/useFilteredPosts.ts"
            />
          )}
          {codeTab === 'tanstack' && (
            <CodeBlock
              code={tanstackCode}
              language="typescript"
              title="queries/useTodosQuery.ts"
            />
          )}
          {codeTab === 'fetch' && (
            <CodeBlock
              code={fetchCode}
              language="javascript"
              title="api/filterClient.js"
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

      {/* 5. Next Steps Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
        <Link
          href="/docs/query/search"
          className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/30 transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs text-slate-500 font-semibold">Next Query Feature</span>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 flex items-center gap-1.5 mt-0.5">
              <span>Full-Text Search Engine</span>
              <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5" />
            </h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Icon icon="ph:magnifying-glass-bold" className="w-4 h-4" />
          </div>
        </Link>

        <Link
          href="/docs/query/sorting"
          className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/30 transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs text-slate-500 font-semibold">Related Query Feature</span>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 flex items-center gap-1.5 mt-0.5">
              <span>Dynamic Multi-Type Sorting</span>
              <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5" />
            </h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Icon icon="ph:arrows-down-up-bold" className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </div>
  );
}
