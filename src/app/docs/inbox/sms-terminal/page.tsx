'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

interface SmsItem {
  id: string;
  to: string;
  body: string;
  created_at: string;
}

export default function SmsTerminalPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const [messages, setMessages] = useState<SmsItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSms = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${config.apiUrl}/sms`, { credentials: 'include' });
      const data = await res.json();
      const list = data.data || data || [];
      setMessages(Array.isArray(list) ? list : []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSms();
  }, []);

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:device-mobile-bold" className="w-3.5 h-3.5" />
          <span>Virtual Communications</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Virtual SMS Terminal
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Test mobile phone number verification, two-factor authentication (2FA) OTP codes, and outbound SMS alerts without configuring Twilio or carrier credentials.
        </p>
      </div>

      {/* 2. Interactive Phone Viewer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Mock Phone Frame */}
        <div className="rounded-3xl border-4 border-slate-300 bg-slate-950 p-4 shadow-xl max-w-sm mx-auto w-full">
          <div className="rounded-2xl bg-slate-900 p-4 space-y-4 min-h-[360px] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-200">Messages</span>
              <button
                type="button"
                onClick={fetchSms}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
              >
                Refresh
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[280px]">
              {messages.length === 0 ? (
                <div className="text-center py-16 text-xs text-slate-500">
                  No SMS messages received yet.
                </div>
              ) : (
                messages.map((sms) => (
                  <div key={sms.id} className="space-y-1">
                    <div className="text-[10px] text-slate-400 font-mono">To: {sms.to}</div>
                    <div className="p-3 rounded-2xl bg-indigo-600 text-white text-xs leading-relaxed max-w-[90%]">
                      {sms.body}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="text-[10px] text-center text-slate-500">
              Virtual SMS Terminal • Sandbox Encrypted
            </div>
          </div>
        </div>

        {/* Dispatch Console */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-bold text-base text-slate-900">Dispatch Outbound SMS</h3>
            <p className="text-xs text-slate-500">
              Post to <code className="font-mono text-xs">/sms/send</code> to verify client dispatch:
            </p>
          </div>

          <InteractiveConsole
            method="POST"
            path="/sms/send"
            title="Send SMS Message"
            initialBody={JSON.stringify(
              {
                to: '+1-415-555-0199',
                body: 'Your verification OTP is 482-910. Valid for 5 minutes.',
              },
              null,
              2
            )}
          />
        </div>
      </div>
    </div>
  );
}
