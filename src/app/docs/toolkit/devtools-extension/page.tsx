'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { CodeBlock } from '@/components/ui/CodeBlock';

export default function DevtoolsExtensionPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const manifestSnippet = `{
  "manifest_version": 3,
  "name": "Playground API Companion",
  "version": "1.0.0",
  "description": "Inspect session mutations, inject chaos latency, and reset sandbox state.",
  "devtools_page": "devtools.html",
  "permissions": ["storage", "cookies"],
  "host_permissions": ["*://${publicApiUrl.replace(/^https?:\/\//, '')}/*"]
}`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:puzzle-piece-bold" className="w-3.5 h-3.5" />
          <span>Browser Extension Companion</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Browser DevTools Extension
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          An integrated browser developer panel for Chrome, Firefox, and Edge. Inspect virtual mutation overlays, monitor active rate-limits, preview incoming webhooks, and trigger atomic sandbox resets without leaving your application.
        </p>
      </div>

      {/* 2. Core Capabilities Grid */}
      <div id="core-features" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Companion Workbench Capabilities
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Icon icon="ph:tree-structure-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Live Mutation Timeline</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Visualizes every <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">POST</code>, <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">PUT</code>, and <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">DELETE</code> executed by your web application. Inspect the before-and-after diffs stored in your visitor overlay.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Icon icon="ph:hourglass-medium-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Chaos Injection Slider</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Adjust artificial latency (0ms to 5000ms) or force error status codes (400, 429, 500) globally for all outbound requests without having to touch your application code.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Icon icon="ph:arrows-clockwise-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">One-Click Atomic Reset</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Wipe all mutated records, custom dynamic collections, and modified user profiles in 100 milliseconds. Restores the pristine baseline dataset immediately.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Icon icon="ph:identification-card-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Session Identity Switcher</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Switch between multiple isolated mock sessions (e.g. &quot;admin-user&quot;, &quot;guest-visitor&quot;, &quot;e2e-run-4&quot;) to test multi-tenant workflows effortlessly.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Workflow Steps */}
      <div id="workflow-guide" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          How to Use the DevTools Panel
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h3 className="font-bold text-base text-slate-900">Open Browser DevTools</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Press <kbd className="font-mono text-xs bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-700">F12</kbd> or <kbd className="font-mono text-xs bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-700">Cmd+Option+I</kbd> in your browser while viewing your application.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h3 className="font-bold text-base text-slate-900">Select &quot;Playground API&quot;</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Navigate to the dedicated &quot;Playground API&quot; tab alongside Elements, Console, and Network tabs.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h3 className="font-bold text-base text-slate-900">Inspect &amp; Mutate</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Watch real-time state changes occur as you interact with your UI. Toggle network delays or wipe state on demand.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Local Developer Unpacked Installation */}
      <div id="developer-install" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Local Developer Installation (Manifest V3)
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            For local hacking or enterprise corporate environments with restricted store access:
          </p>
        </div>

        <CodeBlock
          code={manifestSnippet}
          language="json"
          title="manifest.json"
          subtitle="Chrome & Firefox Extension Manifest V3"
          maxHeight="max-h-80"
        />
      </div>

      {/* 5. Navigation Footer */}
      <div className="p-6 sm:p-7 rounded-2xl border border-indigo-100 bg-indigo-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-slate-900">Looking for the OpenAPI 3.1 Specification?</h3>
          <p className="text-sm text-slate-600">Download the full API schema to generate client SDKs or Swagger documentation.</p>
        </div>
        <Link
          href="/docs/collections/openapi"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shrink-0"
        >
          View OpenAPI 3.1 Spec
        </Link>
      </div>
    </div>
  );
}
