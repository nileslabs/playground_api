'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

interface SampleQuery {
  name: string;
  category: 'Query' | 'Mutation';
  query: string;
  variables?: string;
}

const sampleQueries: SampleQuery[] = [
  {
    name: 'Get Posts with Author',
    category: 'Query',
    query: `query GetPosts {
  posts(limit: 5) {
    id
    title
    body
    user {
      id
      name
      email
    }
  }
}`,
    variables: '{}',
  },
  {
    name: 'Get User with Posts & Comments',
    category: 'Query',
    query: `query GetUserWithPosts($userId: ID!) {
  user(id: $userId) {
    id
    name
    email
    posts {
      id
      title
      comments {
        id
        name
        body
      }
    }
  }
}`,
    variables: '{\n  "userId": "1"\n}',
  },
  {
    name: 'Create Post Mutation',
    category: 'Mutation',
    query: `mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    id
    title
    body
    created_at
  }
}`,
    variables: '{\n  "input": {\n    "title": "GraphQL Sandboxed Post",\n    "body": "Created via Obsidian GraphiQL Explorer",\n    "user_id": 1\n  }\n}',
  },
  {
    name: 'List Categories & Products',
    category: 'Query',
    query: `query GetCatalog {
  products(limit: 4) {
    id
    name
    price
    category
    in_stock
  }
}`,
    variables: '{}',
  },
];

