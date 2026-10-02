'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { DocWorkflowDiagram } from '@/components/docs/DocWorkflowDiagram';

export default function CiCdIdentityPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const [activeTab, setActiveTab] = useState<'playwright' | 'cypress' | 'vitest'>('playwright');

  const runnerSnippets = {
    playwright: `// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true, // Run test files in parallel
  workers: process.env.CI ? 4 : undefined,
  use: {
    baseURL: 'http://localhost:3000',
    extraHTTPHeaders: {
      // Each worker gets a dedicated, isolated sandbox identity!
      'X-Playground-Identity': \`ci-worker-\${process.env.TEST_WORKER_INDEX || '0'}\`,
    },
  },
});

// e2e/posts.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Blog CRUD Flow', () => {
  // Reset sandbox before each test to guarantee clean baseline
  test.beforeEach(async ({ request }) => {
    await request.delete('${publicApiUrl}/session/reset', {
      headers: {
        'X-Playground-Identity': \`ci-worker-\${process.env.TEST_WORKER_INDEX || '0'}\`,
      },
    });
  });

  test('creates and verifies new post', async ({ page }) => {
    await page.goto('/posts/new');
    await page.fill('input[name="title"]', 'Automated E2E Post');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Automated E2E Post')).toBeVisible();
  });
});`,

    cypress: `// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    env: {
      // Unique identity based on process or worker index
      playgroundIdentity: \`cypress-run-\${Date.now()}\`,
    },
  },
});

// cypress/support/e2e.ts
beforeEach(() => {
  // Send custom identity header with cy.request
  const identity = Cypress.env('playgroundIdentity');
  cy.request({
    method: 'DELETE',
    url: '${publicApiUrl}/session/reset',
    headers: { 'X-Playground-Identity': identity },
  });
});`,

    vitest: `// vitest.config.ts / jest.setup.ts
import { beforeAll, beforeEach } from 'vitest';

const RUNNER_IDENTITY = \`vitest-\${process.env.VITEST_POOL_ID || '1'}\`;

beforeEach(async () => {
  // Purge any residual mutations before running unit/integration suite
  await fetch('${publicApiUrl}/session/reset', {
    method: 'DELETE',
    headers: { 'X-Playground-Identity': RUNNER_IDENTITY },
  });
});`,
  };

  const githubActionsSnippet = `# .github/workflows/e2e-matrix.yml
name: Parallel E2E Tests
on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3, 4] # 4 parallel jobs
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Run Playwright with Isolated Session Identity
        env:
          # Unique identity combining run ID and matrix shard
          PLAYGROUND_IDENTITY: github-\${{ github.run_id }}-shard-\${{ matrix.shard }}
        run: npx playwright test --shard=\${{ matrix.shard }}/4`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:git-commit-bold" className="w-3.5 h-3.5" />
          <span>Sandbox State &amp; Health</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Headless CI/CD Sandboxing with Custom Identity
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Execute dozens of parallel automated test jobs without state collisions, database locks, or cross-test data pollution. Pass a unique <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-bold">X-Playground-Identity</code> header to give every automated runner its own isolated memory sandbox.
        </p>

        {/* Workflow Diagram */}
        <DocWorkflowDiagram
          src="/images/docs/workflows/cicd-parallel-isolation.jpg"
          alt="Playground API Parallel Test Runner Isolation with Custom Identity Headers Workflow Diagram"
          title="CI/CD Parallel Test Runner Isolation Architecture"
          subtitle="Sharded matrix runners (Playwright / Cypress) execute concurrently with zero database locks or cross-test mutations."
          badge="DevOps Concurrency"
          steps={[
            {
              number: 1,
              title: 'Parallel Runner Sharding',
              desc: 'CI matrices spawn parallel runner workers (e.g. GitHub Actions matrix shards 1-4).',
              badge: 'Sharded CI',
            },
            {
              number: 2,
              title: 'Identity Header Routing',
              desc: 'Pass X-Playground-Identity to guarantee private isolated sandboxes for each job.',
              badge: 'X-Playground-Identity',
            },
            {
              number: 3,
              title: 'Deterministic Tear Down',
              desc: 'Call DELETE /session/reset before each suite for instantaneous baseline recovery.',
              badge: 'Zero Flakiness',
            },
          ]}
        />
      </div>

      {/* 2. Architecture Comparison */}
      <div id="architecture" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Shared Database vs. Virtual Session Sandboxing
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
          {/* Card A: Problem */}
          <div className="p-6 rounded-2xl border border-rose-200 bg-rose-50/30 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <Icon icon="ph:x-circle-bold" className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-base text-slate-900">Traditional Shared Staging DB</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <Icon icon="ph:warning-circle-bold" className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span><strong>Flaky Collisions:</strong> Worker A deletes item #1 while Worker B is asserting its existence.</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon icon="ph:warning-circle-bold" className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span><strong>Serialized Runs:</strong> Tests must run sequentially or spend minutes rebuilding databases.</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon icon="ph:warning-circle-bold" className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span><strong>High Hosting Costs:</strong> Requires spinning up dedicated Docker containers per CI branch.</span>
              </li>
            </ul>
          </div>

          {/* Card B: Solution */}
          <div className="p-6 rounded-2xl border border-emerald-200 bg-emerald-50/30 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Icon icon="ph:check-circle-bold" className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-base text-slate-900">Playground Virtual Overlays</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <Icon icon="ph:check-bold" className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Zero Cross-Talk:</strong> Each worker gets its own isolated memory overlay on top of pristine data.</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon icon="ph:check-bold" className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Instant Reset:</strong> Call <code className="font-mono text-xs">DELETE /session/reset</code> to wipe mutations in 10ms.</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon icon="ph:check-bold" className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Infinite Parallelism:</strong> Scale to 100+ concurrent matrix runners with zero setup.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Test Runner Setup */}
      <div id="test-runners" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Configuring Test Runners (Playwright, Cypress, Vitest)
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Inject the <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-bold">X-Playground-Identity</code> header into your test configuration:
          </p>
        </div>

        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('playwright')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'playwright'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Icon icon="simple-icons:playwright" className="w-4 h-4 text-purple-600" />
            <span>Playwright Multi-Worker</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cypress')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'cypress'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Icon icon="simple-icons:cypress" className="w-4 h-4 text-emerald-600" />
            <span>Cypress E2E</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('vitest')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'vitest'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Icon icon="simple-icons:vitest" className="w-4 h-4 text-amber-600" />
            <span>Vitest / Jest Setup</span>
          </button>
        </div>

        <CodeBlock
          code={runnerSnippets[activeTab]}
          language="typescript"
          title={`${activeTab}-config.ts`}
          maxHeight="max-h-115"
        />
      </div>

      {/* 4. GitHub Actions Matrix Pipeline */}
      <div id="github-actions" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            GitHub Actions Parallel Sharding Workflow
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Distribute end-to-end tests across multiple cloud runners simultaneously:
          </p>
        </div>

        <CodeBlock
          code={githubActionsSnippet}
          language="yaml"
          title=".github/workflows/e2e-matrix.yml"
          maxHeight="max-h-96"
        />
      </div>

      {/* 5. Navigation Footer */}
      <div className="p-6 sm:p-7 rounded-2xl border border-indigo-100 bg-indigo-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-slate-900">Testing on mobile devices?</h3>
          <p className="text-sm text-slate-600">Scan a QR code to sync your active desktop test session directly to iOS or Android browsers.</p>
        </div>
        <Link
          href="/docs/sandbox/mobile-qr-sync"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shrink-0"
        >
          View Mobile QR Sync Guide
        </Link>
      </div>
    </div>
  );
}
