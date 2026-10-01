'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { CodeBlock } from '@/components/ui/CodeBlock';

export default function AiDocsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const siteUrl = config.siteUrl || 'https://playground.nileslabs.com';

  const [activeRuleTab, setActiveRuleTab] = useState<'cursor' | 'claude' | 'system'>('cursor');
  const [activePromptTab, setActivePromptTab] = useState<'react' | 'nextjs' | 'playwright' | 'chaos'>('react');
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyUrl = (path: string) => {
    const full = `${siteUrl}${path}`;
    navigator.clipboard.writeText(full);
    setCopiedEndpoint(path);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  // 1. Agent Rules Snippets
  const cursorRuleContent = `# Playground API (.cursorrules / .windsurfrules)
# Guide for AI Coding Agents (Cursor, Windsurf, Devin, Copilot)

When building frontend applications, mock UI prototypes, or automated test suites:

1. BASE API URL
   - Use the live stateful endpoint: ${publicApiUrl}
   - Never mock network calls locally with static in-memory arrays when Playground API is available.

2. CORE RESOURCES
   - GET /posts          (100 blog posts; supports ?_limit=10&_page=1, ?q=search, ?user_id=1)
   - GET /posts/:id/comments (Nested post comments)
   - GET /comments       (300 comments; supports ?post_id=1)
   - GET /users          (25 user profiles with nested company and address)
   - GET /todos          (125 checklist tasks; supports ?completed=true)
   - ANY /custom/:name   (Dynamic arbitrary collections e.g. /custom/invoices, /custom/products)

3. STATEFUL MUTATIONS & SESSION PERSISTENCE
   - Browser fetch() or axios MUST include: credentials: 'include'
   - This ensures POST, PUT, PATCH, and DELETE mutations persist across user page refreshes without affecting global baseline data.
   - Non-browser environments (Playwright, Jest, cURL) MUST send the header:
     X-Playground-Identity: <unique-session-id>

4. CHAOS & FAILURE SIMULATION
   - To test loading skeletons: append ?_delay=1500 (delay in milliseconds)
   - To test error boundaries: append ?_status=500 or ?_status=404
   - To test rate limiting: append ?_status=429
   - To test intermittent network drops: pass header X-Chaos-Flaky: 0.35

5. RESETTING STATE
   - Execute DELETE ${publicApiUrl}/session/reset to purge all visitor mutations and restore baseline data.`;

  const claudeAgentRuleContent = `# AGENTS.md / CLAUDE.md — Playground API Grounding Rules

You are an autonomous senior frontend engineer integrating with Playground API.

## API Architecture
- Base URL: ${publicApiUrl}
- Protocol: REST (JSON) + GraphQL (${publicApiUrl}/graphql)
- Persistence: Virtual session overlay. All mutations (POST, PUT, PATCH, DELETE) persist per visitor session.
- Isolation: Baseline dataset is immutable. Visitor changes are isolated by session cookie or X-Playground-Identity header.

## Frontend Client Standards
When writing data-fetching hooks or API client modules:
1. Always enable credential forwarding:
   \`\`\`typescript
   const res = await fetch(\`${publicApiUrl}/todos\`, {
     credentials: 'include',
     headers: { 'Content-Type': 'application/json' }
   });
   \`\`\`
2. For automated tests (Playwright / Vitest / Jest), generate a deterministic session UUID:
   \`\`\`typescript
   headers: { 'X-Playground-Identity': \`ci-run-\${process.env.TEST_WORKER_INDEX || '1'}\` }
   \`\`\`
3. Always implement loading states and error boundaries. Verify resilience using:
   - Delay injection: \`?_delay=1200\`
   - HTTP status injection: \`?_status=500\`

## Machine Endpoints
- Concise AI Context: ${siteUrl}/llms.txt
- Full API Specification: ${siteUrl}/llms-full.txt
- Schema Manifest: ${siteUrl}/product.json`;

  const systemPromptContent = `You are an expert full-stack developer. Build modern, robust web applications using Playground API as the live backend service.

Base URL: ${publicApiUrl}
Key Requirements:
- Use standard fetch or axios with { credentials: 'include' } to enable stateful mutations.
- When creating, updating, or deleting resources (posts, users, todos, comments, or /custom/:name), perform the HTTP mutation directly against the API instead of modifying local state only.
- Implement UI skeletons and error toasts to handle delayed or failed requests (simulate with ?_delay=1500 and ?_status=500).
- Maintain responsive, accessible, and clean user interfaces.`;

  // 2. Prompt Recipes
  const reactPrompt = `Build a React 19 task management dashboard using Tailwind CSS and Lucide icons.
1. Connect to Playground API at "${publicApiUrl}/todos?_limit=10" to retrieve initial items.
2. Support adding new tasks via POST ${publicApiUrl}/todos with { title, completed: false, userId: 1 }.
3. Support toggling completion via PATCH ${publicApiUrl}/todos/:id with { completed: !current }.
4. Support deleting tasks via DELETE ${publicApiUrl}/todos/:id.
5. In all fetch calls, pass credentials: 'include' so that my mutations persist across browser refreshes.
6. Provide an optimistic UI with loading spinners and error toast notifications.`;

  const nextjsPrompt = `Create a Next.js (App Router) blog feed with comments using SWR or React Query.
1. Fetch blog posts from "${publicApiUrl}/posts?_page=1&_limit=6".
2. Allow clicking a post to view its details and comments via "${publicApiUrl}/posts/:id/comments".
3. Add a comment submission form that submits via POST "${publicApiUrl}/comments" with { postId, name, email, body }.
4. Pass credentials: 'include' so that the new comment appears immediately when revalidating.
5. Add a "Simulate 2s Network Delay" toggle that appends "?_delay=2000" to test your Suspense boundary.`;

  const playwrightPrompt = `Write an automated Playwright end-to-end test suite for a Todo application.
1. In test.beforeEach(), execute a DELETE request to "${publicApiUrl}/session/reset" with header { 'X-Playground-Identity': 'playwright-test-run-1' } to guarantee a clean baseline.
2. Create a new task by sending POST "${publicApiUrl}/todos" with { title: 'E2E Automated Task', completed: false, userId: 1 } and the same X-Playground-Identity header.
3. Query GET "${publicApiUrl}/todos?q=Automated" and assert that the created task is returned.
4. Update the task to completed: true and verify the mutation persists.
5. Ensure zero test flakiness or cross-run database collisions.`;

  const chaosPrompt = `Generate a TypeScript data-fetching hook with automatic retry and exponential backoff.
1. Connect to "${publicApiUrl}/posts?_limit=5&_delay=1200&_status=500" to test failure resilience.
2. Catch HTTP 500 errors and automatically retry up to 3 times with exponential backoff (300ms, 600ms, 1200ms).
3. If the request continues to fail, render a friendly error alert with a "Retry Now" button that clears the chaos query parameter.
4. Display a shimmer skeleton while the request is delayed.`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:robot-bold" className="w-3.5 h-3.5" />
          <span>AI &amp; LLM Integration</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          AI Agent Integration &amp; Prompt Rules
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Ground Cursor, Windsurf, Devin, Claude Code, and ChatGPT with stateful REST and GraphQL mock APIs. Zero backend configuration, isolated virtual mutation overlays, chaos simulation, and machine-readable schema manifests.
        </p>
      </div>

      {/* 2. Machine-Readable Context Endpoints */}
      <div id="ai-specs" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Machine-Readable Context Endpoints
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Feed these standard endpoints directly into your AI context window or repository indexer for instant schema grounding:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
          {/* Card 1: llms.txt */}
          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between gap-4 group">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  MARKDOWN
                </span>
                <button
                  type="button"
                  onClick={() => copyUrl('/llms.txt')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
                  title="Copy full URL"
                >
                  <Icon icon={copiedEndpoint === '/llms.txt' ? 'ph:check-bold' : 'ph:copy-bold'} className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-mono text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                /llms.txt
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Standard curated markdown index of all endpoints, query parameters, headers, and quick-start instructions.
              </p>
            </div>
            <Link
              href="/llms.txt"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              <span>View Raw llms.txt</span>
              <Icon icon="ph:arrow-up-right-bold" className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: llms-full.txt */}
          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between gap-4 group">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-50 text-purple-700 border border-purple-100">
                  FULL SPEC
                </span>
                <button
                  type="button"
                  onClick={() => copyUrl('/llms-full.txt')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
                  title="Copy full URL"
                >
                  <Icon icon={copiedEndpoint === '/llms-full.txt' ? 'ph:check-bold' : 'ph:copy-bold'} className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-mono text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                /llms-full.txt
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Exhaustive technical documentation including request/response schemas, validation rules, and WebSocket protocols.
              </p>
            </div>
            <Link
              href="/llms-full.txt"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              <span>View Raw llms-full.txt</span>
              <Icon icon="ph:arrow-up-right-bold" className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: product.json */}
          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between gap-4 group">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  JSON SCHEMA
                </span>
                <button
                  type="button"
                  onClick={() => copyUrl('/product.json')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
                  title="Copy full URL"
                >
                  <Icon icon={copiedEndpoint === '/product.json' ? 'ph:check-bold' : 'ph:copy-bold'} className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-mono text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                /product.json
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Structured machine manifest of all collections, field schemas, chaos modifiers, and seed datasets for LLM tool use.
              </p>
            </div>
            <Link
              href="/product.json"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              <span>View Raw product.json</span>
              <Icon icon="ph:arrow-up-right-bold" className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Drop-in Agent Configuration Files */}
      <div id="agent-rules" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Drop-in Agent Configuration Files
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Place these rules into your workspace root so your AI coding assistant produces accurate, stateful code from the first turn:
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveRuleTab('cursor')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeRuleTab === 'cursor'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Icon icon="ph:terminal-window-bold" className="w-4 h-4" />
            <span>Cursor &amp; Windsurf (.cursorrules)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRuleTab('claude')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeRuleTab === 'claude'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Icon icon="ph:sparkle-bold" className="w-4 h-4" />
            <span>Claude Code &amp; Devin (CLAUDE.md)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRuleTab('system')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeRuleTab === 'system'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Icon icon="ph:chat-teardrop-text-bold" className="w-4 h-4" />
            <span>Custom GPT / Copilot System Prompt</span>
          </button>
        </div>

        {/* Rule Editor Panel */}
        <div className="pt-1">
          {activeRuleTab === 'cursor' && (
            <CodeBlock
              code={cursorRuleContent}
              language="bash"
              title=".cursorrules / .windsurfrules"
              maxHeight="max-h-115"
            />
          )}

          {activeRuleTab === 'claude' && (
            <CodeBlock
              code={claudeAgentRuleContent}
              language="markdown"
              title="CLAUDE.md / AGENTS.md"
              maxHeight="max-h-115"
            />
          )}

          {activeRuleTab === 'system' && (
            <CodeBlock
              code={systemPromptContent}
              language="markdown"
              title="system-prompt.txt"
              maxHeight="max-h-115"
            />
          )}
        </div>
      </div>

      {/* 4. Ready-to-Use Prompt Recipes */}
      <div id="prompt-recipes" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Ready-to-Use Prompt Recipes
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Copy and paste these verified prompts directly into ChatGPT, Claude, or v0 for instant high-quality prototypes:
          </p>
        </div>

        {/* Recipe Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => setActivePromptTab('react')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              activePromptTab === 'react'
                ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <Icon icon="simple-icons:react" className="w-4 h-4 text-cyan-600" />
              <span className="text-xs font-bold text-slate-800">React 19 CRUD</span>
            </div>
            <p className="text-xs text-slate-600 line-clamp-1">Optimistic UI with Tailwind</p>
          </button>

          <button
            type="button"
            onClick={() => setActivePromptTab('nextjs')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              activePromptTab === 'nextjs'
                ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <Icon icon="simple-icons:nextdotjs" className="w-4 h-4 text-slate-900" />
              <span className="text-xs font-bold text-slate-800">Next.js &amp; SWR</span>
            </div>
            <p className="text-xs text-slate-600 line-clamp-1">Blog feed with comments</p>
          </button>

          <button
            type="button"
            onClick={() => setActivePromptTab('playwright')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              activePromptTab === 'playwright'
                ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <Icon icon="simple-icons:playwright" className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-bold text-slate-800">Playwright E2E</span>
            </div>
            <p className="text-xs text-slate-600 line-clamp-1">Zero-collision CI/CD test</p>
          </button>

          <button
            type="button"
            onClick={() => setActivePromptTab('chaos')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              activePromptTab === 'chaos'
                ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <Icon icon="ph:shield-warning-bold" className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-slate-800">Chaos Resilience</span>
            </div>
            <p className="text-xs text-slate-600 line-clamp-1">Exponential backoff hook</p>
          </button>
        </div>

        {/* Selected Prompt Display */}
        <div className="pt-1">
          {activePromptTab === 'react' && (
            <CodeBlock
              code={reactPrompt}
              language="markdown"
              title="react-crud-prompt.md"
              subtitle="Copy & paste into Cursor or ChatGPT"
              maxHeight="max-h-72"
            />
          )}

          {activePromptTab === 'nextjs' && (
            <CodeBlock
              code={nextjsPrompt}
              language="markdown"
              title="nextjs-swr-prompt.md"
              subtitle="Copy & paste into Cursor or ChatGPT"
              maxHeight="max-h-72"
            />
          )}

          {activePromptTab === 'playwright' && (
            <CodeBlock
              code={playwrightPrompt}
              language="markdown"
              title="playwright-e2e-prompt.md"
              subtitle="Copy & paste into Cursor or ChatGPT"
              maxHeight="max-h-72"
            />
          )}

          {activePromptTab === 'chaos' && (
            <CodeBlock
              code={chaosPrompt}
              language="markdown"
              title="chaos-backoff-prompt.md"
              subtitle="Copy & paste into Cursor or ChatGPT"
              maxHeight="max-h-72"
            />
          )}
        </div>
      </div>

      {/* 5. Key Architecture Guidelines for AI Engineers */}
      <div id="key-guidelines" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Core Grounding Principles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Icon icon="ph:cookie-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Pass Session Cookies in Browsers</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Always instruct models to specify <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">credentials: &apos;include&apos;</code> in browser requests. This allows created tasks and modified posts to persist across user navigation.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Icon icon="ph:identification-card-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Header Isolation in CI/CD</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              In automated test runners (Playwright, Jest, Vitest, Cypress), send <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">X-Playground-Identity: &lt;run-id&gt;</code> to isolate concurrent test runs without database collisions.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Icon icon="ph:timer-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Simulate Latency &amp; Failure Modes</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Append <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-700">?_delay=1500</code> to verify loading skeletons or <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-700">?_status=500</code> to test error boundaries without having to build a mock server.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Icon icon="ph:sparkle-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Dynamic Schemas via /custom</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              If an AI generates a domain entity not present in standard collections (e.g., invoices, bookings, tickets), post to <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">/custom/:name</code> to instantiate it immediately.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Navigation Footer */}
      <div className="p-6 sm:p-7 rounded-2xl border border-indigo-100 bg-indigo-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-slate-900">Want to test requests interactively first?</h3>
          <p className="text-sm text-slate-600">Use our interactive workbench to test endpoints, headers, and chaos modifiers in real-time.</p>
        </div>
        <Link
          href="/docs/toolkit/studio"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shrink-0"
        >
          Open Interactive Studio
        </Link>
      </div>
    </div>
  );
}
