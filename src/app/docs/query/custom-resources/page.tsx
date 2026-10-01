'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface CollectionSummary {
  name: string;
  endpoint: string;
  count: number;
  lastUpdated?: string;
}

interface SchemaRule {
  type: 'string' | 'number' | 'boolean' | 'email' | 'array';
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  enum?: string[];
}

interface SchemaInfo {
  collection: string;
  hasCustomSchema: boolean;
  schema: Record<string, SchemaRule>;
  strict: boolean;
  inferredSchema?: Record<string, { type: string; sample: unknown }>;
  updatedAt?: string;
}

interface NewCollectionField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'email' | 'array';
  required: boolean;
}

type StudioTab = 'grid' | 'api' | 'schema' | 'import' | 'recipes';
type CrudAction = 'create' | 'list' | 'expand' | 'get-one' | 'update' | 'delete' | 'schema-get' | 'directory';

const STARTER_BLUEPRINTS: Record<string, { label: string; icon: string; defaultName: string; fields: NewCollectionField[] }> = {
  tickets: {
    label: 'Issue Tracker (Tickets)',
    icon: 'ph:ticket-bold',
    defaultName: 'tickets',
    fields: [
      { name: 'title', type: 'string', required: true },
      { name: 'priority', type: 'string', required: false },
      { name: 'status', type: 'string', required: true },
      { name: 'assignedTo', type: 'email', required: false }
    ]
  },
  inventory: {
    label: 'Products & Inventory',
    icon: 'ph:shopping-bag-bold',
    defaultName: 'products',
    fields: [
      { name: 'name', type: 'string', required: true },
      { name: 'price', type: 'number', required: true },
      { name: 'category', type: 'string', required: false },
      { name: 'stock', type: 'number', required: false }
    ]
  },
  employees: {
    label: 'Employee Directory',
    icon: 'ph:user-circle-gear-bold',
    defaultName: 'employees',
    fields: [
      { name: 'fullName', type: 'string', required: true },
      { name: 'email', type: 'email', required: true },
      { name: 'department', type: 'string', required: false },
      { name: 'active', type: 'boolean', required: false }
    ]
  },
  custom: {
    label: 'Custom Schema',
    icon: 'ph:faders-bold',
    defaultName: 'my_collection',
    fields: [
      { name: 'title', type: 'string', required: true },
      { name: 'status', type: 'string', required: false },
      { name: 'score', type: 'number', required: false }
    ]
  }
};

function generateSampleRowsForFields(fields: NewCollectionField[], collectionName: string, count = 3) {
  const rows: Record<string, any>[] = [];
  for (let i = 1; i <= count; i++) {
    const row: Record<string, any> = {};
    for (const f of fields) {
      if (!f.name || !f.name.trim()) continue;
      const key = f.name.trim();
      const lower = key.toLowerCase();

      if (f.type === 'number') {
        if (lower.includes('price') || lower.includes('cost') || lower.includes('amount')) {
          row[key] = Number((29.99 * i).toFixed(2));
        } else if (lower.includes('stock') || lower.includes('qty') || lower.includes('quantity')) {
          row[key] = 10 * i;
        } else {
          row[key] = i * 10;
        }
      } else if (f.type === 'boolean') {
        row[key] = i % 2 !== 0;
      } else if (f.type === 'email') {
        row[key] = `user${i}@example.com`;
      } else {
        // String
        if (lower.includes('status')) {
          row[key] = ['Open', 'In Progress', 'Resolved'][i - 1] || 'Active';
        } else if (lower.includes('priority')) {
          row[key] = ['High', 'Medium', 'Low'][i - 1] || 'Normal';
        } else if (lower.includes('category') || lower.includes('dept') || lower.includes('department')) {
          row[key] = ['Engineering', 'Design', 'Marketing'][i - 1] || 'General';
        } else if (lower.includes('title')) {
          row[key] = `${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)} Task #${i}`;
        } else if (lower.includes('name')) {
          row[key] = `${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)} Item #${i}`;
        } else {
          row[key] = `Sample ${key} ${i}`;
        }
      }
    }
    rows.push(row);
  }
  return rows;
}

