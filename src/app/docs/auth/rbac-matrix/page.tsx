'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface RbacPreset {
  id: string;
  label: string;
  role: 'admin' | 'editor' | 'viewer' | 'guest';
  method: 'GET' | 'POST' | 'DELETE';
  path: string;
  desc: string;
  headers: Record<string, string>;
  body?: string;
}

const PRESETS: RbacPreset[] = [
  {
    id: 'admin-delete',
    label: 'Admin: Delete Resource (Allowed)',
    role: 'admin',
    method: 'DELETE',
    path: '/users/1',
    desc: 'Admins hold the delete action across all collections. Succeeds with HTTP 200.',
    headers: {
      'X-Simulate-Role': 'admin',
    },
  },
  {
    id: 'editor-create',
    label: 'Editor: Create Post (Allowed)',
    role: 'editor',
    method: 'POST',
    path: '/posts',
    desc: 'Editors can read, create, and update records. Succeeds with HTTP 201 Created.',
    headers: {
      'X-Simulate-Role': 'editor',
    },
    body: JSON.stringify(
      {
        title: 'Editor Published Article',
        body: 'Created under verified Editor RBAC role scope.',
        userId: 2,
      },
      null,
      2
    ),
  },
  {
    id: 'viewer-forbidden',
    label: 'Viewer: Delete Resource (403 Forbidden)',
    role: 'viewer',
    method: 'DELETE',
    path: '/users/1',
    desc: 'Viewers lack write permissions. The gateway halts execution with HTTP 403 Forbidden.',
    headers: {
      'X-Simulate-Role': 'viewer',
    },
  },
  {
    id: 'guest-read',
    label: 'Guest: Read Public Feed (Allowed)',
    role: 'guest',
    method: 'GET',
    path: '/posts?_limit=3',
    desc: 'Unauthenticated or guest visitors have basic read access to public resources.',
    headers: {
      'X-Simulate-Role': 'guest',
    },
  },
  {
    id: 'roles-dictionary',
    label: 'System Roles & Permissions Dictionary',
    role: 'admin',
    method: 'GET',
    path: '/auth/roles',
    desc: 'Fetches the live RBAC permission definitions, allowed actions, and default scopes.',
    headers: {},
  },
];

