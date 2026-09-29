'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { CodeBlock } from '@/components/ui/CodeBlock';

export default function PostmanDownloadPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const downloadUrl = `${publicApiUrl}/downloads/postman.json`;

  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(downloadUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const testScriptSnippet = `// Postman Tests Script embedded in "POST /auth/login"
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Extract and store JWT bearer token", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('token');
    
    // Automatically saves token to collection variables
    pm.collectionVariables.set("bearer_token", jsonData.token);
    pm.collectionVariables.set("user_id", jsonData.user.id);
    console.log("Session token captured for subsequent requests!");
});`;

  const newmanSnippet = `# Run complete test collection headlessly in GitHub Actions or local CLI
npx newman run ${downloadUrl} \\
  --global-var "identity=newman-ci-runner-1" \\
  --reporters cli,json \\
  --reporter-json-export ./results.json`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold uppercase tracking-wider border border-amber-200">
          <Icon icon="ph:paper-plane-bold" className="w-3.5 h-3.5" />
          <span>Client Collections</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Postman Collection v2.1
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Import a full, organized workspace into Postman. Includes pre-configured environment variables, Bearer token capture scripts, chaos testing presets, and request bodies for all REST resources.
        </p>
      </div>

      {/* 2. Download Card */}
      <div id="download-card" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 scroll-mt-20">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Postman v2.1
            </span>
            <span className="text-xs text-slate-500 font-mono">playground-api.postman_collection.json</span>
          </div>
          <h2 className="font-extrabold text-xl text-slate-900">Ready-to-Import Postman Workspace</h2>
          <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
            Preloaded with authentication login flows, relational queries, custom collections, and chaos headers (<code className="font-mono text-xs">X-Chaos-Flaky</code>, <code className="font-mono text-xs">_delay</code>).
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
            download="playground-api.postman_collection.json"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          >
            <Icon icon="ph:download-simple-bold" className="w-4 h-4" />
            <span>Download Postman JSON</span>
          </a>
        </div>
      </div>

      {/* 3. Import Instructions */}
      <div id="instructions" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          How to Import into Postman
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h3 className="font-bold text-base text-slate-900">Click &quot;Import&quot;</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Open Postman desktop and click the &quot;Import&quot; button in the top left workspace navigation.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h3 className="font-bold text-base text-slate-900">Paste Link or File</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Drag and drop the downloaded JSON file, or paste the collection URL directly into the URL bar.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h3 className="font-bold text-base text-slate-900">Run Login First</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Execute <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-amber-700">POST /auth/login</code> first — the test script automatically injects the token into your variables.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Automated Token Management Script */}
      <div id="test-scripts" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Automated Bearer Token Capture Script
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            The collection includes post-response test scripts that save authentication tokens automatically:
          </p>
        </div>

        <CodeBlock
          code={testScriptSnippet}
          language="javascript"
          title="auth-login-tests.js"
          maxHeight="max-h-80"
        />
      </div>

      {/* 5. Headless Newman CI/CD Testing */}
      <div id="newman-ci" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Headless Automated Testing via Newman
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Run the entire collection in continuous integration test suites without manual steps:
          </p>
        </div>

        <CodeBlock
          code={newmanSnippet}
          language="bash"
          title="run-newman.sh"
          maxHeight="max-h-60"
        />
      </div>

      {/* 6. Navigation Footer */}
      <div className="p-6 sm:p-7 rounded-2xl border border-indigo-100 bg-indigo-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-slate-900">Prefer Git-friendly API collections?</h3>
          <p className="text-sm text-slate-600">Download the Bruno collection to commit and version-control test requests alongside your code.</p>
        </div>
        <Link
          href="/docs/collections/bruno"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shrink-0"
        >
          View Bruno Collection
        </Link>
      </div>
    </div>
  );
}
