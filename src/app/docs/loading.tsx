import React from 'react';

export default function DocsLoading() {
  return (
    <div className="w-full max-w-4xl space-y-8 animate-pulse pt-2">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-16 bg-slate-200/80 rounded-md" />
        <div className="h-3 w-3 bg-slate-200/60 rounded-full" />
        <div className="h-4 w-28 bg-slate-200/80 rounded-md" />
      </div>

      {/* Title & Badge skeleton */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-64 bg-slate-200 rounded-xl" />
          <div className="h-6 w-20 bg-indigo-100/70 rounded-full" />
        </div>
        <div className="h-4 w-full max-w-xl bg-slate-200/70 rounded-md" />
        <div className="h-4 w-3/4 max-w-lg bg-slate-200/60 rounded-md" />
      </div>

      {/* Code / Interactive box skeleton */}
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-36 bg-slate-200 rounded-md" />
          <div className="h-7 w-20 bg-slate-200 rounded-lg" />
        </div>
        <div className="h-28 bg-slate-200/70 rounded-xl" />
      </div>

      {/* Content paragraphs skeleton */}
      <div className="space-y-3 pt-4">
        <div className="h-4 w-full bg-slate-200/70 rounded-md" />
        <div className="h-4 w-5/6 bg-slate-200/60 rounded-md" />
        <div className="h-4 w-4/6 bg-slate-200/50 rounded-md" />
      </div>
    </div>
  );
}
