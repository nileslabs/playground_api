import React from 'react';

export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-4 max-w-2xl">
        <div className="h-6 w-32 bg-indigo-100 rounded-full" />
        <div className="h-10 w-96 bg-slate-200 rounded-xl" />
        <div className="h-4 w-full bg-slate-200/70 rounded-md" />
      </div>

      {/* Grid of article cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
            <div className="h-4 w-20 bg-slate-200 rounded" />
            <div className="h-6 w-full bg-slate-200 rounded" />
            <div className="h-16 w-full bg-slate-100 rounded" />
            <div className="h-4 w-24 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
