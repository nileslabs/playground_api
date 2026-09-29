'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { CodeBlock } from '@/components/ui/CodeBlock';

export default function TypeScriptSdkPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const [activeInstallTab, setActiveInstallTab] = useState<'npm' | 'pnpm' | 'yarn' | 'bun'>('npm');
  const [activeUsageTab, setActiveUsageTab] = useState<'browser' | 'node' | 'retry'>('browser');
  const [activeResourceTab, setActiveResourceTab] = useState<'posts' | 'auth' | 'custom' | 'payments'>('posts');

  const installSnippets = {
    npm: 'npm install playground-api',
    pnpm: 'pnpm add playground-api',
    yarn: 'yarn add playground-api',
    bun: 'bun add playground-api',
  };

  const usageSnippets = {
    browser: `import { PlaygroundClient } from 'playground-api';

// Browser client automatically forwards session cookies
const client = new PlaygroundClient({
  baseUrl: '${publicApiUrl}',
  credentials: 'include', // Preserves mutations across user browser refreshes
});

// Fetch posts with type-safe query parameters
const { data, pagination } = await client.posts.list({
  page: 1,
  limit: 10,
  sort: 'id',
  order: 'desc',
});

console.log('Posts:', data);
console.log('Total available:', pagination.total);`,

    node: `import { PlaygroundClient } from 'playground-api';

// In Node.js, CLI scripts, or automated CI/CD pipelines:
// Provide an explicit session identity to isolate mutations
const client = new PlaygroundClient({
  baseUrl: '${publicApiUrl}',
  identity: \`ci-pipeline-\${process.env.BUILD_ID || 'local'}\`,
});

// Create a stateful task isolated to this run
const todo = await client.todos.create({
  title: 'Automated CI Seed Task',
  completed: false,
  userId: 1,
});

console.log('Created todo ID:', todo.id);`,

    retry: `import { PlaygroundClient } from 'playground-api';

// Configure intelligent network retry with exponential backoff
const client = new PlaygroundClient({
  baseUrl: '${publicApiUrl}',
  timeout: 5000, // 5s timeout
  retry: {
    retries: 3,
    factor: 2,
    minTimeout: 250, // 250ms -> 500ms -> 1000ms
    maxTimeout: 2000,
    statusCodes: [408, 429, 500, 502, 503, 504],
  },
});`,
  };

  const resourceSnippets = {
    posts: `// 1. List with search, filtering, and pagination
const posts = await client.posts.list({
  q: 'technology',
  userId: 1,
  page: 1,
  limit: 5,
});

// 2. Fetch relational comments for a post
const comments = await client.posts.getComments(posts.data[0].id);

// 3. Create a stateful blog post
const created = await client.posts.create({
  title: 'Shipping with Playground API',
  body: 'Full-stack testing with zero backend friction.',
  userId: 1,
});

// 4. Update and Delete
await client.posts.patch(created.id, { title: 'Updated Title' });
await client.posts.delete(created.id);`,

    auth: `// 1. Authenticate with seeded credentials
const authSession = await client.auth.login({
  username: 'kminchelle',
  password: 'password123',
});

console.log('Access Token:', authSession.token);
console.log('Logged in user:', authSession.user.name);

// 2. Query protected current user profile
const profile = await client.auth.me();

// 3. Rotate tokens with refresh flow
const refreshed = await client.auth.refreshToken(authSession.refreshToken);`,

    custom: `// 1. Target any dynamic resource collection on the fly
const invoices = client.custom('invoices');

// 2. Insert arbitrary JSON records without schema migrations
const newInvoice = await invoices.create({
  invoiceNumber: 'INV-2026-001',
  amount: 2499.50,
  currency: 'USD',
  clientName: 'Acme Corporation',
  status: 'PENDING',
});

// 3. Query with instant filtering and search
const pending = await invoices.list({
  filter: { status: 'PENDING' },
  sort: 'amount',
  order: 'desc',
});`,

    payments: `// 1. Instantiate Payment Intent with test amount
const intent = await client.payments.createIntent({
  amount: 4999, // $49.99 in cents
  currency: 'usd',
  customerId: 'cust_101',
});

// 2. Confirm intent with mock 3DS test card
const confirmed = await client.payments.confirmIntent(intent.id, {
  paymentMethod: 'pm_card_threeDSecure2Required',
});

console.log('Intent status:', confirmed.status); // 'requires_action' or 'succeeded'`,
  };

  const errorHandlingSnippet = `import { PlaygroundClient, PlaygroundApiError } from 'playground-api';

const client = new PlaygroundClient({ baseUrl: '${publicApiUrl}' });

try {
  await client.posts.get(999999);
} catch (error) {
  if (error instanceof PlaygroundApiError) {
    console.error('HTTP Status:', error.status);       // 404
    console.error('Error Code:', error.code);           // 'RESOURCE_NOT_FOUND'
    console.error('API Message:', error.message);       // 'Post with id 999999 does not exist'
    console.error('Validation Errors:', error.details); // Field-level error array if 422
  } else {
    console.error('Unexpected network failure:', error);
  }
}`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:code-bold" className="w-3.5 h-3.5" />
          <span>Developer Toolkit</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Official TypeScript SDK
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          An isomorphic, zero-dependency client library providing end-to-end type safety, automatic session identity persistence, intelligent retry backoff, and full autocomplete across browser, Node.js, and Next.js runtimes.
        </p>
      </div>

      {/* 2. Installation Banner */}
      <div id="installation" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Installation
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Add <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-bold">playground-api</code> to your application with your favorite package manager:
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            {(['npm', 'pnpm', 'yarn', 'bun'] as const).map((mgr) => (
              <button
                key={mgr}
                type="button"
                onClick={() => setActiveInstallTab(mgr)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeInstallTab === mgr
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {mgr}
              </button>
            ))}
          </div>

          <CodeBlock
            code={installSnippets[activeInstallTab]}
            language="bash"
            title="terminal"
            showLineNumbers={false}
          />
        </div>

        {/* CDN alternative note */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start gap-3">
          <Icon icon="ph:info-bold" className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            <strong>Browser CDN Alternative:</strong> You can also load the client bundle directly via script tag from{' '}
            <code className="font-mono text-xs bg-white border border-slate-200 px-1.5 py-0.5 rounded text-indigo-600">
              {publicApiUrl}/downloads/playground-api.js
            </code>{' '}
            which exposes <code className="font-mono text-xs text-slate-800 font-bold">window.PlaygroundClient</code>.
          </p>
        </div>
      </div>

      {/* 3. Client Initialization */}
      <div id="initialization" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Client Initialization &amp; Session Management
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Initialize the client according to your application environment:
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveUsageTab('browser')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeUsageTab === 'browser'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Icon icon="ph:globe-bold" className="w-4 h-4" />
            <span>Browser &amp; React SPA</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveUsageTab('node')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeUsageTab === 'node'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Icon icon="ph:server-bold" className="w-4 h-4" />
            <span>Node.js &amp; CI/CD Pipelines</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveUsageTab('retry')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeUsageTab === 'retry'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Icon icon="ph:arrows-clockwise-bold" className="w-4 h-4" />
            <span>Retry &amp; Timeout Config</span>
          </button>
        </div>

        <CodeBlock
          code={usageSnippets[activeUsageTab]}
          language="typescript"
          title="client.ts"
          maxHeight="max-h-96"
        />
      </div>

      {/* 4. Core Resource Modules */}
      <div id="resource-modules" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Typed Resource Operations
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Every standard API resource is exposed as a strongly typed submodule on the client:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => setActiveResourceTab('posts')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              activeResourceTab === 'posts'
                ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
            }`}
          >
            <span className="text-xs font-bold text-slate-800 block">Posts &amp; Comments</span>
            <span className="text-xs text-slate-500 font-mono mt-0.5 block">client.posts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveResourceTab('auth')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              activeResourceTab === 'auth'
                ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
            }`}
          >
            <span className="text-xs font-bold text-slate-800 block">Authentication</span>
            <span className="text-xs text-slate-500 font-mono mt-0.5 block">client.auth</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveResourceTab('custom')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              activeResourceTab === 'custom'
                ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
            }`}
          >
            <span className="text-xs font-bold text-slate-800 block">Custom Collections</span>
            <span className="text-xs text-slate-500 font-mono mt-0.5 block">client.custom(:name)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveResourceTab('payments')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              activeResourceTab === 'payments'
                ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
            }`}
          >
            <span className="text-xs font-bold text-slate-800 block">Payments &amp; 3DS</span>
            <span className="text-xs text-slate-500 font-mono mt-0.5 block">client.payments</span>
          </button>
        </div>

        <CodeBlock
          code={resourceSnippets[activeResourceTab]}
          language="typescript"
          title={`${activeResourceTab}-operations.ts`}
          maxHeight="max-h-96"
        />
      </div>

      {/* 5. Error Handling */}
      <div id="error-handling" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Error Handling &amp; Validation Details
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Failed HTTP calls throw typed <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-bold">PlaygroundApiError</code> exceptions with status codes, error identifiers, and field-level validation details:
          </p>
        </div>

        <CodeBlock
          code={errorHandlingSnippet}
          language="typescript"
          title="error-handling.ts"
          maxHeight="max-h-80"
        />
      </div>

      {/* 6. Navigation Footer */}
      <div className="p-6 sm:p-7 rounded-2xl border border-indigo-100 bg-indigo-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-slate-900">Need cURL, Python, or Go code instead?</h3>
          <p className="text-sm text-slate-600">Generate copy-pasteable request snippets in your language of choice.</p>
        </div>
        <Link
          href="/docs/toolkit/code-generators"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shrink-0"
        >
          View Code Generators
        </Link>
      </div>
    </div>
  );
}
