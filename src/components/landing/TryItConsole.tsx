'use client';

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

export interface TryItPreset {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  description: string;
  body?: Record<string, unknown>;
  defaultOutput?: unknown;
}

const PRESETS: TryItPreset[] = [
  {
    id: 'posts-single',
    name: 'Single Post',
    method: 'GET',
    endpoint: '/posts/1',
    description: 'Fetch post #1 with author details and comment counts',
    defaultOutput: {
      id: 1,
      user_id: 1,
      title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
      body: 'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto',
      created_at: '2026-01-15T08:30:00.000Z',
    },
  },
  {
    id: 'posts-paginated',
    name: 'Paginated Posts',
    method: 'GET',
    endpoint: '/posts?_limit=5',
    description: 'Query first 5 posts with pagination metadata',
  },
  {
    id: 'comments-filter',
    name: 'Post Comments',
    method: 'GET',
    endpoint: '/comments?post_id=1',
    description: 'Filter comments belonging to post #1',
  },
  {
    id: 'users-single',
    name: 'User Profile',
    method: 'GET',
    endpoint: '/users/1',
    description: 'Get user #1 with nested address, company, and geo coordinates',
  },
  {
    id: 'todos-filter',
    name: 'Filtered Todos',
    method: 'GET',
    endpoint: '/todos?completed=false',
    description: 'Retrieve pending uncompleted todo tasks',
  },
  {
    id: 'products-list',
    name: 'Products Catalog',
    method: 'GET',
    endpoint: '/products?_limit=4',
    description: 'Fetch e-commerce product catalog with prices and ratings',
  },
  {
    id: 'carts-single',
    name: 'Shopping Cart',
    method: 'GET',
    endpoint: '/carts/1',
    description: 'Fetch active user shopping cart with item totals',
  },
  {
    id: 'auth-login',
    name: 'Auth Login',
    method: 'POST',
    endpoint: '/auth/login',
    description: 'Authenticate user credentials and receive signed JWT token',
    body: {
      email: 'alex.rivera@example.com',
      password: 'password123',
    },
  },
  {
    id: 'payments-charge',
    name: '3DS Card Charge',
    method: 'POST',
    endpoint: '/payments/charge',
    description: 'Simulate instant 3D-Secure credit card authorization',
    body: {
      amount: 4999,
      currency: 'usd',
      card_number: '4000000000003022',
      cvv: '123',
      exp: '12/28',
    },
  },
];

