'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import Link from 'next/link';

interface SchemaField {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
  fkTarget?: string;
  description: string;
}

interface EntitySchema {
  id: string;
  name: string;
  icon: string;
  accentColor: string;
  countBadge: string;
  primaryKey: string;
  relations: string[];
  fields: SchemaField[];
  sampleRecord: Record<string, unknown>;
  relationalRoutes: { label: string; path: string }[];
}

const SCHEMAS: EntitySchema[] = [
  {
    id: 'users',
    name: 'Users',
    icon: 'ph:users-bold',
    accentColor: 'indigo',
    countBadge: '25 Records',
    primaryKey: 'id',
    relations: ['1 : N Posts', '1 : N Comments', '1 : N Todos', '1 : N Carts'],
    fields: [
      { name: 'id', type: 'integer | string', isPk: true, description: 'Primary ID (integer for baseline, local-<uuid> for sandbox)' },
      { name: 'name', type: 'string', description: 'Full user display name' },
      { name: 'username', type: 'string', description: 'Unique user handle' },
      { name: 'email', type: 'string', description: 'Verified contact email' },
      { name: 'role', type: 'enum (admin | editor | user)', description: 'Access control role' },
      { name: 'address', type: 'object { city, street, geo }', description: 'Nested geolocation metadata' },
    ],
    sampleRecord: {
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
      role: 'admin',
      address: {
        street: 'Kulas Light',
        city: 'Gwenborough',
        geo: { lat: '-37.3159', lng: '81.1496' },
      },
    },
    relationalRoutes: [
      { label: 'User Posts', path: '/users/1/posts' },
      { label: 'User Todos', path: '/users/1/todos' },
    ],
  },
  {
    id: 'posts',
    name: 'Posts',
    icon: 'ph:article-bold',
    accentColor: 'emerald',
    countBadge: '100 Records',
    primaryKey: 'id',
    relations: ['N : 1 Users', '1 : N Comments'],
    fields: [
      { name: 'id', type: 'integer | string', isPk: true, description: 'Primary post identifier' },
      { name: 'user_id', type: 'integer | string', isFk: true, fkTarget: 'Users.id', description: 'Author user foreign key' },
      { name: 'title', type: 'string', description: 'Article headline' },
      { name: 'body', type: 'text', description: 'Full post paragraph content' },
      { name: 'tags', type: 'string[]', description: 'Array of category tags' },
      { name: 'views', type: 'integer', description: 'Analytics view counter' },
    ],
    sampleRecord: {
      id: 1,
      user_id: 1,
      title: 'sunt aut facere repellat provident occaecati excepturi optio',
      body: 'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto',
      tags: ['history', 'tech', 'science'],
      views: 1420,
    },
    relationalRoutes: [
      { label: 'Post Comments', path: '/posts/1/comments' },
      { label: 'Author Profile', path: '/users/1' },
    ],
  },
  {
    id: 'comments',
    name: 'Comments',
    icon: 'ph:chat-teardrop-text-bold',
    accentColor: 'cyan',
    countBadge: '300 Records',
    primaryKey: 'id',
    relations: ['N : 1 Posts', 'N : 1 Users'],
    fields: [
      { name: 'id', type: 'integer | string', isPk: true, description: 'Unique comment identifier' },
      { name: 'post_id', type: 'integer | string', isFk: true, fkTarget: 'Posts.id', description: 'Parent post foreign key' },
      { name: 'user_id', type: 'integer | string', isFk: true, fkTarget: 'Users.id', description: 'Commenter user foreign key' },
      { name: 'name', type: 'string', description: 'Comment subject line' },
      { name: 'email', type: 'string', description: 'Commenter contact email' },
      { name: 'body', type: 'text', description: 'Comment discussion text' },
    ],
    sampleRecord: {
      id: 1,
      post_id: 1,
      user_id: 2,
      name: 'id labore ex et quam laborum',
      email: 'Eliseo@gardner.biz',
      body: 'laudantium enim quasi est quidem magnam voluptate ipsam eos tempora quo necessitatibus',
    },
    relationalRoutes: [
      { label: 'Parent Post', path: '/posts/1' },
      { label: 'Filter by Post', path: '/comments?post_id=1' },
    ],
  },
  {
    id: 'todos',
    name: 'Todos',
    icon: 'ph:check-square-bold',
    accentColor: 'amber',
    countBadge: '125 Records',
    primaryKey: 'id',
    relations: ['N : 1 Users'],
    fields: [
      { name: 'id', type: 'integer | string', isPk: true, description: 'Unique task identifier' },
      { name: 'user_id', type: 'integer | string', isFk: true, fkTarget: 'Users.id', description: 'Assigned user foreign key' },
      { name: 'title', type: 'string', description: 'Task checklist item description' },
      { name: 'completed', type: 'boolean', description: 'Status completion flag' },
    ],
    sampleRecord: {
      id: 1,
      user_id: 1,
      title: 'delectus aut autem',
      completed: false,
    },
    relationalRoutes: [
      { label: 'Pending Todos', path: '/todos?completed=false' },
      { label: 'User Todos', path: '/users/1/todos' },
    ],
  },
  {
    id: 'products',
    name: 'Products',
    icon: 'ph:tag-bold',
    accentColor: 'violet',
    countBadge: '100 Records',
    primaryKey: 'id',
    relations: ['1 : N Cart Items'],
    fields: [
      { name: 'id', type: 'integer | string', isPk: true, description: 'Product SKU identifier' },
      { name: 'title', type: 'string', description: 'Product title' },
      { name: 'price', type: 'float', description: 'Retail price in USD' },
      { name: 'category', type: 'string', description: 'Department category tag' },
      { name: 'stock', type: 'integer', description: 'Available inventory level' },
      { name: 'rating', type: 'float', description: 'Aggregate review score (0-5)' },
    ],
    sampleRecord: {
      id: 1,
      title: 'Essence Mascara Lash Princess',
      price: 9.99,
      category: 'beauty',
      stock: 99,
      rating: 4.94,
    },
    relationalRoutes: [
      { label: 'Top Rated', path: '/products?_sort=rating&_order=desc' },
      { label: 'Beauty Category', path: '/products?category=beauty' },
    ],
  },
  {
    id: 'carts',
    name: 'Carts',
    icon: 'ph:shopping-cart-bold',
    accentColor: 'rose',
    countBadge: '20 Records',
    primaryKey: 'id',
    relations: ['N : 1 Users', 'N : N Products'],
    fields: [
      { name: 'id', type: 'integer | string', isPk: true, description: 'Cart identifier' },
      { name: 'user_id', type: 'integer | string', isFk: true, fkTarget: 'Users.id', description: 'Owner user foreign key' },
      { name: 'products', type: 'array of line items', description: 'Array of products with quantity and discount' },
      { name: 'total', type: 'float', description: 'Order gross total' },
      { name: 'total_products', type: 'integer', description: 'Unique items count' },
    ],
    sampleRecord: {
      id: 1,
      user_id: 1,
      products: [
        { id: 168, title: 'Charger SXT RWD', price: 32999.99, quantity: 1, total: 32999.99 },
        { id: 78, title: 'Apple MacBook Pro 14', price: 1999.99, quantity: 2, total: 3999.98 },
      ],
      total: 36999.97,
      total_products: 2,
    },
    relationalRoutes: [
      { label: 'Single Cart', path: '/carts/1' },
      { label: 'User Cart', path: '/users/1/carts' },
    ],
  },
];

