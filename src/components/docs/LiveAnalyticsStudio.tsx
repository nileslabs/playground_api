'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

interface AnalyticsEvent {
  id: string;
  event: string;
  userId: string;
  properties: Record<string, unknown>;
  traits?: Record<string, unknown>;
  timestamp: string;
  context?: {
    ip?: string;
    userAgent?: string;
    [key: string]: unknown;
  };
  created_at: string;
}

interface AnalyticsSummary {
  totalEvents: number;
  uniqueEventTypes: number;
  uniqueUsers: number;
  eventCounts: Record<string, number>;
  topEvents: Array<{ event: string; count: number; percentage: number }>;
  recentEvents: AnalyticsEvent[];
  timeline: Array<{ time: string; count: number }>;
}

const PRESET_EVENTS = [
  {
    label: 'Page View (/pricing)',
    icon: 'ph:browser-bold',
    color: 'blue',
    badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    payload: {
      event: 'page_view',
      userId: 'usr_dev_101',
      properties: {
        path: '/pricing',
        title: 'Pricing & Plans — SaaS App',
        referrer: 'https://google.com',
        browser: 'Chrome 128',
      },
    },
  },
  {
    label: 'Button Click (signup_hero)',
    icon: 'ph:cursor-click-bold',
    color: 'amber',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    payload: {
      event: 'button_click',
      userId: 'usr_dev_101',
      properties: {
        button_id: 'btn_hero_signup',
        position: 'above_fold',
        variant: 'gradient_purple',
      },
    },
  },
  {
    label: 'Identify User (Alice)',
    icon: 'ph:user-circle-gear-bold',
    color: 'purple',
    badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    payload: {
      event: 'identify',
      userId: 'usr_alice_77',
      traits: {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        plan: 'enterprise',
        company: 'Acme Corp',
      },
      properties: {
        source: 'sso_login',
      },
    },
  },
  {
    label: 'Cart Added (Pro Plan)',
    icon: 'ph:shopping-cart-bold',
    color: 'indigo',
    badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    payload: {
      event: 'cart_item_added',
      userId: 'usr_alice_77',
      properties: {
        sku: 'plan_pro_annual',
        price: 199.0,
        currency: 'USD',
        period: 'yearly',
      },
    },
  },
  {
    label: 'Checkout Succeeded',
    icon: 'ph:check-circle-bold',
    color: 'emerald',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    payload: {
      event: 'checkout_completed',
      userId: 'usr_alice_77',
      properties: {
        orderId: 'ord_987654321',
        total: 199.0,
        currency: 'USD',
        paymentMethod: 'card_visa',
        itemsCount: 1,
      },
    },
  },
];

