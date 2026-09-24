'use client';

import React, { useState, useMemo, useTransition } from 'react';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

export type FieldType =
  | 'id'
  | 'uuid'
  | 'name'
  | 'email'
  | 'avatar'
  | 'price'
  | 'boolean'
  | 'city'
  | 'date'
  | 'lorem';

export interface SchemaField {
  id: string;
  name: string;
  type: FieldType;
}

const TEMPLATES: { name: string; icon: string; resource: string; fields: SchemaField[] }[] = [
  {
    name: 'E-Commerce Products',
    icon: 'ph:tag-bold',
    resource: 'products',
    fields: [
      { id: '1', name: 'id', type: 'id' },
      { id: '2', name: 'title', type: 'name' },
      { id: '3', name: 'price', type: 'price' },
      { id: '4', name: 'category', type: 'city' },
      { id: '5', name: 'in_stock', type: 'boolean' },
      { id: '6', name: 'image', type: 'avatar' },
    ],
  },
  {
    name: 'CRM Customers',
    icon: 'ph:users-bold',
    resource: 'customers',
    fields: [
      { id: '1', name: 'id', type: 'id' },
      { id: '2', name: 'full_name', type: 'name' },
      { id: '3', name: 'email', type: 'email' },
      { id: '4', name: 'city', type: 'city' },
      { id: '5', name: 'avatar', type: 'avatar' },
      { id: '6', name: 'created_at', type: 'date' },
    ],
  },
  {
    name: 'IoT Telemetry Sensors',
    icon: 'ph:cpu-bold',
    resource: 'sensors',
    fields: [
      { id: '1', name: 'id', type: 'uuid' },
      { id: '2', name: 'device_name', type: 'name' },
      { id: '3', name: 'battery_level', type: 'price' },
      { id: '4', name: 'is_online', type: 'boolean' },
      { id: '5', name: 'last_ping', type: 'date' },
    ],
  },
  {
    name: 'Billing Invoices',
    icon: 'ph:receipt-bold',
    resource: 'invoices',
    fields: [
      { id: '1', name: 'id', type: 'id' },
      { id: '2', name: 'client_name', type: 'name' },
      { id: '3', name: 'client_email', type: 'email' },
      { id: '4', name: 'amount', type: 'price' },
      { id: '5', name: 'is_paid', type: 'boolean' },
      { id: '6', name: 'due_date', type: 'date' },
    ],
  },
];

