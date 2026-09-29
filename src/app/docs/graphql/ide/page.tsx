'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import Link from 'next/link';
import { CodeBlock } from '@/components/ui/CodeBlock';

export default function GraphqlIdePage() {
  const sampleQueries = {
    nested: `query GetPostsWithAuthor {
  posts(_limit: 3) {
    id
    title
    user {
      id
      name
      email
    }
  }
}`,
    comments: `query GetPostWithComments {
  post(id: 1) {
    id
    title
    body
    comments {
      id
      body
      name
    }
  }
}`,
    mutation: `mutation CreatePost {
  createPost(
    title: "GraphQL Stateful Post"
    body: "Created through GraphQL mutation"
    userId: 1
  ) {
    id
    title
    userId
  }
}`,
    introspection: `query IntrospectTypes {
  __schema {
    queryType {
      name
      fields {
        name
        description
      }
    }
  }
}`,
  };

  const [activePreset, setActivePreset] = useState<keyof typeof sampleQueries>('nested');
  const [query, setQuery] = useState(sampleQueries.nested);
  const [variables, setVariables] = useState('{}');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);

  const graphqlEndpoint = `${config.apiUrl}/graphql`;

  const handleSelectPreset = (key: keyof typeof sampleQueries) => {
    setActivePreset(key);
    setQuery(sampleQueries[key]);
  };

  const handleExecute = async () => {
    setLoading(true);
    setLatency(null);
    const startTime = performance.now();
    try {
      let parsedVars = {};
      try {
        parsedVars = JSON.parse(variables);
      } catch {
        // ignore
      }

      const res = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query,
          variables: parsedVars,
        }),
      });

      const data = await res.json();
      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
      setResult(data);
    } catch (err: any) {
      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
      setResult({ errors: [{ message: err.message }] });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:atom-bold" className="w-3.5 h-3.5" />
          <span>GraphQL Gateway</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Interactive GraphiQL Console
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Execute GraphQL queries and stateful mutations directly against your private visitor session overlay. Resolve nested relations (Posts &rarr; Author &rarr; Comments) with zero over-fetching and zero local server setup.
        </p>
      </div>

      {/* 2. Preset Selectors */}
      <div id="query-presets" className="space-y-3 scroll-mt-20">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Query Presets
          </h2>
          <span className="text-xs text-slate-500 hidden sm:inline">Select a preset to load into the editor</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { key: 'nested', label: 'Posts + Author', icon: 'ph:tree-structure-bold' },
              { key: 'comments', label: 'Post + Comments', icon: 'ph:chats-bold' },
              { key: 'mutation', label: 'Stateful Mutation', icon: 'ph:pencil-simple-bold' },
              { key: 'introspection', label: 'Schema Introspection', icon: 'ph:eye-bold' },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleSelectPreset(item.key)}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activePreset === item.key
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <Icon icon={item.icon} className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Live GraphQL Runner */}
      <div id="ide-runner" className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden scroll-mt-20">
        <div className="border-b border-slate-100 bg-slate-50/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">GraphQL Query Console</span>
            <span className="font-mono text-xs text-indigo-700 bg-white px-2 py-0.5 rounded border border-slate-200">
              POST /api/v1/graphql
            </span>
          </div>

          <div className="flex items-center gap-3">
            {latency !== null && (
              <span className="text-xs font-mono text-slate-500">
                Execution: <strong className="text-emerald-600">{latency}ms</strong>
              </span>
            )}
            <button
              type="button"
              onClick={handleExecute}
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Icon icon="ph:spinner-bold" className="w-4 h-4 animate-spin" />
              ) : (
                <Icon icon="ph:play-bold" className="w-4 h-4" />
              )}
              <span>Run Query</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch p-4 sm:p-5 bg-slate-50/60 border-t border-slate-100 min-h-[440px]">
          {/* Query Input Pane */}
          <div className="flex flex-col h-full">
            <CodeBlock
              code={query}
              language="graphql"
              title="query.graphql"
              editable
              onChange={setQuery}
              className="h-full flex-1 flex flex-col"
              codeClassName="flex-1"
              minHeight="380px"
            />
          </div>

          {/* Results Output Pane */}
          <div className="flex flex-col h-full">
            <CodeBlock
              code={
                result
                  ? JSON.stringify(result, null, 2)
                  : '{\n  // Click "Run Query" above to execute your request\n}'
              }
              language="json"
              title="response.json"
              subtitle={latency !== null ? `${latency}ms` : undefined}
              copyable={Boolean(result)}
              className="h-full flex-1 flex flex-col"
              codeClassName="flex-1"
              minHeight="380px"
            />
          </div>
        </div>
      </div>

      {/* 4. Supported Features */}
      <div id="graphql-features" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          GraphQL Engine Capabilities
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Icon icon="ph:tree-structure-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Nested Relationship Joins</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Query deep graph models in a single round-trip without N+1 problems. Join users, posts, and comments effortlessly.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Icon icon="ph:floppy-disk-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Stateful Mutations</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Mutations executed via <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">createPost</code> or <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">deletePost</code> persist immediately in your visitor session overlay.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Icon icon="ph:shield-check-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Full Schema Introspection</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Compatible with Apollo Client, Relay, and GraphQL Code Generator. Introspect types, fields, and arguments seamlessly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
