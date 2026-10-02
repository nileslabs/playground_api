'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/docs/CodeBlock';

interface TemplateBlueprint {
  id: string;
  name: string;
  description: string;
  subject: string;
  variables: string[];
  defaultValues: Record<string, string>;
}

const TEMPLATES: TemplateBlueprint[] = [
  {
    id: 'welcome-verification',
    name: 'User Onboarding & 6-Digit OTP',
    description: 'Account activation notice with prominent OTP code and verification call-to-action button.',
    subject: 'Welcome to Playground API, {{name}}! Verify your account',
    variables: ['name', 'otp', 'verification_link', 'expires_in_minutes'],
    defaultValues: {
      name: 'Alexander Developer',
      otp: '849201',
      verification_link: 'https://playground.nileslabs.com/verify?code=849201',
      expires_in_minutes: '15',
    },
  },
  {
    id: 'password-reset',
    name: 'Security Alert: Password Reset',
    description: 'Security notification with one-time reset link, device telemetry, and warning banner.',
    subject: 'Reset your Playground API password',
    variables: ['name', 'otp', 'reset_link', 'device', 'ip_address'],
    defaultValues: {
      name: 'Sarah Connor',
      otp: '491028',
      reset_link: 'https://playground.nileslabs.com/reset-password?token=sec_981a',
      device: 'MacBook Pro / Chrome 124',
      ip_address: '198.51.100.42',
    },
  },
  {
    id: 'invoice-receipt',
    name: 'Itemized Invoice & Payment Receipt',
    description: 'Transaction confirmation with order reference, charged amount, and PDF download button.',
    subject: 'Receipt for Invoice #{{invoice_number}}',
    variables: ['name', 'invoice_number', 'amount', 'date', 'download_url'],
    defaultValues: {
      name: 'Marcus Holloway',
      invoice_number: 'INV-2026-089',
      amount: '$49.00 USD',
      date: 'October 1, 2026',
      download_url: 'https://playground.nileslabs.com/receipts/inv-089.pdf',
    },
  },
  {
    id: '2fa-code',
    name: '2FA Two-Factor Authentication',
    description: 'Minimalist high-visibility verification code for two-factor login challenges.',
    subject: 'Your 2FA Login Code is {{otp}}',
    variables: ['otp', 'service_name'],
    defaultValues: {
      otp: '719302',
      service_name: 'Playground Cloud',
    },
  },
];

