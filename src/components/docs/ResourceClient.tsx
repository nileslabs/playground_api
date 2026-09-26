'use client';

import React from 'react';
import { EndpointDef } from '@/config/api-catalog';
import { EndpointCard } from '@/components/docs/EndpointCard';
import { Icon } from '@iconify/react';

interface ResourceClientProps {
  resource: string;
  name: string;
  description: string;
  initialEndpoints: EndpointDef[];
}

export function ResourceClient({
  resource,
  name,
  description,
  initialEndpoints,
}: ResourceClientProps) {
  return (
    <div className="space-y-10 w-full text-slate-900">
      {/* 1. Resource Clean Header with Eyebrow Badge */}
      <div id="overview" className="space-y-3 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:database-bold" className="w-3.5 h-3.5" />
          <span>Core REST Resource</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          {name}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
          {description} All create, update, and delete mutations persist in your private visitor session overlay without database locks.
        </p>
      </div>

      {/* 2. Endpoints List Styled As Clean Interactive Cards */}
      <div className="space-y-8">
        {initialEndpoints.map((ep) => (
          <EndpointCard key={ep.id} endpoint={ep} />
        ))}
      </div>
    </div>
  );
}

export default ResourceClient;
