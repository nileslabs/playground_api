'use client';

import React, { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface SchemaFieldRow {
  name: string;
  type: string;
  required: boolean;
  example: string;
  description: string;
}

interface RequestBodySchemaTableProps {
  requestBody: Record<string, unknown>;
  title?: string;
}

export function RequestBodySchemaTable({ requestBody, title = 'Request Body Schema' }: RequestBodySchemaTableProps) {
  const [activeTab, setActiveTab] = useState<'table' | 'json'>('table');

  // Derive field breakdown from requestBody object
  const fields: SchemaFieldRow[] = useMemo(() => {
    if (!requestBody || typeof requestBody !== 'object') return [];

    return Object.entries(requestBody).map(([key, val]) => {
      let typeStr: string = typeof val;
      if (Array.isArray(val)) typeStr = 'array';
      else if (val === null) typeStr = 'nullable';
      else if (typeof val === 'number') {
        typeStr = Number.isInteger(val) ? 'integer' : 'float';
      }

      // Generate context-aware description and required heuristic
      let description = `Value for ${key.replace(/_/g, ' ')}`;
      const required = true; // By default body fields shown in examples are typically required or primary

      if (key === 'title') description = 'Headline or title of the resource. Min 3 characters.';
      else if (key === 'body') description = 'Main textual content body.';
      else if (key === 'user_id' || key === 'userId') description = 'Identifier of the owning user (Foreign Key -> users.id).';
      else if (key === 'post_id' || key === 'postId') description = 'Identifier of the parent post (Foreign Key -> posts.id).';
      else if (key === 'email') description = 'Valid RFC 5322 email address format.';
      else if (key === 'password') description = 'User authentication secret. Min 8 characters.';
      else if (key === 'completed') description = 'Boolean flag indicating whether the task is complete.';
      else if (key === 'amount') description = 'Transaction charge amount in smallest currency unit (e.g. cents).';
      else if (key === 'currency') description = 'ISO 4217 three-letter currency code (e.g. usd, eur).';
      else if (key === 'card_number') description = 'Sandbox card number (use 4000000000003022 for 3DS testing).';
      else if (key === 'tags') description = 'Array of string labels categorizing the item.';
      else if (key === 'price') description = 'Retail price in decimal format.';
      else if (key === 'stock') description = 'Available inventory count.';

      return {
        name: key,
        type: typeStr,
        required,
        example: typeof val === 'object' ? JSON.stringify(val) : String(val),
        description,
      };
    });
  }, [requestBody]);

  if (!requestBody || Object.keys(requestBody).length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Header with Tab Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon icon="ph:brackets-curly-bold" className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            {title}
          </h3>
        </div>

        {/* Tab Toggle: Table vs Raw JSON */}
        <div className="inline-flex items-center p-0.5 rounded-lg bg-bg-terminal border border-border-default text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('table')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'table'
                ? 'bg-bg-surface text-text-primary shadow-xs font-bold border border-border-default'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <Icon icon="ph:table-bold" className="w-3 h-3" />
            <span>Schema Table</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('json')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'json'
                ? 'bg-brand-primary text-white shadow-xs font-bold'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <Icon icon="ph:file-json-bold" className="w-3 h-3" />
            <span>Raw JSON</span>
          </button>
        </div>
      </div>

      {/* Content View */}
      {activeTab === 'table' ? (
        <div className="overflow-x-auto rounded-xl border border-border-default bg-bg-surface">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border-default bg-bg-terminal text-text-muted text-[11px] font-semibold uppercase">
                <th className="p-3">Field</th>
                <th className="p-3">Type</th>
                <th className="p-3">Example</th>
                <th className="p-3 font-sans">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-secondary">
              {fields.map((field) => (
                <tr key={field.name} className="hover:bg-bg-elevated/40 transition-colors">
                  <td className="p-3 font-bold text-text-primary whitespace-nowrap">
                    <span>{field.name}</span>
                    {field.required && (
                      <span className="ml-1.5 px-1.5 py-0.2 rounded text-[9px] font-sans font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20">
                        required
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-brand-primary text-[11px] whitespace-nowrap">{field.type}</td>
                  <td className="p-3 text-text-muted text-[11px] truncate max-w-[120px]" title={field.example}>
                    {field.example}
                  </td>
                  <td className="p-3 font-sans text-text-secondary text-xs">{field.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-border-default overflow-hidden">
          <CodeBlock
            code={requestBody}
            language="json"
            maxHeight="max-h-56"
            showHeader={false}
            showLineNumbers={true}
          />
        </div>
      )}
    </div>
  );
}

export default RequestBodySchemaTable;
