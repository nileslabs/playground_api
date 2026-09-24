'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

export function HeroSection() {
  const [activeAction, setActiveAction] = useState<'create' | 'fetch' | 'delay' | 'reset'>('create');
  const [loading, setLoading] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [responseStatus, setResponseStatus] = useState<string>('201 Created');

  const [baseUrl, setBaseUrl] = useState<string>(
    config.publicApiUrl || `${config.siteUrl}${config.apiUrl || '/api/v1'}`
  );

  const [consoleOutput, setConsoleOutput] = useState<any>({
    id: 101,
    title: '✨ My First Sandbox Post',
    body: 'This item was created in real-time and persists in your private session overlay!',
    user_id: 1,
    created_at: '2026-08-20T10:00:00.000Z',
    _sandbox: {
      persisted: true,
      isolated: true,
      note: 'Click "Fetch Posts" to see this record at the top of your list.',
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const apiPrefix = config.apiUrl?.startsWith('http')
        ? config.apiUrl
        : `${origin}${config.apiUrl?.startsWith('/') ? '' : '/'}${config.apiUrl || 'api/v1'}`;
      setBaseUrl(apiPrefix);
    }
  }, []);

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(`curl -X GET "${baseUrl}/posts?_limit=5"`);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleAction = async (action: 'create' | 'fetch' | 'delay' | 'reset') => {
    setActiveAction(action);
    setLoading(true);
    const start = performance.now();

    try {
      if (action === 'create') {
        const res = await fetch(`${config.apiUrl || '/api/v1'}/posts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            title: '✨ My First Sandbox Post',
            body: 'This item was created in real-time and persists in your private session overlay!',
            user_id: 1,
          }),
        });
        const data = await res.json();
        const elapsed = Math.round(performance.now() - start);
        setLatencyMs(elapsed);
        setResponseStatus('201 Created');
        setConsoleOutput(data);
      } else if (action === 'fetch') {
        const res = await fetch(`${config.apiUrl || '/api/v1'}/posts?_limit=3`, {
          credentials: 'include',
        });
        const data = await res.json();
        const elapsed = Math.round(performance.now() - start);
        setLatencyMs(elapsed);
        setResponseStatus('200 OK');
        setConsoleOutput(data);
      } else if (action === 'delay') {
        const res = await fetch(`${config.apiUrl || '/api/v1'}/posts?_limit=2&_delay=1200`, {
          credentials: 'include',
          headers: { 'X-Simulate-Delay': '1200' },
        });
        const data = await res.json();
        const elapsed = Math.round(performance.now() - start);
        setLatencyMs(elapsed);
        setResponseStatus(`200 OK (${elapsed}ms)`);
        setConsoleOutput({
          notice: 'Simulated 3G network latency injected seamlessly via header/param.',
          latency: `${elapsed}ms`,
          data: (data.data || data)[0],
        });
      } else if (action === 'reset') {
        const res = await fetch(`${config.apiUrl || '/api/v1'}/session/reset`, {
          method: 'DELETE',
          credentials: 'include',
        });
        const data = await res.json();
        const elapsed = Math.round(performance.now() - start);
        setLatencyMs(elapsed);
        setResponseStatus('200 OK (Purged)');
        setConsoleOutput({
          status: 'success',
          message: data.message || 'Session sandbox mutations purged. Baseline global data restored.',
          timestamp: new Date().toISOString(),
        });
      }
    } catch {
      const elapsed = Math.round(performance.now() - start);
      setLatencyMs(elapsed);
      setResponseStatus('200 OK (Local Sample)');
      setConsoleOutput({
        endpoint: `${baseUrl}/posts`,
        action,
        status: 'Sample response displayed',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden py-14 lg:py-24 border-b border-border-default bg-bg-canvas">
      {/* Background Radial Glow Mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Value Proposition & Developer CTAs (Cols 6/12) */}
          <div className="lg:col-span-6 space-y-7 text-left">
            {/* Category Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold tracking-wide">
              <Icon icon="ph:terminal-window-bold" className="w-3.5 h-3.5" />
              <span>Stateful REST & GraphQL Mock Cloud</span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-text-primary leading-[1.12]">
                Zero-Config Stateful Mock API for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-indigo-400 to-cyan-400">
                  Frontend Prototypes
                </span>
              </h1>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl">
                Build real CRUD applications with persistent private session overlays, JWT auth token loops, 3DS payment gateways, and network chaos injection — zero database required.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-1 text-xs text-text-secondary font-medium">
              <div className="flex items-center gap-2">
                <Icon icon="ph:check-circle-fill" className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real CRUD State Persistence</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="ph:check-circle-fill" className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Unified REST & GraphQL</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="ph:check-circle-fill" className="w-4 h-4 text-amber-400 shrink-0" />
                <span>JWT Auth & Bearer Loops</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="ph:check-circle-fill" className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Zero DB or API Key Setup</span>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/docs/introduction"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-sm font-bold shadow-lg shadow-brand-primary/20 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
              >
                <Icon icon="ph:book-open-text-bold" className="w-4 h-4" />
                <span>Explore Docs</span>
              </Link>
              <Link
                href="/docs/studio"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-bg-surface hover:bg-bg-elevated border border-border-default text-text-primary text-sm font-bold transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
              >
                <Icon icon="ph:play-circle-bold" className="w-4 h-4 text-brand-primary" />
                <span>Interactive Studio</span>
              </Link>
              <Link
                href="/docs/showcase"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-bg-surface hover:bg-bg-elevated border border-border-default text-text-secondary hover:text-text-primary text-sm font-medium transition-all"
              >
                <Icon icon="ph:rocket-launch-bold" className="w-4 h-4 text-emerald-400" />
                <span>React Showcase</span>
              </Link>
            </div>

            {/* Quick cURL Bar */}
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-bg-surface border border-border-default max-w-lg font-mono text-xs text-text-secondary shadow-sm">
              <div className="flex items-center gap-2 truncate">
                <span className="text-brand-primary font-bold select-none">$</span>
                <span className="truncate text-text-primary">curl {baseUrl}/posts</span>
              </div>
              <button
                onClick={handleCopyCurl}
                className="px-2.5 py-1 rounded-lg bg-bg-elevated hover:bg-border-default text-[11px] font-sans font-semibold text-text-primary transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
                title="Copy cURL Command"
              >
                <Icon icon={copiedCurl ? 'ph:check-bold' : 'ph:copy-bold'} className="w-3.5 h-3.5 text-brand-primary" />
                <span>{copiedCurl ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Social / Baseline Badges */}
            <div className="flex items-center gap-3 text-xs text-text-muted pt-1 font-mono">
              <span className="flex items-center gap-1 text-text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                100+ Baseline Records
              </span>
              <span>•</span>
              <span>Zero Auth Required</span>
              <span>•</span>
              <span className="text-brand-primary font-semibold">100% Free</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Interactive IDE Console Widget (Cols 6/12) */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl border border-border-default shadow-2xl bg-bg-surface/90 backdrop-blur-md overflow-hidden">
              
              {/* Window Titlebar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-bg-elevated/70">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 font-mono text-xs font-semibold text-text-secondary">
                    sandbox-session.json
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {latencyMs !== null && (
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-bg-surface text-text-secondary border border-border-subtle">
                      ⚡ {latencyMs}ms
                    </span>
                  )}
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    ● Live Sandbox
                  </span>
                </div>
              </div>

              {/* 4 Interactive Test Step Buttons */}
              <div className="p-3 border-b border-border-subtle bg-bg-terminal/40">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => handleAction('create')}
                    disabled={loading}
                    className={`px-3 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer text-left border flex flex-col gap-0.5 active:scale-95 ${
                      activeAction === 'create'
                        ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                        : 'bg-bg-surface hover:bg-bg-elevated text-text-secondary border-border-default hover:text-text-primary'
                    }`}
                  >
                    <span className="text-[9px] uppercase tracking-wider opacity-75 font-sans font-medium">1. Mutate</span>
                    <span className="truncate">POST /posts</span>
                  </button>

                  <button
                    onClick={() => handleAction('fetch')}
                    disabled={loading}
                    className={`px-3 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer text-left border flex flex-col gap-0.5 active:scale-95 ${
                      activeAction === 'fetch'
                        ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                        : 'bg-bg-surface hover:bg-bg-elevated text-text-secondary border-border-default hover:text-text-primary'
                    }`}
                  >
                    <span className="text-[9px] uppercase tracking-wider opacity-75 font-sans font-medium">2. Verify</span>
                    <span className="truncate">GET /posts</span>
                  </button>

                  <button
                    onClick={() => handleAction('delay')}
                    disabled={loading}
                    className={`px-3 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer text-left border flex flex-col gap-0.5 active:scale-95 ${
                      activeAction === 'delay'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                        : 'bg-bg-surface hover:bg-bg-elevated text-text-secondary border-border-default hover:text-text-primary'
                    }`}
                  >
                    <span className="text-[9px] uppercase tracking-wider opacity-75 font-sans font-medium">3. Latency</span>
                    <span className="truncate">?_delay=1200</span>
                  </button>

                  <button
                    onClick={() => handleAction('reset')}
                    disabled={loading}
                    className={`px-3 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer text-left border flex flex-col gap-0.5 active:scale-95 ${
                      activeAction === 'reset'
                        ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                        : 'bg-bg-surface hover:bg-bg-elevated text-text-secondary border-border-default hover:text-text-primary'
                    }`}
                  >
                    <span className="text-[9px] uppercase tracking-wider opacity-75 font-sans font-medium">4. Purge</span>
                    <span className="truncate">Reset State</span>
                  </button>
                </div>
              </div>

              {/* Status Header Bar above Output */}
              <div className="px-4 py-2 bg-bg-surface/50 border-b border-border-subtle flex items-center justify-between text-[11px] font-mono text-text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                  <span>Status: <strong className="text-text-primary">{responseStatus}</strong></span>
                </span>
                <span>Format: JSON</span>
              </div>

              {/* Response Code Block Terminal */}
              <div className="relative">
                {loading && (
                  <div className="absolute inset-0 bg-bg-canvas/80 backdrop-blur-xs flex items-center justify-center z-10">
                    <div className="flex items-center gap-2 text-xs font-bold text-brand-primary bg-bg-surface px-4 py-2.5 rounded-xl border border-border-default shadow-xl">
                      <Icon icon="ph:spinner-bold" className="w-4 h-4 animate-spin" />
                      <span>Executing sandbox query...</span>
                    </div>
                  </div>
                )}
                <CodeBlock
                  code={consoleOutput}
                  language="json"
                  maxHeight="max-h-[19rem]"
                  showLineNumbers={true}
                  className="rounded-none border-0"
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

