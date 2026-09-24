'use client';

import React, { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { EndpointDef } from '@/config/api-catalog';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { TryItRunner } from './TryItRunner';
import { CodeGenerators } from './CodeGenerators';
import { HeadersTable } from './HeadersTable';
import { RequestBodySchemaTable } from './RequestBodySchemaTable';
import { ResponseEnvelopesTable } from './ResponseEnvelopesTable';
import { cn } from '@/lib/utils';
import config from '@/config/env';

interface EndpointCardProps {
  endpoint: EndpointDef;
}

export function EndpointCard({ endpoint }: EndpointCardProps) {
  // Right pane tab: 'runner' | 'code' | 'example'
  const [rightPaneTab, setRightPaneTab] = useState<'runner' | 'code' | 'example'>('runner');
  
  // Mobile breakpoint view switch: 'spec' | 'interactive'
  const [mobileTab, setMobileTab] = useState<'spec' | 'interactive'>('spec');
  const [copiedUrl, setCopiedUrl] = useState(false);

  const baseApi = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const cleanBase = baseApi.replace(/\/+$/, '');
  const cleanPath = endpoint.path.startsWith('/') ? endpoint.path : `/${endpoint.path}`;
  const fullUrl = `${cleanBase}${cleanPath}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const getMethodBadgeClass = (method: string) => {
    switch (method) {
      case 'GET':
        return 'badge-get';
      case 'POST':
        return 'badge-post';
      case 'PUT':
        return 'badge-put';
      case 'PATCH':
        return 'badge-patch';
      case 'DELETE':
        return 'badge-delete';
      default:
        return 'bg-bg-tertiary text-text-secondary border border-border-default';
    }
  };

  // Extract path params from endpoint.path
  const pathParams = useMemo(() => {
    const matches = endpoint.path.match(/:([a-zA-Z0-9_]+)/g);
    if (!matches) return [];
    return matches.map((m) => ({
      name: m.slice(1),
      type: 'string | integer',
      required: true,
      description: `Identifier for target ${m.slice(1).replace(/([A-Z])/g, ' $1').toLowerCase()}. Supports integer ID or local UUID.`,
    }));
  }, [endpoint.path]);

  // Documented status codes
  const statusCodes = useMemo(() => {
    const list: { code: number; label: string; desc: string; type: 'success' | 'client-error' | 'server-error' }[] = [];
    if (endpoint.method === 'POST') {
      list.push({ code: 201, label: 'Created', desc: 'Resource created and persisted in your isolated session overlay.', type: 'success' });
      list.push({ code: 400, label: 'Bad Request', desc: 'Invalid payload or missing mandatory schema fields.', type: 'client-error' });
    } else if (endpoint.method === 'DELETE') {
      list.push({ code: 200, label: 'OK / 204 No Content', desc: 'Resource deleted or marked inactive in session overlay.', type: 'success' });
      list.push({ code: 404, label: 'Not Found', desc: 'Resource ID does not exist or was already deleted.', type: 'client-error' });
    } else {
      list.push({ code: 200, label: 'OK', desc: 'Standard successful REST response with requested payload.', type: 'success' });
      if (pathParams.length > 0) {
        list.push({ code: 404, label: 'Not Found', desc: 'Resource ID does not exist.', type: 'client-error' });
      }
    }
    list.push({ code: 429, label: 'Too Many Requests', desc: 'Exceeded rate quota or triggered by chaos simulation.', type: 'client-error' });
    return list;
  }, [endpoint.method, pathParams.length]);

  return (
    <div
      id={endpoint.id}
      data-toc-title={endpoint.title}
      className="border border-border-default bg-bg-surface/50 rounded-2xl p-5 sm:p-6 mb-8 scroll-mt-24 transition-all shadow-sm hover:border-border-muted"
    >
      {/* 1. Header: Method Badge, URL Bar, Copy Action, Title, Description */}
      <div className="space-y-4 pb-6 border-b border-border-default">
        {/* Top bar with Method, URL, and Copy */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-bg-surface border border-border-default rounded-xl p-2.5 sm:px-3.5 sm:py-2.5">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span className={cn("px-2.5 py-1 rounded-lg text-xs font-mono font-bold shrink-0", getMethodBadgeClass(endpoint.method))}>
              {endpoint.method}
            </span>
            <span className="font-mono text-xs sm:text-sm text-text-primary select-all truncate font-medium">
              {fullUrl}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleCopyUrl}
              title="Copy Endpoint URL"
              className="px-2.5 py-1.5 rounded-lg bg-bg-elevated hover:bg-bg-tertiary text-text-secondary hover:text-text-primary text-xs font-medium border border-border-subtle transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Icon icon={copiedUrl ? 'ph:check-bold' : 'ph:copy-bold'} className={cn("w-3.5 h-3.5", copiedUrl && "text-emerald-400")} />
              <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
            {endpoint.title}
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
            {endpoint.description}
          </p>
        </div>

        {/* Viewport < xl Segmented Switch */}
        <div className="flex xl:hidden items-center justify-between pt-2">
          <div className="inline-flex items-center p-1 rounded-xl bg-bg-terminal border border-border-default text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMobileTab('spec')}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5",
                mobileTab === 'spec'
                  ? "bg-bg-surface text-text-primary shadow-xs border border-border-default"
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              <Icon icon="ph:file-text-bold" className="w-3.5 h-3.5" />
              <span>Spec & Schema</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileTab('interactive')}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5",
                mobileTab === 'interactive'
                  ? "bg-brand-primary text-white shadow-xs"
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              <Icon icon="ph:play-circle-bold" className="w-3.5 h-3.5" />
              <span>Live Console & Code</span>
            </button>
          </div>

          <span className="text-[11px] text-text-muted font-mono hidden sm:inline-block">
            {mobileTab === 'spec' ? 'Documentation Pane' : 'Execution Pane'}
          </span>
        </div>
      </div>

      {/* 2. Responsive Dual-Pane Grid (Side-by-side on xl:, Tabbed on < xl) */}
      <div className="pt-6 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Documentation, Parameters Table, Request Body Schema, Status Codes */}
        <div
          className={cn(
            "xl:col-span-6 2xl:col-span-7 space-y-6",
            mobileTab !== 'spec' && "hidden xl:block"
          )}
        >
          {/* Path & Query Parameters */}
          {(pathParams.length > 0 || (endpoint.queryParams && endpoint.queryParams.length > 0)) && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Icon icon="ph:list-bullets-bold" className="w-4 h-4 text-brand-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Parameters & Filters
                </h3>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border-default bg-bg-surface">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-border-default bg-bg-terminal text-text-muted text-[11px] font-semibold uppercase">
                      <th className="p-3">Field</th>
                      <th className="p-3">Type</th>
                      <th className="p-3 font-sans">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle text-text-secondary">
                    {/* Path parameters */}
                    {pathParams.map((p) => (
                      <tr key={`path-${p.name}`} className="hover:bg-bg-elevated/40 transition-colors">
                        <td className="p-3 font-bold text-accent-cyan whitespace-nowrap">
                          :{p.name}
                          <span className="ml-1.5 px-1.5 py-0.5 text-[9px] rounded bg-rose-500/10 text-rose-400 font-sans font-medium">required</span>
                        </td>
                        <td className="p-3 text-text-muted text-[11px]">{p.type}</td>
                        <td className="p-3 font-sans text-text-secondary text-xs">{p.description}</td>
                      </tr>
                    ))}

                    {/* Query parameters */}
                    {endpoint.queryParams?.map((q) => (
                      <tr key={`query-${q.name}`} className="hover:bg-bg-elevated/40 transition-colors">
                        <td className="p-3 font-bold text-brand-primary whitespace-nowrap">
                          {q.name}
                          {q.defaultVal && (
                            <span className="ml-1.5 px-1.5 py-0.5 text-[9px] rounded bg-bg-terminal text-text-muted font-mono">
                              ={q.defaultVal}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-text-muted text-[11px]">{q.type}</td>
                        <td className="p-3 font-sans text-text-secondary text-xs">{q.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Request Headers Explanation Table */}
          <HeadersTable
            isMutation={['POST', 'PUT', 'PATCH'].includes(endpoint.method)}
            requiresAuth={endpoint.path.startsWith('/auth/me') || endpoint.path.startsWith('/payments/')}
          />

          {/* Request Body JSON Schema Table */}
          {endpoint.requestBody && (
            <RequestBodySchemaTable requestBody={endpoint.requestBody} />
          )}

          {/* Documented Response Status Codes with Expandable Envelopes */}
          <ResponseEnvelopesTable
            method={endpoint.method}
            hasIdParam={pathParams.length > 0}
            requiresAuth={endpoint.path.startsWith('/auth/me') || endpoint.path.startsWith('/payments/')}
          />
        </div>

        {/* Right Column: Sticky Tabbed Console (Live Sandbox Runner, Code Snippets, Example Response) */}
        <div
          className={cn(
            "xl:col-span-6 2xl:col-span-5 space-y-4 xl:sticky xl:top-24",
            mobileTab !== 'interactive' && "hidden xl:block"
          )}
        >
          {/* Segmented Controls for Right Pane */}
          <div className="flex items-center justify-between gap-1 p-1 rounded-xl bg-bg-terminal border border-border-default overflow-x-auto no-scrollbar">
            {/* Tab 1: Live Sandbox Runner */}
            <button
              type="button"
              onClick={() => setRightPaneTab('runner')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap",
                rightPaneTab === 'runner'
                  ? "bg-brand-primary text-white shadow-xs font-bold"
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>Live Sandbox</span>
            </button>

            {/* Tab 2: Code Snippets */}
            <button
              type="button"
              onClick={() => setRightPaneTab('code')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap",
                rightPaneTab === 'code'
                  ? "bg-bg-surface text-text-primary shadow-xs border border-border-default font-bold"
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              <Icon icon="ph:terminal-window-bold" className="w-3.5 h-3.5 text-accent-cyan shrink-0" />
              <span>Code Snippets</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-accent-cyan/10 text-accent-cyan font-mono shrink-0">9 SDKs</span>
            </button>

            {/* Tab 3: Example Response */}
            <button
              type="button"
              onClick={() => setRightPaneTab('example')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap",
                rightPaneTab === 'example'
                  ? "bg-bg-surface text-text-primary shadow-xs border border-border-default font-bold"
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              <Icon icon="ph:brackets-curly-bold" className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Example</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-mono shrink-0">200</span>
            </button>
          </div>

          {/* Right Pane Content */}
          <div className="transition-all duration-150">
            {/* View 1: Live Runner */}
            {rightPaneTab === 'runner' && (
              <div className="animate-in fade-in duration-150">
                <TryItRunner endpoint={endpoint} defaultExpanded={true} />
              </div>
            )}

            {/* View 2: Multi-Language Code Snippets */}
            {rightPaneTab === 'code' && (
              <div className="animate-in fade-in duration-150 rounded-2xl border border-border-default bg-bg-terminal p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Icon icon="ph:code-bold" className="w-4 h-4 text-brand-primary" />
                    <span>Client Integration Snippets</span>
                  </span>
                  <span className="text-[11px] text-text-muted font-mono">cURL, JS, Axios, Python, Go</span>
                </div>
                <CodeGenerators endpoint={endpoint} />
              </div>
            )}

            {/* View 3: Example Response */}
            {rightPaneTab === 'example' && (
              <div className="animate-in fade-in duration-150 rounded-2xl border border-border-default bg-bg-terminal p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Icon icon="ph:file-code-bold" className="w-4 h-4 text-emerald-400" />
                    <span>Sample JSON Response</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/10 text-emerald-400 font-mono font-bold border border-emerald-500/30">
                    200 OK
                  </span>
                </div>
                <CodeBlock
                  code={endpoint.responseExample}
                  language={typeof endpoint.responseExample === 'string' && endpoint.responseExample.startsWith('<svg') ? 'xml' : 'json'}
                  maxHeight="max-h-80"
                  showHeader={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
