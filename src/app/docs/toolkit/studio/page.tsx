'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function ApiStudioPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:play-circle-bold" className="w-3.5 h-3.5" />
          <span>Developer Toolkit</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Universal API Studio
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          An in-browser HTTP client built directly into the documentation portal. Test arbitrary REST endpoints, inject chaos headers, mutate records, and inspect live responses with zero setup.
        </p>
      </div>

      {/* 2. Universal Interactive Studio Runner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Live Universal Studio Runner</h3>
          <p className="text-xs text-slate-500">Edit the path, method, headers, or body to execute any request:</p>
        </div>

        <InteractiveConsole
          method="GET"
          path="/posts?_limit=5"
          title="Universal API Client"
          description="Directly connected to your active session sandbox."
        />
      </div>

      {/* 3. Studio Quick Presets */}
      <div id="presets" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Studio Shortcut Presets
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <h3 className="font-bold text-sm text-slate-900">Authentication Test</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Login as <code className="font-mono text-indigo-600">admin</code> via <code className="font-mono text-xs">POST /auth/login</code> to receive a JWT and verify access tokens.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <h3 className="font-bold text-sm text-slate-900">Chaos Injection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Append <code className="font-mono text-indigo-600">?_delay=2000&_status=500</code> to verify frontend error boundaries and loading skeletons.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <h3 className="font-bold text-sm text-slate-900">Custom Collections</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Post to <code className="font-mono text-indigo-600">/custom/orders</code> with any arbitrary JSON structure to instantiate new collections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
