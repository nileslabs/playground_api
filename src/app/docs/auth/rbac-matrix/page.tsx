'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function RbacMatrixPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:identification-badge-bold" className="w-3.5 h-3.5" />
          <span>Auth & Security</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          RBAC Permission Matrix & Personas
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Test Role-Based Access Control (RBAC) with preconfigured test users (<code className="font-mono text-xs text-indigo-600">admin</code>, <code className="font-mono text-xs text-indigo-600">editor</code>, and <code className="font-mono text-xs text-indigo-600">viewer</code>). Verify that UI route guards and action buttons reflect exact permissions.
        </p>
      </div>

      {/* 2. Interactive Roles Runner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Fetch Role & Permission Dictionary</h3>
          <p className="text-xs text-slate-500">
            Call <code className="font-mono text-xs">/auth/roles</code> to inspect the full list of system roles and scopes:
          </p>
        </div>

        <InteractiveConsole
          method="GET"
          path="/auth/roles"
          title="RBAC Roles & Permissions"
        />
      </div>

      {/* 3. Persona Credentials Grid */}
      <div id="personas" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Built-in Test Personas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">ADMIN</span>
              <Icon icon="ph:shield-bold" className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900">System Administrator</div>
              <div className="text-xs font-mono text-slate-500">admin / admin123</div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full privileges. Can create, read, update, delete all resources, seed custom tables, and purge visitor sessions.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">EDITOR</span>
              <Icon icon="ph:pencil-simple-bold" className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900">Content Editor</div>
              <div className="text-xs font-mono text-slate-500">editor / editor123</div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Can create and modify posts, comments, and todos. Restricted from system administration and deletion of other users.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">VIEWER</span>
              <Icon icon="ph:eye-bold" className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900">Read-Only Viewer</div>
              <div className="text-xs font-mono text-slate-500">viewer / viewer123</div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strictly read-only. Mutation requests (POST, PUT, DELETE) will return <code className="font-mono text-xs">403 Forbidden</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
