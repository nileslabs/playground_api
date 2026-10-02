'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { CodeBlock } from '@/components/ui/CodeBlock';
import Link from 'next/link';

export default function QuickstartPage() {
  const [activeTab, setActiveTab] = useState<'curl' | 'fetch' | 'axios' | 'react' | 'python'>('fetch');
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<any>(null);
  const [pingLatency, setPingLatency] = useState<number | null>(null);

  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const snippets = {
    fetch: `// 1. Fetch posts with credentials to isolate your visitor session
const response = await fetch('${publicApiUrl}/posts?_limit=5', {
  credentials: 'include', // Automatically attaches/receives pg_identity cookie
});

const data = await response.json();
console.log('Posts:', data.data || data);

// 2. Create a persistent post in your sandbox
const createRes = await fetch('${publicApiUrl}/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    title: 'My First Stateful Post',
    body: 'This post persists across page reloads in your session overlay!',
    user_id: 1,
  }),
});

const newPost = await createRes.json();
console.log('Created Post:', newPost);`,

    curl: `# 1. Fetch baseline posts
curl -X GET "${publicApiUrl}/posts?_limit=5"

# 2. Create a new stateful post with custom identity header
curl -X POST "${publicApiUrl}/posts" \\
  -H "Content-Type: application/json" \\
  -H "X-Playground-Identity: my-quickstart-test" \\
  -d '{
    "title": "Persistent Terminal Post",
    "body": "Saved to your visitor sandbox",
    "user_id": 1
  }'

# 3. Query with the same identity header to confirm persistence!
curl -X GET "${publicApiUrl}/posts" \\
  -H "X-Playground-Identity: my-quickstart-test"`,

    axios: `import axios from 'axios';

// Create pre-configured client with credentials
const api = axios.create({
  baseURL: '${publicApiUrl}',
  withCredentials: true, // Stores HMAC visitor session cookie
  headers: { 'Content-Type': 'application/json' },
});

// GET with pagination
const { data: posts } = await api.get('/posts', {
  params: { _page: 1, _limit: 5 },
});

// POST mutation (persists immediately)
const { data: newPost } = await api.post('/posts', {
  title: 'Axios Stateful Record',
  body: 'Mutations stay in your sandbox',
  user_id: 1,
});

console.log('Persisted post:', newPost);`,

    react: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query posts with session credentials
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

// Mutation with automatic cache invalidation
export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newPost: { title: string; body: string }) => {
      const res = await fetch('${publicApiUrl}/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...newPost, user_id: 1 }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}`,

    python: `import requests

# Create session to automatically preserve visitor cookies
session = requests.Session()

# 1. Fetch posts
response = session.get('${publicApiUrl}/posts', params={'_limit': 5})
print("Initial:", response.json())

# 2. Mutate stateful record
create_resp = session.post(
    '${publicApiUrl}/posts',
    json={
        'title': 'Python Client Post',
        'body': 'Persisted in private session sandbox',
        'user_id': 1
    }
)
print("Created:", create_resp.json())

# 3. Subsequent query includes newly created post
updated_resp = session.get('${publicApiUrl}/posts')
print("Total count updated:", len(updated_resp.json().get('data', [])))`,
  };

  const handlePingHealth = async () => {
    setIsPinging(true);
    setPingLatency(null);
    const startTime = performance.now();
    try {
      const res = await fetch(`${publicApiUrl}/health`, { credentials: 'include' });
      const data = await res.json();
      const endTime = performance.now();
      setPingLatency(Math.round(endTime - startTime));
      setPingResult(data);
    } catch (err: any) {
      const endTime = performance.now();
      setPingLatency(Math.round(endTime - startTime));
      setPingResult({ status: 'error', message: err.message });
    } finally {
      setIsPinging(false);
    }
  };

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:lightning-bold" className="w-3.5 h-3.5" />
          <span>5-Minute Onboarding</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Quickstart Guide
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Get started with Playground API in under 60 seconds. Zero API keys, zero authentication configuration, and zero credit card required.
        </p>
      </div>

      {/* 2. Step 1: Connectivity Health Ping */}
      <div id="step-1" className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <span>Test Live Server Connectivity</span>
            </h2>
            <p className="text-sm text-slate-600">
              Execute a real-time request to the health check endpoint <code className="font-mono text-xs bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded border border-slate-200">GET /api/v1/health</code>.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePingHealth}
            disabled={isPinging}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
          >
            {isPinging ? (
              <>
                <Icon icon="ph:spinner-bold" className="w-4 h-4 animate-spin" />
                <span>Pinging Gateway...</span>
              </>
            ) : (
              <>
                <Icon icon="ph:heartbeat-bold" className="w-4 h-4" />
                <span>Ping Live Server</span>
              </>
            )}
          </button>
        </div>

        {pingResult && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="font-bold text-slate-900">Status: 200 OK</span>
              </div>
              {pingLatency !== null && (
                <span className="text-slate-500 font-mono text-xs">
                  Latency: <strong className="text-indigo-600">{pingLatency}ms</strong>
                </span>
              )}
            </div>

            <CodeBlock
              code={JSON.stringify(pingResult, null, 2)}
              language="json"
              title="health-check.json"
              subtitle={pingLatency ? `${pingLatency}ms` : undefined}
            />
          </div>
        )}
      </div>

      {/* 3. Step 2: Multi-Language Integration Snippet */}
      <div id="step-2" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center">
              2
            </span>
            <span>Fetch & Mutate in Your Favorite Tool</span>
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Choose your programming language or framework below to see ready-to-use code snippets with stateful session persistence.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          {/* Framework Selector Tabs */}
          <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-2.5 flex items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-1.5 shrink-0">
              {(
                [
                  { id: 'fetch', label: 'JavaScript (Fetch)', icon: 'simple-icons:javascript' },
                  { id: 'curl', label: 'cURL (Terminal)', icon: 'ph:terminal-window-bold' },
                  { id: 'axios', label: 'Axios', icon: 'simple-icons:axios' },
                  { id: 'react', label: 'React Query (TanStack)', icon: 'simple-icons:react' },
                  { id: 'python', label: 'Python (Requests)', icon: 'simple-icons:python' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon icon={tab.icon} className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-0">
            <CodeBlock
              code={snippets[activeTab]}
              language={activeTab === 'curl' ? 'bash' : activeTab === 'python' ? 'python' : 'typescript'}
              title={`quickstart-${activeTab}`}
            />
          </div>
        </div>
      </div>

      {/* 4. Step 3: Understanding Session Identity */}
      <div id="step-3" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center">
            3
          </span>
          <span>How Your Private Sandbox Stays Isolated</span>
        </h2>
        <p className="text-base text-slate-600 leading-relaxed">
          Playground API ensures multiple developers, test runners, and browsers never collide or overwrite each other. Here is how your identity is resolved:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
              <Icon icon="ph:browser-bold" className="w-5 h-5" />
              <span>Browser Apps (Cookie-Based)</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              When making requests from a web browser, pass <code className="font-mono text-xs bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded border border-slate-200">credentials: &apos;include&apos;</code> (or Axios <code className="font-mono text-xs bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded border border-slate-200">withCredentials: true</code>). The backend assigns an HMAC-signed <code className="font-mono text-xs bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200">pg_identity</code> cookie.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
              <Icon icon="ph:git-branch-bold" className="w-5 h-5" />
              <span>CI/CD & Mobile (Header-Based)</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              For Playwright test workers, Postman, or mobile apps without cookies, pass the header <code className="font-mono text-xs bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded border border-slate-200">X-Playground-Identity: worker-1</code>. Each worker receives its own isolated database overlay.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Step 4: Chaos & Fault Simulation */}
      <div id="step-4" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center">
            4
          </span>
          <span>Inject Latency & Chaos Parameters</span>
        </h2>
        <p className="text-base text-slate-600 leading-relaxed">
          Test UI skeleton loaders and error boundary states instantly by attaching query parameters to any REST endpoint:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-1">
          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="font-mono text-xs sm:text-sm text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1 rounded-md w-fit border border-indigo-100">
              ?_delay=1500
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">Artificial Latency</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Forces a 1500ms delay to test loading spinners and skeleton placeholders.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="font-mono text-xs sm:text-sm text-rose-600 font-bold bg-rose-50 px-2.5 py-1 rounded-md w-fit border border-rose-100">
              ?_status=500
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">Simulate Server Error</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Returns HTTP 500 Internal Server Error to test toast alerts and retry buttons.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="font-mono text-xs sm:text-sm text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-md w-fit border border-amber-100">
              ?_flaky=true
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">Flaky Network Jitter</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Simulates real-world mobile jitter with randomized delay (200-2500ms) and 10% dropped packets.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Step 5: Resetting the Sandbox */}
      <div id="step-5" className="p-6 sm:p-7 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3.5 scroll-mt-20">
        <h3 className="font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
          <Icon icon="ph:arrow-counter-clockwise-bold" className="w-5 h-5 text-indigo-600" />
          <span>Resetting Your Sandbox to Pristine Baseline</span>
        </h3>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Need a clean slate? Execute <code className="font-mono text-xs bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded border border-slate-300">DELETE /api/v1/session/reset</code> to immediately wipe your visitor mutations overlay and revert all core resources to the factory seed data.
        </p>
        <div className="pt-2">
          <Link
            href="/docs/sandbox/reset"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1.5"
          >
            <span>Learn more about sandbox reset & snapshots</span>
            <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
