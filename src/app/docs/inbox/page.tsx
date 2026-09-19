import React from 'react';
import type { Metadata } from 'next';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';
import { siteConfig } from '@/config/site';
import { LiveInboxViewer } from '@/components/docs/LiveInboxViewer';

export const metadata: Metadata = {
  title: 'Virtual Email & SMS Web Inbox & OTP Testing — Playground API',
  description:
    'Test transactional emails, OTP verification codes, magic links, itemized receipts with Cloudinary attachments, and SMS delivery directly inside your browser sandbox.',
  keywords: [
    'mock email sandbox',
    'mock sms inbox api',
    'otp verification code testing',
    'mailtrap alternative mock api',
    'test magic links authentication',
    'cloudinary email attachments mock',
    'fake smtp server web inbox',
    'transactional email templates mock'
  ],
  alternates: {
    canonical: `${siteConfig.url}/docs/inbox`,
  },
  openGraph: {
    title: 'Virtual Email & SMS Web Inbox — Playground API',
    description:
      'In-browser sandbox inbox for inspecting transactional emails, extracting OTP verification codes, and previewing Cloudinary attachments in real-time.',
    url: `${siteConfig.url}/docs/inbox`,
    type: 'article',
  },
};

export default function InboxDocsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const sendEmailExample = `// 1. Send transactional email using TypeScript SDK
import { PlaygroundClient } from 'playground-api';

const client = new PlaygroundClient({
  identityToken: 'your_sandbox_identity_token'
});

const email = await client.emails.send({
  to: 'developer@example.com',
  template: 'welcome-verification',
  data: {
    name: 'Alex Rivera',
    otp: '948201',
    verification_link: 'https://myapp.com/verify?code=948201',
    expires_in_minutes: 15
  },
  attachments: [
    {
      name: 'receipt_invoice_902.pdf',
      content: 'JVBERi0xLjQKJ...', // Base64 encoded or CDN URL
      type: 'application/pdf'
    }
  ]
});

console.log('Email dispatched to virtual sandbox:', email.id);
console.log('Extracted OTP code:', email.otp_code);`;

  const fetchInboxExample = `// 2. Fetch Sandbox Inbox in Automated E2E Tests (Playwright/Cypress)
import { test, expect } from '@playwright/test';

test('verify user signup OTP code', async ({ request }) => {
  // Trigger signup on your frontend app
  const signupRes = await request.post('http://localhost:3000/api/auth/register', {
    data: { name: 'E2E User', username: 'e2e_user', email: 'e2e@example.com' }
  });
  expect(signupRes.ok()).toBeTruthy();

  // Query Playground API Virtual Inbox
  const inboxRes = await request.get('${publicApiUrl}/inbox?type=email&to=e2e@example.com');
  const inboxJson = await inboxRes.json();
  
  const welcomeEmail = inboxJson.data[0];
  expect(welcomeEmail).toBeDefined();
  
  // Extract 6-digit OTP code directly from API payload
  const otpCode = welcomeEmail.otp_code;
  console.log('Automated OTP retrieved:', otpCode);

  // Submit OTP to complete verification flow
  const verifyRes = await request.post('http://localhost:3000/api/auth/verify-email', {
    data: { email: 'e2e@example.com', otp: otpCode }
  });
  expect(verifyRes.ok()).toBeTruthy();
});`;

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-16">
      {/* Top Interactive Web Inbox Component */}
      <LiveInboxViewer />

      {/* Overview & Architecture */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Icon icon="lucide:layers" className="w-5 h-5 text-indigo-500" />
          Virtual Inbox Architecture &amp; Capabilities
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Playground API provides a completely zero-configuration, in-memory &amp; cloud-backed virtual communication sandbox. When your backend or frontend sends transactional emails, verification SMS, or password reset instructions, messages are captured in real-time inside your session sandbox instead of delivering to real telecom or email networks.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Icon icon="lucide:key-round" className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Automated OTP Extraction
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Regex-powered OTP parser automatically identifies 4-8 digit numeric verification codes and magic links in both emails and SMS.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Icon icon="lucide:cloud" className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Cloudinary CDN Storage
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Email attachments are automatically uploaded and namespaced to <code className="text-[11px] text-indigo-500 font-mono">playground_api/emails/attachments/&lt;session&gt;</code> and cleaned up on sandbox reset.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Icon icon="lucide:radio" className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Real-Time SSE Sync
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Subscribed to Server-Sent Events (<code className="text-[11px] text-indigo-500 font-mono">/stream/notifications</code>) so the web inbox auto-updates instantly as messages are sent.
            </p>
          </div>
        </div>
      </section>

      {/* Built-in Templates */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Icon icon="lucide:layout-template" className="w-5 h-5 text-indigo-500" />
          Built-in Transactional Templates
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          You can reference built-in templates by passing the <code className="text-indigo-600 dark:text-indigo-400 font-mono">template</code> property when calling <code className="font-mono">POST /api/v1/emails/send</code> along with variable substitutions in <code className="font-mono">data</code>:
        </p>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Template ID</th>
                <th className="p-3">Description</th>
                <th className="p-3">Interpolated Variables</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-600 dark:text-slate-400">
              <tr>
                <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">welcome-verification</td>
                <td className="p-3">Signup welcome email with 6-digit verification code &amp; link</td>
                <td className="p-3 font-mono text-[11px]">{'{{name}}, {{otp}}, {{verification_link}}, {{expires_in_minutes}}'}</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">password-reset</td>
                <td className="p-3">Secure password reset instructions with security details</td>
                <td className="p-3 font-mono text-[11px]">{'{{name}}, {{otp}}, {{reset_link}}, {{ip_address}}, {{device}}'}</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">invoice-receipt</td>
                <td className="p-3">Itemized transaction receipt with attachment download</td>
                <td className="p-3 font-mono text-[11px]">{'{{name}}, {{invoice_id}}, {{amount}}, {{plan_name}}, {{payment_method}}'}</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">2fa-code</td>
                <td className="p-3">High-priority two-factor authentication security code</td>
                <td className="p-3 font-mono text-[11px]">{'{{name}}, {{otp}}, {{device}}, {{location}}'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Code Integration Examples */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Icon icon="lucide:code-2" className="w-5 h-5 text-indigo-500" />
          Code Examples &amp; Test Automation
        </h2>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Dispatching Emails with Attachments (TypeScript SDK)
          </h3>
          <CodeBlock code={sendEmailExample} language="typescript" />
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Automated E2E Signup OTP Verification (Playwright)
          </h3>
          <CodeBlock code={fetchInboxExample} language="typescript" />
        </div>
      </section>

      {/* REST API Endpoints Table */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Icon icon="lucide:terminal" className="w-5 h-5 text-indigo-500" />
          Inbox &amp; Communication REST Endpoints
        </h2>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                POST
              </span>
              <code className="text-xs font-mono text-slate-900 dark:text-slate-100">
                /api/v1/emails/send
              </code>
            </div>
            <span className="text-xs text-slate-500">Send virtual transactional email</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                GET
              </span>
              <code className="text-xs font-mono text-slate-900 dark:text-slate-100">
                /api/v1/emails
              </code>
            </div>
            <span className="text-xs text-slate-500">List all sent emails for current session</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                POST
              </span>
              <code className="text-xs font-mono text-slate-900 dark:text-slate-100">
                /api/v1/sms/send
              </code>
            </div>
            <span className="text-xs text-slate-500">Send simulated SMS message</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                GET
              </span>
              <code className="text-xs font-mono text-slate-900 dark:text-slate-100">
                /api/v1/inbox
              </code>
            </div>
            <span className="text-xs text-slate-500">List unified email &amp; SMS messages</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                DELETE
              </span>
              <code className="text-xs font-mono text-slate-900 dark:text-slate-100">
                /api/v1/inbox
              </code>
            </div>
            <span className="text-xs text-slate-500">Clear all inbox messages &amp; clean up Cloudinary assets</span>
          </div>
        </div>
      </section>
    </div>
  );
}