export function GraphqlExplorerClient() {
  const [selectedPreset, setSelectedPreset] = useState<string>(sampleQueries[0].name);
  const [queryText, setQueryText] = useState(sampleQueries[0].query);
  const [variablesText, setVariablesText] = useState(sampleQueries[0].variables || '{}');
  const [activeTab, setActiveTab] = useState<'query' | 'variables'>('query');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<unknown>(null);
  const [timeMs, setTimeMs] = useState<number | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const graphqlUrl = `${config.apiUrl}/graphql`;

  const handleExecuteQuery = useCallback(async () => {
    setLoading(true);
    const start = performance.now();

    let parsedVars = {};
    if (variablesText.trim()) {
      try {
        parsedVars = JSON.parse(variablesText);
      } catch (e) {
        setResult({
          errors: [{ message: `Invalid Variables JSON: ${(e as Error).message}` }],
        });
        setTimeMs(Math.round(performance.now() - start));
        setStatusCode(400);
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch(graphqlUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: queryText,
          variables: Object.keys(parsedVars).length > 0 ? parsedVars : undefined,
        }),
      });

      const elapsed = Math.round(performance.now() - start);
      setStatusCode(res.status);
      const data = await res.json();
      setResult(data);
      setTimeMs(elapsed);
    } catch (err) {
      const elapsed = Math.round(performance.now() - start);
      setStatusCode(500);
      setResult({ errors: [{ message: String(err) }] });
      setTimeMs(elapsed);
    } finally {
      setLoading(false);
    }
  }, [graphqlUrl, queryText, variablesText]);

  // Global Ctrl/Cmd + Enter runner
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleExecuteQuery();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleExecuteQuery]);

  const selectPreset = (item: SampleQuery) => {
    setSelectedPreset(item.name);
    setQueryText(item.query);
    if (item.variables) setVariablesText(item.variables);
  };

  const responseBytes = result
    ? new TextEncoder().encode(JSON.stringify(result)).length
    : 0;

  return (
    <div className="space-y-10 w-full max-w-none">
      {/* Header */}
      <div id="overview" className="space-y-3 border-b border-border-default pb-6 scroll-mt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e10098]/10 border border-[#e10098]/20 text-[#e10098] text-xs font-semibold tracking-wide">
          <Icon icon="simple-icons:graphql" className="w-3.5 h-3.5" />
          GraphQL Gateway & Studio
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          GraphQL Sandbox Gateway
        </h1>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-3xl">
          Execute arbitrary GraphQL queries, mutations, and nested object traversals against our stateful sandbox gateway at <code className="font-mono text-[#e10098] font-medium bg-[#e10098]/10 px-1.5 py-0.5 rounded text-xs">/api/v1/graphql</code>.
        </p>
      </div>

      {/* Preset Queries Bar */}
      <div id="preset-queries" data-toc-title="Preset Queries" className="space-y-2.5 scroll-mt-20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
            Sample Operations
          </span>
          <span className="text-xs text-text-muted">
            Press <kbd className="font-mono text-[10px] bg-bg-surface px-1.5 py-0.5 rounded border border-border-default">Ctrl</kbd> + <kbd className="font-mono text-[10px] bg-bg-surface px-1.5 py-0.5 rounded border border-border-default">Enter</kbd> to run
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
          {sampleQueries.map((item) => {
            const isSelected = selectedPreset === item.name;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => selectPreset(item)}
                className={`px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-semibold shrink-0 transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#e10098]/15 border-[#e10098]/40 text-text-primary shadow-sm'
                    : 'bg-bg-surface hover:bg-bg-elevated border-border-default text-text-secondary hover:text-text-primary'
                }`}
              >
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    item.category === 'Mutation'
                      ? 'bg-amber-500/15 text-amber-400'
                      : 'bg-sky-500/15 text-sky-400'
                  }`}
                >
                  {item.category}
                </span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* GraphiQL Interactive IDE Container */}
      <div
        id="graphql-ide"
        data-toc-title="GraphiQL Interactive IDE"
        className="rounded-2xl border border-border-default bg-bg-surface/80 backdrop-blur-md overflow-hidden shadow-2xl scroll-mt-20"
      >
        {/* Terminal Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-bg-elevated/70 border-b border-border-subtle">
          <div className="flex items-center gap-3 font-mono text-xs sm:text-sm">
            <span className="px-2 py-0.5 rounded-md bg-[#e10098]/15 text-[#e10098] font-bold text-xs">
              POST
            </span>
            <span className="text-text-secondary truncate max-w-[280px] sm:max-w-md">
              {graphqlUrl}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {timeMs !== null && (
              <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
                <span
                  className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                    statusCode === 200
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-rose-500/15 text-rose-400'
                  }`}
                >
                  {statusCode} OK
                </span>
                <span className="flex items-center gap-1 text-text-secondary">
                  <Icon icon="ph:timer-bold" className="w-3.5 h-3.5 text-accent-primary" />
                  {timeMs}ms
                </span>
              </div>
            )}

            <button
              onClick={handleExecuteQuery}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#e10098] hover:bg-[#c90088] text-white font-sans text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <Icon
                icon={loading ? 'ph:spinner-bold' : 'ph:play-bold'}
                className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              />
              <span>{loading ? 'Running...' : 'Execute'}</span>
            </button>
          </div>
        </div>

        {/* Split Editor / Viewer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border-subtle items-stretch">
          {/* Left Column: Query / Variables Editor */}
          <div className="flex flex-col bg-bg-terminal/40">
            {/* Editor Switcher Tabs */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-bg-surface/50 border-b border-border-subtle text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('query')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'query'
                      ? 'bg-bg-elevated text-text-primary shadow-xs'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  <Icon icon="simple-icons:graphql" className="w-3 h-3 text-[#e10098]" />
                  <span>Query / Mutation</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('variables')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'variables'
                      ? 'bg-bg-elevated text-text-primary shadow-xs'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  <Icon icon="ph:brackets-curly-bold" className="w-3 h-3 text-sky-400" />
                  <span>Variables JSON</span>
                </button>
              </div>

              <span className="text-[11px] font-mono text-text-muted hidden sm:inline">
                Interactive Editor
              </span>
            </div>

            {/* CodeBlock Container */}
            <div className="p-3 flex-1 flex flex-col min-h-[380px]">
              {activeTab === 'query' ? (
                <CodeBlock
                  code={queryText}
                  language="graphql"
                  title="GraphQL Source"
                  minHeight="min-h-[360px]"
                  maxHeight="max-h-[500px]"
                  editable
                  onChange={(val) => setQueryText(val)}
                  className="flex-1 flex flex-col"
                />
              ) : (
                <CodeBlock
                  code={variablesText}
                  language="json"
                  title="Query Variables (JSON)"
                  minHeight="min-h-[360px]"
                  maxHeight="max-h-[500px]"
                  editable
                  onChange={(val) => setVariablesText(val)}
                  className="flex-1 flex flex-col"
                />
              )}
            </div>
          </div>

          {/* Right Column: Execution Result Output */}
          <div className="flex flex-col bg-bg-terminal/40">
            {/* Output Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-bg-surface/50 border-b border-border-subtle text-xs">
              <span className="font-semibold text-text-secondary flex items-center gap-1.5">
                <Icon icon="ph:terminal-window-bold" className="w-3.5 h-3.5 text-text-muted" />
                Response Payload
              </span>
              {result !== null && (
                <span className="text-[11px] font-mono text-text-muted">
                  {(responseBytes / 1024).toFixed(2)} KB
                </span>
              )}
            </div>

            {/* CodeBlock Output */}
            <div className="p-3 flex-1 flex flex-col min-h-[380px]">
              <CodeBlock
                code={
                  result !== null
                    ? JSON.stringify(result, null, 2)
                    : '// Hit "Execute" or press Ctrl+Enter to dispatch the GraphQL operation'
                }
                language="json"
                title="Response JSON"
                minHeight="min-h-[360px]"
                maxHeight="max-h-[500px]"
                copyable
                className="flex-1 flex flex-col"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
