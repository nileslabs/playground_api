'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';

export default function FlakyEnginePage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const [rate, setRate] = useState<number>(0.5);
  const [errorCodes, setErrorCodes] = useState<string>('500,503');

  const queryPath = `/posts?_chaos=${rate}&_chaos_errors=${encodeURIComponent(errorCodes)}`;

  const tanstackQuerySnippet = `// Configuring resilient retries in TanStack Query (React Query)
import { useQuery } from '@tanstack/react-query';

export function useResilientPosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      // Connect to endpoint with 50% probabilistic chaos injected
      const res = await fetch('${publicApiUrl}/posts?_chaos=0.5', {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(\`HTTP failure \${res.status}: \${res.statusText}\`);
      }

      return res.json();
    },
    // Retry up to 3 times for transient 5xx / 429 errors
    retry: (failureCount, error: any) => {
      if (failureCount >= 3) return false;
      // Do not retry 400 Bad Request or 404 Not Found
      return !error.message.includes('400') && !error.message.includes('404');
    },
    // Exponential backoff: 500ms, 1000ms, 2000ms
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
}`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold uppercase tracking-wider border border-purple-200">
          <Icon icon="ph:cloud-lightning-bold" className="w-3.5 h-3.5" />
          <span>Chaos &amp; Fault Injection</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Flaky Network &amp; Probabilistic Jitter
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Subject your frontend to real-world network instability. Randomly fail requests with configurable failure probabilities (e.g. 25%, 50%, or 75% drop rates) and stochastic jitter delays to verify TanStack Query retries, SWR deduplication, and circuit breakers.
        </p>
      </div>

      {/* 2. Interactive Flaky Workbench */}
      <div id="interactive-runner" className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="font-bold text-base sm:text-lg text-slate-900">
            Interactive Probabilistic Chaos Runner
          </h2>
          <p className="text-sm text-slate-600">
            Configure failure likelihood and targeted error codes, then click &quot;Send&quot; repeatedly to observe intermittent failures:
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>Failure Probability</span>
              <span className="font-mono text-purple-600 font-bold">{Math.round(rate * 100)}%</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>10% (Subtle)</span>
              <span>50% (Flaky)</span>
              <span>90% (Outage)</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Target Error Status Pool
            </label>
            <div className="flex items-center gap-2">
              {['500,503', '502,504', '429,500'].map((pool) => (
                <button
                  key={pool}
                  type="button"
                  onClick={() => setErrorCodes(pool)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    errorCodes === pool
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pool}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              When chaos triggers, the server randomly picks from these status codes.
            </p>
          </div>
        </div>

        <InteractiveConsole
          key={queryPath}
          method="GET"
          path={queryPath}
          title={`Flaky Request (${Math.round(rate * 100)}% Chance of Failure)`}
          description="Click Send repeatedly. When chaos fires, the server injects 250-1500ms of latency jitter and throws an error."
        />
      </div>

      {/* 3. Chaos Parameters Reference Table */}
      <div id="parameters" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Chaos Modifiers Reference
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="py-3.5 px-4">Modifier / Header</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Valid Values</th>
                <th className="py-3.5 px-4">Behavior</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs sm:text-sm">
              <tr>
                <td className="py-3.5 px-4 font-mono font-bold text-purple-700">?_chaos=value</td>
                <td className="py-3.5 px-4 text-slate-500 font-sans">Query Param</td>
                <td className="py-3.5 px-4 font-mono text-slate-800">0.0 to 1.0 (or 0-100)</td>
                <td className="py-3.5 px-4 text-slate-600">
                  Probability of random rejection. E.g. <code className="font-mono text-xs">0.3</code> = 30% failure rate.
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-mono font-bold text-purple-700">X-Simulate-Chaos</td>
                <td className="py-3.5 px-4 text-slate-500 font-sans">HTTP Header</td>
                <td className="py-3.5 px-4 font-mono text-slate-800">0.5</td>
                <td className="py-3.5 px-4 text-slate-600">
                  Header equivalent for CI/CD test runners or automated regression suites.
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-mono font-bold text-purple-700">?_chaos_errors</td>
                <td className="py-3.5 px-4 text-slate-500 font-sans">Query Param</td>
                <td className="py-3.5 px-4 font-mono text-slate-800">500,502,503</td>
                <td className="py-3.5 px-4 text-slate-600">
                  Comma-separated list of target HTTP error codes to randomly select from upon failure.
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-mono font-bold text-purple-700">Network Jitter</td>
                <td className="py-3.5 px-4 text-slate-500 font-sans">Built-in</td>
                <td className="py-3.5 px-4 font-mono text-slate-800">250ms - 1500ms</td>
                <td className="py-3.5 px-4 text-slate-600">
                  Whenever chaos triggers, stochastic latency is automatically added to simulate packet lag.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. TanStack Query Resilience Recipe */}
      <div id="tanstack-recipe" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Resilient Retries with TanStack React Query
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Configure automatic exponential retries in your data-fetching hooks to make your UI resilient against transient network drops:
          </p>
        </div>

        <CodeBlock
          code={tanstackQuerySnippet}
          language="typescript"
          title="useResilientPosts.ts"
          maxHeight="max-h-96"
        />
      </div>

      {/* 5. Navigation Footer */}
      <div className="p-6 sm:p-7 rounded-2xl border border-indigo-100 bg-indigo-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-slate-900">Want to inspect session telemetry?</h3>
          <p className="text-sm text-slate-600">Monitor active memory quotas, storage consumption, and visitor session identities.</p>
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
