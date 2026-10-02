'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import Link from 'next/link';
import { CodeBlock } from '@/components/ui/CodeBlock';

export default function SandboxDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState<'visual' | 'json'>('visual');

  const [copiedToken, setCopiedToken] = useState(false);

  const handleCopyToken = () => {
    if (!stats?.identity?.id) return;
    navigator.clipboard.writeText(stats.identity.id);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${config.apiUrl}/session/stats`, { credentials: 'include' });
      const data = await res.json();
      setStats(data);
    } catch (err: any) {
      setStats({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const resourceStats = stats?.stats?.byResource || {};
  const totalMutated = stats?.stats?.totalRecords ?? 0;
  const maxQuota = stats?.quota?.maxCreatedPerResource ?? 30;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:gauge-bold" className="w-3.5 h-3.5" />
          <span>Sandbox Telemetry</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Session Quotas &amp; Mutation Activity
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Real-time visibility into your active session sandbox. Monitor mutated record counts, per-resource quotas, allocated storage, and the sliding 10-day inactivity timer for your visitor identity.
        </p>
      </div>

      {/* 2. Primary Telemetry Overview Cards */}
      <div id="telemetry-cards" className="space-y-4 scroll-mt-20">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Current Session State
          </h2>
          <button
            type="button"
            onClick={fetchStats}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
          >
            <Icon icon="ph:arrows-clockwise-bold" className={`w-3.5 h-3.5 text-indigo-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-1.5 relative group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Identity Token</span>
              {stats?.identity?.id && (
                <button
                  type="button"
                  onClick={handleCopyToken}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border transition-all cursor-pointer text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50/60 border-slate-200 hover:border-indigo-200"
                  title="Copy session identity token"
                >
                  <Icon
                    icon={copiedToken ? 'ph:check-bold' : 'ph:copy-bold'}
                    className={`w-3.5 h-3.5 ${copiedToken ? 'text-emerald-600' : 'text-slate-500'}`}
                  />
                  <span>{copiedToken ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
            <div className="text-base font-bold text-slate-900 font-mono truncate select-all" title={stats?.identity?.id || 'Anonymous'}>
              {stats?.identity?.id ? `${stats.identity.id.slice(0, 14)}...` : 'Connecting...'}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Active Cookie Session</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mutated Records</span>
            <div className="text-2xl font-extrabold text-indigo-600 font-mono">
              {totalMutated}
            </div>
            <p className="text-xs text-slate-500">Overlay diffs in current session</p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Per-Resource Quota</span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {maxQuota} <span className="text-xs text-slate-400 font-normal">items / type</span>
            </div>
            <p className="text-xs text-slate-500">Fair-use safety boundary</p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Retention Window</span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              10 <span className="text-xs text-slate-400 font-normal">days</span>
            </div>
            <p className="text-xs text-slate-500">Sliding inactivity TTL</p>
          </div>
        </div>
      </div>

      {/* 3. Detailed Per-Resource Usage */}
      <div id="resource-breakdown" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Resource Mutation Breakdown
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-3 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Resource Overlays</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveView('visual')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  activeView === 'visual' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Visual View
              </button>
              <button
                type="button"
                onClick={() => setActiveView('json')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  activeView === 'json' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Raw JSON
              </button>
            </div>
          </div>

          {activeView === 'visual' ? (
            <div className="divide-y divide-slate-100">
              {['posts', 'users', 'comments', 'todos'].map((resource) => {
                const info = resourceStats[resource] || { created: 0, updated: 0, deleted: 0 };
                const createdCount = info.created || 0;
                const percentage = Math.min(100, Math.round((createdCount / maxQuota) * 100));

                return (
                  <div key={resource} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-slate-900 capitalize">{resource}</span>
                        <code className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          /api/v1/{resource}
                        </code>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                        <span>Created: <strong className="text-slate-700">{info.created || 0}</strong></span>
                        <span>Updated: <strong className="text-slate-700">{info.updated || 0}</strong></span>
                        <span>Deleted: <strong className="text-slate-700">{info.deleted || 0}</strong></span>
                      </div>
                    </div>

                    <div className="w-full sm:w-48 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                        <span>Quota</span>
                        <span>{createdCount} / {maxQuota}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(4, percentage)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4">
              <CodeBlock
                code={JSON.stringify(stats, null, 2)}
                language="json"
                title="session-telemetry.json"
              />
            </div>
          )}
        </div>
      </div>

      {/* 4. Action Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <h3 className="text-lg font-bold text-slate-900">Need to purge these mutations?</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Execute an atomic reset to clear all session records and restore baseline defaults instantly.
          </p>
        </div>
        <Link
          href="/docs/sandbox/reset"
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Icon icon="ph:arrow-counter-clockwise-bold" className="w-4 h-4" />
          <span>Reset Sandbox</span>
        </Link>
      </div>
    </div>
  );
}
