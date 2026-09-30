'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { EndpointDef } from '@/config/api-catalog';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface FieldDef {
  name: string;
  type: string;
  required: boolean;
  desc: string;
  example: string;
}

interface RelationshipDef {
  type: 'hasMany' | 'belongsTo';
  target: string;
  path: string;
  fk: string;
  desc: string;
}

interface ResourceSchemaConfig {
  singular: string;
  tsType: string;
  fields: FieldDef[];
  relationships: RelationshipDef[];
  samplePayload: Record<string, unknown>;
  patchPayload: Record<string, unknown>;
}

const RESOURCE_SCHEMAS: Record<string, ResourceSchemaConfig> = {
  users: {
    singular: 'User',
    tsType: `export interface User {
  id: number | string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
  address?: {
    street: string;
    suite?: string;
    city: string;
    zipcode: string;
    geo?: {
      lat: string;
      lng: string;
    };
  };
  company?: {
    name: string;
    catchPhrase?: string;
    bs?: string;
  };
  _sandbox?: 'created' | 'updated';
}`,
    fields: [
      { name: 'id', type: 'number | string', required: true, desc: 'Primary key. Integer (1-25) for baseline seed records or local-<uuid> for session records.', example: '1' },
      { name: 'name', type: 'string', required: true, desc: 'Full display name of user.', example: '"Leanne Graham"' },
      { name: 'username', type: 'string', required: true, desc: 'Unique handle identifier used for deterministic SVG avatars and login.', example: '"Bret"' },
      { name: 'email', type: 'string', required: true, desc: 'Unique verified email address.', example: '"Sincere@april.biz"' },
      { name: 'phone', type: 'string', required: false, desc: 'Contact telephone number.', example: '"+1-770-555-0123"' },
      { name: 'website', type: 'string', required: false, desc: 'Personal website or domain.', example: '"hildegard.org"' },
      { name: 'address', type: 'object', required: false, desc: 'Nested address object with street, city, zipcode, and geo coordinates.', example: '{ city: "Gwenborough" }' },
      { name: 'company', type: 'object', required: false, desc: 'Nested employer company details.', example: '{ name: "Romaguera-Crona" }' },
      { name: '_sandbox', type: "'created' | 'updated'", required: false, desc: 'Session mutation indicator added automatically on write operations.', example: '"created"' },
    ],
    relationships: [
      { type: 'hasMany', target: 'Posts', path: '/users/:id/posts', fk: 'user_id', desc: 'All articles authored by this user profile.' },
      { type: 'hasMany', target: 'Todos', path: '/users/:id/todos', fk: 'user_id', desc: 'Task checklist items assigned to this user.' },
      { type: 'hasMany', target: 'Comments', path: '/users/:id/comments', fk: 'email', desc: 'Discussion comments authored by this user email.' },
    ],
    samplePayload: {
      name: 'Dr. Sarah Connor',
      username: 'sconnor',
      email: 'sarah.connor@cyberdyne.org',
      phone: '+1-555-0199',
      website: 'https://sarahconnor.tech',
      address: {
        street: '8404 Resistance Way',
        city: 'Los Angeles',
        zipcode: '90001',
      },
      company: {
        name: 'Resistance Systems',
        catchPhrase: 'Autonomous cybersecurity infrastructure',
      },
    },
    patchPayload: {
      name: 'Dr. Sarah Connor (Chief Architect)',
      website: 'https://cyberdyne-defense.org',
    },
  },
  posts: {
    singular: 'Post',
    tsType: `export interface Post {
  id: number | string;
  user_id: number | string;
  title: string;
  body: string;
  created_at?: string;
  _sandbox?: 'created' | 'updated';
}`,
    fields: [
      { name: 'id', type: 'number | string', required: true, desc: 'Primary key. Integer (1-100) or local-<uuid>.', example: '1' },
      { name: 'user_id', type: 'number | string', required: true, desc: 'Foreign key referencing author users.id.', example: '1' },
      { name: 'title', type: 'string', required: true, desc: 'Post headline. Indexed for full-text search (?q=...).', example: '"sunt aut facere repellat"' },
      { name: 'body', type: 'string', required: true, desc: 'Article content paragraph. Indexed for full-text search.', example: '"quia et suscipit suscipit..."' },
      { name: 'created_at', type: 'string', required: false, desc: 'ISO 8601 creation timestamp.', example: '"2026-01-15T08:30:00.000Z"' },
      { name: '_sandbox', type: "'created' | 'updated'", required: false, desc: 'Session mutation indicator added to modified records.', example: '"created"' },
    ],
    relationships: [
      { type: 'belongsTo', target: 'User', path: '/posts/:id/user', fk: 'user_id', desc: 'Author profile record associated with this article.' },
      { type: 'hasMany', target: 'Comments', path: '/posts/:id/comments', fk: 'post_id', desc: 'All discussion comments submitted on this post.' },
    ],
    samplePayload: {
      user_id: 1,
      title: 'Architecting Scalable Microservices with Playground API',
      body: 'In modern full-stack web development, isolated stateful mock environments accelerate test cycles and decouple frontend engineering teams from backend release blockers.',
    },
    patchPayload: {
      title: 'Architecting Scalable Microservices with Playground API (v2 Updated)',
    },
  },
  comments: {
    singular: 'Comment',
    tsType: `export interface Comment {
  id: number | string;
  post_id: number | string;
  name: string;
  email: string;
  body: string;
  created_at?: string;
  _sandbox?: 'created' | 'updated';
}`,
    fields: [
      { name: 'id', type: 'number | string', required: true, desc: 'Primary key. Integer (1-500) or local-<uuid>.', example: '1' },
      { name: 'post_id', type: 'number | string', required: true, desc: 'Foreign key referencing target posts.id.', example: '1' },
      { name: 'name', type: 'string', required: true, desc: 'Comment title or subject line.', example: '"id labore ex et quam laborum"' },
      { name: 'email', type: 'string', required: true, desc: 'Comment author email address.', example: '"Eliseo@gardner.biz"' },
      { name: 'body', type: 'string', required: true, desc: 'Comment commentary text content.', example: '"laudantium enim quasi est quidem magnam..."' },
      { name: 'created_at', type: 'string', required: false, desc: 'ISO 8601 creation timestamp.', example: '"2026-02-10T12:00:00.000Z"' },
      { name: '_sandbox', type: "'created' | 'updated'", required: false, desc: 'Session mutation indicator added to modified records.', example: '"created"' },
    ],
    relationships: [
      { type: 'belongsTo', target: 'Post', path: '/comments/:id/post', fk: 'post_id', desc: 'Parent post article on which this comment was posted.' },
    ],
    samplePayload: {
      post_id: 1,
      name: 'Flawless optimistic update demonstration',
      email: 'alex.mercer@prototype.dev',
      body: 'Verified that the copy-on-write overlay correctly handles immediate mutations without database locks.',
    },
    patchPayload: {
      body: 'Verified that the copy-on-write overlay correctly handles immediate mutations without database locks. (Updated feedback confirmed)',
    },
  },
  todos: {
    singular: 'Todo',
    tsType: `export interface Todo {
  id: number | string;
  user_id: number | string;
  title: string;
  completed: boolean;
  created_at?: string;
  _sandbox?: 'created' | 'updated';
}`,
    fields: [
      { name: 'id', type: 'number | string', required: true, desc: 'Primary key. Integer (1-200) or local-<uuid>.', example: '1' },
      { name: 'user_id', type: 'number | string', required: true, desc: 'Foreign key referencing assigned users.id.', example: '1' },
      { name: 'title', type: 'string', required: true, desc: 'Task description checklist text.', example: '"delectus aut autem"' },
      { name: 'completed', type: 'boolean', required: true, desc: 'Completion status boolean. Filterable via ?completed=true|false.', example: 'false' },
      { name: 'created_at', type: 'string', required: false, desc: 'ISO 8601 creation timestamp.', example: '"2026-03-01T09:15:00.000Z"' },
      { name: '_sandbox', type: "'created' | 'updated'", required: false, desc: 'Session mutation indicator added to modified records.', example: '"created"' },
    ],
    relationships: [
      { type: 'belongsTo', target: 'User', path: '/todos/:id/user', fk: 'user_id', desc: 'Assigned user profile owning this task.' },
    ],
    samplePayload: {
      user_id: 1,
      title: 'Run end-to-end integration test suite against sandbox',
      completed: false,
    },
    patchPayload: {
      completed: true,
    },
  },
};

