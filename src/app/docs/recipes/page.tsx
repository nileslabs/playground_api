'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export default function RecipesPage() {
  const [activeTab, setActiveTab] = useState<'tanstack' | 'nextjs' | 'vue' | 'axios'>('tanstack');
  const [copied, setCopied] = useState(false);

  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const recipes = {
    tanstack: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// 1. Fetch posts with credentials for session isolation
export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch('${publicApiUrl}/posts?_limit=10', {
        credentials: 'include',
      });
      return res.json();
    },
  });
}

// 2. Stateful create post mutation
export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newPost) => {
      const res = await fetch('${publicApiUrl}/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newPost),
      });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });
}`,
    nextjs: `// app/actions/posts.ts
'use server';

export async function createPostAction(formData: FormData) {
  const title = formData.get('title');
  const body = formData.get('body');

  const res = await fetch('${publicApiUrl}/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Pass consistent identity header for Server Actions
      'X-Playground-Identity': 'server-action-session',
    },
    body: JSON.stringify({ title, body, user_id: 1 }),
  });

  return res.json();
}`,
    vue: `<script setup>
import { ref, onMounted } from 'vue';

const posts = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const res = await fetch('${publicApiUrl}/posts?_limit=10', {
      credentials: 'include'
    });
    const data = await res.json();
    posts.value = data.data || data;
  } finally {
    isLoading.value = false;
  }
});
</script>`,
    axios: `import axios from 'axios';

// Create a pre-configured Axios client
export const api = axios.create({
  baseURL: '${publicApiUrl}',
  withCredentials: true, // Persists visitor sandbox cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// Full CRUD helper functions
export const getPosts = (page = 1) => api.get(\`/posts?page=\${page}&limit=10\`);
export const createPost = (post) => api.post('/posts', post);
export const deletePost = (id) => api.delete(\`/posts/\${id}\`);`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(recipes[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          Integration Recipes
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Copy-paste ready patterns for React, TanStack Query, Next.js Server Actions, Vue 3, and Axios.
        </p>
      </div>

      {/* 2. Interactive Framework Switcher */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/70 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(
              [
                { id: 'tanstack', label: 'TanStack Query (React)', icon: 'simple-icons:react' },
                { id: 'nextjs', label: 'Next.js 15 Server Actions', icon: 'simple-icons:nextdotjs' },
                { id: 'vue', label: 'Vue 3 Composition', icon: 'simple-icons:vuedotjs' },
                { id: 'axios', label: 'Axios Interceptors', icon: 'simple-icons:axios' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                  activeTab === t.id
                    ? 'bg-white text-indigo-700 font-bold border border-slate-200 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon icon={t.icon} className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 shadow-2xs"
          >
            <Icon icon={copied ? 'ph:check-bold' : 'ph:copy-bold'} className="w-3.5 h-3.5 text-indigo-600" />
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="p-4 sm:p-6 bg-slate-900 overflow-x-auto">
          <pre className="font-mono text-xs sm:text-sm text-emerald-400">
            {recipes[activeTab]}
          </pre>
        </div>
      </div>
    </div>
  );
}
