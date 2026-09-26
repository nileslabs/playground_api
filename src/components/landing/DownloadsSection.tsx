'use client';

import React from 'react';
import Link from 'next/link';

interface DownloadCard {
  title: string;
  format: string;
  description: string;
  downloadUrl: string;
  badge: string;
}

const downloads: DownloadCard[] = [
  {
    title: 'OpenAPI 3.0 Specification',
    format: 'openapi.json',
    description: 'Import full endpoint contracts into Swagger UI, Redoc, or API code generators.',
    downloadUrl: 'https://playground.nileslabs.com/api/v1/downloads/openapi.json',
    badge: 'Spec 3.0',
  },
  {
    title: 'Postman Collection',
    format: 'postman.json',
    description: 'Pre-configured collection with mock variables, test scripts, and bearer tokens.',
    downloadUrl: 'https://playground.nileslabs.com/api/v1/downloads/postman.json',
    badge: 'Collection v2.1',
  },
  {
    title: 'Bruno Collection',
    format: 'bruno.json',
    description: 'Git-friendly, fast offline API client collection ready for your team repository.',
    downloadUrl: 'https://playground.nileslabs.com/api/v1/downloads/bruno.json',
    badge: 'Open Source',
  },
  {
    title: 'Insomnia Collection',
    format: 'insomnia.json',
    description: 'Full request workspace ready for one-click import into Insomnia Rest Client.',
    downloadUrl: 'https://playground.nileslabs.com/api/v1/downloads/insomnia.json',
    badge: 'Workspace',
  },
  {
    title: 'TypeScript Type Declarations',
    format: 'playground-api.d.ts',
    description: 'Strongly-typed interfaces for Users, Posts, Comments, Todos, and Auth responses.',
    downloadUrl: 'https://playground.nileslabs.com/api/v1/downloads/playground-api.d.ts',
    badge: 'TypeScript 5+',
  },
];

export function DownloadsSection() {
  return (
    <section id="downloads" className="py-20 md:py-28 bg-white border-b border-slate-200/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider border border-slate-200">
            Developer Ecosystem
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            One-click collections & SDK specs
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Import Playground API directly into your favorite API client or TypeScript project.
          </p>
        </div>

        {/* Downloads Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {downloads.map((d) => (
            <div
              key={d.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 hover:border-indigo-300 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {d.format}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    {d.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{d.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {d.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Link
                  href={d.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download file</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
