import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

export const metadata: Metadata = {
  title: 'Mock CSV & Excel Spreadsheet Exports (.csv / .xlsx) — Playground API',
  description:
    'Generate RFC 4180 CSV files and Excel spreadsheets (.xlsx) with nested dot-notation flattening, custom queries, and instant sandbox parity.',
};

const exportResources = [
  {
    name: 'Posts',
    resource: 'posts',
    count: '100 rows',
    icon: 'ph:newspaper-bold',
    description: 'Post IDs, user associations, title, and body content.',
    csvUrl: `${config.apiUrl}/posts.csv`,
    xlsxUrl: `${config.apiUrl}/posts.xlsx`,
  },
  {
    name: 'Users',
    resource: 'users',
    count: '25 rows (Flattened)',
    icon: 'ph:users-bold',
    description: 'Flattened contact, street address, and company metadata.',
    csvUrl: `${config.apiUrl}/users.csv`,
    xlsxUrl: `${config.apiUrl}/users.xlsx`,
  },
  {
    name: 'Comments',
    resource: 'comments',
    count: '300 rows',
    icon: 'ph:chat-circle-text-bold',
    description: 'Feedback records with author email and post relationship.',
    csvUrl: `${config.apiUrl}/comments.csv`,
    xlsxUrl: `${config.apiUrl}/comments.xlsx`,
  },
  {
    name: 'Todos',
    resource: 'todos',
    count: '125 rows',
    icon: 'ph:check-square-offset-bold',
    description: 'Task checklists, completion booleans, and user ownership.',
    csvUrl: `${config.apiUrl}/todos.csv`,
    xlsxUrl: `${config.apiUrl}/todos.xlsx`,
  },
];

