'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface ExpiryPreset {
  id: string;
  label: string;
  durationLabel: string;
  seconds: number;
  headerValue: string;
  desc: string;
}

const PRESETS: ExpiryPreset[] = [
  {
    id: '5s',
    label: '5 Seconds (Ultra Short)',
    durationLabel: '5s',
    seconds: 5,
    headerValue: '5s',
    desc: 'Rapid expiry simulation. Ideal for testing client auto-refresh timeouts and fast retry loops.',
  },
  {
    id: '15s',
    label: '15 Seconds',
    durationLabel: '15s',
    seconds: 15,
    headerValue: '15s',
    desc: 'Simulates short-lived session access tokens with ample time to trigger manual requests.',
  },
  {
    id: '60s',
    label: '1 Minute (Standard)',
    durationLabel: '1m',
    seconds: 60,
    headerValue: '1m',
    desc: 'Simulates standard micro-session lifetimes for high-security transaction banking portals.',
  },
  {
    id: 'immediate',
    label: 'Already Expired (-1s)',
    durationLabel: '0s',
    seconds: 0,
    headerValue: '-1s',
    desc: 'Issues a token with an expiration timestamp in the past. Immediately returns 401 on first use.',
  },
];

export default function ExpirySimulationPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const [activePreset, setActivePreset] = useState<ExpiryPreset>(PRESETS[0]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [activeRecipe, setActiveRecipe] = useState<'silentRefresh' | 'axiosCountdown'>('silentRefresh');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && countdown !== null && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (countdown === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, countdown]);

  const handleStartSimulatedCountdown = (preset: ExpiryPreset) => {
    setActivePreset(preset);
    setCountdown(preset.seconds);
    setTimerActive(preset.seconds > 0);
  };

  const silentRefreshRecipe = `// React 19 Silent Auto-Refresh Pattern (Proactive Token Refresh)
import { useEffect, useRef } from 'react';

export function useSilentTokenRefresh(expiresInSeconds: number, onRefresh: () => Promise<void>) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!expiresInSeconds || expiresInSeconds <= 0) return;

    // Refresh 15% before actual expiry (e.g. at 4.2s for a 5s token)
    const refreshBufferMs = Math.max(1000, expiresInSeconds * 1000 * 0.15);
    const delayMs = expiresInSeconds * 1000 - refreshBufferMs;

    timerRef.current = setTimeout(async () => {
      try {
        console.log('Initiating proactive silent token renewal before expiry...');
        await onRefresh();
      } catch (err) {
        console.error('Silent refresh failed:', err);
      }
    }, Math.max(500, delayMs));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [expiresInSeconds, onRefresh]);
}`;

  const axiosCountdownRecipe = `// Auto-Refresh Interceptor Handling Fast Expirations
import axios from 'axios';

const api = axios.create({ baseURL: '${publicApiUrl}' });

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Detect fast token expiry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post('${publicApiUrl}/auth/refresh', {
          refreshToken: localStorage.getItem('refresh_token'),
          token_ttl: 15, // Issue next token with 15s lifespan
        });

        localStorage.setItem('access_token', data.access_token);
        originalRequest.headers.Authorization = \`Bearer \${data.access_token}\`;
        return api(originalRequest);
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:timer-bold" className="w-3.5 h-3.5" />
          <span>Auth &amp; Security</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          JWT Expiry Simulation &amp; Renewal
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Never wait 15 minutes to test your token expiration error handlers or silent background refresh routines. Request valid cryptographic JWTs with custom micro-lifespans (5s, 15s, 1m) or trigger already-expired tokens on demand.
        </p>
      </div>

      {/* 2. Interactive Expiry Runner with Live Timer */}
      <div id="expiry-workbench" className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="font-bold text-base sm:text-lg text-slate-900">
            Interactive Expiry Workbench
          </h2>
          <p className="text-sm text-slate-600">
            Choose a lifespan duration below to load into the console and test token invalidation:
          </p>
        </div>

        {/* Preset Duration Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleStartSimulatedCountdown(preset)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                activePreset.id === preset.id
                  ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-1 ring-indigo-500'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                    {preset.label}
                  </span>
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-indigo-700">
                    {preset.durationLabel}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {preset.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Visual Countdown Badge */}
        {countdown !== null && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Icon
                icon={countdown === 0 ? 'ph:warning-circle-bold' : 'ph:hourglass-medium-bold'}
                className={`w-5 h-5 ${countdown === 0 ? 'text-rose-600 animate-bounce' : 'text-amber-600'}`}
              />
              <span className="text-xs font-semibold text-slate-700">
                Simulation Status:
              </span>
              <span
                className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                  countdown === 0
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {countdown === 0 ? 'TOKEN EXPIRED (401)' : `${countdown}s REMAINING`}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleStartSimulatedCountdown(activePreset)}
              className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-indigo-600 shadow-2xs transition-all cursor-pointer self-start sm:self-auto"
            >
              Restart Countdown
            </button>
          </div>
        )}

        {/* Live Interactive Console */}
        <InteractiveConsole
          key={activePreset.id}
          method="POST"
          path="/auth/login"
          title={`Login with ${activePreset.durationLabel} Token Lifespan`}
          initialHeaders={{
            'X-Simulate-JWT-Expiry': activePreset.headerValue,
          }}
          initialBody={JSON.stringify(
            {
              username: 'admin',
              password: 'Password@123',
              token_ttl: activePreset.seconds,
            },
            null,
            2
          )}
        />
      </div>

      {/* 3. Supported Expiry Modifier Modalities */}
      <div id="modifiers-reference" className="space-y-4 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Supported Expiry Modification Modalities
          </h2>
          <p className="text-sm text-slate-600">
            Playground API supports both header-based and request body configuration parameters:
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <th className="py-3 px-4">Transport</th>
                  <th className="py-3 px-4">Key / Field</th>
                  <th className="py-3 px-4">Supported Syntax</th>
                  <th className="py-3 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-semibold text-slate-900">HTTP Header</td>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">X-Simulate-JWT-Expiry</td>
                  <td className="py-3 px-4 font-mono text-slate-600 text-xs">&quot;5s&quot;, &quot;15s&quot;, &quot;1m&quot;, &quot;-1s&quot;</td>
                  <td className="py-3 px-4 text-slate-600 text-xs">Overrides access token lifespan without modifying request payload.</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-semibold text-slate-900">JSON Body</td>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">token_ttl</td>
                  <td className="py-3 px-4 font-mono text-slate-600 text-xs">5, 10, 30, 60</td>
                  <td className="py-3 px-4 text-slate-600 text-xs">Integer seconds defining precise token lifetime.</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-semibold text-slate-900">JSON Body</td>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">expiresIn / expires_in</td>
                  <td className="py-3 px-4 font-mono text-slate-600 text-xs">&quot;5s&quot;, &quot;10m&quot;, &quot;1h&quot;</td>
                  <td className="py-3 px-4 text-slate-600 text-xs">String duration format compatible with the <code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded text-indigo-600">ms</code> library.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Production Integration Recipes */}
      <div id="client-recipes" className="space-y-4 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Auto-Refresh &amp; Renewal Recipes
          </h2>
          <p className="text-sm text-slate-600">
            Frontend patterns for proactive silent token renewal before expiration occurs:
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'silentRefresh', label: 'Proactive Silent Refresh Hook', icon: 'ph:clock-countdown-bold' },
              { id: 'axiosCountdown', label: 'Axios 401 Expiry Interceptor', icon: 'ph:lightning-bold' },
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
            code={activeRecipe === 'silentRefresh' ? silentRefreshRecipe : axiosCountdownRecipe}
            language="typescript"
            title={`useAutoRefresh.${activeRecipe === 'silentRefresh' ? 'ts' : 'ts'}`}
            copyable
          />
        </div>
      </div>
    </div>
  );
}
