'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';

const RATIO_PRESETS = [
  { id: 'card', label: 'Standard Card (600×400)', width: 600, height: 400, desc: '3:2 aspect ratio for general card grids' },
  { id: '16-9', label: '16:9 Banner (1200×675)', width: 1200, height: 675, desc: 'Widescreen hero & YouTube preview banner' },
  { id: 'wide-hero', label: 'Wide Hero (1200×400)', width: 1200, height: 400, desc: '3:1 panoramic header banner' },
  { id: 'square', label: 'Square (400×400)', width: 400, height: 400, desc: '1:1 ratio for product thumbnails' },
  { id: 'compact', label: 'Compact (400×250)', width: 400, height: 250, desc: 'Small sidebar or mobile article preview' },
];

const CODE_RECIPES = {
  nextImage: `// Next.js 14/15 Responsive Image with Custom Thumbnail Loader
import Image from 'next/image';

interface BlogPostCardProps {
  slug: string;
  title: string;
  summary: string;
}

export function BlogPostThumbnail({ slug, title, summary }: BlogPostCardProps) {
  // Construct dynamic thumbnail URL with auto word-wrapping & dimension badge
  const thumbnailUrl = \`https://playground.nileslabs.com/api/v1/thumbnails/\${encodeURIComponent(
    slug
  )}.svg?width=800&height=450&text=\${encodeURIComponent(
    title
  )}&description=\${encodeURIComponent(summary)}\`;

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xs border border-slate-200">
      <Image
        src={thumbnailUrl}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover hover:scale-105 transition-transform duration-300"
        priority={false}
      />
    </div>
  );
}`,

  htmlPicture: `<!-- HTML5 Responsive Picture with High-DPI srcset -->
<picture>
  <!-- High DPI displays (Retina 2x) -->
  <source
    media="(min-width: 768px)"
    srcset="
      https://playground.nileslabs.com/api/v1/thumbnails/react-state.svg?width=800&height=450 1x,
      https://playground.nileslabs.com/api/v1/thumbnails/react-state.svg?width=1600&height=900 2x
    "
  />
  <!-- Mobile screens -->
  <source
    media="(max-width: 767px)"
    srcset="https://playground.nileslabs.com/api/v1/thumbnails/react-state.svg?width=400&height=250"
  />
  <!-- Fallback img -->
  <img
    src="https://playground.nileslabs.com/api/v1/thumbnails/react-state.svg?width=600&height=400"
    alt="React State Management Tutorial"
    loading="lazy"
    width="600"
    height="400"
    style="width: 100%; height: auto; border-radius: 1rem;"
  />
</picture>`,

  cloudinaryTransforms: `// Cloudinary On-the-Fly Dynamic CDN Transformations for Uploaded Assets
// When using POST /api/v1/uploads, image assets receive Cloudinary CDN URLs.
// You can insert transformation tokens directly into the URL path:

function getTransformedCdnUrl(originalUrl, { width, height, crop = 'fill', quality = 'auto' }) {
  if (!originalUrl.includes('/image/upload/')) return originalUrl;

  const transformToken = \`w_\${width},h_\${height},c_\${crop},q_\${quality},f_auto\`;
  return originalUrl.replace('/image/upload/', \`/image/upload/\${transformToken}/\`);
}

// Example:
// Original:    https://res.cloudinary.com/demo/image/upload/v1234/playground_api/uploads/products/xyz.jpg
// Transformed: https://res.cloudinary.com/demo/image/upload/w_400,h_300,c_fill,q_auto,f_auto/v1234/playground_api/uploads/products/xyz.jpg`,

  cssBackground: `/* CSS Background Image with Vector Mesh Thumbnail */
.hero-banner-container {
  width: 100%;
  height: 400px;
  background-image: url('https://playground.nileslabs.com/api/v1/thumbnails/cloud-architecture.svg?width=1200&height=400&text=Enterprise+Cloud+Architecture');
  background-size: cover;
  background-position: center;
  border-radius: 1.5rem;
}`,
};

