'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export default function ImageThumbnailsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:frame-corners-bold" className="w-3.5 h-3.5" />
          <span>Media & File Uploads</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Image Thumbnails & CDN Transformations
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Simulate on-the-fly image resizing, cropping, and format compression. Test responsive srcset picture elements and thumbnail pipelines with dynamic URL query parameters.
        </p>
      </div>

      {/* 2. Transformation URL Conventions */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900">URL Query Transformation Parameters</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Append width, height, and fit modifiers to any uploaded image asset or avatar URL:
        </p>
        <div className="p-3.5 rounded-xl bg-slate-900 font-mono text-xs text-indigo-300 overflow-x-auto">
          GET /api/v1/uploads/:id?w=400&h=300&fit=crop&quality=85
        </div>
      </div>

      {/* 3. Parameter Reference */}
      <div id="params" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Supported Resizing Modifiers
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-4">Parameter</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Default</th>
                <th className="py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">w / width</td>
                <td className="py-3 px-4 font-mono">Integer</td>
                <td className="py-3 px-4 font-mono text-slate-400">original</td>
                <td className="py-3 px-4">Target image width in pixels.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">h / height</td>
                <td className="py-3 px-4 font-mono">Integer</td>
                <td className="py-3 px-4 font-mono text-slate-400">original</td>
                <td className="py-3 px-4">Target image height in pixels.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">fit</td>
                <td className="py-3 px-4 font-mono">&apos;cover&apos; | &apos;contain&apos; | &apos;crop&apos;</td>
                <td className="py-3 px-4 font-mono text-slate-400">cover</td>
                <td className="py-3 px-4">Cropping behavior when aspect ratio changes.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
