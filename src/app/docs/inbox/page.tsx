'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/docs/CodeBlock';

interface ChannelModule {
  id: string;
  name: string;
  icon: string;
  badge: string;
  color: string;
  desc: string;
  endpoints: string[];
  href: string;
}

const CHANNELS: ChannelModule[] = [
  {
    id: 'email-mailbox',
    name: 'Virtual Email Mailbox',
    icon: 'ph:mailbox-bold',
    badge: 'Mailtrap Style',
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    desc: 'Full-fidelity transactional inbox. Intercepts welcome emails, password resets, receipts, and 2FA codes with isolated HTML rendering, attachment downloads, and security header validation.',
    endpoints: ['GET /api/v1/emails', 'POST /api/v1/emails/send', 'GET /api/v1/emails/otp', 'DELETE /api/v1/emails/:id'],
    href: '/docs/inbox/email-mailbox',
  },
  {
    id: 'sms-terminal',
    name: 'Virtual SMS Terminal',
    icon: 'ph:device-mobile-bold',
    badge: 'Twilio Compatible',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    desc: 'Simulate mobile phone number verification, 2FA security codes, and outbound SMS notifications without real carrier charges or Twilio credentials.',
    endpoints: ['GET /api/v1/sms', 'POST /api/v1/sms/send', 'GET /api/v1/sms/:id'],
    href: '/docs/inbox/sms-terminal',
  },
  {
    id: 'in-app-messages',
    name: 'In-App Notifications Feed',
    icon: 'ph:bell-ringing-bold',
    badge: 'User Feed',
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    desc: 'Push system notifications, promotional announcements, and maintenance alerts. Test unread count badges, priority tags, and actionable deep-link redirects.',
    endpoints: ['GET /api/v1/messages', 'POST /api/v1/messages', 'PATCH /api/v1/messages/:id/read'],
    href: '/docs/inbox/in-app-messages',
  },
  {
    id: 'dispatcher',
    name: 'Dispatcher & Template Engine',
    icon: 'ph:paper-plane-tilt-bold',
    badge: 'Multi-Channel',
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    desc: 'Manage reusable Mustache-style template blueprints with dynamic variable interpolation (e.g. {{name}}, {{otp}}), cross-channel broadcasting, and 1-click mailbox purging.',
    endpoints: ['GET /api/v1/emails/templates', 'POST /api/v1/emails/templates', 'DELETE /api/v1/inbox'],
    href: '/docs/inbox/dispatcher',
  },
];

const COMPARISON_ROWS = [
  {
    channel: 'Virtual Email',
    protocol: 'REST / SMTP Proxy',
    payload: 'HTML, Plain Text, Attachments',
    realtime: 'SSE (email.received) & WebSocket',
    useCase: 'Account activation, password reset links, order receipts',
  },
  {
    channel: 'Virtual SMS',
    protocol: 'REST / Carrier Emulation',
    payload: 'UTF-8 Text, 6-digit OTP codes',
    realtime: 'SSE (sms.received) & WebSocket',
    useCase: 'Mobile 2FA authentication, shipment tracking alerts',
  },
  {
    channel: 'In-App Notifications',
    protocol: 'REST / Toast Stream',
    payload: 'JSON { title, priority, actionUrl, read }',
    realtime: 'SSE & Real-Time Sync',
    useCase: 'Product announcements, background job completion banners',
  },
  {
    channel: 'Template Dispatcher',
    protocol: 'Template Engine',
    payload: 'Mustache {{variable}} JSON data',
    realtime: 'Multi-Channel Push',
    useCase: 'Consistent cross-platform branding & automated notification testing',
  },
];

