'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Icon } from '@iconify/react';
import { EndpointDef, QueryParamDef } from '@/config/api-catalog';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { useLiveCounts } from '@/context/CountsContext';
import { cn } from '@/lib/utils';
import config from '@/config/env';

interface TryItRunnerProps {
  endpoint: EndpointDef;
  defaultExpanded?: boolean;
}

/**
 * Client-side SVG Sanitizer to strip script tags, event handlers, and dangerous attributes
 */
function sanitizeSvg(rawSvg: string): string {
  if (!rawSvg || typeof rawSvg !== 'string') return '';
  return rawSvg
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<foreignObject[\s\S]*?>[\s\S]*?<\/foreignObject>/gi, '')
    .replace(/on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(?:href|xlink:href)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*'|javascript:[^\s>]+)/gi, '');
}

const DEFAULT_GET_QUERY_PARAMS: QueryParamDef[] = [
  { name: 'q', type: 'string', description: 'Full-text search query term across fields.' },
  { name: 'page', type: 'integer', defaultVal: '1', description: 'Page number (1-indexed, default 1).' },
  { name: 'limit', type: 'integer', defaultVal: '10', description: 'Number of records per page (default 10, max 200).' },
  { name: '_sort', type: 'string', description: 'Field name to sort results by (e.g. id, name, title, createdAt).' },
  { name: '_order', type: 'string', defaultVal: 'asc', description: 'Sort direction: asc (default) or desc.' },
];

