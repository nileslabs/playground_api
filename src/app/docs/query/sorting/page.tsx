'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface ResourceSortConfig {
  resource: string;
  name: string;
  fields: { key: string; label: string; type: 'number' | 'string' | 'boolean' }[];
}

const SORT_RESOURCES: ResourceSortConfig[] = [
  {
    resource: 'posts',
    name: 'posts (Blog Articles)',
    fields: [
      { key: 'id', label: 'id (Article ID)', type: 'number' },
      { key: 'title', label: 'title (Alphabetical)', type: 'string' },
      { key: 'userId', label: 'userId (Author ID)', type: 'number' }
    ]
  },
  {
    resource: 'users',
    name: 'users (Directory)',
    fields: [
      { key: 'id', label: 'id (User ID)', type: 'number' },
      { key: 'name', label: 'name (Full Name)', type: 'string' },
      { key: 'username', label: 'username (Handle)', type: 'string' },
      { key: 'email', label: 'email (Email Address)', type: 'string' }
    ]
  },
  {
    resource: 'todos',
    name: 'todos (Task Items)',
    fields: [
      { key: 'id', label: 'id (Task ID)', type: 'number' },
      { key: 'completed', label: 'completed (Status Boolean)', type: 'boolean' },
      { key: 'title', label: 'title (Task Name)', type: 'string' }
    ]
  },
  {
    resource: 'custom/products',
    name: 'custom/products (Catalog)',
    fields: [
      { key: 'price', label: 'price (Numeric Price)', type: 'number' },
      { key: 'stock', label: 'stock (Inventory Units)', type: 'number' },
      { key: 'name', label: 'name (Product Title)', type: 'string' }
    ]
  }
];

