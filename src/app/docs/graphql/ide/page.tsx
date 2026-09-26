'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export default function GraphqlIdePage() {
  const [query, setQuery] = useState(`query GetPostsWithAuthor {
  posts(_limit: 3) {
    id
    title
    user {
      id
      name
      email
    }
  }
}`);
  const [variables, setVariables] = useState('{}');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const graphqlEndpoint = `${config.apiUrl}/graphql`;

  const handleExecute = async () => {
    setLoading(true);
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
      setResult(data);
    } catch (err: any) {
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
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:atom-bold" className="w-3.5 h-3.5" />
          <span>GraphQL Gateway</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Interactive GraphiQL Console
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Execute GraphQL queries and mutations against your active session sandbox. Features nested relationship resolution (posts $\rightarrow$ user $\rightarrow$ comments) with zero over-fetching.
        </p>
      </div>

      {/* 2. Live GraphQL Runner */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">GraphQL Query Editor</span>
            <span className="font-mono text-xs text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200">
              POST /api/v1/graphql
            </span>
          </div>

          <button
            type="button"
            onClick={handleExecute}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Icon icon="ph:spinner-bold" className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Icon icon="ph:play-bold" className="w-3.5 h-3.5" />
            )}
            <span>Run Query</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 bg-slate-900 min-h-[380px]">
          {/* Query Input Pane */}
          <div className="p-4 space-y-3">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Query Input</div>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={14}
              className="w-full bg-slate-950 font-mono text-xs text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-indigo-500 leading-relaxed resize-none"
            />
          </div>

          {/* Results Output Pane */}
          <div className="p-4 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Result (JSON)</span>
              {result && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Icon icon={copied ? 'ph:check-bold' : 'ph:copy-bold'} className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto min-h-[290px] leading-relaxed">
              {result ? (
                <pre>{JSON.stringify(result, null, 2)}</pre>
              ) : (
                <div className="text-center py-24 text-slate-600">
                  Click &quot;Run Query&quot; above to execute against the live GraphQL engine.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
