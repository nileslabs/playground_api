'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

export function QuickstartSection() {
  const [baseUrl, setBaseUrl] = useState<string>(
    config.publicApiUrl || 'https://playground.nileslabs.com/api/v1'
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const apiPrefix = config.apiUrl?.startsWith('http')
        ? config.apiUrl
        : `${origin}${config.apiUrl?.startsWith('/') ? '' : '/'}${config.apiUrl || 'api/v1'}`;
      setBaseUrl(apiPrefix);
    }
  }, []);

  const snippets: Record<string, string> = {
    fetch: `// 1. Point your API client
const res = await fetch('${baseUrl}/posts?_limit=5');
const posts = await res.json();

// 2. Create data with state persistence
const created = await fetch('${baseUrl}/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'New Article', user_id: 1 })
}).then(r => r.json());

// 3. Simulate slow networks & errors
await fetch('${baseUrl}/posts?_delay=1500');
await fetch('${baseUrl}/posts?_status=500');`,

    axios: `import axios from 'axios';

// 1. Fetch posts
const { data: posts } = await axios.get('${baseUrl}/posts', {
  params: { _limit: 5 }
});

// 2. Create post (persisted in your session)
const { data: created } = await axios.post('${baseUrl}/posts', {
  title: 'New Article',
  user_id: 1
});

// 3. Test latency and error boundaries
await axios.get('${baseUrl}/posts?_delay=1500');
await axios.get('${baseUrl}/posts?_status=500');`,

    curl: `# 1. Fetch paginated posts
curl -X GET "${baseUrl}/posts?_limit=5"

# 2. Mutate state (persists in your session)
curl -X POST "${baseUrl}/posts" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "New Article", "user_id": 1}'

# 3. Simulate slow network or error
curl -X GET "${baseUrl}/posts?_delay=1500"
curl -X GET "${baseUrl}/posts?_status=500"`,
  };

  return (
    <section className="py-16 sm:py-20 bg-bg-primary border-b border-border-theme">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight">
            Start in 30 seconds
          </h2>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-normal">
            Zero configuration. No signups, API keys, or databases required.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-bg-secondary border border-border-theme space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold text-accent-primary flex items-center gap-2">
                <span>01</span>
                <span>—</span>
                <span>Connect</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-text-primary">
                Point your frontend
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Point your HTTP client or mobile app to any Playground API endpoint.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-code-bg border border-border-theme font-mono text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-bold">
              <code>GET /api/v1/posts</code>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-bg-secondary border border-border-theme space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold text-accent-primary flex items-center gap-2">
                <span>02</span>
                <span>—</span>
                <span>Build</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-text-primary">
                Create and modify data
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Send standard mutations. Data persists privately in your session overlay.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-code-bg border border-border-theme font-mono text-xs sm:text-sm font-bold space-y-1">
              <div className="text-blue-600 dark:text-blue-400">POST /posts</div>
              <div className="text-amber-600 dark:text-amber-400">PUT /posts/1</div>
              <div className="text-rose-600 dark:text-rose-400">DELETE /posts/1</div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-bg-secondary border border-border-theme space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold text-accent-primary flex items-center gap-2">
                <span>03</span>
                <span>—</span>
                <span>Test</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-text-primary">
                Simulate conditions
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Inject network delays and verify error boundaries directly with params.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-code-bg border border-border-theme font-mono text-xs sm:text-sm font-bold space-y-1">
              <div className="text-purple-600 dark:text-purple-400">?_delay=1500</div>
              <div className="text-rose-600 dark:text-rose-400">?_status=500</div>
            </div>
          </div>

        </div>

        {/* Multi-Language Code Example */}
        <div className="max-w-4xl mx-auto space-y-4">
          <CodeBlock
            snippets={snippets}
            defaultTab="fetch"
            maxHeight="max-h-[20rem]"
            className="shadow-xl text-xs sm:text-sm"
          />

          {/* Intermediate Conversion Action */}
          <div className="text-center pt-2">
            <Link
              href="/docs/studio"
              className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-accent-primary hover:underline"
            >
              <span>Open Playground →</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

export default QuickstartSection;
