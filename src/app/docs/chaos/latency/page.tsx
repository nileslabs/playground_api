'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { CodeBlock } from '@/components/ui/CodeBlock';

export default function LatencySimulationPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const [delayMs, setDelayMs] = useState<number>(1500);
  const [statusCode, setStatusCode] = useState<number>(200);
  const [flaky, setFlaky] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [result, setResult] = useState<any>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  const buildUrl = () => {
    const params = new URLSearchParams();
    if (delayMs > 0) params.set('_delay', String(delayMs));
    if (statusCode !== 200) params.set('_status', String(statusCode));
    if (flaky) params.set('_flaky', 'true');
    params.set('_limit', '3');
    return `${publicApiUrl}/posts?${params.toString()}`;
  };

  const handleTestChaos = async () => {
    setLoading(true);
    setLatency(null);
    setResult(null);
    setResponseStatus(null);
    const startTime = performance.now();

    try {
      const res = await fetch(buildUrl(), { credentials: 'include' });
      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
      setResponseStatus(res.status);
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold uppercase tracking-wider border border-amber-200">
          <Icon icon="ph:hourglass-medium-bold" className="w-3.5 h-3.5" />
          <span>Chaos &amp; Resilience</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Network Chaos &amp; Latency Simulator
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Test UI skeleton loaders, error toast alerts, debounce handlers, and optimistic rollbacks by injecting configurable network delays, HTTP error codes, and flaky jitter into any REST query.
        </p>
      </div>

      {/* 2. Interactive Chaos Workbench */}
      <div id="interactive-chaos" className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="font-bold text-base sm:text-lg text-slate-900">
            Interactive Chaos Playground
          </h2>
          <p className="text-sm text-slate-600">
            Configure modifiers and click &quot;Trigger Request&quot; to test real-world network edge cases:
          </p>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Delay Control */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>Artificial Latency</span>
              <span className="font-mono text-indigo-600">{delayMs}ms</span>
            </label>
            <input
              type="range"
              min="0"
              max="5000"
              step="250"
              value={delayMs}
              onChange={(e) => setDelayMs(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>0ms</span>
              <span>2.5s</span>
              <span>5.0s</span>
            </div>
          </div>

          {/* Status Code Control */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              HTTP Status Code
            </label>
            <select
              value={statusCode}
              onChange={(e) => setStatusCode(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-indigo-500 cursor-pointer"
            >
              <option value="200">200 OK (Healthy)</option>
              <option value="400">400 Bad Request</option>
              <option value="401">401 Unauthorized</option>
              <option value="403">403 Forbidden</option>
              <option value="404">404 Not Found</option>
              <option value="429">429 Rate Limited</option>
              <option value="500">500 Server Error</option>
              <option value="503">503 Service Unavailable</option>
            </select>
          </div>

          {/* Flaky Jitter Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Flaky Network Jitter
            </label>
            <button
              type="button"
              onClick={() => setFlaky(!flaky)}
              className={`w-full p-2.5 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                flaky
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon icon={flaky ? 'ph:check-circle-bold' : 'ph:circle-bold'} className="w-4 h-4 text-amber-600" />
              <span>{flaky ? 'Flaky Jitter: ON' : 'Flaky Jitter: OFF'}</span>
            </button>
          </div>
        </div>

        {/* Generated URL & Trigger Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-indigo-700 font-bold overflow-x-auto select-all flex-1">
            {buildUrl()}
          </div>

          <button
            type="button"
            onClick={handleTestChaos}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Icon icon="ph:spinner-bold" className="w-4 h-4 animate-spin" />
                <span>Simulating Network...</span>
              </>
            ) : (
              <>
                <Icon icon="ph:play-bold" className="w-4 h-4" />
                <span>Trigger Request</span>
              </>
            )}
          </button>
        </div>

        {/* Live Output rendered using unified CodeBlock Editor UI */}
        {result && (
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 px-1">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    responseStatus && responseStatus < 400 ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
                <span className="font-bold">
                  Status: {responseStatus} {responseStatus === 200 ? 'OK' : responseStatus === 429 ? 'Too Many Requests' : responseStatus === 500 ? 'Internal Server Error' : ''}
                </span>
              </div>
              {latency !== null && (
                <span className="text-slate-500 font-mono text-xs">
                  Observed Round-Trip: <strong className="text-indigo-600">{latency}ms</strong>
                </span>
              )}
            </div>

            <CodeBlock
              code={JSON.stringify(result, null, 2)}
              language="json"
              title={`Response Payload (HTTP ${responseStatus})`}
              subtitle={latency !== null ? `Round-trip: ${latency}ms` : undefined}
            />
          </div>
        )}
      </div>

      {/* 3. Chaos Modifiers Reference Table */}
      <div id="modifier-reference" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Supported Chaos Modifiers
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="py-3.5 px-4">Modifier Type</th>
                <th className="py-3.5 px-4">Query Param</th>
                <th className="py-3.5 px-4">HTTP Header Alternative</th>
                <th className="py-3.5 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="hover:bg-slate-50/50">
                <td className="py-3.5 px-4 font-semibold text-slate-900">Latency Delay</td>
                <td className="py-3.5 px-4 font-mono text-indigo-600 font-bold">?_delay=1500</td>
                <td className="py-3.5 px-4 font-mono text-xs">X-Simulate-Delay: 1500</td>
                <td className="py-3.5 px-4 text-slate-600 text-xs sm:text-sm">
                  Sleeps on the server for 0-5000 milliseconds before sending headers.
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3.5 px-4 font-semibold text-slate-900">Status Override</td>
                <td className="py-3.5 px-4 font-mono text-rose-600 font-bold">?_status=500</td>
                <td className="py-3.5 px-4 font-mono text-xs">X-Simulate-Status: 500</td>
                <td className="py-3.5 px-4 text-slate-600 text-xs sm:text-sm">
                  Forces response code to 400, 401, 403, 404, 429, 500, or 503.
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3.5 px-4 font-semibold text-slate-900">Random Flakiness</td>
                <td className="py-3.5 px-4 font-mono text-amber-600 font-bold">?_flaky=true</td>
                <td className="py-3.5 px-4 font-mono text-xs">X-Simulate-Flaky: true</td>
                <td className="py-3.5 px-4 text-slate-600 text-xs sm:text-sm">
                  Injects randomized latency (200-2500ms) and random 10% packet drops.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Navigation Footer */}
      <div className="p-6 sm:p-7 rounded-2xl border border-indigo-100 bg-indigo-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-slate-900">Need to test specific error codes?</h3>
          <p className="text-sm text-slate-600">Simulate 400 Bad Request, 404 Not Found, 429 Rate Limits, or 500 Server Crashes.</p>
        </div>
        <Link
          href="/docs/chaos/status-codes"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shrink-0"
        >
          View Status Code Injection
        </Link>
      </div>
    </div>
  );
}
