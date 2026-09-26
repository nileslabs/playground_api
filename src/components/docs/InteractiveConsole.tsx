'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

interface HeaderItem {
  key: string;
  value: string;
}

interface QueryParamItem {
  key: string;
  value: string;
}

export interface InteractiveConsoleProps {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  initialHeaders?: HeaderItem[];
  initialQueryParams?: QueryParamItem[];
  initialBody?: string;
  title?: string;
  description?: string;
}

const EMPTY_HEADERS: HeaderItem[] = [];
const EMPTY_QUERY_PARAMS: QueryParamItem[] = [];

export function InteractiveConsole({
  method,
  path,
  initialHeaders = EMPTY_HEADERS,
  initialQueryParams = EMPTY_QUERY_PARAMS,
  initialBody = '',
  title = 'Live Request Console',
  description,
}: InteractiveConsoleProps) {
  const [activeTab, setActiveTab] = useState<'response' | 'body' | 'headers'>('response');
  const [currentPath, setCurrentPath] = useState(path);
  const [headers, setHeaders] = useState<HeaderItem[]>(initialHeaders);
  const [body, setBody] = useState<string>(initialBody);
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Update currentPath when prop changes
  React.useEffect(() => {
    setCurrentPath(path);
  }, [path]);

  // Update body when initialBody changes
  React.useEffect(() => {
    setBody(initialBody);
  }, [initialBody]);

  // Update headers only when serialized content changes to prevent infinite loops
  const headersSerialized = JSON.stringify(initialHeaders);
  React.useEffect(() => {
    setHeaders(initialHeaders);
  }, [headersSerialized]);

  const getMethodBadge = (m: string) => {
    switch (m.toUpperCase()) {
      case 'GET':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'POST':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'PUT':
      case 'PATCH':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'DELETE':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleSend = async () => {
    setLoading(true);
    setStatusCode(null);
    setLatencyMs(null);

    const start = performance.now();
    try {
      const fullUrl = `${config.apiUrl}${currentPath.startsWith('/') ? currentPath : `/${currentPath}`}`;
      const headerObj: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      headers.forEach((h) => {
        if (h.key.trim()) headerObj[h.key.trim()] = h.value;
      });

      const options: RequestInit = {
        method,
        headers: headerObj,
        credentials: 'include',
      };

      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && body.trim()) {
        options.body = body;
      }

      const res = await fetch(fullUrl, options);
      const end = performance.now();
      setLatencyMs(Math.round(end - start));
      setStatusCode(res.status);

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await res.json();
        setResponse(json);
      } else {
        const text = await res.text();
        setResponse(text);
      }
    } catch (err: any) {
      setStatusCode(0);
      setResponse({ error: 'Network error or server unreachable', details: err.message });
    } finally {
      setLoading(false);
      setActiveTab('response');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(
      typeof response === 'string' ? response : JSON.stringify(response, null, 2)
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Console Header */}
      <div className="border-b border-slate-100 bg-slate-50/70 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900">{title}</h4>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>

        {/* URL Bar & Method & Run Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border shrink-0 ${getMethodBadge(
              method
            )}`}
          >
            {method}
          </span>

          <input
            type="text"
            value={currentPath}
            onChange={(e) => setCurrentPath(e.target.value)}
            className="flex-1 sm:w-64 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-mono text-slate-800 focus:outline-indigo-500"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={loading}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Icon icon="ph:spinner-bold" className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Icon icon="ph:play-bold" className="w-3.5 h-3.5" />
            )}
            <span>Send</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-100 px-4 sm:px-5 py-2 flex items-center justify-between bg-white text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('response')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              activeTab === 'response'
                ? 'bg-slate-100 text-slate-900 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Response
          </button>
          {['POST', 'PUT', 'PATCH'].includes(method) && (
            <button
              type="button"
              onClick={() => setActiveTab('body')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                activeTab === 'body'
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Payload
            </button>
          )}
          {headers.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('headers')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                activeTab === 'headers'
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Headers ({headers.length})
            </button>
          )}
        </div>

        {statusCode !== null && (
          <div className="flex items-center gap-2 font-mono text-xs">
            <span
              className={`px-2 py-0.5 rounded font-bold ${
                statusCode >= 200 && statusCode < 300
                  ? 'bg-emerald-50 text-emerald-700'
                  : statusCode >= 400
                  ? 'bg-rose-50 text-rose-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {statusCode === 0 ? 'Network Error' : `${statusCode} Status`}
            </span>
            {latencyMs !== null && <span className="text-slate-400">{latencyMs}ms</span>}
          </div>
        )}
      </div>

      {/* Tab Panels */}
      <div className="p-4 sm:p-5 bg-slate-900 relative min-h-[140px]">
        {activeTab === 'response' && (
          <>
            {response ? (
              <>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Icon icon={copied ? 'ph:check-bold' : 'ph:copy-bold'} className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <pre className="font-mono text-xs text-emerald-400 overflow-x-auto max-h-96 leading-relaxed">
                  {typeof response === 'string' ? response : JSON.stringify(response, null, 2)}
                </pre>
              </>
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                Click &quot;Send&quot; above to execute this request against the live server.
              </div>
            )}
          </>
        )}

        {activeTab === 'body' && (
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            className="w-full bg-slate-950 font-mono text-xs text-slate-100 p-3 rounded-lg border border-slate-800 focus:outline-indigo-500"
          />
        )}

        {activeTab === 'headers' && (
          <div className="space-y-2">
            {headers.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <span className="text-indigo-400 font-bold">{h.key}:</span>
                <span>{h.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
