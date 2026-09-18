'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

interface RequestLog {
  id: string;
  timestamp: string;
  url: string;
  status: number;
  durationMs: number;
  isChaos: boolean;
  response: Record<string, unknown> | null;
}

const ERROR_OPTIONS = [
  { code: 504, label: '504 Gateway Timeout' },
  { code: 503, label: '503 Service Unavailable' },
  { code: 500, label: '500 Internal Server Error' },
  { code: 429, label: '429 Too Many Requests' },
  { code: 408, label: '408 Request Timeout' },
];

export function LiveChaosTester() {
  const [failureRate, setFailureRate] = useState<number>(0.4);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/posts');
  const [selectedErrors, setSelectedErrors] = useState<number[]>([504, 503, 500, 429, 408]);
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const toggleError = (code: number) => {
    setSelectedErrors((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const fireRequest = async () => {
    const start = performance.now();
    const headers: Record<string, string> = {
      'X-Simulate-Chaos': String(failureRate),
    };

    if (selectedErrors.length > 0 && selectedErrors.length < ERROR_OPTIONS.length) {
      headers['X-Simulate-Chaos-Errors'] = selectedErrors.join(',');
    }

    const localToken = typeof window !== 'undefined' ? localStorage.getItem('pg_identity') : '';
    if (localToken) {
      headers['X-Playground-Identity'] = localToken;
    }

    const requestUrl = `${config.apiUrl}${selectedEndpoint}?limit=3`;

    try {
      const res = await fetch(requestUrl, {
        headers,
        credentials: 'include',
        cache: 'no-cache',
      });
      const durationMs = Math.round(performance.now() - start);
      const isChaos = res.headers.get('x-playground-chaos') === 'injected' || res.status >= 400;
      let data = null;
      try {
        data = await res.json();
      } catch {
        data = { error: 'Failed to parse JSON' };
      }

      const logItem: RequestLog = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        url: requestUrl,
        status: res.status,
        durationMs,
        isChaos,
        response: data,
      };

      setLogs((prev) => [logItem, ...prev.slice(0, 19)]);
    } catch (err) {
      const durationMs = Math.round(performance.now() - start);
      setLogs((prev) => [
        {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toLocaleTimeString(),
          url: requestUrl,
          status: 0,
          durationMs,
          isChaos: true,
          response: { error: 'Network Connection Failed' },
        },
        ...prev.slice(0, 19),
      ]);
    }
  };

  const fireBatch = async (count: number = 5) => {
    setLoading(true);
    const promises = Array.from({ length: count }, () => fireRequest());
    await Promise.all(promises);
    setLoading(false);
  };

  const totalFired = logs.length;
  const chaosCount = logs.filter((l) => l.isChaos).length;
  const successCount = totalFired - chaosCount;
  const observedFailurePct = totalFired > 0 ? Math.round((chaosCount / totalFired) * 100) : 0;
  const avgLatency =
    totalFired > 0 ? Math.round(logs.reduce((acc, l) => acc + l.durationMs, 0) / totalFired) : 0;

  return (
    <div className="p-6 rounded-3xl bg-code-bg border border-border-theme space-y-6 shadow-2xl">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border-theme">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/15 text-amber-400 rounded-2xl border border-amber-500/30">
            <Icon icon="ph:lightning-slash-bold" className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-text-primary">Interactive Chaos Engine Runner</h3>
            <p className="text-xs sm:text-sm text-text-secondary">
              Inject random failure probabilities & latency jitter in real-time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-accent-light text-accent-primary border border-accent-primary/20">
            Probability: {Math.round(failureRate * 100)}%
          </span>
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Failure Rate & Endpoints */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                Failure Probability Rate:
              </label>
              <span className="text-xs font-bold font-mono text-amber-400">
                {Math.round(failureRate * 100)}% Chance of Failure
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={failureRate}
              onChange={(e) => setFailureRate(parseFloat(e.target.value))}
              className="w-full h-2 bg-bg-secondary rounded-lg appearance-none cursor-pointer accent-accent-primary"
            />

            {/* Presets */}
            <div className="flex items-center gap-2 pt-1">
              {[
                { label: '0% (Clean)', val: 0.0 },
                { label: '25% (Mild)', val: 0.25 },
                { label: '50% (Flaky)', val: 0.5 },
                { label: '75% (Severe)', val: 0.75 },
                { label: '100% (Down)', val: 1.0 },
              ].map((p) => (
                <button
                  key={p.val}
                  onClick={() => setFailureRate(p.val)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                    failureRate === p.val
                      ? 'bg-accent-primary text-white border-accent-primary shadow-xs'
                      : 'bg-bg-secondary text-text-secondary border-border-theme hover:text-text-primary'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Endpoint Switcher */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Target Test Endpoint:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['/posts', '/users', '/comments', '/todos'].map((ep) => (
                <button
                  key={ep}
                  onClick={() => setSelectedEndpoint(ep)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
                    selectedEndpoint === ep
                      ? 'bg-accent-light text-accent-primary border-accent-primary/40'
                      : 'bg-bg-secondary text-text-secondary border-border-theme hover:text-text-primary'
                  }`}
                >
                  {ep}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Error Status Pool Override */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Allowed Chaos Status Codes:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ERROR_OPTIONS.map((opt) => {
                const checked = selectedErrors.includes(opt.code);
                return (
                  <button
                    key={opt.code}
                    onClick={() => toggleError(opt.code)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all border cursor-pointer ${
                      checked
                        ? 'bg-bg-secondary text-text-primary border-accent-primary/40'
                        : 'bg-bg-tertiary/40 text-text-muted border-border-theme opacity-60'
                    }`}
                  >
                    <Icon
                      icon={checked ? 'ph:check-square-fill' : 'ph:square-bold'}
                      className={`w-4 h-4 ${checked ? 'text-accent-primary' : 'text-text-muted'}`}
                    />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Execution Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => fireBatch(1)}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent-primary hover:bg-accent-hover text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              <Icon icon="ph:play-bold" className="w-4 h-4" />
              <span>Fire 1 Request</span>
            </button>
            <button
              onClick={() => fireBatch(5)}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              <Icon icon={loading ? 'ph:spinner-bold' : 'ph:lightning-bold'} className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Fire 5 In Parallel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Metrics Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
        <div className="p-3 rounded-xl bg-bg-secondary border border-border-theme space-y-0.5">
          <div className="text-xl sm:text-2xl font-black text-text-primary">{totalFired}</div>
          <div className="text-[11px] text-text-secondary font-medium">Total Fired</div>
        </div>
        <div className="p-3 rounded-xl bg-bg-secondary border border-border-theme space-y-0.5">
          <div className="text-xl sm:text-2xl font-black text-emerald-400">{successCount}</div>
          <div className="text-[11px] text-text-secondary font-medium">200 OK (Passed)</div>
        </div>
        <div className="p-3 rounded-xl bg-bg-secondary border border-border-theme space-y-0.5">
          <div className="text-xl sm:text-2xl font-black text-rose-400">{chaosCount}</div>
          <div className="text-[11px] text-text-secondary font-medium">Chaos Injected</div>
        </div>
        <div className="p-3 rounded-xl bg-bg-secondary border border-border-theme space-y-0.5">
          <div className="text-xl sm:text-2xl font-black text-amber-400">{observedFailurePct}%</div>
          <div className="text-[11px] text-text-secondary font-medium">Observed Rate</div>
        </div>
        <div className="p-3 rounded-xl bg-bg-secondary border border-border-theme space-y-0.5 col-span-2 sm:col-span-1">
          <div className="text-xl sm:text-2xl font-black text-sky-400">{avgLatency}ms</div>
          <div className="text-[11px] text-text-secondary font-medium">Avg Latency</div>
        </div>
      </div>

      {/* Live Request Stream */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
            <Icon icon="ph:activity-bold" className="w-4 h-4 text-accent-primary" />
            Live Request Stream (Latest 20)
          </span>
          {logs.length > 0 && (
            <button
              onClick={() => setLogs([])}
              className="text-xs text-text-muted hover:text-rose-400 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Icon icon="ph:trash-bold" className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {logs.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-bg-secondary border border-border-theme text-text-muted text-xs font-mono space-y-1">
            <Icon icon="ph:radio-bold" className="w-8 h-8 mx-auto text-text-muted/60" />
            <p>No test requests fired yet.</p>
            <p className="text-[11px] text-text-muted/80">Click &quot;Fire 1 Request&quot; or &quot;Fire 5 In Parallel&quot; above.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => {
              const isSuccess = log.status === 200;
              const isExpanded = expandedLogId === log.id;

              return (
                <div
                  key={log.id}
                  className="rounded-xl bg-bg-secondary border border-border-theme overflow-hidden transition-all"
                >
                  <div
                    onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-2 cursor-pointer hover:bg-bg-tertiary/50 transition-colors text-xs font-mono"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                          isSuccess
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : log.status === 429
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {log.status === 0 ? 'FAIL' : `HTTP ${log.status}`}
                      </span>

                      <span className="text-text-primary font-semibold">GET {log.url.split(config.apiUrl)[1]}</span>
                      {log.isChaos && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-sans font-bold bg-amber-500/20 text-amber-400">
                          🎲 Chaos Injected
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-text-muted font-sans text-xs">
                      <span className="flex items-center gap-1">
                        <Icon icon="ph:timer-bold" className="w-3.5 h-3.5" />
                        <strong>{log.durationMs}ms</strong>
                      </span>
                      <span>{log.timestamp}</span>
                      <Icon
                        icon="ph:caret-down-bold"
                        className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-3 bg-code-bg border-t border-border-theme font-mono text-xs overflow-x-auto text-emerald-400 select-all">
                      <pre>{JSON.stringify(log.response, null, 2)}</pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
