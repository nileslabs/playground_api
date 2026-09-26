'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export default function BrunoDownloadPage() {
  const downloadUrl = `${config.apiUrl}/download/bruno.json`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:dog-bold" className="w-3.5 h-3.5" />
          <span>Client Collections</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Bruno Collection Export
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Export preconfigured requests for Bruno, the open-source, Git-friendly API client. Version-control API testing flows alongside your frontend application repository.
        </p>
      </div>

      {/* 2. Download Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Bruno JSON
            </span>
            <span className="text-xs text-slate-500 font-mono">playground_bruno.json</span>
          </div>
          <h3 className="font-extrabold text-lg text-slate-900">Git-Friendly Bruno Collection</h3>
          <p className="text-xs text-slate-600 max-w-xl">
            Clean JSON collection structure formatted for direct import into the Bruno desktop client.
          </p>
        </div>

        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          download="playground-api-bruno.json"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Icon icon="ph:download-simple-bold" className="w-4 h-4" />
          <span>Download Bruno Collection</span>
        </a>
      </div>
    </div>
  );
}
