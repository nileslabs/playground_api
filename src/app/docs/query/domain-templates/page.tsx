'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function DomainTemplatesPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const [selectedTemplate, setSelectedTemplate] = useState<'ecommerce' | 'crm' | 'blog'>('ecommerce');

  const templates = {
    ecommerce: {
      name: 'E-Commerce Store',
      description: 'Generates products, categories, reviews, and shopping cart records.',
      collections: ['products', 'categories', 'reviews'],
    },
    crm: {
      name: 'CRM & Sales Pipeline',
      description: 'Generates leads, accounts, sales deals, and pipeline stages.',
      collections: ['leads', 'deals', 'contacts'],
    },
    blog: {
      name: 'Editorial Publication',
      description: 'Generates articles, authors, taxonomy tags, and editorial drafts.',
      collections: ['articles', 'authors', 'tags'],
    },
  };

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:sparkle-bold" className="w-3.5 h-3.5" />
          <span>Data & Query Engine</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          1-Click Domain Seeders
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Instantly populate your sandbox with realistic, production-grade mock data tailored for specific business domains. No manual typing required.
        </p>
      </div>

      {/* 2. Interactive Seeder Runner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Choose Domain Template to Seed</h3>
            <p className="text-xs text-slate-500">Pick a preset to populate custom collections in your visitor session:</p>
          </div>

          <div className="flex items-center gap-2">
            {(['ecommerce', 'crm', 'blog'] as const).map((tmpl) => (
              <button
                key={tmpl}
                type="button"
                onClick={() => setSelectedTemplate(tmpl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedTemplate === tmpl
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {templates[tmpl].name}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-900 space-y-1">
          <div className="font-semibold">{templates[selectedTemplate].description}</div>
          <div className="text-indigo-600">
            Collections generated: {templates[selectedTemplate].collections.map((c) => `/custom/${c}`).join(', ')}
          </div>
        </div>

        <InteractiveConsole
          method="POST"
          path="/custom/seed"
          title="Seed Domain Template"
          initialBody={JSON.stringify({ template: selectedTemplate }, null, 2)}
        />
      </div>

      {/* 3. Preset Domain Cards */}
      <div id="available-templates" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Available Domain Templates
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <Icon icon="ph:shopping-cart-bold" className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">E-Commerce Template</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provides products with SKU, inventory count, price, categories, and customer rating scores.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <Icon icon="ph:chart-pie-slice-bold" className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">CRM & Pipeline Template</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Generates sales leads with deal value, stage status, company names, and assigned representatives.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <Icon icon="ph:article-bold" className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Editorial Blog Template</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Generates articles with rich markdown content, cover image URLs, estimated read times, and author bios.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
