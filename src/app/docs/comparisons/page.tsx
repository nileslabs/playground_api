import React from 'react';
import type { Metadata } from 'next';
import { Icon } from '@iconify/react';

export const metadata: Metadata = {
  title: 'Feature Comparisons — Playground API vs Alternatives',
  description:
    'Detailed feature matrix comparing Playground API with JSONPlaceholder, DummyJSON, Mockoon, and MSW across statefulness, auth, websockets, and latency simulation.',
};

export default function ComparisonsPage() {
  const comparisonRows = [
    {
      feature: 'Stateful CRUD Persistence',
      playground: true,
      placeholder: false,
      dummyjson: false,
      mockoon: 'Local Only',
      msw: 'Client Only',
    },
    {
      feature: 'Zero-Login / Zero-Setup',
      playground: true,
      placeholder: true,
      dummyjson: true,
      mockoon: false,
      msw: false,
    },
    {
      feature: 'Dual-Mode Sandboxing (Session vs User)',
      playground: true,
      placeholder: false,
      dummyjson: false,
      mockoon: false,
      msw: false,
    },
    {
      feature: 'Fake JWT Auth & Token Rotation',
      playground: true,
      placeholder: false,
      dummyjson: 'Static Only',
      mockoon: 'Custom Rule',
      msw: 'Manual Mock',
    },
    {
      feature: 'WebSockets & Socket.io Hub',
      playground: true,
      placeholder: false,
      dummyjson: false,
      mockoon: true,
      msw: false,
    },
    {
      feature: 'Server-Sent Events (SSE) Stream',
      playground: true,
      placeholder: false,
      dummyjson: false,
      mockoon: false,
      msw: false,
    },
    {
      feature: 'Mock Stripe Payments & 3DS Challenge',
      playground: true,
      placeholder: false,
      dummyjson: false,
      mockoon: false,
      msw: false,
    },
    {
      feature: 'Virtual Email & SMS Inboxes',
      playground: true,
      placeholder: false,
      dummyjson: false,
      mockoon: false,
      msw: false,
    },
    {
      feature: 'Latency & Chaos Fault Injection',
      playground: true,
      placeholder: false,
      dummyjson: 'Delay Only',
      mockoon: true,
      msw: 'Manual',
    },
    {
      feature: 'Dynamic Custom Collections & Seeding',
      playground: true,
      placeholder: false,
      dummyjson: false,
      mockoon: false,
      msw: false,
    },
    {
      feature: 'Automated CI/CD Headers (Playwright)',
      playground: true,
      placeholder: false,
      dummyjson: false,
      mockoon: false,
      msw: true,
    },
  ];

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:scales-bold" className="w-3.5 h-3.5" />
          <span>Objective Feature Matrix</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Playground API vs Alternatives
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          An objective architectural breakdown comparing Playground API against popular mock tools across persistence, protocols, auth, and fault injection.
        </p>
      </div>

      {/* 2. Comparison Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">Feature / Capability</th>
                <th className="py-3.5 px-4 font-bold text-indigo-700 bg-indigo-50/50">Playground API</th>
                <th className="py-3.5 px-4 font-semibold text-slate-500">JSONPlaceholder</th>
                <th className="py-3.5 px-4 font-semibold text-slate-500">DummyJSON</th>
                <th className="py-3.5 px-4 font-semibold text-slate-500">Mockoon</th>
                <th className="py-3.5 px-4 font-semibold text-slate-500">MSW</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-900">{row.feature}</td>

                  {/* Playground API Column */}
                  <td className="py-3 px-4 bg-indigo-50/20 font-bold text-indigo-700">
                    <span className="inline-flex items-center gap-1.5 text-emerald-600">
                      <Icon icon="ph:check-circle-fill" className="w-4 h-4" />
                      <span>Yes (Stateful)</span>
                    </span>
                  </td>

                  {/* JSONPlaceholder */}
                  <td className="py-3 px-4 text-slate-500">
                    {row.placeholder === false ? (
                      <Icon icon="ph:x-circle-bold" className="w-4 h-4 text-slate-300" />
                    ) : (
                      <span className="text-emerald-600 font-medium">Yes</span>
                    )}
                  </td>

                  {/* DummyJSON */}
                  <td className="py-3 px-4 text-slate-500">
                    {row.dummyjson === false ? (
                      <Icon icon="ph:x-circle-bold" className="w-4 h-4 text-slate-300" />
                    ) : (
                      <span className="font-medium text-slate-700">{String(row.dummyjson)}</span>
                    )}
                  </td>

                  {/* Mockoon */}
                  <td className="py-3 px-4 text-slate-500">
                    {row.mockoon === false ? (
                      <Icon icon="ph:x-circle-bold" className="w-4 h-4 text-slate-300" />
                    ) : (
                      <span className="font-medium text-slate-700">{String(row.mockoon)}</span>
                    )}
                  </td>

                  {/* MSW */}
                  <td className="py-3 px-4 text-slate-500">
                    {row.msw === false ? (
                      <Icon icon="ph:x-circle-bold" className="w-4 h-4 text-slate-300" />
                    ) : (
                      <span className="font-medium text-slate-700">{String(row.msw)}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
