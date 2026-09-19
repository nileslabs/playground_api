'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface EmailAttachment {
  name: string;
  url: string;
  size?: number | string;
  type?: string;
  cloudinary_public_id?: string;
  content_type?: string;
}

interface InboxItem {
  id: string;
  type: 'email' | 'sms';
  to: string;
  from: string;
  subject?: string;
  body?: string;
  html?: string;
  text?: string;
  otp_code?: string;
  attachments?: EmailAttachment[];
  security?: {
    spf?: boolean;
    dkim?: boolean;
    tls?: boolean;
  };
  created_at: string;
  [key: string]: unknown;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html: string;
  text?: string;
  variables: string[];
  is_custom?: boolean;
}

export function LiveInboxViewer() {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InboxItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<'all' | 'email' | 'sms'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'html' | 'text' | 'json'>('html');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  
  // Composer Modal State
  const [showComposer, setShowComposer] = useState<boolean>(false);
  const [composeType, setComposeType] = useState<'email' | 'sms'>('email');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('welcome-verification');
  const [composeTo, setComposeTo] = useState<string>('alex.developer@example.com');
  const [composePhone, setComposePhone] = useState<string>('+1 (555) 839-2049');
  const [composeSubject, setComposeSubject] = useState<string>('Verify your email address');
  const [composeBody, setComposeBody] = useState<string>('Your verification code is 492018. Valid for 10 minutes.');
  const [templateVars, setTemplateVars] = useState<Record<string, string>>({
    name: 'Alex Developer',
    otp: '582910',
    verification_link: 'https://playground.nileslabs.com/docs/inbox?code=582910',
    expires_in_minutes: '15'
  });
  const [sending, setSending] = useState<boolean>(false);
  const [copiedOtp, setCopiedOtp] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [previewAttachment, setPreviewAttachment] = useState<EmailAttachment | null>(null);
  const [sseConnected, setSseConnected] = useState<boolean>(false);

  const rawApiUrl = config.publicApiUrl || 'http://localhost:5000/api/v1';

  // Fetch Inbox Data
  const fetchInbox = async () => {
    try {
      const res = await fetch(`${rawApiUrl}/inbox`, { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        const data: InboxItem[] = json.data || [];
        setItems(data);
        if (!selectedItem && data.length > 0) {
          setSelectedItem(data[0]);
        } else if (selectedItem) {
          // Keep selection synced
          const updated = data.find(i => i.id === selectedItem.id);
          if (updated) setSelectedItem(updated);
        }
      }
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  // Fetch Templates
  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${rawApiUrl}/emails/templates`, { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        setTemplates(json.data || []);
      }
    } catch (_) {}
  };

  // Initial load and SSE setup
  useEffect(() => {
    setLoading(true);
    fetchInbox();
    fetchTemplates();

    // Setup SSE connection
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource(`${rawApiUrl}/stream/notifications`, { withCredentials: true });
      eventSource.onopen = () => {
        setSseConnected(true);
      };
      eventSource.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload.event === 'email.sent' || payload.event === 'sms.sent' || payload.event?.startsWith('auth.')) {
            fetchInbox();
          }
        } catch (_) {}
      };
      eventSource.onerror = () => {
        setSseConnected(false);
      };
    } catch (_) {}

    const interval = setInterval(fetchInbox, 6000);

    return () => {
      clearInterval(interval);
      if (eventSource) eventSource.close();
    };
  }, [rawApiUrl]);

  // Handle template selection change in composer
  useEffect(() => {
    const tmpl = templates.find(t => t.id === selectedTemplateId);
    if (tmpl) {
      setComposeSubject(tmpl.subject);
      const initialVars: Record<string, string> = {};
      tmpl.variables.forEach(v => {
        if (v === 'name') initialVars[v] = 'Alex Developer';
        else if (v === 'otp' || v === 'code') initialVars[v] = String(Math.floor(100000 + Math.random() * 900000));
        else if (v === 'verification_link' || v === 'reset_link') initialVars[v] = `https://playground.nileslabs.com/docs/inbox?otp=582910`;
        else if (v === 'amount') initialVars[v] = '$49.00';
        else if (v === 'invoice_id') initialVars[v] = 'INV-2026-098';
        else if (v === 'plan_name') initialVars[v] = 'Pro Developer Sandbox';
        else initialVars[v] = 'Sample Value';
      });
      setTemplateVars(initialVars);
    }
  }, [selectedTemplateId, templates]);

  // Interpolated HTML preview for template composer
  const getComposedHtmlPreview = () => {
    const tmpl = templates.find(t => t.id === selectedTemplateId);
    if (!tmpl) return '';
    let html = tmpl.html;
    Object.entries(templateVars).forEach(([key, val]) => {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), val);
    });
    return html;
  };

  // Delete single message
  const handleDeleteItem = async (e: React.MouseEvent, item: InboxItem) => {
    e.stopPropagation();
    try {
      const endpoint = item.type === 'email' ? `${rawApiUrl}/emails/${item.id}` : `${rawApiUrl}/sms/${item.id}`;
      await fetch(endpoint, { method: 'DELETE', credentials: 'include' });
      setItems(prev => prev.filter(i => i.id !== item.id));
      if (selectedItem?.id === item.id) {
        const remaining = items.filter(i => i.id !== item.id);
        setSelectedItem(remaining.length > 0 ? remaining[0] : null);
      }
    } catch (_) {}
  };

  // Clear all messages
  const handleClearInbox = async () => {
    if (!confirm('Are you sure you want to clear all emails and SMS messages from your sandbox inbox?')) return;
    try {
      await fetch(`${rawApiUrl}/inbox`, { method: 'DELETE', credentials: 'include' });
      setItems([]);
      setSelectedItem(null);
    } catch (_) {}
  };

  // Send message from composer
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      if (composeType === 'email') {
        const res = await fetch(`${rawApiUrl}/emails/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            to: composeTo,
            template: selectedTemplateId,
            data: templateVars
          })
        });
        if (res.ok) {
          const json = await res.json();
          setShowComposer(false);
          await fetchInbox();
          if (json.email) setSelectedItem(json.email);
        }
      } else {
        const res = await fetch(`${rawApiUrl}/sms/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            to: composePhone,
            body: composeBody
          })
        });
        if (res.ok) {
          const json = await res.json();
          setShowComposer(false);
          await fetchInbox();
          if (json.sms) setSelectedItem(json.sms);
        }
      }
    } catch (_) {
    } finally {
      setSending(false);
    }
  };

  const handleCopyOtp = (otp: string) => {
    navigator.clipboard.writeText(otp);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  // Filter items
  const filteredItems = items.filter(item => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTo = item.to?.toLowerCase().includes(q);
      const matchFrom = item.from?.toLowerCase().includes(q);
      const matchSubject = item.subject?.toLowerCase().includes(q);
      const matchBody = (item.body || item.text || '')?.toLowerCase().includes(q);
      const matchOtp = item.otp_code?.includes(q);
      if (!matchTo && !matchFrom && !matchSubject && !matchBody && !matchOtp) return false;
    }
    return true;
  });

  const emailCount = items.filter(i => i.type === 'email').length;
  const smsCount = items.filter(i => i.type === 'sms').length;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Icon icon="lucide:mail-check" className="w-3.5 h-3.5" />
                Virtual Mailbox Sandbox
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                sseConnected 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                <span className={`w-2 h-2 rounded-full ${sseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                {sseConnected ? 'Live Real-Time SSE' : 'Polling Sync'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Virtual Email &amp; SMS Web Inbox
            </h1>
            <p className="mt-1.5 text-sm text-slate-300 max-w-2xl">
              Inspect test emails, OTP verification codes, magic links, itemized receipts with Cloudinary attachments, and SMS messages dispatched in your sandbox session.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowComposer(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Icon icon="lucide:plus" className="w-4 h-4" />
              Compose &amp; Templates
            </button>
            <button
              onClick={handleClearInbox}
              disabled={items.length === 0}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm border border-white/10 transition-all cursor-pointer"
              title="Clear all messages in current sandbox session"
            >
              <Icon icon="lucide:trash-2" className="w-4 h-4 text-rose-300" />
              Clear Inbox
            </button>
          </div>
        </div>
      </div>

      {/* Main Split-Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[680px]">
        {/* Left Column: Messages List (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          {/* List Header & Filters */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 dark:bg-slate-800/80 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    filterType === 'all' 
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All ({items.length})
                </button>
                <button
                  onClick={() => setFilterType('email')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    filterType === 'email' 
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon icon="lucide:mail" className="w-3.5 h-3.5" />
                  Emails ({emailCount})
                </button>
                <button
                  onClick={() => setFilterType('sms')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    filterType === 'sms' 
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon icon="lucide:smartphone" className="w-3.5 h-3.5" />
                  SMS ({smsCount})
                </button>
              </div>

              <button
                onClick={fetchInbox}
                disabled={loading}
                className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Refresh inbox"
              >
                <Icon icon="lucide:refresh-cw" className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-500' : ''}`} />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Icon icon="lucide:search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipients, subjects, OTP codes..."
                className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <Icon icon="lucide:x" className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* List Items Scroll Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[580px]">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center mb-3">
                  <Icon icon="lucide:inbox" className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">No messages found</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                  {searchQuery ? 'Try adjusting your search query or filters.' : 'Send a test email/SMS or trigger an auth signup to see messages here.'}
                </p>
                <button
                  onClick={() => setShowComposer(true)}
                  className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/80 text-indigo-600 dark:text-indigo-400 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Icon icon="lucide:send" className="w-3.5 h-3.5" />
                  Send Test Message
                </button>
              </div>
            ) : (
              filteredItems.map(item => {
                const isSelected = selectedItem?.id === item.id;
                const isEmail = item.type === 'email';
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-4 cursor-pointer transition-all relative group ${
                      isSelected
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-l-4 border-l-indigo-600 dark:border-l-indigo-500'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs shrink-0 ${
                          isEmail 
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300' 
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                        }`}>
                          <Icon icon={isEmail ? 'lucide:mail' : 'lucide:smartphone'} className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-200 truncate">
                          {item.to}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0">
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h4 className="text-xs font-medium text-slate-800 dark:text-slate-300 truncate mb-1">
                      {isEmail ? (item.subject || '(No Subject)') : (item.body?.slice(0, 60) || '(Empty SMS)')}
                    </h4>

                    <div className="flex items-center justify-between gap-2 mt-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.otp_code && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/40">
                            <Icon icon="lucide:key-round" className="w-3 h-3" />
                            OTP: {item.otp_code}
                          </span>
                        )}
                        {item.attachments && item.attachments.length > 0 && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            <Icon icon="lucide:paperclip" className="w-3 h-3" />
                            {item.attachments.length}
                          </span>
                        )}
                        {isEmail && item.security?.spf && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                            <Icon icon="lucide:shield-check" className="w-3 h-3" />
                            SPF
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleDeleteItem(e, item)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                        title="Delete message"
                      >
                        <Icon icon="lucide:trash" className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Message Detail & Inspector (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          {selectedItem ? (
            <div className="flex flex-col h-full">
              {/* Message Header */}
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        selectedItem.type === 'email'
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                      }`}>
                        <Icon icon={selectedItem.type === 'email' ? 'lucide:mail' : 'lucide:smartphone'} className="w-3.5 h-3.5" />
                        {selectedItem.type === 'email' ? 'Email Message' : 'SMS Message'}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {new Date(selectedItem.created_at).toLocaleString()}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {selectedItem.subject || (selectedItem.type === 'sms' ? `SMS to ${selectedItem.to}` : '(No Subject)')}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDeleteItem(e, selectedItem)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                      title="Delete this message"
                    >
                      <Icon icon="lucide:trash-2" className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Routing & Security Chips */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400 font-medium">From:</span>
                      <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-200">
                        {selectedItem.from}
                      </code>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400 font-medium">To:</span>
                      <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400 font-semibold">
                        {selectedItem.to}
                      </code>
                    </div>
                  </div>

                  {selectedItem.type === 'email' && selectedItem.security && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                        <Icon icon="lucide:check-circle-2" className="w-3 h-3 text-emerald-500" />
                        SPF PASS
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                        <Icon icon="lucide:shield-check" className="w-3 h-3 text-emerald-500" />
                        DKIM PASS
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40">
                        <Icon icon="lucide:lock" className="w-3 h-3 text-blue-500" />
                        TLS 1.3
                      </span>
                    </div>
                  )}
                </div>

                {/* OTP Quick Extract Banner */}
                {selectedItem.otp_code && (
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                        <Icon icon="lucide:key" className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[11px] font-medium text-amber-700 dark:text-amber-300">
                          Detected One-Time Verification Code (OTP)
                        </div>
                        <div className="font-mono text-xl font-black tracking-widest text-slate-900 dark:text-white">
                          {selectedItem.otp_code}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopyOtp(selectedItem.otp_code!)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                    >
                      <Icon icon={copiedOtp ? 'lucide:check' : 'lucide:copy'} className="w-3.5 h-3.5" />
                      {copiedOtp ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>
                )}

                {/* Cloudinary Attachments Bar */}
                {selectedItem.attachments && selectedItem.attachments.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                        <Icon icon="lucide:paperclip" className="w-3.5 h-3.5" />
                        Cloudinary CDN Attachments ({selectedItem.attachments.length})
                      </span>
                      <span className="text-[11px] text-indigo-500 dark:text-indigo-400 font-mono">
                        playground_api/emails/attachments/
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedItem.attachments.map((att, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-400 transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                              <Icon icon={att.type?.includes('pdf') ? 'lucide:file-text' : 'lucide:image'} className="w-4 h-4" />
                            </span>
                            <div className="min-w-0">
                              <div className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate" title={att.name}>
                                {att.name}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {typeof att.size === 'number' ? `${(att.size / 1024).toFixed(1)} KB` : (att.size || 'CDN Asset')}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => setPreviewAttachment(att)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                              title="Preview attachment"
                            >
                              <Icon icon="lucide:eye" className="w-3.5 h-3.5" />
                            </button>
                            <a
                              href={att.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                              title="Download / Open CDN URL"
                            >
                              <Icon icon="lucide:external-link" className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* View Switcher Tabs */}
              <div className="px-5 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {selectedItem.type === 'email' && (
                    <button
                      onClick={() => setActiveTab('html')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === 'html'
                          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      Rendered HTML
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab('text')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'text'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Plain Text
                  </button>
                  <button
                    onClick={() => setActiveTab('json')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'json'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Raw API JSON
                  </button>
                </div>

                {activeTab === 'html' && selectedItem.type === 'email' && (
                  <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-700 p-0.5 rounded-lg text-xs">
                    <button
                      onClick={() => setPreviewDevice('desktop')}
                      className={`p-1 rounded ${previewDevice === 'desktop' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
                      title="Desktop Preview"
                    >
                      <Icon icon="lucide:monitor" className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      className={`p-1 rounded ${previewDevice === 'mobile' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
                      title="Mobile Preview"
                    >
                      <Icon icon="lucide:smartphone" className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* View Body Content */}
              <div className="flex-1 p-5 overflow-y-auto bg-slate-50/30 dark:bg-slate-900/30">
                {activeTab === 'html' && selectedItem.type === 'email' && (
                  <div className="flex justify-center h-full">
                    <div className={`transition-all duration-300 bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden ${
                      previewDevice === 'mobile' ? 'w-[375px] h-[550px]' : 'w-full h-full min-h-[480px]'
                    }`}>
                      <iframe
                        srcDoc={selectedItem.html || '<p>No HTML body</p>'}
                        title="Email Body Preview"
                        sandbox="allow-popups allow-popups-to-escape-sandbox"
                        className="w-full h-full border-0"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'text' && (
                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {selectedItem.text || selectedItem.body || selectedItem.html?.replace(/<[^>]+>/g, '') || '(Empty body)'}
                  </div>
                )}

                {activeTab === 'json' && (
                  <div className="rounded-xl overflow-hidden">
                    <CodeBlock
                      code={JSON.stringify(selectedItem, null, 2)}
                      language="json"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-400">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400">
                <Icon icon="lucide:mail-open" className="w-8 h-8" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No message selected</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Select a message from the sidebar to inspect rendered HTML, verify security headers, extract OTP codes, or download Cloudinary attachments.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Compose & Template Studio Modal */}
      {showComposer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Icon icon="lucide:send" className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Live Message Composer &amp; Template Studio
                  </h3>
                  <p className="text-xs text-slate-500">
                    Send simulated transactional emails and SMS directly into your sandbox inbox.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowComposer(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSendMessage} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Type Switcher */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setComposeType('email')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                    composeType === 'email'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Icon icon="lucide:mail" className="w-4 h-4" />
                  Email Message
                </button>
                <button
                  type="button"
                  onClick={() => setComposeType('sms')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                    composeType === 'sms'
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Icon icon="lucide:smartphone" className="w-4 h-4" />
                  SMS Message
                </button>
              </div>

              {composeType === 'email' ? (
                <div className="space-y-4">
                  {/* Template Picker */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Select Template
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {templates.map(tmpl => (
                        <button
                          key={tmpl.id}
                          type="button"
                          onClick={() => setSelectedTemplateId(tmpl.id)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            selectedTemplateId === tmpl.id
                              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {tmpl.name}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {tmpl.variables.length} variables
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recipient Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Recipient Email (to)
                    </label>
                    <input
                      type="email"
                      required
                      value={composeTo}
                      onChange={(e) => setComposeTo(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  {/* Template Variables Form */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Template Variables Substitution
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                      {Object.keys(templateVars).map(key => (
                        <div key={key}>
                          <label className="block text-[11px] font-mono text-slate-500 mb-1">
                            {`{{${key}}}`}
                          </label>
                          <input
                            type="text"
                            value={templateVars[key] || ''}
                            onChange={(e) => setTemplateVars({ ...templateVars, [key]: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Live Rendered Preview */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Live HTML Output Preview
                    </label>
                    <div className="h-44 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white">
                      <iframe
                        srcDoc={getComposedHtmlPreview()}
                        title="Template Live Preview"
                        sandbox=""
                        className="w-full h-full border-0"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Recipient Phone Number (to)
                    </label>
                    <input
                      type="text"
                      required
                      value={composePhone}
                      onChange={(e) => setComposePhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      SMS Body Text
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={composeBody}
                      onChange={(e) => setComposeBody(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                    <span className="text-[11px] text-slate-400">
                      Tip: Include a 6-digit numeric code (e.g. 849201) to automatically test OTP extraction.
                    </span>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowComposer(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all active:scale-95 cursor-pointer ${
                    composeType === 'email'
                      ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                  }`}
                >
                  <Icon icon={sending ? 'lucide:loader-2' : 'lucide:send'} className={`w-4 h-4 ${sending ? 'animate-spin' : ''}`} />
                  {sending ? 'Sending...' : 'Send to My Virtual Inbox'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attachment Preview Lightbox */}
      {previewAttachment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:paperclip" className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {previewAttachment.name}
                </span>
              </div>
              <button
                onClick={() => setPreviewAttachment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl min-h-[220px]">
              <Icon icon="lucide:file-check" className="w-16 h-16 text-indigo-500 mb-3" />
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Cloudinary CDN Hosted Asset
              </p>
              <code className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 mt-1 max-w-md truncate">
                {previewAttachment.url}
              </code>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <a
                href={previewAttachment.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20"
              >
                <Icon icon="lucide:external-link" className="w-3.5 h-3.5" />
                Open File in New Tab
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
