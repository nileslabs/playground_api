'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface SandboxPreset {
  id: string;
  label: string;
  badge: string;
  desc: string;
  headers: Record<string, string>;
  path: string;
}

const PRESETS: SandboxPreset[] = [
  {
    id: 'ci-header',
    label: 'CI/CD Worker Identity Header',
    badge: 'Headless CI',
    desc: 'Pass an explicit X-Playground-Identity header. Guarantees deterministic isolation across parallel test suites.',
    headers: {
      'X-Playground-Identity': 'ci-run-e2e-worker-42',
    },
    path: '/posts',
  },
  {
    id: 'browser-cookie',
    label: 'Interactive Browser Cookie Mode',
    badge: 'Cookie-Driven',
    desc: 'Browser automatically sends credentials with signed pg_identity cookie. Zero configuration required.',
    headers: {},
    path: '/posts',
  },
  {
    id: 'authenticated-jwt',
    label: 'Authenticated Persona Mode (Bearer)',
    badge: 'JWT Bearer',
    desc: 'Enforces identity and RBAC role permissions via standard Authorization: Bearer token header.',
    headers: {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
    path: '/auth/me',
  },
  {
    id: 'hybrid-dual',
    label: 'Hybrid Dual-Mode (Header + Bearer)',
    badge: 'Dual-Mode',
    desc: 'Combines explicit CI sandbox scoping with user authentication for multi-tenant simulation.',
    headers: {
      'X-Playground-Identity': 'tenant-acme-corp-sandbox',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
    path: '/posts',
  },
];

export default function DualSandboxingPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const [activePreset, setActivePreset] = useState<SandboxPreset>(PRESETS[0]);
  const [activeRecipe, setActiveRecipe] = useState<'playwright' | 'fetchClient'>('playwright');

  const playwrightRecipe = `// Playwright E2E Parallel Worker Fixture (Zero Test Pollution)
import { test as base, expect } from '@playwright/test';

// Extend base test to inject a unique sandbox identity per test worker
export const test = base.extend<{ sandboxId: string }>({
  sandboxId: async ({}, use, testInfo) => {
    // Unique identity per worker and test title
    const id = \`e2e-\${testInfo.workerIndex}-\${testInfo.testId}\`;
    await use(id);
  },

  // Automatically attach X-Playground-Identity to all page requests
  page: async ({ page, sandboxId }, use) => {
    await page.setExtraHTTPHeaders({
      'X-Playground-Identity': sandboxId,
    });
    await use(page);
  },
});

test('isolated user creation and mutation', async ({ page }) => {
  await page.goto('/dashboard');
  // Mutations execute inside this worker's private overlay
});`;

  const fetchClientRecipe = `// Multi-Tenant / Microservices Client Factory
export function createSandboxClient(sandboxIdentity?: string, bearerToken?: string) {
  const baseURL = '${publicApiUrl}';

  return async function request(path: string, options: RequestInit = {}) {
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');

    // 1. Attach explicit sandbox isolation header if present
    if (sandboxIdentity) {
      headers.set('X-Playground-Identity', sandboxIdentity);
    }

    // 2. Attach Bearer authentication if present
    if (bearerToken) {
      headers.set('Authorization', \`Bearer \${bearerToken}\`);
    }

    return fetch(\`\${baseURL}\${path}\`, {
      ...options,
      headers,
      credentials: 'include', // Includes pg_identity cookie as fallback
    });
  };
}`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:intersect-bold" className="w-3.5 h-3.5" />
          <span>Auth &amp; Security</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Dual-Mode Session Sandboxing
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Playground API supports dual session isolation modes: automatic browser cookies for interactive web apps, and explicit <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">X-Playground-Identity</code> headers for headless CI/CD test runners. Seamlessly bridge anonymous session data with authenticated user personas.
        </p>
      </div>

      {/* 2. Interactive Identity Header Runner */}
      <div id="dual-runner" className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="font-bold text-base sm:text-lg text-slate-900">
            Interactive Identity Mode Tester
          </h2>
          <p className="text-sm text-slate-600">
            Select an isolation mode below to test header precedence and session overlay routing:
          </p>
        </div>

        {/* Preset Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-indigo-700">
                  {preset.badge}
                </span>
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
          method="GET"
          path={activePreset.path}
          title={`Execute: ${activePreset.label}`}
          initialHeaders={activePreset.headers}
        />
      </div>

      {/* 3. Identity Precedence Hierarchy */}
      <div id="resolution-hierarchy" className="space-y-4 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Identity Resolution Precedence Hierarchy
          </h2>
          <p className="text-sm text-slate-600">
            How the API determines session routing when multiple identifiers are present:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold uppercase">
              Priority 1 (Highest)
            </span>
            <div className="font-mono font-bold text-xs sm:text-sm text-slate-900">X-Playground-Identity</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explicit header passed by CI/CD runners or headless scripts. Overrides all cookies.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-bold uppercase">
              Priority 2
            </span>
            <div className="font-mono font-bold text-xs sm:text-sm text-slate-900">?_sandbox=uuid</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Query parameter for QR code mobile syncing, manual browser debugging, and bookmarkable sandboxes.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold uppercase">
              Priority 3
            </span>
            <div className="font-mono font-bold text-xs sm:text-sm text-slate-900">pg_identity (Cookie)</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cryptographically signed HttpOnly cookie automatically issued to standard browser clients.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold uppercase">
              Priority 4 (Fallback)
            </span>
            <div className="font-mono font-bold text-xs sm:text-sm text-slate-900">Auto-Provisioning</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              If no identity is detected, the server automatically provisions a fresh sandbox and sets the cookie.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Production Integration Recipes */}
      <div id="client-recipes" className="space-y-4 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Testing &amp; CI/CD Integration Recipes
          </h2>
          <p className="text-sm text-slate-600">
            How to configure parallel test runners with isolated sandbox states:
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'playwright', label: 'Playwright Parallel Worker Fixture', icon: 'ph:browsers-bold' },
              { id: 'fetchClient', label: 'Multi-Tenant Client Factory', icon: 'ph:code-bold' },
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
            code={activeRecipe === 'playwright' ? playwrightRecipe : fetchClientRecipe}
            language="typescript"
            title={`sandboxClient.${activeRecipe === 'playwright' ? 'ts' : 'ts'}`}
            copyable
          />
        </div>
      </div>
    </div>
  );
}
