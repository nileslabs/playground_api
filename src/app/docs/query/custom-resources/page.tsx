'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';

type CrudAction = 'create' | 'list' | 'get-one' | 'update' | 'delete' | 'directory';

export default function CustomResourcesPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const [collectionName, setCollectionName] = useState<string>('inventory');
  const [activeAction, setActiveAction] = useState<CrudAction>('create');
  const [codeTab, setCodeTab] = useState<'hook' | 'crud-client' | 'curl'>('hook');

  const cleanCollection = collectionName.toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'inventory';

  const actionConfigs: Record<CrudAction, {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    endpoint: string;
    title: string;
    description: string;
    body?: string;
  }> = {
    create: {
      method: 'POST',
      endpoint: `/custom/${cleanCollection}`,
      title: `Create Record in /custom/${cleanCollection}`,
      description: 'Auto-provisions the collection and persists the new entity in your visitor session.',
      body: JSON.stringify(
        {
          sku: 'SKU-7720',
          productName: 'Ultra-Wide Curved Monitor 34"',
          category: 'Displays',
          price: 599.99,
          inStock: true,
          specs: {
            refreshRate: '144Hz',
            panel: 'IPS'
          }
        },
        null,
        2
      )
    },
    list: {
      method: 'GET',
      endpoint: `/custom/${cleanCollection}?_sort=price&_order=desc`,
      title: `Query /custom/${cleanCollection}`,
      description: 'Lists all records with full support for filtering, sorting, pagination, and full-text search.'
    },
    'get-one': {
      method: 'GET',
      endpoint: `/custom/${cleanCollection}/1`,
      title: `Retrieve Single Item /custom/${cleanCollection}/:id`,
      description: 'Fetches a single record by its local assigned ID.'
    },
    update: {
      method: 'PUT',
      endpoint: `/custom/${cleanCollection}/1`,
      title: `Update Record /custom/${cleanCollection}/:id`,
      description: 'Modifies attributes of an existing record within your active session sandbox overlay.',
      body: JSON.stringify(
        {
          price: 549.99,
          inStock: false
        },
        null,
        2
      )
    },
    delete: {
      method: 'DELETE',
      endpoint: `/custom/${cleanCollection}/1`,
      title: `Delete Record /custom/${cleanCollection}/:id`,
      description: 'Removes the record from your custom collection.'
    },
    directory: {
      method: 'GET',
      endpoint: '/custom',
      title: 'List Active Custom Collections Directory',
      description: 'Returns an index of all custom collections currently active in your visitor session.'
    }
  };

  const currentActionConfig = actionConfigs[activeAction];

  const customHookCode = `// hooks/useCustomCollection.ts
import { useState, useEffect, useCallback } from 'react';

export function useCustomCollection<T>(collectionName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCollection = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(\`${publicApiUrl}/custom/\${collectionName}\`, {
        credentials: 'include'
      });
      const json = await res.json();
      setData(json.data || json);
    } catch (err) {
      console.error('Failed to load custom collection', err);
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const createItem = async (payload: Partial<T>) => {
    const res = await fetch(\`${publicApiUrl}/custom/\${collectionName}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Create failed');
    const created = await res.json();
    setData((prev) => [created, ...prev]);
    return created;
  };

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  return { data, loading, createItem, refresh: fetchCollection };
}`;

  const crudClientCode = `// services/customCollectionService.js
const API_BASE = '${publicApiUrl}/custom';

export const customApi = {
  // List with filtering & sorting
  async list(collection, params = {}) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(\`\${API_BASE}/\${collection}\${qs ? \`?\${qs}\` : ''}\`, { credentials: 'include' });
    return res.json();
  },

  // Create schema-less item
  async create(collection, payload) {
    const res = await fetch(\`\${API_BASE}/\${collection}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include'
    });
    return res.json();
  },

  // Update item
  async update(collection, id, patch) {
    const res = await fetch(\`\${API_BASE}/\${collection}/\${id}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
      credentials: 'include'
    });
    return res.json();
  },

  // Delete item
  async remove(collection, id) {
    const res = await fetch(\`\${API_BASE}/\${collection}/\${id}\`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return res.json();
  }
};`;

  const curlCode = `# 1. Create a custom item (collection is auto-created instantly)
curl -X POST "${publicApiUrl}/custom/inventory" \\
  -H "Content-Type: application/json" \\
  -d '{ "sku": "SKU-7720", "productName": "Curved Monitor", "price": 599.99 }'

# 2. Query collection with sorting
curl -X GET "${publicApiUrl}/custom/inventory?_sort=price&_order=desc"

# 3. Export custom collection directly to Excel (.xlsx)
curl -X GET "${publicApiUrl}/custom/inventory.xlsx"`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:table-bold" className="w-3.5 h-3.5" />
          <span>Data & Query Engine</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Custom Collections CRUD
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Instantly create arbitrary database tables on the fly without writing backend schemas, database migrations, or ORM models. Simply send requests to <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-bold">/api/v1/custom/:collection</code> and Playground provisions the collection for your session.
        </p>
      </div>

      {/* 2. Interactive CRUD Workbench */}
      <div id="interactive-runner" className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Custom Collection Workbench</h3>
            <p className="text-xs text-slate-500">Choose an operation and collection identifier to test:</p>
          </div>

          {/* Collection Name Input */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Collection:</span>
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1">
              <span className="text-xs font-mono text-slate-400">/custom/</span>
              <input
                type="text"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                placeholder="collection-name"
                className="text-xs font-mono font-bold text-indigo-600 bg-transparent focus:outline-none w-28"
              />
            </div>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { key: 'create', label: '1. POST Create', badge: 'POST', color: 'emerald' },
              { key: 'list', label: '2. GET List & Filter', badge: 'GET', color: 'blue' },
              { key: 'get-one', label: '3. GET Single Item', badge: 'GET', color: 'blue' },
              { key: 'update', label: '4. PUT Update Item', badge: 'PUT', color: 'amber' },
              { key: 'delete', label: '5. DELETE Remove', badge: 'DEL', color: 'rose' },
              { key: 'directory', label: '6. GET Directory', badge: 'INDEX', color: 'purple' }
            ] as const
          ).map((action) => {
            const isActive = activeAction === action.key;
            return (
              <button
                key={action.key}
                type="button"
                onClick={() => setActiveAction(action.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Action Details */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-slate-900">{currentActionConfig.title}</span>
              <p className="text-xs text-slate-600 mt-0.5">{currentActionConfig.description}</p>
            </div>
            <code className="text-xs font-mono font-bold bg-white px-2 py-1 rounded border border-slate-200 text-indigo-600 self-start sm:self-auto">
              {currentActionConfig.method} {currentActionConfig.endpoint}
            </code>
          </div>
        </div>

        {/* Live Interactive Console */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Live API Runner</label>
            <span className="text-[11px] text-slate-500 font-mono">Method: {currentActionConfig.method}</span>
          </div>
          <InteractiveConsole
            key={`${cleanCollection}-${activeAction}`}
            initialMethod={currentActionConfig.method}
            initialEndpoint={currentActionConfig.endpoint}
            initialBody={currentActionConfig.body}
          />
        </div>
      </div>

      {/* 3. Schema Protections & Engine Integration */}
      <div id="security-protections" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Engine Features & Security Protections
          </h2>
          <p className="text-sm text-slate-600">
            Custom collections enjoy first-class query capabilities while maintaining security isolation:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Icon icon="ph:shield-check-bold" className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Prototype Pollution Guard</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Collection identifiers and record keys are strictly sanitized. Reserved keys (<code className="font-mono">__proto__</code>, <code className="font-mono">constructor</code>) are automatically rejected.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Icon icon="ph:sliders-horizontal-bold" className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Full Query Parity</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Custom collections support all query parameters: <code className="font-mono">?q=term</code> full-text search, <code className="font-mono">_sort</code>, <code className="font-mono">_order</code>, and relational filtering.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Icon icon="ph:file-xls-bold" className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Spreadsheet Export & Import</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instantly export custom collections via <code className="font-mono text-indigo-600">.csv</code> and <code className="font-mono text-indigo-600">.xlsx</code> or import bulk CSV rows via <code className="font-mono">/import</code>.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Production Client Code Recipes */}
      <div id="code-recipes" className="space-y-4 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Client Integration Recipes</h2>
            <p className="text-sm text-slate-600">Production React hooks and service classes for dynamic collections:</p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            {(['hook', 'crud-client', 'curl'] as const).map((tab) => (
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
                {tab === 'hook' ? 'React Custom Hook' : tab === 'crud-client' ? 'API Service' : 'cURL'}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          {codeTab === 'hook' && (
            <CodeBlock
              code={customHookCode}
              language="typescript"
              title="hooks/useCustomCollection.ts"
            />
          )}
          {codeTab === 'crud-client' && (
            <CodeBlock
              code={crudClientCode}
              language="javascript"
              title="services/customCollectionService.js"
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
          href="/docs/sandbox/snapshots"
          className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/30 transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs text-slate-500 font-semibold">Related Feature</span>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 flex items-center gap-1.5 mt-0.5">
              <span>Session Snapshot JSON</span>
              <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5" />
            </h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Icon icon="ph:cloud-arrow-up-bold" className="w-4 h-4" />
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
