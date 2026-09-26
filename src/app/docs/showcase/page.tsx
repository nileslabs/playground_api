import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { getDocArticleSchema, getBreadcrumbSchema } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Real-World Project Showcase & Demo Apps — Playground API',
  description:
    'Explore production-grade demo stores, interactive React 19 apps, Next.js setups, and automated E2E test fixtures powered by Playground API stateful sandboxes.',
  keywords: [
    'mock api showcase',
    'react demo app mock api',
    'e-commerce mock frontend',
    'stateful rest api demo',
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

  // 2. Create a new custom product (Persists in user session!)
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
          See how developers use Playground API to build full-stack frontends, stateful mock stores, and automated test suites with zero backend infrastructure.
        </p>
      </div>

      {/* 2. Featured Official Project: React E-Commerce Demo */}
      <div id="featured-demo" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="space-y-4 border-b border-slate-100 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
            <Icon icon="ph:star-fill" className="w-3.5 h-3.5 text-amber-500" />
            <span>Official Featured App</span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Playground React E-Commerce Store & Studio
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              A production-ready React 18 e-commerce application featuring product catalog management, interactive cart drawer, JWT authentication, and isolated session sandbox mutations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/docs/studio"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Icon icon="ph:play-circle-bold" className="w-4 h-4" />
              <span>Try in API Studio</span>
            </Link>
            <a
              href="https://github.com/nileslabs/playground_api/tree/main/playground_api_react_demo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-all"
            >
              <Icon icon="simple-icons:github" className="w-4 h-4" />
              <span>View Source Code</span>
            </a>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Icon icon="ph:shopping-bag-bold" className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Dynamic Products</h3>
            <p className="text-xs text-slate-600 leading-normal">
              Uses <code className="font-mono text-indigo-600 bg-white px-1 py-0.5 rounded border border-slate-200">/custom/products</code> to allow users to add, edit, and delete products that persist on page reload.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Icon icon="ph:shopping-cart-bold" className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Cart & Checkout</h3>
            <p className="text-xs text-slate-600 leading-normal">
              Real-time cart drawer with automatic total calculation and mock order submission.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Icon icon="ph:lock-key-bold" className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">JWT Auth Flow</h3>
            <p className="text-xs text-slate-600 leading-normal">
              Login via <code className="font-mono text-indigo-600 bg-white px-1 py-0.5 rounded border border-slate-200">/auth/login</code> and load protected account profiles using access tokens.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <Icon icon="ph:timer-bold" className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Loading Skeletons</h3>
            <p className="text-xs text-slate-600 leading-normal">
              Tests skeleton loaders seamlessly with <code className="font-mono text-indigo-600 bg-white px-1 py-0.5 rounded border border-slate-200">?_delay=1500</code>.
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

      {/* 3. Real-World Architecture Patterns */}
      <div id="architecture-patterns" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Common Use-Case Architecture Blueprints
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
              <Icon icon="simple-icons:nextdotjs" className="w-5 h-5 text-slate-900" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Next.js 15 Server Actions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Build full-stack server-side rendered blogs with optimistic UI updates and zero database migrations.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 font-mono text-[11px] text-slate-600">
              POST /api/v1/posts → revalidatePath(&apos;/&apos;)
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
              <Icon icon="simple-icons:vuedotjs" className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Vue 3 / Pinia Kanban Board</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Manage interactive todo task boards with drag-and-drop status changes using <code className="font-mono text-indigo-600">PATCH /todos/:id</code>.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 font-mono text-[11px] text-slate-600">
              PATCH /api/v1/todos/1 &#123; completed: true &#125;
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center">
              <Icon icon="simple-icons:playwright" className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Automated CI/CD Test Fixtures</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Export sandbox state to JSON snapshots and load deterministic fixtures into Playwright or Cypress runs.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 font-mono text-[11px] text-slate-600">
              POST /api/v1/session/import &#123; snapshot &#125;
            </div>
          </div>
        </div>
      </div>

      {/* 4. Community Submissions */}
      <div id="community-submissions" className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-4 scroll-mt-20">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
          <Icon icon="ph:sparkle-bold" className="w-6 h-6" />
        </div>
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">Submit Your Project</h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Have you built a React, Vue, Svelte, or Mobile tutorial or application using Playground API? Open a pull request or issue on GitHub to be featured here!
        </p>
        <div>
          <a
            href="https://github.com/nileslabs/playground_api/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs"
          >
            <Icon icon="simple-icons:github" className="w-4 h-4" />
            <span>Submit Project on GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );
}
