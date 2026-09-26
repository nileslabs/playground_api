'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export default function PostmanDownloadPage() {
  const downloadUrl = `${config.apiUrl}/download/postman.json`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:paper-plane-bold" className="w-3.5 h-3.5" />
          <span>Client Collections</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Postman Collection v2.1
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Import a complete, categorized workspace into Postman. Includes pre-configured environment variables, Bearer token presets, and request bodies for all endpoints.
        </p>
      </div>

      {/* 2. Download Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Postman v2.1
            </span>
            <span className="text-xs text-slate-500 font-mono">playground_collection.json</span>
          </div>
          <h3 className="font-extrabold text-lg text-slate-900">Ready-to-Import Postman Workspace</h3>
          <p className="text-xs text-slate-600 max-w-xl">
            Preloaded with authentication login requests, post creators, chaos modifier headers, and sample payloads.
          </p>
        </div>

        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          download="playground-api-postman.json"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Icon icon="ph:download-simple-bold" className="w-4 h-4" />
          <span>Download Postman JSON</span>
        </a>
      </div>

      {/* 3. Import Instructions */}
      <div id="instructions" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          How to Import into Postman
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center">1</div>
            <h3 className="font-bold text-sm text-slate-900">Click Import</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Open Postman and click the &quot;Import&quot; button in the top left workspace navigation.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center">2</div>
            <h3 className="font-bold text-sm text-slate-900">Select Downloaded File</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Drag and drop <code className="font-mono text-xs">playground-api-postman.json</code> or paste the download URL directly.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center">3</div>
            <h3 className="font-bold text-sm text-slate-900">Run Requests</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Run <code className="font-mono text-xs text-indigo-600">POST /auth/login</code> first — the script automatically saves your access token to collection variables.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