export default function VirtualCommunicationsOverviewPage() {
  return (
    <div className="space-y-12 w-full text-slate-900 pb-16">
      {/* 1. Hero Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:envelope-simple-bold" className="w-3.5 h-3.5" />
          <span>Virtual Communications Platform</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Virtual Inboxes, SMS & Transactional Messaging
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-4xl">
          A sandboxed communications hub for testing authentication loops, transactional notifications, and customer journeys.
          Intercept emails, receive verification SMS messages, broadcast in-app feeds, and automate CI/CD assertions—zero third-party credentials required.
        </p>

        {/* High-Level Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Setup Required</span>
            <p className="text-2xl font-extrabold text-slate-900">Zero</p>
            <span className="text-[11px] text-emerald-600 font-semibold">100% In-Memory Sandbox</span>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Real-Time Delivery</span>
            <p className="text-2xl font-extrabold text-slate-900">&lt; 10ms</p>
            <span className="text-[11px] text-indigo-600 font-semibold">SSE &amp; Native WebSockets</span>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Built-In Templates</span>
            <p className="text-2xl font-extrabold text-slate-900">4 Blueprints</p>
            <span className="text-[11px] text-purple-600 font-semibold">OTP, Receipt, Reset, 2FA</span>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">E2E CI/CD Assertions</span>
            <p className="text-2xl font-extrabold text-slate-900">1 Endpoint</p>
            <span className="text-[11px] text-amber-600 font-semibold">GET /emails/otp</span>
          </div>
        </div>

        {/* Quick Nav Anchors */}
        <div className="flex flex-wrap gap-2 pt-2">
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <Icon icon="ph:git-fork-bold" className="w-4 h-4" />
            How It Works Under the Hood
          </a>
          <a
            href="#channels"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <Icon icon="ph:cards-bold" className="w-4 h-4" />
            Explore Communication Channels
          </a>
          <a
            href="#comparison-matrix"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <Icon icon="ph:table-bold" className="w-4 h-4" />
            Channel Comparison Matrix
          </a>
          <a
            href="#cicd-testing"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <Icon icon="ph:git-commit-bold" className="w-4 h-4" />
            CI/CD Test Automation
          </a>
        </div>
      </div>

      {/* 2. How Virtual Communications Work Under the Hood */}
      <div id="how-it-works" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Icon icon="ph:git-fork-bold" className="w-5 h-5 text-indigo-600" />
            How Virtual Email &amp; Communications Work Under the Hood
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Understanding the zero-SMTP interception lifecycle from event trigger to headless test assertion.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-mono text-[10px] font-bold">1. TRIGGER</span>
              <Icon icon="ph:paper-plane-tilt-bold" className="w-4 h-4 text-indigo-600" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold font-mono text-slate-900">Dual Ingestion</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Emails originate either from direct REST calls (<code className="font-mono text-indigo-600">POST /emails/send</code>) or automated system events (e.g. checkout receipts and auth password resets).
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono text-[10px] font-bold">2. COMPILE &amp; PARSE</span>
              <Icon icon="ph:magic-wand-bold" className="w-4 h-4 text-purple-600" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold font-mono text-slate-900">Smart Extraction</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              The engine interpolates Mustache variables (<code className="font-mono text-purple-700">&#123;&#123;name&#125;&#125;</code>) and runs regex parsers to extract 6-digit OTP codes and magic links into JSON fields.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">3. ISOLATE</span>
              <Icon icon="ph:shield-check-bold" className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold font-mono text-slate-900">Zero-SMTP Sandbox</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              No emails touch real mail servers or spam filters. Messages are saved strictly in your isolated visitor sandbox overlay with simulated SPF/DKIM verification tags.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] font-bold">4. CONSUME</span>
              <Icon icon="ph:broadcast-bold" className="w-4 h-4 text-amber-600" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold font-mono text-slate-900">Real-Time Delivery</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Delivered immediately via SSE/WebSockets to the virtual mailbox UI, or asserted instantly in CI/CD suites using <code className="font-mono text-amber-700">GET /emails/otp?to=...</code>.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Channel Directory Modules */}
      <div id="channels" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Communication Channels & Tools
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Four specialized endpoints for intercepting, inspecting, and managing transactional developer communications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CHANNELS.map((ch) => (
            <Link
              key={ch.id}
              href={ch.href}
              className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-md transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ch.color} shadow-2xs`}>
                    <Icon icon={ch.icon} className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                    {ch.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {ch.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                    {ch.desc}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Endpoint:</span>
                <div className="font-mono text-[11px] text-indigo-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 truncate">
                  {ch.endpoints[0]}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Multi-Channel Architectural Comparison */}
      <div id="comparison-matrix" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Channel Matrix & Protocol Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Understanding data transports, real-time sync pipelines, and supported payload structures.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <tr>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Protocol & Interface</th>
                  <th className="py-3 px-4">Supported Payload</th>
                  <th className="py-3 px-4">Real-Time Transport</th>
                  <th className="py-3 px-4">Typical Use Cases</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.channel} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {row.channel}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-indigo-600">
                      {row.protocol}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-700">
                      {row.payload}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-emerald-700">
                      {row.realtime}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {row.useCase}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Automated CI/CD Testing Recipes */}
      <div id="cicd-testing" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Headless CI/CD & E2E Test Automation
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            How to verify account activation, OTP email verification, and order receipts in Playwright, Cypress, and automated test suites.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Icon icon="logos:playwright" className="w-4 h-4" />
              Playwright E2E Test (Extract OTP & Submit Form)
            </h3>
            <CodeBlock
              language="typescript"
              code={`import { test, expect } from '@playwright/test';

test('completes signup with 6-digit email OTP', async ({ page }) => {
  const testEmail = \`qa_\${Date.now()}@example.com\`;

  // 1. Submit registration form in your app
  await page.goto('/signup');
  await page.fill('input[name="email"]', testEmail);
  await page.click('button[type="submit"]');

  // 2. Poll Playground API for the auto-extracted OTP code
  const otpRes = await fetch(\`https://playground.nileslabs.com/api/v1/emails/otp?to=\${testEmail}\`);
  const { otp } = await otpRes.json();
  expect(otp).toHaveLength(6);

  // 3. Enter OTP code into verification screen
  await page.fill('input[name="otp"]', otp);
  await page.click('button:has-text("Verify")');

  // 4. Assert user is logged into dashboard
  await expect(page).toHaveURL('/dashboard');
});`}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Icon icon="logos:cypress-icon" className="w-4 h-4" />
              Cypress Custom Command (Email Assertion)
            </h3>
            <CodeBlock
              language="javascript"
              code={`// cypress/support/commands.js
Cypress.Commands.add('getLatestEmailOtp', (recipientEmail) => {
  return cy.request({
    method: 'GET',
    url: \`https://playground.nileslabs.com/api/v1/emails/otp?to=\${recipientEmail}\`,
  }).then((response) => {
    expect(response.status).to.eq(200);
    return response.body.otp;
  });
});

// In your spec file:
it('verifies password reset flow', () => {
  cy.visit('/forgot-password');
  cy.get('#email').type('buyer@example.com');
  cy.get('#submit-btn').click();

  cy.getLatestEmailOtp('buyer@example.com').then((otp) => {
    cy.get('#otp-code').type(otp);
    cy.get('#confirm-btn').click();
    cy.contains('Password reset successfully').should('be.visible');
  });
});`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
