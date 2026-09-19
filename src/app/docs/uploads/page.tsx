import React from 'react';
import type { Metadata } from 'next';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';
import { siteConfig } from '@/config/site';
import { LiveUploadStudio } from '@/components/docs/LiveUploadStudio';

export const metadata: Metadata = {
  title: 'Multipart File Uploads & Mock Cloud Storage CDN Sandbox — Playground API',
  description:
    'Test single and bulk multipart/form-data file uploads, simulate network latency, inspect real-time progress, and preview Cloudinary CDN URLs in your isolated sandbox.',
  keywords: [
    'mock file upload api',
    'multipart form-data testing',
    'bulk file upload mock api',
    'cloudinary cdn sandbox',
    'file upload progress bar simulator',
    'magic bytes validation mock',
    'upload latency simulation',
    'playwright file upload testing'
  ],
  alternates: {
    canonical: `${siteConfig.url}/docs/uploads`,
  },
  openGraph: {
    title: 'Multipart File Uploads & Mock Cloud Storage CDN — Playground API',
    description:
      'In-browser live upload studio with drag-and-drop, byte-level progress reporting, itemized bulk upload validation, and Cloudinary CDN URL generation.',
    url: `${siteConfig.url}/docs/uploads`,
    type: 'article',
  },
};

export default function UploadsDocsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const singleUploadSdk = `// 1. Single File Upload using TypeScript SDK (Browser or Node.js)
import { PlaygroundClient } from 'playground-api';

const client = new PlaygroundClient({
  identityToken: 'your_sandbox_identity_token'
});

// In Browser (from HTML <input type="file">):
const fileInput = document.querySelector<HTMLInputElement>('#avatarInput');
if (fileInput?.files?.[0]) {
  const result = await client.uploads.upload(fileInput.files[0], {
    category: 'avatars',
    onProgress: (percent, loaded, total) => {
      console.log(\`Upload Progress: \${percent}% (\${loaded}/\${total} bytes)\`);
    }
  });

  console.log('File uploaded to CDN:', result.url);
  console.log('File ID:', result.id);
}`;

  const bulkUploadSdk = `// 2. Itemized Bulk Uploads with Granular Per-File Breakdown
const fileList = document.querySelector<HTMLInputElement>('#documentsInput')?.files;

if (fileList && fileList.length > 0) {
  const bulkResult = await client.uploads.uploadBulk(Array.from(fileList), {
    category: 'documents',
    simulateDelayMs: 500,
    onProgress: (percent) => console.log(\`Bulk progress: \${percent}%\`)
  });

  console.log(\`Uploaded \${bulkResult.summary.successful} / \${bulkResult.summary.total} files\`);

  // Each file has its own individual status & error details
  bulkResult.results.forEach((item) => {
    if (item.status === 'success') {
      console.log(\`✅ \${item.original_name} -> \${item.url}\`);
    } else {
      console.error(\`❌ \${item.original_name} failed: \${item.error} (\${item.code})\`);
    }
  });
}`;

  const fetchExample = `// 3. Standard Fetch API (Vanilla JavaScript)
const formData = new FormData();
formData.append('file', selectedFile);
formData.append('category', 'attachments');

const response = await fetch('${publicApiUrl}/uploads', {
  method: 'POST',
  headers: {
    'X-Playground-Identity': 'your_sandbox_identity_token'
    // Note: Do NOT manually set 'Content-Type'; fetch sets boundary automatically!
  },
  body: formData
});

const data = await response.json();
console.log('Uploaded CDN URL:', data.data.url);`;

  const playwrightExample = `// 4. Automated E2E File Upload Testing (Playwright)
import { test, expect } from '@playwright/test';
import path from 'path';

test('upload profile avatar and verify CDN preview', async ({ request, page }) => {
  // Attach file using Playwright APIRequestContext
  const response = await request.post('${publicApiUrl}/uploads', {
    headers: {
      'X-Playground-Identity': 'test_e2e_session'
    },
    multipart: {
      file: {
        name: 'sample_avatar.png',
        mimeType: 'image/png',
        buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64')
      },
      category: 'avatars'
    }
  });

  expect(response.status()).toBe(201);
  const json = await response.json();
  
  expect(json.data.category).toBe('avatars');
  expect(json.data.url).toContain('cloudinary.com');
  expect(json.data.size_bytes).toBeGreaterThan(0);
});`;

  const curlExample = `# 5. Single File Upload via cURL
curl -X POST "${publicApiUrl}/uploads" \\
  -H "X-Playground-Identity: your_session_token" \\
  -F "file=@/path/to/profile.png" \\
  -F "category=avatars"

# 6. Bulk Upload via cURL (Up to 10 files)
curl -X POST "${publicApiUrl}/uploads/bulk" \\
  -H "X-Playground-Identity: your_session_token" \\
  -F "files=@/path/to/doc1.pdf" \\
  -F "files=@/path/to/doc2.jpg" \\
  -F "category=documents"`;

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-16">
      {/* Top Interactive Upload Studio */}
      <LiveUploadStudio />

      {/* Architecture & Capabilities */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Icon icon="lucide:cloud-upload" className="w-5 h-5 text-indigo-500" />
          Cloud Storage CDN Architecture &amp; Security Guardrails
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Playground API provides a production-grade simulated Cloud Storage CDN sandbox powered by Cloudinary. Uploaded files are processed in zero-disk memory buffers, inspected with binary magic bytes sniffing, partitioned into deep per-identity isolation folders, and assigned publicly accessible HTTPS CDN URLs with instant latency simulation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Icon icon="lucide:shield-alert" className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Magic Bytes &amp; Anti-Malware
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Binary header signature inspection prevents executable masking (e.g. <code>.exe</code>, <code>.sh</code>, <code>.php</code> renamed to <code>.png</code>). Prohibited extensions are immediately rejected.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Icon icon="lucide:layers" className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Itemized Bulk Uploads
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Uploading multiple files returns an itemized per-file status list. If 3 files succeed and 2 fail (e.g. oversized or blocked type), valid files are stored while failed files return exact reason codes.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Icon icon="lucide:gauge" className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Network Delay Simulation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Use <code>X-Simulate-Delay: 1500</code> or <code>?_delay=1500</code> to test client progress spinners, cancel tokens, and slow 3G network conditions before files reach the CDN.
            </p>
          </div>
        </div>
      </section>

      {/* Thresholds & Quotas Table */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Icon icon="lucide:sliders" className="w-5 h-5 text-indigo-500" />
          Strict Thresholds &amp; Quotas
        </h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Parameter</th>
                <th className="px-4 py-3">Limit</th>
                <th className="px-4 py-3">Error Code</th>
                <th className="px-4 py-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="px-4 py-3 font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">Single File Size</td>
                <td className="px-4 py-3 font-semibold">5 MB</td>
                <td className="px-4 py-3 font-mono text-xs text-rose-500">FILE_TOO_LARGE</td>
                <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">Files exceeding 5,242,880 bytes are rejected before memory allocation.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">Bulk Batch Total</td>
                <td className="px-4 py-3 font-semibold">25 MB / 10 files</td>
                <td className="px-4 py-3 font-mono text-xs text-rose-500">BATCH_TOO_LARGE</td>
                <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">Total size of files in a single bulk request cannot exceed 25 MB.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">Active Files Quota</td>
                <td className="px-4 py-3 font-semibold">15 files / identity</td>
                <td className="px-4 py-3 font-mono text-xs text-amber-500">QUOTA_EXCEEDED</td>
                <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">Per-session storage quota. Reset session or delete old files to free capacity.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">Blocked Formats</td>
                <td className="px-4 py-3 font-semibold">.exe, .sh, .bat, .php, .js, .jar</td>
                <td className="px-4 py-3 font-mono text-xs text-rose-500">PROHIBITED_FILE_TYPE</td>
                <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">Dangerous executable script files are strictly blocked via extension and magic byte headers.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Endpoints Reference */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Icon icon="lucide:terminal" className="w-5 h-5 text-indigo-500" />
          REST API Endpoints Reference
        </h2>
        <div className="grid grid-cols-1 gap-3">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-bold font-mono rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">POST</span>
                <code className="text-sm font-semibold text-slate-900 dark:text-white">/api/v1/uploads</code>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Upload a single multipart file (field: <code>file</code>, optional: <code>category</code>).</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 self-start md:self-auto">multipart/form-data</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-bold font-mono rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">POST</span>
                <code className="text-sm font-semibold text-slate-900 dark:text-white">/api/v1/uploads/bulk</code>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Upload multiple files simultaneously with itemized validation results (field: <code>files</code>).</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 self-start md:self-auto">multipart/form-data</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-bold font-mono rounded bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">GET</span>
                <code className="text-sm font-semibold text-slate-900 dark:text-white">/api/v1/uploads?category=avatars</code>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">List all uploaded files in current sandbox identity with optional category filter.</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 self-start md:self-auto">application/json</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-bold font-mono rounded bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">DELETE</span>
                <code className="text-sm font-semibold text-slate-900 dark:text-white">/api/v1/uploads/:id</code>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Purge an uploaded file from sandbox storage and Cloudinary CDN.</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 self-start md:self-auto">application/json</span>
          </div>
        </div>
      </section>

      {/* Code Integration Examples */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Icon icon="lucide:code-2" className="w-5 h-5 text-indigo-500" />
          Code Integration Examples
        </h2>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Icon icon="simple-icons:typescript" className="w-4 h-4 text-blue-500" />
            Official TypeScript SDK: Single File Upload
          </h3>
          <CodeBlock code={singleUploadSdk} language="typescript" />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Icon icon="simple-icons:typescript" className="w-4 h-4 text-blue-500" />
            Official TypeScript SDK: Itemized Bulk Upload
          </h3>
          <CodeBlock code={bulkUploadSdk} language="typescript" />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Icon icon="simple-icons:javascript" className="w-4 h-4 text-amber-500" />
            Standard Fetch &amp; FormData API
          </h3>
          <CodeBlock code={fetchExample} language="javascript" />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Icon icon="simple-icons:playwright" className="w-4 h-4 text-emerald-500" />
            Automated E2E Test Suite (Playwright)
          </h3>
          <CodeBlock code={playwrightExample} language="typescript" />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Icon icon="lucide:terminal" className="w-4 h-4 text-slate-500" />
            cURL Terminal Commands
          </h3>
          <CodeBlock code={curlExample} language="bash" />
        </div>
      </section>
    </div>
  );
}
