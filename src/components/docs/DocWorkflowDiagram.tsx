'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';

export interface WorkflowStep {
  number: string | number;
  title: string;
  desc?: string;
  badge?: string;
}

export interface DocWorkflowDiagramProps {
  src: string;
  alt: string;
  title: string;
  subtitle?: string;
  badge?: string;
  steps?: WorkflowStep[];
  className?: string;
  priority?: boolean;
}

export function DocWorkflowDiagram({
  src,
  alt,
  title,
  subtitle,
  badge = 'Workflow Architecture',
  steps,
  className = '',
  priority = false,
}: DocWorkflowDiagramProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isZoomed) {
        setIsZoomed(false);
      }
    };

    if (isZoomed) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isZoomed]);

  return (
    <>
      <figure
        className={`my-8 overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-900 shadow-sm transition-all hover:border-slate-300 dark:border-slate-800 ${className}`}
      >
        {/* Header bar styled like modern developer studio */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="h-3.5 w-px bg-slate-800" />
            <span className="text-xs font-semibold text-slate-300 tracking-wide flex items-center gap-1.5">
              <Icon icon="ph:git-fork-bold" className="w-3.5 h-3.5 text-indigo-400" />
              {title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-300">
              <Icon icon="ph:sparkle-bold" className="w-3 h-3 text-indigo-400" />
              {badge}
            </span>
            <button
              type="button"
              onClick={() => setIsZoomed(true)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-700/80 bg-slate-800/80 px-2 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              title="Expand diagram"
            >
              <Icon icon="ph:arrows-out-simple-bold" className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Zoom</span>
            </button>
          </div>
        </div>

        {/* Diagram Image Container */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsZoomed(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsZoomed(true);
            }
          }}
          className="group relative cursor-zoom-in overflow-hidden bg-slate-950 p-2 sm:p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/50">
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority}
              className="object-contain transition-transform duration-300 ease-out group-hover:scale-[1.01]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1100px"
            />

            {/* Hover overlay hint */}
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/40 bg-slate-900/90 px-3.5 py-1.5 text-xs font-semibold text-indigo-200 shadow-lg">
                <Icon icon="ph:magnifying-glass-plus-bold" className="w-4 h-4 text-indigo-400" />
                Click to expand full architecture
              </span>
            </div>
          </div>
        </div>

        {/* Optional Caption & Subtitle */}
        {subtitle && (
          <div className="border-t border-slate-800/80 bg-slate-950/60 px-4 py-2.5 text-xs text-slate-400 flex items-center justify-between">
            <span>{subtitle}</span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">Interactive High-Resolution Flowchart</span>
          </div>
        )}

        {/* Optional Structured Workflow Steps */}
        {steps && steps.length > 0 && (
          <div className="border-t border-slate-800/80 bg-slate-950/90 p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-1.5 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/20 text-[10px] font-bold text-indigo-300 border border-indigo-500/30">
                      {step.number}
                    </span>
                    {step.badge && (
                      <span className="text-[10px] font-medium text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
                        {step.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200">{step.title}</h4>
                  {step.desc && <p className="text-[11px] text-slate-400 leading-relaxed">{step.desc}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </figure>

      {/* Fullscreen Lightbox Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 sm:p-6 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative flex flex-col max-h-[95vh] max-w-6xl w-full rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <Icon icon="ph:git-fork-bold" className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">{title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <Icon icon="ph:arrow-square-out-bold" className="w-3.5 h-3.5" />
                  <span>Open Raw</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsZoomed(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                  aria-label="Close zoomed view"
                >
                  <Icon icon="ph:x-bold" className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image Area */}
            <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center p-2 sm:p-4 overflow-auto">
              <div className="relative w-full h-full min-h-87.5">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            </div>

            {/* Modal Footer */}
            {subtitle && (
              <div className="border-t border-slate-800 bg-slate-950 px-5 py-3 text-xs text-slate-400 flex items-center justify-between">
                <span>{subtitle}</span>
                <span className="text-[11px] text-slate-500">Press ESC or click outside to exit</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