export default function MessageDispatcherPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateBlueprint>(TEMPLATES[0]);
  const [formValues, setFormValues] = useState<Record<string, string>>(TEMPLATES[0].defaultValues);

  const handleSelectTemplate = (t: TemplateBlueprint) => {
    setSelectedTemplate(t);
    setFormValues(t.defaultValues);
  };

  const updateVariable = (key: string, val: string) => {
    setFormValues(prev => ({ ...prev, [key]: val }));
  };

  const compiledSubject = selectedTemplate.subject.replace(
    /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g,
    (_, key) => formValues[key] || `{{${key}}}`
  );

  return (
    <div className="space-y-12 w-full text-slate-900 pb-16">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold uppercase tracking-wider border border-purple-200">
          <Icon icon="ph:paper-plane-tilt-bold" className="w-3.5 h-3.5" />
          <span>Virtual Communications</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Template Engine &amp; Dispatcher
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-4xl">
          Manage reusable Mustache-style template blueprints with dynamic variable compilation (<code className="font-mono text-xs text-purple-700">&#123;&#123;name&#125;&#125;</code>, <code className="font-mono text-xs text-purple-700">&#123;&#123;otp&#125;&#125;</code>),
          test cross-channel dispatches, and flush communication logs cleanly in your isolated sandbox.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <a
            href="#template-catalog"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-xs"
          >
            <Icon icon="ph:layout-bold" className="w-4 h-4" />
            Live Template Studio
          </a>
          <a
            href="#interactive-consoles"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <Icon icon="ph:terminal-window-bold" className="w-4 h-4" />
            API Consoles
          </a>
          <a
            href="#purge-mailbox"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors border border-rose-200"
          >
            <Icon icon="ph:trash-bold" className="w-4 h-4" />
            Purge Sandbox Mailbox
          </a>
        </div>
      </div>

      {/* 2. Interactive Template Studio & Live Interpolator */}
      <div id="template-catalog" className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900">Communication Template Studio</h2>
          <p className="text-xs text-slate-500">
            Select a built-in blueprint and adjust variables to see real-time placeholder interpolation.
          </p>
        </div>

        {/* Blueprint Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleSelectTemplate(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedTemplate.id === t.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Studio Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
          {/* Variable Inputs (5 of 12 cols) */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div>
              <span className="font-bold text-xs text-slate-900 block">Template Variables</span>
              <p className="text-[11px] text-slate-500">{selectedTemplate.description}</p>
            </div>

            <div className="space-y-3 text-xs">
              {selectedTemplate.variables.map(v => (
                <div key={v} className="space-y-1">
                  <label className="font-mono font-semibold text-slate-700 block">
                    &#123;&#123;{v}&#125;&#125;
                  </label>
                  <input
                    type="text"
                    value={formValues[v] || ''}
                    onChange={e => updateVariable(v, e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-[11px] text-purple-900">
              <strong>Payload Mapping:</strong> Pass <code className="font-mono text-purple-800">{`{ template: "${selectedTemplate.id}", data: { ... } }`}</code> to <code className="font-mono text-purple-800">POST /emails/send</code>.
            </div>
          </div>

          {/* Compiled Output Preview (7 of 12 cols) */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Compiled Subject</span>
              <h4 className="font-bold text-sm text-slate-900 font-mono">{compiledSubject}</h4>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">JSON Dispatch Payload</span>
              <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed overflow-x-auto">
                {JSON.stringify(
                  {
                    to: 'developer@example.com',
                    template: selectedTemplate.id,
                    data: formValues,
                  },
                  null,
                  2
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Consoles */}
      <div id="interactive-consoles" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Interactive Consoles
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Query registered templates and register custom blueprints.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">1. Inspect Available Templates</h3>
            <InteractiveConsole
              method="GET"
              path="/emails/templates"
              title="List Communication Blueprints"
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">2. Register Custom Blueprint</h3>
            <InteractiveConsole
              method="POST"
              path="/emails/templates"
              title="Create Custom Template"
              initialBody={JSON.stringify(
                {
                  id: 'beta-invite',
                  name: 'Product Beta Invitation',
                  description: 'VIP early access invite with custom token',
                  subject: 'You have been invited to the Beta, {{name}}!',
                  html: '<h1>Welcome {{name}}</h1><p>Use token: <strong>{{invite_token}}</strong></p>',
                  variables: ['name', 'invite_token'],
                },
                null,
                2
              )}
            />
          </div>
        </div>
      </div>

      {/* 4. Purge Sandbox Mailbox Section */}
      <div id="purge-mailbox" className="p-6 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-4 scroll-mt-20">
        <div>
          <h2 className="text-lg font-bold text-rose-950 flex items-center gap-2">
            <Icon icon="ph:trash-bold" className="w-5 h-5 text-rose-600" />
            Purge Sandbox Mailbox &amp; Communication Logs
          </h2>
          <p className="text-xs text-rose-800 mt-0.5">
            Reset your session inbox. Permanently deletes all generated emails, SMS messages, and temporary attachments.
          </p>
        </div>

        <InteractiveConsole
          method="DELETE"
          path="/inbox"
          title="Purge Communication Inbox"
        />
      </div>

      {/* 5. Production Integration Recipes */}
      <div id="recipes" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Multi-Channel Dispatcher Recipe (Node.js)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Dispatching templated emails and SMS notifications programmatically.
          </p>
        </div>

        <CodeBlock
          language="typescript"
          code={`import axios from 'axios';

const API_BASE = 'https://playground.nileslabs.com/api/v1';

// Send templated email
export async function sendWelcomeEmail(user: { email: string; name: string }) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const response = await axios.post(\`\${API_BASE}/emails/send\`, {
    to: user.email,
    template: 'welcome-verification',
    data: {
      name: user.name,
      otp,
      verification_link: \`https://myapp.com/verify?code=\${otp}\`,
      expires_in_minutes: '15',
    },
  });

  return response.data;
}`}
        />
      </div>
    </div>
  );
}
