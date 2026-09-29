'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface RotationPreset {
  id: string;
  label: string;
  icon: string;
  desc: string;
  payload: Record<string, any>;
  headers?: Record<string, string>;
}

const PRESETS: RotationPreset[] = [
  {
    id: 'valid-rotation',
    label: 'Standard Token Rotation',
    icon: 'ph:arrows-clockwise-bold',
    desc: 'Submits a valid refresh token. Backend verifies validity, invalidates the old token, and issues a fresh token pair.',
    payload: {
      refreshToken: 'sample-refresh-token-from-login',
    },
  },
  {
    id: 'reuse-attack',
    label: 'Token Reuse Attack Simulation',
    icon: 'ph:shield-warning-bold',
    desc: 'Re-submits an already consumed refresh token. Gateway flags a security breach and revokes the entire token family.',
    payload: {
      refreshToken: 'already-consumed-stolen-token-sample',
    },
    headers: {
      'X-Simulate-Token-Reuse': 'true',
    },
  },
  {
    id: 'short-ttl',
    label: 'Rotation with Short TTL (5s)',
    icon: 'ph:timer-bold',
    desc: 'Issues a rotated access token with an ultra-short 5-second lifetime to immediately test client renewal loops.',
    payload: {
      refreshToken: 'sample-refresh-token-from-login',
      token_ttl: 5,
    },
  },
];

export default function RefreshRotationPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const [activePreset, setActivePreset] = useState<RotationPreset>(PRESETS[0]);
  const [activeRecipe, setActiveRecipe] = useState<'axios' | 'fetchMutex'>('axios');

  const axiosRecipe = `// Production Axios Response Interceptor with Mutex Lock & Request Queue
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export const api = axios.create({
  baseURL: '${publicApiUrl}',
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });
  failedQueue = [];
};

// Response Interceptor: Intercept 401s and queue parallel requests
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Detect 401 and avoid infinite retry loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Mutex Active: Queue this concurrent request until the token arrives
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          originalRequest.headers.Authorization = \`Bearer \${newToken}\`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedRefreshToken = localStorage.getItem('refresh_token');
        const { data } = await axios.post('${publicApiUrl}/auth/refresh', {
          refreshToken: storedRefreshToken,
        });

        const newAccessToken = data.access_token;
        const newRefreshToken = data.refresh_token;

        localStorage.setItem('access_token', newAccessToken);
        localStorage.setItem('refresh_token', newRefreshToken);

        // Resume all queued concurrent requests
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = \`Bearer \${newAccessToken}\`;
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        // Force redirect to login on token reuse or expired family
        localStorage.clear();
        window.location.href = '/login?session_expired=true';
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);`;

  const fetchMutexRecipe = `// Modern Native Fetch with Concurrent Mutex Lock
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem('access_token');
  const headers = new Headers(options.headers || {});
  if (token) headers.set('Authorization', \`Bearer \${token}\`);

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = (async () => {
        try {
          const refreshToken = localStorage.getItem('refresh_token');
          const refreshRes = await fetch('${publicApiUrl}/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (!refreshRes.ok) throw new Error('Token family expired');
          const data = await refreshRes.json();
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          return data.access_token;
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      })();
    }

    // Await the shared active refresh promise (Single execution for all concurrent callers)
    const newToken = await refreshPromise;
    headers.set('Authorization', \`Bearer \${newToken}\`);
    response = await fetch(url, { ...options, headers });
  }

  return response;
}`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:arrows-clockwise-bold" className="w-3.5 h-3.5" />
          <span>Auth &amp; Security</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Refresh Token Rotation &amp; Mutex Locking
          </h1>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
            Mutex Guard
          </span>
        </div>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Implement bulletproof session lifecycle management using single-use Refresh Token Rotation (RTR). Protect your single-page app against token theft with automatic token family invalidation and prevent browser race conditions using client-side mutex request queuing.
        </p>
      </div>

      {/* 2. Interactive Rotation Console */}
      <div id="rotation-runner" className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="font-bold text-base sm:text-lg text-slate-900">
            Interactive Rotation &amp; Threat Simulator
          </h2>
          <p className="text-sm text-slate-600">
            Select an operational mode to test token exchange, short-lived renewals, or simulate a token reuse breach:
          </p>
        </div>

        {/* Preset Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setActivePreset(preset)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                activePreset.id === preset.id
                  ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-1 ring-indigo-500'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      activePreset.id === preset.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Icon icon={preset.icon} className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                    {preset.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{preset.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Live Interactive Console */}
        <InteractiveConsole
          key={activePreset.id}
          method="POST"
          path="/auth/refresh"
          title={`Execute: ${activePreset.label}`}
          initialHeaders={activePreset.headers}
          initialBody={JSON.stringify(activePreset.payload, null, 2)}
        />
      </div>

      {/* 3. Token Reuse Attack Vector Model */}
      <div id="reuse-threat-model" className="space-y-4 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Threat Model: Token Reuse Detection (RFC 6749)
          </h2>
          <p className="text-sm text-slate-600">
            How token families detect stolen refresh tokens and trigger automatic session invalidation:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">Normal Token Rotation</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Legitimate user exchanges <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">Token A</code> for <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">Token B</code>. The gateway consumes Token A and issues Token B with the same family ID.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">Attacker Replay Attempt</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              An attacker who previously intercepted <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-rose-600">Token A</code> attempts to exchange it. The server detects that Token A has already been consumed.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">Total Family Revocation</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              The authorization gateway treats reuse as an active breach, immediately revoking <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-purple-600">Token B</code> as well, forcing all parties to re-authenticate.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Client Mutex Concurrency Implementation */}
      <div id="mutex-pattern" className="space-y-4 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Client-Side Concurrency Mutex Pattern
          </h2>
          <p className="text-sm text-slate-600">
            When multiple concurrent API calls fail with 401 at the same instant (e.g., initial page load with 5 parallel widgets), only <strong>one</strong> refresh request must fire. All other calls wait in a pending queue:
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'axios', label: 'Axios Interceptor with Request Queue', icon: 'ph:lightning-bold' },
              { id: 'fetchMutex', label: 'Native Fetch with Shared Promise Lock', icon: 'ph:code-bold' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveRecipe(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeRecipe === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <CodeBlock
            code={activeRecipe === 'axios' ? axiosRecipe : fetchMutexRecipe}
            language="typescript"
            title={`authInterceptor.${activeRecipe === 'axios' ? 'ts' : 'ts'}`}
            copyable
          />
        </div>
      </div>
    </div>
  );
}
