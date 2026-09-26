'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export default function CiCdIdentityPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const playwrightSnippet = `// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'http://localhost:3000',
    extraHTTPHeaders: {
      // Isolate each parallel test worker with its own unique sandbox!
      'X-Playground-Identity': \`ci-worker-\${process.env.TEST_WORKER_INDEX || '0'}\`,
    },
  },
});`;

  const githubActionsSnippet = `# .github/workflows/e2e.yml
- name: Run E2E Test Suite
  env:
    PLAYGROUND_IDENTITY: github-actions-\${{ github.run_id }}-\${{ github.job }}
  run: npx playwright test`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:git-commit-bold" className="w-3.5 h-3.5" />
          <span>Sandbox State & Health</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Headless CI/CD Sandboxing with Custom Identity
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Run 50 parallel end-to-end test jobs without state collisions or database locks. Pass a unique <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">X-Playground-Identity</code> header to give every automated test runner its own isolated memory sandbox.
        </p>
      </div>

      {/* 2. Playwright Configuration Recipe */}
      <div id="playwright" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Playwright Multi-Worker Isolation
        </h2>
        <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 shadow-inner">
          <pre className="font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto leading-relaxed">
            {playwrightSnippet}
          </pre>
        </div>
      </div>

      {/* 3. GitHub Actions Pipeline Recipe */}
      <div id="github-actions" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          GitHub Actions Workflow Variable
        </h2>
        <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 shadow-inner">
          <pre className="font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto leading-relaxed">
            {githubActionsSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
}
