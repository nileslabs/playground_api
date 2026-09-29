'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { CodeBlock } from '@/components/ui/CodeBlock';

export default function OpenApiDownloadPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const downloadUrl = `${publicApiUrl}/downloads/openapi.json`;

  const [activeTab, setActiveTab] = useState<'orval' | 'openapi-ts' | 'cli' | 'swagger'>('openapi-ts');
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(downloadUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const codeGenSnippets = {
    'openapi-ts': `# 1. Generate full TypeScript schema types
npx openapi-typescript ${downloadUrl} -o ./src/types/api-schema.d.ts

# 2. Use in your application code:
import type { paths, components } from './src/types/api-schema';

type Post = components['schemas']['Post'];
type User = components['schemas']['User'];`,

    orval: `# 1. Install Orval with TanStack React Query or SWR
npm install -D orval @tanstack/react-query

# 2. Run code generation with React Query hooks:
npx orval --input ${downloadUrl} --output ./src/api/playgroundHooks.ts --client react-query

# 3. Use generated hooks directly in React components:
import { useGetPosts } from './src/api/playgroundHooks';

function BlogList() {
  const { data: posts, isLoading } = useGetPosts({ _limit: 10 });
  if (isLoading) return <div>Loading...</div>;
  return <div>{posts?.data.map(p => <p key={p.id}>{p.title}</p>)}</div>;
}`,

    cli: `# Generate a standalone Axios / Fetch client in any language:
npx @openapitools/openapi-generator-cli generate \\
  -i ${downloadUrl} \\
  -g typescript-axios \\
  -o ./src/generated/api-client`,

    swagger: `// Embed live Swagger UI in your Next.js or React application:
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function ApiExplorer() {
  return (
    <div className="p-4 bg-white min-h-screen">
      <SwaggerUI url="${downloadUrl}" />
    </div>
  );
}`,
  };

  const sampleSpecSnippet = `{
  "openapi": "3.0.3",
  "info": {
    "title": "Playground API",
    "version": "1.0.0",
    "description": "Zero-configuration stateful mock REST and GraphQL API."
  },
  "servers": [
    { "url": "${publicApiUrl}", "description": "Live Stateful Sandbox" }
  ],
  "paths": {
    "/posts": {
      "get": {
        "summary": "List blog posts",
        "parameters": [
          { "name": "_limit", "in": "query", "schema": { "type": "integer", "default": 10 } },
          { "name": "_page", "in": "query", "schema": { "type": "integer", "default": 1 } },
          { "name": "q", "in": "query", "schema": { "type": "string" } }
        ]
      },
      "post": {
        "summary": "Create stateful post"
      }
    }
  }
}`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:file-doc-bold" className="w-3.5 h-3.5" />
          <span>Client Collections &amp; Specs</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          OpenAPI 3.1 &amp; 3.0 Specification
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Download the complete, schema-validated OpenAPI specification for Playground API. Generate typed frontend clients, TanStack Query hooks, or import directly into Swagger UI, Postman, and Insomnia in seconds.
        </p>
      </div>

      {/* 2. Download Card */}
      <div id="download-spec" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 scroll-mt-20">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              OpenAPI 3.0.3
            </span>
            <span className="text-xs text-slate-500 font-mono">playground-api.openapi.json</span>
          </div>
          <h2 className="font-extrabold text-xl text-slate-900">Full API Specification Export</h2>
          <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
            Contains all 35+ REST endpoints, request/response models, query parameter definitions, bearer token schemes, and chaos simulation modifiers.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleCopyUrl}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all cursor-pointer shadow-2xs"
          >
            <Icon icon={copiedUrl ? 'ph:check-bold' : 'ph:copy-bold'} className="w-4 h-4 text-indigo-600" />
            <span>{copiedUrl ? 'Copied URL!' : 'Copy Spec URL'}</span>
          </button>

          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            download="playground-api.openapi.json"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          >
            <Icon icon="ph:download-simple-bold" className="w-4 h-4" />
            <span>Download OpenAPI JSON</span>
          </a>
        </div>
      </div>

      {/* 3. Resource Filtered Exports */}
      <div id="filtered-exports" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Resource-Filtered Slices
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Need a focused specification for a specific domain? Append <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">?resource=:name</code>:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Posts & Comments', param: 'posts' },
            { label: 'Users & Accounts', param: 'users' },
            { label: 'Auth & JWT', param: 'auth' },
            { label: 'Payments & 3DS', param: 'payments' },
          ].map((item) => (
            <a
              key={item.param}
              href={`${downloadUrl}?resource=${item.param}`}
              download={`playground-api-${item.param}.openapi.json`}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50/60 shadow-2xs text-left transition-all flex flex-col justify-between gap-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">{item.label}</span>
                <Icon icon="ph:download-simple-bold" className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
              </div>
              <span className="text-xs font-mono text-slate-500">?resource={item.param}</span>
            </a>
          ))}
        </div>
      </div>

      {/* 4. Code Generation Recipes */}
      <div id="code-generation" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Generate Typed Clients with OpenAPI Tools
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Use standard open-source tools to turn the OpenAPI specification into type-safe client libraries:
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('openapi-ts')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'openapi-ts'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            openapi-typescript
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orval')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'orval'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Orval (TanStack React Query)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cli')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'cli'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            OpenAPI Generator CLI
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('swagger')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'swagger'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Swagger UI React
          </button>
        </div>

        <CodeBlock
          code={codeGenSnippets[activeTab]}
          language="bash"
          title={`${activeTab}-setup.sh`}
          maxHeight="max-h-96"
        />
      </div>

      {/* 5. Spec Preview */}
      <div id="spec-preview" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          OpenAPI Specification Schema Preview
        </h2>

        <CodeBlock
          code={sampleSpecSnippet}
          language="json"
          title="openapi.json"
          maxHeight="max-h-80"
        />
      </div>

      {/* 6. Navigation Footer */}
      <div className="p-6 sm:p-7 rounded-2xl border border-indigo-100 bg-indigo-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-slate-900">Prefer testing with Postman?</h3>
          <p className="text-sm text-slate-600">Download the pre-configured Postman v2.1 collection with authentication scripts.</p>
        </div>
        <Link
          href="/docs/collections/postman"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shrink-0"
        >
          View Postman Collection
        </Link>
      </div>
    </div>
  );
}
