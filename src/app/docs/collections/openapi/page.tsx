'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export default function OpenApiDownloadPage() {
  const downloadUrl = `${config.apiUrl}/download/openapi.json`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:file-doc-bold" className="w-3.5 h-3.5" />
          <span>Client Collections</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          OpenAPI 3.1 Specification Export
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Download the complete, schema-validated OpenAPI 3.1 specification for Playground API. Generate typed API clients with Orval, OpenAPI Generator, or Hey API in seconds.
        </p>
      </div>

      {/* 2. Download Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              OpenAPI 3.1
            </span>
            <span className="text-xs text-slate-500 font-mono">playground-api-openapi.json</span>
          </div>
          <h3 className="font-extrabold text-lg text-slate-900">Full API Specification Export</h3>
          <p className="text-xs text-slate-600 max-w-xl">
            Contains all 35+ REST endpoints, schemas, error response payloads, parameter definitions, and auth security schemes.
          </p>
        </div>

        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          download="playground-api-openapi.json"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Icon icon="ph:download-simple-bold" className="w-4 h-4" />
          <span>Download OpenAPI JSON</span>
        </a>
      </div>

      {/* 3. Client Generation Guide */}
      <div id="code-generation" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Generate TypeScript Clients (Orval / openapi-typescript)
        </h2>
        <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 shadow-inner">
          <pre className="font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto leading-relaxed">
{`# Generate typed fetch client with openapi-typescript
npx openapi-typescript ${downloadUrl} -o ./src/types/api.ts

# Or generate TanStack Query hooks with Orval
npx orval --input ${downloadUrl} --output ./src/api/client.ts`}
          </pre>
        </div>
      </div>
    </div>
  );
}
