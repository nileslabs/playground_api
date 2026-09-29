import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { getDocArticleSchema, getBreadcrumbSchema } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Real-World Project Showcase & Architecture Blueprints — Playground API',
  description:
    'Explore production-grade demo stores, interactive React apps, Next.js server action blogs, real-time WebSockets, and automated CI test fixtures powered by Playground API stateful sandboxes.',
  keywords: [
    'mock api showcase',
    'react demo app mock api',
    'e-commerce mock frontend',
    'stateful rest api demo',
    'websocket mock demo',
  ],
  alternates: {
    canonical: `${siteConfig.url}/docs/showcase`,
  },
  openGraph: {
    title: 'Real-World Project Showcase — Playground API',
    description:
      'Explore live applications, React demo stores, and architectural recipes built with Playground API.',
    url: `${siteConfig.url}/docs/showcase`,
    type: 'article',
  },
};

export default function ShowcasePage() {
  const jsonLdArticle = getDocArticleSchema({
    title: 'Real-World Project Showcase — Playground API',
    description: 'Explore live applications, React demo stores, and recipes built with Playground API.',
    url: `${siteConfig.url}/docs/showcase`,
  });

  const jsonLdBreadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Docs', url: `${siteConfig.url}/docs` },
    { name: 'Showcase', url: `${siteConfig.url}/docs/showcase` },
  ]);

  const sampleReactIntegration = `// Example from playground_api_react_demo
import { useState, useEffect } from 'react';

export function useProductCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch dynamic products with persistent sandbox overlay
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('${config.publicApiUrl}/custom/products?_sort=createdAt&_order=desc', {
        credentials: 'include',
      });
      const data = await res.json();
      setProducts(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  // 2. Create a new custom product (Persists in user session overlay!)
  const addProduct = async (productData) => {
    const res = await fetch('${config.publicApiUrl}/custom/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(productData),
    });
    if (res.ok) {
      await fetchProducts(); // Refresh list to see the newly created item
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, addProduct };
}`;

  const sampleWebSocketChat = `// Real-Time WebSocket Client Integration
const wsUrl = '${config.publicApiUrl.replace('http', 'ws')}/ws';
const socket = new WebSocket(wsUrl);

socket.onopen = () => {
  console.log('Connected to Playground Real-Time Hub');
  // Join a shared chat room
  socket.send(JSON.stringify({
    type: 'join',
    room: 'general-lobby',
    username: 'FrontendDev',
  }));
};

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Incoming real-time event:', message);
};`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />

      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:rocket-launch-bold" className="w-3.5 h-3.5" />
          <span>Real-World Architecture</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Built with Playground API
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Discover how frontend engineers, QA teams, and educators use Playground API to build production-grade web applications, reactive state stores, and automated test pipelines with zero backend infrastructure.
        </p>
      </div>

      {/* 2. Featured Official Project: React E-Commerce Demo */}
      <div id="featured-demo" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="space-y-4 border-b border-slate-100 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
            <Icon icon="ph:star-fill" className="w-3.5 h-3.5 text-amber-500" />
            <span>Official Featured Application</span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Playground React E-Commerce Store & Studio
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              A complete, production-ready React 18 e-commerce application featuring dynamic catalog management, interactive cart drawer, simulated JWT authentication, and isolated session sandbox mutations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/docs/toolkit/studio"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Icon icon="ph:play-circle-bold" className="w-4 h-4" />
              <span>Try in API Studio</span>
            </Link>
            <a
              href="https://github.com/nileslabs/playground_api/tree/main/playground_api_react_demo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-semibold transition-all"
            >
              <Icon icon="simple-icons:github" className="w-4 h-4" />
              <span>View Source on GitHub</span>
            </a>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Icon icon="ph:shopping-bag-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Dynamic Products</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Uses <code className="font-mono text-xs text-indigo-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">/custom/products</code> to let users create, edit, and delete products with persistent session overlays.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Icon icon="ph:shopping-cart-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Cart & Checkout</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Reactive cart drawer with real-time tax calculation, coupon codes, and simulated order submission.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Icon icon="ph:lock-key-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">JWT Auth Flow</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Full login loop with <code className="font-mono text-xs text-indigo-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">/auth/login</code> and protected user profile hydration.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <Icon icon="ph:timer-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Skeleton Loaders</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Tests skeleton loaders seamlessly with artificial latency using <code className="font-mono text-xs text-indigo-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">?_delay=1200</code>.
            </p>
          </div>
        </div>

        {/* Integration Code Sample */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            How the React Demo Integrates with Playground API:
          </span>
          <CodeBlock
            code={sampleReactIntegration}
            language="javascript"
            title="playground_api_react_demo/src/hooks/useProducts.js"
          />
        </div>
      </div>

      {/* 3. Real-World Architecture Blueprints */}
      <div id="blueprints" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Architecture Blueprints & Case Studies
        </h2>
        <p className="text-base text-slate-600 leading-relaxed">
          Explore architectural patterns demonstrating how Playground API satisfies complex frontend scenarios:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          {/* Blueprint 1 */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
              <Icon icon="simple-icons:nextdotjs" className="w-5 h-5 text-slate-900" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Next.js 15 Server-Side Blog</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Full-stack server-side rendered blog with Server Actions, optimistic cache invalidation, and zero database setup.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 font-mono text-xs text-slate-600">
              POST /api/v1/posts → revalidatePath(&apos;/&apos;)
            </div>
          </div>

          {/* Blueprint 2 */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
              <Icon icon="ph:broadcast-bold" className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Live Chat with Presence</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              WebSocket chat room with automated presence bot, typing indicator events, and room-scoped message broadcasting.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 font-mono text-xs text-slate-600">
              ws://.../ws → &#123; type: &apos;chat&apos;, room: &apos;lobby&apos; &#125;
            </div>
          </div>

          {/* Blueprint 3 */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center">
              <Icon icon="simple-icons:playwright" className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Parallel CI/CD Pipelines</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Export sandbox snapshots and isolate parallel GitHub Actions workers with <code className="font-mono text-purple-700">X-Playground-Identity</code>.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 font-mono text-xs text-slate-600">
              DELETE /api/v1/session/reset
            </div>
          </div>
        </div>
      </div>

      {/* 4. Real-Time WebSocket Showcase Snippet */}
      <div id="realtime-chat" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Real-Time WebSocket Integration
        </h2>
        <p className="text-base text-slate-600 leading-relaxed">
          Playground API provides full bidirectional WebSockets. Connect your client and immediately receive automated responses from our live echo and presence bot:
        </p>

        <CodeBlock
          code={sampleWebSocketChat}
          language="javascript"
          title="realtime-chat-client.js"
        />
      </div>

      {/* 5. Community Submissions */}
      <div id="community-submissions" className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-4 scroll-mt-20">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
          <Icon icon="ph:sparkle-bold" className="w-6 h-6" />
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Submit Your Project</h3>
        <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
          Have you built a React, Vue, Svelte, or Mobile tutorial or application using Playground API? Open a pull request or issue on GitHub to be featured here!
        </p>
        <div>
          <a
            href="https://github.com/nileslabs/playground_api/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-all shadow-xs"
          >
            <Icon icon="simple-icons:github" className="w-4 h-4" />
            <span>Submit Project on GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );
}
