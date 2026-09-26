'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function GraphqlQueriesPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:tree-structure-bold" className="w-3.5 h-3.5" />
          <span>GraphQL Gateway</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Relational Nested Queries
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Fetch relational data graphs in a single network round-trip. Query authors, their published posts, and attached comments without the N+1 problem.
        </p>
      </div>

      {/* 2. Interactive Query Runner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Nested Post & Author Query</h3>
          <p className="text-xs text-slate-500">
            Submit a GraphQL payload to fetch posts along with linked author details:
          </p>
        </div>

        <InteractiveConsole
          method="POST"
          path="/graphql"
          title="Execute Relational GraphQL Query"
          initialBody={JSON.stringify(
            {
              query: `query {
  posts(_limit: 2) {
    id
    title
    user {
      id
      name
      email
    }
  }
}`,
            },
            null,
            2
          )}
        />
      </div>
    </div>
  );
}
