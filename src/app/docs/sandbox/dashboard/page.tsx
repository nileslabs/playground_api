'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export default function SandboxDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:gauge-bold" className="w-3.5 h-3.5" />
          <span>Sandbox State & Health</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Session Quotas & Mutation Activity
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Real-time visibility into your active session sandbox. Monitor mutated record counts, custom collections, and memory quotas allocated to your visitor identity.
        </p>
      </div>

      {/* 2. Interactive Stats Viewer */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/70 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">Live Sandbox Telemetry</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <button
            type="button"
            onClick={fetchStats}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Icon icon="ph:arrows-clockwise-bold" className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Stats</span>
          </button>
        </div>

        <div className="p-6">
          {stats ? (
            <div className="rounded-xl border border-slate-200 bg-slate-900 p-5 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner leading-relaxed">
              <pre>{JSON.stringify(stats, null, 2)}</pre>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Loading session telemetry...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
