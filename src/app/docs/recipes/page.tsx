'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { CodeBlock } from '@/components/ui/CodeBlock';
import Link from 'next/link';

export default function RecipesPage() {
  const [activeTab, setActiveTab] = useState<'tanstack' | 'nextjs' | 'axios' | 'vue' | 'playwright' | 'svelte'>('tanstack');

  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const recipes = {
    tanstack: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Post {
  id: number;
  title: string;
  body: string;
  user_id: number;
}

// 1. Fetch posts with credentials for isolated visitor session
export function usePosts(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['posts', { page, limit }],
    queryFn: async (): Promise<Post[]> => {
      const res = await fetch(\`\${'${publicApiUrl}'}/posts?_page=\${page}&_limit=\${limit}\`, {
        credentials: 'include', // Persists HMAC session cookie
      });
      if (!res.ok) throw new Error('Failed to load posts');
      const json = await res.json();
      return json.data || json;
    },
  });
}

// 2. Stateful create mutation with optimistic updates
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPost: Omit<Post, 'id'>): Promise<Post> => {
      const res = await fetch('${publicApiUrl}/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newPost),
      });
      if (!res.ok) throw new Error('Mutation failed');
      return res.json();
    },
    // Invalidate and refetch posts query immediately
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

// 3. Stateful delete mutation
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(\`\${'${publicApiUrl}'}/posts/\${id}\`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Delete failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}`,

    nextjs: `// app/actions/posts.ts
'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const API_BASE = '${publicApiUrl}';

export async function createPostAction(formData: FormData) {
  const title = formData.get('title') as string;
  const body = formData.get('body') as string;
  
  // Forward incoming browser cookies or pass custom identity header
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('pg_identity')?.value;

  const res = await fetch(\`\${API_BASE}/posts\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(sessionCookie ? { Cookie: \`pg_identity=\${sessionCookie}\` } : { 'X-Playground-Identity': 'nextjs-server-action' }),
    },
    body: JSON.stringify({
      title,
      body,
      user_id: 1,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to create post via Server Action');
  }

  // Instantly revalidate page cache to display new post
  revalidatePath('/blog');
  return res.json();
}`,

    axios: `import axios from 'axios';

// 1. Instantiate configured Axios client
export const api = axios.create({
  baseURL: '${publicApiUrl}',
  withCredentials: true, // Stores HMAC visitor session cookie
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

// 2. Interceptor: Handle simulated 401 Unauthorized with token refresh rotation
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = \`Bearer \${token}\`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post('/auth/refresh');
        const newToken = data.access_token;
        processQueue(null, newToken);
        originalRequest.headers['Authorization'] = \`Bearer \${newToken}\`;
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);`,

    vue: `<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Post {
  id: number;
  title: string;
  body: string;
}

const posts = ref<Post[]>([]);
const isLoading = ref(true);
const errorMessage = ref('');

const API_BASE = '${publicApiUrl}';

async function fetchPosts() {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const res = await fetch(\`\${API_BASE}/posts?_limit=10\`, {
      credentials: 'include', // Preserves visitor session overlay
    });
    const json = await res.json();
    posts.value = json.data || json;
  } catch (err: any) {
    errorMessage.value = err.message;
  } finally {
    isLoading.value = false;
  }
}

async function addPost(title: string, body: string) {
  const res = await fetch(\`\${API_BASE}/posts\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ title, body, user_id: 1 }),
  });
  if (res.ok) {
    await fetchPosts(); // Refresh list to view newly created post
  }
}

onMounted(() => {
  fetchPosts();
});
</script>`,

    playwright: `// tests/posts.spec.ts
import { test, expect } from '@playwright/test';

const API_BASE = '${publicApiUrl}';
const TEST_IDENTITY = 'e2e-playwright-run-99';

test.describe('Posts API Sandbox E2E', () => {
  // Before running tests, ensure pristine state
  test.beforeEach(async ({ request }) => {
    await request.delete(\`\${API_BASE}/session/reset\`, {
      headers: { 'X-Playground-Identity': TEST_IDENTITY },
    });
  });

  test('creates and persists a new post in isolated worker sandbox', async ({ request }) => {
    // 1. Create a post
    const createRes = await request.post(\`\${API_BASE}/posts\`, {
      headers: { 'X-Playground-Identity': TEST_IDENTITY },
      data: {
        title: 'Automated CI Test Post',
        body: 'Verified via Playwright runner',
        user_id: 1,
      },
    });
    expect(createRes.status()).toBe(201);
    const created = await createRes.json();
    expect(created.id).toBeDefined();

    // 2. Fetch posts and confirm newly created post exists
    const listRes = await request.get(\`\${API_BASE}/posts\`, {
      headers: { 'X-Playground-Identity': TEST_IDENTITY },
    });
    expect(listRes.status()).toBe(200);
    const list = await listRes.json();
    const found = (list.data || list).find((p: any) => p.title === 'Automated CI Test Post');
    expect(found).toBeDefined();
  });
});`,

    svelte: `<script>
  import { onMount } from 'svelte';

  let posts = $state([]);
  let loading = $state(true);

  const API_BASE = '${publicApiUrl}';

  async function loadPosts() {
    loading = true;
    const res = await fetch(\`\${API_BASE}/posts?_limit=5\`, {
      credentials: 'include',
    });
    const json = await res.json();
    posts = json.data || json;
    loading = false;
  }

  async function createPost(title) {
    await fetch(\`\${API_BASE}/posts\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, body: 'Svelte 5 runic store', user_id: 1 }),
    });
    await loadPosts();
  }

  onMount(loadPosts);
</script>`,
  };

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:cooking-pot-bold" className="w-3.5 h-3.5" />
          <span>Fullstack Cookbooks</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Integration Recipes & Cookbooks
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Production-tested patterns and boilerplate code to connect Playground API to TanStack Query, Next.js 15 Server Actions, Axios, Vue 3, Svelte 5, and Playwright E2E suites.
        </p>
      </div>

      {/* 2. Interactive Framework Switcher */}
      <div id="framework-recipes" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Select Your Stack
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-2.5 flex items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-1.5 shrink-0">
              {(
                [
                  { id: 'tanstack', label: 'TanStack Query (React)', icon: 'simple-icons:react' },
                  { id: 'nextjs', label: 'Next.js 15 Server Actions', icon: 'simple-icons:nextdotjs' },
                  { id: 'axios', label: 'Axios (with JWT Refresh)', icon: 'simple-icons:axios' },
                  { id: 'vue', label: 'Vue 3 (Composition)', icon: 'simple-icons:vuedotjs' },
                  { id: 'playwright', label: 'Playwright (CI/CD E2E)', icon: 'simple-icons:playwright' },
                  { id: 'svelte', label: 'Svelte 5 (Runes)', icon: 'simple-icons:svelte' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === t.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon icon={t.icon} className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-0">
            <CodeBlock
              code={recipes[activeTab]}
              language="typescript"
              title={`recipe-${activeTab}`}
            />
          </div>
        </div>
      </div>

      {/* 3. Essential Best Practices Callout */}
      <div id="best-practices" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Integration Best Practices
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
              <Icon icon="ph:cookie-bold" className="w-5 h-5" />
              <span>Always Send Credentials</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              When querying from a browser, always specify <code className="font-mono text-xs bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded border border-slate-200">credentials: &apos;include&apos;</code> (or Axios <code className="font-mono text-xs bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded border border-slate-200">withCredentials: true</code>) to ensure the HMAC session cookie is preserved.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
              <Icon icon="ph:git-commit-bold" className="w-5 h-5" />
              <span>Deterministic CI Headers</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              In automated test runners (Cypress, Playwright), use <code className="font-mono text-xs bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded border border-slate-200">X-Playground-Identity: [test-id]</code>. This guarantees parallel test workers never interfere with each other.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
              <Icon icon="ph:arrow-counter-clockwise-bold" className="w-5 h-5" />
              <span>Cleanup After Test Suites</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              In test <code className="font-mono text-xs bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200">afterEach</code> or <code className="font-mono text-xs bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200">beforeEach</code> hooks, issue a <code className="font-mono text-xs bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded border border-slate-200">DELETE /session/reset</code> to ensure each test executes against clean baseline data.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Link to Real-World Showcase */}
      <div className="p-6 sm:p-7 rounded-2xl border border-indigo-100 bg-indigo-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-slate-900">Want to see these recipes in an end-to-end production application?</h3>
          <p className="text-sm text-slate-600">Check out the featured React 18 E-Commerce store demo with cart, JWT auth, and dynamic products.</p>
        </div>
        <Link
          href="/docs/showcase"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shrink-0"
        >
          View Showcase Demo
        </Link>
      </div>
    </div>
  );
}
