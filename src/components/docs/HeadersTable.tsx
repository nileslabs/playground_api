'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';

export interface HeaderDef {
  name: string;
  type: string;
  defaultVal?: string;
  required?: boolean;
  description: string;
  example: string;
}

const SUPPORTED_HEADERS: HeaderDef[] = [
  {
    name: 'X-Playground-Identity',
    type: 'string',
    defaultVal: 'local-visitor',
    required: false,
    description: 'Isolates mutations (POST, PUT, DELETE) to your private sandbox session without requiring an account.',
    example: 'X-Playground-Identity: local-a1b2c3d4-e5f6',
  },
  {
    name: 'X-Simulate-Delay',
    type: 'integer (ms)',
    defaultVal: '0',
    required: false,
    description: 'Injects artificial network latency in milliseconds to test frontend loading spinners and skeleton screens.',
    example: 'X-Simulate-Delay: 1200',
  },
  {
    name: 'X-Simulate-Status',
    type: 'integer (HTTP)',
    defaultVal: '200',
    required: false,
    description: 'Forces the server to return an error status code (e.g., 400, 401, 404, 429, 500) to test error boundaries.',
    example: 'X-Simulate-Status: 429',
  },
  {
    name: 'X-Simulate-Chaos',
    type: 'float (0.0 - 1.0)',
    defaultVal: '0',
    required: false,
    description: 'Stochastically injects random failures based on the specified probability (e.g., 0.25 = 25% failure rate).',
    example: 'X-Simulate-Chaos: 0.25',
  },
  {
    name: 'Authorization',
    type: 'string',
    defaultVal: '-',
    required: false,
    description: 'Bearer token obtained from /api/v1/auth/login for authenticated endpoints.',
    example: 'Authorization: Bearer eyJhbGciOi...',
  },
  {
    name: 'Content-Type',
    type: 'string',
    defaultVal: 'application/json',
    required: true,
    description: 'Specifies the MIME format of the request payload for POST, PUT, and PATCH operations.',
    example: 'Content-Type: application/json',
  },
];

interface HeadersTableProps {
  isMutation?: boolean;
  requiresAuth?: boolean;
}

export function HeadersTable({ isMutation = false, requiresAuth = false }: HeadersTableProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedHeader, setCopiedHeader] = useState<string | null>(null);

  const handleCopy = (headerName: string) => {
    navigator.clipboard.writeText(headerName);
    setCopiedHeader(headerName);
    setTimeout(() => setCopiedHeader(null), 2000);
  };

  const headersToShow = SUPPORTED_HEADERS.filter((h) => {
    if (h.name === 'Content-Type' && !isMutation) return false;
    if (h.name === 'Authorization' && !requiresAuth) return false;
    return true;
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors cursor-pointer group"
        >
          <Icon
            icon={isExpanded ? 'ph:caret-down-bold' : 'ph:caret-right-bold'}
            className="w-3.5 h-3.5 text-brand-primary group-hover:scale-110 transition-transform"
          />
          <span>Supported Request Headers</span>
          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-bg-elevated text-brand-primary border border-border-subtle">
            {headersToShow.length} Headers
          </span>
        </button>

        <span className="text-[11px] text-text-muted font-mono hidden sm:inline">
          Chaos & Overlay Controls
        </span>
      </div>

      {isExpanded && (
        <div className="overflow-x-auto rounded-xl border border-border-default bg-bg-surface animate-in fade-in duration-150">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border-default bg-bg-terminal text-text-muted text-[11px] font-semibold uppercase">
                <th className="p-3">Header Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Default</th>
                <th className="p-3 font-sans">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-secondary">
              {headersToShow.map((header) => {
                const isCopied = copiedHeader === header.name;

                return (
                  <tr key={header.name} className="hover:bg-bg-elevated/40 transition-colors">
                    <td className="p-3 font-bold text-text-primary whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{header.name}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(header.name)}
                          className="p-1 rounded hover:bg-bg-elevated text-text-muted hover:text-brand-primary transition-colors cursor-pointer"
                          title="Copy header name"
                        >
                          <Icon icon={isCopied ? 'ph:check-bold' : 'ph:copy-bold'} className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="p-3 text-text-muted text-[11px] whitespace-nowrap">{header.type}</td>
                    <td className="p-3 text-brand-primary text-[11px] whitespace-nowrap">{header.defaultVal || '—'}</td>
                    <td className="p-3 font-sans text-text-secondary text-xs">{header.description}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HeadersTable;
