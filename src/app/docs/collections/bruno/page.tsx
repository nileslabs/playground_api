'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { CodeBlock } from '@/components/ui/CodeBlock';

export default function BrunoDownloadPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const downloadUrl = `${publicApiUrl}/downloads/bruno.json`;

  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(downloadUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const bruSampleSnippet = `meta {
  name: Create Stateful Post
  type: http
  seq: 2
}

post {
  url: {{baseUrl}}/posts
  body: json
  auth: none
}

headers {
  Content-Type: application/json
  X-Playground-Identity: {{identity}}
}

body:json {
  {
    "title": "Post created via Bruno",
    "body": "Stateful mutations persist per session identity",
    "userId": 1
  }
}

tests {
  test("Status code is 201 Created", function() {
    expect(res.getStatus()).to.equal(201);
  });
  test("Created post has valid ID", function() {
    expect(res.getBody().id).to.be.a('number');
  });
}`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold uppercase tracking-wider border border-amber-200">
          <Icon icon="ph:dog-bold" className="w-3.5 h-3.5" />
          <span>Client Collections</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Bruno Collection Export
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Export preconfigured requests for Bruno, the fast, open-source, Git-friendly API client. Version-control API testing flows, environments, and assertions alongside your application repository.
        </p>
      </div>

      {/* 2. Download Card */}
      <div id="download-card" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 scroll-mt-20">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Bruno JSON
            </span>
            <span className="text-xs text-slate-500 font-mono">playground-api.bruno_collection.json</span>
          </div>
          <h2 className="font-extrabold text-xl text-slate-900">Git-Friendly Bruno Collection</h2>
          <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
            Clean JSON structure formatted for direct import into the Bruno desktop client. Includes environments, folders, and assertions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleCopyUrl}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all cursor-pointer shadow-2xs"
          >
            <Icon icon={copiedUrl ? 'ph:check-bold' : 'ph:copy-bold'} className="w-4 h-4 text-amber-600" />
            <span>{copiedUrl ? 'Copied URL!' : 'Copy Collection URL'}</span>
          </button>

          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            download="playground-api.bruno_collection.json"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          >
            <Icon icon="ph:download-simple-bold" className="w-4 h-4" />
            <span>Download Bruno Collection</span>
          </a>
        </div>
      </div>

      {/* 3. Why Bruno Highlights */}
      <div id="why-bruno" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Why Bruno for Mock API Testing?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Icon icon="ph:git-branch-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Committed to Git</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Collections live as plain text files in your repo folder. Review API test changes in pull requests just like application code.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Icon icon="ph:cloud-slash-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Zero Cloud Lock-in</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Data stays strictly on your local disk. No forced cloud logins, team workspace limits, or proprietary storage formats.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Icon icon="ph:terminal-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">CLI Runner Included</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Execute test runs in CI/CD using the open-source <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-amber-700 font-bold">@usebruno/cli</code> without licensing fees.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Sample Bru Request File */}
      <div id="sample-request" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Sample Bru Request Definition
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Requests in Bruno use human-readable plain text syntax with inline assertions:
          </p>
        </div>

        <CodeBlock
          code={bruSampleSnippet}
          language="bash"
          title="posts/create-post.bru"
          maxHeight="max-h-96"
        />
      </div>

      {/* 5. Navigation Footer */}
      <div className="p-6 sm:p-7 rounded-2xl border border-indigo-100 bg-indigo-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-slate-900">Using Kong Insomnia instead?</h3>
          <p className="text-sm text-slate-600">Download the official Insomnia v4 workspace with environment presets.</p>
        </div>
        <Link
          href="/docs/collections/insomnia"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shrink-0"
        >
          View Insomnia Workspace
        </Link>
      </div>
    </div>
  );
}
