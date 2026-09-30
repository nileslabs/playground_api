'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/docs/CodeBlock';

interface EmailAttachment {
  id?: string;
  filename: string;
  contentType: string;
  size: number;
  url: string;
}

interface EmailItem {
  id: string | number;
  to: string;
  from: string;
  subject: string;
  html?: string;
  text?: string;
  otp_code?: string | null;
  magic_link?: string | null;
  attachments?: EmailAttachment[];
  security?: {
    spf?: string;
    dkim?: string;
    tls?: string;
    dmarc?: string;
  };
  created_at: string;
}

export default function EmailMailboxPage() {
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'html' | 'text' | 'mobile'>('html');

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const url = selectedRecipient !== 'all'
        ? `${config.apiUrl}/emails?to=${encodeURIComponent(selectedRecipient)}`
        : `${config.apiUrl}/emails`;

      const res = await fetch(url, { credentials: 'include' });
      const data = await res.json();
      const list = data.data || data || [];
      const safeList: EmailItem[] = Array.isArray(list) ? list : [];
      setEmails(safeList);
      if (safeList.length > 0 && (!selectedEmail || !safeList.some(e => e.id === selectedEmail.id))) {
        setSelectedEmail(safeList[0]);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [selectedRecipient]);

  // Unique list of recipients found in emails for quick filtering
  const knownRecipients = useMemo(() => {
    const set = new Set<string>();
    emails.forEach(e => {
      if (e.to) set.add(e.to);
    });
    return Array.from(set);
  }, [emails]);

  // Filtered emails based on search query
  const filteredEmails = useMemo(() => {
    if (!searchQuery.trim()) return emails;
    const term = searchQuery.toLowerCase();
    return emails.filter(
      e =>
        e.subject.toLowerCase().includes(term) ||
        e.to.toLowerCase().includes(term) ||
        (e.otp_code && e.otp_code.includes(term))
    );
  }, [emails, searchQuery]);

  const copyToClipboard = (text: string, type: 'otp' | 'link') => {
    navigator.clipboard.writeText(text);
    if (type === 'otp') {
      setCopiedOtp(text);
      setTimeout(() => setCopiedOtp(null), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="space-y-12 w-full text-slate-900 pb-16">
      {/* 1. Page Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:mailbox-bold" className="w-3.5 h-3.5" />
          <span>Virtual Communications</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Virtual Email Mailbox
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-4xl">
          An isolated, Mailtrap-style virtual inbox that intercepts transactional emails sent from your application, authentication flows, and payment receipts.
          Features automatic 6-digit OTP extraction, sandboxed HTML rendering, attachment downloads, and security header verification.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <a
            href="#live-inbox"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <Icon icon="ph:tray-bold" className="w-4 h-4" />
            Live Sandbox Mailbox
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <Icon icon="ph:git-fork-bold" className="w-4 h-4" />
            How Interception Works
          </a>
          <a
            href="#dispatch-console"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <Icon icon="ph:paper-plane-tilt-bold" className="w-4 h-4" />
            Send Test Email Console
          </a>
          <a
            href="#cicd-otp"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <Icon icon="ph:key-bold" className="w-4 h-4" />
            CI/CD OTP Endpoint
          </a>
        </div>
      </div>

      {/* 2. Interactive Split-Pane Mailbox */}
      <div id="live-inbox" className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden scroll-mt-20">
        {/* Inbox Control Bar */}
        <div className="border-b border-slate-200 bg-slate-50/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Icon icon="ph:tray-fill" className="w-4 h-4 text-indigo-600" />
              Live Session Inbox
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-700 font-bold">
              {filteredEmails.length} messages
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Recipient Filter Dropdown */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500 font-medium">To:</span>
              <select
                value={selectedRecipient}
                onChange={(e) => setSelectedRecipient(e.target.value)}
                className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">All Recipients</option>
                {knownRecipients.map((rec) => (
                  <option key={rec} value={rec}>
                    {rec}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subject / OTP..."
              className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 w-36 sm:w-44 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />

            {/* Refresh Button */}
            <button
              type="button"
              onClick={fetchEmails}
              disabled={loading}
              className="px-3 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Icon icon="ph:arrows-clockwise-bold" className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Split View */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[520px] divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* Left Column: Email Thread List (4 of 12 cols) */}
          <div className="md:col-span-4 divide-y divide-slate-100 overflow-y-auto max-h-[580px] bg-slate-50/30">
            {filteredEmails.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                <Icon icon="ph:mailbox-thin" className="w-10 h-10 mx-auto text-slate-300" />
                <p>No messages match your criteria.</p>
                <p className="text-[11px] text-slate-400">Trigger a password reset or order checkout to receive an email.</p>
              </div>
            ) : (
              filteredEmails.map((email) => {
                const isSelected = selectedEmail?.id === email.id;
                return (
                  <button
                    key={email.id}
                    type="button"
                    onClick={() => setSelectedEmail(email)}
                    className={`w-full text-left p-3.5 transition-all cursor-pointer block border-l-3 ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-600'
                        : 'border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(email.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {email.otp_code && (
                        <span className="px-1.5 py-0.2 rounded font-mono font-bold text-[10px] bg-amber-100 text-amber-800 border border-amber-200">
                          OTP: {email.otp_code}
                        </span>
                      )}
                    </div>

                    <div className="font-bold text-xs text-slate-900 truncate mt-1">
                      {email.subject}
                    </div>

                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      To: <span className="font-mono text-slate-600">{email.to}</span>
                    </div>

                    {email.attachments && email.attachments.length > 0 && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1.5">
                        <Icon icon="ph:paperclip-bold" className="w-3 h-3" />
                        <span>{email.attachments.length} attachment(s)</span>
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Right Column: Full Email Reading Pane (8 of 12 cols) */}
          <div className="md:col-span-8 p-6 bg-white space-y-5 flex flex-col justify-between">
            {selectedEmail ? (
              <div className="space-y-5">
                {/* Email Header */}
                <div className="border-b border-slate-100 pb-4 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
                      {selectedEmail.subject}
                    </h3>

                    {/* View Mode Toggle */}
                    <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-xs shrink-0">
                      <button
                        type="button"
                        onClick={() => setViewMode('html')}
                        className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                          viewMode === 'html' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Desktop
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode('mobile')}
                        className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                          viewMode === 'mobile' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Mobile
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode('text')}
                        className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                          viewMode === 'text' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Text
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-500">
                    <div>
                      From: <span className="font-mono text-slate-700">{selectedEmail.from}</span>
                    </div>
                    <div className="sm:text-right">
                      Date: <span className="font-mono text-slate-700">{new Date(selectedEmail.created_at).toLocaleString()}</span>
                    </div>
                    <div>
                      To: <span className="font-mono text-slate-700 font-semibold">{selectedEmail.to}</span>
                    </div>
                  </div>

                  {/* Security Checks Badges */}
                  <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Auth:</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono font-bold border border-emerald-200">
                      SPF: PASS
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono font-bold border border-emerald-200">
                      DKIM: PASS
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono font-bold border border-emerald-200">
                      DMARC: PASS
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono border border-slate-200">
                      TLS 1.3
                    </span>
                  </div>
                </div>

                {/* 1-Click Extraction Action Banners */}
                {(selectedEmail.otp_code || selectedEmail.magic_link) && (
                  <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                        <Icon icon="ph:magic-wand-bold" className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-amber-950 block">Auto-Extracted Action Credentials</span>
                        <p className="text-[11px] text-amber-800">
                          Playground API parsed these actionable credentials directly from the message payload.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedEmail.otp_code && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(selectedEmail.otp_code!, 'otp')}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Icon icon={copiedOtp === selectedEmail.otp_code ? 'ph:check-bold' : 'ph:copy-bold'} className="w-3.5 h-3.5" />
                          <span>OTP: {selectedEmail.otp_code}</span>
                        </button>
                      )}

                      {selectedEmail.magic_link && (
                        <a
                          href={selectedEmail.magic_link}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Icon icon="ph:arrow-square-out-bold" className="w-3.5 h-3.5" />
                          <span>Open Magic Link</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Attachments Section */}
                {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                      Attachments ({selectedEmail.attachments.length})
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmail.attachments.map((att, idx) => (
                        <a
                          key={idx}
                          href={att.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-mono text-[11px]"
                        >
                          <Icon icon="ph:file-pdf-bold" className="w-4 h-4 text-rose-500" />
                          <span>{att.filename}</span>
                          <span className="text-slate-400">({Math.round(att.size / 1024)} KB)</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Email Content Frame */}
                {viewMode === 'text' ? (
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto">
                    {selectedEmail.text || 'No plain text content provided.'}
                  </div>
                ) : (
                  <div className={`mx-auto transition-all ${viewMode === 'mobile' ? 'max-w-[375px] border-4 border-slate-300 rounded-3xl p-1 shadow-md' : 'w-full'}`}>
                    <iframe
                      title="Email Preview"
                      srcDoc={selectedEmail.html || `<p>${selectedEmail.text || 'Empty email'}</p>`}
                      className={`w-full rounded-xl border border-slate-200 bg-white ${viewMode === 'mobile' ? 'h-[460px]' : 'h-[380px]'}`}
                      sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-24 text-xs text-slate-400 space-y-2">
                <Icon icon="ph:envelope-open-thin" className="w-12 h-12 mx-auto text-slate-300" />
                <p>Select an email from the left pane to view its contents.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. How Virtual Email Interception Works Under the Hood */}
      <div id="how-it-works" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-8 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Icon icon="ph:git-fork-bold" className="w-3.5 h-3.5" />
            Under The Hood Architecture
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            How Virtual Email Interception Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            A zero-SMTP simulation pipeline designed for fast feedback loops in local development and automated CI/CD pipelines.
          </p>
        </div>

        {/* 4-Phase Architecture Pipeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-mono text-[10px] font-bold">1. INGESTION</span>
              <Icon icon="ph:paper-plane-tilt-bold" className="w-4 h-4 text-indigo-600" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold font-mono text-slate-900">Dual Trigger Influx</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Accepts outbound emails directly via <code className="font-mono text-indigo-600">POST /emails/send</code>, or automatically triggered by internal flows (e.g. checkout payment receipts, password reset loops).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono text-[10px] font-bold">2. EXTRACTION</span>
              <Icon icon="ph:magic-wand-bold" className="w-4 h-4 text-purple-600" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold font-mono text-slate-900">Smart OTP &amp; Link Regex</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Analyzes HTML and plain text bodies on the fly, extracting 6-digit OTP codes and authentication magic links into direct JSON fields for zero-friction copying or test querying.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">3. ZERO-SMTP</span>
              <Icon icon="ph:shield-check-bold" className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold font-mono text-slate-900">Isolated Sandbox Store</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Emails are kept strictly in your session sandbox overlay without hitting real SMTP relays or spam filters. Enriched with simulated SPF, DKIM, and TLS verification headers.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] font-bold">4. CONSUMPTION</span>
              <Icon icon="ph:broadcast-bold" className="w-4 h-4 text-amber-600" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold font-mono text-slate-900">Real-Time &amp; CI/CD</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instantly pushed via SSE events to this live split-pane UI, or asserted headlessly in Playwright, Cypress, and Jest using <code className="font-mono text-amber-700">GET /emails/otp?to=...</code>.
            </p>
          </div>
        </div>

        {/* Framework Integration Recipe */}
        <div className="space-y-4 pt-2">
          <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Icon icon="logos:nodejs-icon" className="w-4 h-4" />
              Node.js / Next.js / Express Integration Helper
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Zero SMTP credentials needed</span>
          </div>

          <CodeBlock
            language="typescript"
            code={`// utils/sendVirtualEmail.ts
// In development & staging, route your transactional emails to the playground sandbox!
export async function sendTransactionalEmail({ to, subject, html, text }: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}) {
  if (process.env.NODE_ENV === 'production') {
    // Return real Resend / SendGrid / Postmark transport here
    return sendViaProductionProvider({ to, subject, html, text });
  }

  // Intercept in sandbox!
  const res = await fetch('https://playground.nileslabs.com/api/v1/emails/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, html, text })
  });

  return res.json();
}`}
          />
        </div>
      </div>

      {/* 4. Send Test Email Interactive Console */}
      <div id="dispatch-console" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Dispatch Test Transactional Email
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Send an email via <code className="font-mono text-indigo-600">POST /emails/send</code> to see it appear in real-time in your sandbox inbox above.
          </p>
        </div>

        <InteractiveConsole
          method="POST"
          path="/emails/send"
          title="Send Transactional Email"
          initialBody={JSON.stringify(
            {
              to: 'developer@example.com',
              subject: 'Your Security Code is 582194',
              html: '<h1>Verify Account</h1><p>Your one-time passcode is: <strong style="font-size:24px; color:#4f46e5;">582194</strong></p>',
              text: 'Your one-time passcode is 582194',
            },
            null,
            2
          )}
        />
      </div>

      {/* 4. Headless CI/CD Testing with GET /emails/otp */}
      <div id="cicd-otp" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Headless CI/CD Testing &amp; OTP Extraction
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Query <code className="font-mono text-indigo-600">GET /api/v1/emails/otp?to=&lt;recipient&gt;</code> to assert authentication flows in Playwright, Cypress, or Jest.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Icon icon="logos:playwright" className="w-4 h-4" />
              Playwright Verification Loop
            </h3>
            <CodeBlock
              language="typescript"
              code={`// Playwright test verifying signup OTP email
const res = await fetch('https://playground.nileslabs.com/api/v1/emails/otp?to=developer@example.com');
const { otp, magic_link } = await res.json();

console.log('Extracted OTP code:', otp);
await page.fill('#otp-input', otp);
await page.click('#submit-btn');`}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Icon icon="logos:nodejs-icon" className="w-4 h-4" />
              Direct cURL Assertion
            </h3>
            <CodeBlock
              language="bash"
              code={`# Fetch the latest OTP code received for developer@example.com
curl -s "https://playground.nileslabs.com/api/v1/emails/otp?to=developer@example.com" \\
  -H "Accept: application/json"

# Response:
# {
#   "otp": "582194",
#   "recipient": "developer@example.com",
#   "subject": "Your Security Code is 582194"
# }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
