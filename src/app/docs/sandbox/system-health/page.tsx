'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { CodeBlock } from '@/components/ui/CodeBlock';

export default function SystemHealthPage() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const res = await fetch(`${config.apiUrl}/health`, { credentials: 'include' });
      const data = await res.json();
      setLatency(Math.round(performance.now() - start));
      setHealth(data);
    } catch (err: any) {
      setLatency(Math.round(performance.now() - start));
      setHealth({ status: 'offline', error: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider border border-emerald-200">
          <Icon icon="ph:heartbeat-bold" className="w-3.5 h-3.5" />
          <span>Sandbox State &amp; Health</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          System Metrics &amp; Health Status
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Live availability, server uptime, round-trip network latency, and memory telemetry for the Playground API cluster. Monitor cluster readiness before initiating heavy automated integration runs.
        </p>
      </div>

      {/* 2. Interactive Health Card */}
      <div id="live-health" className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden scroll-mt-20">
        {/* Header Bar */}
        <div className="border-b border-slate-100 bg-slate-50/70 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <span className="font-bold text-sm text-slate-900">Live Health Diagnostic</span>
              {latency !== null && (
                <span className="text-xs text-slate-500 ml-2 font-mono">
                  Round-Trip: <strong className="text-emerald-600 font-bold">{latency}ms</strong>
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={fetchHealth}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Icon icon="ph:arrows-clockwise-bold" className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Pinging...' : 'Ping Health Endpoint'}</span>
          </button>
        </div>

        {/* Payload output via CodeBlock */}
        <div className="p-4 sm:p-5 bg-slate-50/50">
          {health ? (
            <CodeBlock
              code={JSON.stringify(health, null, 2)}
              language="json"
              title="health-response.json"
              subtitle={latency !== null ? `${latency}ms latency` : undefined}
              maxHeight="max-h-80"
            />
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs font-mono">
              Pinging server health...
            </div>
          )}
        </div>
      </div>

      {/* 3. Diagnostic Endpoints Table */}
      <div id="diagnostics-endpoints" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Diagnostic Endpoints Reference
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="py-3.5 px-4">Endpoint</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Expected Response</th>
                <th className="py-3.5 px-4">Usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              <tr>
                <td className="py-3 px-4 font-bold text-indigo-700">/api/v1/health</td>
                <td className="py-3 px-4 text-emerald-700 font-bold font-sans">GET</td>
                <td className="py-3 px-4 text-slate-700">{`{ status: "ok", uptime: ... }`}</td>
                <td className="py-3 px-4 text-slate-600 font-sans text-xs">
                  General server availability and cluster uptime telemetry.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-indigo-700">/api/v1/session/stats</td>
                <td className="py-3 px-4 text-emerald-700 font-bold font-sans">GET</td>
                <td className="py-3 px-4 text-slate-700">{`{ quota, stats, identity }`}</td>
                <td className="py-3 px-4 text-slate-600 font-sans text-xs">
                  Active session mutation counts, storage quotas, and memory TTL.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-indigo-700">/api/v1/session/reset</td>
                <td className="py-3 px-4 text-rose-700 font-bold font-sans">DELETE</td>
                <td className="py-3 px-4 text-slate-700">{`{ message: "Baseline restored" }`}</td>
                <td className="py-3 px-4 text-slate-600 font-sans text-xs">
                  Purges all mutations and restores the pristine dataset immediately.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. High-Availability Architecture Cards */}
      <div id="architecture" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          High-Availability Infrastructure
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Icon icon="ph:globe-stand-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Stateless Edge Routing</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Requests are routed through global edge reverse proxies with DDoS mitigation, HTTP/2 multiplexing, and automatic compression.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Icon icon="ph:cpu-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Ephemeral In-Memory TTL</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Visitor mutation overlays are stored in high-performance in-memory cache with an automated 10-day sliding inactivity expiration.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Icon icon="ph:shield-check-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Automated Self-Healing</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Cluster worker health is verified continuously with automatic process recycling to guarantee sub-50ms response latencies.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Navigation Footer */}
      <div className="p-6 sm:p-7 rounded-2xl border border-indigo-100 bg-indigo-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-slate-900">Ready to restore your baseline dataset?</h3>
          <p className="text-sm text-slate-600">Execute an atomic sandbox reset to purge all visitor mutations immediately.</p>
        </div>
        <Link
          href="/docs/sandbox/reset"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shrink-0"
        >
          View Atomic Reset Guide
        </Link>
      </div>
    </div>
  );
}