export default function RbacMatrixPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const [activePreset, setActivePreset] = useState<RbacPreset>(PRESETS[0]);
  const [activeRecipe, setActiveRecipe] = useState<'guard' | 'hook'>('guard');

  const guardComponentRecipe = `// React 19 / Next.js <PermissionGuard /> Component
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

interface PermissionGuardProps {
  requiredRole?: 'admin' | 'editor' | 'viewer';
  requiredScope?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGuard({
  requiredRole,
  requiredScope,
  fallback = null,
  children,
}: PermissionGuardProps) {
  const { user } = useAuth();

  if (!user) return <>{fallback}</>;

  // Admin superuser bypasses all scope checks
  if (user.role === 'admin') return <>{children}</>;

  // Check role hierarchy
  if (requiredRole && user.role !== requiredRole) {
    if (requiredRole === 'editor' && user.role !== 'admin') {
      return <>{fallback}</>;
    }
  }

  // Check specific granular scope
  if (requiredScope) {
    const hasScope = user.scopes?.includes('*') ||
                     user.scopes?.includes(requiredScope) ||
                     user.scopes?.includes(\`\${requiredScope.split(':')[0]}:*\`);
    if (!hasScope) return <>{fallback}</>;
  }

  return <>{children}</>;
}`;

  const hookRecipe = `// React Custom Hook: useHasPermission()
import { useMemo } from 'react';

export function useHasPermission(user: { role?: string; scopes?: string[] } | null) {
  return useMemo(() => {
    return (requiredAction: 'read' | 'create' | 'update' | 'delete', resource: string): boolean => {
      if (!user) return requiredAction === 'read';
      if (user.role === 'admin') return true;

      const userScopes = user.scopes || [];
      if (userScopes.includes('*')) return true;

      const targetScope = \`\${resource}:\${requiredAction}\`;
      return (
        userScopes.includes(targetScope) ||
        userScopes.includes(\`*:\${requiredAction}\`) ||
        userScopes.includes(\`\${resource}:*\`)
      );
    };
  }, [user]);
}`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:identification-badge-bold" className="w-3.5 h-3.5" />
          <span>Auth &amp; Security</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            RBAC Permission Matrix &amp; Scopes
          </h1>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">
            4 Role Tiers
          </span>
        </div>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Role-Based Access Control (RBAC) with granular scope evaluation. Simulate requests as <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">admin</code>, <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">editor</code>, <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">viewer</code>, or <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">guest</code> using custom simulation headers to test route authorization guards and HTTP 403 Forbidden responses.
        </p>
      </div>

      {/* 2. Interactive Simulation Runner */}
      <div id="rbac-runner" className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="font-bold text-base sm:text-lg text-slate-900">
            Interactive Role Authorization Tester
          </h2>
          <p className="text-sm text-slate-600">
            Select an authorization scenario below to test permission enforcement on live backend endpoints:
          </p>
        </div>

        {/* Preset Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setActivePreset(preset)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                activePreset.id === preset.id
                  ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-1 ring-indigo-500'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      preset.method === 'DELETE'
                        ? 'bg-rose-100 text-rose-800'
                        : preset.method === 'POST'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {preset.method}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider ${
                      preset.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : preset.role === 'editor'
                        ? 'bg-blue-100 text-blue-800'
                        : preset.role === 'viewer'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {preset.role}
                  </span>
                </div>
                <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                  {preset.label}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {preset.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Live Interactive Console */}
        <InteractiveConsole
          key={activePreset.id}
          method={activePreset.method}
          path={activePreset.path}
          title={`Simulate: ${activePreset.label}`}
          initialHeaders={activePreset.headers}
          initialBody={activePreset.body}
        />
      </div>

      {/* 3. Comprehensive RBAC Matrix Table */}
      <div id="rbac-matrix-table" className="space-y-4 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Resource Permission Matrix
          </h2>
          <p className="text-sm text-slate-600">
            Authorization privileges across system collections and operational action boundaries:
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <th className="py-3 px-4">Resource Domain</th>
                  <th className="py-3 px-4">Read (GET)</th>
                  <th className="py-3 px-4">Create (POST)</th>
                  <th className="py-3 px-4">Update (PUT/PATCH)</th>
                  <th className="py-3 px-4">Delete (DELETE)</th>
                  <th className="py-3 px-4">Admin / Reset</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">Users &amp; Profiles</td>
                  <td className="py-3.5 px-4 text-emerald-600 font-bold flex items-center gap-1">
                    <Icon icon="ph:check-bold" className="w-4 h-4" />
                    <span>All Roles</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">Editor, Admin</td>
                  <td className="py-3.5 px-4 text-slate-700">Editor, Admin</td>
                  <td className="py-3.5 px-4 text-purple-700 font-bold">Admin Only</td>
                  <td className="py-3.5 px-4 text-purple-700 font-bold">Admin Only</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">Posts &amp; Comments</td>
                  <td className="py-3.5 px-4 text-emerald-600 font-bold flex items-center gap-1">
                    <Icon icon="ph:check-bold" className="w-4 h-4" />
                    <span>All Roles</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">Editor, Admin</td>
                  <td className="py-3.5 px-4 text-slate-700">Editor, Admin</td>
                  <td className="py-3.5 px-4 text-purple-700 font-bold">Admin Only</td>
                  <td className="py-3.5 px-4 text-purple-700 font-bold">Admin Only</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">Todos Checklist</td>
                  <td className="py-3.5 px-4 text-emerald-600 font-bold flex items-center gap-1">
                    <Icon icon="ph:check-bold" className="w-4 h-4" />
                    <span>All Roles</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">Editor, Admin</td>
                  <td className="py-3.5 px-4 text-slate-700">Editor, Admin</td>
                  <td className="py-3.5 px-4 text-purple-700 font-bold">Admin Only</td>
                  <td className="py-3.5 px-4 text-purple-700 font-bold">Admin Only</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">Media &amp; File Uploads</td>
                  <td className="py-3.5 px-4 text-emerald-600 font-bold flex items-center gap-1">
                    <Icon icon="ph:check-bold" className="w-4 h-4" />
                    <span>All Roles</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">Editor, Admin</td>
                  <td className="py-3.5 px-4 text-slate-700">Editor, Admin</td>
                  <td className="py-3.5 px-4 text-purple-700 font-bold">Admin Only</td>
                  <td className="py-3.5 px-4 text-purple-700 font-bold">Admin Only</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">Sandbox Reset &amp; Seeding</td>
                  <td className="py-3.5 px-4 text-slate-700">Editor, Admin</td>
                  <td className="py-3.5 px-4 text-purple-700 font-bold">Admin Only</td>
                  <td className="py-3.5 px-4 text-purple-700 font-bold">Admin Only</td>
                  <td className="py-3.5 px-4 text-purple-700 font-bold">Admin Only</td>
                  <td className="py-3.5 px-4 text-purple-700 font-bold">Admin Only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Production Integration Recipes */}
      <div id="client-recipes" className="space-y-4 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Frontend Authorization Guard Recipes
          </h2>
          <p className="text-sm text-slate-600">
            Patterns for protecting sensitive components and action buttons in React 19:
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'guard', label: '<PermissionGuard /> Component', icon: 'ph:shield-check-bold' },
              { id: 'hook', label: 'useHasPermission() Hook', icon: 'ph:code-bold' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveRecipe(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeRecipe === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <CodeBlock
            code={activeRecipe === 'guard' ? guardComponentRecipe : hookRecipe}
            language="typescript"
            title={`authGuards.${activeRecipe === 'guard' ? 'tsx' : 'ts'}`}
            copyable
          />
        </div>
      </div>
    </div>
  );
}
