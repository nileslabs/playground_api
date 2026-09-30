'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';

const CURATED_PALETTES = [
  { id: 0, name: 'Emerald Teal', start: '#059669', end: '#0d9488', sampleSeed: 'bret', text: '#ffffff' },
  { id: 1, name: 'Indigo Purple', start: '#4f46e5', end: '#7c3aed', sampleSeed: 'alice', text: '#ffffff' },
  { id: 2, name: 'Amber Orange', start: '#d97706', end: '#ea580c', sampleSeed: 'matrix_neo', text: '#ffffff' },
  { id: 3, name: 'Cyan Blue', start: '#0284c7', end: '#2563eb', sampleSeed: 'sarah_connor', text: '#ffffff' },
  { id: 4, name: 'Rose Pink', start: '#e11d48', end: '#db2777', sampleSeed: 'leanne', text: '#ffffff' },
  { id: 5, name: 'Violet Fuchsia', start: '#7c3aed', end: '#c026d3', sampleSeed: 'user_49', text: '#ffffff' },
  { id: 6, name: 'Sky Cyan', start: '#0ea5e9', end: '#06b6d4', sampleSeed: 'doctor_who', text: '#ffffff' },
  { id: 7, name: 'Lime Green', start: '#65a30d', end: '#16a34a', sampleSeed: 'kyle_reese', text: '#ffffff' },
  { id: 8, name: 'Fuchsia Rose', start: '#d946ef', end: '#f43f5e', sampleSeed: 'alex_mercer', text: '#ffffff' },
  { id: 9, name: 'Dark Slate', start: '#1e293b', end: '#334155', sampleSeed: 'marcus_v', text: '#38bdf8' },
  { id: 10, name: 'Obsidian Emerald', start: '#0f172a', end: '#064e3b', sampleSeed: 'elena_fisher', text: '#34d399' },
  { id: 11, name: 'Sunset Amber', start: '#9a3412', end: '#c2410c', sampleSeed: 'cyber_punk', text: '#ffffff' },
];

const PRESET_SEEDS = [
  { label: 'Bret (User 1)', seed: 'Bret', desc: 'Standard user handle' },
  { label: 'Sarah Connor', seed: 'Sarah Connor', desc: 'Two-word name -> SC' },
  { label: 'sconnor@cyberdyne.org', seed: 'sconnor@cyberdyne.org', desc: 'Full email address' },
  { label: 'user-leanne-graham', seed: 'user-leanne-graham', desc: 'Hyphenated slug -> UL' },
  { label: 'alex_mercer', seed: 'alex_mercer', desc: 'Snake case handle -> AM' },
  { label: 'Neo', seed: 'Neo', desc: 'Short single name -> NE' },
  { label: '404_robot', seed: '404_robot', desc: 'Alphanumeric identifier' },
];

const CODE_RECIPES = {
  reactComponent: `// Reusable React / Next.js UserAvatar Component
import React, { useState } from 'react';

interface UserAvatarProps {
  seed: string;
  size?: number;
  rounded?: boolean;
  className?: string;
  alt?: string;
}

export function UserAvatar({
  seed,
  size = 48,
  rounded = true,
  className = '',
  alt = 'User Avatar',
}: UserAvatarProps) {
  const [hasError, setHasError] = useState(false);
  
  // Explicit .svg extension ensures clean rendering in all image tags and SSR
  const avatarUrl = \`https://playground.nileslabs.com/api/v1/avatars/\${encodeURIComponent(
    seed
  )}.svg?size=\${size}&rounded=\${rounded}\`;

  return (
    <img
      src={hasError ? '/fallback-avatar.png' : avatarUrl}
      alt={alt}
      width={size}
      height={size}
      onError={() => setHasError(true)}
      loading="lazy"
      decoding="async"
      className={\`inline-block shrink-0 object-contain \${
        rounded ? 'rounded-full' : 'rounded-2xl'
      } \${className}\`}
    />
  );
}`,

  avatarGroup: `// Tailwind CSS Stacked Avatar Group with Hover Expand
import React from 'react';

const TEAM = ['alex', 'sarah', 'kyle', 'elena', 'marcus'];

export function TeamAvatarStack() {
  return (
    <div className="flex items-center -space-x-2 overflow-hidden p-2">
      {TEAM.map((member) => (
        <img
          key={member}
          className="inline-block h-10 w-10 rounded-full ring-2 ring-white hover:scale-110 hover:z-10 transition-transform cursor-pointer"
          src={\`https://playground.nileslabs.com/api/v1/avatars/\${member}.svg?size=80\`}
          alt={member}
        />
      ))}
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 ring-2 ring-white">
        +12
      </div>
    </div>
  );
}`,

  tsHelper: `// TypeScript Helper for Deterministic URL Generation
export function getDeterministicAvatarUrl(
  identifier: string,
  options?: { size?: number; rounded?: boolean }
): string {
  const cleanSeed = encodeURIComponent((identifier || 'default').trim());
  const size = Math.min(512, Math.max(32, options?.size ?? 128));
  const rounded = options?.rounded !== false;

  return \`https://playground.nileslabs.com/api/v1/avatars/\${cleanSeed}.svg?size=\${size}&rounded=\${rounded}\`;
}`,

  markdownHtml: `<!-- Direct HTML Embedding -->
<img 
  src="https://playground.nileslabs.com/api/v1/avatars/john_doe.svg?size=128&rounded=true" 
  alt="John Doe" 
  width="128" 
  height="128" 
/>

<!-- GitHub / Markdown Embedding -->
![User Avatar](https://playground.nileslabs.com/api/v1/avatars/sarah_connor.svg?size=96)`,
};

