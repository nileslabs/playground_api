import React from 'react';
import type { Metadata } from 'next';
import { DocsSidebar } from '@/components/layout/DocsSidebar';
import { OnThisPage } from '@/components/docs/OnThisPage';
import { DocPagination } from '@/components/docs/DocPagination';
import { DocStructuredData } from '@/components/docs/DocStructuredData';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: {
    template: '%s | Playground API Documentation',
    default: 'Playground API Documentation — Stateful Mock REST & GraphQL Service',
  },
  description:
    'Comprehensive documentation, sandbox tools, and architecture guides for Playground API. Test persistent CRUD mutations, JWT auth, Stripe payments, WebSockets, and network latency.',
  openGraph: {
    type: 'website',
    siteName: 'Playground API Documentation',
    url: `${siteConfig.url}/docs`,
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] w-full relative bg-slate-50/40 text-slate-900 border-t border-slate-100">
      {/* Dynamic Structured Data (Breadcrumbs & TechArticle JSON-LD) */}
      <DocStructuredData />

      {/* Sticky Clean Docs Sidebar (Left) */}
      <DocsSidebar className="hidden md:block" />

      {/* Main Content Area - Fluid, Crisp Landing Page Aesthetic */}
      <main
        id="docs-content"
        className="flex-1 min-w-0 w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-10 flex justify-center"
      >
        <div className="w-full max-w-4xl lg:max-w-5xl space-y-12 pb-20">
          {children}
          <DocPagination />
        </div>
      </main>

      {/* Sticky Table of Contents (Right) */}
      <OnThisPage className="hidden xl:block bg-white border-l border-slate-200" />
    </div>
  );
}

