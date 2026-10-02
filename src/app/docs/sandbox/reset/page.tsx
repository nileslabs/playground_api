'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { useLiveCounts } from '@/context/CountsContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import Link from 'next/link';

export default function SandboxResetPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const { refreshCounts } = useLiveCounts();
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleReset = async () => {
    setResetting(true);
    setResetSuccess(false);
    setErrorMessage(null);

    try {
      const res = await fetch(`${config.apiUrl}/session/reset`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setResetSuccess(true);
        refreshCounts();
        setTimeout(() => setResetSuccess(false), 5000);
      } else {
        const err = await res.json();
        setErrorMessage(err.message || 'Failed to reset session');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error executing reset');
    } finally {
      setResetting(false);
    }
  };

  const curlResetCode = `# Purge all visitor mutations and restore baseline dataset
curl -X DELETE "${publicApiUrl}/session/reset" \\
  -H "X-Playground-Identity: test-runner-1" \\
  -H "Content-Type: application/json"

# Response: 200 OK
# { "status": "success", "message": "Baseline restored" }`;

  const playwrightHookCode = `// In your Playwright / Cypress test file
test.beforeEach(async ({ request }) => {
  // Guarantee clean baseline seed before every test case runs
  await request.delete('${publicApiUrl}/session/reset', {
    headers: { 'X-Playground-Identity': 'test-runner-1' },
  });
});`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold uppercase tracking-wider border border-rose-200">
          <Icon icon="ph:arrow-counter-clockwise-bold" className="w-3.5 h-3.5" />
          <span>Sandbox Lifecycle</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Atomic Sandbox Reset
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Instantly purge all created records, modified fields, soft-deleted items, and custom collections for your visitor session. Returns your workspace to the pristine baseline dataset immediately.
        </p>
      </div>

      {/* 2. Interactive Reset Action Card */}
      <div id="trigger-reset" className="p-6 sm:p-8 rounded-2xl bg-white border border-rose-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="font-extrabold text-lg sm:text-xl text-slate-900">
              Reset Active Session Overlay
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              This action executes <code className="font-mono text-xs text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 font-bold">DELETE /api/v1/session/reset</code>. Only your private session delta is discarded. Other developers&apos; sessions and global seed data remain 100% untouched.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            disabled={resetting}
            className="px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
          >
            {resetting ? (
              <>
                <Icon icon="ph:spinner-bold" className="w-4 h-4 animate-spin" />
                <span>Restoring Baseline...</span>
              </>
            ) : (
              <>
                <Icon icon="ph:arrow-counter-clockwise-bold" className="w-4 h-4" />
                <span>Reset Sandbox Now</span>
              </>
            )}
          </button>
        </div>

        {resetSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800 flex items-center gap-3">
            <Icon icon="ph:check-circle-bold" className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Sandbox successfully restored to baseline state! All private mutations have been purged.</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-800 flex items-center gap-3">
            <Icon icon="ph:warning-circle-bold" className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Guarantees Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Icon icon="ph:check-bold" className="w-4 h-4 text-emerald-600" />
              <span>Posts &amp; Comments</span>
            </h3>
            <p className="text-xs text-slate-600">Reverts to the standard 100 baseline posts and 500 comments.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Icon icon="ph:check-bold" className="w-4 h-4 text-emerald-600" />
              <span>Users &amp; Todos</span>
            </h3>
            <p className="text-xs text-slate-600">Restores default demo credentials and 200 standard todos.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Icon icon="ph:check-bold" className="w-4 h-4 text-emerald-600" />
              <span>Custom Collections</span>
            </h3>
            <p className="text-xs text-slate-600">Purges all dynamically generated schemas and test products.</p>
          </div>
        </div>
      </div>

      {/* 3. Programmatic Reset Snippets with Equal Height */}
      <div id="programmatic-reset" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Resetting Programmatically
        </h2>
        <p className="text-base text-slate-600 leading-relaxed">
          In automated end-to-end tests or local shell scripts, you can execute a reset with a single HTTP call:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-1 items-stretch">
          <div className="space-y-2 flex flex-col h-full">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Icon icon="ph:terminal-window-bold" className="w-4 h-4 text-indigo-600" />
              Terminal cURL
            </span>
            <div className="flex-1 flex flex-col">
              <CodeBlock
                code={curlResetCode}
                language="bash"
                title="Terminal"
                className="h-full flex-1 flex flex-col"
                codeClassName="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2 flex flex-col h-full">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Icon icon="simple-icons:playwright" className="w-4 h-4 text-purple-600" />
              Playwright Test Hook
            </span>
            <div className="flex-1 flex flex-col">
              <CodeBlock
                code={playwrightHookCode}
                language="typescript"
                title="test-suite.spec.ts"
                className="h-full flex-1 flex flex-col"
                codeClassName="flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Link to Dashboard */}
      <div className="p-6 sm:p-7 rounded-2xl border border-indigo-100 bg-indigo-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-slate-900">Want to inspect session telemetry before resetting?</h3>
          <p className="text-sm text-slate-600">Check current mutation counts, memory quotas, and active custom collections.</p>
        </div>
        <Link
          href="/docs/sandbox/dashboard"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shrink-0"
        >
          View Session Quotas
        </Link>
      </div>
    </div>
  );
}
