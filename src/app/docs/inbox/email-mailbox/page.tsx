'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

interface EmailItem {
  id: string;
  to: string;
  from: string;
  subject: string;
  html?: string;
  text?: string;
  created_at: string;
}

export default function EmailMailboxPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${config.apiUrl}/emails`, { credentials: 'include' });
      const data = await res.json();
      const list = data.data || data || [];
      setEmails(Array.isArray(list) ? list : []);
      if (list.length > 0 && !selectedEmail) {
        setSelectedEmail(list[0]);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:mailbox-bold" className="w-3.5 h-3.5" />
          <span>Virtual Communications</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Virtual Email Mailbox
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          An isolated, Mailtrap-style virtual inbox that intercepts all transactional emails, password reset links, order receipts, and welcome messages sent during your session. Zero third-party SMTP setup required.
        </p>
      </div>

      {/* 2. Interactive Split-Pane Mail Reader */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/70 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-900">Live Session Mailbox</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-700 font-semibold">
              {emails.length} messages
            </span>
          </div>

          <button
            type="button"
            onClick={fetchEmails}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Icon icon="ph:arrows-clockwise-bold" className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 min-h-[380px] divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* Email List Column */}
          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[420px]">
            {emails.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No emails recorded yet. Trigger a password reset or order checkout to receive an email.
              </div>
            ) : (
              emails.map((email) => (
                <button
                  key={email.id}
                  type="button"
                  onClick={() => setSelectedEmail(email)}
                  className={`w-full text-left p-3.5 transition-colors cursor-pointer ${
                    selectedEmail?.id === email.id ? 'bg-indigo-50/70' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900 truncate">{email.subject}</div>
                  <div className="text-[11px] text-slate-500 truncate">To: {email.to}</div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {new Date(email.created_at).toLocaleTimeString()}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Email Detail Column */}
          <div className="col-span-2 p-5 bg-white space-y-4">
            {selectedEmail ? (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3 space-y-1">
                  <h3 className="font-bold text-base text-slate-900">{selectedEmail.subject}</h3>
                  <div className="text-xs text-slate-500">
                    From: <span className="font-mono text-slate-700">{selectedEmail.from}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    To: <span className="font-mono text-slate-700">{selectedEmail.to}</span>
                  </div>
                </div>

                {selectedEmail.html ? (
                  <div
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50 text-xs text-slate-700 leading-relaxed overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: selectedEmail.html }}
                  />
                ) : (
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 font-mono text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selectedEmail.text || 'No message content'}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 text-xs text-slate-400">
                Select an email from the left pane to preview its rendered HTML and content.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Send Email Dispatch Tester */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Send Test Email</h3>
          <p className="text-xs text-slate-500">
            Dispatch an email via <code className="font-mono text-xs">POST /emails/send</code> to see it appear immediately in your mailbox:
          </p>
        </div>

        <InteractiveConsole
          method="POST"
          path="/emails/send"
          title="Send Transactional Email"
          initialBody={JSON.stringify(
            {
              to: 'alex@example.com',
              subject: 'Your Order #1042 has shipped!',
              html: '<h1>Order Shipped</h1><p>Your package is on its way. Tracking: <strong>TRK-98721-US</strong></p>',
            },
            null,
            2
          )}
        />
      </div>
    </div>
  );
}
