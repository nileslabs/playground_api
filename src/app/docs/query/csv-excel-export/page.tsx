'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { CodeBlock } from '@/components/ui/CodeBlock';

const SAMPLE_POSTS_CSV = `title,body,userId
Automated Test Post 1,Dispatched via CSV bulk spreadsheet import,1
Automated Test Post 2,Second row parsed with strict column validation,2
Automated Test Post 3,Third item merged into session overlay database,1`;

const SAMPLE_USERS_CSV = `name,username,email,address.city,address.zipcode,company.name
Dr. Sarah Connor,sconnor,sarah@cyberdyne.org,Los Angeles,90001,Resistance Tech
Kyle Reese,kreese,kyle@future.net,Tech Com,90002,Defense Sector`;

const SAMPLE_COMMENTS_CSV = `name,email,body,postId
Alex Mercer,alex.mercer@prototype.io,Great architecture and streaming capabilities.,1
Elena Fisher,elena@journalism.org,Verified column parsing and type casting works flawlessly.,1
Marcus Vance,marcus.v@enterprisetech.com,CSV export and import round-trip matches schema 100%.,2`;

const SAMPLE_TODOS_CSV = `title,completed,userId
Implement round-trip spreadsheet test suite,true,1
Audit column schema validation rules,true,1
Deploy automated CSV bulk ingest worker,false,2
Run end-to-end regression validation,false,2`;

const SAMPLE_CUSTOM_CSV = `sku,productName,unitPrice,inStock,category
SKU-501,Mechanical Wireless Keyboard,129.99,true,Peripherals
SKU-502,4K USB-C Studio Monitor,489.50,true,Displays
SKU-503,Ergonomic Vertical Mouse,64.00,false,Peripherals`;

const EXPORT_DATASETS = [
  {
    id: 'posts',
    name: 'posts',
    resource: 'posts',
    label: 'Blog Articles',
    description: '100 articles with title, body, and user_id foreign keys.',
    badge: '100 rows',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: 'ph:article-bold',
    iconBg: 'bg-emerald-100 text-emerald-700',
    querySample: '?userId=1&limit=3'
  },
  {
    id: 'users',
    name: 'users',
    resource: 'users',
    label: 'User Directory',
    description: '10 user profiles with nested dot-notation address.* and company.*.',
    badge: '10 rows',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: 'ph:users-bold',
    iconBg: 'bg-indigo-100 text-indigo-700',
    querySample: '?limit=5'
  },
  {
    id: 'comments',
    name: 'comments',
    resource: 'comments',
    label: 'Discussion Comments',
    description: '500 comments with postId, author name, email, and body text.',
    badge: '500 rows',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    icon: 'ph:chat-teardrop-text-bold',
    iconBg: 'bg-sky-100 text-sky-700',
    querySample: '?postId=1&limit=5'
  },
  {
    id: 'todos',
    name: 'todos',
    resource: 'todos',
    label: 'Task Checklists',
    description: '200 todos with boolean completion status and userId.',
    badge: '200 rows',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: 'ph:check-square-offset-bold',
    iconBg: 'bg-amber-100 text-amber-700',
    querySample: '?completed=false&limit=5'
  },
  {
    id: 'products',
    name: 'custom/products',
    resource: 'custom/products',
    label: 'E-Commerce Products',
    description: 'Catalog items with SKU, price, stock boolean, and category.',
    badge: 'Custom Schema',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: 'ph:shopping-bag-bold',
    iconBg: 'bg-purple-100 text-purple-700',
    querySample: '?category=Peripherals'
  },
  {
    id: 'orders',
    name: 'custom/orders',
    resource: 'custom/orders',
    label: 'Orders Directory',
    description: 'Store orders with customer details, order totals, and fulfillment status.',
    badge: 'Custom Schema',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: 'ph:receipt-bold',
    iconBg: 'bg-rose-100 text-rose-700',
    querySample: '?status=shipped'
  }
];

