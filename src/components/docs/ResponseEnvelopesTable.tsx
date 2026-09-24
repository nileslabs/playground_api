'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';

export interface StatusCodeItem {
  code: number;
  label: string;
  description: string;
  type: 'success' | 'client-error' | 'server-error';
  examplePayload: Record<string, unknown>;
}

interface ResponseEnvelopesTableProps {
  method: string;
  hasIdParam?: boolean;
  requiresAuth?: boolean;
}

export function ResponseEnvelopesTable({
  method,
  hasIdParam = false,
  requiresAuth = false,
}: ResponseEnvelopesTableProps) {
  const [expandedCode, setExpandedCode] = useState<number | null>(null);

  // Generate status code items with realistic envelopes
  const items: StatusCodeItem[] = [];

  if (method === 'POST') {
    items.push({
      code: 201,
      label: 'Created',
      description: 'Resource successfully created and persisted in your isolated session overlay.',
      type: 'success',
      examplePayload: {
        id: 'local-f8a1c2e3-4567-89ab-cdef-0123456789ab',
        title: 'New Resource Item',
        created_at: '2026-09-25T01:00:00.000Z',
        _sandbox: {
          persisted: true,
          session: 'active',
          note: 'Item will persist in all subsequent GET queries for this visitor.',
        },
      },
    });

    items.push({
      code: 400,
      label: 'Bad Request',
      description: 'Missing required schema fields or invalid JSON payload formatting.',
      type: 'client-error',
      examplePayload: {
        error: true,
        statusCode: 400,
        message: "Validation Error: 'title' is required and must contain at least 3 characters.",
        fields: { title: 'Required' },
      },
    });
  } else if (method === 'DELETE') {
    items.push({
      code: 200,
      label: 'OK / 204 No Content',
      description: 'Resource deleted or marked purged from your session overlay.',
      type: 'success',
      examplePayload: {
        success: true,
        message: 'Resource was successfully deleted from your sandbox overlay.',
        id: '1',
      },
    });
  } else {
    items.push({
      code: 200,
      label: 'OK',
      description: 'Successful REST response returning requested record or collection.',
      type: 'success',
      examplePayload: {
        status: 200,
        data: { id: 1, title: 'Sample Record', active: true },
      },
    });
  }

  if (requiresAuth) {
    items.push({
      code: 401,
      label: 'Unauthorized',
      description: 'Missing or expired Bearer token in the Authorization header.',
      type: 'client-error',
      examplePayload: {
        error: true,
        statusCode: 401,
        message: "Authentication required. Provide a valid Bearer token via Authorization header.",
      },
    });
  }

  if (hasIdParam || method === 'DELETE' || method === 'PUT' || method === 'PATCH') {
    items.push({
      code: 404,
      label: 'Not Found',
      description: 'Specified ID does not exist in baseline database or session overlay.',
      type: 'client-error',
      examplePayload: {
        error: true,
        statusCode: 404,
        message: "Resource with specified ID could not be found in active session overlay.",
      },
    });
  }

  items.push({
    code: 429,
    label: 'Too Many Requests',
    description: 'Rate quota exceeded or artificially triggered via ?_status=429 / X-Simulate-Status.',
    type: 'client-error',
    examplePayload: {
      error: true,
      statusCode: 429,
      message: "Too Many Requests. Rate limit triggered by simulation header.",
      retryAfterSeconds: 60,
    },
  });

  const toggleExpand = (code: number) => {
    setExpandedCode((prev) => (prev === code ? null : code));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon icon="ph:shield-check-bold" className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            Documented HTTP Status Codes
          </h3>
        </div>
        <span className="text-[11px] text-text-muted font-mono">
          Click row to preview JSON envelope
        </span>
      </div>

      <div className="space-y-2">
        {items.map((item) => {
          const isExpanded = expandedCode === item.code;

          return (
            <div
              key={item.code}
              className="rounded-xl border border-border-default bg-bg-surface overflow-hidden transition-all shadow-xs"
            >
              {/* Row Header */}
              <button
                type="button"
                onClick={() => toggleExpand(item.code)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-bg-elevated/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] shrink-0 border ${
                      item.type === 'success'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {item.code}
                  </span>
                  <span className="text-xs font-bold text-text-primary">{item.label}</span>
                  <span className="text-xs text-text-secondary hidden sm:inline truncate">
                    — {item.description}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <span className="text-[10px] font-mono text-text-muted hidden md:inline">
                    {isExpanded ? 'Hide Payload' : 'View Payload'}
                  </span>
                  <Icon
                    icon={isExpanded ? 'ph:caret-up-bold' : 'ph:caret-down-bold'}
                    className="w-3.5 h-3.5 text-text-muted"
                  />
                </div>
              </button>

              {/* Expandable JSON Envelope */}
              {isExpanded && (
                <div className="border-t border-border-subtle bg-bg-canvas p-3 animate-in fade-in duration-150">
                  <div className="text-[10px] font-mono text-text-muted mb-1.5 flex items-center justify-between">
                    <span>Sample {item.code} Response Payload Envelope:</span>
                    <span className="text-brand-primary">application/json</span>
                  </div>
                  <CodeBlock
                    code={item.examplePayload}
                    language="json"
                    maxHeight="max-h-48"
                    showHeader={false}
                    showLineNumbers={true}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ResponseEnvelopesTable;
