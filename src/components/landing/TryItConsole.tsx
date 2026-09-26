'use client';

import React, { useState } from 'react';

interface EndpointPreset {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  body?: string;
  sampleResponse: any;
}

const presets: EndpointPreset[] = [
  {
    id: 'get-posts',
    name: 'Get Posts',
    method: 'GET',
    url: '/api/v1/posts?page=1&limit=2',
    sampleResponse: {
      status: 'success',
      data: [
        {
          id: 1,
          user_id: 1,
          title: 'sunt aut facere repellat provident occaecati excepturi optio',
          body: 'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam...',
          created_at: '2025-08-15T10:00:00Z'
        },
        {
          id: 2,
          user_id: 1,
          title: 'qui est esse',
          body: 'est rerum tempore vitae sequi sint nihil reprehenderit dolor beatae ea dolores neque fugiat blanditiis...',
          created_at: '2025-08-15T10:05:00Z'
        }
      ],
      meta: {
        page: 1,
        limit: 2,
        total: 100,
        total_pages: 50
      }
    }
  },
  {
    id: 'post-post',
    name: 'Create Post (Stateful)',
    method: 'POST',
    url: '/api/v1/posts',
    body: JSON.stringify(
      {
        title: 'Building modern apps with Playground API',
        body: 'This new post persists in your visitor session overlay across browser reloads!',
        user_id: 1
      },
      null,
      2
    ),
    sampleResponse: {
      status: 'success',
      message: 'Post created and saved in your isolated session overlay',
      data: {
        id: 'local-e83c27f1-799c-4933',
        user_id: 1,
        title: 'Building modern apps with Playground API',
        body: 'This new post persists in your visitor session overlay across browser reloads!',
        session_id: 'visitor-sandbox-f89a1c',
        created_at: '2026-09-25T09:30:15Z'
      }
    }
  },
  {
    id: 'relational',
    name: 'Sub-Resource (/users/1/posts)',
    method: 'GET',
    url: '/api/v1/users/1/posts?limit=2',
    sampleResponse: {
      status: 'success',
      user: {
        id: 1,
        name: 'Leanne Graham',
        username: 'Bret',
        email: 'Sincere@april.biz'
      },
      posts: [
        {
          id: 1,
          user_id: 1,
          title: 'sunt aut facere repellat provident occaecati excepturi optio'
        },
        {
          id: 2,
          user_id: 1,
          title: 'qui est esse'
        }
      ]
    }
  },
  {
    id: 'auth-login',
    name: 'JWT Auth Login',
    method: 'POST',
    url: '/api/v1/auth/login',
    body: JSON.stringify(
      {
        email: 'user@example.com',
        password: 'password123'
      },
      null,
      2
    ),
    sampleResponse: {
      status: 'success',
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      token_type: 'Bearer',
      expires_in: 3600,
      user: {
        id: 'usr_mock_9921',
        email: 'user@example.com',
        role: 'developer',
        permissions: ['read:all', 'write:sandbox']
      }
    }
  },
  {
    id: 'virtual-inbox',
    name: 'Virtual Inbox & OTP',
    method: 'GET',
    url: '/api/v1/inbox?limit=1',
    sampleResponse: {
      status: 'success',
      inbox: [
        {
          id: 'msg_9841',
          to: 'visitor@example.com',
          subject: 'Your One-Time Passcode (OTP)',
          otp_code: '849201',
          body: 'Your verification code is 849201. It expires in 10 minutes.',
          received_at: 'Just now'
        }
      ]
    }
  },
  {
    id: 'latency',
    name: 'Chaos Delay (?_delay=1200)',
    method: 'GET',
    url: '/api/v1/posts/1?_delay=1200',
    sampleResponse: {
      status: 'success',
      data: {
        id: 1,
        title: 'Network latency simulation completed successfully',
        simulated_delay_ms: 1200
      }
    }
  }
];

export function TryItConsole() {
  const [activePreset, setActivePreset] = useState<EndpointPreset>(presets[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(presets[0].sampleResponse);
  const [copied, setCopied] = useState(false);
  const [statusCode, setStatusCode] = useState(200);
  const [latencyMs, setLatencyMs] = useState(14);

  const handleSelectPreset = (p: EndpointPreset) => {
    setActivePreset(p);
    setResponse(p.sampleResponse);
    setStatusCode(p.method === 'POST' ? 201 : 200);
    setLatencyMs(p.url.includes('_delay') ? 1220 : Math.floor(Math.random() * 15) + 10);
  };

  const handleSendRequest = () => {
    setIsLoading(true);
    const delay = activePreset.url.includes('_delay') ? 1200 : 250;
    setTimeout(() => {
      setIsLoading(false);
      setResponse(activePreset.sampleResponse);
      setStatusCode(activePreset.method === 'POST' ? 201 : 200);
      setLatencyMs(activePreset.url.includes('_delay') ? 1215 : Math.floor(Math.random() * 15) + 12);
    }, delay);
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMethodBadgeClass = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'POST':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'PUT':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'DELETE':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <section id="try-it" className="py-20 md:py-28 bg-slate-50/50 border-b border-slate-200/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
            Interactive Test Bench
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Try it live in one click
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Select an endpoint preset below and hit send. Real responses, stateful mutations, and chaos edge cases at your fingertips.
          </p>
        </div>

        {/* Console Container */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Preset Buttons Bar */}
          <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">
              Presets:
            </span>
            {presets.map((p) => {
              const isSelected = p.id === activePreset.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all shrink-0 ${
                    isSelected
                      ? 'bg-white text-indigo-700 font-semibold shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${getMethodBadgeClass(
                      p.method
                    )}`}
                  >
                    {p.method}
                  </span>
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>

          {/* URL & Action Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs sm:text-sm text-slate-800 overflow-x-auto">
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold border ${getMethodBadgeClass(
                  activePreset.method
                )}`}
              >
                {activePreset.method}
              </span>
              <span className="text-slate-400 select-none">https://playground.nileslabs.com</span>
              <span className="font-semibold text-slate-900">{activePreset.url}</span>
            </div>

            <button
              type="button"
              onClick={handleSendRequest}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-75 rounded-xl shadow-xs transition-all active:scale-[0.98] shrink-0"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <span>Send Request</span>
                </>
              )}
            </button>
          </div>

          {/* Request Payload (if POST) + Response Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 bg-white">
            {/* Optional Request Body column if POST */}
            {activePreset.body && (
              <div className="lg:col-span-5 p-4 sm:p-6 bg-slate-50/40 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <span>Request Payload (JSON)</span>
                  <span className="font-mono text-[11px] text-slate-400 font-normal">Content-Type: application/json</span>
                </div>
                <pre className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed overflow-x-auto shadow-2xs max-h-80">
                  <code>{activePreset.body}</code>
                </pre>
              </div>
            )}

            {/* Response Viewer Column */}
            <div className={`${activePreset.body ? 'lg:col-span-7' : 'lg:col-span-12'} p-4 sm:p-6 space-y-3 bg-white`}>
              {/* Header meta bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Live Response
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {statusCode} OK
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    ⚡ {latencyMs}ms
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyResponse}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  {copied ? (
                    <>
                      <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-emerald-600 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
              </div>

              {/* Formatted JSON block */}
              <div className="relative rounded-xl border border-slate-200 bg-slate-900 text-slate-100 p-4 font-mono text-xs leading-relaxed overflow-x-auto max-h-96 shadow-inner">
                <pre>
                  <code>{JSON.stringify(response, null, 2)}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
