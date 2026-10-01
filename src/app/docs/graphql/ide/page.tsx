'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config, { getBackendBaseUrl } from '@/config/env';
import Link from 'next/link';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface QueryPreset {
  id: string;
  label: string;
  icon: string;
  desc: string;
  query: string;
  variables?: string;
}

const PRESETS: QueryPreset[] = [
  {
    id: 'nested',
    label: 'Posts + Author & Comments',
    icon: 'ph:tree-structure-bold',
    desc: 'Relational join across posts, authors, and comments in a single round-trip.',
    query: `query GetPostsWithAuthorAndComments {
  posts(_limit: 3) {
    id
    title
    body
    user {
      id
      name
      email
      company {
        name
      }
    }
    comments {
      id
      name
      body
    }
  }
}`,
    variables: '{}',
  },
  {
    id: 'user-profile',
    label: 'User Graph & Todos',
    icon: 'ph:user-circle-gear-bold',
    desc: 'Fetch a single user profile along with recent posts and pending todo tasks.',
    query: `query GetUserProfile($userId: ID!) {
  user(id: $userId) {
    id
    name
    username
    email
    phone
    website
    company {
      name
      catchPhrase
    }
    todos {
      id
      title
      completed
    }
    posts {
      id
      title
    }
  }
}`,
    variables: JSON.stringify({ userId: '1' }, null, 2),
  },
  {
    id: 'filtering',
    label: 'Filter, Search & Sort',
    icon: 'ph:magnifying-glass-bold',
    desc: 'Execute parameter-driven search, field-level filtering, and ascending/descending sorting.',
    query: `query SearchAndFilterPosts($query: String, $limit: Int, $order: String) {
  posts(q: $query, _limit: $limit, _order: $order) {
    id
    title
    user_id
    user {
      name
    }
  }
}`,
    variables: JSON.stringify({ query: 'qui', limit: 4, order: 'desc' }, null, 2),
  },
  {
    id: 'mutation',
    label: 'Stateful Mutation',
    icon: 'ph:pencil-simple-bold',
    desc: 'Create a stateful post record that persists directly in your visitor sandbox session.',
    query: `mutation CreateStatefulPost($title: String!, $body: String!, $userId: ID!) {
  createPost(title: $title, body: $body, userId: $userId) {
    id
    title
    body
    userId
    user {
      name
      email
    }
  }
}`,
    variables: JSON.stringify(
      {
        title: 'Building Modern Frontends with GraphQL Gateway',
        body: 'Playground API provides full stateful GraphQL mutation support across session sandboxes.',
        userId: '1',
      },
      null,
      2
    ),
  },
  {
    id: 'introspection',
    label: 'Schema Introspection',
    icon: 'ph:eye-bold',
    desc: 'Introspect root types, schema fields, and supported mutations using the standard __schema API.',
    query: `query IntrospectGraphQLGateway {
  __schema {
    queryType {
      name
      fields {
        name
        description
      }
    }
    mutationType {
      name
      fields {
        name
        description
      }
    }
  }
}`,
    variables: '{}',
  },
];

