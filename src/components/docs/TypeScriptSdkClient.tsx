'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

const SDK_EXAMPLES = [
  {
    id: 'posts-comments',
    title: 'Fetch Posts & Comments',
    description: 'Fetch paginated posts, create a sandboxed post, and fetch post comments.',
    code: `// 1. Initialize Client
const api = new PlaygroundAPI.PlaygroundClient({
  apiUrl: '${config.apiUrl}'
});

// 2. Fetch first 3 posts
const postsRes = await api.posts.list({ limit: 3 });

// 3. Create sandboxed post
const newPost = await api.posts.create({
  title: 'Built with playground-api SDK',
  body: 'Mutations stay isolated in your browser session!',
  user_id: 1
});

// 4. Fetch comments
const commentsRes = await api.posts.comments(1);

return {
  fetchedPosts: postsRes.data,
  createdPost: newPost,
  firstComment: commentsRes.data[0]
};`,
  },
  {
    id: 'auth-simulation',
    title: 'Auth Login & Profile',
    description: 'Simulate user login, receive JWT token, and query /auth/me.',
    code: `const api = new PlaygroundAPI.PlaygroundClient({
  apiUrl: '${config.apiUrl}'
});

// 1. Log in with mock credentials
const authRes = await api.auth.login({
  username: 'Bret',
  password: 'Password@123'
});

// 2. Query authenticated profile
const me = await api.auth.me();

return {
  user: me,
  accessToken: authRes.access_token,
  tokenType: authRes.token_type,
  expiresIn: authRes.expires_in
};`,
  },
  {
    id: 'custom-resource',
    title: 'Dynamic Custom Resources',
    description: 'Create and list ad-hoc mock entities on the fly.',
    code: `const api = new PlaygroundAPI.PlaygroundClient({
  apiUrl: '${config.apiUrl}'
});

const products = api.custom('products');

// Create a custom product
const item = await products.create({
  name: 'Wireless Mechanical Keyboard',
  price: 129.99,
  inStock: true,
  tags: ['gadgets', 'workspace']
});

// List all products in current sandbox
const list = await products.list();

return {
  createdItem: item,
  totalItemsInCollection: list.data.length,
  items: list.data
};`,
  },
  {
    id: 'simulation-modes',
    title: 'Network Simulation Controls',
    description: 'Simulate artificial delay or HTTP status error codes directly.',
    code: `const api = new PlaygroundAPI.PlaygroundClient({
  apiUrl: '${config.apiUrl}'
});

const startTime = performance.now();

// Simulate 400ms server latency
const slowRes = await api.posts.list({ limit: 2 }, { delay: 400 });

const elapsedMs = Math.round(performance.now() - startTime);

return {
  simulatedDelayMs: 400,
  actualRoundTripMs: elapsedMs,
  receivedCount: slowRes.data.length,
  firstTitle: slowRes.data[0]?.title
};`,
  },
  {
    id: 'session-reset',
    title: 'Reset Session Sandbox',
    description: 'Purge all session mutations and restore pristine baseline mock data.',
    code: `const api = new PlaygroundAPI.PlaygroundClient({
  apiUrl: '${config.apiUrl}'
});

// Purge all mutations
const resetResult = await api.session.reset();

return {
  result: resetResult
};`,
  },
];

