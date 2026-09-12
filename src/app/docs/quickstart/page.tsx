import React from 'react';
import type { Metadata } from 'next';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';
import { siteConfig } from '@/config/site';
import { getDocArticleSchema, getBreadcrumbSchema } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: '30-Second Quickstart — Free Mock API Prototyping Guide',
  description:
    'Start prototyping in 30 seconds with Playground API. Make instant persistent REST requests with zero setup or API keys in JavaScript, React, or cURL.',
  keywords: [
    'mock api quickstart',
    'fast fake rest api',
    'fetch mock posts react',
    'free api testing tutorial',
    'jsonplaceholder quickstart',
  ],
  alternates: {
    canonical: `${siteConfig.url}/docs/quickstart`,
  },
  openGraph: {
    title: '30-Second Quickstart — Playground API',
    description:
      'Start prototyping in 30 seconds. Make persistent mock REST queries with zero API keys or backend configuration.',
    url: `${siteConfig.url}/docs/quickstart`,
    type: 'article',
  },
};

export default function QuickstartPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const getSample = `// 1. Fetch baseline posts
const res = await fetch('${publicApiUrl}/posts?_limit=5', {
  credentials: 'include',
});
const { data } = await res.json();
console.log('Posts:', data);`;

  const postSample = `// 2. Create a post in your isolated sandbox
const res = await fetch('${publicApiUrl}/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    title: 'Hello from React!',
    body: 'This post persists in my private session.',
    user_id: 1,
  }),
});
const newPost = await res.json();
console.log('Created ID:', newPost.id);`;

  const fetchUpdatedSample = `// 3. Fetch again — your new post is right at the top
const res = await fetch('${publicApiUrl}/posts?_limit=5', {
  credentials: 'include',
});
const { data } = await res.json();
console.log('Top Post:', data[0].title);`;

  const jsonLdArticle = getDocArticleSchema({
    title: '30-Second Quickstart — Playground API',
    description: 'Learn how to start using Playground API in 3 easy steps with code snippets.',
    url: `${siteConfig.url}/docs/quickstart`,
  });

  const jsonLdBreadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Docs', url: `${siteConfig.url}/docs` },
    { name: 'Quickstart', url: `${siteConfig.url}/docs/quickstart` },
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
      <div id="overview" className="space-y-3 scroll-mt-20">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
          30-Second Quickstart
        </h1>
        <p className="text-base text-text-secondary leading-relaxed">
          Start prototyping immediately with standard <code className="px-1.5 py-0.5 rounded bg-bg-secondary font-mono text-sm">fetch()</code>. No API keys or account creation needed.
        </p>
      </div>

      {/* Step 1 */}
      <div id="step-1" className="space-y-3 scroll-mt-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-accent-primary/10 text-accent-primary font-bold text-sm">
            1
          </div>
          <h2 className="text-lg font-bold text-text-primary">Read baseline data</h2>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          Fetch initial seed posts using standard GET request:
        </p>
        <CodeBlock code={getSample} language="javascript" title="Step 1: Fetch Posts" />
      </div>

      {/* Step 2 */}
      <div id="step-2" className="space-y-3 scroll-mt-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-accent-primary/10 text-accent-primary font-bold text-sm">
            2
          </div>
          <h2 className="text-lg font-bold text-text-primary">Mutate data in your private sandbox</h2>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          Create new resources using POST. Setting <code className="px-1.5 py-0.5 rounded bg-bg-secondary font-mono text-sm">credentials: &apos;include&apos;</code> attaches your private session sandbox:
        </p>
        <CodeBlock code={postSample} language="javascript" title="Step 2: Create Persistent Post" />
      </div>

      {/* Step 3 */}
      <div id="step-3" className="space-y-3 scroll-mt-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-accent-primary/10 text-accent-primary font-bold text-sm">
            3
          </div>
          <h2 className="text-lg font-bold text-text-primary">Verify state persistence</h2>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          Subsequent GET requests immediately reflect your new item merged at the top of the collection:
        </p>
        <CodeBlock code={fetchUpdatedSample} language="javascript" title="Step 3: Verify Persistence" />
      </div>
    </div>
  );
}
