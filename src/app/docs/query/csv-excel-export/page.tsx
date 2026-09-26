'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export default function ExportDataPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const downloadFile = (resource: string, ext: 'csv' | 'xlsx') => {
    const url = `${publicApiUrl}/${resource}.${ext}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:file-xls-bold" className="w-3.5 h-3.5" />
          <span>Data & Query Engine</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          CSV & Excel Tabular Export
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Instantly convert any REST resource or custom collection into real <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">.csv</code> or <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">.xlsx</code> spreadsheet files. Ideal for testing file download flows, table imports, or data pipeline analysis.
        </p>
      </div>

      {/* 2. One-Click Interactive Export Panel */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Instant File Download Test</h3>
          <p className="text-xs text-slate-500">Click below to trigger a live stream download from the server:</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => downloadFile('posts', 'csv')}
            className="p-4 rounded-xl border border-slate-200 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/30 transition-all flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Icon icon="ph:file-csv-bold" className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs text-slate-800 group-hover:text-emerald-700">posts.csv</span>
            <span className="text-[11px] text-slate-500">Comma-separated values</span>
          </button>

          <button
            type="button"
            onClick={() => downloadFile('posts', 'xlsx')}
            className="p-4 rounded-xl border border-slate-200 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/30 transition-all flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Icon icon="ph:file-xls-bold" className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs text-slate-800 group-hover:text-emerald-700">posts.xlsx</span>
            <span className="text-[11px] text-slate-500">Excel Spreadsheet</span>
          </button>

          <button
            type="button"
            onClick={() => downloadFile('users', 'csv')}
            className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/30 transition-all flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Icon icon="ph:file-csv-bold" className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs text-slate-800 group-hover:text-indigo-700">users.csv</span>
            <span className="text-[11px] text-slate-500">User directory CSV</span>
          </button>

          <button
            type="button"
            onClick={() => downloadFile('users', 'xlsx')}
            className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/30 transition-all flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Icon icon="ph:file-xls-bold" className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs text-slate-800 group-hover:text-indigo-700">users.xlsx</span>
            <span className="text-[11px] text-slate-500">Excel Spreadsheet</span>
          </button>
        </div>
      </div>

      {/* 3. Export Endpoints Reference */}
      <div id="url-formats" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Export URL Conventions
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-4">Pattern</th>
                <th className="py-3 px-4">Content-Type</th>
                <th className="py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">GET /api/v1/:resource.csv</td>
                <td className="py-3 px-4 font-mono text-xs">text/csv</td>
                <td className="py-3 px-4">Appends standard <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">.csv</code> extension directly to the resource path.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">GET /api/v1/:resource.xlsx</td>
                <td className="py-3 px-4 font-mono text-xs">application/vnd.openxmlformats-officedocument.spreadsheetml.sheet</td>
                <td className="py-3 px-4">Generates a multi-column Excel spreadsheet binary.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">GET /api/v1/:resource?_format=csv</td>
                <td className="py-3 px-4 font-mono text-xs">text/csv</td>
                <td className="py-3 px-4">Alternative query parameter format. Compatible with any custom collection.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
