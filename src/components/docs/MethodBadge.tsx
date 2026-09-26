import React from 'react';
import { cn } from '@/lib/utils';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'WS';

interface MethodBadgeProps {
  method: HttpMethod | string;
  className?: string;
}

export function MethodBadge({ method, className }: MethodBadgeProps) {
  const upper = String(method).toUpperCase();

  const methodStyles: Record<string, string> = {
    GET: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
    POST: 'bg-sky-500/15 text-sky-500 border-sky-500/30',
    PUT: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
    PATCH: 'bg-indigo-500/15 text-indigo-500 border-indigo-500/30',
    DELETE: 'bg-rose-500/15 text-rose-500 border-rose-500/30',
    WS: 'bg-purple-500/15 text-purple-500 border-purple-500/30',
  };

  return (
    <span
      className={cn(
        'px-2.5 py-0.5 rounded-md text-xs font-mono font-bold uppercase border shadow-2xs inline-flex items-center justify-center shrink-0',
        methodStyles[upper] || 'bg-bg-tertiary text-text-primary border-border-theme',
        className
      )}
    >
      {upper}
    </span>
  );
}

export default MethodBadge;
