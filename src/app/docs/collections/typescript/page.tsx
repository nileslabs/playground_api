'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { CodeBlock } from '@/components/ui/CodeBlock';

export default function TypeScriptDownloadPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const downloadUrl = `${publicApiUrl}/downloads/playground-api.d.ts`;

  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(downloadUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const tsconfigSnippet = `{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "strict": true,
    "moduleResolution": "bundler"
  },
  "include": [
    "src",
    "types/**/*.d.ts" // Recognizes playground-api.d.ts automatically
  ]
}`;

  const usageSnippet = `// Global types are available without any import statement!
import { useState, useEffect } from 'react';

export function BlogFeed() {
  // 1. Strongly typed state using PlaygroundApi namespace
  const [posts, setPosts] = useState<PlaygroundApi.Post[]>([]);
  const [pagination, setPagination] = useState<PlaygroundApi.PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const res = await fetch('${publicApiUrl}/posts?_limit=5', {
        credentials: 'include',
      });
      
      // 2. Strongly typed JSON response envelope
      const json: PlaygroundApi.PaginatedResponse<PlaygroundApi.Post> = await res.json();
      setPosts(json.data);
      setPagination(json.pagination);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <p>Loading articles...</p>;

  return (
    <div>
      <h2>Blog Feed ({pagination?.total} total)</h2>
      {posts.map((post) => (
        <article key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </article>
      ))}
    </div>
  );
}`;

  const sampleDeclarationSnippet = `declare namespace PlaygroundApi {
  export interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
  }

  export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address: {
      street: string;
      suite: string;
      city: string;
      zipcode: string;
      geo: { lat: string; lng: string };
    };
    phone: string;
    website: string;
    company: {
      name: string;
      catchPhrase: string;
      bs: string;
    };
  }

  export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }

  export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationMeta;
  }
}`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider border border-blue-200">
          <Icon icon="ph:file-ts-bold" className="w-3.5 h-3.5" />
          <span>Client Collections</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          TypeScript Ambient Declarations (.d.ts)
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Get complete IntelliSense, strict type inference, and compile-time validation across your entire frontend codebase without installing any third-party npm packages.
        </p>
      </div>

      {/* 2. Download Card */}
      <div id="download-card" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 scroll-mt-20">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              TypeScript .d.ts
            </span>
            <span className="text-xs text-slate-500 font-mono">playground-api.d.ts</span>
          </div>
          <h2 className="font-extrabold text-xl text-slate-900">Official Ambient Type Definitions</h2>
          <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
            Contains all model interfaces (<code className="font-mono text-xs text-indigo-600 font-bold">User</code>, <code className="font-mono text-xs text-indigo-600 font-bold">Post</code>, <code className="font-mono text-xs text-indigo-600 font-bold">Comment</code>, <code className="font-mono text-xs text-indigo-600 font-bold">Todo</code>, <code className="font-mono text-xs text-indigo-600 font-bold">PaymentIntent</code>), request filters, and pagination envelopes under the global <code className="font-mono text-xs text-indigo-600 font-bold">PlaygroundApi</code> namespace.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleCopyUrl}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all cursor-pointer shadow-2xs"
          >
            <Icon icon={copiedUrl ? 'ph:check-bold' : 'ph:copy-bold'} className="w-4 h-4 text-blue-600" />
            <span>{copiedUrl ? 'Copied URL!' : 'Copy File URL'}</span>
          </button>

          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            download="playground-api.d.ts"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          >
            <Icon icon="ph:download-simple-bold" className="w-4 h-4" />
            <span>Download playground-api.d.ts</span>
          </a>
        </div>
      </div>

      {/* 3. Setup in tsconfig.json */}
      <div id="tsconfig-setup" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Installation in Next.js, React, or Vite
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Place the downloaded <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-bold">playground-api.d.ts</code> into your project&apos;s <code className="font-mono text-xs">types/</code> directory and ensure your <code className="font-mono text-xs">tsconfig.json</code> includes it:
          </p>
        </div>

        <CodeBlock
          code={tsconfigSnippet}
          language="json"
          title="tsconfig.json"
          maxHeight="max-h-72"
        />
      </div>

      {/* 4. Practical Component Usage */}
      <div id="usage-example" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Using Ambient Types in React Components
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            No imports necessary — your editor will automatically autocomplete properties and validate response envelopes:
          </p>
        </div>

        <CodeBlock
          code={usageSnippet}
          language="typescript"
          title="BlogFeed.tsx"
          maxHeight="max-h-96"
        />
      </div>

      {/* 5. Declaration Preview */}
      <div id="declaration-preview" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Namespace Interface Preview
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            A glance at the definitions provided inside the ambient namespace:
          </p>
        </div>

        <CodeBlock
          code={sampleDeclarationSnippet}
          language="typescript"
          title="playground-api.d.ts"
          maxHeight="max-h-96"
        />
      </div>

      {/* 6. Navigation Footer */}
      <div className="p-6 sm:p-7 rounded-2xl border border-indigo-100 bg-indigo-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-slate-900">Want full method autocomplete with zero boilerplate?</h3>
          <p className="text-sm text-slate-600">Check out our official TypeScript SDK package for isomorphic data fetching and retries.</p>
        </div>
        <Link
          href="/docs/toolkit/typescript-sdk"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shrink-0"
        >
          View TypeScript SDK
        </Link>
      </div>
    </div>
  );
}
