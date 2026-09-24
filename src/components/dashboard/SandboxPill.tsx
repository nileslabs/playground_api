'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

interface SandboxPillProps {
  onOpenShare?: () => void;
}

export function SandboxPill({ onOpenShare }: SandboxPillProps = {}) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [fullToken, setFullToken] = useState('');
  const [displayId, setDisplayId] = useState('Active');

  useEffect(() => {
    setMounted(true);
    const updateIdentity = (raw: string) => {
      setFullToken(raw);
      if (raw.length > 16) {
        setDisplayId(raw.slice(0, 8) + '...' + raw.slice(-4));
      } else {
        setDisplayId(raw);
      }
    };

    // 1. Check cookie
    const match = document.cookie.match(/pg_identity=([^;]+)/);
    if (match && match[1]) {
      updateIdentity(match[1]);
    } else {
      // 2. Fetch backend root/stats to initialize/retrieve identity cookie
      fetch(`${config.apiUrl}/session/stats`, { credentials: 'include', cache: 'no-cache' })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.identity?.id) {
            const reMatch = document.cookie.match(/pg_identity=([^;]+)/);
            if (reMatch && reMatch[1]) {
              updateIdentity(reMatch[1]);
            } else {
              updateIdentity(data.identity.id);
            }
          }
        })
        .catch(() => {
          setDisplayId('Active');
        });
    }
  }, []);

  const handleCopy = () => {
    if (!fullToken) return;
    navigator.clipboard.writeText(fullToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      suppressHydrationWarning
      className="flex items-center gap-2 bg-bg-surface-elevated/80 hover:bg-bg-surface-elevated border border-border-default hover:border-brand-primary/40 px-3 py-1.5 rounded-full text-xs font-mono text-text-secondary shadow-xs transition-all"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span className="font-sans font-medium text-text-muted hidden sm:inline text-[11px] uppercase tracking-wider">
        Sandbox
      </span>
      <span className="text-text-primary font-semibold truncate max-w-[120px]" title={fullToken || displayId} suppressHydrationWarning>
        {mounted ? displayId : 'Active'}
      </span>
      {fullToken && (
        <div className="flex items-center gap-1.5 ml-0.5 border-l border-border-subtle pl-1.5">
          <button
            onClick={handleCopy}
            title="Copy Session Identity Token"
            aria-label="Copy Session Identity Token"
            className="text-text-muted hover:text-brand-primary transition-colors cursor-pointer"
          >
            <Icon icon={copied ? 'ph:check-bold' : 'ph:copy-bold'} className={`w-3.5 h-3.5 ${copied ? 'text-emerald-400' : ''}`} />
          </button>
          {onOpenShare && (
            <button
              onClick={onOpenShare}
              title="Share Sandbox URL & QR Code"
              aria-label="Share Sandbox URL & QR Code"
              className="text-text-muted hover:text-brand-primary transition-colors cursor-pointer"
            >
              <Icon icon="ph:qr-code-bold" className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
