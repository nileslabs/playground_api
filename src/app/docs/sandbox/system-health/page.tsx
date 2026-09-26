'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export default function SystemHealthPage() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${config.apiUrl}/health`, { credentials: 'include' });
      const data = await res.json();
      setHealth(data);
    } catch (err: any) {
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
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:heartbeat-bold" className="w-3.5 h-3.5" />
          <span>Sandbox State & Health</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          System Metrics & Health Status
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Check live server availability, system uptime, and memory consumption. Monitor status before launching automated integration test suites.
        </p>
      </div>

      {/* 2. Interactive Health Card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/70 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">Server Health Monitor</span>
          </div>

          <button
            type="button"
            onClick={fetchHealth}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Icon icon="ph:arrows-clockwise-bold" className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Ping Server</span>
          </button>
        </div>

        <div className="p-6">
          {health ? (
            <div className="rounded-xl border border-slate-200 bg-slate-900 p-5 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner leading-relaxed">
              <pre>{JSON.stringify(health, null, 2)}</pre>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Pinging server health...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
