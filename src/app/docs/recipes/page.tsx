import React from 'react';
import type { Metadata } from 'next';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';
import { siteConfig } from '@/config/site';
import { getDocArticleSchema, getBreadcrumbSchema } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Framework Recipes — React, TanStack Query, Next.js, Axios, Playwright',
  description:
    'Production-ready code integration recipes for connecting Playground API to React, TanStack Query v5, Axios withCredentials, Next.js 15 Server Components, and Playwright parallel test runners.',
  keywords: [
    'react tanstack query mock api recipe',
    'axios credentials include mock api',
    'nextjs server components mock rest api',
    'playwright e2e test mock sandbox',
    'cypress parallel test api',
  ],
  alternates: {
    canonical: `${siteConfig.url}/docs/recipes`,
  },
  openGraph: {
    title: 'Framework Integration Recipes — Playground API',
    description:
      'Copy-paste integration snippets for TanStack Query, Axios, Next.js, and Playwright with per-session state persistence.',
    url: `${siteConfig.url}/docs/recipes`,
    type: 'article',
  },
};

export default function RecipesPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const reactQuerySnippet = `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE = '${publicApiUrl}';

// 1. Fetch Posts List with search
export function usePosts(query = '') {
  return useQuery({
    queryKey: ['posts', query],
    queryFn: async () => {
      const url = query ? \`\${API_BASE}/posts?q=\${query}\` : \`\${API_BASE}/posts\`;
      const res = await fetch(url, { credentials: 'include' });
      return res.json();
    },
  });
}

// 2. Create Post Mutation (Persists in sandbox!)
export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newPost) => {
      const res = await fetch(\`\${API_BASE}/posts\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newPost),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}`;

  const axiosSnippet = `import axios from 'axios';

// Create a pre-configured Axios instance with credentials
export const api = axios.create({
  baseURL: '${publicApiUrl}',
  withCredentials: true, // Automatically sends and saves pg_identity cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Example usage
export const getTodos = (params) => api.get('/todos', { params });
export const createTodo = (data) => api.post('/todos', data);
export const deleteTodo = (id) => api.delete(\`/todos/\${id}\`);`;

  const nextjsSnippet = `// app/posts/page.tsx (Next.js 15 Server Component)
import { cookies } from 'next/headers';

export default async function PostsPage() {
  const cookieStore = await cookies();
  const identity = cookieStore.get('pg_identity')?.value;

  const res = await fetch('${publicApiUrl}/posts?_limit=10', {
    headers: identity ? { 'X-Playground-Identity': identity } : {},
    cache: 'no-store', // Always fetch fresh overlay data
  });

  const { data: posts } = await res.json();

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post: any) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}`;

  const playwrightSnippet = `import { test, expect } from '@playwright/test';

// Isolated parallel test runner using unique session header
test('creates, reads, and deletes a post in private session', async ({ request }) => {
  const testSessionId = \`pw-run-\${Date.now()}-\${Math.random().toString(36).substring(7)}\`;
  const headers = { 'X-Playground-Identity': testSessionId };

  // 1. Create Post
  const createRes = await request.post('${publicApiUrl}/posts', {
    headers,
    data: { title: 'Playwright E2E Post', body: 'Automated test item', user_id: 1 },
  });
  expect(createRes.status()).toBe(201);
  const created = await createRes.json();

  // 2. Verify it shows up in GET
  const listRes = await request.get('${publicApiUrl}/posts', { headers });
  const { data: posts } = await listRes.json();
  expect(posts[0].id).toBe(created.id);

  // 3. Reset Sandbox at test completion
  const resetRes = await request.delete('${publicApiUrl}/session/reset', { headers });
  expect(resetRes.status()).toBe(200);
});`;

  const jsonLdArticle = getDocArticleSchema({
    title: 'Framework Recipes — Playground API',
    description: 'Code snippets and recipes for React, TanStack Query, Axios, Next.js, and Playwright.',
    url: `${siteConfig.url}/docs/recipes`,
  });

  const jsonLdBreadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Docs', url: `${siteConfig.url}/docs` },
    { name: 'Framework Recipes', url: `${siteConfig.url}/docs/recipes` },
  ]);

  return (
    <div className="space-y-12 w-full max-w-none text-text-primary">
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
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
          Framework Recipes
        </h1>
        <p className="text-base text-text-secondary leading-relaxed">
          Production-tested patterns for integrating Playground API with popular frontend frameworks, data-fetching libraries, and automated testing suites.
        </p>
      </div>

      {/* React TanStack Query */}
      <div id="react-query" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          React & TanStack Query (v5)
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Use standard <code className="font-mono text-xs">useQuery</code> and <code className="font-mono text-xs">useMutation</code> hooks with automatic cache invalidation:
        </p>
        <CodeBlock code={reactQuerySnippet} language="typescript" title="hooks/usePosts.ts" />
      </div>

      {/* Axios */}
      <div id="axios" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          Axios HTTP Client
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Enable <code className="font-mono text-xs">withCredentials: true</code> to maintain sandbox session persistence:
        </p>
        <CodeBlock code={axiosSnippet} language="typescript" title="lib/api.ts" />
      </div>

      {/* Next.js 15 Server Components */}
      <div id="nextjs" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          Next.js App Router (Server Components)
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Forward the session cookie from incoming server requests to preserve user overlays:
        </p>
        <CodeBlock code={nextjsSnippet} language="typescript" title="app/posts/page.tsx" />
      </div>

      {/* Playwright */}
      <div id="playwright" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          Playwright Parallel E2E Testing
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Use the <code className="font-mono text-xs">X-Playground-Identity</code> header to run tests in parallel without data cross-contamination:
        </p>
        <CodeBlock code={playwrightSnippet} language="typescript" title="tests/posts.spec.ts" />
      </div>
    </div>
  );
}
