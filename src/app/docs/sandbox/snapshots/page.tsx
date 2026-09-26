'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function SandboxSnapshotsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:file-arrow-down-bold" className="w-3.5 h-3.5" />
          <span>Sandbox State & Health</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          JSON State Snapshots (Export & Import)
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Capture your entire session state (created posts, comments, cart contents, custom collections) as portable JSON fixtures. Share reproducible bug reports with teammates or load seed data into automated test suites.
        </p>
      </div>

      {/* 2. Step 1: Export Current Sandbox State */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Step 1: Export Active Session Snapshot</h3>
          <p className="text-xs text-slate-500">
            Call <code className="font-mono text-xs">GET /session/export</code> to extract all mutations made in your session:
          </p>
        </div>

        <InteractiveConsole
          method="GET"
          path="/session/export"
          title="Export Session Snapshot"
        />
      </div>

      {/* 3. Step 2: Import Snapshot */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Step 2: Restore Snapshot into Sandbox</h3>
          <p className="text-xs text-slate-500">
            Post snapshot JSON to <code className="font-mono text-xs">/session/import</code> to immediately apply fixture records:
          </p>
        </div>

        <InteractiveConsole
          method="POST"
          path="/session/import"
          title="Import Session Snapshot"
          initialBody={JSON.stringify(
            {
              posts: [
                {
                  id: 101,
                  title: 'Imported Snapshot Fixture Post',
                  body: 'Restored from JSON snapshot fixture.',
                  userId: 1,
                },
              ],
            },
            null,
            2
          )}
        />
      </div>
    </div>
  );
}