export default function SortingPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const [selectedResource, setSelectedResource] = useState<string>('posts');
  const [sortField, setSortField] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [codeTab, setCodeTab] = useState<'tanstack' | 'react' | 'fetch' | 'curl'>('tanstack');

  const currentResourceConfig =
    SORT_RESOURCES.find((r) => r.resource === selectedResource) || SORT_RESOURCES[0];

  const handleResourceChange = (newResource: string) => {
    setSelectedResource(newResource);
    const cfg = SORT_RESOURCES.find((r) => r.resource === newResource);
    if (cfg && cfg.fields.length > 0) {
      setSortField(cfg.fields[0].key);
    }
  };

  const currentEndpoint = `/${selectedResource}?_sort=${sortField}&_order=${sortOrder}`;

  const tanstackTableCode = `// components/DataTable.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface SortingState {
  field: string;
  order: 'asc' | 'desc';
}

export function DataTable() {
  const [sorting, setSorting] = useState<SortingState>({
    field: 'id',
    order: 'desc'
  });

  const { data, isLoading } = useQuery({
    queryKey: ['posts', sorting],
    queryFn: async () => {
      const res = await fetch(
        \`${publicApiUrl}/posts?_sort=\${sorting.field}&_order=\${sorting.order}\`,
        { credentials: 'include' }
      );
      if (!res.ok) throw new Error('Failed to fetch sorted records');
      return res.json();
    }
  });

  const toggleSort = (field: string) => {
    setSorting((prev) => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => toggleSort('id')} className="cursor-pointer">
            ID {sorting.field === 'id' && (sorting.order === 'asc' ? '▲' : '▼')}
          </th>
          <th onClick={() => toggleSort('title')} className="cursor-pointer">
            Title {sorting.field === 'title' && (sorting.order === 'asc' ? '▲' : '▼')}
          </th>
        </tr>
      </thead>
      <tbody>
        {data?.data?.map((item: any) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.title}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}`;

  const reactStateCode = `// hooks/useSortedResource.ts
import { useState, useEffect } from 'react';

export function useSortedResource(resource: string, field = 'id', order: 'asc' | 'desc' = 'asc') {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({
      _sort: field,
      _order: order
    });

    setLoading(true);
    fetch(\`${publicApiUrl}/\${resource}?\${params.toString()}\`, { credentials: 'include' })
      .then((res) => res.json())
      .then((json) => {
        setData(json.data || json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Sorting query failed', err);
        setLoading(false);
      });
  }, [resource, field, order]);

  return { data, loading };
}`;

  const fetchCode = `// Vanilla JavaScript / TypeScript Fetch
const params = new URLSearchParams({
  _sort: 'price',
  _order: 'desc'
});

const res = await fetch(\`${publicApiUrl}/custom/products?\${params}\`, {
  credentials: 'include'
});

const { data } = await res.json();
console.log('Highest priced product:', data[0]);`;

  const curlCode = `# Sort posts descending by numeric ID (100, 99, 98...)
curl -X GET "${publicApiUrl}/posts?_sort=id&_order=desc" \\
  -H "Accept: application/json"

# Sort custom products by price ascending
curl -X GET "${publicApiUrl}/custom/products?_sort=price&_order=asc" \\
  -H "Accept: application/json"`;

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
          Order API responses by any numerical, string, or boolean field using <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-bold">_sort</code> and <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-bold">_order</code>. Values are sorted with type-aware comparison, ensuring proper numeric order instead of alphabetical bugs.
        </p>
      </div>

      {/* 2. Interactive Sort Runner */}
      <div id="interactive-runner" className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Live Sorting Playground</h3>
            <p className="text-xs text-slate-500">Customize sort target and direction to test across collections:</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Direction:</span>
            <div className="flex items-center rounded-xl border border-slate-200 p-0.5 bg-slate-50">
              <button
                type="button"
                onClick={() => setSortOrder('asc')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  sortOrder === 'asc' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon icon="ph:sort-ascending-bold" className="w-3.5 h-3.5" />
                <span>ASC</span>
              </button>
              <button
                type="button"
                onClick={() => setSortOrder('desc')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  sortOrder === 'desc' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon icon="ph:sort-descending-bold" className="w-3.5 h-3.5" />
                <span>DESC</span>
              </button>
            </div>
          </div>
        </div>

        {/* Resource & Field Controls */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Target Collection
              </label>
              <select
                value={selectedResource}
                onChange={(e) => handleResourceChange(e.target.value)}
                className="w-full text-xs font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 font-semibold cursor-pointer"
              >
                {SORT_RESOURCES.map((r) => (
                  <option key={r.resource} value={r.resource}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Sort Field (_sort)
              </label>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className="w-full text-xs font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 font-semibold cursor-pointer"
              >
                {currentResourceConfig.fields.map((f) => (
                  <option key={f.key} value={f.key}>
                    {f.label} ({f.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-200/60">
            <span>
              Sorting <span className="font-semibold text-slate-800">{selectedResource}</span> by <code className="font-mono text-indigo-600 font-bold">{sortField}</code> in <span className="uppercase font-bold text-indigo-600">{sortOrder}</span> order.
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

      {/* 3. Type-Aware Comparison Matrix */}
      <div id="type-aware-sorting" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Type-Aware Sort Evaluation
          </h2>
          <p className="text-sm text-slate-600">
            Many mock servers fail by treating all fields as strings, causing <code className="font-mono text-xs">10</code> to sort before <code className="font-mono text-xs">2</code>. Playground inspects underlying data types:
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-4">Data Type</th>
                <th className="py-3 px-4">Sort Strategy</th>
                <th className="py-3 px-4">ASC Order Example</th>
                <th className="py-3 px-4">DESC Order Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-600 text-xs">
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-900 font-sans">Numeric (ID, Price, Stock)</td>
                <td className="py-3 px-4 font-sans text-slate-600">Numeric comparison (<code className="font-mono text-xs">a - b</code>)</td>
                <td className="py-3 px-4 text-emerald-600">1, 2, 9, 10, 100</td>
                <td className="py-3 px-4 text-indigo-600">100, 10, 9, 2, 1</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-900 font-sans">String (Title, Name, Email)</td>
                <td className="py-3 px-4 font-sans text-slate-600">Case-insensitive localeCompare</td>
                <td className="py-3 px-4 text-emerald-600">Alice, Bob, Charlie</td>
                <td className="py-3 px-4 text-indigo-600">Charlie, Bob, Alice</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-900 font-sans">Boolean (Completed, InStock)</td>
                <td className="py-3 px-4 font-sans text-slate-600">Falsy values first in ASC</td>
                <td className="py-3 px-4 text-emerald-600">false, false, true, true</td>
                <td className="py-3 px-4 text-indigo-600">true, true, false, false</td>
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
            <p className="text-sm text-slate-600">DataGrid and table sorting patterns for React and modern web apps:</p>
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
                {tab === 'tanstack' ? 'TanStack Table' : tab === 'react' ? 'React Hook' : tab === 'fetch' ? 'Fetch API' : 'cURL'}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          {codeTab === 'tanstack' && (
            <CodeBlock
              code={tanstackTableCode}
              language="typescript"
              title="components/DataTable.tsx"
            />
          )}
          {codeTab === 'react' && (
            <CodeBlock
              code={reactStateCode}
              language="typescript"
              title="hooks/useSortedResource.ts"
            />
          )}
          {codeTab === 'fetch' && (
            <CodeBlock
              code={fetchCode}
              language="javascript"
              title="api/sortClient.js"
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
          href="/docs/query/pagination-offset"
          className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/30 transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs text-slate-500 font-semibold">Next Query Feature</span>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 flex items-center gap-1.5 mt-0.5">
              <span>Offset-Based Pagination</span>
              <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5" />
            </h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Icon icon="ph:number-circle-two-bold" className="w-4 h-4" />
          </div>
        </Link>

        <Link
          href="/docs/query/pagination-cursor"
          className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/30 transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs text-slate-500 font-semibold">Related Query Feature</span>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 flex items-center gap-1.5 mt-0.5">
              <span>Cursor-Based Pagination</span>
              <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5" />
            </h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Icon icon="ph:infinite-bold" className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </div>
  );
}
