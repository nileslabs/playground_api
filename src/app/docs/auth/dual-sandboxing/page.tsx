'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function DualSandboxingPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:intersect-bold" className="w-3.5 h-3.5" />
          <span>Auth & Security</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Dual-Mode Session Sandboxing
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Playground API supports two complementary session isolation modes: automatic browser cookies for interactive web apps, and explicit <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">X-Playground-Identity</code> headers for headless CI/CD test runners.
        </p>
      </div>

      {/* 2. Interactive Identity Header Runner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Test Explicit Identity Header</h3>
          <p className="text-xs text-slate-500">
            Send a custom session key in the <code className="font-mono text-xs">X-Playground-Identity</code> header to access an isolated sandbox state:
          </p>
        </div>

        <InteractiveConsole
          method="GET"
          path="/posts"
          title="Sandbox with Custom Identity Header"
          initialHeaders={[{ key: 'X-Playground-Identity', value: 'ci-run-e2e-fixture-101' }]}
        />
      </div>

      {/* 3. Dual Mode Comparison */}
      <div id="comparison" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Cookie vs Header Resolution Priority
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-bold text-sm text-slate-900">Header Priority: X-Playground-Identity</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              If an <code className="font-mono text-xs text-indigo-600">X-Playground-Identity</code> header is present, the server uses it exclusively. This guarantees 100% deterministic isolation during automated test runs across parallel workers.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 font-mono text-[11px] text-slate-700">
              headers: &#123; &apos;X-Playground-Identity&apos;: &apos;test-worker-1&apos; &#125;
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-bold text-sm text-slate-900">Fallback: Browser Session Cookie</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              When no identity header is provided, the server issues and tracks a secure <code className="font-mono text-xs text-indigo-600">playground_session</code> cookie. Just pass <code className="font-mono text-xs text-indigo-600">credentials: &apos;include&apos;</code> in browser fetch calls.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 font-mono text-[11px] text-slate-700">
              fetch(&apos;...&apos;, &#123; credentials: &apos;include&apos; &#125;)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
