'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export function LiveDevToolsSimulator() {
  const [isActive, setIsActive] = useState<boolean>(true);
  const [delay, setDelay] = useState<number>(500);
  const [status, setStatus] = useState<number>(0);
  const [chaos, setChaos] = useState<number>(0);
  const [role, setRole] = useState<string>('editor');
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [copiedToken, setCopiedToken] = useState<boolean>(false);

  const getIdentityToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('pg_identity') || 'ident_demo_8829f0a';
    }
    return 'ident_demo_8829f0a';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getIdentityToken());
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const triggerReset = async () => {
    setIsResetting(true);
    setStatusMessage('Resetting session sandbox mutations...');
    try {
      const localToken = typeof window !== 'undefined' ? localStorage.getItem('pg_identity') : '';
      const headers: Record<string, string> = {};
      if (localToken) headers['X-Playground-Identity'] = localToken;

      const res = await fetch(`${config.apiUrl}/session/reset`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      });

      if (res.ok) {
        setStatusMessage('✓ Sandbox successfully reset to clean baseline state!');
      } else {
        setStatusMessage('Sandbox reset triggered.');
      }
    } catch {
      setStatusMessage('✓ Sandbox reset simulated successfully.');
    } finally {
      setIsResetting(false);
      setTimeout(() => setStatusMessage(''), 4000);
    }
  };

  const triggerExport = async () => {
    try {
      const localToken = typeof window !== 'undefined' ? localStorage.getItem('pg_identity') : '';
      const headers: Record<string, string> = {};
      if (localToken) headers['X-Playground-Identity'] = localToken;

      const res = await fetch(`${config.apiUrl}/session/export`, {
        headers,
        credentials: 'include',
      });
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `playground-sandbox-${Date.now()}.json`;
      a.click();
      setStatusMessage('✓ Sandbox snapshot JSON exported!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch {
      setStatusMessage('Export triggered.');
    }
  };

  return (
    <div className="not-prose my-8 rounded-2xl border border-border/80 bg-[#121316] text-[#f0f2f5] shadow-2xl overflow-hidden font-sans">
      {/* DevTools Window Frame Top Bar */}
      <div className="flex items-center justify-between border-b border-[#2b2d33] bg-[#1a1b1f] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono text-[#8e94a0] flex items-center gap-1.5">
            <Icon icon="logos:chrome" className="h-3.5 w-3.5" />
            Developer Tools — localhost:3000
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[11px] font-mono text-[#8e94a0]">F12 Active</span>
        </div>
      </div>

      {/* DevTools Tab Bar */}
      <div className="flex items-center border-b border-[#2b2d33] bg-[#16171b] px-3 overflow-x-auto text-xs">
        <button className="px-3 py-2 text-[#8e94a0] hover:text-[#f0f2f5] transition-colors">Elements</button>
        <button className="px-3 py-2 text-[#8e94a0] hover:text-[#f0f2f5] transition-colors">Console</button>
        <button className="px-3 py-2 text-[#8e94a0] hover:text-[#f0f2f5] transition-colors">Sources</button>
        <button className="px-3 py-2 text-[#8e94a0] hover:text-[#f0f2f5] transition-colors">Network</button>
        <button className="flex items-center gap-1.5 px-3 py-2 border-b-2 border-purple-500 bg-purple-500/10 text-purple-300 font-medium">
          <Icon icon="ph:lightning-bold" className="h-3.5 w-3.5 text-purple-400" />
          Playground API
        </button>
        <button className="px-3 py-2 text-[#8e94a0] hover:text-[#f0f2f5] transition-colors">Application</button>
      </div>

      {/* Extension Panel Content Mockup */}
      <div className="p-5 space-y-4">
        {/* Panel Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2b2d33] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400">
              <Icon icon="ph:lightning-fill" className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Playground API Companion</span>
                <span className="text-[10px] font-mono bg-white/5 px-1.5 py-0.5 rounded text-[#8e94a0]">v1.0.0</span>
              </div>
              <span className="text-[11px] text-[#8e94a0]">Simulating headers on outgoing localhost requests</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-white/5 text-[#8e94a0] border border-[#2b2d33]'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`} />
              {isActive ? 'Interception Active' : 'Bypass (Off)'}
            </button>
          </div>
        </div>

        {/* Section 1: Session Identity Card */}
        <div className="rounded-lg border border-[#2b2d33] bg-[#1a1b1f] p-3 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#8e94a0] font-semibold uppercase tracking-wider">
            <span>Active Sandbox Identity</span>
            <span className="text-emerald-400 font-mono">Connected</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={getIdentityToken()}
              className="flex-1 rounded border border-[#2b2d33] bg-black/40 px-2.5 py-1.5 text-xs font-mono text-purple-300 focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="rounded border border-[#2b2d33] bg-[#2a2c33] hover:bg-[#33363f] px-3 py-1.5 text-xs font-medium text-white transition-all flex items-center gap-1"
            >
              <Icon icon={copiedToken ? 'ph:check-bold' : 'ph:copy-bold'} className="h-3.5 w-3.5" />
              {copiedToken ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Section 2: Latency & Presets */}
        <div className="rounded-lg border border-[#2b2d33] bg-[#1a1b1f] p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#8e94a0] font-semibold uppercase tracking-wider">
              Network Latency Simulator (X-Simulate-Delay)
            </span>
            <span className="rounded bg-purple-500/15 text-purple-300 px-2 py-0.5 text-xs font-mono font-bold">
              {delay} ms
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="3000"
            step="100"
            value={delay}
            onChange={(e) => setDelay(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-[#2d3039] rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex flex-wrap gap-1.5">
            {[0, 500, 1500, 3000].map((d) => (
              <button
                key={d}
                onClick={() => setDelay(d)}
                className={`rounded px-2.5 py-1 text-xs font-mono transition-all border ${
                  delay === d
                    ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                    : 'border-[#2b2d33] bg-white/5 text-[#8e94a0] hover:text-white'
                }`}
              >
                {d === 0 ? '0ms (Off)' : `${d}ms`}
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Error Injection & Chaos Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border border-[#2b2d33] bg-[#1a1b1f] p-3 space-y-2">
            <span className="text-[11px] text-[#8e94a0] font-semibold uppercase tracking-wider block">
              Force HTTP Error (X-Simulate-Status)
            </span>
            <select
              value={status}
              onChange={(e) => setStatus(parseInt(e.target.value, 10))}
              className="w-full rounded border border-[#2b2d33] bg-black/40 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="0">Normal (None)</option>
              <option value="400">400 Bad Request</option>
              <option value="401">401 Unauthorized</option>
              <option value="403">403 Forbidden</option>
              <option value="404">404 Not Found</option>
              <option value="429">429 Too Many Requests</option>
              <option value="500">500 Server Error</option>
              <option value="504">504 Gateway Timeout</option>
            </select>
          </div>

          <div className="rounded-lg border border-[#2b2d33] bg-[#1a1b1f] p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#8e94a0] font-semibold uppercase tracking-wider">
                Chaos Mode (X-Simulate-Chaos)
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">
                {Math.round(chaos * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={chaos}
              onChange={(e) => setChaos(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#2d3039] rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>

        {/* Section 4: RBAC Role Selector */}
        <div className="rounded-lg border border-[#2b2d33] bg-[#1a1b1f] p-3 space-y-2">
          <span className="text-[11px] text-[#8e94a0] font-semibold uppercase tracking-wider block">
            Active RBAC Persona (X-Simulate-Role)
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            {['admin', 'editor', 'viewer', 'guest'].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`rounded px-2.5 py-1.5 text-xs font-medium capitalize transition-all border ${
                  role === r
                    ? 'border-purple-500 bg-purple-500/20 text-purple-300 shadow-sm'
                    : 'border-[#2b2d33] bg-white/5 text-[#8e94a0] hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Section 5: 1-Click Sandbox Actions */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={triggerReset}
            disabled={isResetting}
            className="rounded-lg border border-rose-500/30 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-semibold text-xs py-2.5 px-3 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Icon icon={isResetting ? 'ph:spinner-bold' : 'ph:arrow-counter-clockwise-bold'} className={`h-4 w-4 ${isResetting ? 'animate-spin' : ''}`} />
            Reset Sandbox Data
          </button>
          <button
            onClick={triggerExport}
            className="rounded-lg border border-[#2b2d33] bg-[#2a2c33] hover:bg-[#33363f] text-white font-semibold text-xs py-2.5 px-3 flex items-center justify-center gap-2 transition-all"
          >
            <Icon icon="ph:floppy-disk-bold" className="h-4 w-4" />
            Export Snapshot JSON
          </button>
        </div>

        {statusMessage && (
          <div className="text-center font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-2 rounded-lg transition-all animate-fade-in">
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
}
