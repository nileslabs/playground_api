'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import QRCode from 'qrcode';
import config from '@/config/env';

interface ShareSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionToken?: string;
  identityUuid?: string;
}

const TARGET_ROUTES = [
  { label: 'Documentation Hub', path: '/docs' },
  { label: 'Posts Collection', path: '/docs/posts' },
  { label: 'Comments Collection', path: '/docs/comments' },
  { label: 'Users Collection', path: '/docs/users' },
  { label: 'API Studio', path: '/docs/studio' },
  { label: 'Session Quotas & Stats', path: '/docs/stats' },
];

export function ShareSandboxModal({ isOpen, onClose, sessionToken, identityUuid }: ShareSandboxModalProps) {
  const [selectedRoute, setSelectedRoute] = useState('/docs');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [activeUuid, setActiveUuid] = useState(identityUuid || '');
  const [activeToken, setActiveToken] = useState(sessionToken || '');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!activeUuid) {
      const localToken = typeof window !== 'undefined' ? localStorage.getItem('pg_identity') : '';
      const match = typeof document !== 'undefined' ? document.cookie.match(/pg_identity=([^;]+)/) : null;
      const token = localToken || (match ? match[1] : '');
      if (token) {
        setActiveToken(token);
        setActiveUuid(token.split('.')[0]);
      } else {
        fetch(`${config.apiUrl}/session/stats`, { credentials: 'include', cache: 'no-cache' })
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data?.identity?.id) {
              setActiveUuid(data.identity.id);
              setActiveToken(data.identity.id);
            }
          })
          .catch(() => {});
      }
    }
  }, [isOpen, activeUuid]);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : config.siteUrl;
  const shareTargetParam = activeToken || activeUuid || 'demo-session';
  const shareUrl = `${baseUrl}${selectedRoute}?_sandbox=${shareTargetParam}`;

  useEffect(() => {
    if (isOpen && shareUrl) {
      QRCode.toDataURL(shareUrl, {
        width: 260,
        margin: 1.5,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('[QR] Failed to generate QR Code:', err));
    }
  }, [isOpen, shareUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(activeToken || activeUuid);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const curlSnippet = `curl -X GET "${config.apiUrl}/posts?_sandbox=${activeUuid || '<your_uuid>'}"`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlSnippet);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-bg-secondary border border-border-theme rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-6 relative max-h-[92vh] overflow-y-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-border-theme pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-accent-light text-accent-primary rounded-xl">
              <Icon icon="ph:qr-code-bold" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-text-primary">Share Sandbox & Mobile QR Sync</h3>
              <p className="text-xs sm:text-sm text-text-secondary">Instant 1-Click State Synchronization Across Devices</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-text-muted hover:text-text-primary rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <Icon icon="ph:x-bold" className="w-5 h-5" />
          </button>
        </div>

        {/* Target Destination Switcher */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">
            Target Page for Shared Link:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TARGET_ROUTES.map((route) => {
              const isSelected = selectedRoute === route.path;
              return (
                <button
                  key={route.path}
                  onClick={() => setSelectedRoute(route.path)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all border cursor-pointer truncate ${
                    isSelected
                      ? 'bg-accent-light text-accent-primary border-accent-primary/40 shadow-xs'
                      : 'bg-bg-tertiary text-text-secondary border-border-theme hover:text-text-primary hover:border-border-hover'
                  }`}
                >
                  {route.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* QR Code & Scan Panel */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-code-bg border border-border-theme">
          <div className="shrink-0 p-3 bg-white rounded-2xl shadow-lg border border-slate-200">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Shareable Sandbox QR Code"
                className="w-44 h-44 rounded-lg object-contain"
              />
            ) : (
              <div className="w-44 h-44 flex items-center justify-center text-text-muted font-mono text-xs">
                Generating QR...
              </div>
            )}
          </div>

          <div className="space-y-3 w-full text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              <Icon icon="ph:device-mobile-camera-bold" className="w-4 h-4" />
              <span>Instant Mobile Sync Active</span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-text-primary">
              Scan with your iPhone or Android camera
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Opens this sandbox on your mobile device. Any record created, updated, or deleted on your desktop will immediately be visible on mobile!
            </p>
            <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-xl bg-accent-primary hover:bg-accent-hover text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Icon icon={copiedLink ? 'ph:check-bold' : 'ph:link-bold'} className="w-4 h-4" />
                <span>{copiedLink ? 'Link Copied!' : 'Copy Shareable Link'}</span>
              </button>
              <button
                onClick={handleCopyToken}
                className="px-3 py-2 rounded-xl bg-bg-tertiary hover:bg-border-theme text-text-primary text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Icon icon={copiedToken ? 'ph:check-bold' : 'ph:copy-bold'} className="w-4 h-4 text-accent-primary" />
                <span>{copiedToken ? 'Token Copied' : 'Copy Identity'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Shareable Link Input Display */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">
            Full Shareable Sandbox URL:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="w-full px-3.5 py-2.5 rounded-xl bg-code-bg border border-border-theme text-xs sm:text-sm font-mono text-emerald-400 focus:outline-none focus:border-accent-primary select-all"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-xl bg-bg-tertiary hover:bg-border-theme text-text-primary text-xs sm:text-sm font-semibold transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Icon icon={copiedLink ? 'ph:check-bold' : 'ph:copy-bold'} className="w-4 h-4" />
              <span>{copiedLink ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Quick cURL Integration Code */}
        <div className="p-4 rounded-xl bg-bg-tertiary border border-border-theme space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-secondary flex items-center gap-1.5">
              <Icon icon="ph:terminal-window-bold" className="w-4 h-4 text-accent-primary" />
              Direct API Query via ?_sandbox Parameter
            </span>
            <button
              onClick={handleCopyCurl}
              className="text-xs text-text-muted hover:text-text-primary flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Icon icon={copiedCurl ? 'ph:check-bold' : 'ph:copy-bold'} className="w-3.5 h-3.5" />
              <span>{copiedCurl ? 'Copied' : 'Copy cURL'}</span>
            </button>
          </div>
          <div className="p-2.5 rounded-lg bg-code-bg font-mono text-xs text-emerald-400 overflow-x-auto select-all">
            {curlSnippet}
          </div>
        </div>

        {/* Footer Info */}
        <div className="pt-2 border-t border-border-theme flex items-center justify-between text-xs text-text-muted">
          <span>Sandbox state persists for 10 days of inactivity.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-bg-tertiary hover:bg-border-theme text-text-primary font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
