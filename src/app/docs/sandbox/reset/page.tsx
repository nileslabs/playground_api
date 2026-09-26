'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { useLiveCounts } from '@/context/CountsContext';

export default function SandboxResetPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const { refreshCounts } = useLiveCounts();
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = async () => {
    setResetting(true);
    setResetSuccess(false);

    try {
      const res = await fetch(`${config.apiUrl}/session/reset`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setResetSuccess(true);
        refreshCounts();
        setTimeout(() => setResetSuccess(false), 4000);
      }
    } catch {
      // ignore
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold uppercase tracking-wider border border-rose-200">
          <Icon icon="ph:arrow-counter-clockwise-bold" className="w-3.5 h-3.5" />
          <span>Sandbox State & Health</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Atomic Sandbox Reset
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Instantly purge all mutations, deleted records, custom collections, and uploaded files for your visitor session. Returns your workspace to the pristine baseline dataset immediately.
        </p>
      </div>

      {/* 2. Interactive Reset Action Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-rose-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="font-extrabold text-lg text-slate-900">Reset Session Sandbox</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              This action executes <code className="font-mono text-xs text-rose-600 font-bold">DELETE /api/v1/session/reset</code>. Only your private session is cleared; other users&apos; sessions and global baseline records remain 100% unaffected.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            disabled={resetting}
            className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
          >
            {resetting ? (
              <>
                <Icon icon="ph:spinner-bold" className="w-4 h-4 animate-spin" />
                <span>Resetting Sandbox...</span>
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
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <Icon icon="ph:check-circle-bold" className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Sandbox successfully restored to baseline state! All temporary mutations purged.</span>
          </div>
        )}
      </div>
    </div>
  );
}