export default function ImageThumbnailsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  // Live Studio State
  const [seed, setSeed] = useState<string>('react-hooks-tutorial');
  const [width, setWidth] = useState<number>(600);
  const [height, setHeight] = useState<number>(400);
  const [customText, setCustomText] = useState<string>('Mastering Modern React Hooks');
  const [description, setDescription] = useState<string>('A comprehensive guide to stateful patterns & custom reusable hooks');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Compute live endpoint query
  const buildQuery = () => {
    const params = new URLSearchParams();
    if (width !== 600) params.set('width', width.toString());
    if (height !== 400) params.set('height', height.toString());
    if (customText.trim()) params.set('text', customText.trim());
    if (description.trim()) params.set('description', description.trim());
    const qs = params.toString();
    return qs ? `?${qs}` : '';
  };

  const cleanSeed = encodeURIComponent(seed.trim() || 'post');
  const livePreviewUrl = `${config.apiUrl}/thumbnails/${cleanSeed}.svg${buildQuery()}`;
  const directPublicUrl = `${publicApiUrl}/thumbnails/${cleanSeed}.svg${buildQuery()}`;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(label);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handlePresetSelect = (preset: typeof RATIO_PRESETS[0]) => {
    setWidth(preset.width);
    setHeight(preset.height);
  };

  return (
    <div className="space-y-12 w-full text-slate-900 pb-16">
      {/* 1. Hero Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:frame-corners-bold" className="w-3.5 h-3.5" />
          <span>Media & Binary Assets</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Image Thumbnails & CDN Transformations
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          On-demand dynamic landscape vector thumbnails and Cloudinary CDN image transformation pipelines. Features intelligent multi-line word wrapping, dimension badge indicators, custom subtitle labels, and responsive <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">&lt;picture&gt;</code> element support.
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap gap-2.5 pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-200">
            <Icon icon="ph:image-square-bold" className="w-4 h-4 text-indigo-600" />
            Vector Landscape SVG Thumbnails
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
            <Icon icon="ph:text-align-center-bold" className="w-4 h-4 text-emerald-600" />
            Smart Multiline Word-Wrapping
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-medium border border-purple-200">
            <Icon icon="ph:tag-bold" className="w-4 h-4 text-purple-600" />
            Dimension Overlay Badges
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
            <Icon icon="ph:cloud-sun-bold" className="w-4 h-4 text-amber-600" />
            Cloudinary On-The-Fly CDN Transforms
          </span>
        </div>
      </div>

      {/* 2. Interactive Landscape Thumbnail Studio */}
      <div id="live-studio" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Icon icon="ph:sliders-horizontal-bold" className="w-5 h-5 text-indigo-600" />
              Landscape Thumbnail Studio
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live interactive playground with instant SVG rendering, aspect ratio presets, and text word wrapping.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
              GET /api/v1/thumbnails/:seed.svg
            </span>
          </div>
        </div>

        {/* Dimension & Aspect Ratio Presets Bar */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
            <Icon icon="ph:aspect-ratio-bold" className="w-3.5 h-3.5 text-indigo-600" />
            Common Aspect Ratio Presets:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {RATIO_PRESETS.map((p) => {
              const isSelected = width === p.width && height === p.height;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePresetSelect(p)}
                  className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900 font-bold ring-2 ring-indigo-500/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <p className="font-bold truncate">{p.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">{p.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Live Preview Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
            <div className="w-full max-h-95 rounded-xl overflow-hidden shadow-2xl border border-slate-700/60 bg-black/40 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={livePreviewUrl}
                alt={customText || seed}
                className="w-full h-auto max-h-90 object-contain transition-all duration-300"
              />
            </div>

            {/* Quick Copy Action Bar */}
            <div className="flex flex-wrap gap-2 justify-center w-full pt-2">
              <button
                type="button"
                onClick={() => handleCopy(directPublicUrl, 'URL')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Icon icon={copyFeedback === 'URL' ? 'ph:check-bold' : 'ph:link-bold'} className="w-3.5 h-3.5 text-indigo-400" />
                <span>{copyFeedback === 'URL' ? 'Copied URL!' : 'Copy Direct URL'}</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    `<img src="${directPublicUrl}" alt="${customText || seed}" width="${width}" height="${height}" />`,
                    'HTML'
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Icon icon={copyFeedback === 'HTML' ? 'ph:check-bold' : 'ph:code-bold'} className="w-3.5 h-3.5 text-indigo-400" />
                <span>{copyFeedback === 'HTML' ? 'Copied HTML!' : 'Copy <img>'}</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleCopy(`![${customText || seed}](${directPublicUrl})`, 'MD')
                }
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Icon icon={copyFeedback === 'MD' ? 'ph:check-bold' : 'ph:markdown-logo-bold'} className="w-3.5 h-3.5 text-indigo-400" />
                <span>{copyFeedback === 'MD' ? 'Copied Markdown!' : 'Copy Markdown'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Controls Form */}
          <div className="lg:col-span-5 space-y-4">
            {/* Seed String Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Icon icon="ph:fingerprint-bold" className="w-3.5 h-3.5 text-indigo-600" />
                  Seed String:
                </span>
                <span className="text-[11px] text-slate-400 font-normal">Controls background gradient</span>
              </label>
              <input
                type="text"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="e.g. react-hooks, post-1, architecture"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            {/* Custom Title Text Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Icon icon="ph:text-t-bold" className="w-3.5 h-3.5 text-indigo-600" />
                  Primary Title Text (?text=...):
                </span>
                <span className="text-[11px] text-slate-400 font-normal">Auto wraps up to 3 lines</span>
              </label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Leave blank to use formatted seed name"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            {/* Subtitle Description Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Icon icon="ph:subtitles-bold" className="w-3.5 h-3.5 text-indigo-600" />
                  Subtitle / Description (?description=...):
                </span>
                <span className="text-[11px] text-slate-400 font-normal">Rendered beneath title</span>
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional secondary text displayed on the thumbnail card"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
              />
            </div>

            {/* Width and Height Sliders */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Width:</span>
                  <span className="font-mono text-indigo-600">{width}px</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="1920"
                  step="20"
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Height:</span>
                  <span className="font-mono text-indigo-600">{height}px</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="1080"
                  step="20"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Direct URL Display */}
            <div className="space-y-1 pt-1">
              <label className="text-xs font-bold text-slate-700">Generated Thumbnail URL:</label>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-indigo-600 truncate select-all">
                {directPublicUrl}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Parameter Reference Table */}
      <div id="params" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Thumbnail API Query Parameters
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            All supported modifiers for <code className="font-mono text-indigo-600">GET /api/v1/thumbnails/:seed[.svg]</code>:
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-4">Parameter</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Default</th>
                <th className="py-3 px-4">Allowed Range</th>
                <th className="py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">:seed</td>
                <td className="py-3 px-4 font-mono">String</td>
                <td className="py-3 px-4 font-mono text-slate-400">Required</td>
                <td className="py-3 px-4 text-slate-500">Any valid string</td>
                <td className="py-3 px-4">URL path parameter used for deterministic color palette hashing and default title generation.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">width / w</td>
                <td className="py-3 px-4 font-mono">Integer</td>
                <td className="py-3 px-4 font-mono text-slate-500">600</td>
                <td className="py-3 px-4 text-slate-500">100 to 1920 px</td>
                <td className="py-3 px-4">Canvas width. Scales font sizes and safe character margins automatically.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">height / h</td>
                <td className="py-3 px-4 font-mono">Integer</td>
                <td className="py-3 px-4 font-mono text-slate-500">400</td>
                <td className="py-3 px-4 text-slate-500">100 to 1080 px</td>
                <td className="py-3 px-4">Canvas height. Center-aligns title, subtitle, and dimension badge vertically.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">text</td>
                <td className="py-3 px-4 font-mono">String</td>
                <td className="py-3 px-4 font-mono text-slate-400">Formatted seed</td>
                <td className="py-3 px-4 text-slate-500">Up to 3 wrapped lines</td>
                <td className="py-3 px-4">Custom primary title text. Automatically word-wraps with ellipsis overflow protection.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">description / desc / subtitle</td>
                <td className="py-3 px-4 font-mono">String</td>
                <td className="py-3 px-4 font-mono text-slate-400">null</td>
                <td className="py-3 px-4 text-slate-500">Up to 3 wrapped lines</td>
                <td className="py-3 px-4">Optional secondary text rendered with 88% opacity beneath the primary title.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Word-Wrapping & Layout Architecture */}
      <div id="architecture" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Icon icon="ph:layout-bold" className="w-5 h-5 text-indigo-600" />
            Responsive SVG Canvas Architecture & Word Wrapping
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            How the backend balances typography, padding, and subtle grid textures across arbitrary canvas aspect ratios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900">Dynamic Font Sizing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Font size adapts dynamically based on canvas dimensions: <code className="font-mono text-indigo-600">Math.min(width * 0.052, height * 0.12, 48)</code>, ensuring text never overpowers smaller card previews.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-900">Smart Safe-Zone Wrapping</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Titles wrap cleanly within 84% width margin (<code className="font-mono text-emerald-600">wrapText</code>). Long titles automatically truncate at line 3 with trailing ellipses (<code className="font-mono">...</code>).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="text-sm font-bold text-slate-900">Texture Grid & Pill Badge</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Each thumbnail embeds a 40×40px subtle geometric grid overlay (<code className="font-mono text-purple-600">rgba(255,255,255,0.07)</code>) and an auto-centered pill badge showing exact canvas resolution.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Cloudinary CDN Dynamic Transformations for Uploads */}
      <div id="cdn-transforms" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Icon icon="ph:cloud-check-bold" className="w-5 h-5 text-indigo-600" />
            Cloudinary On-The-Fly Transformations for Uploaded Assets
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Files uploaded to <code className="font-mono text-xs">POST /api/v1/uploads</code> leverage Cloudinary CDN URL manipulation for real-time resizing and format conversion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Transform URL Conventions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Append dimension and crop tokens directly between <code className="font-mono text-indigo-600">/upload/</code> and the asset folder path:
            </p>
            <div className="p-3.5 rounded-xl bg-slate-900 font-mono text-xs text-emerald-400 overflow-x-auto space-y-1">
              <p className="text-slate-400 text-[10px]"># Original URL:</p>
              <p className="text-slate-300">.../image/upload/v1/uploads/products/shoe.jpg</p>
              <p className="text-slate-400 text-[10px] pt-1"># Transformed 400x300 WebP Thumbnail:</p>
              <p className="text-emerald-400">.../image/upload/w_400,h_300,c_fill,q_auto,f_auto/v1/uploads/products/shoe.jpg</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Supported Transformation Flags</h3>
            <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                  <tr>
                    <th className="p-2.5">Token</th>
                    <th className="p-2.5">Meaning</th>
                    <th className="p-2.5">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-mono text-[11px]">
                  <tr>
                    <td className="p-2.5 font-bold text-indigo-600">w_...</td>
                    <td className="p-2.5 font-sans">Width in pixels</td>
                    <td className="p-2.5">w_600</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-indigo-600">h_...</td>
                    <td className="p-2.5 font-sans">Height in pixels</td>
                    <td className="p-2.5">h_400</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-indigo-600">c_fill</td>
                    <td className="p-2.5 font-sans">Crop & fill canvas</td>
                    <td className="p-2.5">c_fill,g_auto</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-indigo-600">f_auto</td>
                    <td className="p-2.5 font-sans">Auto format (WebP / AVIF)</td>
                    <td className="p-2.5">f_auto</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-indigo-600">q_auto</td>
                    <td className="p-2.5 font-sans">Intelligent compression</td>
                    <td className="p-2.5">q_auto</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Interactive Consoles */}
      <div id="consoles" className="space-y-6 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Interactive Thumbnail API Consoles
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Test direct HTTP endpoints with custom dimensions and text parameters:
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <InteractiveConsole
            method="GET"
            path="/thumbnails/post-1.svg"
            title="Fetch Default 600×400 Thumbnail"
            description="Fetches raw SVG image data with Post #1 formatted title."
          />

          <InteractiveConsole
            method="GET"
            path="/thumbnails/cloud-architecture.svg?width=800&height=450&text=Scalable%20Microservices&description=High%20throughput%20event-driven%20backend"
            title="Fetch 16:9 Banner with Title & Description"
            description="Generates an 800×450 thumbnail with multiline title and secondary subtitle."
          />
        </div>
      </div>

      {/* 7. Production Code Recipes */}
      <div id="code-recipes" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Production Client Integration Recipes
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Ready-to-use snippets for Next.js Image, responsive HTML &lt;picture&gt;, and Cloudinary transformation helpers:
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <CodeBlock
            tabs={[
              { id: 'next', label: 'Next.js <Image>', code: CODE_RECIPES.nextImage, language: 'tsx', icon: 'ph:atom-bold' },
              { id: 'picture', label: 'HTML5 <picture>', code: CODE_RECIPES.htmlPicture, language: 'html', icon: 'ph:file-html-bold' },
              { id: 'cloudinary', label: 'Cloudinary CDN Transforms', code: CODE_RECIPES.cloudinaryTransforms, language: 'javascript', icon: 'ph:cloud-bold' },
              { id: 'css', label: 'CSS Background Banner', code: CODE_RECIPES.cssBackground, language: 'css', icon: 'ph:paint-brush-bold' },
            ]}
            defaultTab="next"
          />
        </div>
      </div>

      {/* 8. Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        <Link
          href="/docs/media/svg-avatars"
          className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-xs transition-all group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Previous in Media</span>
            <Icon icon="ph:arrow-left-bold" className="w-4 h-4 text-indigo-600 group-hover:-translate-x-1 transition-transform" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Deterministic SVG Avatars</h3>
          <p className="text-xs text-slate-500">
            Explore 12 curated gradients and initials parsing for user profile avatars.
          </p>
        </Link>

        <Link
          href="/docs/media/file-uploads"
          className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-xs transition-all group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Related</span>
            <Icon icon="ph:arrow-right-bold" className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Multipart File Uploads</h3>
          <p className="text-xs text-slate-500">
            Upload images, PDFs, and documents with binary magic bytes validation.
          </p>
        </Link>
      </div>
    </div>
  );
}
