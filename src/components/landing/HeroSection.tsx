'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

interface PresetEndpoint {
  id: string;
  label: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  body?: any;
  description: string;
}

const PRESETS: PresetEndpoint[] = [
  {
    id: 'get-posts',
    label: 'GET /posts',
    method: 'GET',
    path: '/posts?_limit=3',
    description: 'Fetch paginated blog posts',
  },
  {
    id: 'post-post',
    label: 'POST /posts',
    method: 'POST',
    path: '/posts',
    body: {
      title: 'Hello from Playground API',
      body: 'This item persists across page reloads in your private sandbox session.',
      user_id: 1,
    },
    description: 'Create a post that persists in your session',
  },
  {
    id: 'get-user',
    label: 'GET /users/1',
    method: 'GET',
    path: '/users/1',
    description: 'Fetch user profile with address and avatar',
  },
  {
    id: 'delay-test',
    label: 'GET /posts?_delay=1200',
    method: 'GET',
    path: '/posts?_limit=2&_delay=1200',
    description: 'Simulate 1.2s slow 3G network latency',
  },
  {
    id: 'auth-login',
    label: 'POST /auth/login',
    method: 'POST',
    path: '/auth/login',
    body: {
      username: 'Bret',
      password: 'Password@123',
    },
    description: 'Simulate JWT authentication and receive Bearer token',
  },
  {
    id: 'reset-session',
    label: 'DELETE /session/reset',
    method: 'DELETE',
    path: '/session/reset',
    description: 'Purge sandbox mutations and restore baseline records',
  },
];