export default function CustomResourcesPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  // 1. Studio State
  const [activeTab, setActiveTab] = useState<StudioTab>('grid');
  const [collections, setCollections] = useState<CollectionSummary[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('products');

  // 2. New Collection Modal State
  const [showNewCollectionModal, setShowNewCollectionModal] = useState<boolean>(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState<string>('tickets');
  const [newCollectionInput, setNewCollectionInput] = useState<string>('tickets');
  const [newCollectionFields, setNewCollectionFields] = useState<NewCollectionField[]>(STARTER_BLUEPRINTS.tickets.fields);
  const [newCollectionSeedSample, setNewCollectionSeedSample] = useState<boolean>(true);
  const [newCollectionEnforceSchema, setNewCollectionEnforceSchema] = useState<boolean>(false);
  const [creatingCollection, setCreatingCollection] = useState<boolean>(false);

  // 3. Data Grid State
  const [records, setRecords] = useState<Record<string, any>[]>([]);
  const [recordsLoading, setRecordsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandRelations, setExpandRelations] = useState<boolean>(true);
  const [selectedRecord, setSelectedRecord] = useState<Record<string, any> | null>(null);
  const [recordModalMode, setRecordModalMode] = useState<'create' | 'view' | null>(null);
  const [recordJsonInput, setRecordJsonInput] = useState<string>('');
  const [modalError, setModalError] = useState<{ message: string; details?: any[] } | null>(null);

  // 4. Schema State
  const [schemaInfo, setSchemaInfo] = useState<SchemaInfo | null>(null);
  const [schemaLoading, setSchemaLoading] = useState<boolean>(false);
  const [simulatedError, setSimulatedError] = useState<any | null>(null);

  // 5. API Runner State
  const [activeAction, setActiveAction] = useState<CrudAction>('list');

  // 6. Bulk Import State
  const [csvTextInput, setCsvTextInput] = useState<string>('title,priority,status,assignedTo\nFix login crash,High,Open,dev@example.com\nDesign header banner,Medium,In Progress,designer@example.com');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [seedingTemplate, setSeedingTemplate] = useState<string | null>(null);

  const cleanCollection = useMemo(() => {
    return selectedCollection.toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'products';
  }, [selectedCollection]);

  // -------------------------------------------------------------
  // Data Fetching
  // -------------------------------------------------------------
  const fetchCollections = useCallback(async () => {
    try {
      const res = await fetch(`${config.apiUrl}/custom`, { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        const list: CollectionSummary[] = json.collections || [];
        setCollections(prev => {
          const map = new Map<string, CollectionSummary>();
          prev.forEach(c => map.set(c.name, c));
          list.forEach(c => map.set(c.name, c));
          return Array.from(map.values());
        });
      }
    } catch {
      // Fallback
    }
  }, []);

  const fetchRecords = useCallback(async () => {
    setRecordsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('q', searchQuery.trim());
      if (expandRelations) {
        params.set('_expand', 'product,products,contact,contacts,subscription,subscriptions,patient,patients,user,users');
        params.set('_embed', 'orders,leads,invoices,appointments');
      }

      const qs = params.toString();
      const url = `${config.apiUrl}/custom/${cleanCollection}${qs ? `?${qs}` : ''}`;
      const res = await fetch(url, { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        setRecords(json.data || json || []);
      }
    } catch {
      setRecords([]);
    } finally {
      setRecordsLoading(false);
    }
  }, [cleanCollection, searchQuery, expandRelations]);

  const fetchSchema = useCallback(async () => {
    setSchemaLoading(true);
    try {
      const res = await fetch(`${config.apiUrl}/custom/${cleanCollection}/schema`, { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        setSchemaInfo(json);
      }
    } catch {
      setSchemaInfo(null);
    } finally {
      setSchemaLoading(false);
    }
  }, [cleanCollection]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  useEffect(() => {
    fetchRecords();
    fetchSchema();
  }, [cleanCollection, fetchRecords, fetchSchema]);

  // -------------------------------------------------------------
  // Dynamic Schema & Columns Resolution
  // -------------------------------------------------------------
  const currentCollectionFields = useMemo(() => {
    const fields = new Map<string, { type: string; sample?: unknown; required?: boolean }>();

    // 1. From registered schema
    if (schemaInfo?.hasCustomSchema && schemaInfo.schema) {
      for (const [k, v] of Object.entries(schemaInfo.schema)) {
        fields.set(k, { type: v.type, required: v.required });
      }
    }

    // 2. From inferred schema
    if (schemaInfo?.inferredSchema) {
      for (const [k, v] of Object.entries(schemaInfo.inferredSchema)) {
        if (!fields.has(k)) fields.set(k, { type: v.type, sample: v.sample });
      }
    }

    // 3. From actual existing records
    if (records && records.length > 0) {
      for (const r of records.slice(0, 5)) {
        for (const [k, v] of Object.entries(r)) {
          if (!k.startsWith('_') && k !== 'id' && k !== 'createdAt' && k !== 'updatedAt') {
            if (!fields.has(k)) {
              let detectedType: 'string' | 'number' | 'boolean' | 'email' | 'array' = 'string';
              if (Array.isArray(v)) detectedType = 'array';
              else if (typeof v === 'number') detectedType = 'number';
              else if (typeof v === 'boolean') detectedType = 'boolean';
              else if (typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) detectedType = 'email';
              else detectedType = 'string';
              fields.set(k, { type: detectedType, sample: v });
            }
          }
        }
      }
    }

    if (fields.size === 0) {
      fields.set('title', { type: 'string', sample: `${cleanCollection} sample item`, required: true });
      fields.set('status', { type: 'string', sample: 'Active', required: false });
    }

    return Array.from(fields.entries()).map(([name, info]) => ({ name, ...info }));
  }, [schemaInfo, records, cleanCollection]);

  // All known collections (merging backend results with current active selection)
  const allKnownCollections = useMemo(() => {
    const map = new Map<string, { name: string; count: number }>();
    collections.forEach(c => map.set(c.name, { name: c.name, count: c.count }));
    if (cleanCollection) {
      const existing = map.get(cleanCollection);
      const count = records.length || existing?.count || 0;
      map.set(cleanCollection, { name: cleanCollection, count });
    }
    return Array.from(map.values());
  }, [collections, cleanCollection, records.length]);

  // Derive dynamic table columns from records or fields
  const dynamicColumns = useMemo(() => {
    if (currentCollectionFields && currentCollectionFields.length > 0) {
      return currentCollectionFields.map(f => f.name).slice(0, 5);
    }
    return ['title', 'status', 'createdAt'];
  }, [currentCollectionFields]);

  // Construct dynamic payload template for CREATE
  const defaultCreatePayload = useMemo(() => {
    const obj: Record<string, any> = {};
    for (const f of currentCollectionFields) {
      if (f.type === 'number') {
        obj[f.name] = typeof f.sample === 'number' ? f.sample : 49.99;
      } else if (f.type === 'boolean') {
        obj[f.name] = typeof f.sample === 'boolean' ? f.sample : true;
      } else if (f.type === 'email') {
        obj[f.name] = (typeof f.sample === 'string' && f.sample.includes('@')) ? f.sample : 'developer@example.com';
      } else {
        obj[f.name] = f.sample ? String(f.sample) : `${cleanCollection} ${f.name}`;
      }
    }
    return JSON.stringify(obj, null, 2);
  }, [currentCollectionFields, cleanCollection]);

  // -------------------------------------------------------------
  // Actions: New Collection, Seed, Purge, Create, Delete
  // -------------------------------------------------------------
  const handleSelectBlueprint = (key: string) => {
    setSelectedBlueprint(key);
    const bp = STARTER_BLUEPRINTS[key];
    if (bp) {
      setNewCollectionInput(bp.defaultName);
      setNewCollectionFields([...bp.fields]);
    }
  };

  const handleAddFieldToNewCollection = () => {
    setNewCollectionFields(prev => [...prev, { name: `field_${prev.length + 1}`, type: 'string', required: false }]);
  };

  const handleRemoveFieldFromNewCollection = (index: number) => {
    setNewCollectionFields(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateNewCollectionField = (index: number, patch: Partial<NewCollectionField>) => {
    setNewCollectionFields(prev => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  };

  const handleCreateNewCollection = async () => {
    const clean = newCollectionInput.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!clean) {
      alert('Please enter a valid alphanumeric collection name.');
      return;
    }

    setCreatingCollection(true);
    try {
      // 1. Always register column schema definition if fields are defined
      if (newCollectionFields.length > 0) {
        const schemaRules: Record<string, SchemaRule> = {};
        for (const f of newCollectionFields) {
          if (!f.name.trim()) continue;
          schemaRules[f.name.trim()] = {
            type: f.type,
            required: f.required
          };
        }
        await fetch(`${config.apiUrl}/custom/${clean}/schema`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ schema: schemaRules, strict: newCollectionEnforceSchema }),
          credentials: 'include'
        });
      }

      // 2. If seed samples is requested, generate 3 rows and import
      let seededCount = 0;
      if (newCollectionSeedSample && newCollectionFields.length > 0) {
        const sampleRows = generateSampleRowsForFields(newCollectionFields, clean, 3);
        seededCount = sampleRows.length;
        await fetch(`${config.apiUrl}/custom/${clean}/import`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sampleRows),
          credentials: 'include'
        });
      }

      // 3. Optimistically add to collections state so it immediately appears in dropdown
      setCollections(prev => {
        const existing = prev.filter(c => c.name !== clean);
        return [{ name: clean, endpoint: `/custom/${clean}`, count: seededCount }, ...existing];
      });

      setSelectedCollection(clean);
      setShowNewCollectionModal(false);
      await fetchCollections();
      await fetchRecords();
      await fetchSchema();
    } catch (err) {
      console.error('Failed to create collection', err);
    } finally {
      setCreatingCollection(false);
    }
  };

  const handleSeedTemplate = async (templateName: string) => {
    setSeedingTemplate(templateName);
    try {
      const res = await fetch(`${config.apiUrl}/custom/seed?template=${templateName}`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.collections && data.collections.length > 0) {
        setSelectedCollection(data.collections[0]);
      }
      await fetchCollections();
      await fetchRecords();
      await fetchSchema();
    } catch (err) {
      console.error('Failed to seed template', err);
    } finally {
      setSeedingTemplate(null);
    }
  };

  const handlePurgeCollection = async () => {
    if (!window.confirm(`Are you sure you want to purge all records in '/custom/${cleanCollection}'?`)) return;
    try {
      await fetch(`${config.apiUrl}/custom/${cleanCollection}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      await fetchCollections();
      await fetchRecords();
      await fetchSchema();
    } catch (err) {
      console.error('Failed to purge collection', err);
    }
  };

  const handleDeleteRecord = async (id: string | number) => {
    try {
      await fetch(`${config.apiUrl}/custom/${cleanCollection}/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      setRecords(prev => prev.filter(r => r.id !== id));
      await fetchCollections();
    } catch (err) {
      console.error('Failed to delete record', err);
    }
  };

  const openAddRecordModal = () => {
    setModalError(null);
    setRecordJsonInput(defaultCreatePayload);
    setRecordModalMode('create');
  };

  const handleCreateRecord = async () => {
    setModalError(null);
    try {
      let parsed = {};
      try {
        parsed = JSON.parse(recordJsonInput);
      } catch {
        setModalError({ message: 'Invalid JSON syntax. Please check for missing quotes or commas.' });
        return;
      }

      const res = await fetch(`${config.apiUrl}/custom/${cleanCollection}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
        credentials: 'include'
      });

      const data = await res.json();
      if (!res.ok) {
        setModalError({
          message: data.message || data.error || `Creation failed with status ${res.status}`,
          details: Array.isArray(data.details) ? data.details : []
        });
        return;
      }

      setRecordModalMode(null);
      await fetchRecords();
      await fetchCollections();
    } catch (err) {
      setModalError({ message: `Network error: ${err}` });
    }
  };

  const handleSaveSchema = async (newSchema: Record<string, SchemaRule>, isStrict: boolean) => {
    try {
      await fetch(`${config.apiUrl}/custom/${cleanCollection}/schema`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schema: newSchema, strict: isStrict }),
        credentials: 'include'
      });
      await fetchSchema();
    } catch (err) {
      console.error('Failed to save schema', err);
    }
  };

  const handleDeleteSchema = async () => {
    try {
      await fetch(`${config.apiUrl}/custom/${cleanCollection}/schema`, {
        method: 'DELETE',
        credentials: 'include'
      });
      await fetchSchema();
    } catch (err) {
      console.error('Failed to delete schema', err);
    }
  };

  const handleRunValidationTest = async () => {
    try {
      const res = await fetch(`${config.apiUrl}/custom/${cleanCollection}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invalidTestPrice: -999, missingRequiredField: true }),
        credentials: 'include'
      });
      const data = await res.json();
      setSimulatedError({ status: res.status, data });
    } catch (err) {
      setSimulatedError({ status: 500, error: String(err) });
    }
  };

  const handleMockGenerator = async () => {
    try {
      const sampleMockRows = generateSampleRowsForFields(
        currentCollectionFields.map(f => ({ name: f.name, type: (f.type as any) || 'string', required: false })),
        cleanCollection,
        5
      );

      const res = await fetch(`${config.apiUrl}/custom/${cleanCollection}/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sampleMockRows),
        credentials: 'include'
      });
      const data = await res.json();
      setImportStatus(`Successfully imported ${data.totalImported || 5} mock records matching this collection's columns!`);
      await fetchRecords();
      await fetchCollections();
    } catch (err) {
      setImportStatus(`Import failed: ${err}`);
    }
  };

  const handleCsvTextImport = async () => {
    try {
      const res = await fetch(`${config.apiUrl}/custom/${cleanCollection}/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/csv' },
        body: csvTextInput,
        credentials: 'include'
      });
      const data = await res.json();
      setImportStatus(`CSV import completed: ${data.totalImported || 0} records.`);
      await fetchRecords();
      await fetchCollections();
    } catch (err) {
      setImportStatus(`CSV import error: ${err}`);
    }
  };

  // -------------------------------------------------------------
  // Dynamic API Runner Config
  // -------------------------------------------------------------
  const actionConfigs: Record<CrudAction, {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    endpoint: string;
    title: string;
    description: string;
    body?: string;
  }> = {
    create: {
      method: 'POST',
      endpoint: `/custom/${cleanCollection}`,
      title: `Create Record in /custom/${cleanCollection}`,
      description: 'Auto-provisions the collection and populates matching fields for this schema.',
      body: defaultCreatePayload
    },
    list: {
      method: 'GET',
      endpoint: `/custom/${cleanCollection}?_sort=${currentCollectionFields[0]?.name || 'id'}&_order=desc`,
      title: `Query /custom/${cleanCollection}`,
      description: 'Lists all records with full support for filtering, sorting, pagination, and full-text search.'
    },
    expand: {
      method: 'GET',
      endpoint: `/custom/${cleanCollection}?_expand=product,contact,subscription,patient&_embed=orders`,
      title: `Relational Joins with ?_expand= & ?_embed=`,
      description: 'Expands foreign keys into parent objects or embeds child collection arrays automatically.'
    },
    'get-one': {
      method: 'GET',
      endpoint: `/custom/${cleanCollection}/${records[0]?.id || '1'}`,
      title: `Retrieve Single Item /custom/${cleanCollection}/:id`,
      description: 'Fetches a single record by its assigned ID.'
    },
    update: {
      method: 'PUT',
      endpoint: `/custom/${cleanCollection}/${records[0]?.id || '1'}`,
      title: `Update Record /custom/${cleanCollection}/:id`,
      description: 'Modifies attributes of an existing record within your active session sandbox overlay.',
      body: defaultCreatePayload
    },
    delete: {
      method: 'DELETE',
      endpoint: `/custom/${cleanCollection}/${records[0]?.id || '1'}`,
      title: `Delete Record /custom/${cleanCollection}/:id`,
      description: 'Removes the record from your custom collection.'
    },
    'schema-get': {
      method: 'GET',
      endpoint: `/custom/${cleanCollection}/schema`,
      title: `Inspect Collection Schema & Rules`,
      description: 'Returns defined validation rules or auto-inferred data types for the collection.'
    },
    directory: {
      method: 'GET',
      endpoint: '/custom',
      title: 'List Active Custom Collections Directory',
      description: 'Returns an index of all custom collections currently active in your visitor session.'
    }
  };

  const currentActionConfig = actionConfigs[activeAction];

  return (
    <div className="space-y-12 w-full text-slate-900 pb-16">
      {/* 1. Header & Quick Metrics */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:table-bold" className="w-3.5 h-3.5" />
          <span>Custom Collections Studio</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Custom Collections &amp; Dynamic Schemas
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-4xl">
          Instantly provision arbitrary database tables on the fly without writing backend schemas, database migrations, or ORM models.
          Define your custom columns, expand relational joins (<code className="font-mono text-indigo-600 font-semibold">?_expand=</code>), test optional 422 contract validation, and bulk import spreadsheets.
        </p>

        {/* High-Level Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Active Collections</span>
            <p className="text-2xl font-extrabold text-slate-900">{collections.length}</p>
            <span className="text-[11px] text-indigo-600 font-semibold">In Visitor Sandbox</span>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Selected Collection</span>
            <p className="text-2xl font-extrabold text-indigo-600 truncate font-mono">/{cleanCollection}</p>
            <span className="text-[11px] text-slate-500 font-medium">{records.length} records active</span>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Schema Status</span>
            <p className="text-2xl font-extrabold text-slate-900">
              {schemaInfo?.hasCustomSchema ? (
                <span className="text-emerald-600 flex items-center gap-1 text-lg">
                  <Icon icon="ph:shield-check-fill" className="w-5 h-5" /> Enforced
                </span>
              ) : (
                <span className="text-amber-600 flex items-center gap-1 text-lg">
                  <Icon icon="ph:shield-warning-bold" className="w-5 h-5" /> Schemaless
                </span>
              )}
            </p>
            <span className="text-[11px] text-slate-500 font-medium">
              {schemaInfo?.hasCustomSchema ? `${Object.keys(schemaInfo.schema).length} rules active` : 'Flexible NoSQL mode'}
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Relational Joins</span>
            <p className="text-2xl font-extrabold text-emerald-600">_expand</p>
            <span className="text-[11px] text-emerald-700 font-semibold">Foreign Key Linking</span>
          </div>
        </div>
      </div>

      {/* 2. Collection Studio Toolbar */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Collection Selector & Creator */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Icon icon="ph:folder-open-bold" className="w-4 h-4 text-indigo-600" />
              Target Collection:
            </span>

            <div className="relative">
              <select
                value={cleanCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                className="pl-3 pr-8 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors"
              >
                {allKnownCollections.map(c => (
                  <option key={c.name} value={c.name}>
                    /custom/{c.name} ({c.count} {c.count === 1 ? 'record' : 'records'})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                handleSelectBlueprint('tickets');
                setShowNewCollectionModal(true);
              }}
              className="px-3.5 py-1.5 rounded-xl border border-dashed border-indigo-400 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            >
              <Icon icon="ph:plus-circle-bold" className="w-4 h-4" />
              <span>Define New Collection &amp; Schema</span>
            </button>
          </div>

          {/* Quick Actions: Export & Purge */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`${config.apiUrl}/custom/${cleanCollection}.xlsx`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 cursor-pointer transition-colors"
            >
              <Icon icon="ph:file-xls-bold" className="w-4 h-4 text-emerald-600" />
              <span>Export .xlsx</span>
            </a>

            <a
              href={`${config.apiUrl}/custom/${cleanCollection}.csv`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 cursor-pointer transition-colors"
            >
              <Icon icon="ph:file-csv-bold" className="w-4 h-4 text-indigo-600" />
              <span>Export .csv</span>
            </a>

            <button
              type="button"
              onClick={handlePurgeCollection}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 cursor-pointer transition-colors"
            >
              <Icon icon="ph:trash-bold" className="w-3.5 h-3.5" />
              <span>Purge</span>
            </button>
          </div>
        </div>

        {/* Active Collection Columns Guidance Strip */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
            <Icon icon="ph:columns-bold" className="w-4 h-4 text-indigo-600" />
            <span>Active Collection Columns:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {currentCollectionFields.map(f => (
              <span
                key={f.name}
                className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 flex items-center gap-1.5"
              >
                <span className="font-bold text-slate-900">{f.name}</span>
                <span className="text-[10px] text-indigo-600 font-semibold px-1 rounded bg-indigo-50 border border-indigo-100">{f.type}</span>
                {f.required && (
                  <span className="text-[9px] text-amber-700 font-extrabold uppercase">*req</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* 1-Click Domain Seed Presets Bar */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Icon icon="ph:lightning-bold" className="w-4 h-4 text-amber-500" />
            <span>Multi-Collection Relational Presets:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ecommerce', label: 'E-Commerce (Products + Orders)', icon: 'ph:shopping-cart-bold' },
              { id: 'crm', label: 'CRM (Contacts + Leads)', icon: 'ph:users-three-bold' },
              { id: 'saas', label: 'SaaS (Subs + Invoices)', icon: 'ph:receipt-bold' },
              { id: 'healthcare', label: 'Healthcare (Patients + Appts)', icon: 'ph:first-aid-bold' }
            ].map(preset => (
              <button
                key={preset.id}
                type="button"
                disabled={seedingTemplate !== null}
                onClick={() => handleSeedTemplate(preset.id)}
                className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all border ${
                  seedingTemplate === preset.id
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Icon icon={preset.icon} className="w-3.5 h-3.5 text-indigo-600" />
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Studio Workspace Tabs */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          {[
            { id: 'grid', label: 'Visual Data Table', icon: 'ph:table-bold', badge: `${records.length}` },
            { id: 'api', label: 'Interactive API Runner', icon: 'ph:paper-plane-tilt-bold' },
            { id: 'schema', label: 'Schema & Validation', icon: 'ph:shield-check-bold', badge: schemaInfo?.hasCustomSchema ? 'Active' : undefined },
            { id: 'import', label: 'Bulk Import & Mock Generator', icon: 'ph:upload-simple-bold' },
            { id: 'recipes', label: 'Client Code Recipes', icon: 'ph:code-bold' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as StudioTab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Icon icon={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === tab.id ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: Visual Data Table */}
        {activeTab === 'grid' && (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden space-y-4">
            {/* Control Bar inside Table */}
            <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5 font-mono">
                  <Icon icon="ph:database-bold" className="w-4 h-4 text-indigo-600" />
                  /custom/{cleanCollection}
                </span>
                <span className="text-xs text-slate-500 font-medium">({records.length} records)</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Search Input */}
                <div className="flex items-center rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs">
                  <Icon icon="ph:magnifying-glass" className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search records..."
                    className="focus:outline-none w-36 text-slate-800"
                  />
                </div>

                {/* Relational Expansion Toggle */}
                <button
                  type="button"
                  onClick={() => setExpandRelations(!expandRelations)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    expandRelations
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                  }`}
                  title="Expand foreign keys (_expand=product) into nested objects"
                >
                  <Icon icon="ph:tree-structure-bold" className="w-3.5 h-3.5" />
                  <span>Expand Joins ({expandRelations ? 'ON' : 'OFF'})</span>
                </button>

                {/* Add Record Button */}
                <button
                  type="button"
                  onClick={openAddRecordModal}
                  className="px-3.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Icon icon="ph:plus-bold" className="w-3.5 h-3.5" />
                  <span>Add Record</span>
                </button>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              {recordsLoading ? (
                <div className="text-center py-20 text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Icon icon="ph:spinner-gap-bold" className="w-5 h-5 animate-spin text-indigo-600" />
                  <span>Loading collection records...</span>
                </div>
              ) : records.length > 0 ? (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase font-mono text-[10px] tracking-wider">
                      <th className="py-3 px-4">ID</th>
                      {dynamicColumns.map(col => (
                        <th key={col} className="py-3 px-4">{col}</th>
                      ))}
                      <th className="py-3 px-4">Created</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {records.map((row, idx) => (
                      <tr key={row.id || idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedRecord(row);
                              setRecordModalMode('view');
                            }}
                            className="hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>{String(row.id).slice(0, 14)}...</span>
                          </button>
                        </td>

                        {dynamicColumns.map(col => {
                          const val = row[col];
                          const isExpandedObject = typeof val === 'object' && val !== null;
                          return (
                            <td key={col} className="py-3 px-4">
                              {isExpandedObject ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[11px]">
                                  <Icon icon="ph:tree-structure-bold" className="w-3 h-3 text-emerald-600" />
                                  <span>{Array.isArray(val) ? `[${val.length} items]` : (val.name || val.title || val.id || 'Object')}</span>
                                </span>
                              ) : typeof val === 'boolean' ? (
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${val ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                  {val ? 'TRUE' : 'FALSE'}
                                </span>
                              ) : (
                                <span className="truncate max-w-[200px] block font-mono text-slate-700">
                                  {val !== undefined && val !== null ? String(val) : '—'}
                                </span>
                              )}
                            </td>
                          );
                        })}

                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {row.createdAt ? new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRecord(row);
                                setRecordModalMode('view');
                              }}
                              className="p-1 rounded hover:bg-slate-100 text-slate-600 hover:text-indigo-600 cursor-pointer"
                              title="View JSON"
                            >
                              <Icon icon="ph:eye-bold" className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRecord(row.id)}
                              className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                              title="Delete record"
                            >
                              <Icon icon="ph:trash-bold" className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-20 px-4 space-y-3">
                  <Icon icon="ph:database-thin" className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="text-sm font-semibold text-slate-700">No records found in '/custom/{cleanCollection}'</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Create your first record manually or generate mock test data using the 1-click generator below.
                  </p>
                  <div className="flex justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleMockGenerator}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Icon icon="ph:magic-wand-bold" className="w-3.5 h-3.5" />
                      <span>Spawn 5 Mock Records for this Schema</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Interactive API Runner */}
        {activeTab === 'api' && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-base text-slate-900">Custom Collection API Tester</h3>
                <p className="text-xs text-slate-500">Test every endpoint variation against /custom/{cleanCollection}:</p>
              </div>
              <code className="text-xs font-mono font-bold bg-slate-50 px-2 py-1 rounded border border-slate-200 text-indigo-600">
                {currentActionConfig.method} {currentActionConfig.endpoint}
              </code>
            </div>

            {/* Action Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { key: 'create', label: '1. POST Create', badge: 'POST' },
                  { key: 'list', label: '2. GET List & Sort', badge: 'GET' },
                  { key: 'expand', label: '3. GET _expand Joins', badge: 'JOIN' },
                  { key: 'get-one', label: '4. GET Single Item', badge: 'GET' },
                  { key: 'update', label: '5. PUT Update', badge: 'PUT' },
                  { key: 'delete', label: '6. DELETE Record', badge: 'DEL' },
                  { key: 'schema-get', label: '7. GET Schema', badge: 'RULES' },
                  { key: 'directory', label: '8. GET Directory', badge: 'DIR' }
                ] as const
              ).map(action => (
                <button
                  key={action.key}
                  type="button"
                  onClick={() => setActiveAction(action.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeAction === action.key
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <span>{action.label}</span>
                </button>
              ))}
            </div>

            {/* Live Interactive Console */}
            <div className="space-y-2">
              <InteractiveConsole
                key={`${cleanCollection}-${activeAction}`}
                initialMethod={currentActionConfig.method}
                initialEndpoint={currentActionConfig.endpoint}
                initialBody={currentActionConfig.body}
              />
            </div>
          </div>
        )}

        {/* TAB 3: Schema & Validation */}
        {activeTab === 'schema' && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Icon icon="ph:shield-check-bold" className="w-5 h-5 text-indigo-600" />
                  <span>Contract Validation Studio for /{cleanCollection}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Define field rules to trigger realistic <code className="font-mono text-indigo-600">422 Unprocessable Entity</code> errors for testing frontend form validation.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {schemaInfo?.hasCustomSchema ? (
                  <button
                    type="button"
                    onClick={handleDeleteSchema}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1 border border-rose-200 cursor-pointer"
                  >
                    <Icon icon="ph:trash-bold" className="w-3.5 h-3.5" />
                    <span>Clear Rules (Make Schemaless)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const rules: Record<string, SchemaRule> = {};
                      currentCollectionFields.forEach(f => {
                        rules[f.name] = { type: (f.type as any) || 'string', required: true };
                      });
                      handleSaveSchema(rules, false);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Icon icon="ph:shield-plus-bold" className="w-3.5 h-3.5" />
                    <span>Enforce Validation on Current Fields</span>
                  </button>
                )}
              </div>
            </div>

            {/* Schema Status Display */}
            {schemaLoading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading schema rules...</div>
            ) : schemaInfo?.hasCustomSchema ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold">
                    <Icon icon="ph:check-circle-fill" className="w-4 h-4 text-emerald-600" />
                    <span>Active Schema Validation Enforced</span>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-700">Strict Mode: {schemaInfo.strict ? 'ON' : 'OFF'}</span>
                </div>

                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-mono text-slate-500">
                      <tr>
                        <th className="p-3">Field</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Required</th>
                        <th className="p-3">Constraints</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {Object.entries(schemaInfo.schema).map(([field, rule]) => (
                        <tr key={field} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-900">{field}</td>
                          <td className="p-3 text-indigo-600 font-semibold">{rule.type}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rule.required ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'}`}>
                              {rule.required ? 'REQUIRED' : 'OPTIONAL'}
                            </span>
                          </td>
                          <td className="p-3 text-slate-600">
                            {rule.min !== undefined && `min: ${rule.min} `}
                            {rule.max !== undefined && `max: ${rule.max} `}
                            {rule.minLength !== undefined && `minLength: ${rule.minLength} `}
                            {rule.enum && `enum: [${rule.enum.join(', ')}]`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Icon icon="ph:info-bold" className="w-4 h-4 text-indigo-600" />
                  <span>Currently Schemaless (Flexible NoSQL Mode)</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Records in <code className="font-mono text-indigo-600">/custom/{cleanCollection}</code> accept arbitrary JSON keys without rejection.
                  Enable a schema above to test how your UI handles <strong>HTTP 422 Unprocessable Entity</strong> validation errors.
                </p>
                {schemaInfo?.inferredSchema && Object.keys(schemaInfo.inferredSchema).length > 0 && (
                  <div className="pt-2">
                    <span className="font-bold text-[11px] text-slate-500 uppercase tracking-wider block mb-1">
                      Auto-Inferred Field Types from Existing Records:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(schemaInfo.inferredSchema).map(([key, val]) => (
                        <span key={key} className="px-2 py-1 rounded bg-white border border-slate-200 font-mono text-[11px] text-slate-700">
                          <strong>{key}</strong>: <span className="text-indigo-600">{val.type}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Live 422 Error Simulator */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Icon icon="ph:bug-bold" className="w-4 h-4 text-rose-500" />
                  Live 422 Error Simulation Box
                </h4>
                <button
                  type="button"
                  onClick={handleRunValidationTest}
                  className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Icon icon="ph:play-bold" className="w-3 h-3" />
                  <span>Test Validation Failure</span>
                </button>
              </div>

              {simulatedError && (
                <div className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-1">
                    <span>Response Status: <strong className={simulatedError.status === 422 ? 'text-amber-400' : 'text-emerald-400'}>{simulatedError.status}</strong></span>
                    <span>Endpoint: POST /custom/{cleanCollection}</span>
                  </div>
                  <pre>{JSON.stringify(simulatedError.data || simulatedError, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: Bulk Import & Mock Generator */}
        {activeTab === 'import' && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Icon icon="ph:upload-simple-bold" className="w-5 h-5 text-indigo-600" />
                <span>Bulk Spreadsheet Import &amp; Mock Generator</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Bulk ingest datasets into <code className="font-mono text-indigo-600">/custom/{cleanCollection}</code> via CSV text, file upload, or generate 5 realistic records matching this collection&apos;s columns.
              </p>
            </div>

            {importStatus && (
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold text-xs flex items-center gap-2">
                <Icon icon="ph:info-fill" className="w-4 h-4 text-indigo-600" />
                <span>{importStatus}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Option 1: Mock Generator */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Icon icon="ph:magic-wand-bold" className="w-4 h-4 text-purple-600" />
                  1-Click Mock Record Spawner
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generate 5 realistic entities formatted specifically for the columns in <code className="font-mono text-purple-700">/{cleanCollection}</code>.
                </p>
                <button
                  type="button"
                  onClick={handleMockGenerator}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Icon icon="ph:sparkle-bold" className="w-4 h-4" />
                  <span>Spawn 5 Realistic Records</span>
                </button>
              </div>

              {/* Option 2: Raw CSV Paste */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Icon icon="ph:file-csv-bold" className="w-4 h-4 text-emerald-600" />
                  Paste Raw CSV Dataset
                </h4>
                <textarea
                  rows={4}
                  value={csvTextInput}
                  onChange={(e) => setCsvTextInput(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleCsvTextImport}
                  className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Icon icon="ph:upload-bold" className="w-4 h-4" />
                  <span>Import CSV Text</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Client Code Recipes */}
        {activeTab === 'recipes' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recipe 1: React Hook with Joins */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Icon icon="logos:react" className="w-4 h-4" />
                  React Hook with Relational Expansion
                </h3>
                <CodeBlock
                  language="typescript"
                  code={`// hooks/useCustomCollection.ts
import { useState, useEffect } from 'react';

export function useCustomCollection<T>(collection: string, expand?: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const qs = expand ? \`?_expand=\${expand}\` : '';
      const res = await fetch(\`https://playground.nileslabs.com/api/v1/custom/\${collection}\${qs}\`, {
        credentials: 'include'
      });
      const json = await res.json();
      setData(json.data || json || []);
      setLoading(false);
    }
    load();
  }, [collection, expand]);

  return { data, loading };
}`}
                />
              </div>

              {/* Recipe 2: Form Error Handling 422 */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Icon icon="logos:javascript" className="w-4 h-4" />
                  Handling 422 Contract Validation Errors
                </h3>
                <CodeBlock
                  language="javascript"
                  code={`// Submit custom entity with 422 handling
async function createCustomItem(payload) {
  const res = await fetch('https://playground.nileslabs.com/api/v1/custom/${cleanCollection}', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include'
  });

  const json = await res.json();

  if (res.status === 422) {
    // Structured validation details array from playground API:
    // json.details => [{ field: 'price', issue: 'Must be >= 0' }]
    console.error('Validation failed:', json.details);
    return { ok: false, errors: json.details };
  }

  return { ok: true, data: json };
}`}
                />
              </div>
            </div>

            {/* Terminal cURL Commands */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Icon icon="ph:terminal-window-bold" className="w-4 h-4 text-slate-700" />
                Terminal cURL Commands
              </h3>
              <CodeBlock
                language="bash"
                code={`# 1. Query collection items with sorting
curl -s "https://playground.nileslabs.com/api/v1/custom/${cleanCollection}?_sort=${currentCollectionFields[0]?.name || 'id'}&_order=desc" \\
  -H "Accept: application/json"

# 2. Insert new custom entity
curl -X POST "https://playground.nileslabs.com/api/v1/custom/${cleanCollection}" \\
  -H "Content-Type: application/json" \\
  -d '${defaultCreatePayload.replace(/\n/g, ' ')}'

# 3. Download collection as Excel spreadsheet
curl -O "https://playground.nileslabs.com/api/v1/custom/${cleanCollection}.xlsx"`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Record Inspection / Creation Modal */}
      {recordModalMode !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {recordModalMode === 'create' ? `Add Record to /custom/${cleanCollection}` : `View Record: ${selectedRecord?.id}`}
              </h3>
              <button
                type="button"
                onClick={() => setRecordModalMode(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <Icon icon="ph:x-bold" className="w-4 h-4" />
              </button>
            </div>

            {recordModalMode === 'create' ? (
              <div className="space-y-3">
                {/* Schema guidance chip */}
                {schemaInfo?.hasCustomSchema ? (
                  <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Icon icon="ph:shield-check-bold" className="w-4 h-4 text-amber-600" />
                      <span>
                        Schema Enforced: <strong>{Object.keys(schemaInfo.schema).join(', ')}</strong>
                        {schemaInfo.strict && ' (Strict Mode)'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        await handleDeleteSchema();
                        setModalError(null);
                      }}
                      className="text-[11px] underline font-bold text-amber-700 hover:text-amber-900 cursor-pointer"
                    >
                      Make Schemaless
                    </button>
                  </div>
                ) : (
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 text-[11px] flex items-center gap-1.5 font-mono">
                    <Icon icon="ph:sparkle-bold" className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Schemaless mode active (accepts any arbitrary JSON keys)</span>
                  </div>
                )}

                {/* Inline Error Alert */}
                {modalError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-rose-900">
                      <Icon icon="ph:warning-circle-bold" className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{modalError.message}</span>
                    </div>
                    {modalError.details && modalError.details.length > 0 && (
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-rose-700">
                        {modalError.details.map((d, i) => (
                          <li key={i}>
                            <strong>{d.field}</strong>: {d.issue}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">JSON Payload</label>
                <textarea
                  rows={8}
                  value={recordJsonInput}
                  onChange={(e) => {
                    setRecordJsonInput(e.target.value);
                    if (modalError) setModalError(null);
                  }}
                  className="w-full p-3 rounded-xl border border-slate-300 font-mono text-xs bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRecordModalMode(null);
                      setModalError(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateRecord}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer"
                  >
                    Save &amp; Insert
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto max-h-96">
                  {JSON.stringify(selectedRecord, null, 2)}
                </pre>
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setRecordModalMode(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Collection & Column Schema Builder Modal */}
      {showNewCollectionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden p-6 sm:p-7 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <Icon icon="ph:table-bold" className="w-5 h-5 text-indigo-600" />
                  <span>Define New Collection &amp; Schema</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pick a starter blueprint or design your custom column definitions:
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewCollectionModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <Icon icon="ph:x-bold" className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Collection Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Collection Name:
              </label>
              <div className="flex items-center rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs">
                <span className="font-mono text-slate-400 mr-1 font-semibold">/api/v1/custom/</span>
                <input
                  type="text"
                  value={newCollectionInput}
                  onChange={(e) => setNewCollectionInput(e.target.value)}
                  placeholder="tickets"
                  className="font-mono font-bold text-indigo-600 bg-transparent focus:outline-none w-full"
                />
              </div>
            </div>

            {/* Step 2: Starter Blueprints */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Starter Blueprint:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(STARTER_BLUEPRINTS).map(([key, bp]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectBlueprint(key)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col items-start gap-1 cursor-pointer transition-all ${
                      selectedBlueprint === key
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-900 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon icon={bp.icon} className={`w-4 h-4 ${selectedBlueprint === key ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="font-bold text-[11px] truncate w-full">{bp.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Interactive Column Schema Builder */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Columns &amp; Data Types:
                </label>
                <button
                  type="button"
                  onClick={handleAddFieldToNewCollection}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                >
                  <Icon icon="ph:plus-bold" className="w-3.5 h-3.5" />
                  <span>Add Column</span>
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {newCollectionFields.map((field, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <input
                      type="text"
                      value={field.name}
                      onChange={(e) => handleUpdateNewCollectionField(idx, { name: e.target.value })}
                      placeholder="column_name"
                      className="px-2 py-1 rounded-lg border border-slate-300 bg-white font-mono text-xs font-bold text-slate-800 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />

                    <select
                      value={field.type}
                      onChange={(e) => handleUpdateNewCollectionField(idx, { type: e.target.value as any })}
                      className="px-2 py-1 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="string">String</option>
                      <option value="number">Number</option>
                      <option value="boolean">Boolean</option>
                      <option value="email">Email</option>
                      <option value="array">Array</option>
                    </select>

                    <label className="inline-flex items-center gap-1 cursor-pointer shrink-0 text-[11px] text-slate-600 font-medium">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => handleUpdateNewCollectionField(idx, { required: e.target.checked })}
                        className="rounded text-indigo-600 focus:ring-0"
                      />
                      <span>Req</span>
                    </label>

                    <button
                      type="button"
                      disabled={newCollectionFields.length <= 1}
                      onClick={() => handleRemoveFieldFromNewCollection(idx)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                    >
                      <Icon icon="ph:trash-bold" className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 4: Toggles */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={newCollectionSeedSample}
                  onChange={(e) => setNewCollectionSeedSample(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-0 w-4 h-4"
                />
                <span>Seed 3 realistic sample records matching these columns immediately</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={newCollectionEnforceSchema}
                  onChange={(e) => setNewCollectionEnforceSchema(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-0 w-4 h-4"
                />
                <span>Enforce contract validation (reject invalid payloads with HTTP 422)</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowNewCollectionModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={creatingCollection}
                onClick={handleCreateNewCollection}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {creatingCollection ? (
                  <>
                    <Icon icon="ph:spinner-gap-bold" className="w-4 h-4 animate-spin" />
                    <span>Provisioning...</span>
                  </>
                ) : (
                  <>
                    <Icon icon="ph:check-bold" className="w-4 h-4" />
                    <span>Create Collection &amp; Provision Schema</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Related Links Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
        <Link
          href="/docs/sandbox/snapshots"
          className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/30 transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs text-slate-500 font-semibold">Related Feature</span>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 flex items-center gap-1.5 mt-0.5">
              <span>Session Snapshot JSON</span>
              <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5" />
            </h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Icon icon="ph:cloud-arrow-up-bold" className="w-4 h-4" />
          </div>
        </Link>

        <Link
          href="/docs/query/csv-excel-export"
          className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/30 transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs text-slate-500 font-semibold">Related Query Feature</span>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 flex items-center gap-1.5 mt-0.5">
              <span>CSV &amp; Excel Export &amp; Import</span>
              <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5" />
            </h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Icon icon="ph:file-xls-bold" className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </div>
  );
}
