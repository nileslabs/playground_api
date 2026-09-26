'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function CustomResourcesPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

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
          Create arbitrary database collections on the fly without writing backend models or database migrations. Simply post to <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">/api/v1/custom/:collection</code> and Playground API auto-provisions the collection for your session.
        </p>
      </div>

      {/* 2. Interactive Create & List Runner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Step 1: Create a Custom Product Record</h3>
          <p className="text-xs text-slate-500">
            Send a POST request with any JSON schema to instantiate the <code className="font-mono text-xs">products</code> collection:
          </p>
        </div>

        <InteractiveConsole
          method="POST"
          path="/custom/products"
          title="Create Record in /custom/products"
          initialBody={JSON.stringify(
            {
              title: 'Ergonomic Mechanical Keyboard',
              price: 149.99,
              category: 'hardware',
              inStock: true,
              tags: ['gadgets', 'workstation'],
            },
            null,
            2
          )}
        />
      </div>

      {/* 3. List Custom Collection */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Step 2: Query Your Custom Collection</h3>
          <p className="text-xs text-slate-500">
            Query all records in the newly created collection with full sorting and pagination:
          </p>
        </div>

        <InteractiveConsole
          method="GET"
          path="/custom/products"
          title="Query /custom/products Collection"
        />
      </div>

      {/* 4. CRUD Endpoints Reference */}
      <div id="crud-endpoints" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Available Custom Endpoints
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Endpoint</th>
                <th className="py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">GET</span></td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">/api/v1/custom/:collection</td>
                <td className="py-3 px-4">List and paginate all records in the dynamic collection.</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">POST</span></td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">/api/v1/custom/:collection</td>
                <td className="py-3 px-4">Insert a new record with auto-generated ID and timestamps.</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">PATCH</span></td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">/api/v1/custom/:collection/:id</td>
                <td className="py-3 px-4">Partially update an existing record by ID.</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">DELETE</span></td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">/api/v1/custom/:collection/:id</td>
                <td className="py-3 px-4">Delete a custom record from the visitor sandbox.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
