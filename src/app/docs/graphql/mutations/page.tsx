'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function GraphqlMutationsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:pencil-line-bold" className="w-3.5 h-3.5" />
          <span>GraphQL Gateway</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Stateful GraphQL Mutations
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Execute mutations to create, update, or delete records. Mutations are recorded directly into your isolated sandbox overlay, persisting seamlessly across subsequent GraphQL queries.
        </p>
      </div>

      {/* 2. Interactive Mutation Runner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Create Post Mutation</h3>
          <p className="text-xs text-slate-500">
            Send a mutation to insert a new blog post into your session:
          </p>
        </div>

        <InteractiveConsole
          method="POST"
          path="/graphql"
          title="Run GraphQL Mutation"
          initialBody={JSON.stringify(
            {
              query: `mutation CreatePost($title: String!, $body: String!) {
  createPost(title: $title, body: $body) {
    id
    title
    body
  }
}`,
              variables: {
                title: 'Building Modern Frontends with GraphQL',
                body: 'Playground API provides full stateful GraphQL mutation support.',
              },
            },
            null,
            2
          )}
        />
      </div>
    </div>
  );
}
