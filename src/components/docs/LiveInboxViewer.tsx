'use client';

import React, { useState, useEffect } from 'react';
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
    <div className="space-y-6 text-text-primary">
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-border-default bg-bg-terminal p-6 md:p-8 text-text-primary shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                <Icon icon="lucide:mail-check" className="w-3.5 h-3.5" />
                Virtual Mailbox Sandbox
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                sseConnected 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                <span className={`w-2 h-2 rounded-full ${sseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                {sseConnected ? 'Live Real-Time SSE' : 'Polling Sync'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary">
              Virtual Email &amp; SMS Web Inbox
            </h1>
            <p className="mt-1.5 text-sm text-text-secondary max-w-2xl leading-relaxed">
              Inspect test emails, OTP verification codes, magic links, itemized receipts with Cloudinary attachments, and SMS messages dispatched in your private sandbox session.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowComposer(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-medium text-sm shadow-lg shadow-brand-primary/20 transition-all cursor-pointer"
            >
              <Icon icon="lucide:plus" className="w-4 h-4" />
              Compose &amp; Templates
            </button>
            <button
              type="button"
              onClick={handleClearInbox}
              disabled={items.length === 0}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-bg-surface hover:bg-bg-elevated disabled:opacity-50 disabled:cursor-not-allowed text-text-primary font-medium text-sm border border-border-default transition-all cursor-pointer"
              title="Clear all messages in current sandbox session"
            >
              <Icon icon="lucide:trash-2" className="w-4 h-4 text-rose-400" />
              Clear Inbox
            </button>
          </div>
        </div>
      </div>

      {/* Main Split-Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-170">
        {/* Left Column: Messages List (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl border border-border-default bg-bg-surface overflow-hidden shadow-sm">
          {/* List Header & Filters */}
          <div className="p-4 border-b border-border-default bg-bg-terminal space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 p-1 bg-bg-surface rounded-xl border border-border-default text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    filterType === 'all' 
                      ? 'bg-brand-primary text-white shadow-xs font-bold' 
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  All ({items.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('email')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    filterType === 'email' 
                      ? 'bg-brand-primary text-white shadow-xs font-bold' 
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Icon icon="lucide:mail" className="w-3.5 h-3.5" />
                  Emails ({emailCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('sms')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    filterType === 'sms' 
                      ? 'bg-brand-primary text-white shadow-xs font-bold' 
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Icon icon="lucide:smartphone" className="w-3.5 h-3.5" />
                  SMS ({smsCount})
                </button>
              </div>

              <button
                type="button"
                onClick={fetchInbox}
                disabled={loading}
                className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-bg-elevated transition-colors cursor-pointer"
                title="Refresh inbox"
              >
                <Icon icon="lucide:refresh-cw" className={`w-4 h-4 ${loading ? 'animate-spin text-brand-primary' : ''}`} />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Icon icon="lucide:search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipients, subjects, OTP codes..."
                className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-bg-surface border border-border-default text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-pointer"
                >
                  <Icon icon="lucide:x" className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* List Items Scroll Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-border-subtle max-h-145">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-3 border border-brand-primary/20">
                  <Icon icon="lucide:inbox" className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-text-primary">No messages found</h4>
                <p className="text-xs text-text-secondary mt-1 max-w-xs">
                  {searchQuery ? 'Try adjusting your search query or filters.' : 'Send a test email/SMS or trigger an auth signup to see messages here.'}
                </p>
                <button
                  type="button"
                  onClick={() => setShowComposer(true)}
                  className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary text-xs font-medium border border-brand-primary/20 transition-colors cursor-pointer"
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
                        ? 'bg-brand-primary/10 border-l-4 border-l-brand-primary'
                        : 'hover:bg-bg-elevated/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs shrink-0 ${
                          isEmail 
                            ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          <Icon icon={isEmail ? 'lucide:mail' : 'lucide:smartphone'} className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-xs font-semibold text-text-primary truncate">
                          {item.to}
                        </span>
                      </div>
                      <span className="text-[11px] text-text-muted whitespace-nowrap shrink-0">
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h4 className="text-xs font-medium text-text-secondary truncate mb-1">
                      {isEmail ? (item.subject || '(No Subject)') : (item.body?.slice(0, 60) || '(Empty SMS)')}
                    </h4>

                    <div className="flex items-center justify-between gap-2 mt-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.otp_code && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            <Icon icon="lucide:key-round" className="w-3 h-3" />
                            OTP: {item.otp_code}
                          </span>
                        )}
                        {item.attachments && item.attachments.length > 0 && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] bg-bg-terminal text-text-secondary border border-border-default">
                            <Icon icon="lucide:paperclip" className="w-3 h-3" />
                            {item.attachments.length}
                          </span>
                        )}
                        {isEmail && item.security?.spf && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-400 font-medium">
                            <Icon icon="lucide:shield-check" className="w-3 h-3" />
                            SPF
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteItem(e, item)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/10 text-text-muted hover:text-rose-400 transition-all cursor-pointer"
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
        <div className="lg:col-span-7 flex flex-col rounded-2xl border border-border-default bg-bg-surface overflow-hidden shadow-sm">
          {selectedItem ? (
            <div className="flex flex-col h-full">
              {/* Message Header */}
              <div className="p-5 border-b border-border-default bg-bg-terminal space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        selectedItem.type === 'email'
                          ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        <Icon icon={selectedItem.type === 'email' ? 'lucide:mail' : 'lucide:smartphone'} className="w-3.5 h-3.5" />
                        {selectedItem.type === 'email' ? 'Email Message' : 'SMS Message'}
                      </span>
                      <span className="text-xs text-text-muted">
                        {new Date(selectedItem.created_at).toLocaleString()}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-text-primary">
                      {selectedItem.subject || (selectedItem.type === 'sms' ? `SMS to ${selectedItem.to}` : '(No Subject)')}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleDeleteItem(e, selectedItem)}
                      className="p-2 rounded-xl text-text-muted hover:text-rose-400 hover:bg-rose-500/10 border border-border-default transition-colors cursor-pointer"
                      title="Delete this message"
                    >
                      <Icon icon="lucide:trash-2" className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Routing & Security Chips */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <span className="text-text-muted font-medium">From:</span>
                      <code className="font-mono bg-bg-surface px-1.5 py-0.5 rounded text-text-primary border border-border-default">
                        {selectedItem.from}
                      </code>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary">
                      <span className="text-text-muted font-medium">To:</span>
                      <code className="font-mono bg-bg-surface px-1.5 py-0.5 rounded text-brand-primary font-semibold border border-border-default">
                        {selectedItem.to}
                      </code>
                    </div>
                  </div>

                  {selectedItem.type === 'email' && selectedItem.security && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <Icon icon="lucide:check-circle-2" className="w-3 h-3 text-emerald-400" />
                        SPF PASS
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <Icon icon="lucide:shield-check" className="w-3 h-3 text-emerald-400" />
                        DKIM PASS
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-brand-primary/10 text-brand-primary border border-brand-primary/30">
                        <Icon icon="lucide:lock" className="w-3 h-3 text-brand-primary" />
                        TLS 1.3
                      </span>
                    </div>
                  )}
                </div>

                {/* OTP Quick Extract Banner */}
                {selectedItem.otp_code && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                        <Icon icon="lucide:key" className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[11px] font-medium text-amber-300">
                          Detected One-Time Verification Code (OTP)
                        </div>
                        <div className="font-mono text-xl font-black tracking-widest text-text-primary">
                          {selectedItem.otp_code}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyOtp(selectedItem.otp_code!)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-bg-canvas text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                    >
                      <Icon icon={copiedOtp ? 'lucide:check' : 'lucide:copy'} className="w-3.5 h-3.5" />
                      {copiedOtp ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>
                )}

                {/* Cloudinary Attachments Bar */}
                {selectedItem.attachments && selectedItem.attachments.length > 0 && (
                  <div className="pt-2 border-t border-border-default space-y-2">
                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <span className="flex items-center gap-1.5 font-medium text-text-primary">
                        <Icon icon="lucide:paperclip" className="w-3.5 h-3.5" />
                        Cloudinary CDN Attachments ({selectedItem.attachments.length})
                      </span>
                      <span className="text-[11px] text-brand-primary font-mono">
                        playground_api/emails/attachments/
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedItem.attachments.map((att, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-border-default bg-bg-surface hover:border-brand-primary transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-7 h-7 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 border border-brand-primary/20">
                              <Icon icon={att.type?.includes('pdf') ? 'lucide:file-text' : 'lucide:image'} className="w-4 h-4" />
                            </span>
                            <div className="min-w-0">
                              <div className="text-xs font-medium text-text-primary truncate" title={att.name}>
                                {att.name}
                              </div>
                              <div className="text-[10px] text-text-muted">
                                {typeof att.size === 'number' ? `${(att.size / 1024).toFixed(1)} KB` : (att.size || 'CDN Asset')}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => setPreviewAttachment(att)}
                              className="p-1.5 rounded-lg text-text-muted hover:text-brand-primary hover:bg-bg-elevated transition-colors cursor-pointer"
                              title="Preview attachment"
                            >
                              <Icon icon="lucide:eye" className="w-3.5 h-3.5" />
                            </button>
                            <a
                              href={att.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-text-muted hover:text-brand-primary hover:bg-bg-elevated transition-colors"
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
              <div className="px-5 py-2.5 border-b border-border-default bg-bg-terminal flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {selectedItem.type === 'email' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('html')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === 'html'
                          ? 'bg-bg-surface text-brand-primary shadow-xs border border-border-default font-bold'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      Rendered HTML
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveTab('text')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'text'
                        ? 'bg-bg-surface text-brand-primary shadow-xs border border-border-default font-bold'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    Plain Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('json')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'json'
                        ? 'bg-bg-surface text-brand-primary shadow-xs border border-border-default font-bold'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    Raw API JSON
                  </button>
                </div>

                {activeTab === 'html' && selectedItem.type === 'email' && (
                  <div className="flex items-center gap-1 bg-bg-surface border border-border-default p-0.5 rounded-lg text-xs">
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('desktop')}
                      className={`p-1 rounded cursor-pointer ${previewDevice === 'desktop' ? 'bg-bg-elevated text-brand-primary shadow-xs' : 'text-text-muted'}`}
                      title="Desktop Preview"
                    >
                      <Icon icon="lucide:monitor" className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('mobile')}
                      className={`p-1 rounded cursor-pointer ${previewDevice === 'mobile' ? 'bg-bg-elevated text-brand-primary shadow-xs' : 'text-text-muted'}`}
                      title="Mobile Preview"
                    >
                      <Icon icon="lucide:smartphone" className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* View Body Content */}
              <div className="flex-1 p-5 overflow-y-auto bg-bg-surface/50">
                {activeTab === 'html' && selectedItem.type === 'email' && (
                  <div className="flex justify-center h-full">
                    <div className={`transition-all duration-300 bg-white rounded-xl shadow-md border border-border-default overflow-hidden ${
                      previewDevice === 'mobile' ? 'w-93.75 h-137.5' : 'w-full h-full min-h-120'
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
                  <div className="p-4 rounded-xl bg-bg-terminal border border-border-default font-mono text-xs text-text-primary whitespace-pre-wrap leading-relaxed">
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
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-text-muted">
              <div className="w-16 h-16 rounded-3xl bg-bg-terminal border border-border-default flex items-center justify-center mb-4 text-text-muted">
                <Icon icon="lucide:mail-open" className="w-8 h-8" />
              </div>
              <h3 className="text-base font-semibold text-text-primary">No message selected</h3>
              <p className="text-xs text-text-secondary max-w-sm mt-1">
                Select a message from the list to inspect rendered HTML, verify security headers, extract OTP codes, or download Cloudinary attachments.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Compose & Template Studio Modal */}
      {showComposer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-2xl bg-bg-surface border border-border-default shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-text-primary">
            {/* Modal Header */}
            <div className="p-5 border-b border-border-default flex items-center justify-between bg-bg-terminal">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center">
                  <Icon icon="lucide:send" className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-primary">
                    Live Message Composer &amp; Template Studio
                  </h3>
                  <p className="text-xs text-text-muted">
                    Send simulated transactional emails and SMS directly into your sandbox inbox.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowComposer(false)}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSendMessage} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Type Switcher */}
              <div className="flex items-center gap-2 p-1 bg-bg-terminal border border-border-default rounded-xl w-fit text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setComposeType('email')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                    composeType === 'email'
                      ? 'bg-brand-primary text-white shadow-xs font-bold'
                      : 'text-text-muted hover:text-text-primary'
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
                      ? 'bg-emerald-600 text-white shadow-xs font-bold'
                      : 'text-text-muted hover:text-text-primary'
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
                    <label className="block text-xs font-semibold text-text-secondary mb-1.5">
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
                              ? 'border-brand-primary bg-brand-primary/10 ring-1 ring-brand-primary'
                              : 'border-border-default hover:border-border-subtle bg-bg-terminal'
                          }`}
                        >
                          <div className="text-xs font-semibold text-text-primary truncate">
                            {tmpl.name}
                          </div>
                          <div className="text-[10px] text-text-muted mt-0.5">
                            {tmpl.variables.length} variables
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recipient Input */}
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Recipient Email (to)
                    </label>
                    <input
                      type="email"
                      required
                      value={composeTo}
                      onChange={(e) => setComposeTo(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-bg-terminal border border-border-default text-text-primary focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  {/* Template Variables Form */}
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-2">
                      Template Variables Substitution
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-bg-terminal border border-border-default">
                      {Object.keys(templateVars).map(key => (
                        <div key={key}>
                          <label className="block text-[11px] font-mono text-text-muted mb-1">
                            {`{{${key}}}`}
                          </label>
                          <input
                            type="text"
                            value={templateVars[key] || ''}
                            onChange={(e) => setTemplateVars({ ...templateVars, [key]: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg text-xs bg-bg-surface border border-border-default text-text-primary focus:outline-none focus:border-brand-primary"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Live Rendered Preview */}
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                      Live HTML Output Preview
                    </label>
                    <div className="h-44 rounded-xl border border-border-default overflow-hidden bg-white">
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
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Recipient Phone Number (to)
                    </label>
                    <input
                      type="text"
                      required
                      value={composePhone}
                      onChange={(e) => setComposePhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-bg-terminal border border-border-default text-text-primary focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      SMS Body Text
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={composeBody}
                      onChange={(e) => setComposeBody(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-bg-terminal border border-border-default text-text-primary focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[11px] text-text-muted">
                      Tip: Include a 6-digit numeric code (e.g. 849201) to automatically test OTP extraction.
                    </span>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-border-default flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowComposer(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:bg-bg-elevated transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all active:scale-95 cursor-pointer ${
                    composeType === 'email'
                      ? 'bg-brand-primary hover:bg-brand-primary/90 shadow-brand-primary/20'
                      : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl bg-bg-surface border border-border-default shadow-2xl overflow-hidden p-6 space-y-4 text-text-primary">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:paperclip" className="w-4 h-4 text-brand-primary" />
                <span className="text-sm font-bold text-text-primary">
                  {previewAttachment.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewAttachment(null)}
                className="p-1 rounded-lg text-text-muted hover:text-text-primary cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center p-6 bg-bg-terminal border border-border-default rounded-xl min-h-55">
              <Icon icon="lucide:file-check" className="w-16 h-16 text-brand-primary mb-3" />
              <p className="text-xs font-medium text-text-secondary">
                Cloudinary CDN Hosted Asset
              </p>
              <code className="text-[11px] font-mono text-brand-primary mt-1 max-w-md truncate">
                {previewAttachment.url}
              </code>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <a
                href={previewAttachment.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-semibold shadow-md shadow-brand-primary/20"
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
