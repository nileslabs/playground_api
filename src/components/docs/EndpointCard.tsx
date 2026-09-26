'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { EndpointDef } from '@/config/api-catalog';
import config from '@/config/env';

interface EndpointCardProps {
  endpoint: EndpointDef;
}

export function EndpointCard({ endpoint }: EndpointCardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'tester' | 'code'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(endpoint.responseExample);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [customBody, setCustomBody] = useState<string>(
    endpoint.requestBody ? JSON.stringify(endpoint.requestBody, null, 2) : ''
  );

  const fullUrl = `${config.apiUrl}${endpoint.path}`;

  const getMethodBadge = (method: string) => {
    switch (method.toUpperCase()) {
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

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  const handleRunRequest = async () => {
    setIsLoading(true);
    const start = performance.now();

    try {
      // Replace :id with 1 for quick testing
      const testPath = endpoint.path.replace(/:[a-zA-Z0-9_]+/g, '1');
      const targetUrl = `${config.apiUrl}${testPath}`;

      const options: RequestInit = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
      };

      if (['POST', 'PUT', 'PATCH'].includes(endpoint.method) && customBody) {
        options.body = customBody;
      }

      const res = await fetch(targetUrl, options);
      const data = await res.json().catch(() => ({ status: 'error', message: 'Non-JSON response' }));
      const duration = Math.round(performance.now() - start);

      setResponse(data);
      setStatusCode(res.status);
      setLatencyMs(duration);
    } catch (err: any) {
      setResponse({ error: err.message || 'Network error occurred' });
      setStatusCode(500);
      setLatencyMs(Math.round(performance.now() - start));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id={endpoint.id}
      className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden transition-all hover:shadow-sm"
    >
      {/* 1. Header Bar with Method, Endpoint Path & Action Tabs */}
      <div className="border-b border-slate-200 bg-slate-50/70 px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold border uppercase tracking-wider ${getMethodBadge(endpoint.method)}`}>
            {endpoint.method}
          </span>
          <span className="font-mono text-xs sm:text-sm font-semibold text-slate-800 truncate select-all">
            {endpoint.path}
          </span>
        </div>

        {/* Tab Switcher: Overview vs Try It vs Code */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-white text-indigo-700 font-semibold border border-slate-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            Specification
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tester')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'tester'
                ? 'bg-indigo-600 text-white font-semibold shadow-2xs'
                : 'text-indigo-600 hover:bg-indigo-50 font-semibold'
            }`}
          >
            <Icon icon="ph:play-circle-bold" className="w-3.5 h-3.5" />
            <span>Try Live</span>
          </button>
        </div>
      </div>

      {/* 2. Endpoint Title & Description */}
      <div className="px-5 sm:px-6 py-4 border-b border-slate-100 bg-white">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          {endpoint.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          {endpoint.description}
        </p>
      </div>

      {/* 3. Tab: Overview (Parameters + Response Example) */}
      {activeTab === 'overview' && (
        <div className="p-5 sm:p-6 space-y-6">
          {/* Query Parameters Table if available */}
          {endpoint.queryParams && endpoint.queryParams.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Query & Path Parameters
              </span>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Parameter</th>
                      <th className="py-2.5 px-3 font-semibold">Type</th>
                      <th className="py-2.5 px-3 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {endpoint.queryParams.map((param) => (
                      <tr key={param.name}>
                        <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">{param.name}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{param.type}</td>
                        <td className="py-2.5 px-3">{param.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Request Body Example if available */}
          {endpoint.requestBody && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Sample Request Payload
              </span>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-800 overflow-x-auto">
                <pre>{JSON.stringify(endpoint.requestBody, null, 2)}</pre>
              </div>
            </div>
          )}

          {/* Response Schema / Sample */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Sample JSON Response
              </span>
              <button
                type="button"
                onClick={handleCopyResponse}
                className="text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
              >
                <Icon icon={copiedResponse ? 'ph:check-bold' : 'ph:copy-bold'} className="w-3.5 h-3.5" />
                <span>{copiedResponse ? 'Copied' : 'Copy Response'}</span>
              </button>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 font-mono text-xs text-emerald-400 overflow-x-auto max-h-72">
              <pre>{JSON.stringify(endpoint.responseExample, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}

      {/* 4. Tab: Try Live Interactive Tester */}
      {activeTab === 'tester' && (
        <div className="p-5 sm:p-6 space-y-5 bg-slate-50/30">
          {/* URL + Send Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="flex-1 flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-mono text-xs sm:text-sm text-slate-800 overflow-x-auto shadow-2xs">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border uppercase ${getMethodBadge(endpoint.method)}`}>
                {endpoint.method}
              </span>
              <span className="truncate select-all text-slate-700">{fullUrl}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyUrl}
                className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-medium transition-all shadow-2xs flex items-center gap-1.5"
                title="Copy cURL / URL"
              >
                <Icon icon={copiedUrl ? 'ph:check-bold' : 'ph:copy-bold'} className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{copiedUrl ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={handleRunRequest}
                disabled={isLoading}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Icon icon="ph:spinner-bold" className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <Icon icon="ph:paper-plane-tilt-bold" className="w-3.5 h-3.5" />
                    <span>Send Request</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Editable Request Body if applicable */}
          {['POST', 'PUT', 'PATCH'].includes(endpoint.method) && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Editable JSON Request Body</label>
              <textarea
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-xl border border-slate-200 bg-white font-mono text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
          )}

          {/* Live Response Box */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Live Response</span>
                {statusCode && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    statusCode < 300 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {statusCode} OK
                  </span>
                )}
                {latencyMs !== null && (
                  <span className="text-[11px] font-mono text-slate-400">
                    {latencyMs}ms
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleCopyResponse}
                className="text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
              >
                <Icon icon={copiedResponse ? 'ph:check-bold' : 'ph:copy-bold'} className="w-3.5 h-3.5" />
                <span>{copiedResponse ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 font-mono text-xs text-emerald-400 overflow-x-auto max-h-80 shadow-inner">
              <pre>{JSON.stringify(response, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EndpointCard;
