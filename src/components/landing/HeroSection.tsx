'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export function HeroSection() {
  const [copied, setCopied] = useState(false);
  const curlCmd = 'curl https://playground.nileslabs.com/api/v1/posts';

  const handleCopy = () => {
    navigator.clipboard.writeText(curlCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 bg-white border-b border-slate-100">
      {/* Subtle background radial aura for depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-50/60 via-slate-50/20 to-transparent pointer-events-none -z-10" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Status Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-100/90 text-xs font-semibold text-indigo-700 shadow-xs">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          <span>The Zero-Login Stateful Mock API</span>
          <span className="text-indigo-300">•</span>
          <span className="font-normal text-indigo-600">REST, GraphQL & WebSockets</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
          Mock APIs where mutations <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-900 bg-clip-text text-transparent">
            actually persist
          </span>
        </h1>

        {/* Crisp, Scannable Subtitle */}
        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
          The modern JSONPlaceholder alternative. Perform real <code className="font-mono text-sm bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-semibold">POST</code>, <code className="font-mono text-sm bg-slate-100 px-1.5 py-0.5 rounded text-amber-600 font-semibold">PUT</code>, and <code className="font-mono text-sm bg-slate-100 px-1.5 py-0.5 rounded text-rose-600 font-semibold">DELETE</code> calls in an isolated visitor sandbox—without sign-up or polluting global data.
        </p>

        {/* Action Buttons & Quick Copy */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
          <Link
            href="#try-it"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
          >
            <span>Try Live Console</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </Link>

          <Link
            href="/docs/introduction"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all active:scale-[0.98]"
          >
            <span>Read Docs</span>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Quick cURL copy box */}
          <button
            type="button"
            onClick={handleCopy}
            title="Click to copy cURL command"
            className="w-full sm:w-auto inline-flex items-center justify-between gap-3 px-4 py-3 text-xs font-mono text-slate-600 bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 rounded-xl transition-all group"
          >
            <span className="truncate max-w-[210px] sm:max-w-xs">{curlCmd}</span>
            <span className="flex items-center gap-1 font-sans text-xs font-medium text-indigo-600">
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy</span>
                </>
              )}
            </span>
          </button>
        </div>

        {/* Trust & Spec Badges */}
        <div className="pt-6 sm:pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-slate-100 text-center">
          <div className="space-y-1">
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">100% Free</div>
            <div className="text-xs text-slate-500 font-medium">Zero Sign-up Required</div>
          </div>
          <div className="space-y-1">
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Per-Session</div>
            <div className="text-xs text-slate-500 font-medium">Isolated CRUD Overlays</div>
          </div>
          <div className="space-y-1">
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">&lt;15ms</div>
            <div className="text-xs text-slate-500 font-medium">Global Edge Response</div>
          </div>
          <div className="space-y-1">
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">REST + GQL</div>
            <div className="text-xs text-slate-500 font-medium">Full OpenAPI 3.0 & Postman</div>
          </div>
        </div>
      </div>
    </section>
  );
}