export default function ExportImportDataPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  // Import State
  const [targetResource, setTargetResource] = useState<string>('posts');
  const [csvInput, setCsvInput] = useState<string>(SAMPLE_POSTS_CSV);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState<boolean>(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
    totalImported?: number;
    details?: any[];
  } | null>(null);
  const [codeTab, setCodeTab] = useState<'fetch-upload' | 'curl-upload' | 'download-helper'>('fetch-upload');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const downloadFile = (resource: string, ext: 'csv' | 'xlsx', query = '') => {
    const url = `${publicApiUrl}/${resource}.${ext}${query}`;
    window.open(url, '_blank');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImportResult(null);

      // If it's a CSV file, also read text for instant browser preview
      if (file.name.toLowerCase().endsWith('.csv')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (typeof event.target?.result === 'string') {
            setCsvInput(event.target.result);
          }
        };
        reader.readAsText(file);
      }
    }
  };

  const loadSample = (sample: string, res: string) => {
    setCsvInput(sample);
    setSelectedFile(null);
    setTargetResource(res);
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const executeImport = async () => {
    setImportLoading(true);
    setImportResult(null);

    try {
      const endpoint = targetResource.startsWith('custom_')
        ? `${publicApiUrl}/custom/${targetResource.replace(/^custom_/, '')}/import`
        : `${publicApiUrl}/${targetResource}/import`;

      let response: Response;

      if (selectedFile) {
        // Multipart file upload (.csv or .xlsx)
        const formData = new FormData();
        formData.append('file', selectedFile);

        response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });
      } else {
        // Raw CSV text import
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/csv'
          },
          body: csvInput,
          credentials: 'include'
        });
      }

      const json = await response.json();

      if (response.ok) {
        setImportResult({
          success: true,
          message: json.message || `Successfully imported ${json.totalImported} records into '${json.resource}'.`,
          totalImported: json.totalImported
        });
      } else {
        setImportResult({
          success: false,
          message: json.message || json.error || 'Import failed. Validate columns against schema requirements.',
          details: json.details
        });
      }
    } catch (err: any) {
      setImportResult({
        success: false,
        message: err.message || 'Network error occurred during spreadsheet import.'
      });
    } finally {
      setImportLoading(false);
    }
  };

  // Preview Parsed Rows
  const parsedLines = csvInput.trim().split('\n').filter((l) => l.trim().length > 0);
  const previewHeaders = parsedLines.length > 0 ? parsedLines[0].split(',') : [];
  const previewRows = parsedLines.slice(1, 4).map((line) => line.split(','));

  const fetchUploadRecipe = `// Upload CSV or Excel file to /:resource/import
async function uploadSpreadsheet(file, resource = 'posts') {
  const formData = new FormData();
  formData.append('file', file); // File from <input type="file">

  const response = await fetch(\`${publicApiUrl}/\${resource}/import\`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Validation issues:', errorData.details);
    throw new Error(errorData.message || 'Import failed');
  }

  const result = await response.json();
  console.log('Total records imported:', result.totalImported);
  return result;
}`;

  const curlUploadRecipe = `# 1. Upload CSV file to standard resource with column validation
curl -X POST "${publicApiUrl}/posts/import" \\
  -H "X-Playground-Identity: test-runner-1" \\
  -F "file=@./fixtures/posts.csv"

# 2. Upload Excel (.xlsx) file to custom collection
curl -X POST "${publicApiUrl}/custom/inventory/import" \\
  -H "X-Playground-Identity: test-runner-1" \\
  -F "file=@./data/inventory.xlsx"

# 3. Stream raw CSV text directly in request body
curl -X POST "${publicApiUrl}/posts/import" \\
  -H "Content-Type: text/csv" \\
  --data-binary $'title,body,userId\\nPost Title,Post Body Content,1'`;

  const downloadBlobRecipe = `// Programmatic client download helper
async function triggerSpreadsheetDownload(resource = 'posts', format = 'xlsx') {
  const url = \`${publicApiUrl}/\${resource}.\${format}\`;
  const response = await fetch(url, { credentials: 'include' });
  const blob = await response.blob();

  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = \`\${resource}-export.\${format}\`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(downloadUrl);
}`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:file-xls-bold" className="w-3.5 h-3.5" />
          <span>Data & Query Engine</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          CSV & Excel Tabular Export & Import
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Complete round-trip spreadsheet engineering for mock databases. Convert any REST resource or custom collection into real <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-bold">.csv</code> or <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-bold">.xlsx</code> spreadsheet files, and import tabular data back into your sandbox with strict column schema validation.
        </p>
      </div>

      {/* 2. Interactive Export Panel */}
      <div id="export-panel" className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-emerald-100 text-emerald-700">
              <Icon icon="ph:download-simple-bold" className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-base text-slate-900">1. Instant Tabular File Download</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Export any system resource or custom collection as standard RFC 4180 CSV or native Excel (.xlsx) workbooks:
          </p>
        </div>

        {/* Multi-Dataset Export Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXPORT_DATASETS.map((ds) => (
            <div
              key={ds.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-white hover:border-slate-300 transition-all flex flex-col justify-between gap-3 shadow-2xs group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg ${ds.iconBg} flex items-center justify-center font-bold`}>
                      <Icon icon={ds.icon} className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 font-mono">{ds.name}</h4>
                      <span className="text-[11px] text-slate-500 font-sans block">{ds.label}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ds.badgeColor}`}>
                    {ds.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {ds.description}
                </p>
              </div>

              {/* Download Buttons for CSV & XLSX */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={() => downloadFile(ds.resource, 'csv')}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/40 text-xs font-bold text-slate-700 hover:text-emerald-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  title={`Download ${ds.resource}.csv`}
                >
                  <Icon icon="ph:file-csv-bold" className="w-4 h-4 text-emerald-600" />
                  <span>.CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => downloadFile(ds.resource, 'xlsx')}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/40 text-xs font-bold text-slate-700 hover:text-emerald-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  title={`Download ${ds.resource}.xlsx`}
                >
                  <Icon icon="ph:file-xls-bold" className="w-4 h-4 text-emerald-600" />
                  <span>.XLSX</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Filtered & Relational Export Demonstration */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Icon icon="ph:funnel-bold" className="w-3.5 h-3.5 text-indigo-600" />
              Filtered &amp; Relational Spreadsheets on the Fly
            </span>
            <span className="text-[11px] text-slate-500">
              Query filters apply directly to live CSV and Excel streams.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => downloadFile('posts', 'csv', '?userId=1&limit=3')}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 text-xs font-mono text-slate-700 hover:text-indigo-600 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Icon icon="ph:download-simple-bold" className="w-3.5 h-3.5 text-indigo-500" />
              <span>posts.csv?userId=1&amp;limit=3</span>
            </button>

            <button
              type="button"
              onClick={() => downloadFile('users/1/posts', 'csv')}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 text-xs font-mono text-slate-700 hover:text-indigo-600 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Icon icon="ph:download-simple-bold" className="w-3.5 h-3.5 text-indigo-500" />
              <span>users/1/posts.csv</span>
            </button>

            <button
              type="button"
              onClick={() => downloadFile('posts/1/comments', 'csv')}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 text-xs font-mono text-slate-700 hover:text-indigo-600 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Icon icon="ph:download-simple-bold" className="w-3.5 h-3.5 text-indigo-500" />
              <span>posts/1/comments.csv</span>
            </button>

            <button
              type="button"
              onClick={() => downloadFile('todos', 'csv', '?completed=false&limit=10')}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-amber-400 text-xs font-mono text-slate-700 hover:text-amber-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Icon icon="ph:download-simple-bold" className="w-3.5 h-3.5 text-amber-500" />
              <span>todos.csv?completed=false</span>
            </button>

            <button
              type="button"
              onClick={() => downloadFile('custom/products', 'csv', '?category=Peripherals')}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-purple-400 text-xs font-mono text-slate-700 hover:text-purple-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Icon icon="ph:download-simple-bold" className="w-3.5 h-3.5 text-purple-500" />
              <span>custom/products.csv?category=Peripherals</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Interactive Import Workbench */}
      <div id="import-panel" className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-indigo-100 text-indigo-700">
                <Icon icon="ph:upload-simple-bold" className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-base text-slate-900">2. Interactive Spreadsheet Import Workbench</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Upload a <code className="font-mono text-[11px]">.csv</code> or <code className="font-mono text-[11px]">.xlsx</code> file or paste CSV text to import into your sandbox with schema validation:
            </p>
          </div>

          {/* Quick Sample Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quick Sample:</span>
            <button
              type="button"
              onClick={() => loadSample(SAMPLE_POSTS_CSV, 'posts')}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              posts.csv
            </button>
            <button
              type="button"
              onClick={() => loadSample(SAMPLE_USERS_CSV, 'users')}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              users.csv
            </button>
            <button
              type="button"
              onClick={() => loadSample(SAMPLE_COMMENTS_CSV, 'comments')}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              comments.csv
            </button>
            <button
              type="button"
              onClick={() => loadSample(SAMPLE_TODOS_CSV, 'todos')}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              todos.csv
            </button>
            <button
              type="button"
              onClick={() => loadSample(SAMPLE_CUSTOM_CSV, 'custom_products')}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              custom_products
            </button>
            <button
              type="button"
              onClick={() => loadSample(SAMPLE_CUSTOM_CSV, 'custom_inventory')}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              custom_inventory
            </button>
          </div>
        </div>

        {/* Configuration Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Target Destination Collection
            </label>
            <select
              value={targetResource}
              onChange={(e) => setTargetResource(e.target.value)}
              className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 font-semibold cursor-pointer"
            >
              <option value="posts">posts (POST /posts/import)</option>
              <option value="users">users (POST /users/import)</option>
              <option value="comments">comments (POST /comments/import)</option>
              <option value="todos">todos (POST /todos/import)</option>
              <option value="custom_products">custom_products (POST /custom/products/import)</option>
              <option value="custom_orders">custom_orders (POST /custom/orders/import)</option>
              <option value="custom_inventory">custom_inventory (POST /custom/inventory/import)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Attach .csv or .xlsx Spreadsheet File (Optional)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv, .xlsx, .xls, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFileChange}
              className="w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 text-slate-600 cursor-pointer"
            />
          </div>
        </div>

        {/* CSV Textarea Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {selectedFile ? `File Selected: ${selectedFile.name}` : 'CSV Payload Text Editor'}
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              {parsedLines.length > 0 ? `${parsedLines.length - 1} records detected` : 'Empty'}
            </span>
          </div>
          <textarea
            value={csvInput}
            onChange={(e) => {
              setCsvInput(e.target.value);
              setSelectedFile(null);
            }}
            rows={5}
            placeholder="paste CSV rows with headers (e.g. title,body,userId)..."
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Detected Columns & Live Table Preview */}
        {previewHeaders.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Icon icon="ph:table-bold" className="w-4 h-4 text-indigo-600" />
                Parsed Table Structure Preview
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                {previewHeaders.length} columns detected
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    {previewHeaders.map((h, i) => (
                      <th key={i} className="py-2 px-3 text-indigo-600">{h.trim()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {previewRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/50">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="py-2 px-3">{cell.trim()}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Action Button & Status Output */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={executeImport}
            disabled={importLoading || (!csvInput.trim() && !selectedFile)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Icon icon={importLoading ? 'ph:spinner-bold' : 'ph:cloud-arrow-up-bold'} className={`w-4 h-4 ${importLoading ? 'animate-spin' : ''}`} />
            <span>{importLoading ? 'Validating & Importing...' : 'Import Spreadsheet to Sandbox Overlay'}</span>
          </button>

          {importResult && (
            <div
              className={`p-4 rounded-xl text-xs font-semibold space-y-2 ${
                importResult.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon
                  icon={importResult.success ? 'ph:check-circle-bold' : 'ph:warning-circle-bold'}
                  className="w-4 h-4 shrink-0"
                />
                <span>{importResult.message}</span>
              </div>

              {/* Validation Details Breakdown */}
              {importResult.details && importResult.details.length > 0 && (
                <div className="mt-2 pt-2 border-t border-rose-200 space-y-1 font-mono text-[11px]">
                  {importResult.details.map((issue, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="px-1.5 py-0.2 rounded bg-rose-200 text-rose-900 font-bold">
                        Row {issue.row}
                      </span>
                      <span>
                        Field <code className="font-bold">'{issue.field}'</code>: {issue.issue}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. Column Schema & Validation Rules Reference */}
      <div id="validation-rules" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Database Column Validation Rules
          </h2>
          <p className="text-sm text-slate-600">
            Every imported row is strictly validated against database constraints and system columns before entering your overlay:
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-4">Resource</th>
                <th className="py-3 px-4">Required Headers</th>
                <th className="py-3 px-4">Optional / Nested Columns</th>
                <th className="py-3 px-4">Automatic Transformations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 text-xs">
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">posts</td>
                <td className="py-3 px-4 font-mono">title, body</td>
                <td className="py-3 px-4 font-mono">userId (or user_id)</td>
                <td className="py-3 px-4 font-sans text-slate-600">
                  userId is integer coerced (default 1). System metadata (<code className="font-mono">id</code>, <code className="font-mono">createdAt</code>) stripped for new local IDs.
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">users</td>
                <td className="py-3 px-4 font-mono">name, username, email</td>
                <td className="py-3 px-4 font-mono">phone, website, address.*, company.*</td>
                <td className="py-3 px-4 font-sans text-slate-600">
                  Validates email RFC format. Unflattens dot notation (<code className="font-mono">address.city</code>) into nested JSON structures.
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">comments</td>
                <td className="py-3 px-4 font-mono">name, email, body</td>
                <td className="py-3 px-4 font-mono">postId (or post_id)</td>
                <td className="py-3 px-4 font-sans text-slate-600">
                  Validates email format. Post ID defaults to 1 if omitted.
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">todos</td>
                <td className="py-3 px-4 font-mono">title</td>
                <td className="py-3 px-4 font-mono">completed, userId</td>
                <td className="py-3 px-4 font-sans text-slate-600">
                  Coerces <code className="font-mono">"true"|"false"|"1"|"0"</code> to strict boolean values (defaults to false).
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">custom_*</td>
                <td className="py-3 px-4 font-sans italic">Any non-empty property</td>
                <td className="py-3 px-4 font-sans italic">Any custom domain columns</td>
                <td className="py-3 px-4 font-sans text-slate-600">
                  Auto-coerces numbers and booleans. Rejects prototype pollution (<code className="font-mono">__proto__</code>). Max 500 rows/batch.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Production Code Recipes */}
      <div id="code-recipes" className="space-y-4 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Developer Integration Recipes</h2>
            <p className="text-sm text-slate-600">Code patterns for importing and exporting spreadsheet files programmatically:</p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            {(['fetch-upload', 'curl-upload', 'download-helper'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setCodeTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  codeTab === tab
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab === 'fetch-upload' ? 'Fetch Multipart Upload' : tab === 'curl-upload' ? 'cURL Commands' : 'Download Helper'}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          {codeTab === 'fetch-upload' && (
            <CodeBlock
              code={fetchUploadRecipe}
              language="javascript"
              title="services/uploadSpreadsheet.js"
            />
          )}
          {codeTab === 'curl-upload' && (
            <CodeBlock
              code={curlUploadRecipe}
              language="bash"
              title="Terminal cURL Commands"
            />
          )}
          {codeTab === 'download-helper' && (
            <CodeBlock
              code={downloadBlobRecipe}
              language="javascript"
              title="utils/downloadSpreadsheet.js"
            />
          )}
        </div>
      </div>

      {/* 6. Navigation Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
        <Link
          href="/docs/query/custom-resources"
          className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/30 transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs text-slate-500 font-semibold">Next Query Feature</span>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 flex items-center gap-1.5 mt-0.5">
              <span>Custom Collections CRUD</span>
              <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5" />
            </h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Icon icon="ph:table-bold" className="w-4 h-4" />
          </div>
        </Link>

        <Link
          href="/docs/sandbox/snapshots"
          className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/30 transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs text-slate-500 font-semibold">Related Feature</span>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 flex items-center gap-1.5 mt-0.5">
              <span>Session Snapshot JSON Import & Export</span>
              <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5" />
            </h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Icon icon="ph:cloud-arrow-up-bold" className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </div>
  );
}