export function LiveAnalyticsStudio() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [isClearing, setIsClearing] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [filterEvent, setFilterEvent] = useState<string>('');

  // Custom event inputs
  const [customEventName, setCustomEventName] = useState<string>('form_submitted');
  const [customUserId, setCustomUserId] = useState<string>('usr_custom_1');
  const [customPropsJson, setCustomPropsJson] = useState<string>(
    JSON.stringify({ formId: 'contact_sales', leadScore: 85 }, null, 2)
  );

  const getIdentityHeader = (): Record<string, string> => {
    const localToken = typeof window !== 'undefined' ? localStorage.getItem('pg_identity') : '';
    return localToken ? { 'X-Playground-Identity': localToken } : {};
  };

  const fetchEventsAndSummary = useCallback(async () => {
    try {
      const headers = {
        'Accept': 'application/json',
        ...getIdentityHeader(),
      };

      const [eventsRes, summaryRes] = await Promise.all([
        fetch(`${config.apiUrl}/analytics/events?limit=50${filterEvent ? `&event=${encodeURIComponent(filterEvent)}` : ''}`, {
          headers,
          credentials: 'include',
        }),
        fetch(`${config.apiUrl}/analytics/summary`, {
          headers,
          credentials: 'include',
        }),
      ]);

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData.data || []);
      }

      if (summaryRes.ok) {
        const summaryData = await summaryRes.json();
        setSummary(summaryData.summary || null);
      }
    } catch (err) {
      console.error('Failed to fetch analytics telemetry:', err);
    }
  }, [filterEvent]);

  useEffect(() => {
    setIsLoading(true);
    fetchEventsAndSummary().finally(() => setIsLoading(false));
  }, [fetchEventsAndSummary]);

  // Auto-refresh poll every 3 seconds if enabled
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchEventsAndSummary();
    }, 3000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchEventsAndSummary]);

  const dispatchPreset = async (preset: typeof PRESET_EVENTS[0]) => {
    setIsDispatching(true);
    try {
      const res = await fetch(`${config.apiUrl}/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...getIdentityHeader(),
        },
        credentials: 'include',
        body: JSON.stringify(preset.payload),
      });

      if (res.ok) {
        await fetchEventsAndSummary();
      }
    } catch (err) {
      console.error('Failed to dispatch preset:', err);
    } finally {
      setIsDispatching(false);
    }
  };

  const dispatchCustomEvent = async () => {
    if (!customEventName.trim()) return;
    setIsDispatching(true);

    let parsedProps = {};
    try {
      parsedProps = JSON.parse(customPropsJson);
    } catch {
      parsedProps = { rawInput: customPropsJson };
    }

    try {
      const res = await fetch(`${config.apiUrl}/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...getIdentityHeader(),
        },
        credentials: 'include',
        body: JSON.stringify({
          event: customEventName.trim(),
          userId: customUserId.trim() || 'anonymous',
          properties: parsedProps,
        }),
      });

      if (res.ok) {
        await fetchEventsAndSummary();
      }
    } catch (err) {
      console.error('Failed to dispatch custom event:', err);
    } finally {
      setIsDispatching(false);
    }
  };

  const clearStream = async () => {
    setIsClearing(true);
    try {
      const res = await fetch(`${config.apiUrl}/analytics/events`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          ...getIdentityHeader(),
        },
        credentials: 'include',
      });

      if (res.ok) {
        setEvents([]);
        setSummary(null);
        await fetchEventsAndSummary();
      }
    } catch (err) {
      console.error('Failed to clear stream:', err);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="not-prose my-8 rounded-2xl border border-border/80 bg-gradient-to-b from-card/90 to-card/40 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/30 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-inner">
            <Icon icon="ph:chart-line-up-bold" className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-foreground">Live Analytics & Telemetry Stream</h3>
              <span className="flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Ingestion
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Simulate PostHog, Mixpanel, and Segment event tracking in your isolated session sandbox.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
              autoRefresh
                ? 'border-purple-500/30 bg-purple-500/10 text-purple-300'
                : 'border-border/60 bg-background/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon icon={autoRefresh ? 'ph:broadcast-bold' : 'ph:pause-bold'} className="h-3.5 w-3.5" />
            {autoRefresh ? 'Live Polling On' : 'Polling Paused'}
          </button>

          <button
            onClick={clearStream}
            disabled={isClearing || events.length === 0}
            className="flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/20 transition-all disabled:opacity-40"
          >
            <Icon icon={isClearing ? 'ph:spinner-bold' : 'ph:trash-bold'} className={`h-3.5 w-3.5 ${isClearing ? 'animate-spin' : ''}`} />
            Clear Stream
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border/60 border-b border-border/60 bg-muted/10">
        <div className="p-4 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Total Ingested</span>
          <div className="text-xl font-bold font-mono text-foreground mt-0.5">{summary?.totalEvents ?? events.length}</div>
        </div>
        <div className="p-4 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Event Types</span>
          <div className="text-xl font-bold font-mono text-purple-400 mt-0.5">{summary?.uniqueEventTypes ?? 0}</div>
        </div>
        <div className="p-4 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Unique Users</span>
          <div className="text-xl font-bold font-mono text-blue-400 mt-0.5">{summary?.uniqueUsers ?? 0}</div>
        </div>
        <div className="p-4 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Top Event</span>
          <div className="text-sm font-semibold font-mono text-emerald-400 mt-1 truncate">
            {summary?.topEvents?.[0]?.event ?? 'None'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border/60">
        {/* Left Column: Quick Event Dispatcher */}
        <div className="lg:col-span-5 p-6 space-y-6">
          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
              1-Click Event Presets
            </label>
            <div className="space-y-2">
              {PRESET_EVENTS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => dispatchPreset(preset)}
                  disabled={isDispatching}
                  className="w-full flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 p-3 text-left transition-all group disabled:opacity-50"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-lg border ${preset.badgeClass}`}>
                      <Icon icon={preset.icon} className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-foreground">{preset.label}</div>
                      <div className="text-[10px] font-mono text-muted-foreground">{preset.payload.event}</div>
                    </div>
                  </div>
                  <Icon icon="ph:paper-plane-tilt-bold" className="h-4 w-4 text-muted-foreground group-hover:text-purple-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Custom Event Builder */}
          <div className="rounded-xl border border-border/60 bg-background/40 p-4 space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Custom Telemetry Beacon
            </label>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-muted-foreground block mb-1">Event Name</span>
                <input
                  type="text"
                  value={customEventName}
                  onChange={(e) => setCustomEventName(e.target.value)}
                  placeholder="e.g. video_played"
                  className="w-full rounded-lg border border-border/60 bg-card px-2.5 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block mb-1">User / Distinct ID</span>
                <input
                  type="text"
                  value={customUserId}
                  onChange={(e) => setCustomUserId(e.target.value)}
                  placeholder="e.g. usr_123"
                  className="w-full rounded-lg border border-border/60 bg-card px-2.5 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <span className="text-[10px] text-muted-foreground block mb-1">Event Properties (JSON)</span>
              <textarea
                value={customPropsJson}
                onChange={(e) => setCustomPropsJson(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-border/60 bg-card p-2.5 text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              onClick={dispatchCustomEvent}
              disabled={isDispatching || !customEventName.trim()}
              className="w-full rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs py-2.5 px-4 shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Icon icon="ph:play-fill" className="h-3.5 w-3.5" />
              {isDispatching ? 'Dispatching...' : 'Dispatch Custom Beacon'}
            </button>
          </div>
        </div>

        {/* Right Column: Live Event Stream Timeline */}
        <div className="lg:col-span-7 p-6 flex flex-col justify-between bg-muted/10 space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Icon icon="ph:stream-bold" className="h-4 w-4 text-purple-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Ingested Event Stream
                </span>
              </div>

              {/* Event Filter */}
              <div className="flex items-center gap-1.5">
                <Icon icon="ph:magnifying-glass-bold" className="h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={filterEvent}
                  onChange={(e) => setFilterEvent(e.target.value)}
                  placeholder="Filter event..."
                  className="rounded-lg border border-border/60 bg-card px-2 py-1 text-[11px] font-mono text-foreground focus:outline-none focus:border-purple-500 w-28 sm:w-36"
                />
              </div>
            </div>

            {isLoading && events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                <Icon icon="ph:spinner-bold" className="h-6 w-6 text-purple-400 animate-spin" />
                <p className="text-xs text-muted-foreground">Loading telemetry stream...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                  <Icon icon="ph:radar-bold" className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-foreground">No Telemetry Events Recorded Yet</p>
                  <p className="text-[11px] text-muted-foreground max-w-xs">
                    Click any preset event on the left or send a <code className="text-purple-300 font-mono">POST /api/v1/analytics/track</code> request.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {events.map((evt) => {
                  const isExpanded = expandedEventId === evt.id;
                  const isPage = evt.event.includes('page');
                  const isCheckout = evt.event.includes('checkout') || evt.event.includes('order');
                  const isIdentify = evt.event === 'identify';

                  const badgeClass = isPage
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    : isCheckout
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : isIdentify
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20';

                  const formattedTime = new Date(evt.timestamp || evt.created_at).toLocaleTimeString();

                  return (
                    <div
                      key={evt.id}
                      className="rounded-xl border border-border/60 bg-card/60 hover:bg-card/90 transition-all overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedEventId(isExpanded ? null : evt.id)}
                        className="w-full flex items-center justify-between p-3 text-left"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`rounded-md px-2 py-0.5 text-[11px] font-mono font-bold border shrink-0 ${badgeClass}`}>
                            {evt.event}
                          </span>
                          <span className="text-xs font-mono text-muted-foreground truncate">
                            {evt.userId}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-mono text-muted-foreground">{formattedTime}</span>
                          <Icon
                            icon={isExpanded ? 'ph:caret-up-bold' : 'ph:caret-down-bold'}
                            className="h-3 w-3 text-muted-foreground"
                          />
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-border/40 p-3 bg-black/30 space-y-2">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-muted-foreground">Event ID:</span>
                            <span className="font-mono text-purple-300">{evt.id}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-semibold uppercase text-muted-foreground block mb-1">
                              Payload Properties & Traits:
                            </span>
                            <pre className="text-[11px] font-mono p-2.5 rounded-lg bg-black/50 text-emerald-300 border border-border/40 overflow-x-auto">
                              {JSON.stringify({ properties: evt.properties, traits: evt.traits, context: evt.context }, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Integration Footer */}
          <div className="rounded-xl border border-border/60 bg-background/40 p-3 flex items-start gap-2.5">
            <Icon icon="ph:info-bold" className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Events are stored in your isolated session sandbox (<code className="text-purple-300 font-mono">resource = analytics_events</code>) and can be queried or cleared anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