export function HeroSection() {
  const [selectedPreset, setSelectedPreset] = useState<PresetEndpoint>(PRESETS[0]);
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [endpointPath, setEndpointPath] = useState<string>('/posts?_limit=3');
  const [requestBodyText, setRequestBodyText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(42);
  const [responseStatus, setResponseStatus] = useState<string>('200 OK');
  const [copiedResponse, setCopiedResponse] = useState<boolean>(false);

  const [baseUrl, setBaseUrl] = useState<string>(
    config.publicApiUrl || `${config.siteUrl}${config.apiUrl || '/api/v1'}`
  );

  const [responseOutput, setResponseOutput] = useState<any>([
    {
      id: 1,
      title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
      body: 'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto',
      user_id: 1,
    },
    {
      id: 2,
      title: 'qui est esse',
      body: 'est rerum tempore vitae sequi sint nihil reprehenderit dolor beatae ea dolores neque fugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis',
      user_id: 1,
    },
    {
      id: 3,
      title: 'ea molestias quasi exercitationem repellat qui ipsa sit aut',
      body: 'et iusto sed quo iure voluptatem occaecati omnis eligendi aut ad voluptatem doloribus vel accusantium quis pariatur molestiae porro eius odio et labore et velit aut',
      user_id: 1,
    },
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const apiPrefix = config.apiUrl?.startsWith('http')
        ? config.apiUrl
        : `${origin}${config.apiUrl?.startsWith('/') ? '' : '/'}${config.apiUrl || 'api/v1'}`;
      setBaseUrl(apiPrefix);
    }
  }, []);

  const handleSelectPreset = (preset: PresetEndpoint) => {
    setSelectedPreset(preset);
    setMethod(preset.method);
    setEndpointPath(preset.path);
    if (preset.body) {
      setRequestBodyText(JSON.stringify(preset.body, null, 2));
    } else {
      setRequestBodyText('');
    }
    // Auto execute request on preset select
    executeRequest(preset.method, preset.path, preset.body);
  };

  const executeRequest = async (
    reqMethod = method,
    reqPath = endpointPath,
    reqBody = requestBodyText ? tryParseJson(requestBodyText) : undefined
  ) => {
    setLoading(true);
    const start = performance.now();
    const cleanPath = reqPath.startsWith('/') ? reqPath : `/${reqPath}`;
    const url = `${baseUrl}${cleanPath}`;

    try {
      const options: RequestInit = {
        method: reqMethod,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (reqBody && (reqMethod === 'POST' || reqMethod === 'PUT')) {
        options.body = typeof reqBody === 'string' ? reqBody : JSON.stringify(reqBody);
      }

      const res = await fetch(url, options);
      const elapsed = Math.round(performance.now() - start);
      setLatencyMs(elapsed);
      setResponseStatus(`${res.status} ${res.statusText}`);

      const data = await res.json();
      setResponseOutput(data);
    } catch {
      const elapsed = Math.round(performance.now() - start);
      setLatencyMs(elapsed);
      setResponseStatus('200 OK');
      setResponseOutput({
        status: 'simulated_fallback',
        url,
        method: reqMethod,
        note: 'Displaying offline fallback data.',
      });
    } finally {
      setLoading(false);
    }
  };

  const tryParseJson = (str: string) => {
    try {
      return JSON.parse(str);
    } catch {
      return str;
    }
  };

  const handleCopyResponse = () => {
    if (!responseOutput) return;
    navigator.clipboard.writeText(JSON.stringify(responseOutput, null, 2));
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  const getMethodBadgeClass = (m: string) => {
    switch (m) {
      case 'POST':
        return 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-600/30';
      case 'DELETE':
        return 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-600/30';
      default:
        return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-600/30';
    }
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 border-b border-border-theme bg-bg-primary">
      {/* Background Accent Radial Glow */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-200 h-96 bg-accent-primary/8 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* CENTERED HERO HEADER */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-[4.25rem] font-black tracking-tight text-text-primary leading-[1.08]">
            The mock API that{' '}
            <span className="text-accent-primary underline decoration-accent-primary/35 decoration-wavy underline-offset-8">
              remembers.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto font-normal">
            Build realistic frontend applications before your backend exists. Create, update, and delete data with isolated browser sessions that actually persist.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/docs/studio"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-accent-primary hover:bg-accent-hover text-white text-base sm:text-lg font-bold shadow-lg shadow-accent-primary/25 transition-all hover:scale-[1.02]"
            >
              <Icon icon="ph:play-circle-bold" className="w-5 h-5" />
              <span>Try Playground</span>
            </Link>
            <Link
              href="/docs/introduction"
              className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-text-primary text-base sm:text-lg font-bold transition-all hover:scale-[1.02]"
            >
              <Icon icon="ph:book-open-text-bold" className="w-5 h-5 text-accent-primary" />
              <span>Read Docs</span>
            </Link>
          </div>

          {/* Quick Value Points */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-sm text-text-secondary pt-3 font-medium">
            <span className="flex items-center gap-2">
              <Icon icon="ph:check-circle-fill" className="w-4.5 h-4.5 text-accent-primary shrink-0" />
              <span>Zero signup</span>
            </span>
            <span className="flex items-center gap-2">
              <Icon icon="ph:check-circle-fill" className="w-4.5 h-4.5 text-accent-primary shrink-0" />
              <span>No API key required</span>
            </span>
            <span className="flex items-center gap-2">
              <Icon icon="ph:check-circle-fill" className="w-4.5 h-4.5 text-accent-primary shrink-0" />
              <span>Persistent per-visitor mutations</span>
            </span>
          </div>
        </div>

        {/* INTERACTIVE API RUNNER SANDBOX */}
        <div className="rounded-2xl border border-border-theme bg-bg-secondary shadow-2xl overflow-hidden">
          
          {/* Sandbox Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-border-theme bg-bg-tertiary/60">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-mono text-xs sm:text-sm font-bold text-text-primary">
                Interactive API Explorer
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              {latencyMs !== null && (
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-bg-primary text-text-secondary border border-border-theme">
                  ⚡ {latencyMs}ms
                </span>
              )}
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-accent-light text-accent-primary border border-accent-primary/25 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                Live Session
              </span>
            </div>
          </div>

          {/* Preset Endpoint Chips */}
          <div className="p-4 border-b border-border-theme bg-bg-primary/50">
            <div className="text-xs font-mono font-semibold text-text-muted mb-2.5 flex items-center justify-between">
              <span>Quick Presets — click to test real endpoints:</span>
              <span className="text-[11px] text-text-muted hidden sm:inline">All mutations persist in your session</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {PRESETS.map((preset) => {
                const isActive = selectedPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-accent-primary text-white border-accent-primary shadow-xs font-bold'
                        : 'bg-bg-secondary hover:bg-bg-tertiary text-text-secondary border-border-theme'
                    }`}
                    title={preset.description}
                  >
                    <span className="text-[10px] opacity-75 font-sans">{preset.method}</span>
                    <span>{preset.path.split('?')[0]}</span>
                    {preset.path.includes('?') && (
                      <span className="text-[10px] opacity-60">?{preset.path.split('?')[1]}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* URL Execution Bar */}
          <div className="p-4 border-b border-border-theme bg-bg-secondary flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0 bg-bg-primary rounded-xl border border-border-theme px-3.5 py-2 font-mono text-xs sm:text-sm">
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getMethodBadgeClass(method)}`}>
                {method}
              </span>
              <span className="text-text-muted select-none truncate hidden md:inline">
                {baseUrl}
              </span>
              <input
                type="text"
                value={endpointPath}
                onChange={(e) => setEndpointPath(e.target.value)}
                className="flex-1 bg-transparent text-text-primary focus:outline-hidden font-mono text-xs sm:text-sm"
                placeholder="/posts"
              />
            </div>

            <button
              onClick={() => executeRequest()}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-accent-primary hover:bg-accent-hover text-white text-xs sm:text-sm font-bold shadow-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {loading ? (
                <>
                  <Icon icon="ph:spinner-bold" className="w-4 h-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Icon icon="ph:paper-plane-tilt-bold" className="w-4 h-4" />
                  <span>Send Request</span>
                </>
              )}
            </button>
          </div>

          {/* Request Payload (shown when POST/PUT has body) */}
          {selectedPreset.body && method === 'POST' && (
            <div className="p-4 border-b border-border-theme bg-bg-tertiary/20">
              <div className="text-xs font-mono font-semibold text-text-muted mb-1.5 flex items-center gap-1.5">
                <Icon icon="ph:arrow-fat-line-up-bold" className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Request Payload (JSON Body):</span>
              </div>
              <div className="p-3 rounded-xl bg-code-bg border border-border-theme font-mono text-xs text-text-secondary overflow-x-auto">
                <pre>{requestBodyText}</pre>
              </div>
            </div>
          )}

          {/* Response Inspector Header */}
          <div className="px-5 py-2.5 bg-bg-tertiary/40 border-b border-border-theme flex items-center justify-between text-xs font-mono text-text-secondary">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-accent-primary" />
                <span>Response: <strong className="text-accent-primary">{responseStatus}</strong></span>
              </span>
              <span className="text-text-muted hidden sm:inline">· application/json</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyResponse}
                className="text-text-muted hover:text-text-primary transition-colors flex items-center gap-1 cursor-pointer text-xs"
                title="Copy JSON Response"
              >
                <Icon icon={copiedResponse ? 'ph:check-bold' : 'ph:copy-bold'} className="w-3.5 h-3.5 text-accent-primary" />
                <span>{copiedResponse ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Terminal Code Display */}
          <div className="relative">
            {loading && (
              <div className="absolute inset-0 bg-bg-primary/75 backdrop-blur-xs flex items-center justify-center z-10">
                <div className="flex items-center gap-2.5 text-sm font-bold text-accent-primary bg-bg-secondary px-4 py-2.5 rounded-xl border border-border-theme shadow-xl font-mono">
                  <Icon icon="ph:spinner-bold" className="w-4 h-4 animate-spin" />
                  <span>Executing live request...</span>
                </div>
              </div>
            )}
            <CodeBlock
              code={responseOutput}
              language="json"
              maxHeight="max-h-[22rem]"
              showLineNumbers={true}
              className="rounded-none border-0 text-xs sm:text-sm"
            />
          </div>

        </div>

      </div>
    </section>
  );
}

export default HeroSection;
