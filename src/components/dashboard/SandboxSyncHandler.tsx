'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useLiveCounts } from '@/context/CountsContext';

export function SandboxSyncHandler() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { refreshCounts } = useLiveCounts();
  const [syncedId, setSyncedId] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const sandboxParam = searchParams.get('_sandbox');
    if (sandboxParam && typeof window !== 'undefined') {
      const trimmed = sandboxParam.trim();
      if (trimmed) {
        // 1. Store in localStorage
        localStorage.setItem('pg_identity', trimmed);

        // 2. Store in Cookie (30 days)
        document.cookie = `pg_identity=${trimmed}; path=/; max-age=2592000; SameSite=Lax`;

        // 3. Extract display ID
        const displayUuid = trimmed.split('.')[0];
        setSyncedId(displayUuid.length > 12 ? displayUuid.slice(0, 8) + '...' + displayUuid.slice(-4) : displayUuid);
        setShowBanner(true);

        // 4. Trigger live sync
        refreshCounts();
        window.dispatchEvent(new CustomEvent('playground:mutation'));

        // 5. Hide banner automatically after 6 seconds
        const timer = setTimeout(() => {
          setShowBanner(false);
        }, 6000);

        return () => clearTimeout(timer);
      }
    }
  }, [searchParams, refreshCounts]);

  if (!showBanner || !syncedId) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-bg-secondary/95 backdrop-blur-md border border-emerald-500/40 shadow-2xl text-text-primary text-xs sm:text-sm font-medium">
        <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0">
          <Icon icon="ph:check-circle-bold" className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <div className="font-bold text-text-primary flex items-center gap-1.5">
            <span>Synchronized to Shared Sandbox</span>
            <span className="px-1.5 py-0.2 rounded font-mono text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold">
              Live
            </span>
          </div>
          <p className="text-xs text-text-secondary font-mono">
            Identity: <strong className="text-emerald-400">{syncedId}</strong>
          </p>
        </div>
        <button
          onClick={() => setShowBanner(false)}
          className="p-1 rounded-lg text-text-muted hover:text-text-primary transition-colors ml-2 cursor-pointer"
          aria-label="Dismiss banner"
        >
          <Icon icon="ph:x-bold" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