export default function SvgAvatarsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  // Live Studio state
  const [seed, setSeed] = useState<string>('Bret');
  const [size, setSize] = useState<number>(128);
  const [rounded, setRounded] = useState<boolean>(true);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Compute live URL
  const encodedSeed = encodeURIComponent(seed.trim() || 'user');
  const avatarSvgUrl = `${config.apiUrl}/avatars/${encodedSeed}.svg?size=${size}&rounded=${rounded}`;
  const directPublicUrl = `${publicApiUrl}/avatars/${encodedSeed}.svg?size=${size}&rounded=${rounded}`;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(label);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  return (
    <div className="space-y-12 w-full text-slate-900 pb-16">
      {/* 1. Hero Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:smiley-bold" className="w-3.5 h-3.5" />
          <span>Media & Binary Assets</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Deterministic Dynamic SVG Avatars
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Zero-dependency, infinite-resolution vector avatars generated deterministically from any username, email, or user ID. Features 12 curated modern gradients, intelligent initials parsing, dynamic squircle or circle clipping, and 1-year immutable CDN caching.
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap gap-2.5 pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-200">
            <Icon icon="ph:vector-three-bold" className="w-4 h-4 text-indigo-600" />
            100% Vector SVG (Zero Pixelation)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
            <Icon icon="ph:palette-bold" className="w-4 h-4 text-emerald-600" />
            12 Curated Gradient Palettes
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-medium border border-purple-200">
            <Icon icon="ph:text-t-bold" className="w-4 h-4 text-purple-600" />
            Smart Initials Extraction
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
            <Icon icon="ph:lightning-bold" className="w-4 h-4 text-amber-600" />
            Immutable 1-Year CDN Cache
          </span>
        </div>
      </div>

      {/* 2. Interactive Live Avatar Studio */}
      <div id="live-studio" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Icon icon="ph:sliders-horizontal-bold" className="w-5 h-5 text-indigo-600" />
              Live Vector Avatar Studio
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize seed, dimensions, and shape to preview the dynamically generated vector SVG in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
              GET /api/v1/avatars/:seed.svg
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Live Preview Display */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-center space-y-4">
            <div className="relative p-3 rounded-2xl bg-white shadow-xs border border-slate-200/60 inline-flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarSvgUrl}
                alt={`Avatar for ${seed}`}
                style={{ width: `${Math.min(160, Math.max(64, size))}px`, height: `${Math.min(160, Math.max(64, size))}px` }}
                className="object-contain transition-all duration-300 drop-shadow-xs"
              />
              <span className="absolute -bottom-2.5 px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-mono shadow-xs">
                {size} × {size}px
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-800">
                Seed: &quot;<span className="text-indigo-600">{seed || 'default'}</span>&quot;
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Shape: {rounded ? 'Circular (rx=size/2)' : 'Squircle (rx=15%)'}
              </p>
            </div>

            {/* Quick Copy Buttons */}
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              <button
                type="button"
                onClick={() => handleCopy(directPublicUrl, 'URL')}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all"
              >
                <Icon icon={copyFeedback === 'URL' ? 'ph:check-bold' : 'ph:link-bold'} className="w-3.5 h-3.5 text-indigo-600" />
                <span>{copyFeedback === 'URL' ? 'Copied URL!' : 'Copy URL'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopy(`<img src="${directPublicUrl}" alt="${seed}" width="${size}" height="${size}" />`, 'HTML')}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all"
              >
                <Icon icon={copyFeedback === 'HTML' ? 'ph:check-bold' : 'ph:code-bold'} className="w-3.5 h-3.5 text-indigo-600" />
                <span>{copyFeedback === 'HTML' ? 'Copied HTML!' : 'Copy <img>'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopy(`![Avatar](${directPublicUrl})`, 'MD')}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all"
              >
                <Icon icon={copyFeedback === 'MD' ? 'ph:check-bold' : 'ph:markdown-logo-bold'} className="w-3.5 h-3.5 text-indigo-600" />
                <span>{copyFeedback === 'MD' ? 'Copied Markdown!' : 'Copy Markdown'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Controls */}
          <div className="lg:col-span-7 space-y-5">
            {/* Seed String Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Icon icon="ph:fingerprint-bold" className="w-3.5 h-3.5 text-indigo-600" />
                  Seed String (Username, Email, or Full Name):
                </span>
                <span className="text-[11px] text-slate-400 font-normal">Hashed into color & initials</span>
              </label>
              <input
                type="text"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="e.g. John Doe, sconnor@resistance.net, user-42"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium"
              />
            </div>

            {/* Popular Presets */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                <Icon icon="ph:sparkle-bold" className="w-3.5 h-3.5 text-amber-500" />
                Quick Test Personas & Formats:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_SEEDS.map((p) => (
                  <button
                    key={p.seed}
                    type="button"
                    onClick={() => setSeed(p.seed)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                      seed === p.seed
                        ? 'bg-indigo-600 text-white font-bold shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                    title={p.desc}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Slider & Quick Pills */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1">
                  <Icon icon="ph:arrows-out-bold" className="w-3.5 h-3.5 text-indigo-600" />
                  Avatar Resolution: {size} × {size} pixels
                </span>
                <div className="flex items-center gap-1">
                  {[48, 96, 128, 256, 512].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-all ${
                        size === s ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="range"
                min="32"
                max="512"
                step="8"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Shape Toggle: Rounded Squircle vs Circle */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Icon icon="ph:circles-four-bold" className="w-3.5 h-3.5 text-indigo-600" />
                Border Style / Shape:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRounded(true)}
                  className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                    rounded
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full border-2 border-current" />
                  <span>Circular (rounded=true)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRounded(false)}
                  className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                    !rounded
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="w-4 h-4 rounded-md border-2 border-current" />
                  <span>Squircle (rounded=false)</span>
                </button>
              </div>
            </div>

            {/* Direct URL Bar */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Computed Asset CDN URL:</label>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-indigo-300 truncate select-all">
                {directPublicUrl}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Deterministic Color Palettes Explorer */}
      <div id="palettes" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Icon icon="ph:palette-bold" className="w-5 h-5 text-indigo-600" />
            12 Curated Deterministic Gradient Palettes
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            The backend hashes the seed string into an integer to select from 12 accessible, modern linear gradients. Click any palette to load its matching seed into the studio.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {CURATED_PALETTES.map((pal) => (
            <button
              key={pal.id}
              type="button"
              onClick={() => setSeed(pal.sampleSeed)}
              className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white hover:shadow-xs transition-all text-left space-y-2 group cursor-pointer"
            >
              <div
                className="h-14 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-2xs group-hover:scale-[1.02] transition-transform"
                style={{
                  background: `linear-gradient(135deg, ${pal.start}, ${pal.end})`,
                  color: pal.text,
                }}
              >
                {pal.name.slice(0, 2).toUpperCase()}
              </div>

              <div>
                <p className="text-xs font-bold text-slate-900">{pal.name}</p>
                <p className="text-[10px] font-mono text-slate-400">
                  {pal.start} → {pal.end}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Initials Extraction & Security Architecture */}
      <div id="algorithm" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Icon icon="ph:brain-bold" className="w-5 h-5 text-indigo-600" />
            Initials Parsing Algorithm & XML Sanitization
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            How Playground API safely extracts clean initials while eliminating vector injection and XSS vulnerabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Icon icon="ph:function-bold" className="w-4 h-4 text-emerald-600" />
              Token Extraction Rules
            </h3>
            <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                  <tr>
                    <th className="p-2.5">Input Seed</th>
                    <th className="p-2.5">Extracted Initials</th>
                    <th className="p-2.5">Parsing Logic</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-mono text-[11px]">
                  <tr>
                    <td className="p-2.5 font-bold text-indigo-600">Leanne Graham</td>
                    <td className="p-2.5 text-emerald-600 font-bold">LG</td>
                    <td className="p-2.5 font-sans">First char of first & second word</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-indigo-600">user-alex-turner</td>
                    <td className="p-2.5 text-emerald-600 font-bold">UA</td>
                    <td className="p-2.5 font-sans">Hyphen/underscore separated tokens</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-indigo-600">bret</td>
                    <td className="p-2.5 text-emerald-600 font-bold">BR</td>
                    <td className="p-2.5 font-sans">First two letters of single word</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-indigo-600">Z</td>
                    <td className="p-2.5 text-emerald-600 font-bold">Z</td>
                    <td className="p-2.5 font-sans">Single letter fallback</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-indigo-600">***</td>
                    <td className="p-2.5 text-emerald-600 font-bold">PA</td>
                    <td className="p-2.5 font-sans">Playground Avatar default fallback</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Icon icon="ph:shield-check-bold" className="w-4 h-4 text-indigo-600" />
              SVG Injection & Caching Architecture
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every rendered initial character undergoes strict XML entity escaping via <code className="font-mono text-indigo-600">escapeXml()</code> to eliminate SVG tag breakout and stored XSS vectors.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-700">Immutable CDN Cache Headers:</span>
              <div className="font-mono text-[11px] p-2 bg-slate-900 text-indigo-300 rounded-lg">
                Cache-Control: public, max-age=86400, s-maxage=31536000, stale-while-revalidate
              </div>
              <p className="text-slate-500 text-[11px] mt-1">
                In-memory LRU cache stores up to 1,000 recently generated SVGs on the server, serving repeated requests in under 1 millisecond.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Interactive Consoles */}
      <div id="consoles" className="space-y-6 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Interactive Avatar API Consoles
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Execute direct HTTP requests to test responses and raw SVG XML payloads:
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <InteractiveConsole
            method="GET"
            path="/avatars/Bret"
            title="Fetch Raw Vector SVG"
            description="Fetches raw SVG image data with Content-Type: image/svg+xml."
          />

          <InteractiveConsole
            method="GET"
            path="/avatars/Sarah Connor.svg?size=256&rounded=false"
            title="Generate Custom Squircle Avatar"
            description="Fetches a 256px squircle avatar with explicit .svg extension."
          />
        </div>
      </div>

      {/* 6. Production Code Recipes */}
      <div id="code-recipes" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Production Client Integration Recipes
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Ready-to-use snippets for React components, Tailwind avatar stacks, TypeScript helpers, and direct HTML:
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <CodeBlock
            tabs={[
              { id: 'react', label: 'React UserAvatar', code: CODE_RECIPES.reactComponent, language: 'tsx', icon: 'ph:atom-bold' },
              { id: 'stack', label: 'Tailwind Avatar Stack', code: CODE_RECIPES.avatarGroup, language: 'tsx', icon: 'ph:stack-bold' },
              { id: 'helper', label: 'TypeScript Helper', code: CODE_RECIPES.tsHelper, language: 'typescript', icon: 'ph:code-bold' },
              { id: 'html', label: 'HTML / Markdown', code: CODE_RECIPES.markdownHtml, language: 'html', icon: 'ph:file-html-bold' },
            ]}
            defaultTab="react"
          />
        </div>
      </div>

      {/* 7. Next Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        <Link
          href="/docs/media/image-thumbnails"
          className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-xs transition-all group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Next in Media</span>
            <Icon icon="ph:arrow-right-bold" className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Landscape Thumbnails & Transformations</h3>
          <p className="text-xs text-slate-500">
            Generate 16:9 placeholder banners with dynamic multiline word wrapping and dimension badges.
          </p>
        </Link>

        <Link
          href="/docs/media/file-uploads"
          className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-xs transition-all group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Previous</span>
            <Icon icon="ph:arrow-left-bold" className="w-4 h-4 text-indigo-600 group-hover:-translate-x-1 transition-transform" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Multipart File Uploads</h3>
          <p className="text-xs text-slate-500">
            Test single and bulk multipart uploads with real Cloudinary CDN delivery and magic byte validation.
          </p>
        </Link>
      </div>
    </div>
  );
}
