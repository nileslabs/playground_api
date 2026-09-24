import React from 'react';
import { Icon } from '@iconify/react';

export function CompareTable() {
  return (
    <section className="py-20 lg:py-28 bg-bg-canvas border-b border-border-default">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold tracking-wide">
            <Icon icon="ph:table-bold" className="w-3.5 h-3.5" />
            <span>Comprehensive Platform Matrix</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight">
            How Playground API Compares
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            See why developers choose Playground API over legacy mock APIs for real-world frontend prototypes.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-border-default bg-bg-surface/80 shadow-2xl backdrop-blur-md">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-bg-elevated/80 border-b border-border-default text-text-secondary font-mono text-xs">
                <th className="p-4 sm:p-5 font-semibold">Feature / Capability</th>
                <th className="p-4 sm:p-5 text-brand-primary font-bold text-sm bg-brand-primary/10 border-x border-brand-primary/20">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Playground API</span>
                  </div>
                </th>
                <th className="p-4 sm:p-5">JSONPlaceholder</th>
                <th className="p-4 sm:p-5">Platzi Fake API</th>
                <th className="p-4 sm:p-5">DummyJSON</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-secondary">
              <tr className="hover:bg-bg-elevated/40 transition-colors">
                <td className="p-4 sm:p-5 font-semibold text-text-primary">Persistent Per-Session Mutation Overlays</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-400 bg-brand-primary/5 border-x border-brand-primary/20 flex items-center gap-1.5">
                  <Icon icon="ph:check-circle-fill" className="w-4 h-4 shrink-0" />
                  <span>Real Virtual State</span>
                </td>
                <td className="p-4 sm:p-5 text-rose-400">❌ Fake Payload Echo</td>
                <td className="p-4 sm:p-5 text-rose-400">❌ Fake Payload Echo</td>
                <td className="p-4 sm:p-5 text-rose-400">❌ Fake Payload Echo</td>
              </tr>
              <tr className="hover:bg-bg-elevated/40 transition-colors">
                <td className="p-4 sm:p-5 font-semibold text-text-primary">Stripe-Parity 3DS Payment Gateway</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-400 bg-brand-primary/5 border-x border-brand-primary/20 flex items-center gap-1.5">
                  <Icon icon="ph:check-circle-fill" className="w-4 h-4 shrink-0" />
                  <span>Full 3DS Modal & Intents</span>
                </td>
                <td className="p-4 sm:p-5 text-rose-400">❌ No</td>
                <td className="p-4 sm:p-5 text-rose-400">❌ No</td>
                <td className="p-4 sm:p-5 text-rose-400">❌ No</td>
              </tr>
              <tr className="hover:bg-bg-elevated/40 transition-colors">
                <td className="p-4 sm:p-5 font-semibold text-text-primary">Virtual Email & SMS Web Inbox</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-400 bg-brand-primary/5 border-x border-brand-primary/20 flex items-center gap-1.5">
                  <Icon icon="ph:check-circle-fill" className="w-4 h-4 shrink-0" />
                  <span>Real-Time SSE & OTP Extractor</span>
                </td>
                <td className="p-4 sm:p-5 text-rose-400">❌ No</td>
                <td className="p-4 sm:p-5 text-rose-400">❌ No</td>
                <td className="p-4 sm:p-5 text-rose-400">❌ No</td>
              </tr>
              <tr className="hover:bg-bg-elevated/40 transition-colors">
                <td className="p-4 sm:p-5 font-semibold text-text-primary">Multipart File Uploads & Cloud CDN</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-400 bg-brand-primary/5 border-x border-brand-primary/20 flex items-center gap-1.5">
                  <Icon icon="ph:check-circle-fill" className="w-4 h-4 shrink-0" />
                  <span>Cloudinary CDN Preview</span>
                </td>
                <td className="p-4 sm:p-5 text-rose-400">❌ No</td>
                <td className="p-4 sm:p-5 text-rose-400">❌ No</td>
                <td className="p-4 sm:p-5 text-rose-400">❌ No</td>
              </tr>
              <tr className="hover:bg-bg-elevated/40 transition-colors">
                <td className="p-4 sm:p-5 font-semibold text-text-primary">Unified GraphQL Gateway</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-400 bg-brand-primary/5 border-x border-brand-primary/20 flex items-center gap-1.5">
                  <Icon icon="ph:check-circle-fill" className="w-4 h-4 shrink-0" />
                  <span>Yes (/graphql)</span>
                </td>
                <td className="p-4 sm:p-5 text-rose-400">❌ No</td>
                <td className="p-4 sm:p-5 text-emerald-400">✅ Yes</td>
                <td className="p-4 sm:p-5 text-rose-400">❌ No</td>
              </tr>
              <tr className="hover:bg-bg-elevated/40 transition-colors">
                <td className="p-4 sm:p-5 font-semibold text-text-primary">Fake JWT Auth & RBAC Roles</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-400 bg-brand-primary/5 border-x border-brand-primary/20 flex items-center gap-1.5">
                  <Icon icon="ph:check-circle-fill" className="w-4 h-4 shrink-0" />
                  <span>4 Personas & Bearer Auth</span>
                </td>
                <td className="p-4 sm:p-5 text-rose-400">❌ No</td>
                <td className="p-4 sm:p-5 text-emerald-400">✅ Basic</td>
                <td className="p-4 sm:p-5 text-emerald-400">✅ Basic</td>
              </tr>
              <tr className="hover:bg-bg-elevated/40 transition-colors">
                <td className="p-4 sm:p-5 font-semibold text-text-primary">Network Chaos & Fault Injection</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-400 bg-brand-primary/5 border-x border-brand-primary/20 flex items-center gap-1.5">
                  <Icon icon="ph:check-circle-fill" className="w-4 h-4 shrink-0" />
                  <span>Headers & URL Params</span>
                </td>
                <td className="p-4 sm:p-5 text-rose-400">❌ No</td>
                <td className="p-4 sm:p-5 text-rose-400">❌ No</td>
                <td className="p-4 sm:p-5 text-amber-400">⚠️ Limited delay only</td>
              </tr>
              <tr className="hover:bg-bg-elevated/40 transition-colors">
                <td className="p-4 sm:p-5 font-semibold text-text-primary">Dynamic Custom Collections</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-400 bg-brand-primary/5 border-x border-brand-primary/20 flex items-center gap-1.5">
                  <Icon icon="ph:check-circle-fill" className="w-4 h-4 shrink-0" />
                  <span>Yes (/custom/*)</span>
                </td>
                <td className="p-4 sm:p-5 text-rose-400">❌ No</td>
                <td className="p-4 sm:p-5 text-rose-400">❌ No</td>
                <td className="p-4 sm:p-5 text-rose-400">❌ No</td>
              </tr>
              <tr className="hover:bg-bg-elevated/40 transition-colors">
                <td className="p-4 sm:p-5 font-semibold text-text-primary">Snapshot Export / Import</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-400 bg-brand-primary/5 border-x border-brand-primary/20 flex items-center gap-1.5">
                  <Icon icon="ph:check-circle-fill" className="w-4 h-4 shrink-0" />
                  <span>Portable JSON State</span>
                </td>
                <td className="p-4 sm:p-5 text-rose-400">❌ No</td>
                <td className="p-4 sm:p-5 text-rose-400">❌ No</td>
                <td className="p-4 sm:p-5 text-rose-400">❌ No</td>
              </tr>
              <tr className="hover:bg-bg-elevated/40 transition-colors">
                <td className="p-4 sm:p-5 font-semibold text-text-primary">AI / LLM Ready Spec (/llms.txt)</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-400 bg-brand-primary/5 border-x border-brand-primary/20 flex items-center gap-1.5">
                  <Icon icon="ph:check-circle-fill" className="w-4 h-4 shrink-0" />
                  <span>Structured Markdown</span>
                </td>
                <td className="p-4 sm:p-5 text-rose-400">❌ No</td>
                <td className="p-4 sm:p-5 text-rose-400">❌ No</td>
                <td className="p-4 sm:p-5 text-rose-400">❌ No</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default CompareTable;