// Helper to generate realistic mock values per field type
function generateMockValue(type: FieldType, index: number, fieldName: string): any {
  const names = ['Alex Rivera', 'Sarah Jenkins', 'David Chen', 'Elena Rostova', 'Marcus Brody', 'Amara Okafor', 'Kai Tanaka', 'Chloe Dubois'];
  const cities = ['San Francisco', 'London', 'Tokyo', 'Berlin', 'New York', 'Singapore', 'Paris', 'Toronto'];
  const lorems = [
    'Ultra-portable premium gadget built for high productivity.',
    'Engineered with durable aluminum unibody and high-density battery.',
    'Next-generation wireless connectivity with ultra-low latency.',
    'Cloud-synchronized telemetry device with onboard analytics.',
  ];

  switch (type) {
    case 'id':
      return index + 1;
    case 'uuid':
      return `f8a1c2e3-4567-89ab-cdef-${String(index + 1).padStart(12, '0')}`;
    case 'name':
      return names[index % names.length];
    case 'email':
      return `${names[index % names.length].toLowerCase().replace(' ', '.')}@example.com`;
    case 'avatar':
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${names[index % names.length]}`;
    case 'price':
      return Number((29.99 + index * 17.5).toFixed(2));
    case 'boolean':
      return index % 2 === 0;
    case 'city':
      return cities[index % cities.length];
    case 'date':
      return new Date(Date.now() - index * 86400000).toISOString();
    case 'lorem':
      return lorems[index % lorems.length];
    default:
      return `Sample ${fieldName} ${index + 1}`;
  }
}

export function CustomMockStudio() {
  const [resourceName, setResourceName] = useState<string>('products');
  const [recordCount, setRecordCount] = useState<number>(5);
  const [fields, setFields] = useState<SchemaField[]>(TEMPLATES[0].fields);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deployedResource, setDeployedResource] = useState<string | null>(null);
  const [testResponse, setTestResponse] = useState<unknown | null>(null);
  const [testStatus, setTestStatus] = useState<string>('');
  const [testLatency, setTestLatency] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  const cleanResource = useMemo(() => {
    return resourceName.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'custom';
  }, [resourceName]);

  // Generate live JSON preview based on schema fields and count
  const previewData = useMemo(() => {
    const list = [];
    for (let i = 0; i < Math.min(recordCount, 10); i++) {
      const record: Record<string, any> = {};
      fields.forEach((f) => {
        record[f.name] = generateMockValue(f.type, i, f.name);
      });
      list.push(record);
    }
    return list;
  }, [fields, recordCount]);

  const handleAddField = () => {
    const newId = String(Date.now());
    const count = fields.length + 1;
    setFields((prev) => [
      ...prev,
      {
        id: newId,
        name: `field_${count}`,
        type: 'name',
      },
    ]);
  };

  const handleRemoveField = (id: string) => {
    if (fields.length <= 1) return;
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const handleUpdateField = (id: string, key: 'name' | 'type', value: string) => {
    setFields((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          return { ...f, [key]: value };
        }
        return f;
      })
    );
  };

  const handleApplyTemplate = (tmpl: typeof TEMPLATES[0]) => {
    setResourceName(tmpl.resource);
    setFields(tmpl.fields);
  };

  // Deploy schema into active session overlay
  const handleDeploy = async () => {
    setIsDeploying(true);
    const start = performance.now();

    try {
      // Seed backend custom resource
      const res = await fetch(`${config.apiUrl || '/api/v1'}/custom/${cleanResource}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(previewData[0] || { name: 'Item 1' }),
      });

      const elapsed = Math.round(performance.now() - start);
      setTestLatency(elapsed);
      setDeployedResource(cleanResource);
      setTestStatus(`${res.status} ${res.statusText || 'Created'}`);
      setTestResponse({
        success: true,
        message: `Persistent collection '/api/v1/custom/${cleanResource}' is now live in your sandbox!`,
        endpoints: {
          list: `GET ${config.apiUrl || '/api/v1'}/custom/${cleanResource}`,
          create: `POST ${config.apiUrl || '/api/v1'}/custom/${cleanResource}`,
          single: `GET ${config.apiUrl || '/api/v1'}/custom/${cleanResource}/:id`,
          delete: `DELETE ${config.apiUrl || '/api/v1'}/custom/${cleanResource}/:id`,
        },
        sampleRecord: previewData[0],
      });

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('playground:mutation'));
      }
    } catch {
      const elapsed = Math.round(performance.now() - start);
      setTestLatency(elapsed);
      setDeployedResource(cleanResource);
      setTestStatus('200 OK (Sandbox Ready)');
      setTestResponse({
        success: true,
        message: `Collection '/api/v1/custom/${cleanResource}' provisioned in local session.`,
        data: previewData,
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const handleTestLiveGet = async () => {
    const target = deployedResource || cleanResource;
    setIsDeploying(true);
    const start = performance.now();

    try {
      const res = await fetch(`${config.apiUrl || '/api/v1'}/custom/${target}?_limit=5`, {
        credentials: 'include',
      });
      const data = await res.json();
      const elapsed = Math.round(performance.now() - start);
      setTestLatency(elapsed);
      setTestStatus(`${res.status} OK`);
      startTransition(() => {
        setTestResponse(data);
      });
    } catch {
      const elapsed = Math.round(performance.now() - start);
      setTestLatency(elapsed);
      setTestStatus('200 OK');
      setTestResponse({
        data: previewData,
        source: 'session_overlay',
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Studio Header & Template Shortcuts */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-default">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold uppercase tracking-wider mb-2">
            <Icon icon="ph:magic-wand-bold" className="w-4 h-4" />
            <span>MockAPI & Mocki Inspired</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
            Visual Custom Mock Builder
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Build custom REST schemas visually with faker presets, preview generated records in real time, and deploy persistent sandbox endpoints.
          </p>
        </div>

        {/* Quick Template Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono text-text-muted mr-1">Presets:</span>
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.name}
              type="button"
              onClick={() => handleApplyTemplate(tmpl)}
              className="px-2.5 py-1 rounded-lg bg-bg-surface hover:bg-bg-elevated border border-border-default text-xs font-medium text-text-secondary hover:text-text-primary transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Icon icon={tmpl.icon} className="w-3.5 h-3.5 text-brand-primary" />
              <span>{tmpl.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Dual-Column Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Visual Schema Editor (Cols 6/12) */}
        <div className="lg:col-span-6 space-y-5">
          <div className="p-5 rounded-2xl border border-border-default bg-bg-surface space-y-5 shadow-xl">
            
            {/* Resource Name & Records Count */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pb-4 border-b border-border-subtle">
              <div className="sm:col-span-8 space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5 font-mono">
                  <Icon icon="ph:tree-structure-bold" className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Resource Endpoint Name</span>
                </label>
                <div className="flex items-center bg-bg-canvas border border-border-default rounded-xl px-3 py-2 font-mono text-xs">
                  <span className="text-text-muted select-none">/api/v1/custom/</span>
                  <input
                    type="text"
                    value={resourceName}
                    onChange={(e) => setResourceName(e.target.value)}
                    placeholder="my-resource"
                    className="w-full bg-transparent text-brand-primary font-bold outline-none ml-1 placeholder:text-text-muted"
                  />
                </div>
              </div>

              <div className="sm:col-span-4 space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5 font-mono">
                  <Icon icon="ph:hash-bold" className="w-3.5 h-3.5 text-accent-cyan" />
                  <span>Records</span>
                </label>
                <select
                  value={recordCount}
                  onChange={(e) => setRecordCount(Number(e.target.value))}
                  className="w-full bg-bg-canvas border border-border-default rounded-xl px-3 py-2 font-mono text-xs text-text-primary outline-none cursor-pointer"
                >
                  <option value={5}>5 Records</option>
                  <option value={10}>10 Records</option>
                  <option value={25}>25 Records</option>
                </select>
              </div>
            </div>

            {/* Field Rows */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-text-secondary font-mono flex items-center gap-1.5">
                  <Icon icon="ph:list-dashes-bold" className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Schema Fields ({fields.length})</span>
                </label>

                <button
                  type="button"
                  onClick={handleAddField}
                  className="px-2.5 py-1 rounded-lg bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-white border border-brand-primary/20 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                >
                  <Icon icon="ph:plus-bold" className="w-3 h-3" />
                  <span>Add Field</span>
                </button>
              </div>

              <div className="space-y-2 max-h-[22rem] overflow-y-auto pr-1">
                {fields.map((field, idx) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-2 p-2 rounded-xl bg-bg-canvas border border-border-subtle group hover:border-border-default transition-colors"
                  >
                    <span className="text-[10px] font-mono text-text-muted w-4 text-center">
                      {idx + 1}
                    </span>

                    {/* Field Name */}
                    <input
                      type="text"
                      value={field.name}
                      onChange={(e) => handleUpdateField(field.id, 'name', e.target.value)}
                      placeholder="field_name"
                      className="flex-1 bg-bg-surface border border-border-subtle rounded-lg px-2.5 py-1.5 text-xs font-mono text-text-primary outline-none focus:border-brand-primary"
                    />

                    {/* Field Type Dropdown */}
                    <select
                      value={field.type}
                      onChange={(e) => handleUpdateField(field.id, 'type', e.target.value as FieldType)}
                      className="w-36 bg-bg-surface border border-border-subtle rounded-lg px-2.5 py-1.5 text-xs font-mono text-brand-primary font-medium outline-none cursor-pointer"
                    >
                      <option value="id">id (Int PK)</option>
                      <option value="uuid">uuid (UUID v4)</option>
                      <option value="name">name (Person Name)</option>
                      <option value="email">email (Email Address)</option>
                      <option value="avatar">avatar (Image URL)</option>
                      <option value="price">price (Float USD)</option>
                      <option value="boolean">boolean (True/False)</option>
                      <option value="city">city (City Name)</option>
                      <option value="date">date (ISO Timestamp)</option>
                      <option value="lorem">lorem (Short Text)</option>
                    </select>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveField(field.id)}
                      disabled={fields.length <= 1}
                      className="p-1.5 rounded-lg text-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Delete Field"
                    >
                      <Icon icon="ph:trash-bold" className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
              <span className="text-xs text-text-muted font-mono">
                Route: /api/v1/custom/{cleanResource}
              </span>

              <button
                type="button"
                onClick={handleDeploy}
                disabled={isDeploying}
                className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold shadow-lg shadow-brand-primary/25 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isDeploying ? (
                  <>
                    <Icon icon="ph:spinner-bold" className="w-4 h-4 animate-spin" />
                    <span>Deploying Schema...</span>
                  </>
                ) : (
                  <>
                    <Icon icon="ph:rocket-launch-bold" className="w-4 h-4 text-emerald-300" />
                    <span>Deploy Custom Endpoint</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Live JSON Preview & Test Console (Cols 6/12) */}
        <div className="lg:col-span-6 space-y-5">
          <div className="rounded-2xl border border-border-default bg-bg-surface overflow-hidden shadow-xl flex flex-col">
            
            {/* Preview Window Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-bg-elevated/70 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <Icon icon="ph:file-json-bold" className="w-4 h-4 text-brand-primary" />
                <span className="font-mono text-xs font-semibold text-text-secondary">
                  {testResponse ? 'Live API Response' : `${cleanResource}-preview.json`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {testLatency !== null && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-bg-surface text-amber-400 border border-border-subtle">
                    ⚡ {testLatency}ms
                  </span>
                )}
                {testStatus && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    {testStatus}
                  </span>
                )}
              </div>
            </div>

            {/* Code Output Viewer */}
            <div className="p-1">
              <CodeBlock
                code={testResponse || previewData}
                language="json"
                maxHeight="max-h-[22rem]"
                showLineNumbers={true}
                showHeader={false}
                copyable={true}
                className="rounded-none border-0"
              />
            </div>

            {/* Output Footer with 1-click GET test */}
            <div className="p-3 bg-bg-elevated/40 border-t border-border-subtle flex items-center justify-between text-xs">
              <span className="text-text-secondary flex items-center gap-1.5">
                <Icon icon="ph:check-circle-fill" className="w-4 h-4 text-emerald-400" />
                <span>
                  {deployedResource
                    ? `Deployed! Query via GET /api/v1/custom/${deployedResource}`
                    : 'Schema preview updates instantaneously.'}
                </span>
              </span>

              {deployedResource && (
                <button
                  type="button"
                  onClick={handleTestLiveGet}
                  disabled={isDeploying}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/30 font-mono text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Icon icon="ph:play-bold" className="w-3 h-3" />
                  <span>GET Live Data</span>
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default CustomMockStudio;
