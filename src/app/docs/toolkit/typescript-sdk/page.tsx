'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export default function TypeScriptSdkPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const installSnippet = `npm install @playground-api/sdk`;

  const codeSnippet = `import { PlaygroundClient } from '@playground-api/sdk';

// 1. Initialize client with optional custom session identity
const client = new PlaygroundClient({
  baseUrl: '${publicApiUrl}',
  identity: 'my-custom-test-session', // Optional: defaults to cookie session
});

// 2. Strongly typed resource calls
async function main() {
  // Query posts with automatic filtering and sorting types
  const { data: posts, pagination } = await client.posts.list({
    limit: 5,
    sort: 'id',
    order: 'desc',
  });
  console.log('Posts:', posts.length, 'Total:', pagination.total);

  // Create stateful record
  const newPost = await client.posts.create({
    title: 'Strongly Typed SDK Post',
    body: 'Zero-config mock data with full autocomplete!',
    userId: 1,
  });
  console.log('Created:', newPost.id);
}

main();`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:code-bold" className="w-3.5 h-3.5" />
          <span>Developer Toolkit</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Official TypeScript SDK
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          A lightweight, isomorphic TypeScript SDK with built-in retry handling, automated session identity management, and complete end-to-end type safety for Node.js, Next.js, and browser runtimes.
        </p>
      </div>

      {/* 2. Installation Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900">Install via NPM or Yarn</h3>
        <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 font-mono text-xs text-indigo-300 flex items-center justify-between">
          <span>{installSnippet}</span>
        </div>
      </div>

      {/* 3. Usage Code Snippet */}
      <div id="usage" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Basic Usage Example
        </h2>
        <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 shadow-inner">
          <pre className="font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto leading-relaxed">
            {codeSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
}
