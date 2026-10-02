'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/docs/CodeBlock';

interface SmsItem {
  id: string | number;
  to: string;
  from: string;
  message: string;
  otp_code?: string | null;
  created_at: string;
}

export default function SmsTerminalPage() {
  const [messages, setMessages] = useState<SmsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState<string | null>(null);

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

  const handleCopyOtp = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedOtp(code);
    setTimeout(() => setCopiedOtp(null), 2000);
  };

  return (
    <div className="space-y-12 w-full text-slate-900 pb-16">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider border border-emerald-100">
          <Icon icon="ph:device-mobile-bold" className="w-3.5 h-3.5" />
          <span>Virtual Communications</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Virtual SMS Terminal &amp; 2FA Simulator
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-4xl">
          Test mobile phone number verifications, SMS-based two-factor authentication (2FA), and critical security alerts.
          Automatically detects 4-digit and 6-digit numeric passcodes without carrier contracts or Twilio API keys.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <a
            href="#phone-mockup"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <Icon icon="ph:device-mobile-camera-bold" className="w-4 h-4" />
            Interactive Mobile Terminal
          </a>
          <a
            href="#interactive-consoles"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <Icon icon="ph:terminal-window-bold" className="w-4 h-4" />
            API Consoles
          </a>
          <a
            href="#twilio-integration"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <Icon icon="ph:code-bold" className="w-4 h-4" />
            Twilio Integration Recipes
          </a>
        </div>
      </div>

      {/* 2. Interactive Phone Viewer & Info Split */}
      <div id="phone-mockup" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-20">
        {/* Mock Phone Frame (5 of 12 cols) */}
        <div className="lg:col-span-5 max-w-sm mx-auto w-full">
          <div className="rounded-[40px] border-8 border-slate-800 bg-slate-950 p-3 shadow-2xl space-y-3">
            {/* Phone Speaker Notch & Status Bar */}
            <div className="px-4 pt-1 flex items-center justify-between text-white text-[10px] font-medium">
              <span>9:41</span>
              <div className="w-16 h-3 bg-slate-800 rounded-full" />
              <div className="flex items-center gap-1">
                <Icon icon="ph:wifi-high-bold" className="w-3 h-3" />
                <Icon icon="ph:battery-charging-bold" className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Phone Screen */}
            <div className="rounded-3xl bg-slate-900 min-h-115 flex flex-col justify-between overflow-hidden border border-slate-800/80">
              {/* Screen Header */}
              <div className="px-4 py-3 bg-slate-800/90 border-b border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                    SMS
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-100 block">Messages</span>
                    <span className="text-[10px] text-slate-400">Visitor Sandbox Phone</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={fetchSms}
                  disabled={loading}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer flex items-center gap-1"
                >
                  <Icon icon="ph:arrows-clockwise-bold" className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                  <span>Sync</span>
                </button>
              </div>

              {/* Chat Message Stream */}
              <div className="p-4 space-y-3 overflow-y-auto max-h-95 flex-1">
                {messages.length === 0 ? (
                  <div className="text-center py-20 text-xs text-slate-500 space-y-2">
                    <Icon icon="ph:chat-teardrop-slash-thin" className="w-8 h-8 mx-auto text-slate-600" />
                    <p>No incoming SMS recorded.</p>
                    <p className="text-[10px] text-slate-600">Send an SMS via the API console below.</p>
                  </div>
                ) : (
                  messages.map((sms) => (
                    <div key={sms.id} className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 px-1 font-mono">
                        <span>{sms.from}</span>
                        <span>{new Date(sms.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      {/* Bubble */}
                      <div className="p-3 rounded-2xl bg-indigo-600 text-white text-xs leading-relaxed space-y-2 shadow-sm rounded-tl-sm">
                        <p>{sms.message}</p>

                        {/* OTP Extraction Chip */}
                        {sms.otp_code && (
                          <div className="pt-1 border-t border-indigo-400/40 flex items-center justify-between">
                            <span className="text-[10px] text-indigo-100">Passcode:</span>
                            <button
                              type="button"
                              onClick={() => handleCopyOtp(sms.otp_code!)}
                              className="px-2 py-0.5 rounded bg-white text-indigo-900 font-mono font-bold text-[11px] flex items-center gap-1 cursor-pointer hover:bg-indigo-50"
                            >
                              <Icon icon={copiedOtp === sms.otp_code ? 'ph:check-bold' : 'ph:copy-bold'} className="w-3 h-3" />
                              <span>{copiedOtp === sms.otp_code ? 'Copied' : sms.otp_code}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Explanation & Architecture (7 of 12 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Virtual SMS Capabilities</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real telecom SMS gateways (Twilio, MessageBird, AWS SNS) charge per delivery, require regulatory A2P 10DLC registration,
              and take several seconds to hit physical handsets. Playground API intercepts SMS requests locally in memory with sub-millisecond latencies.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Icon icon="ph:magic-wand-bold" className="w-4 h-4 text-emerald-600" />
                  Auto OTP Code Extractor
                </span>
                <p className="text-[11px] text-slate-500">
                  Detects 4-digit or 6-digit codes automatically and attaches them to the <code className="font-mono text-slate-700">otp_code</code> JSON attribute.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Icon icon="ph:broadcast-bold" className="w-4 h-4 text-indigo-600" />
                  Real-Time Broadcast
                </span>
                <p className="text-[11px] text-slate-500">
                  Emits SSE events (<code className="font-mono text-slate-700">sms.received</code>) and WebSocket broadcasts whenever a message arrives.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Supported Outbound Payload</h3>
            <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed overflow-x-auto">
              {`POST /api/v1/sms/send
{
  "to": "+1 (555) 012-3456",
  "from": "+1 (555) 019-9000",
  "message": "Your verification code is 491028"
}`}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive API Consoles */}
      <div id="interactive-consoles" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Interactive SMS Consoles
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Dispatch SMS messages and query active device logs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">1. Send SMS Message</h3>
            <InteractiveConsole
              method="POST"
              path="/sms/send"
              title="Dispatch Virtual SMS"
              initialBody={JSON.stringify(
                {
                  to: '+1 (555) 012-3456',
                  from: '+1 (555) 019-9000',
                  message: 'Your verification code is 491028. Valid for 10 minutes.',
                },
                null,
                2
              )}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">2. Query SMS History</h3>
            <InteractiveConsole
              method="GET"
              path="/sms"
              title="List Received SMS Messages"
            />
          </div>
        </div>
      </div>

      {/* 4. Production Twilio Integration Recipes */}
      <div id="twilio-integration" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Twilio-Compatible SDK Integration
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Swap your production Twilio URL to Playground API in your local and staging environments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Icon icon="logos:nodejs-icon" className="w-4 h-4" />
              Node.js Fetch / Axios Wrapper
            </h3>
            <CodeBlock
              language="javascript"
              code={`import axios from 'axios';

export async function sendVerificationSms(phoneNumber, otpCode) {
  const isDev = process.env.NODE_ENV !== 'production';
  const apiUrl = isDev
    ? 'https://playground.nileslabs.com/api/v1/sms/send'
    : 'https://api.twilio.com/2010-04-01/Accounts/.../Messages.json';

  const response = await axios.post(apiUrl, {
    to: phoneNumber,
    from: '+15550199000',
    message: \`Your security verification code is: \${otpCode}\`,
  });

  return response.data;
}`}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Icon icon="logos:python" className="w-4 h-4" />
              Python Requests Wrapper
            </h3>
            <CodeBlock
              language="python"
              code={`import requests

def send_sms_alert(phone_number: str, text: str):
    res = requests.post(
        "https://playground.nileslabs.com/api/v1/sms/send",
        json={
            "to": phone_number,
            "message": text
        }
    )
    return res.json()`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