export default function CsvExcelExportPage() {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Icon icon="ph:file-csv-bold" className="w-3.5 h-3.5" />
            RFC 4180 CSV
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Icon icon="ph:file-xls-bold" className="w-3.5 h-3.5" />
            Excel (.xlsx)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Icon icon="ph:tree-structure-bold" className="w-3.5 h-3.5" />
            Dot-Notation Flattening
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Mock CSV & Excel Spreadsheet Exports
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
          Instantly stream or download any Playground API resource as standard RFC 4180 compliant CSV text or native
          Microsoft Excel (<code className="text-primary font-mono text-sm">.xlsx</code>) binary workbooks. Features automatic
          nested object flattening, relational filtering, and custom collection support.
        </p>
      </div>

      {/* 1-Click Download Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Icon icon="ph:download-simple-bold" className="w-5 h-5 text-primary" />
            One-Click Resource Downloads
          </h2>
          <span className="text-xs text-muted-foreground font-mono">Live Sandbox State</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exportResources.map((item) => (
            <div
              key={item.resource}
              className="p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/40 transition-all duration-200 flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                      <Icon icon={item.icon} className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-foreground text-base">{item.name}</span>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground font-mono">
                    {item.count}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                <a
                  href={item.csvUrl}
                  download
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                >
                  <Icon icon="ph:file-csv-bold" className="w-4 h-4" />
                  Download .CSV
                </a>
                <a
                  href={item.xlsxUrl}
                  download
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 transition-colors"
                >
                  <Icon icon="ph:file-xls-bold" className="w-4 h-4" />
                  Download .XLSX
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How to Request Exports */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Icon icon="ph:sliders-horizontal-bold" className="w-5 h-5 text-primary" />
          3 Ways to Request Exports
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="font-semibold text-foreground text-sm">URL Extension Route</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Append <code className="text-foreground font-mono">.csv</code> or <code className="text-foreground font-mono">.xlsx</code> directly to any collection endpoint URL.
            </p>
            <div className="p-2.5 rounded-lg bg-background/80 border border-border/50 text-[11px] font-mono text-primary truncate">
              GET /api/v1/posts.csv
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="font-semibold text-foreground text-sm">Query Parameter</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Pass <code className="text-foreground font-mono">?_format=csv</code> or <code className="text-foreground font-mono">?_format=xlsx</code> alongside sorting and relational filters.
            </p>
            <div className="p-2.5 rounded-lg bg-background/80 border border-border/50 text-[11px] font-mono text-primary truncate">
              GET /api/v1/posts?_format=xlsx
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="font-semibold text-foreground text-sm">HTTP Accept Header</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Use standard HTTP content negotiation with the <code className="text-foreground font-mono">Accept</code> header.
            </p>
            <div className="p-2.5 rounded-lg bg-background/80 border border-border/50 text-[11px] font-mono text-primary truncate">
              Accept: text/csv
            </div>
          </div>
        </div>
      </div>

      {/* Nested Dot-Notation Flattening */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Icon icon="ph:tree-structure-bold" className="w-5 h-5 text-primary" />
          Automatic Nested Object Flattening
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Standard CSV and spreadsheet engines cannot natively represent hierarchical JSON trees. Playground API automatically unrolls nested sub-objects into clean, dot-notated column headers:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Raw Hierarchical JSON</span>
            <CodeBlock
              language="json"
              code={`{
  "id": 1,
  "name": "Leanne Graham",
  "address": {
    "street": "Kulas Light",
    "city": "Gwenborough",
    "zipcode": "92998-3874"
  },
  "company": {
    "name": "Romaguera-Crona"
  }
}`}
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Flattened RFC 4180 CSV</span>
            <CodeBlock
              language="csv"
              code={`id,name,address.street,address.city,address.zipcode,company.name
1,"Leanne Graham","Kulas Light","Gwenborough","92998-3874","Romaguera-Crona"`}
            />
          </div>
        </div>
      </div>

      {/* Relational & Filtered Exports */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Icon icon="ph:funnel-bold" className="w-5 h-5 text-primary" />
          Relational Sub-Resources & Custom Collections
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          All filtering, ordering, relational parameters, and dynamic custom collections fully support spreadsheet exports:
        </p>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-card border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-semibold text-foreground text-sm">Nested User Posts Export</span>
              <p className="text-xs text-muted-foreground">Export all posts written by User #1 as CSV</p>
            </div>
            <code className="text-xs font-mono bg-background px-3 py-1.5 rounded-lg text-primary border border-border/50">
              GET /api/v1/users/1/posts.csv
            </code>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-semibold text-foreground text-sm">Custom Dynamic Collection Export</span>
              <p className="text-xs text-muted-foreground">Export custom seeded products collection to Excel</p>
            </div>
            <code className="text-xs font-mono bg-background px-3 py-1.5 rounded-lg text-primary border border-border/50">
              GET /api/v1/custom/products.xlsx
            </code>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-semibold text-foreground text-sm">Filtered & Sorted Export</span>
              <p className="text-xs text-muted-foreground">Export incomplete todos sorted by title in descending order</p>
            </div>
            <code className="text-xs font-mono bg-background px-3 py-1.5 rounded-lg text-primary border border-border/50">
              GET /api/v1/todos.csv?completed=false&_sort=title&_order=desc
            </code>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Icon icon="ph:code-bold" className="w-5 h-5 text-primary" />
          Integration Recipes
        </h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Python Pandas — Direct DataFrame Loading
            </span>
            <CodeBlock
              language="python"
              code={`import pandas as pd

# Load CSV directly into Pandas DataFrame
df_posts = pd.read_csv("${config.apiUrl}/posts.csv")
print(df_posts.head())

# Load Excel spreadsheet directly
df_users = pd.read_excel("${config.apiUrl}/users.xlsx")
print(df_users[['name', 'address.city', 'company.name']])`}
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Browser JavaScript — Programmatic File Download Helper
            </span>
            <CodeBlock
              language="typescript"
              code={`async function downloadSpreadsheet(resource: string, format: 'csv' | 'xlsx' = 'csv') {
  const response = await fetch(\`${config.apiUrl}/\${resource}.\${format}\`);
  const blob = await response.blob();
  
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = \`\${resource}-export.\${format}\`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// Trigger instant download
downloadSpreadsheet('posts', 'xlsx');`}
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              cURL — Download via Terminal
            </span>
            <CodeBlock
              language="bash"
              code={`# Download CSV with output file
curl -O "${config.apiUrl}/users.csv"

# Download Excel workbook with content-negotiation header
curl -H "Accept: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" \\
  -o "products-export.xlsx" \\
  "${config.apiUrl}/custom/products"`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
