'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function RefreshRotationPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:arrows-clockwise-bold" className="w-3.5 h-3.5" />
          <span>Auth & Security</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Refresh Token Rotation & Mutex
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Learn how to implement bulletproof token refresh logic with single-use rotation and client-side race condition mutexes. Test token exchange and reuse detection live.
        </p>
      </div>

      {/* 2. Interactive Rotation Runner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Exchange Refresh Token</h3>
          <p className="text-xs text-slate-500">
            Submit a refresh token to rotate it for a new access token and fresh refresh token:
          </p>
        </div>

        <InteractiveConsole
          method="POST"
          path="/auth/refresh"
          title="Rotate Refresh Token"
          initialBody={JSON.stringify(
            {
              refreshToken: 'sample-refresh-token-from-login',
            },
            null,
            2
          )}
        />
      </div>

      {/* 3. Mutex & Concurrency Guide */}
      <div id="mutex-pattern" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Preventing Concurrency Race Conditions (Axios / Fetch)
        </h2>

        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            When multiple parallel queries fail with <code className="font-mono text-indigo-600 bg-slate-50 px-1 py-0.5 rounded">401 Unauthorized</code> simultaneously, your client must queue pending requests rather than firing multiple refresh calls:
          </p>

          <div className="rounded-xl border border-slate-200 bg-slate-900 p-4">
            <pre className="font-mono text-xs text-slate-100 overflow-x-auto leading-relaxed">
{`let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axios.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axios(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post('${publicApiUrl}/auth/refresh', { refreshToken });
        processQueue(null, data.accessToken);
        return axios(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
