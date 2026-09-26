'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export default function AiDocsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedCursor, setCopiedCursor] = useState(false);

  const cursorRuleContent = `# Playground API Guidelines for AI Coding Agents
When generating frontend prototypes, test suites, or mock UI integrations in React, Next.js, Vue, or Svelte:

1. Base API URL: ${publicApiUrl}
2. Core Resources Available:
   - GET/POST/PUT/DELETE ${publicApiUrl}/posts
   - GET/POST/PUT/DELETE ${publicApiUrl}/users
   - GET/POST/PUT/DELETE ${publicApiUrl}/comments
   - GET/POST/PUT/DELETE ${publicApiUrl}/todos
   - Custom Schemas: ${publicApiUrl}/custom/:resourceName
3. Session State & Sandboxing:
   - In browser fetch/axios calls, include \`credentials: 'include'\` to preserve mutations per user session.
   - In automated test runners (Playwright, Jest, Vitest), send header:
     \`X-Playground-Identity: <unique-session-key>\`
4. Failure & Delay Simulation:
   - To test loading skeletons: append \`?_delay=1500\`
   - To test error boundaries: append \`?_status=500\` or \`?_status=404\`
   - To test rate limiting: append \`?_status=429\`
5. Resetting State:
   - Call DELETE ${publicApiUrl}/session/reset to restore baseline data.`;

  const promptTemplate = `Build a React 19 task management dashboard using Tailwind CSS. 
Connect to Playground API (${publicApiUrl}/todos) to fetch initial items. 
Support adding new tasks via POST ${publicApiUrl}/todos and toggling completion via PATCH ${publicApiUrl}/todos/:id. 
Include credentials: 'include' in fetch calls so changes persist.`;

  const copyToClipboard = (text: string, setFn: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  };

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:robot-bold" className="w-3.5 h-3.5" />
          <span>Machine-Readable Knowledge</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          AI Agent Integration & Rules
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Playground API is purpose-built for AI coding agents (Cursor, Windsurf, Devin, GitHub Copilot) and LLMs (Claude 3.7, GPT-4o, Gemini 2.0) to build, test, and verify full-stack frontend prototypes with zero backend setup.
        </p>
      </div>

      {/* 2. Machine-Readable Context Files */}
      <div id="ai-specs" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Machine-Readable Context Endpoints
        </h2>
        <p className="text-sm text-slate-600">
          Direct your agent to load any of these standard files for instant grounding:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/llms.txt"
            target="_blank"
            className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col gap-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-indigo-600 group-hover:text-indigo-700">/llms.txt</span>
              <Icon icon="ph:arrow-up-right-bold" className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standard concise markdown specification for context windows and cursor indexing.
            </p>
          </Link>

          <Link
            href="/llms-full.txt"
            target="_blank"
            className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col gap-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-indigo-600 group-hover:text-indigo-700">/llms-full.txt</span>
              <Icon icon="ph:arrow-up-right-bold" className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Exhaustive technical documentation including request schemas and header modifiers.
            </p>
          </Link>

          <Link
            href="/product.json"
            target="_blank"
            className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col gap-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-indigo-600 group-hover:text-indigo-700">/product.json</span>
              <Icon icon="ph:arrow-up-right-bold" className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Structured JSON schema manifest of all resources, filters, and chaos simulations.
            </p>
          </Link>
        </div>
      </div>

      {/* 3. Drop-in .cursorrules / .windsurfrules */}
      <div id="prompt-template" className="space-y-4 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Drop-in Agent Rules File
            </h2>
            <p className="text-sm text-slate-600">
              Paste this directly into your project&apos;s <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">.cursorrules</code>, <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">.windsurfrules</code>, or Copilot instruction file:
            </p>
          </div>

          <button
            type="button"
            onClick={() => copyToClipboard(cursorRuleContent, setCopiedCursor)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Icon icon={copiedCursor ? 'ph:check-bold' : 'ph:copy-bold'} className="w-4 h-4" />
            <span>{copiedCursor ? 'Copied to Clipboard!' : 'Copy Rules File'}</span>
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 shadow-inner relative overflow-hidden">
          <pre className="font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto leading-relaxed whitespace-pre-wrap">
            {cursorRuleContent}
          </pre>
        </div>
      </div>

      {/* 4. One-Click Prompt Template */}
      <div id="starter-prompt" className="space-y-4 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Sample Prompt for ChatGPT / Claude
            </h2>
            <p className="text-sm text-slate-600">
              Copy and paste this prompt to generate a production-ready application instantly:
            </p>
          </div>

          <button
            type="button"
            onClick={() => copyToClipboard(promptTemplate, setCopiedPrompt)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Icon icon={copiedPrompt ? 'ph:check-bold' : 'ph:copy-bold'} className="w-4 h-4 text-indigo-600" />
            <span>{copiedPrompt ? 'Copied Prompt!' : 'Copy Prompt'}</span>
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="font-mono text-xs sm:text-sm text-slate-700 leading-relaxed italic">
            &quot;{promptTemplate}&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