export default function GraphqlIdePage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const graphqlEndpoint = `${config.apiUrl}/graphql`;
  const backendBase =
    (typeof config.getBackendBaseUrl === 'function' ? config.getBackendBaseUrl() : null) ||
    config.backendUrl ||
    'http://localhost:3001';
  const standaloneIdeUrl = `${backendBase}/api/v1/graphql`;

  const [activePreset, setActivePreset] = useState<string>('nested');
  const [query, setQuery] = useState(PRESETS[0].query);
  const [variables, setVariables] = useState(PRESETS[0].variables || '{}');
  const [activeTab, setActiveTab] = useState<'query' | 'variables'>('query');
  const [activeRecipe, setActiveRecipe] = useState<'fetch' | 'apollo' | 'urql' | 'curl'>('fetch');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [latency, setLatency] = useState<number | null>(null);

  const handleSelectPreset = (preset: QueryPreset) => {
    setActivePreset(preset.id);
    setQuery(preset.query);
    setVariables(preset.variables || '{}');
  };

  const handleExecute = async () => {
    setLoading(true);
    setLatency(null);
    setStatusCode(null);
    const startTime = performance.now();

    try {
      let parsedVars = {};
      try {
        parsedVars = JSON.parse(variables);
      } catch {
        // Fallback to empty variables on malformed JSON
      }

      const res = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query,
          variables: parsedVars,
        }),
      });

      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
      setStatusCode(res.status);

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
      setStatusCode(500);
      setResult({ errors: [{ message: err.message || 'Network request failed' }] });
    } finally {
      setLoading(false);
    }
  };

  const codeRecipes = {
    fetch: `// Next.js 15+ / React Server Action or Modern Native Fetch
const response = await fetch('${publicApiUrl}/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // Optional visitor session isolation:
    // 'x-playground-identity': 'your-session-uuid',
  },
  body: JSON.stringify({
    query: \`${query.trim()}\`,
    variables: ${variables.trim() || '{}'}
  }),
});

const { data, errors } = await response.json();
if (errors) console.error('GraphQL Errors:', errors);
console.log('Result:', data);`,

    apollo: `// Apollo Client Integration (@apollo/client)
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: '${publicApiUrl}/graphql',
  cache: new InMemoryCache(),
  headers: {
    // 'x-playground-identity': 'sandbox-identity-id',
  },
});

const GET_DATA = gql\`
  ${query.trim()}
\`;

const { data } = await client.query({
  query: GET_DATA,
  variables: ${variables.trim() || '{}'},
});

console.log('Apollo Query Result:', data);`,

    urql: `// TanStack React Query + graphql-request / URQL
import { request, gql } from 'graphql-request';

const endpoint = '${publicApiUrl}/graphql';

const document = gql\`
  ${query.trim()}
\`;

const data = await request(endpoint, document, ${variables.trim() || '{}'});
console.log('Graphql-Request Data:', data);`,

    curl: `# Execute via cURL CLI
curl -X POST "${publicApiUrl}/graphql" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '${JSON.stringify({ query: query.trim(), variables: JSON.parse(variables || '{}') })}'`,
  };

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:atom-bold" className="w-3.5 h-3.5" />
          <span>GraphQL Gateway</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              GraphiQL Interactive IDE
            </h1>
            <p className="mt-2 text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
              Execute relational queries, inspect graph relationships, and perform stateful mutations directly against your private visitor session overlay. Zero over-fetching, zero local server setup.
            </p>
          </div>

          <a
            href={standaloneIdeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-indigo-600 text-xs font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Icon icon="ph:arrow-square-out-bold" className="w-4 h-4 text-indigo-600" />
            <span>Open Fullscreen IDE</span>
          </a>
        </div>
      </div>

      {/* 2. Interactive Query Presets */}
      <div id="query-presets" className="space-y-3 scroll-mt-20">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Query &amp; Mutation Presets
          </h2>
          <span className="text-xs text-slate-500 hidden sm:inline">Select a preset to load into the live editor</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                activePreset === preset.id
                  ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-1 ring-indigo-500'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  activePreset === preset.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Icon icon={preset.icon} className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                  {preset.label}
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                  {preset.desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Live GraphQL Runner */}
      <div id="ide-runner" className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden scroll-mt-20">
        {/* Runner Header Bar */}
        <div className="border-b border-slate-100 bg-slate-50/80 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">Gateway Terminal</span>
            <span className="font-mono text-xs text-indigo-700 bg-white px-2 py-0.5 rounded border border-slate-200">
              POST /api/v1/graphql
            </span>
            {statusCode !== null && (
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                  statusCode >= 200 && statusCode < 300
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                HTTP {statusCode}
              </span>
            )}
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
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Icon icon="ph:spinner-bold" className="w-4 h-4 animate-spin" />
              ) : (
                <Icon icon="ph:play-bold" className="w-4 h-4" />
              )}
              <span>Run Request</span>
            </button>
          </div>
        </div>

        {/* Dual Editor Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch p-4 sm:p-5 bg-slate-50/50 min-h-115">
          {/* Left Column: Query & Variables Editor */}
          <div className="flex flex-col h-full space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('query')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'query'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  query.graphql
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('variables')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'variables'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  variables.json
                </button>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {activeTab === 'query' ? 'GraphQL Document' : 'JSON Object'}
              </span>
            </div>

            <div className="flex-1 flex flex-col min-h-95">
              {activeTab === 'query' ? (
                <CodeBlock
                  code={query}
                  language="graphql"
                  title="Document Editor"
                  editable
                  onChange={setQuery}
                  className="h-full flex-1 flex flex-col"
                  codeClassName="flex-1"
                  minHeight="380px"
                />
              ) : (
                <CodeBlock
                  code={variables}
                  language="json"
                  title="Variables Editor"
                  editable
                  onChange={setVariables}
                  className="h-full flex-1 flex flex-col"
                  codeClassName="flex-1"
                  minHeight="380px"
                />
              )}
            </div>
          </div>

          {/* Right Column: Execution Response */}
          <div className="flex flex-col h-full space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-xs font-bold text-slate-700">Execution Output</span>
              <span className="text-[11px] font-mono text-slate-500">
                {result ? (result.errors ? 'Errors Encountered' : 'Valid Response') : 'Awaiting Execution'}
              </span>
            </div>

            <div className="flex-1 flex flex-col min-h-95">
              <CodeBlock
                code={
                  result
                    ? JSON.stringify(result, null, 2)
                    : '{\n  // Click "Run Request" above to execute this query against\n  // the live GraphQL gateway and inspect the JSON payload.\n}'
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
      </div>

      {/* 4. Supported Schema Capabilities */}
      <div id="graphql-features" className="space-y-4 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            GraphQL Engine Capabilities
          </h2>
          <p className="text-sm text-slate-600">
            Engineered to simulate production-grade GraphQL environments with full relation resolution and state management:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Icon icon="ph:tree-structure-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Nested Graph Traversal</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Query deep relational graphs in a single round-trip without N+1 problems. Join users, posts, comments, and company profiles effortlessly.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Icon icon="ph:floppy-disk-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Stateful Sandbox Mutations</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Mutations executed via <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">createPost</code> or <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">updateTodo</code> persist immediately in your visitor session overlay.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Icon icon="ph:shield-check-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Full Schema Introspection</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Fully compatible with Apollo Client, Relay, and GraphQL Code Generator. Auto-complete, type validation, and schema AST reflection out of the box.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Production Integration Recipes */}
      <div id="client-recipes" className="space-y-4 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Client Integration Recipes
          </h2>
          <p className="text-sm text-slate-600">
            Copy-paste production implementations for your preferred web framework or GraphQL client:
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'fetch', label: 'Fetch / Next.js Action', icon: 'ph:globe-bold' },
              { id: 'apollo', label: 'Apollo Client', icon: 'ph:atom-bold' },
              { id: 'urql', label: 'TanStack Query / URQL', icon: 'ph:lightning-bold' },
              { id: 'curl', label: 'cURL Command', icon: 'ph:terminal-bold' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveRecipe(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeRecipe === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <CodeBlock
            code={codeRecipes[activeRecipe]}
            language={activeRecipe === 'curl' ? 'bash' : 'typescript'}
            title={`integration-${activeRecipe}.${activeRecipe === 'curl' ? 'sh' : 'ts'}`}
            copyable
          />
        </div>
      </div>
    </div>
  );
}