export function TypeScriptSdkClient() {
  const [activeTab, setActiveTab] = useState<'npm' | 'pnpm' | 'yarn' | 'bun' | 'cdn'>('npm');
  const [selectedExample, setSelectedExample] = useState(SDK_EXAMPLES[0]);
  const [customCode, setCustomCode] = useState(SDK_EXAMPLES[0].code);
  const [isRunning, setIsRunning] = useState(false);
  const [runnerOutput, setRunnerOutput] = useState<any>(null);
  const [runnerError, setRunnerError] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [copiedInstall, setCopiedInstall] = useState(false);

  const installCommands = {
    npm: 'npm install playground-api',
    pnpm: 'pnpm add playground-api',
    yarn: 'yarn add playground-api',
    bun: 'bun add playground-api',
    cdn: `<script src="${config.apiUrl}/downloads/playground-api.js"></script>`,
  };

  const copyInstall = () => {
    navigator.clipboard.writeText(installCommands[activeTab]);
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const handleSelectExample = (ex: typeof SDK_EXAMPLES[0]) => {
    setSelectedExample(ex);
    setCustomCode(ex.code);
    setRunnerOutput(null);
    setRunnerError(null);
    setExecutionTime(null);
  };

  const runSdkSnippet = async () => {
    setIsRunning(true);
    setRunnerOutput(null);
    setRunnerError(null);
    const start = performance.now();

    try {
      // Ensure SDK script is available on window
      if (typeof window !== 'undefined' && !(window as any).PlaygroundAPI) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = `${config.apiUrl}/downloads/playground-api.js`;
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load playground-api SDK bundle'));
          document.head.appendChild(script);
        });
      }

      // Execute snippet using Function constructor
      const runnerFn = new Function('PlaygroundAPI', `return (async () => {\n${customCode}\n})()`);
      const result = await runnerFn((window as any).PlaygroundAPI);
      const elapsed = Math.round(performance.now() - start);

      setRunnerOutput(result);
      setExecutionTime(elapsed);
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - start);
      setRunnerError(err?.message || String(err));
      setExecutionTime(elapsed);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 p-8 sm:p-10 shadow-2xl">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 text-xs font-semibold text-indigo-400">
              <Icon icon="simple-icons:typescript" className="h-3.5 w-3.5 text-blue-400" />
              Official SDK v1.0.0
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-400">
              <Icon icon="ph:lightning-bold" className="h-3.5 w-3.5" />
              Zero Dependencies
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-xs font-semibold text-cyan-400">
              <Icon icon="ph:globe-hemisphere-west-bold" className="h-3.5 w-3.5" />
              Isomorphic (Browser + Node)
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Official TypeScript SDK <span className="text-indigo-400 font-mono text-2xl sm:text-3xl">(`playground-api`)</span>
          </h1>
          <p className="max-w-3xl text-base text-slate-300 sm:text-lg">
            Lightweight, zero-dependency, isomorphic client library for Playground API. Enjoy 100% type safety, autocomplete, automatic session isolation, simulation controls, and sub-resources out of the box.
          </p>

          {/* Quick Install Bar */}
          <div className="pt-4 max-w-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 bg-slate-950/80 px-4 py-2 rounded-t-xl">
              <div className="flex space-x-1">
                {(['npm', 'pnpm', 'yarn', 'bun', 'cdn'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                      activeTab === tab
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>
              <button
                onClick={copyInstall}
                className="flex items-center gap-1.5 rounded-lg bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                title="Copy install command"
              >
                <Icon
                  icon={copiedInstall ? 'ph:check-bold' : 'ph:copy-bold'}
                  className={`h-3.5 w-3.5 ${copiedInstall ? 'text-emerald-400' : ''}`}
                />
                {copiedInstall ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="rounded-b-xl bg-slate-950 p-4 font-mono text-sm text-indigo-300 border border-t-0 border-slate-700 flex items-center justify-between">
              <code>{installCommands[activeTab]}</code>
            </div>
          </div>
        </div>
      </div>

      {/* Live Interactive SDK Runner */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Icon icon="ph:terminal-window-bold" className="h-6 w-6 text-indigo-400" />
              Interactive SDK Runner
            </h2>
            <p className="text-sm text-slate-400">
              Test Playground API SDK calls directly in your browser with real live responses.
            </p>
          </div>
        </div>

        {/* Example Selector Pills */}
        <div className="flex flex-wrap gap-2">
          {SDK_EXAMPLES.map((ex) => (
            <button
              key={ex.id}
              onClick={() => handleSelectExample(ex)}
              className={`rounded-xl px-3.5 py-2 text-xs font-medium transition-all border ${
                selectedExample.id === ex.id
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {ex.title}
            </button>
          ))}
        </div>

        {/* Code Editor & Output Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left: Code Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Icon icon="ph:code-bold" className="h-4 w-4 text-indigo-400" />
                  SDK Code Snippet
                </span>
                <span className="text-xs text-slate-500">{selectedExample.description}</span>
              </div>
              <textarea
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                rows={14}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/90 p-4 font-mono text-xs text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all resize-y"
                spellCheck={false}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCustomCode(selectedExample.code)}
                className="text-xs text-slate-400 hover:text-slate-200 underline underline-offset-4"
              >
                Reset Code
              </button>
              <button
                onClick={runSdkSnippet}
                disabled={isRunning}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Icon
                  icon={isRunning ? 'line-md:loading-loop' : 'ph:play-fill'}
                  className="h-4 w-4"
                />
                {isRunning ? 'Executing SDK...' : 'Run in Browser'}
              </button>
            </div>
          </div>

          {/* Right: Output Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Icon icon="ph:brackets-curly-bold" className="h-4 w-4 text-emerald-400" />
                Live Response Output
              </span>
              {executionTime !== null && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-mono text-slate-300">
                  <Icon icon="ph:timer-bold" className="h-3 w-3 text-indigo-400" />
                  {executionTime} ms
                </span>
              )}
            </div>

            <div className="flex-1 rounded-xl border border-slate-800/80 bg-slate-900/90 p-4 font-mono text-xs overflow-auto max-h-[380px]">
              {isRunning && (
                <div className="flex h-full min-h-[200px] flex-col items-center justify-center space-y-2 text-slate-400">
                  <Icon icon="line-md:loading-loop" className="h-6 w-6 text-indigo-400" />
                  <span>Dispatching SDK request...</span>
                </div>
              )}

              {!isRunning && runnerError && (
                <div className="rounded-lg bg-red-950/40 border border-red-800/60 p-4 text-red-300 space-y-1">
                  <div className="flex items-center gap-2 font-semibold">
                    <Icon icon="ph:warning-circle-bold" className="h-4 w-4 text-red-400" />
                    PlaygroundError Encountered
                  </div>
                  <pre className="text-xs whitespace-pre-wrap">{runnerError}</pre>
                </div>
              )}

              {!isRunning && !runnerError && runnerOutput && (
                <pre className="text-emerald-300 whitespace-pre-wrap">
                  {JSON.stringify(runnerOutput, null, 2)}
                </pre>
              )}

              {!isRunning && !runnerError && !runnerOutput && (
                <div className="flex h-full min-h-[200px] flex-col items-center justify-center space-y-1.5 text-slate-500">
                  <Icon icon="ph:cursor-click-bold" className="h-8 w-8 text-slate-600" />
                  <span>Click &quot;Run in Browser&quot; above to execute snippet</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Framework Quickstarts */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Icon icon="ph:stack-bold" className="h-6 w-6 text-indigo-400" />
          Framework Quickstarts
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Next.js App Router */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Icon icon="simple-icons:nextdotjs" className="h-5 w-5 text-slate-200" />
              Next.js 15 App Router (Server Component)
            </div>
            <p className="text-xs text-slate-400">
              Fetch data directly on the server with zero client overhead:
            </p>
            <CodeBlock
              language="typescript"
              code={`import { PlaygroundClient } from 'playground-api';

const api = new PlaygroundClient({
  apiUrl: process.env.PLAYGROUND_API_URL || '${config.apiUrl}'
});

export default async function PostsPage() {
  const { data: posts } = await api.posts.list({ limit: 10 });

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}`}
            />
          </div>

          {/* React Client Hook */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Icon icon="simple-icons:react" className="h-5 w-5 text-cyan-400" />
              React Client Hook (`usePlaygroundApi`)
            </div>
            <p className="text-xs text-slate-400">
              Use with React state, SWR, or TanStack Query:
            </p>
            <CodeBlock
              language="typescript"
              code={`'use client';
import { useEffect, useState } from 'react';
import { PlaygroundClient, Post } from 'playground-api';

const api = new PlaygroundClient({ apiUrl: '${config.apiUrl}' });

export function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    api.posts.list({ limit: 5 }).then(res => setPosts(res.data));
  }, []);

  return <div>Loaded {posts.length} posts</div>;
}`}
            />
          </div>

          {/* Vue 3 Composition API */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Icon icon="simple-icons:vuedotjs" className="h-5 w-5 text-emerald-400" />
              Vue 3 (Composition API & Pinia)
            </div>
            <p className="text-xs text-slate-400">
              Reactive data fetching in Vue 3 script setup:
            </p>
            <CodeBlock
              language="typescript"
              code={`<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { PlaygroundClient, Post } from 'playground-api';

const api = new PlaygroundClient({ apiUrl: '${config.apiUrl}' });
const posts = ref<Post[]>([]);

onMounted(async () => {
  const res = await api.posts.list({ limit: 5 });
  posts.value = res.data;
});
</script>`}
            />
          </div>

          {/* Node.js / Express Backend */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Icon icon="simple-icons:nodedotjs" className="h-5 w-5 text-green-400" />
              Node.js Proxy / Microservice
            </div>
            <p className="text-xs text-slate-400">
              Forward session identity headers across microservices:
            </p>
            <CodeBlock
              language="typescript"
              code={`import { PlaygroundClient } from 'playground-api';

const api = new PlaygroundClient({
  apiUrl: '${config.apiUrl}',
  identityToken: '550e8400-e29b-41d4-a716-446655440000',
  defaultHeaders: { 'X-Custom-Header': 'Service-A' }
});

const user = await api.users.get(1);`}
            />
          </div>
        </div>
      </div>

      {/* Client Options & Methods Reference */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Icon icon="ph:table-bold" className="h-6 w-6 text-indigo-400" />
          Client Configuration Options
        </h2>
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Option</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Default</th>
                <th className="px-4 py-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr>
                <td className="px-4 py-3 text-indigo-300">apiUrl</td>
                <td className="px-4 py-3 text-cyan-400">string</td>
                <td className="px-4 py-3 text-slate-500">&apos;http://localhost:3000/api/v1&apos;</td>
                <td className="px-4 py-3 font-sans text-slate-300">Base API URL for all REST and GraphQL requests.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-indigo-300">identityToken</td>
                <td className="px-4 py-3 text-cyan-400">string</td>
                <td className="px-4 py-3 text-slate-500">undefined</td>
                <td className="px-4 py-3 font-sans text-slate-300">Explicit session UUID (auto-sent as <code className="text-indigo-400">X-Playground-Identity</code> in Node/SSR).</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-indigo-300">delay</td>
                <td className="px-4 py-3 text-cyan-400">number</td>
                <td className="px-4 py-3 text-slate-500">undefined</td>
                <td className="px-4 py-3 font-sans text-slate-300">Global artificial delay in milliseconds (<code className="text-indigo-400">X-Simulate-Delay</code>).</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-indigo-300">chaos</td>
                <td className="px-4 py-3 text-cyan-400">number</td>
                <td className="px-4 py-3 text-slate-500">undefined</td>
                <td className="px-4 py-3 font-sans text-slate-300">Simulate random dropouts / 500 errors rate (0.0 to 1.0).</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-indigo-300">defaultHeaders</td>
                <td className="px-4 py-3 text-cyan-400">Record&lt;string, string&gt;</td>
                <td className="px-4 py-3 text-slate-500">&#123;&#125;</td>
                <td className="px-4 py-3 font-sans text-slate-300">Custom HTTP headers included on every outgoing request.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
