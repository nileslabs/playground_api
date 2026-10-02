'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface QueryPreset {
  id: string;
  label: string;
  icon: string;
  desc: string;
  query: string;
  variables?: any;
}

const PRESETS: QueryPreset[] = [
  {
    id: 'nested-post',
    label: 'Deep Post Graph (Author + Comments)',
    icon: 'ph:tree-structure-bold',
    desc: 'Fetches post records, resolves linked author details, and attaches all post comments in 1 round trip.',
    query: `query GetDeepPostGraph {
  posts(_limit: 2) {
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
      email
      body
    }
  }
}`,
  },
  {
    id: 'user-360',
    label: 'User 360° Profile (Todos + Posts)',
    icon: 'ph:user-focus-bold',
    desc: 'Aggregates user personal data, company affiliation, pending todos, and recent publications.',
    query: `query GetUser360Profile($userId: ID!) {
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
    variables: { userId: '1' },
  },
  {
    id: 'pagination-sort',
    label: 'Pagination, Ordering & Sorting',
    icon: 'ph:arrows-down-up-bold',
    desc: 'Combines page/limit pagination with field-level sorting and descending order direction.',
    query: `query PaginatedAndSortedPosts($page: Int, $limit: Int, $sort: String, $order: String) {
  posts(_page: $page, _limit: $limit, _sort: $sort, _order: $order) {
    id
    title
    user_id
    user {
      name
    }
  }
}`,
    variables: { page: 1, limit: 3, sort: 'title', order: 'asc' },
  },
  {
    id: 'filtered-comments',
    label: 'Targeted Comment Filtering',
    icon: 'ph:chats-bold',
    desc: 'Queries comments scoped specifically to post_id with author email and preview snippets.',
    query: `query GetPostComments($postId: ID!) {
  comments(post_id: $postId, _limit: 3) {
    id
    name
    email
    body
    post {
      id
      title
    }
  }
}`,
    variables: { postId: '1' },
  },
  {
    id: 'search-query',
    label: 'Full-Text Search Across Resources',
    icon: 'ph:magnifying-glass-bold',
    desc: 'Performs multi-field text search matching keywords in titles and descriptions.',
    query: `query SearchResources($term: String) {
  posts(q: $term, _limit: 3) {
    id
    title
  }
  users(q: $term, _limit: 3) {
    id
    name
    email
  }
}`,
    variables: { term: 'ea' },
  },
];

export default function GraphqlQueriesPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const [activePreset, setActivePreset] = useState<QueryPreset>(PRESETS[0]);
  const [activeRecipe, setActiveRecipe] = useState<'apollo' | 'tanstack' | 'fetch'>('apollo');

  const apolloRecipe = `// Apollo Client useQuery Hook Pattern (React 19 / Next.js)
import { useQuery, gql } from '@apollo/client';

const GET_POSTS_GRAPH = gql\`
  query GetPostsGraph($limit: Int) {
    posts(_limit: $limit) {
      id
      title
      body
      user {
        name
        email
      }
      comments {
        id
        body
      }
    }
  }
\`;

export function PostsFeed() {
  const { data, loading, error, refetch } = useQuery(GET_POSTS_GRAPH, {
    variables: { limit: 5 },
    notifyOnNetworkStatusChange: true,
  });

  if (loading) return <div>Loading relational graph...</div>;
  if (error) return <div>Query error: {error.message}</div>;

  return (
    <div>
      {data?.posts?.map((post: any) => (
        <article key={post.id}>
          <h3>{post.title}</h3>
          <p>By {post.user?.name}</p>
          <span>{post.comments?.length || 0} comments</span>
        </article>
      ))}
      <button onClick={() => refetch()}>Refresh Graph</button>
    </div>
  );
}`;

  const tanstackRecipe = `// TanStack React Query + graphql-request Pattern
import { useQuery } from '@tanstack/react-query';
import { request, gql } from 'graphql-request';

const ENDPOINT = '${publicApiUrl}/graphql';

const GET_USER_PROFILE = gql\`
  query GetUserProfile($userId: ID!) {
    user(id: $userId) {
      id
      name
      email
      todos {
        id
        title
        completed
      }
    }
  }
\`;

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['graphql', 'user', userId],
    queryFn: async () => {
      return await request(ENDPOINT, GET_USER_PROFILE, { userId });
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}`;

  const fetchRecipe = `// Modern Native TypeScript Fetch with Session Cookie
interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string; locations?: any[]; path?: string[] }>;
}

export async function executeGraphQL<T>(
  query: string,
  variables: Record<string, any> = {}
): Promise<T> {
  const res = await fetch('${publicApiUrl}/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'include', // Preserves pg_identity sandbox cookie
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(\`HTTP \${res.status}: \${res.statusText}\`);
  }

  const json: GraphQLResponse<T> = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }

  return json.data as T;
}`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:tree-structure-bold" className="w-3.5 h-3.5" />
          <span>GraphQL Gateway</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Relational Queries &amp; Graph Traversal
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Fetch relational data models in a single network round-trip. Resolve complex entity links (Users &rarr; Posts &rarr; Comments &rarr; Todos) without experiencing the N+1 problem or payload over-fetching.
        </p>
      </div>

      {/* 2. Interactive Query Playground */}
      <div id="query-workbench" className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="font-bold text-base sm:text-lg text-slate-900">
            Interactive Query Runner
          </h2>
          <p className="text-sm text-slate-600">
            Select a relational pattern below to populate the interactive console and test queries against the live schema:
          </p>
        </div>

        {/* Preset Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setActivePreset(preset)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                activePreset.id === preset.id
                  ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-1 ring-indigo-500'
                  : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  activePreset.id === preset.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-200'
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

        {/* Live Interactive Console */}
        <InteractiveConsole
          key={activePreset.id}
          method="POST"
          path="/graphql"
          title={`Execute: ${activePreset.label}`}
          initialBody={JSON.stringify(
            {
              query: activePreset.query,
              variables: activePreset.variables || {},
            },
            null,
            2
          )}
        />
      </div>

      {/* 3. REST vs GraphQL N+1 Comparison */}
      <div id="rest-vs-graphql" className="space-y-4 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            N+1 Problem: REST vs. GraphQL Gateway
          </h2>
          <p className="text-sm text-slate-600">
            How graph query batching reduces latency and bandwidth when retrieving related resource hierarchies:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* REST Approach */}
          <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/30 space-y-3">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <Icon icon="ph:x-circle-bold" className="w-5 h-5 shrink-0" />
              <span>Traditional REST Architecture (N+1 Calls)</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="font-mono text-xs bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">1</span>
                <span><code className="font-mono text-xs">GET /api/v1/posts?_limit=10</code> (1 request)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-xs bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">2</span>
                <span><code className="font-mono text-xs">GET /api/v1/users/:id</code> for each author (10 requests)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-xs bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">3</span>
                <span><code className="font-mono text-xs">GET /api/v1/posts/:id/comments</code> per post (10 requests)</span>
              </li>
            </ul>
            <div className="pt-2 border-t border-rose-200/80 text-xs text-rose-800 font-semibold">
              Total: 21 HTTP round trips &bull; High cellular latency &bull; Redundant headers
            </div>
          </div>

          {/* GraphQL Approach */}
          <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/30 space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
              <Icon icon="ph:check-circle-bold" className="w-5 h-5 shrink-0" />
              <span>Playground GraphQL Gateway (1 Single Call)</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="font-mono text-xs bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">1</span>
                <span>Single <code className="font-mono text-xs">POST /api/v1/graphql</code> containing query document.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-xs bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">2</span>
                <span>Backend resolver fetches author and comments concurrently in memory.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-xs bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">3</span>
                <span>Exact fields returned: no unused author bio or post body bytes.</span>
              </li>
            </ul>
            <div className="pt-2 border-t border-emerald-200/80 text-xs text-emerald-800 font-semibold">
              Total: 1 HTTP round trip &bull; 75% smaller payload &bull; Zero client waterfall
            </div>
          </div>
        </div>
      </div>

      {/* 4. Supported Query Parameters Matrix */}
      <div id="query-arguments" className="space-y-4 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Supported Query Arguments &amp; Filters
          </h2>
          <p className="text-sm text-slate-600">
            Every collection query in the Playground API schema accepts uniform pagination, sorting, and filter arguments:
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <th className="py-3 px-4">Argument</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Applies To</th>
                  <th className="py-3 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">limit / _limit</td>
                  <td className="py-3 px-4 font-mono text-slate-600 text-xs">Int</td>
                  <td className="py-3 px-4 text-slate-600">All collections</td>
                  <td className="py-3 px-4 text-slate-600 text-xs">Controls the maximum number of items returned (default: 10, max: 100).</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">page / _page</td>
                  <td className="py-3 px-4 font-mono text-slate-600 text-xs">Int</td>
                  <td className="py-3 px-4 text-slate-600">All collections</td>
                  <td className="py-3 px-4 text-slate-600 text-xs">1-indexed page offset for pagination.</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">_sort / sort</td>
                  <td className="py-3 px-4 font-mono text-slate-600 text-xs">String</td>
                  <td className="py-3 px-4 text-slate-600">All collections</td>
                  <td className="py-3 px-4 text-slate-600 text-xs">Specifies the field name to order results by (e.g. <code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded text-slate-800">&quot;title&quot;</code>, <code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded text-slate-800">&quot;id&quot;</code>).</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">_order / order</td>
                  <td className="py-3 px-4 font-mono text-slate-600 text-xs">String</td>
                  <td className="py-3 px-4 text-slate-600">All collections</td>
                  <td className="py-3 px-4 text-slate-600 text-xs">Sort direction: <code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded text-slate-800">&quot;asc&quot;</code> or <code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded text-slate-800">&quot;desc&quot;</code>.</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">q</td>
                  <td className="py-3 px-4 font-mono text-slate-600 text-xs">String</td>
                  <td className="py-3 px-4 text-slate-600">All collections</td>
                  <td className="py-3 px-4 text-slate-600 text-xs">Full-text case-insensitive query searching across strings and text fields.</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">user_id / userId</td>
                  <td className="py-3 px-4 font-mono text-slate-600 text-xs">ID</td>
                  <td className="py-3 px-4 text-slate-600">posts, todos</td>
                  <td className="py-3 px-4 text-slate-600 text-xs">Filters results owned by a specific user author ID.</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">post_id / postId</td>
                  <td className="py-3 px-4 font-mono text-slate-600 text-xs">ID</td>
                  <td className="py-3 px-4 text-slate-600">comments</td>
                  <td className="py-3 px-4 text-slate-600 text-xs">Filters comments attached to a specific post thread ID.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. Production Integration Recipes */}
      <div id="client-recipes" className="space-y-4 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Frontend Client Query Recipes
          </h2>
          <p className="text-sm text-slate-600">
            Production-tested data fetching hooks with caching and type safety:
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'apollo', label: 'Apollo Client (useQuery)', icon: 'ph:atom-bold' },
              { id: 'tanstack', label: 'TanStack React Query', icon: 'ph:lightning-bold' },
              { id: 'fetch', label: 'Native Fetch (TypeScript)', icon: 'ph:code-bold' },
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
            code={
              activeRecipe === 'apollo'
                ? apolloRecipe
                : activeRecipe === 'tanstack'
                ? tanstackRecipe
                : fetchRecipe
            }
            language="typescript"
            title={`useGraphQLQuery.${activeRecipe === 'fetch' ? 'ts' : 'tsx'}`}
            copyable
          />
        </div>
      </div>
    </div>
  );
}