export function TryItRunner({ endpoint, defaultExpanded = false }: TryItRunnerProps) {
  const { refreshCounts } = useLiveCounts();
  const [isOpen, setIsOpen] = useState(defaultExpanded);
  const [loading, setLoading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [responseTab, setResponseTab] = useState<'body' | 'headers' | 'preview'>('body');

  const containerRef = useRef<HTMLDivElement>(null);

  // Extract path parameters (e.g. :id, :userId, :postId, :collection, :seed)
  const pathParamsList = useMemo(() => {
    const matches = endpoint.path.match(/:([a-zA-Z0-9_]+)/g);
    if (!matches) return [];
    return matches.map((m) => m.slice(1));
  }, [endpoint.path]);

  // Effective query parameters list
  const activeQueryParams = useMemo(() => {
    if (endpoint.queryParams && endpoint.queryParams.length > 0) {
      return endpoint.queryParams.filter((qp) => !pathParamsList.includes(qp.name));
    }
    if (endpoint.noListParams) {
      return [];
    }
    const isSingleResourcePath =
      endpoint.path.startsWith('/auth/') ||
      endpoint.path.startsWith('/session/');
    if (endpoint.method === 'GET' && !pathParamsList.length && !isSingleResourcePath) {
      return DEFAULT_GET_QUERY_PARAMS;
    }
    return [];
  }, [endpoint.queryParams, endpoint.method, endpoint.path, endpoint.noListParams, pathParamsList]);

  // Helper for smart initial value per param
  const getSmartInitialParamVal = (param: string) => {
    const p = param.toLowerCase();
    if (p === 'collection') return 'products';
    if (p.includes('seed')) return 'Bret';
    if (p === 'template') return 'ecommerce';
    return '1';
  };

  // Input states
  const [pathValues, setPathValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    pathParamsList.forEach((param) => {
      initial[param] = getSmartInitialParamVal(param);
    });
    return initial;
  });

  const [queryValues, setQueryValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    activeQueryParams.forEach((qp) => {
      initial[qp.name] = '';
    });
    return initial;
  });

  useEffect(() => {
    const initial: Record<string, string> = {};
    pathParamsList.forEach((param) => {
      initial[param] = pathValues[param] || getSmartInitialParamVal(param);
    });
    setPathValues(initial);
  }, [endpoint.path, pathParamsList]);

  // Simulation Controls
  const [simulateDelay, setSimulateDelay] = useState<string>('0');
  const [simulateStatus, setSimulateStatus] = useState<string>('200');

  // Auth Bearer Token state
  const [authToken, setAuthToken] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('pg_access_token') || '';
      if (savedToken) setAuthToken(savedToken);
    }
  }, []);

  const [requestBody, setRequestBody] = useState(
    endpoint.requestBody ? JSON.stringify(endpoint.requestBody, null, 2) : ''
  );

  const [response, setResponse] = useState<{
    status: number;
    statusText: string;
    timeMs: number;
    headers: Record<string, string>;
    data: unknown;
    isSvg?: boolean;
    isPersistedMutation?: boolean;
    identityId?: string;
  } | null>(null);

  // Compute constructed URL dynamically
  const computedUrl = useMemo(() => {
    let substitutedPath = endpoint.path;
    pathParamsList.forEach((param) => {
      const val = pathValues[param] || getSmartInitialParamVal(param);
      substitutedPath = substitutedPath.replace(`:${param}`, val);
    });

    const queryParts: string[] = [];
    Object.entries(queryValues).forEach(([key, val]) => {
      if (val && val.trim() !== '') {
        queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(val.trim())}`);
      }
    });

    if (simulateDelay !== '0' && simulateDelay !== '') {
      queryParts.push(`_delay=${encodeURIComponent(simulateDelay)}`);
    }
    if (simulateStatus !== '200' && simulateStatus !== '') {
      queryParts.push(`_status=${encodeURIComponent(simulateStatus)}`);
    }

    const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    return `${config.apiUrl}${substitutedPath}${queryString}`;
  }, [endpoint.path, pathParamsList, pathValues, queryValues, simulateDelay, simulateStatus]);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    pathParamsList.forEach((param) => {
      const val = (pathValues[param] ?? '').trim();
      if (!val) {
        errors[`path_${param}`] = `Parameter :${param} is required`;
      }
    });

    Object.entries(queryValues).forEach(([key, rawVal]) => {
      const val = (rawVal || '').trim();
      if (!val) return;

      if (key === 'page') {
        if (!/^\d+$/.test(val) || parseInt(val, 10) < 1) {
          errors[`query_${key}`] = 'Page must be a positive integer >= 1';
        }
      } else if (key === 'limit') {
        if (!/^\d+$/.test(val) || parseInt(val, 10) < 1 || parseInt(val, 10) > 200) {
          errors[`query_${key}`] = 'Limit must be an integer between 1 and 200';
        }
      } else if (key === '_order') {
        const lower = val.toLowerCase();
        if (lower !== 'asc' && lower !== 'desc') {
          errors[`query_${key}`] = "Order must be 'asc' or 'desc'";
        }
      } else if (key === 'completed') {
        const lower = val.toLowerCase();
        if (lower !== 'true' && lower !== 'false') {
          errors[`query_${key}`] = "Must be 'true' or 'false'";
        }
      } else if (key.endsWith('_id') || key === 'user_id' || key === 'post_id') {
        if (!val.startsWith('local-') && !/^-?\d+$/.test(val)) {
          errors[`query_${key}`] = 'Must be a valid integer ID';
        }
      }
    });

    if (['POST', 'PUT', 'PATCH'].includes(endpoint.method) && requestBody.trim()) {
      try {
        JSON.parse(requestBody);
      } catch (err: any) {
        errors['body'] = `Invalid JSON payload: ${err.message}`;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleExecute = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const startTime = performance.now();

    try {
      const localToken = typeof window !== 'undefined' ? localStorage.getItem('pg_identity') : '';
      const match = typeof document !== 'undefined' ? document.cookie.match(/pg_identity=([^;]+)/) : null;
      const cookieToken = match ? match[1] : '';
      const token = localToken || cookieToken;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['X-Playground-Identity'] = token;
      }

      if (authToken.trim()) {
        headers['Authorization'] = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
      }

      if (simulateDelay !== '0' && simulateDelay.trim() !== '') {
        headers['X-Simulate-Delay'] = simulateDelay.trim();
      }
      if (simulateStatus !== '200' && simulateStatus.trim() !== '') {
        headers['X-Simulate-Status'] = simulateStatus.trim();
      }

      const options: RequestInit = {
        method: endpoint.method,
        headers,
        credentials: 'include',
        cache: 'no-cache',
      };

      if (['POST', 'PUT', 'PATCH'].includes(endpoint.method) && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(computedUrl, options);
      const timeMs = Math.round(performance.now() - startTime);

      const returnedToken = res.headers.get('x-playground-identity');
      if (returnedToken && typeof window !== 'undefined') {
        localStorage.setItem('pg_identity', returnedToken);
      }

      let data: unknown = null;
      let isSvg = false;
      const contentType = res.headers.get('content-type') || '';

      if (res.status === 204 || res.status === 205) {
        data = null;
      } else {
        const text = await res.text();
        if (
          contentType.includes('image/svg') ||
          endpoint.path.includes('avatars') ||
          endpoint.path.includes('thumbnails') ||
          text.trim().startsWith('<svg')
        ) {
          data = text;
          if (text.trim().startsWith('<svg')) {
            isSvg = true;
          }
        } else if (text.trim() === '') {
          data = null;
        } else {
          try {
            data = JSON.parse(text);
          } catch {
            data = text;
          }
        }
      }

      if (data && typeof data === 'object') {
        const anyData = data as Record<string, any>;
        if (anyData.accessToken) {
          setAuthToken(anyData.accessToken);
          if (typeof window !== 'undefined') localStorage.setItem('pg_access_token', anyData.accessToken);
        } else if (anyData.token) {
          setAuthToken(anyData.token);
          if (typeof window !== 'undefined') localStorage.setItem('pg_access_token', anyData.token);
        }
      }

      const resHeaders: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        resHeaders[key] = val;
      });

      const isPersistedMutation =
        res.ok && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(endpoint.method);

      const activeIdentity = returnedToken || token || 'local-session';

      setResponse({
        status: res.status,
        statusText: res.statusText,
        timeMs,
        headers: resHeaders,
        data,
        isSvg,
        isPersistedMutation,
        identityId: activeIdentity,
      });

      if (isSvg) {
        setResponseTab('preview');
      } else {
        setResponseTab('body');
      }

      if (isPersistedMutation) {
        refreshCounts();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('playground:mutation'));
        }
      }
    } catch (err) {
      const timeMs = Math.round(performance.now() - startTime);
      setResponse({
        status: 0,
        statusText: 'Network Error',
        timeMs,
        headers: {},
        data: { error: String(err) },
        isSvg: false,
        isPersistedMutation: false,
      });
    } finally {
      setLoading(false);
    }
  }, [
    computedUrl,
    endpoint.method,
    endpoint.path,
    requestBody,
    authToken,
    simulateDelay,
    simulateStatus,
    refreshCounts,
    pathParamsList,
    pathValues,
    queryValues,
  ]);

  // Global Ctrl+Enter shortcut handler inside container
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (isOpen) {
          e.preventDefault();
          handleExecute();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleExecute]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(computedUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyResponse = () => {
    if (!response) return;
    const textToCopy = typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2);
    navigator.clipboard.writeText(textToCopy);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  const responseSize = useMemo(() => {
    if (!response || response.data === null || response.data === undefined) return '0 B';
    const raw = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
    const bytes = new Blob([raw]).size;
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  }, [response]);

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

  // Collapsed View
  if (!isOpen) {
    return (
      <div className="mt-2">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full rounded-xl border border-border-default bg-bg-surface/80 hover:bg-bg-elevated hover:border-brand-primary/40 p-4 flex items-center justify-between cursor-pointer transition-all shadow-sm group text-left"
        >
          <div className="flex items-center gap-2.5 font-bold text-xs sm:text-sm text-text-primary">
            <div className="w-7 h-7 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary group-hover:scale-105 transition-transform">
              <Icon icon="ph:lightning-fill" className="w-4 h-4" />
            </div>
            <div>
              <span className="text-text-primary">Interactive Live Sandbox Console</span>
              <p className="text-[11px] text-text-muted font-normal mt-0.5">
                Execute live requests with custom parameters and chaos simulation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-brand-primary font-semibold text-xs group-hover:translate-x-0.5 transition-transform">
            <span>Open Console</span>
            <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>
    );
  }

  // Expanded View with Terminal Container styling
  return (
    <div
      ref={containerRef}
      className="terminal-container rounded-2xl border border-border-default bg-bg-terminal p-4 sm:p-5 space-y-4 shadow-xl text-text-primary transition-all"
    >
      {/* 1. Header & Live URL Bar */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Live Console Runner
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-text-muted font-mono bg-bg-surface px-2 py-0.5 rounded border border-border-subtle">
              <kbd className="font-semibold text-text-secondary">Ctrl</kbd> + <kbd className="font-semibold text-text-secondary">Enter</kbd> to run
            </span>
            {!defaultExpanded && (
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs text-text-muted hover:text-text-primary cursor-pointer px-2 py-1 rounded hover:bg-bg-surface transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* URL Bar */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-bg-surface border border-border-default">
          <span className={cn("px-2 py-0.5 rounded-md text-[11px] font-mono font-bold shrink-0", getMethodBadgeClass(endpoint.method))}>
            {endpoint.method}
          </span>
          <span className="font-mono text-xs text-text-primary truncate select-all flex-1 min-w-0" title={computedUrl}>
            {computedUrl}
          </span>
          <button
            type="button"
            onClick={handleCopyUrl}
            title="Copy URL"
            className="p-1.5 rounded-lg bg-bg-elevated hover:bg-bg-tertiary text-text-muted hover:text-text-primary transition-colors cursor-pointer shrink-0"
          >
            <Icon icon={copiedUrl ? 'ph:check-bold' : 'ph:copy-bold'} className={cn("w-3.5 h-3.5", copiedUrl && "text-emerald-400")} />
          </button>
        </div>
      </div>

      {/* 2. Path Parameters */}
      {pathParamsList.length > 0 && (
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
            <Icon icon="ph:brackets-curly-bold" className="w-3.5 h-3.5 text-brand-primary" />
            <span>Path Parameters</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {pathParamsList.map((param) => {
              const hasError = Boolean(formErrors[`path_${param}`]);
              return (
                <div key={param} className="space-y-1">
                  <div className="text-[10px] font-mono text-text-muted">:{param}</div>
                  <input
                    type="text"
                    value={pathValues[param] ?? ''}
                    onChange={(e) => {
                      setPathValues((prev) => ({ ...prev, [param]: e.target.value }));
                      if (formErrors[`path_${param}`]) {
                        setFormErrors((prev) => {
                          const next = { ...prev };
                          delete next[`path_${param}`];
                          return next;
                        });
                      }
                    }}
                    placeholder={`:${param}`}
                    className={cn(
                      "w-full font-mono text-xs px-2.5 py-1.5 rounded-lg bg-bg-surface border text-text-primary placeholder:text-text-muted focus:outline-none transition-colors",
                      hasError
                        ? "border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/30"
                        : "border-border-default focus:border-brand-primary"
                    )}
                  />
                  {hasError && (
                    <div className="text-[10px] text-rose-400 flex items-center gap-1 font-sans">
                      <Icon icon="ph:warning-circle-fill" className="w-3 h-3 shrink-0" />
                      <span>{formErrors[`path_${param}`]}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Query Filters */}
      {activeQueryParams.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <Icon icon="ph:funnel-simple-bold" className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Query Parameters</span>
            </label>
            <button
              type="button"
              onClick={() => {
                const cleared: Record<string, string> = {};
                activeQueryParams.forEach((qp) => {
                  cleared[qp.name] = '';
                });
                setQueryValues(cleared);
              }}
              className="text-[10px] text-text-muted hover:text-text-secondary cursor-pointer transition-colors"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {activeQueryParams.map((qp) => {
              const hasError = Boolean(formErrors[`query_${qp.name}`]);
              const isPageOrLimit = qp.name === 'page' || qp.name === '_page' || qp.name === 'limit' || qp.name === '_limit';
              const isLimit = qp.name === 'limit' || qp.name === '_limit';
              const isOrder = qp.name === '_order';
              const isSort = qp.name === '_sort';

              const sortOptions = (() => {
                const p = endpoint.path.toLowerCase();
                if (p.includes('user')) return ['id', 'name', 'username', 'email'];
                if (p.includes('post')) return ['id', 'title', 'user_id'];
                if (p.includes('comment')) return ['id', 'name', 'email', 'post_id'];
                if (p.includes('todo')) return ['id', 'title', 'user_id', 'completed'];
                return ['id', 'title', 'name', 'username', 'email', 'user_id'];
              })();

              const handleValueChange = (val: string) => {
                setQueryValues((prev) => ({ ...prev, [qp.name]: val }));
                if (formErrors[`query_${qp.name}`]) {
                  setFormErrors((prev) => {
                    const next = { ...prev };
                    delete next[`query_${qp.name}`];
                    return next;
                  });
                }
              };

              return (
                <div key={qp.name} className="space-y-1">
                  <div className="text-[10px] font-mono text-text-muted">{qp.name}</div>
                  {isOrder ? (
                    <select
                      value={queryValues[qp.name] || ''}
                      onChange={(e) => handleValueChange(e.target.value)}
                      className={cn(
                        "w-full font-mono text-xs px-2.5 py-1.5 rounded-lg bg-bg-surface border text-text-primary focus:outline-none transition-colors cursor-pointer",
                        hasError ? "border-rose-500/80" : "border-border-default focus:border-brand-primary"
                      )}
                    >
                      <option value="">Default: asc</option>
                      <option value="asc">asc</option>
                      <option value="desc">desc</option>
                    </select>
                  ) : isSort ? (
                    <select
                      value={queryValues[qp.name] || ''}
                      onChange={(e) => handleValueChange(e.target.value)}
                      className={cn(
                        "w-full font-mono text-xs px-2.5 py-1.5 rounded-lg bg-bg-surface border text-text-primary focus:outline-none transition-colors cursor-pointer",
                        hasError ? "border-rose-500/80" : "border-border-default focus:border-brand-primary"
                      )}
                    >
                      <option value="">Default: id</option>
                      {sortOptions.map((field) => (
                        <option key={field} value={field}>
                          {field}
                        </option>
                      ))}
                    </select>
                  ) : isPageOrLimit ? (
                    <input
                      type="number"
                      min={1}
                      max={isLimit ? 200 : undefined}
                      value={queryValues[qp.name] || ''}
                      onChange={(e) => handleValueChange(e.target.value)}
                      placeholder={qp.defaultVal ? `Default: ${qp.defaultVal}` : qp.description}
                      className={cn(
                        "w-full font-mono text-xs px-2.5 py-1.5 rounded-lg bg-bg-surface border text-text-primary placeholder:text-text-muted focus:outline-none transition-colors",
                        hasError ? "border-rose-500/80" : "border-border-default focus:border-brand-primary"
                      )}
                    />
                  ) : (
                    <input
                      type="text"
                      value={queryValues[qp.name] || ''}
                      onChange={(e) => handleValueChange(e.target.value)}
                      placeholder={qp.defaultVal ? `Default: ${qp.defaultVal}` : qp.description}
                      className={cn(
                        "w-full font-mono text-xs px-2.5 py-1.5 rounded-lg bg-bg-surface border text-text-primary placeholder:text-text-muted focus:outline-none transition-colors",
                        hasError ? "border-rose-500/80" : "border-border-default focus:border-brand-primary"
                      )}
                    />
                  )}
                  {hasError && (
                    <div className="text-[10px] text-rose-400 flex items-center gap-1 font-sans">
                      <Icon icon="ph:warning-circle-fill" className="w-3 h-3 shrink-0" />
                      <span>{formErrors[`query_${qp.name}`]}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Auth Bearer Token input if relevant */}
      {(endpoint.path.includes('/auth') || endpoint.id.includes('auth')) && (
        <div className="space-y-1.5 p-3 rounded-xl bg-bg-surface border border-border-default">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-text-primary flex items-center gap-1.5">
              <Icon icon="ph:lock-key-bold" className="w-3.5 h-3.5 text-amber-400" />
              <span>JWT Bearer Token:</span>
            </span>
            <span className="text-[10px] text-text-muted">Auto-captured on /auth/login</span>
          </div>
          <input
            type="text"
            value={authToken}
            onChange={(e) => {
              setAuthToken(e.target.value);
              if (typeof window !== 'undefined') localStorage.setItem('pg_access_token', e.target.value);
            }}
            placeholder="Paste JWT Access Token"
            className="w-full font-mono text-xs px-2.5 py-1.5 rounded-lg bg-bg-terminal border border-border-default text-text-primary focus:outline-none focus:border-brand-primary"
          />
        </div>
      )}

      {/* 5. Request Body (JSON) */}
      {['POST', 'PUT', 'PATCH'].includes(endpoint.method) && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Icon icon="ph:file-code-bold" className="w-3.5 h-3.5 text-amber-400" />
              <span>Request Payload (Editable JSON)</span>
            </label>
            <span className="text-[10px] text-text-muted font-mono">application/json</span>
          </div>
          <CodeBlock
            code={requestBody}
            language="json"
            title="Request Payload"
            maxHeight="max-h-48"
            editable={true}
            onChange={(newVal) => {
              setRequestBody(newVal);
              if (formErrors['body']) {
                setFormErrors((prev) => {
                  const next = { ...prev };
                  delete next['body'];
                  return next;
                });
              }
            }}
          />
          {formErrors['body'] && (
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-1.5">
              <Icon icon="ph:warning-circle-fill" className="w-3.5 h-3.5 shrink-0" />
              <span>{formErrors['body']}</span>
            </div>
          )}
        </div>
      )}

      {/* 6. Network Latency & Chaos Simulation Controls */}
      <div className="p-3 rounded-xl bg-bg-surface border border-border-default space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
            <Icon icon="ph:gear-six-bold" className="w-3.5 h-3.5 text-brand-primary" />
            <span>Chaos & Simulation Dock</span>
          </span>
          <span className="text-[10px] text-text-muted font-mono">X-Simulate Headers</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Latency Presets */}
          <div className="space-y-1">
            <div className="text-[11px] text-text-secondary flex items-center justify-between">
              <span>Simulated Latency:</span>
              <span className="font-mono text-brand-primary font-bold">{simulateDelay} ms</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[
                { label: '0ms', val: '0' },
                { label: '500ms', val: '500' },
                { label: '1.5s', val: '1500' },
                { label: '3s', val: '3000' },
              ].map((d) => (
                <button
                  key={d.val}
                  type="button"
                  onClick={() => setSimulateDelay(d.val)}
                  className={cn(
                    "px-1.5 py-1 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer text-center",
                    simulateDelay === d.val
                      ? "bg-brand-primary text-white shadow-xs"
                      : "bg-bg-terminal hover:bg-bg-elevated text-text-secondary border border-border-subtle"
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status Override */}
          <div className="space-y-1">
            <div className="text-[11px] text-text-secondary flex items-center justify-between">
              <span>Simulated HTTP Status:</span>
              <span className="font-mono text-amber-400 font-bold">{simulateStatus}</span>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {[
                { label: '200', val: '200' },
                { label: '400', val: '400' },
                { label: '401', val: '401' },
                { label: '403', val: '403' },
                { label: '404', val: '404' },
                { label: '429', val: '429' },
                { label: '500', val: '500' },
              ].map((s) => (
                <button
                  key={s.val}
                  type="button"
                  onClick={() => setSimulateStatus(s.val)}
                  className={cn(
                    "px-1 py-1 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer text-center",
                    simulateStatus === s.val
                      ? "bg-amber-500 text-bg-canvas shadow-xs font-black"
                      : "bg-bg-terminal hover:bg-bg-elevated text-text-secondary border border-border-subtle"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 7. Action Bar */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={handleExecute}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <Icon
            icon={loading ? 'ph:spinner-bold' : 'ph:paper-plane-right-bold'}
            className={cn("w-4 h-4", loading && "animate-spin")}
          />
          <span>{loading ? 'Sending Request...' : 'Send Request'}</span>
        </button>

        <div className="flex items-center gap-2 text-[11px] text-text-muted font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Isolated Session Overlay</span>
        </div>
      </div>

      {/* 8. Live Response Deck */}
      {response && (
        <div className="space-y-3 pt-3 border-t border-border-default animate-in fade-in duration-200">
          {/* Status Bar */}
          <div className="flex items-center justify-between text-xs flex-wrap gap-2 bg-bg-surface p-2.5 rounded-xl border border-border-default">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-text-muted text-[11px]">Status:</span>
              <span
                className={cn(
                  "font-mono font-bold px-2 py-0.5 rounded-md text-xs border",
                  response.status >= 200 && response.status < 300
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                )}
              >
                {response.status} {response.statusText}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-text-muted font-mono text-xs">
                <Icon icon="ph:timer-bold" className="w-3.5 h-3.5 text-brand-primary" />
                <span>{response.timeMs} ms</span>
              </div>
              <div className="flex items-center gap-1 text-text-muted font-mono text-xs">
                <Icon icon="ph:file-bold" className="w-3.5 h-3.5 text-accent-cyan" />
                <span>{responseSize}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyResponse}
                title="Copy Response"
                className="px-2 py-1 rounded bg-bg-elevated hover:bg-bg-tertiary text-text-muted hover:text-text-primary text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 border border-border-subtle"
              >
                <Icon icon={copiedResponse ? 'ph:check-bold' : 'ph:copy-bold'} className={cn("w-3 h-3", copiedResponse && "text-emerald-400")} />
                <span>{copiedResponse ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Persisted in Session Overlay Banner */}
          {response.isPersistedMutation && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2.5">
              <Icon icon="ph:sparkle-fill" className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <span className="font-bold">Persisted in Session Overlay:</span>{' '}
                <span>This mutation was saved to your private visitor sandbox. Subsequent collection requests will immediately reflect this item.</span>
              </div>
            </div>
          )}

          {/* Response Sub-tabs: Body vs Headers vs Live Preview */}
          <div className="space-y-2">
            <div className="flex items-center gap-1 border-b border-border-default pb-1">
              <button
                type="button"
                onClick={() => setResponseTab('body')}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
                  responseTab === 'body'
                    ? "bg-bg-surface text-text-primary border border-border-default"
                    : "text-text-muted hover:text-text-secondary"
                )}
              >
                Response Body
              </button>
              <button
                type="button"
                onClick={() => setResponseTab('headers')}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
                  responseTab === 'headers'
                    ? "bg-bg-surface text-text-primary border border-border-default"
                    : "text-text-muted hover:text-text-secondary"
                )}
              >
                Headers ({Object.keys(response.headers).length})
              </button>
              {response.isSvg && (
                <button
                  type="button"
                  onClick={() => setResponseTab('preview')}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
                    responseTab === 'preview'
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      : "text-text-muted hover:text-text-secondary"
                  )}
                >
                  Live SVG Preview
                </button>
              )}
            </div>

            {/* Tab: Live SVG Preview */}
            {responseTab === 'preview' && response.isSvg && typeof response.data === 'string' && (
              <div className="p-4 rounded-xl bg-bg-surface border border-border-default flex items-center justify-center min-h-36 overflow-hidden">
                <div
                  className="max-w-full max-h-64 flex items-center justify-center [&>svg]:max-w-full [&>svg]:h-auto [&>svg]:shadow-lg [&>svg]:rounded-xl"
                  dangerouslySetInnerHTML={{ __html: sanitizeSvg(response.data) }}
                />
              </div>
            )}

            {/* Tab: Response Body */}
            {responseTab === 'body' && (
              <CodeBlock
                code={response.data}
                language={response.isSvg ? 'xml' : 'json'}
                maxHeight="max-h-64"
                showHeader={false}
              />
            )}

            {/* Tab: Response Headers */}
            {responseTab === 'headers' && (
              <div className="rounded-xl border border-border-default bg-bg-surface p-3 font-mono text-xs max-h-60 overflow-y-auto divide-y divide-border-subtle">
                {Object.entries(response.headers).map(([key, val]) => (
                  <div key={key} className="py-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-brand-primary font-bold">{key}</span>
                    <span className="text-text-secondary truncate select-all">{val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