interface ResourceClientProps {
  resource: string;
  name: string;
  singular?: string;
  description: string;
  itemCount?: number | string;
  icon?: string;
  prevPage?: { title: string; href: string };
  nextPage?: { title: string; href: string };
  initialEndpoints: EndpointDef[];
}

export function ResourceClient({
  resource,
  name,
  singular: propSingular,
  description,
  itemCount,
  icon = 'ph:database-bold',
  prevPage,
  nextPage,
  initialEndpoints,
}: ResourceClientProps) {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const schemaConfig = RESOURCE_SCHEMAS[resource] || RESOURCE_SCHEMAS.posts;
  const singular = propSingular || schemaConfig.singular;

  // Live Explorer State
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'json'>('table');
  const [copiedTs, setCopiedTs] = useState(false);

  // Fetch live records from backend
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', limit.toString());
      if (searchQuery.trim()) {
        params.set('q', searchQuery.trim());
      }

      const res = await fetch(`${config.apiUrl}/${resource}?${params.toString()}`, {
        credentials: 'include',
      });
      if (res.ok) {
        const json = await res.json();
        const dataList = Array.isArray(json) ? json : json.data || [];
        setRecords(dataList);
        if (json.pagination) {
          setTotalPages(json.pagination.totalPages || 1);
          setTotalCount(json.pagination.total ?? null);
        } else {
          setTotalCount(dataList.length);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [resource, page, limit, searchQuery]);

  const handleCopyTsInterface = () => {
    navigator.clipboard.writeText(schemaConfig.tsType);
    setCopiedTs(true);
    setTimeout(() => setCopiedTs(false), 2000);
  };

  // Generate multi-language code snippets
  const codeRecipes = useMemo(() => {
    const capitalizedSingular = singular.charAt(0).toUpperCase() + singular.slice(1);
    const capitalizedPlural = name.charAt(0).toUpperCase() + name.slice(1);

    return {
      reactQuery: `// React 18+ with TanStack Query v5 & Optimistic Mutation
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// 1. Fetch Paginated Collection
export function use${capitalizedPlural}(page = 1, limit = 10, search = '') {
  return useQuery({
    queryKey: ['${resource}', page, limit, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set('q', search);

      const res = await fetch(\`https://playground.nileslabs.com/api/v1/${resource}?\${params}\`, {
        credentials: 'include', // Includes visitor sandbox session
      });
      if (!res.ok) throw new Error('Failed to fetch ${resource}');
      return res.json();
    },
  });
}

// 2. Stateful Optimistic Create Mutation
export function useCreate${capitalizedSingular}() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newRecord) => {
      const res = await fetch('https://playground.nileslabs.com/api/v1/${resource}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newRecord),
      });
      if (!res.ok) throw new Error('Create failed');
      return res.json();
    },
    onSuccess: () => {
      // Invalidate query to merge new sandbox record at top of collection
      queryClient.invalidateQueries({ queryKey: ['${resource}'] });
    },
  });
}`,

      tsFetch: `// Modern TypeScript Native Fetch Helper
import type { ${capitalizedSingular} } from '@/types/${resource}';

interface ApiResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function get${capitalizedPlural}(params?: {
  page?: number;
  limit?: number;
  q?: string;
}): Promise<ApiResponse<${capitalizedSingular}>> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.q) query.set('q', params.q);

  const response = await fetch(\`https://playground.nileslabs.com/api/v1/${resource}?\${query}\`, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(\`HTTP error \${response.status}: \${await response.text()}\`);
  }

  return response.json();
}`,

      axios: `// Reusable Axios Client with Automatic Session Credentials
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://playground.nileslabs.com/api/v1',
  withCredentials: true, // Preserves isolated sandbox overlay cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch list with full-text search
export const fetch${capitalizedPlural} = (q = '', page = 1) =>
  api.get('/${resource}', { params: { q, page, limit: 10 } }).then((r) => r.data);

// Create new item
export const create${capitalizedSingular} = (payload) =>
  api.post('/${resource}', payload).then((r) => r.data);

// Delete item
export const delete${capitalizedSingular} = (id) =>
  api.delete(\`/${resource}/\${id}\`).then((r) => r.data);`,

      python: `# Python 3.10+ Requests Client
import requests

BASE_URL = "https://playground.nileslabs.com/api/v1"
session = requests.Session() # Keeps sandbox session cookies intact

# 1. Query paginated list
response = session.get(f"{BASE_URL}/${resource}", params={"limit": 5, "page": 1})
print(f"Status: {response.status_code}")
items = response.json().get("data", [])
print(f"Retrieved {len(items)} ${resource}")

# 2. Create new record in session overlay
new_item = ${JSON.stringify(schemaConfig.samplePayload, null, 2).replace(/\n/g, '\n')}
create_res = session.post(f"{BASE_URL}/${resource}", json=new_item)
print("Created record ID:", create_res.json().get("id"))`,

      curl: `# 1. List ${capitalizedPlural} (with pagination & search)
curl "https://playground.nileslabs.com/api/v1/${resource}?page=1&limit=5&q=test" \\
  -H "Accept: application/json"

# 2. Get Single ${capitalizedSingular}
curl "https://playground.nileslabs.com/api/v1/${resource}/1"

# 3. Create New ${capitalizedSingular} in Session Overlay
curl -X POST "https://playground.nileslabs.com/api/v1/${resource}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(schemaConfig.samplePayload)}'

# 4. Partial Update (PATCH)
curl -X PATCH "https://playground.nileslabs.com/api/v1/${resource}/1" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(schemaConfig.patchPayload)}'

# 5. Delete ${capitalizedSingular} from Session
curl -X DELETE "https://playground.nileslabs.com/api/v1/${resource}/1"`,
    };
  }, [resource, name, singular, schemaConfig]);

  return (
    <div className="space-y-12 w-full text-slate-900 pb-16">
      {/* 1. Hero Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
            <Icon icon={icon} className="w-3.5 h-3.5" />
            <span>Core REST Resource</span>
          </div>

          {itemCount && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
              <Icon icon="ph:database-bold" className="w-3 h-3 text-slate-500" />
              {itemCount} Baseline Fixtures
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          {name} REST API & Data Model
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          {description} Full CRUD simulation supporting persistent writes, relationship traversal, full-text filtering, and copy-on-write isolation per visitor session.
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap gap-2.5 pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
            <Icon icon="ph:check-circle-bold" className="w-4 h-4 text-emerald-600" />
            Full CRUD (GET, POST, PUT, PATCH, DELETE)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-200">
            <Icon icon="ph:git-fork-bold" className="w-4 h-4 text-indigo-600" />
            Copy-on-Write Session Overlay
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-medium border border-purple-200">
            <Icon icon="ph:tree-structure-bold" className="w-4 h-4 text-purple-600" />
            Relational Sub-Resources
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
            <Icon icon="ph:magnifying-glass-bold" className="w-4 h-4 text-amber-600" />
            Full-Text Search & Pagination
          </span>
        </div>
      </div>

      {/* 2. Interactive Live Data Browser & Sandbox Explorer */}
      <div id="live-explorer" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <Icon icon="ph:table-bold" className="w-5 h-5 text-indigo-600" />
                Live {name} Record Explorer
              </h2>
              {totalCount !== null && (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                  {totalCount} total
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live queries executed directly against <code className="font-mono text-xs">GET /api/v1/{resource}</code>.
            </p>
          </div>

          {/* Table vs JSON view toggle */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl self-start sm:self-auto border border-slate-200/80">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'table' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon icon="ph:table-bold" className="w-3.5 h-3.5" />
              Table View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('json')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'json' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon icon="ph:code-bold" className="w-3.5 h-3.5" />
              Raw JSON View
            </button>
          </div>
        </div>

        {/* Query Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Icon icon="ph:magnifying-glass-bold" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder={`Search across ${resource} (?q=...)...`}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <span>Limit:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-white font-mono text-slate-700"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </label>

            <button
              type="button"
              onClick={fetchRecords}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all text-xs"
              title="Refresh records"
            >
              <Icon icon="ph:arrows-clockwise-bold" className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content Display */}
        {viewMode === 'table' ? (
          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                  <tr>
                    <th className="py-3 px-4">ID</th>
                    {resource === 'users' && (
                      <>
                        <th className="py-3 px-4">Profile</th>
                        <th className="py-3 px-4">Username</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Location / Company</th>
                      </>
                    )}
                    {resource === 'posts' && (
                      <>
                        <th className="py-3 px-4">Title</th>
                        <th className="py-3 px-4">Author (user_id)</th>
                        <th className="py-3 px-4">Body Excerpt</th>
                      </>
                    )}
                    {resource === 'comments' && (
                      <>
                        <th className="py-3 px-4">Post ID</th>
                        <th className="py-3 px-4">Author</th>
                        <th className="py-3 px-4">Comment Text</th>
                      </>
                    )}
                    {resource === 'todos' && (
                      <>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Task Title</th>
                        <th className="py-3 px-4">Assignee (user_id)</th>
                      </>
                    )}
                    <th className="py-3 px-4 text-right">State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-normal">
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        {loading ? 'Fetching records...' : 'No records found matching query.'}
                      </td>
                    </tr>
                  ) : (
                    records.map((item) => (
                      <tr key={String(item.id)} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                          {item.id}
                        </td>

                        {resource === 'users' && (
                          <>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <img
                                  src={`${config.apiUrl}/avatars/${encodeURIComponent(item.username || item.name || 'user')}.svg?size=32`}
                                  alt={item.name}
                                  className="w-6 h-6 rounded-full shrink-0"
                                />
                                <span className="font-semibold text-slate-800">{item.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-600">@{item.username}</td>
                            <td className="py-3 px-4 text-slate-600">{item.email}</td>
                            <td className="py-3 px-4 text-slate-500">
                              {item.address?.city || '—'} / {item.company?.name || '—'}
                            </td>
                          </>
                        )}

                        {resource === 'posts' && (
                          <>
                            <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs truncate" title={item.title}>
                              {item.title}
                            </td>
                            <td className="py-3 px-4 font-mono text-indigo-600">
                              <Link href={`/docs/resources/users`} className="hover:underline">
                                user #{item.user_id}
                              </Link>
                            </td>
                            <td className="py-3 px-4 text-slate-500 max-w-sm truncate" title={item.body}>
                              {item.body}
                            </td>
                          </>
                        )}

                        {resource === 'comments' && (
                          <>
                            <td className="py-3 px-4 font-mono text-indigo-600">
                              <Link href={`/docs/resources/posts`} className="hover:underline">
                                post #{item.post_id}
                              </Link>
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-semibold text-slate-900 truncate max-w-[140px]">{item.name}</p>
                              <p className="text-[11px] text-slate-400 truncate">{item.email}</p>
                            </td>
                            <td className="py-3 px-4 text-slate-500 max-w-md truncate" title={item.body}>
                              {item.body}
                            </td>
                          </>
                        )}

                        {resource === 'todos' && (
                          <>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  item.completed
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                <Icon icon={item.completed ? 'ph:check-bold' : 'ph:circle-bold'} className="w-2.5 h-2.5" />
                                {item.completed ? 'Completed' : 'Pending'}
                              </span>
                            </td>
                            <td className={`py-3 px-4 font-medium ${item.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                              {item.title}
                            </td>
                            <td className="py-3 px-4 font-mono text-indigo-600">
                              user #{item.user_id}
                            </td>
                          </>
                        )}

                        <td className="py-3 px-4 text-right">
                          {item._sandbox === 'created' ? (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-200">
                              +Created
                            </span>
                          ) : item._sandbox === 'updated' ? (
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-mono text-[10px] font-bold border border-amber-200">
                              ~Updated
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-slate-400 font-mono text-[10px]">
                              Baseline
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span>
                Page <strong className="text-slate-900">{page}</strong> of <strong className="text-slate-900">{totalPages}</strong>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded-lg border border-slate-200 bg-white font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 rounded-lg border border-slate-200 bg-white font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner max-h-96">
            <pre>{JSON.stringify(records, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* 3. Comprehensive Schema & Field Dictionary */}
      <div id="schema" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Icon icon="ph:brackets-curly-bold" className="w-5 h-5 text-indigo-600" />
              {singular} Entity Schema & Field Dictionary
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Exact property definitions, data types, nullability, and nested structures.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyTsInterface}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <Icon icon={copiedTs ? 'ph:check-bold' : 'ph:copy-bold'} className="w-3.5 h-3.5 text-indigo-600" />
            <span>{copiedTs ? 'Copied TypeScript!' : 'Copy TypeScript Interface'}</span>
          </button>
        </div>

        <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
              <tr>
                <th className="py-3 px-4">Field</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Required</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {schemaConfig.fields.map((f) => (
                <tr key={f.name} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                    {f.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-purple-600 font-medium">
                    {f.type}
                  </td>
                  <td className="py-3 px-4">
                    {f.required ? (
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                        Required
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                        Optional
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-600 leading-relaxed">
                    {f.desc}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                    {f.example}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Relational Data Model & Foreign Key Traversal */}
      {schemaConfig.relationships.length > 0 && (
        <div id="relationships" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Icon icon="ph:tree-structure-bold" className="w-5 h-5 text-indigo-600" />
              Entity Relationships & Nested Sub-Resources
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Access related entities without multiple round trips using hierarchical REST sub-resource paths.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schemaConfig.relationships.map((rel) => (
              <div
                key={rel.path}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 hover:border-indigo-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase">
                      {rel.type}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{rel.target}</h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">FK: {rel.fk}</span>
                </div>

                <div className="p-2 rounded-lg bg-slate-900 font-mono text-xs text-indigo-300">
                  GET {rel.path}
                </div>

                <p className="text-xs text-slate-600">{rel.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Copy-on-Write Sandbox Mutation Architecture */}
      <div id="architecture" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Icon icon="ph:git-commit-bold" className="w-5 h-5 text-indigo-600" />
            Copy-On-Write Sandbox Architecture
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            How stateful mutations persist during your test session without requiring database locks or affecting other developers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900">Baseline Read-Only Layer</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every session starts with pristine baseline fixtures (25 users, 100 posts, 500 comments, 200 todos). These records are never permanently modified or locked.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-900">Per-Visitor Overlay Tier</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When you call <code className="font-mono text-emerald-600">POST</code>, a <code className="font-mono text-emerald-600">local-&lt;uuid&gt;</code> record is spawned. <code className="font-mono text-indigo-600">PUT / PATCH</code> modifies your private overlay, and <code className="font-mono text-rose-600">DELETE</code> tags a tombstone marker.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="text-sm font-bold text-slate-900">Atomic Reset & Zero Lock</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sessions run in parallel with 100% isolation. A single call to <code className="font-mono text-purple-600">POST /api/v1/sandbox/reset</code> purges the overlay and restores clean initial data in &lt;5ms.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Production Code Recipes */}
      <div id="code-recipes" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Production Client Integration Recipes
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Tested integration patterns for React Query, TypeScript Fetch, Axios, Python, and cURL:
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <CodeBlock
            tabs={[
              { id: 'react-query', label: 'TanStack Query v5', code: codeRecipes.reactQuery, language: 'tsx', icon: 'ph:atom-bold' },
              { id: 'ts-fetch', label: 'TypeScript Fetch', code: codeRecipes.tsFetch, language: 'typescript', icon: 'ph:code-bold' },
              { id: 'axios', label: 'Axios Client', code: codeRecipes.axios, language: 'javascript', icon: 'ph:lightning-bold' },
              { id: 'python', label: 'Python Requests', code: codeRecipes.python, language: 'python', icon: 'ph:terminal-bold' },
              { id: 'curl', label: 'cURL Lifecycle', code: codeRecipes.curl, language: 'bash', icon: 'ph:command-bold' },
            ]}
            defaultTab="react-query"
          />
        </div>
      </div>

      {/* 7. Interactive Request Consoles for Every Endpoint */}
      <div id="consoles" className="space-y-6 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Interactive API Consoles ({name})
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Execute direct live requests against the sandbox API endpoints:
          </p>
        </div>

        <div className="space-y-6">
          {initialEndpoints.map((ep) => (
            <InteractiveConsole
              key={ep.id}
              method={ep.method}
              path={ep.path}
              title={ep.title}
              description={ep.description}
              initialBody={ep.requestBody ? JSON.stringify(ep.requestBody, null, 2) : ''}
            />
          ))}
        </div>
      </div>

      {/* 8. Prev / Next Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        {prevPage ? (
          <Link
            href={prevPage.href}
            className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-xs transition-all group space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Previous</span>
              <Icon icon="ph:arrow-left-bold" className="w-4 h-4 text-indigo-600 group-hover:-translate-x-1 transition-transform" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{prevPage.title}</h3>
          </Link>
        ) : <div />}

        {nextPage && (
          <Link
            href={nextPage.href}
            className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-xs transition-all group space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Next</span>
              <Icon icon="ph:arrow-right-bold" className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{nextPage.title}</h3>
          </Link>
        )}
      </div>
    </div>
  );
}

export default ResourceClient;
