'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { CodeBlock } from '@/components/ui/CodeBlock';

export default function MobileQrSyncPage() {
  const siteUrl = config.siteUrl || 'https://playground.nileslabs.com';
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const [sessionId, setSessionId] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Fetch active session identity from stats endpoint
    async function loadIdentity() {
      try {
        const res = await fetch(`${config.apiUrl}/session/stats`, { credentials: 'include' });
        const data = await res.json();
        if (data?.identity?.id) {
          setSessionId(data.identity.id);
        } else {
          setSessionId('mobile-demo-session-8f42');
        }
      } catch {
        setSessionId('mobile-demo-session-8f42');
      }
    }
    loadIdentity();
  }, []);

  const syncUrl = `${siteUrl}?_sandbox=${sessionId || 'active-session'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(syncUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const reactNativeSnippet = `// App.tsx in React Native / Expo
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import axios from 'axios';

// 1. Session token extracted from QR scanner or deep link
const MOBILE_SESSION_ID = '${sessionId || 'mobile-demo-session-8f42'}';

const api = axios.create({
  baseURL: '${publicApiUrl}',
  headers: {
    // Synchronizes this mobile device with your desktop session!
    'X-Playground-Identity': MOBILE_SESSION_ID,
  },
});

export default function MobileBlogFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/posts?_limit=10').then((res) => {
      setPosts(res.data.data);
    });
  }, []);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 15 }}>
        Synchronized Desktop Feed
      </Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee' }}>
            <Text style={{ fontWeight: '600' }}>{item.title}</Text>
            <Text style={{ color: '#666', marginTop: 4 }}>{item.body}</Text>
          </View>
        )}
      />
    </View>
  );
}`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:qr-code-bold" className="w-3.5 h-3.5" />
          <span>Sandbox State &amp; Health</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Mobile QR Code State Synchronization
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Test mobile responsive websites, iOS Safari, Android Chrome, and React Native builds with the exact stateful data you crafted on your desktop. Sync session tokens across physical devices via QR code without logging in or configuring local proxy tunnels.
        </p>
      </div>

      {/* 2. Live QR Code Generator & Token Binding Card */}
      <div id="live-qr" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-8 scroll-mt-20">
        {/* QR Visual Card */}
        <div className="w-44 h-44 rounded-2xl border-2 border-indigo-200 bg-slate-50 p-4 flex flex-col items-center justify-center shrink-0 shadow-inner group relative">
          <Icon icon="ph:qr-code-bold" className="w-28 h-28 text-indigo-600 group-hover:scale-105 transition-transform" />
          <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mt-1">
            SCAN WITH CAMERA
          </span>
        </div>

        {/* Sync Controls & Info */}
        <div className="space-y-4 flex-1">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Live Desktop Session Connected
              </span>
            </div>
            <h2 className="font-extrabold text-xl text-slate-900">Scan to Sync Desktop Sandbox</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Scanning this QR code with your mobile camera opens the web app with the <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-bold">?_sandbox=...</code> parameter, binding your mobile browser to your active desktop sandbox.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Active Sync URL
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="font-mono text-xs text-indigo-700 font-semibold break-all select-all">
                {syncUrl}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all cursor-pointer shadow-2xs shrink-0"
              >
                <Icon icon={copiedLink ? 'ph:check-bold' : 'ph:copy-bold'} className="w-3.5 h-3.5 text-indigo-600" />
                <span>{copiedLink ? 'Copied URL!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. How Synchronization Works */}
      <div id="how-it-works" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Cross-Device Sync Architecture
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h3 className="font-bold text-base text-slate-900">Scan QR Code</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Use iOS Camera or Android Lens to scan the code. No app downloads or authentication logins required.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h3 className="font-bold text-base text-slate-900">Cookie Replicated</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              The API receives the <code className="font-mono text-xs text-indigo-600">_sandbox</code> query param and issues a matching session cookie to your mobile browser.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h3 className="font-bold text-base text-slate-900">Bidirectional Sync</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Posts created on your phone appear immediately on desktop. Both devices share the exact same stateful overlay.
            </p>
          </div>
        </div>
      </div>

      {/* 4. React Native & Expo Code Example */}
      <div id="react-native" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            React Native &amp; Expo Setup
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            In mobile native environments where cookies are not automatically shared, pass the session token via the <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-bold">X-Playground-Identity</code> header:
          </p>
        </div>

        <CodeBlock
          code={reactNativeSnippet}
          language="typescript"
          title="MobileBlogFeed.tsx"
          maxHeight="max-h-110"
        />
      </div>

      {/* 5. Navigation Footer */}
      <div className="p-6 sm:p-7 rounded-2xl border border-indigo-100 bg-indigo-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-slate-900">Want to inspect cluster health metrics?</h3>
          <p className="text-sm text-slate-600">Monitor live server uptime, latency round-trips, and memory usage telemetry.</p>
        </div>
        <Link
          href="/docs/sandbox/system-health"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shrink-0"
        >
          View System Health
        </Link>
      </div>
    </div>
  );
}