export function SchemaRelationsVisualizer() {
  const [activeSchemaId, setActiveSchemaId] = useState<string>('posts');

  const selectedSchema = SCHEMAS.find((s) => s.id === activeSchemaId) || SCHEMAS[0];

  const handleTryRoute = (path: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('playground:try-route', {
          detail: { endpoint: path, method: 'GET' },
        })
      );
    }
  };

  return (
    <section id="schema-relations" className="py-16 bg-bg-canvas border-b border-border-default">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Icon icon="ph:tree-structure-bold" className="w-4 h-4" />
            <span>MockAPI & Relational Model</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Relational Schema Architecture
          </h2>
          <p className="mt-3 text-sm sm:text-base text-text-secondary leading-relaxed">
            Unlike flat mock generators, Playground API resources have authentic primary and foreign key relationships with joined nested routes. Click any entity to inspect its schema.
          </p>
        </div>

        {/* Entity Selector Pills / Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {SCHEMAS.map((entity) => {
            const isSelected = entity.id === activeSchemaId;

            return (
              <button
                key={entity.id}
                onClick={() => setActiveSchemaId(entity.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-2 ${
                  isSelected
                    ? 'bg-bg-surface border-brand-primary shadow-lg shadow-brand-primary/10 ring-1 ring-brand-primary/40'
                    : 'bg-bg-surface/50 border-border-default hover:bg-bg-surface hover:border-border-subtle'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? 'bg-brand-primary text-white'
                        : 'bg-bg-elevated text-text-secondary'
                    }`}
                  >
                    <Icon icon={entity.icon} className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-bg-elevated text-text-secondary border border-border-subtle">
                    {entity.countBadge}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-text-primary">{entity.name}</h4>
                  <p className="text-[10px] font-mono text-text-muted mt-0.5 truncate">
                    PK: {entity.primaryKey}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Relational Visualizer Drawer / Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-bg-surface border border-border-default rounded-3xl p-6 shadow-2xl">
          
          {/* Left Column: Schema Field Breakdown */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                  <Icon icon={selectedSchema.icon} className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <span>{selectedSchema.name} Schema Definition</span>
                    <span className="text-xs font-mono text-brand-primary font-normal">
                      table:{selectedSchema.id}
                    </span>
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {selectedSchema.relations.map((rel, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                  >
                    {rel}
                  </span>
                ))}
              </div>
            </div>

            {/* Field Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] font-mono uppercase text-text-muted border-b border-border-subtle">
                    <th className="pb-2">Field</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Key</th>
                    <th className="pb-2">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle/50 font-mono">
                  {selectedSchema.fields.map((field) => (
                    <tr key={field.name} className="hover:bg-bg-elevated/40">
                      <td className="py-2.5 font-bold text-text-primary">{field.name}</td>
                      <td className="py-2.5 text-brand-primary text-[11px]">{field.type}</td>
                      <td className="py-2.5">
                        {field.isPk && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20">
                            PK
                          </span>
                        )}
                        {field.isFk && (
                          <span
                            className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/20"
                            title={`Foreign key -> ${field.fkTarget}`}
                          >
                            FK
                          </span>
                        )}
                        {!field.isPk && !field.isFk && <span className="text-text-muted">—</span>}
                      </td>
                      <td className="py-2.5 font-sans text-text-secondary text-[11px]">
                        {field.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Relational Query Shortcuts */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted font-mono block mb-2">
                Relational Sub-Resource Endpoints:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedSchema.relationalRoutes.map((route, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTryRoute(route.path)}
                    className="px-3 py-1.5 rounded-xl bg-bg-elevated hover:bg-border-default border border-border-default text-xs font-mono text-text-primary hover:text-brand-primary transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Icon icon="ph:git-fork-bold" className="w-3.5 h-3.5 text-brand-primary" />
                    <span>{route.label}</span>
                    <span className="text-text-muted text-[10px]">({route.path})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sample JSON Record Code Viewer */}
          <div className="lg:col-span-6 flex flex-col gap-2">
            <div className="flex items-center justify-between px-3 py-2 bg-bg-elevated/70 border border-border-subtle rounded-t-xl">
              <span className="text-xs font-mono text-text-secondary flex items-center gap-1.5">
                <Icon icon="ph:file-json-bold" className="w-3.5 h-3.5 text-brand-primary" />
                <span>{selectedSchema.id}-sample.json</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Live Schema Output
              </span>
            </div>

            <CodeBlock
              code={selectedSchema.sampleRecord}
              language="json"
              maxHeight="max-h-[19rem]"
              showLineNumbers={true}
              showHeader={false}
              copyable={true}
              className="rounded-b-xl border border-border-default"
            />

            <div className="flex items-center justify-between pt-1">
              <Link
                href={`/docs/${selectedSchema.id}`}
                className="text-xs text-brand-primary hover:underline font-semibold flex items-center gap-1"
              >
                <span>Read Full {selectedSchema.name} API Reference</span>
                <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default SchemaRelationsVisualizer;