export function TryItConsole() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('posts-single');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [endpoint, setEndpoint] = useState<string>('/posts/1');
  const [requestBody, setRequestBody] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<string>('200 OK');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [responseOutput, setResponseOutput] = useState<unknown>(PRESETS[0].defaultOutput);
  const [hasExecuted, setHasExecuted] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  // Compute full display URL
  const [displayBaseUrl, setDisplayBaseUrl] = useState<string>(
    config.publicApiUrl || `${config.siteUrl}${config.apiUrl || '/api/v1'}`
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const apiPrefix = config.apiUrl?.startsWith('http')
        ? config.apiUrl
        : `${origin}${config.apiUrl?.startsWith('/') ? '' : '/'}${config.apiUrl || 'api/v1'}`;
      setDisplayBaseUrl(apiPrefix);

      // Listen for external "try-route" events dispatched from RoutesTable or Schema visualizer
      const handleTryRoute = (e: CustomEvent<{ endpoint: string; method?: 'GET' | 'POST' | 'PUT' | 'DELETE' }>) => {
        const { endpoint: targetEndpoint, method: targetMethod = 'GET' } = e.detail || {};
        if (targetEndpoint) {
          // Normalize leading slash
          const cleanEndpoint = targetEndpoint.startsWith('/') ? targetEndpoint : `/${targetEndpoint}`;
          setEndpoint(cleanEndpoint);
          setMethod(targetMethod);

          // Find if matches a preset
          const matched = PRESETS.find((p) => p.endpoint === cleanEndpoint && p.method === targetMethod);
          if (matched) {
            setSelectedPresetId(matched.id);
            setRequestBody(matched.body ? JSON.stringify(matched.body, null, 2) : '');
          } else {
            setSelectedPresetId('');
            setRequestBody('');
          }

          // Scroll console smoothly into view
          const el = document.getElementById('try-it-console');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      };

      window.addEventListener('playground:try-route' as any, handleTryRoute as any);
      return () => {
        window.removeEventListener('playground:try-route' as any, handleTryRoute as any);
      };
    }
  }, []);

  // Handle Preset Select
  const handleSelectPreset = (preset: TryItPreset) => {
    setSelectedPresetId(preset.id);
    setMethod(preset.method);
    setEndpoint(preset.endpoint);
    setRequestBody(preset.body ? JSON.stringify(preset.body, null, 2) : '');
    if (preset.defaultOutput && !hasExecuted) {
      setResponseOutput(preset.defaultOutput);
    }
  };

  // Generate JavaScript fetch code string for CodeBlock display
  const generateScriptCode = useCallback(() => {
    const fullUrl = `${displayBaseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    if (method === 'GET') {
      return `// Try it! Run this live code in your browser:\nfetch('${fullUrl}')\n  .then(response => response.json())\n  .then(json => console.log(json));`;
    }

    let parsedBody = {};
    try {
      if (requestBody.trim()) {
        parsedBody = JSON.parse(requestBody);
      }
    } catch {
      parsedBody = { raw: requestBody };
    }

    return `// Try it! Run this live POST mutation in your browser:\nfetch('${fullUrl}', {\n  method: '${method}',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify(${JSON.stringify(parsedBody, null, 4).replace(/\n/g, '\n  ')})\n})\n  .then(response => response.json())\n  .then(json => console.log(json));`;
  }, [displayBaseUrl, endpoint, method, requestBody]);

  // Execute Live Script Request
  const handleRunScript = async () => {
    setLoading(true);
    setHasExecuted(true);
    const start = performance.now();

    try {
      // Build request URL using runtime config.apiUrl
      const targetPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      const url = `${config.apiUrl || '/api/v1'}${targetPath}`;

      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      };

      if (method !== 'GET' && requestBody.trim()) {
        options.body = requestBody;
      }

      const res = await fetch(url, options);
      const elapsed = Math.round(performance.now() - start);
      setLatencyMs(elapsed);
      setResponseStatus(`${res.status} ${res.statusText || (res.ok ? 'OK' : 'Error')}`);

      const data = await res.json();
      startTransition(() => {
        setResponseOutput(data);
      });
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - start);
      setLatencyMs(elapsed);
      setResponseStatus('500 Client Fetch Error');
      setResponseOutput({
        error: true,
        message: err.message || 'Failed to dispatch request to mock endpoint.',
        hint: 'Check your network connection or verify endpoint URL.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to execute
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunScript();
    }
  };

  return (
    <section id="try-it-console" className="py-16 bg-bg-canvas border-b border-border-default relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold uppercase tracking-wider mb-3">
            <Icon icon="ph:play-circle-bold" className="w-4 h-4" />
            <span>Interactive Live Console</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Try It Yourself
          </h2>
          <p className="mt-3 text-sm sm:text-base text-text-secondary leading-relaxed">
            Run real HTTP requests directly against our live mock cloud. Switch between resources, modify endpoints, and inspect formatted JSON responses in real-time.
          </p>
        </div>

        {/* Resource Selector Dropdown / Pills (DummyJSON + JSONPlaceholder Inspired) */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all shrink-0 flex items-center gap-2 cursor-pointer border ${
                  isSelected
                    ? 'bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/20 scale-[1.02]'
                    : 'bg-bg-surface hover:bg-bg-elevated text-text-secondary hover:text-text-primary border-border-default'
                }`}
              >
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    preset.method === 'GET'
                      ? isSelected ? 'bg-white/20 text-white' : 'bg-emerald-500/15 text-emerald-400'
                      : isSelected ? 'bg-white/20 text-white' : 'bg-indigo-500/15 text-indigo-400'
                  }`}
                >
                  {preset.method}
                </span>
                <span>{preset.name}</span>
              </button>
            );
          })}
        </div>

        {/* Dual-Pane Console Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" onKeyDown={handleKeyDown}>
          
          {/* LEFT PANE: Script Editor & Run Bar (Cols 6/12) */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <div className="rounded-2xl border border-border-default bg-bg-surface shadow-xl overflow-hidden">
              
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-bg-elevated/70 border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 font-mono text-xs font-semibold text-text-secondary">
                    script.js
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-text-muted">
                  <span className="hidden sm:inline">Shortcut:</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-bg-surface border border-border-default text-[10px] text-text-primary">
                    Ctrl + Enter
                  </kbd>
                </div>
              </div>

              {/* Editable Endpoint Input Bar */}
              <div className="p-3 bg-bg-canvas/50 border-b border-border-subtle flex items-center gap-2">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg bg-bg-elevated border border-border-default text-xs font-mono font-bold text-brand-primary outline-none cursor-pointer"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>

                <div className="flex-1 flex items-center bg-bg-surface border border-border-default rounded-lg px-3 py-1.5 font-mono text-xs">
                  <span className="text-text-muted select-none hidden sm:inline">/api/v1</span>
                  <input
                    type="text"
                    value={endpoint}
                    onChange={(e) => {
                      setEndpoint(e.target.value);
                      setSelectedPresetId('');
                    }}
                    placeholder="/posts/1"
                    className="w-full bg-transparent text-text-primary outline-none ml-1 placeholder:text-text-muted"
                  />
                </div>
              </div>

              {/* Script Code Viewer */}
              <div className="p-1">
                <CodeBlock
                  code={generateScriptCode()}
                  language="javascript"
                  maxHeight="max-h-[16rem]"
                  showLineNumbers={true}
                  showHeader={false}
                  className="rounded-none border-0"
                />
              </div>

              {/* Prominent Run Script Button Footer */}
              <div className="p-3 bg-bg-elevated/50 border-t border-border-subtle flex items-center justify-between">
                <span className="text-xs text-text-secondary truncate pr-2">
                  {PRESETS.find((p) => p.id === selectedPresetId)?.description || 'Custom endpoint query'}
                </span>

                <button
                  onClick={handleRunScript}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold shadow-lg shadow-brand-primary/25 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {loading ? (
                    <>
                      <Icon icon="ph:spinner-bold" className="w-4 h-4 animate-spin" />
                      <span>Running...</span>
                    </>
                  ) : (
                    <>
                      <Icon icon="ph:play-fill" className="w-4 h-4 text-emerald-300" />
                      <span>Run Script</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>

          {/* RIGHT PANE: Live Response Output (Cols 6/12) */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <div className="rounded-2xl border border-border-default bg-bg-surface shadow-xl overflow-hidden flex flex-col">
              
              {/* Output Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-bg-elevated/70 border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <Icon icon="ph:brackets-curly-bold" className="w-4 h-4 text-brand-primary" />
                  <span className="font-mono text-xs font-semibold text-text-secondary">
                    Response Output
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {latencyMs !== null && (
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-bg-surface text-text-secondary border border-border-subtle flex items-center gap-1">
                      <Icon icon="ph:lightning-bold" className="w-3 h-3 text-amber-400" />
                      {latencyMs}ms
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                      responseStatus.startsWith('2')
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/15 text-rose-400 border-rose-500/20'
                    }`}
                  >
                    {responseStatus}
                  </span>
                </div>
              </div>

              {/* JSON Response Terminal Body */}
              <div className="relative min-h-[19rem]">
                {loading && (
                  <div className="absolute inset-0 bg-bg-canvas/80 backdrop-blur-xs flex items-center justify-center z-10">
                    <div className="flex items-center gap-2 text-xs font-bold text-brand-primary bg-bg-surface px-4 py-2.5 rounded-xl border border-border-default shadow-xl">
                      <Icon icon="ph:spinner-bold" className="w-4 h-4 animate-spin" />
                      <span>Fetching live response...</span>
                    </div>
                  </div>
                )}

                <CodeBlock
                  code={responseOutput}
                  language="json"
                  maxHeight="max-h-[20.5rem]"
                  showLineNumbers={true}
                  showHeader={false}
                  copyable={true}
                  className="rounded-none border-0"
                />
              </div>

              {/* Success Callout Note (JSONPlaceholder style) */}
              <div className="px-4 py-2.5 bg-bg-elevated/40 border-t border-border-subtle flex items-center justify-between text-xs text-text-secondary">
                <span className="flex items-center gap-1.5">
                  <Icon icon="ph:sparkle-fill" className="w-4 h-4 text-emerald-400" />
                  <span>
                    {hasExecuted
                      ? "Congrats! You've made a live call to Playground API. 😃 🎉"
                      : 'Click "Run Script" to execute this live against our backend.'}
                  </span>
                </span>
                <span className="font-mono text-[11px] text-text-muted">JSON</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
