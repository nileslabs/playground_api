'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export default function TypeScriptDownloadPage() {
  const downloadUrl = `${config.apiUrl}/download/playground-api.d.ts`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:file-ts-bold" className="w-3.5 h-3.5" />
          <span>Client Collections</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          TypeScript Ambient Declarations (.d.ts)
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Get complete IntelliSense, strict type checking, and schema inference across your entire frontend codebase. Download the official ambient declaration file for Playground API.
        </p>
      </div>

      {/* 2. Download Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              TypeScript .d.ts
            </span>
            <span className="text-xs text-slate-500 font-mono">playground-api.d.ts</span>
          </div>
          <h3 className="font-extrabold text-lg text-slate-900">Official Type Definitions</h3>
          <p className="text-xs text-slate-600 max-w-xl">
            Contains all model interfaces (<code className="font-mono text-indigo-600">User</code>, <code className="font-mono text-indigo-600">Post</code>, <code className="font-mono text-indigo-600">Comment</code>, <code className="font-mono text-indigo-600">Todo</code>, <code className="font-mono text-indigo-600">PaymentIntent</code>), query parameters, and API response envelopes.
          </p>
        </div>

        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          download="playground-api.d.ts"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Icon icon="ph:download-simple-bold" className="w-4 h-4" />
          <span>Download playground-api.d.ts</span>
        </a>
      </div>

      {/* 3. Setup in tsconfig.json */}
      <div id="tsconfig-setup" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          How to Install in Next.js / React
        </h2>

        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Drop the downloaded <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">playground-api.d.ts</code> file into your project&apos;s <code className="font-mono text-xs">types/</code> or <code className="font-mono text-xs">src/@types/</code> directory. TypeScript will automatically recognize all global interfaces:
          </p>

          <div className="rounded-xl border border-slate-200 bg-slate-900 p-4">
            <pre className="font-mono text-xs text-slate-100 overflow-x-auto leading-relaxed">
{`// Example usage in React component:
import { useState, useEffect } from 'react';

export function UserList() {
  // User interface is globally available!
  const [users, setUsers] = useState<PlaygroundApi.User[]>([]);

  useEffect(() => {
    fetch('${config.publicApiUrl}/users')
      .then(res => res.json())
      .then((data: PlaygroundApi.PaginatedResponse<PlaygroundApi.User>) => {
        setUsers(data.data);
      });
  }, []);

  return <div>{users.map(u => <p key={u.id}>{u.name} ({u.email})</p>)}</div>;
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
