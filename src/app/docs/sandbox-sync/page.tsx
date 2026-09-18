'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import QRCode from 'qrcode';
import config from '@/config/env';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { ShareSandboxModal } from '@/components/dashboard/ShareSandboxModal';

export default function SandboxSyncPage() {
  const [uuid, setUuid] = useState('');
  const [signedToken, setSignedToken] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    const updateTokens = (raw: string) => {
      setSignedToken(raw);
      setUuid(raw.split('.')[0]);
    };

    const localToken = typeof window !== 'undefined' ? localStorage.getItem('pg_identity') : '';
    const match = typeof document !== 'undefined' ? document.cookie.match(/pg_identity=([^;]+)/) : null;
    const initial = localToken || (match ? match[1] : '');

    if (initial) {
      updateTokens(initial);
    } else {
      fetch(`${config.apiUrl}/session/stats`, { credentials: 'include' })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.identity?.id) {
            updateTokens(data.identity.id);
          }
        })
        .catch(() => {});
    }
  }, []);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : config.siteUrl;
  const activeParam = signedToken || uuid || 'demo-sandbox-uuid';
  const shareLink = `${baseUrl}/docs?_sandbox=${activeParam}`;

  useEffect(() => {
    if (shareLink) {
      QRCode.toDataURL(shareLink, {
        width: 240,
        margin: 1.5,
        color: { dark: '#0f172a', light: '#ffffff' },
      })
        .then((url) => setQrUrl(url))
        .catch(() => {});
    }
  }, [shareLink]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const curlExample = `# Read posts from specific sandbox
curl -X GET "${config.apiUrl}/posts?_sandbox=${uuid || 'YOUR_SANDBOX_UUID'}"

# Create a new post in the shared sandbox
curl -X POST "${config.apiUrl}/posts?_sandbox=${uuid || 'YOUR_SANDBOX_UUID'}" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "Team Shared Post", "body": "Visible to anyone with this sandbox ID", "userId": 1}'`;

  const jsExample = `// Connect any frontend or mobile app to a shared sandbox
const SANDBOX_ID = "${uuid || 'YOUR_SANDBOX_UUID'}";

// Option A: Via Query Parameter (Works across all endpoints)
const res = await fetch(\`https://playground.nileslabs.com/api/v1/posts?_sandbox=\${SANDBOX_ID}\`);
const { data: posts } = await res.json();

// Option B: Via Header (Ideal for React Native / Axios / Fetch wrappers)
const headerRes = await fetch('https://playground.nileslabs.com/api/v1/posts', {
  headers: {
    'X-Playground-Identity': SANDBOX_ID
  }
});`;

  return (
    <div className="space-y-10 w-full max-w-none text-text-primary">
      {/* 1. Header */}
      <div id="overview" className="space-y-3 border-b border-border-theme pb-6 scroll-mt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/15 text-emerald-400 text-xs sm:text-sm font-bold border border-emerald-500/30">
          <Icon icon="ph:qr-code-bold" className="w-4 h-4" />
          Cross-Device Synchronization & Collaboration
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          Shareable Sandbox URLs & QR Code Sync
        </h1>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Share your isolated mock database state across devices, mobile emulators, teammates, and automated CI pipelines with 1-click shareable URLs (<code className="font-mono text-accent-primary">?_sandbox=&lt;uuid&gt;</code>) and camera QR code scanning.
        </p>
      </div>

      {/* 2. Interactive Live Sandbox QR Sharer Card */}
      <div id="live-share-card" className="p-6 rounded-3xl bg-code-bg border border-border-theme space-y-5 shadow-2xl scroll-mt-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
              <Icon icon="ph:broadcast-bold" className="w-5 h-5" />
            </span>
            <span className="text-xs sm:text-sm font-bold text-text-primary uppercase tracking-wider">
              Your Live Session Share Hub
            </span>
          </div>
          <span className="text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-md bg-accent-light text-accent-primary border border-accent-primary/20">
            Active Identity
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center p-4 bg-bg-secondary rounded-2xl border border-border-theme space-y-3 text-center">
            <div className="p-3 bg-white rounded-xl shadow-md border border-slate-200">
              {qrUrl ? (
                <img src={qrUrl} alt="Live Sandbox QR Code" className="w-40 h-40 rounded-md object-contain" />
              ) : (
                <div className="w-40 h-40 flex items-center justify-center text-text-muted font-mono text-xs">
                  Loading QR...
                </div>
              )}
            </div>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <Icon icon="ph:device-mobile-bold" className="w-4 h-4" /> Scan with Phone Camera
            </span>
          </div>

          {/* Share Actions & Information */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-text-primary">
                Instant Cross-Device Synchronization
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pt-1">
                Scanning this QR code on iOS or Android automatically connects your mobile device to this desktop session. Any resource you create, modify, or delete in the API Studio or Try-It tester will immediately be visible on mobile!
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                Shareable Sandbox URL:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareLink}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-bg-secondary border border-border-theme text-xs sm:text-sm font-mono text-emerald-400 focus:outline-none focus:border-accent-primary select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 rounded-xl bg-accent-primary hover:bg-accent-hover text-white text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Icon icon={copiedLink ? 'ph:check-bold' : 'ph:link-bold'} className="w-4 h-4" />
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-bg-tertiary hover:bg-border-theme text-text-primary text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2"
              >
                <Icon icon="ph:arrows-out-simple-bold" className="w-4 h-4 text-accent-primary" />
                <span>Open Full Share & Destination Modal</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Core Architectural Capabilities */}
      <div className="space-y-6">
        <div id="query-parameter-override" className="p-6 rounded-2xl glass-panel border border-border-theme space-y-3 scroll-mt-20">
          <h2 className="text-base sm:text-lg font-bold text-text-primary flex items-center gap-2">
            <Icon icon="ph:sliders-horizontal-bold" className="w-5 h-5 text-sky-400" />
            1. Query Parameter Identity Override
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            By passing <code className="font-mono text-accent-primary">?_sandbox=&lt;uuid&gt;</code> on any REST or GraphQL request, the backend automatically attaches all read and write mutations to that designated sandbox identity space.
          </p>
          <ul className="space-y-2 text-sm text-text-secondary list-disc pl-5 leading-relaxed">
            <li><strong>Works with Any Endpoint:</strong> Supports GET lists, single-item lookups, POST creates, PUT/PATCH updates, and DELETE purges.</li>
            <li><strong>Zero Cookies Required:</strong> Perfect for Safari cross-origin limitations, Incognito windows, and mobile webviews.</li>
            <li><strong>Accepts Signed Tokens & Raw UUIDs:</strong> Both full signed tokens (<code className="font-mono text-xs">&lt;uuid&gt;.&lt;signature&gt;</code>) and plain UUIDs (<code className="font-mono text-xs">&lt;uuid&gt;</code>) are fully supported.</li>
          </ul>
        </div>

        <div id="mobile-testing" className="p-6 rounded-2xl glass-panel border border-border-theme space-y-3 scroll-mt-20">
          <h2 className="text-base sm:text-lg font-bold text-text-primary flex items-center gap-2">
            <Icon icon="ph:device-mobile-camera-bold" className="w-5 h-5 text-amber-400" />
            2. Mobile App & Device Testing Workflow
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            When developing React Native, Flutter, Swift iOS, or Android Kotlin apps:
          </p>
          <ol className="space-y-2 text-sm text-text-secondary list-decimal pl-5 leading-relaxed">
            <li>Open the documentation portal on your desktop and create your test scenarios (e.g. 5 custom posts and 2 edited users).</li>
            <li>Scan the session QR code or copy the sandbox UUID into your mobile app configuration.</li>
            <li>Your mobile app will immediately interact with the exact state created on your desktop.</li>
          </ol>
        </div>

        <div id="team-sharing" className="p-6 rounded-2xl glass-panel border border-border-theme space-y-3 scroll-mt-20">
          <h2 className="text-base sm:text-lg font-bold text-text-primary flex items-center gap-2">
            <Icon icon="ph:users-three-bold" className="w-5 h-5 text-indigo-400" />
            3. Pull Request & Bug Reproduction Links
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Include a shareable sandbox URL directly in GitHub PR descriptions, Jira tickets, or Slack messages:
          </p>
          <div className="p-3.5 rounded-xl bg-code-bg font-mono text-xs sm:text-sm text-emerald-400 border border-border-theme select-all">
            https://playground.nileslabs.com/docs/posts?_sandbox={uuid || 'e4c85be8-71e1-4560-a292-aa2e38c7f766'}
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            When your reviewer clicks the link, their browser automatically locks into your sandbox overlay without disturbing their own local tests.
          </p>
        </div>
      </div>

      {/* 4. Code Examples */}
      <div id="code-integration" className="space-y-4 pt-4 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">Integration Code Examples</h2>
        <div className="space-y-4">
          <CodeBlock code={curlExample} language="bash" title="cURL CLI Examples" />
          <CodeBlock code={jsExample} language="javascript" title="JavaScript / TypeScript Fetch Examples" />
        </div>
      </div>

      {/* Full Modal */}
      <ShareSandboxModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </div>
  );
}
