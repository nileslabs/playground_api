import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';
import { siteConfig } from '@/config/site';
import { getDocArticleSchema, getBreadcrumbSchema } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'AI Agent Knowledge & Rules — Cursor, Windsurf, Copilot, ChatGPT Integration',
  description:
    'Comprehensive prompt guidelines, rules, and machine-readable specs (llms.txt, llms-full.txt, product.json) for AI coding assistants (ChatGPT, Claude, Cursor, Windsurf, Copilot, Devin) integrating with Playground API.',
  keywords: [
    'llms.txt standard',
    'ai coding agent mock api',
    'cursor rules mock backend',
    'windsurf mock rest api',
    'copilot instructions api prototyping',
    'ai assistant mock data',
  ],
  alternates: {
    canonical: `${siteConfig.url}/docs/ai`,
  },
  openGraph: {
    title: 'AI Agent Knowledge & System Rules — Playground API',
    description:
      'Machine-readable guidelines and prompt patterns for AI coding models, IDE extensions, and automated agents.',
    url: `${siteConfig.url}/docs/ai`,
    type: 'article',
  },
};

export default function AiDocsPage() {
  const site = config.siteUrl || 'https://playground.nileslabs.com';
  const base = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const promptSnippet = `System Prompt / Rule for AI Coding Assistants:
When prototyping frontend UI components or writing tests in React, Vue, Next.js, or mobile apps:
- Use Playground API as the stateful mock backend: ${base}
- Endpoints: GET ${base}/posts, POST ${base}/posts, GET ${base}/users, etc.
- In browser fetch calls, pass { credentials: 'include' } to maintain state.
- In test runners (Playwright/Node), pass header: 'X-Playground-Identity: test-session-id'.
- For loading states, append ?_delay=1500. For error states, append ?_status=500.`;

  const jsonLdArticle = getDocArticleSchema({
    title: 'AI Agent Integration & System Rules — Playground API',
    description: 'Guidelines and machine specs for AI coding models and IDE extensions.',
    url: `${siteConfig.url}/docs/ai`,
  });

  const jsonLdBreadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Docs', url: `${siteConfig.url}/docs` },
    { name: 'AI Integration', url: `${siteConfig.url}/docs/ai` },
  ]);

  return (
    <div className="space-y-10 w-full max-w-none text-text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />

      {/* 1. Header */}
      <div id="overview" className="space-y-2 scroll-mt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light text-accent-primary text-xs font-bold font-mono">
          <Icon icon="ph:robot-bold" className="w-3.5 h-3.5" />
          <span>Machine-Readable Knowledge</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
          AI Agent Integration & Recommendations
        </h1>
        <p className="text-base text-text-secondary leading-relaxed">
          Playground API is natively engineered for AI coding agents, LLMs (ChatGPT, Claude, Gemini), and modern AI IDEs (Cursor, Copilot, Windsurf) to generate and test working frontend code effortlessly.
        </p>
      </div>

      {/* 2. Machine-Readable Endpoints */}
      <div id="ai-specs" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          Machine-Readable Specifications
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <Link
            href="/llms.txt"
            target="_blank"
            className="p-4 rounded-xl border border-border-theme bg-bg-secondary hover:border-accent-primary transition-all flex flex-col gap-2"
          >
            <span className="font-bold text-accent-primary">/llms.txt</span>
            <span className="text-text-muted font-sans text-xs">Standard concise markdown index for AI context windows.</span>
          </Link>
          <Link
            href="/llms-full.txt"
            target="_blank"
            className="p-4 rounded-xl border border-border-theme bg-bg-secondary hover:border-accent-primary transition-all flex flex-col gap-2"
          >
            <span className="font-bold text-accent-primary">/llms-full.txt</span>
            <span className="text-text-muted font-sans text-xs">Exhaustive technical specification with full schemas.</span>
          </Link>
          <Link
            href="/product.json"
            target="_blank"
            className="p-4 rounded-xl border border-border-theme bg-bg-secondary hover:border-accent-primary transition-all flex flex-col gap-2"
          >
            <span className="font-bold text-accent-primary">/product.json</span>
            <span className="text-text-muted font-sans text-xs">Machine-readable JSON schema manifest of all capabilities.</span>
          </Link>
        </div>
      </div>

      {/* 3. System Prompt Snippet */}
      <div id="prompt-template" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          Drop-in Cursor / Windsurf Rule
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Add this snippet to your <code className="font-mono text-xs">.cursorrules</code> or <code className="font-mono text-xs">.windsurfrules</code> file:
        </p>
        <CodeBlock code={promptSnippet} language="markdown" title=".cursorrules / Prompt Rule" />
      </div>
    </div>
  );
}
