'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { CodeBlock } from '@/components/ui/CodeBlock';

export default function InsomniaDownloadPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const downloadUrl = `${publicApiUrl}/downloads/insomnia.json`;

  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(downloadUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const sampleSnippet = `{
  "_type": "export",
  "__export_format": 4,
  "__export_date": "2026-09-29T00:00:00.000Z",
  "__export_source": "insomnia.desktop.app:v10.0.0",
  "resources": [
    {
      "_id": "wrk_playground_api",
      "_type": "workspace",
      "name": "Playground API Workspace",
      "description": "Pre-configured workspace with stateful sandbox persistence."
    },
    {
      "_id": "env_base",
      "_type": "environment",
      "name": "Base Environment",
      "data": {
        "base_url": "${publicApiUrl}",
        "session_id": "insomnia-dev-session-1"
      }
    }
  ]
}`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold uppercase tracking-wider border border-purple-200">
          <Icon icon="ph:moon-stars-bold" className="w-3.5 h-3.5" />
          <span>Client Collections</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Kong Insomnia Workspace Export
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Import preconfigured request trees, environment profiles, and Bearer token chaining into Kong Insomnia Desktop for rapid mock API testing and schema validation.
        </p>
      </div>

      {/* 2. Download Card */}
      <div id="download-card" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 scroll-mt-20">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
              Insomnia v4 Export
            </span>
            <span className="text-xs text-slate-500 font-mono">playground-api.insomnia_collection.json</span>
          </div>
          <h2 className="font-extrabold text-xl text-slate-900">Kong Insomnia Workspace Bundle</h2>
          <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
            Ready-to-import workspace containing all endpoints, environments with base URLs, and pre-configured bearer token headers.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleCopyUrl}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all cursor-pointer shadow-2xs"
          >
            <Icon icon={copiedUrl ? 'ph:check-bold' : 'ph:copy-bold'} className="w-4 h-4 text-purple-600" />
            <span>{copiedUrl ? 'Copied URL!' : 'Copy Workspace URL'}</span>
          </button>

          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            download="playground-api.insomnia_collection.json"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          >
            <Icon icon="ph:download-simple-bold" className="w-4 h-4" />
            <span>Download Insomnia JSON</span>
          </a>
        </div>
      </div>

      {/* 3. Workspace Highlights */}
      <div id="features" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Workspace Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Icon icon="ph:folders-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Categorized Folders</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Neatly structured by domain: Posts, Comments, Users, Auth, Chaos Injection, and Custom Dynamic Collections.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Icon icon="ph:link-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Request Chaining</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Use template tags to extract tokens from <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">POST /auth/login</code> directly into authorization headers.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Icon icon="ph:sliders-horizontal-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Environment Profiles</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Quickly switch between &quot;Local Development&quot; and &quot;Staging Sandbox&quot; with pre-configured variable definitions.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Import Steps */}
      <div id="import-steps" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          How to Import into Insomnia
        </h2>

        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
          <ol className="list-decimal list-inside space-y-3 text-sm text-slate-700 leading-relaxed">
            <li>Open Kong Insomnia and click the <strong>gear icon (Preferences)</strong> in the top right.</li>
            <li>Select the <strong>Data</strong> tab, then click <strong>Import Data &rarr; From File</strong> or <strong>From URL</strong>.</li>
            <li>Paste <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-bold">{downloadUrl}</code> or select the downloaded JSON file.</li>
            <li>Choose <strong>Import as New Workspace</strong> and begin running requests immediately.</li>
          </ol>
        </div>
      </div>

      {/* 5. Workspace JSON Schema Preview */}
      <div id="schema-preview" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Export Format Schema Preview
        </h2>

        <CodeBlock
          code={sampleSnippet}
          language="json"
          title="insomnia-export.json"
          maxHeight="max-h-80"
        />
      </div>

      {/* 6. Navigation Footer */}
      <div className="p-6 sm:p-7 rounded-2xl border border-indigo-100 bg-indigo-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-slate-900">Need full TypeScript definitions?</h3>
          <p className="text-sm text-slate-600">Download the official ambient .d.ts declarations for strict typing without installing packages.</p>
        </div>
        <Link
          href="/docs/collections/typescript"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shrink-0"
        >
          View TypeScript .d.ts
        </Link>
      </div>
    </div>
  );
}
