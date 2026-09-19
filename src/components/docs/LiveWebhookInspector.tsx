'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface Webhook {
  id: string | number;
  name?: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  created_at: string;
}

interface DeliveryLog {
  id: string;
  webhookId: string | number;
  webhookUrl: string;
  event: string;
  status: number;
  success: boolean;
  durationMs: number;
  requestHeaders: Record<string, string>;
  requestBody: {
    id: string;
    event: string;
    timestamp: string;
    data: Record<string, unknown>;
  };
  responseBody: string;
  error?: string | null;
  timestamp: string;
}

const AVAILABLE_EVENTS = [
  { id: '*', label: 'All Events (*)' },
  { id: 'post.*', label: 'Posts (post.*)' },
  { id: 'user.*', label: 'Users (user.*)' },
  { id: 'comment.*', label: 'Comments (comment.*)' },
  { id: 'todo.*', label: 'Todos (todo.*)' },
  { id: 'auth.*', label: 'Auth (auth.*)' },
  { id: 'custom.*', label: 'Custom Collections (custom.*)' },
];

export function LiveWebhookInspector() {
  const [activeTab, setActiveTab] = useState<'deliveries' | 'register' | 'endpoints'>('deliveries');
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Form State
  const [formUrl, setFormUrl] = useState<string>('https://httpbin.org/post');
  const [formName, setFormName] = useState<string>('My Webhook Receiver');
  const [formSecret, setFormSecret] = useState<string>('whsec_demo_secret_key_123');
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['post.*', 'auth.*']);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const rawApiUrl = config.publicApiUrl || 'http://localhost:5000/api/v1';

  const fetchData = async () => {
    try {
      setLoading(true);
      const [whRes, delRes] = await Promise.all([
        fetch(`${rawApiUrl}/webhooks`, { credentials: 'include' }),
        fetch(`${rawApiUrl}/webhooks/deliveries`, { credentials: 'include' })
      ]);

      if (whRes.ok) {
        const json = await whRes.json();
        setWebhooks(json.data || []);
      }
      if (delRes.ok) {
        const json = await delRes.json();
        setDeliveries(json.data || []);
      }
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, [rawApiUrl]);

  const toggleEvent = (ev: string) => {
    if (ev === '*') {
      setSelectedEvents(selectedEvents.includes('*') ? [] : ['*']);
      return;
    }
    const filtered = selectedEvents.filter((e) => e !== '*');
    if (filtered.includes(ev)) {
      setSelectedEvents(filtered.filter((e) => e !== ev));
    } else {
      setSelectedEvents([...filtered, ev]);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUrl) return;

    try {
      setSubmitting(true);
      setFeedback(null);
      const res = await fetch(`${rawApiUrl}/webhooks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formName,
          url: formUrl,
          secret: formSecret,
          events: selectedEvents.length > 0 ? selectedEvents : ['*']
        })
      });

      if (res.ok) {
        setFeedback({ type: 'success', message: 'Webhook endpoint registered successfully!' });
        await fetchData();
        setActiveTab('deliveries');
      } else {
        const err = await res.json();
        setFeedback({ type: 'error', message: err.message || 'Failed to register webhook' });
      }
    } catch (err: unknown) {
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Network error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTestPing = async (webhookId?: string | number) => {
    try {
      setLoading(true);
      const endpoint = webhookId
        ? `${rawApiUrl}/webhooks/${webhookId}/test`
        : `${rawApiUrl}/webhooks/test`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          event: 'test.ping',
          data: {
            message: 'Manual test ping from Playground API Webhook Inspector Studio',
            triggeredAt: new Date().toISOString()
          }
        })
      });

      if (res.ok) {
        await fetchData();
        setActiveTab('deliveries');
      }
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  const handleRedeliver = async (deliveryId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`${rawApiUrl}/webhooks/deliveries/${deliveryId}/redeliver`, {
        method: 'POST',
        credentials: 'include'
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (webhookId: string | number) => {
    try {
      setLoading(true);
      const res = await fetch(`${rawApiUrl}/webhooks/${webhookId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/90 shadow-2xl backdrop-blur-xl overflow-hidden my-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-slate-950/60 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/30">
            <Icon icon="ph:paper-plane-tilt-bold" className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span>Webhook Dispatcher &amp; Inspector Studio</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {webhooks.length} Active {webhooks.length === 1 ? 'Receiver' : 'Receivers'}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Live HMAC SHA-256 signed event delivery inspector and retry sandbox
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-900 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('deliveries')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'deliveries'
                ? 'bg-violet-500 text-slate-950 font-semibold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon icon="ph:clock-counter-clockwise-bold" className="w-3.5 h-3.5" />
            Delivery Logs ({deliveries.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'register'
                ? 'bg-violet-500 text-slate-950 font-semibold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon icon="ph:plus-circle-bold" className="w-3.5 h-3.5" />
            Add Receiver
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('endpoints')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'endpoints'
                ? 'bg-violet-500 text-slate-950 font-semibold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon icon="ph:list-bullets-bold" className="w-3.5 h-3.5" />
            Active Receivers ({webhooks.length})
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      <div className="p-6">
        {/* TAB 1: DELIVERY LOGS */}
        {activeTab === 'deliveries' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-400">
                Recent outgoing webhook deliveries. Click any row to inspect signed headers and JSON payloads.
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleTestPing()}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-violet-300 text-xs font-medium border border-slate-700 transition"
                >
                  <Icon icon="ph:paper-plane-right-bold" className="w-3.5 h-3.5" />
                  Send Test Ping
                </button>
                <button
                  type="button"
                  onClick={fetchData}
                  disabled={loading}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
                >
                  <Icon icon="ph:arrows-clockwise-bold" className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {deliveries.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-xs text-slate-500 font-mono">
                No webhook deliveries recorded yet. Perform a mutation (e.g. POST /posts) or click &quot;Send Test Ping&quot; above.
              </div>
            ) : (
              <div className="space-y-2">
                {deliveries.map((del) => {
                  const isExpanded = expandedLogId === del.id;
                  const isSuccess = del.success;

                  return (
                    <div
                      key={del.id}
                      className="rounded-xl border border-slate-800 bg-slate-950/40 overflow-hidden transition-all hover:border-slate-700"
                    >
                      <div
                        onClick={() => setExpandedLogId(isExpanded ? null : del.id)}
                        className="flex flex-wrap items-center justify-between gap-3 p-3.5 cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono border ${
                              isSuccess
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            }`}
                          >
                            {del.status > 0 ? `${del.status} ${isSuccess ? 'OK' : 'ERR'}` : 'FAILED'}
                          </span>

                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold font-mono bg-violet-500/10 text-violet-300 border border-violet-500/30">
                            {del.event}
                          </span>

                          <span className="text-xs text-slate-300 font-mono truncate max-w-xs md:max-w-md">
                            {del.webhookUrl}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                          <span>{del.durationMs}ms</span>
                          <span>{new Date(del.timestamp).toLocaleTimeString()}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRedeliver(del.id);
                            }}
                            title="Re-deliver this exact payload to receiver"
                            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
                          >
                            <Icon icon="ph:arrow-counter-clockwise-bold" className="w-3 h-3" />
                            Retry
                          </button>
                          <Icon
                            icon={isExpanded ? 'ph:caret-up-bold' : 'ph:caret-down-bold'}
                            className="w-4 h-4 text-slate-500"
                          />
                        </div>
                      </div>

                      {/* Expanded Details Drawer */}
                      {isExpanded && (
                        <div className="border-t border-slate-800/80 bg-slate-950/80 p-4 space-y-4 text-xs">
                          <div>
                            <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                              <Icon icon="ph:key-bold" className="text-violet-400 w-3.5 h-3.5" />
                              Dispatched Request Headers
                            </div>
                            <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-violet-300 overflow-x-auto">
                              {JSON.stringify(del.requestHeaders, null, 2)}
                            </pre>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                                <Icon icon="ph:code-bold" className="text-cyan-400 w-3.5 h-3.5" />
                                Payload Body
                              </div>
                              <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto max-h-48">
                                {JSON.stringify(del.requestBody, null, 2)}
                              </pre>
                            </div>

                            <div>
                              <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                                <Icon icon="ph:arrow-u-up-left-bold" className="text-emerald-400 w-3.5 h-3.5" />
                                Remote Response
                              </div>
                              <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-48">
                                {del.error ? `Error: ${del.error}` : del.responseBody || '(Empty body)'}
                              </pre>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REGISTER RECEIVER FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="max-w-2xl space-y-4 text-xs">
            {feedback && (
              <div
                className={`p-3 rounded-xl border ${
                  feedback.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                {feedback.message}
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Webhook Name (Optional)</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Local Dev Server / ngrok receiver"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Destination URL (HTTP / HTTPS)</label>
              <input
                type="url"
                required
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                placeholder="https://your-domain.ngrok.io/api/webhooks/playground"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                You can use services like <code>https://httpbin.org/post</code> or <code>https://webhook.site</code> for immediate testing.
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Signing Secret (HMAC-SHA256)</label>
              <input
                type="text"
                value={formSecret}
                onChange={(e) => setFormSecret(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Used to compute the <code>X-Playground-Signature</code> header.
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-2">Subscribed Event Triggers</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AVAILABLE_EVENTS.map((ev) => {
                  const isSelected = selectedEvents.includes(ev.id);
                  return (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => toggleEvent(ev.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border text-left font-mono text-[11px] transition ${
                        isSelected
                          ? 'bg-violet-500/20 border-violet-500 text-violet-300 font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon
                        icon={isSelected ? 'ph:check-square-fill' : 'ph:square'}
                        className={`w-4 h-4 ${isSelected ? 'text-violet-400' : 'text-slate-600'}`}
                      />
                      <span>{ev.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting || !formUrl}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-500 hover:bg-violet-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition"
              >
                <Icon icon="ph:plus-bold" className="w-4 h-4" />
                <span>{submitting ? 'Registering...' : 'Register Webhook'}</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: ACTIVE RECEIVERS LIST */}
        {activeTab === 'endpoints' && (
          <div className="space-y-3">
            {webhooks.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500 font-mono">
                No active webhooks registered. Click &quot;Add Receiver&quot; to create one.
              </div>
            ) : (
              webhooks.map((wh) => (
                <div
                  key={wh.id}
                  className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-950/40 text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-semibold text-white flex items-center gap-2">
                      <span>{wh.name || 'Webhook Endpoint'}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {wh.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <div className="font-mono text-slate-400 text-[11px]">{wh.url}</div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {wh.events?.map((ev) => (
                        <span
                          key={ev}
                          className="px-1.5 py-0.5 rounded bg-slate-800 text-violet-300 font-mono text-[10px]"
                        >
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleTestPing(wh.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium border border-slate-700 transition"
                    >
                      <Icon icon="ph:paper-plane-right-bold" className="w-3.5 h-3.5" />
                      Test Ping
                    </button>
                    {typeof wh.id === 'string' && wh.id.startsWith('local-') && (
                      <button
                        type="button"
                        onClick={() => handleDelete(wh.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
                        title="Delete Webhook"
                      >
                        <Icon icon="ph:trash-bold" className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
