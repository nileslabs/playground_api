'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export default function QuickstartPage() {
  const [activeTab, setActiveTab] = useState<'curl' | 'fetch' | 'axios'>('curl');
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const snippets = {
    curl: `curl ${publicApiUrl}/posts`,
    fetch: `fetch('${publicApiUrl}/posts')
  .then(res => res.json())
  .then(data => console.log(data));`,
    axios: `import axios from 'axios';

const { data } = await axios.get('${publicApiUrl}/posts');
console.log(data);`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePingHealth = async () => {
    setIsPinging(true);
    try {
      const res = await fetch(`${config.apiUrl}/health`, { credentials: 'include' });
      const data = await res.json();
      setPingResult(data);
    } catch (err: any) {
      setPingResult({ status: 'offline', error: err.message });
    } finally {
      setIsPinging(false);
    }
  };

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:lightning-bold" className="w-3.5 h-3.5" />
          <span>5-Minute Onboarding</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Quickstart Guide
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Get up and running with Playground API in under 30 seconds. No API keys, zero authentication setup, and zero credit card required.
        </p>
      </div>

      {/* 2. Interactive Health Ping Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Step 1: Test Server Connectivity</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Ping the live health check endpoint <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">GET /api/v1/health</code>.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePingHealth}
            disabled={isPinging}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
          >
            {isPinging ? (
              <>
                <Icon icon="ph:spinner-bold" className="w-3.5 h-3.5 animate-spin" />
                <span>Pinging...</span>
              </>
            ) : (
              <>
                <Icon icon="ph:heartbeat-bold" className="w-3.5 h-3.5" />
                <span>Ping Live Server</span>
              </>
            )}
          </button>
        </div>

        {pingResult && (
          <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner">
            <pre>{JSON.stringify(pingResult, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* 3. Interactive Code Snippet Runner */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden space-y-0">
        <div className="border-b border-slate-200 bg-slate-50/70 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Step 2: Fetch Your First Resource
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {(['curl', 'fetch', 'axios'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-xs font-medium rounded-lg uppercase tracking-wider transition-all ${
                  activeTab === tab
                    ? 'bg-white text-indigo-700 font-bold border border-slate-200 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-slate-900 relative">
          <button
            type="button"
            onClick={handleCopy}
            className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all flex items-center gap-1.5"
          >
            <Icon icon={copied ? 'ph:check-bold' : 'ph:copy-bold'} className="w-3.5 h-3.5 text-indigo-400" />
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <pre className="font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto py-2">
            {snippets[activeTab]}
          </pre>
        </div>
      </div>

      {/* 4. Three Steps Flow Card */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          How to Test With Your App
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h3 className="font-bold text-sm text-slate-900">Set Base URL</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Point your API client or fetch calls to <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">{publicApiUrl}</code>.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h3 className="font-bold text-sm text-slate-900">Mutate Freely</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Create, update, and delete posts, comments, or custom products. Mutations persist immediately in your visitor session.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h3 className="font-bold text-sm text-slate-900">Reset Anytime</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Call <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">DELETE /session/reset</code> whenever you want to purge mutations and restore the baseline dataset.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
