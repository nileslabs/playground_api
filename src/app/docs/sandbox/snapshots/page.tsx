'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';

export default function SandboxSnapshotsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const [activeTab, setActiveTab] = useState<'curl' | 'playwright'>('curl');

  const sampleSnapshotJson = `{
  "exportedAt": "2026-09-29T17:00:00.000Z",
  "sessionId": "usr_session_8f4a12",
  "data": {
    "posts": [
      {
        "id": 101,
        "title": "E2E Fixture: Bug Repro in Checkout",
        "body": "User cart was not cleared after payment intent confirmation.",
        "userId": 1,
        "createdAt": "2026-09-29T16:45:00.000Z"
      }
    ],
    "comments": [
      {
        "id": 301,
        "postId": 101,
        "name": "QA Automation Engineer",
        "email": "qa@example.com",
        "body": "Reproduced on mobile Safari iOS 19."
      }
    ],
    "custom_invoices": [
      {
        "id": 1,
        "invoiceNumber": "INV-2026-0042",
        "amount": 499.00,
        "status": "PAID"
      }
    ]
  }
}`;

  const cliCodeSnippet = `# 1. Export active sandbox state to a local JSON file
curl -X GET "${publicApiUrl}/session/export" \\
  -H "X-Playground-Identity: test-runner-1" \\
  -o ./fixtures/regression-test-seed.json

# 2. Restore the fixture in another test run or teammate's environment
curl -X POST "${publicApiUrl}/session/import" \\
  -H "Content-Type: application/json" \\
  -H "X-Playground-Identity: test-runner-2" \\
  -d @./fixtures/regression-test-seed.json`;

  const playwrightCodeSnippet = `// e2e/fixtures-setup.spec.ts
import { test, expect } from '@playwright/test';
import fixtureData from './fixtures/regression-test-seed.json';

test.describe('Order Checkout Regression Suite', () => {
  test.beforeEach(async ({ request }) => {
    // Restore pre-seeded state into isolated runner sandbox
    const res = await request.post('${publicApiUrl}/session/import', {
      headers: {
        'Content-Type': 'application/json',
        'X-Playground-Identity': 'order-checkout-worker',
      },
      data: fixtureData,
    });
    expect(res.ok()).toBeTruthy();
  });

  test('should display pre-seeded invoice', async ({ page }) => {
    await page.goto('/invoices');
    await expect(page.locator('text=INV-2026-0042')).toBeVisible();
  });
});`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:file-arrow-down-bold" className="w-3.5 h-3.5" />
          <span>Sandbox State &amp; Health</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          JSON State Snapshots (Export &amp; Import)
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Capture your active session state—created records, modified posts, custom dynamic collections, and shopping carts—into portable JSON fixtures. Share reproducible bug states with teammates or preload seed datasets into CI/CD pipelines.
        </p>
      </div>

      {/* 2. Core Value Highlights */}
      <div id="snapshot-benefits" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Why Use State Snapshots?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Icon icon="ph:bug-beetle-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">1-Click Bug Reproduction</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              When QA encounters an edge case, they can export their exact session state and attach the JSON file to a ticket for developers to restore instantly.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Icon icon="ph:database-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Deterministic CI Fixtures</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Preload baseline test data (users, catalog items, completed orders) before running end-to-end tests without executing dozens of setup API calls.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Icon icon="ph:share-network-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Cross-Team Collaboration</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Export mock data created by UX designers and import it directly into staging or mobile simulator environments.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Interactive Step 1: Export Current Sandbox State */}
      <div id="export-snapshot" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Step 1: Export Active Session Snapshot
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Send a <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-bold">GET /session/export</code> request to extract all mutated records and custom collections from your current visitor overlay:
          </p>
        </div>

        <InteractiveConsole
          method="GET"
          path="/session/export"
          title="Export Session Snapshot"
          description="Downloads the active memory overlay for your browser session"
        />
      </div>

      {/* 4. Interactive Step 2: Import Snapshot */}
      <div id="import-snapshot" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Step 2: Restore Snapshot into Sandbox
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Post snapshot JSON to <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-bold">/session/import</code> to immediately apply fixture records to your session:
          </p>
        </div>

        <InteractiveConsole
          method="POST"
          path="/session/import"
          title="Import Session Snapshot"
          description="Overwrites or seeds your active session with custom fixture state"
          initialBody={sampleSnapshotJson}
        />
      </div>

      {/* 5. Programmatic Export & Import in Automation */}
      <div id="automation" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Automated CI/CD Fixture Loading
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Easily script snapshot import and export within local shell scripts or Playwright / Cypress pipelines:
          </p>
        </div>

        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('curl')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'curl'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            cURL Scripts
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('playwright')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'playwright'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Playwright Test Setup
          </button>
        </div>

        <CodeBlock
          code={activeTab === 'curl' ? cliCodeSnippet : playwrightCodeSnippet}
          language={activeTab === 'curl' ? 'bash' : 'typescript'}
          title={activeTab === 'curl' ? 'snapshot-cli.sh' : 'e2e-fixtures.spec.ts'}
          maxHeight="max-h-96"
        />
      </div>

      {/* 6. Navigation Footer */}
      <div className="p-6 sm:p-7 rounded-2xl border border-indigo-100 bg-indigo-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-slate-900">Running automated parallel tests?</h3>
          <p className="text-sm text-slate-600">Learn how to isolate parallel CI test workers using custom session identities.</p>
        </div>
        <Link
          href="/docs/sandbox/ci-cd-identity"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shrink-0"
        >
          View Headless CI/CD Guide
        </Link>
      </div>
    </div>
  );
}
