'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export default function SvgAvatarsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const [seed, setSeed] = useState('john_doe');

  const avatarUrl = `${config.apiUrl}/avatars/${encodeURIComponent(seed)}`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:smiley-bold" className="w-3.5 h-3.5" />
          <span>Media & File Uploads</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Deterministic Dynamic SVG Avatars
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Zero-dependency, high-resolution SVG avatars generated deterministically from any username, email, or seed string. Eliminates broken placeholder image links in UI mockups.
        </p>
      </div>

      {/* 2. Interactive Avatar Generator */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Live Avatar Seed Generator</h3>
          <p className="text-xs text-slate-500">Type any string seed below to generate a unique vector avatar:</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Avatar Preview Box */}
          <div className="w-28 h-28 rounded-2xl border-2 border-indigo-100 bg-slate-50 p-2 flex items-center justify-center shrink-0 shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl}
              alt={`Avatar for ${seed}`}
              className="w-full h-full object-contain rounded-xl"
            />
          </div>

          <div className="space-y-3 flex-1">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Seed String:</label>
              <input
                type="text"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                className="w-full sm:max-w-md px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Direct Image URL:</label>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 font-mono text-xs text-indigo-600 truncate">
                {avatarUrl}
              </div>
            </div>
          </div>
        </div>

        {/* Preset Seeds Gallery */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Try Popular Seeds:</span>
          <div className="flex flex-wrap gap-2">
            {['alex', 'sarah', 'matrix_neo', 'crypto_whale', 'alice_in_wonderland'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSeed(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  seed === s
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
