import React from 'react';
import type { Metadata } from 'next';
import { Icon } from '@iconify/react';
import { siteConfig } from '@/config/site';
import { LiveDevToolsSimulator } from '@/components/docs/LiveDevToolsSimulator';

export const metadata: Metadata = {
  title: 'Browser DevTools Companion Extension — Playground API',
  description:
    'Official Chrome, Edge, and Brave DevTools Companion Extension. Test network latency, error injection, RBAC roles, and reset your sandbox without modifying frontend code.',
  keywords: [
    'playground api chrome extension',
    'devtools companion extension',
    'mock api devtools panel',
    'network latency simulator extension',
    'error injection devtools',
    'rbac role switcher extension',
    'edge add-on mock api'
  ],
  alternates: {
    canonical: `${siteConfig.url}/docs/devtools`,
  },
  openGraph: {
    title: 'Browser DevTools Companion Extension — Playground API',
    description:
      'Inspect sandbox state, toggle latency sliders, inject error codes, and reset data directly inside Chrome & Edge DevTools.',
    url: `${siteConfig.url}/docs/devtools`,
    type: 'article',
  },
};

export default function DevToolsDocsPage() {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3.5 py-1 text-xs font-semibold text-purple-400">
          <Icon icon="ph:browsers-bold" className="h-3.5 w-3.5" />
          Official Browser Extension
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
          Browser DevTools Companion Extension
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Embed an official <span className="text-foreground font-semibold">Playground API</span> panel directly inside Chrome, Edge, Brave, and Arc Developer Tools (<code className="text-purple-300 font-mono">F12</code>). Throttling, error simulation, RBAC role switches, and 1-click sandbox resets without writing a single line of header code.
        </p>
      </div>

      {/* Interactive Simulator */}
      <section>
        <LiveDevToolsSimulator />
      </section>

      {/* Download & Installation Options */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Icon icon="ph:download-simple-bold" className="h-5 w-5 text-purple-400" />
          Get the Extension
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Direct ZIP Download */}
          <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-purple-300 font-semibold text-sm">
                <Icon icon="ph:file-zip-bold" className="h-5 w-5" />
                Direct ZIP Bundle
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Download the store-ready Manifest V3 extension bundle to load unpacked in 5 seconds.
              </p>
            </div>
            <a
              href="/downloads/playground-api-extension.zip"
              download
              className="w-full rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs py-2.5 px-3 shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 transition-all text-center"
            >
              <Icon icon="ph:download-bold" className="h-4 w-4" />
              Download Extension (.zip)
            </a>
          </div>

          {/* Chrome Web Store */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                <Icon icon="logos:chrome" className="h-4 w-4" />
                Chrome Web Store
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Install directly from the official Chrome Web Store with automatic background updates.
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-background/60 py-2.5 px-3 text-center text-xs text-muted-foreground font-medium flex items-center justify-center gap-2">
              <Icon icon="ph:clock-bold" className="h-4 w-4 text-purple-400" />
              Store Review Pending
            </div>
          </div>

          {/* Microsoft Edge Add-ons */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                <Icon icon="logos:microsoft-edge" className="h-4 w-4" />
                Microsoft Edge Add-ons
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Available for Microsoft Edge with native enterprise policy integration.
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-background/60 py-2.5 px-3 text-center text-xs text-muted-foreground font-medium flex items-center justify-center gap-2">
              <Icon icon="ph:clock-bold" className="h-4 w-4 text-purple-400" />
              Store Review Pending
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Installation Guide */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Icon icon="ph:wrench-bold" className="h-5 w-5 text-purple-400" />
          5-Second &quot;Load Unpacked&quot; Installation Guide
        </h2>

        <div className="space-y-3">
          <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/40 p-4">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-xs font-bold text-purple-400">
              1
            </span>
            <div className="space-y-1">
              <div className="text-sm font-semibold text-foreground">Download and extract the ZIP bundle</div>
              <p className="text-xs text-muted-foreground">
                Click the <span className="font-semibold text-foreground">Download Extension (.zip)</span> button above and extract the contents to a folder on your computer.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/40 p-4">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-xs font-bold text-purple-400">
              2
            </span>
            <div className="space-y-1">
              <div className="text-sm font-semibold text-foreground">Open your browser extensions page</div>
              <p className="text-xs text-muted-foreground">
                In Chrome, navigate to <code className="text-purple-300 font-mono">chrome://extensions</code> (or <code className="text-purple-300 font-mono">edge://extensions</code> in Edge, <code className="text-purple-300 font-mono">brave://extensions</code> in Brave).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/40 p-4">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-xs font-bold text-purple-400">
              3
            </span>
            <div className="space-y-1">
              <div className="text-sm font-semibold text-foreground">Enable Developer Mode & Load Unpacked</div>
              <p className="text-xs text-muted-foreground">
                Toggle on <span className="font-semibold text-foreground">Developer mode</span> in the top-right corner, click <span className="font-semibold text-foreground">Load unpacked</span>, and select the extracted extension folder.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/40 p-4">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
              ✓
            </span>
            <div className="space-y-1">
              <div className="text-sm font-semibold text-foreground">Ready to use!</div>
              <p className="text-xs text-muted-foreground">
                Open DevTools (<code className="text-purple-300 font-mono">F12</code> or Right Click &rarr; Inspect) on any web app and click the <span className="font-semibold text-foreground">&quot;Playground API&quot;</span> panel tab.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
