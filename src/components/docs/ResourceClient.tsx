'use client';

import React, { useState, useEffect } from 'react';
import { EndpointDef } from '@/config/api-catalog';
import { EndpointCard } from '@/components/docs/EndpointCard';
import { RelationalSubResourcesCard } from '@/components/docs/RelationalSubResourcesCard';
import { Icon } from '@iconify/react';
import config from '@/config/env';

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
  const [endpoints, setEndpoints] = useState<EndpointDef[]>(initialEndpoints);

  useEffect(() => {
    setEndpoints(initialEndpoints);

    // Fetch live sample data from backend to update GET response examples
    if (['users', 'posts', 'comments', 'todos'].includes(resource)) {
      fetch(`${config.apiUrl}/${resource}?limit=2`, { credentials: 'include' })
        .then((r) => (r.ok ? r.json() : null))
        .then((liveData) => {
          if (liveData) {
            setEndpoints((prev) =>
              prev.map((ep) => {
                if (ep.method === 'GET' && ep.path === `/${resource}`) {
                  return { ...ep, responseExample: liveData };
                }
                if (ep.method === 'GET' && ep.path === `/${resource}/:id` && liveData.data?.[0]) {
                  return { ...ep, responseExample: liveData.data[0] };
                }
                return ep;
              })
            );
          }
        })
        .catch(() => {});
    }
  }, [resource, initialEndpoints]);

  return (
    <div className="space-y-12 w-full max-w-none text-text-primary">
      {/* 1. Resource Clean Header with Category Tag and Session Isolation Note */}
      <div id="overview" className="space-y-3.5 pb-6 border-b border-border-default scroll-mt-24">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
            <Icon icon="ph:database-bold" className="w-3.5 h-3.5" />
            <span>REST API Collection</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-text-muted font-mono bg-bg-surface px-2 py-0.5 rounded border border-border-subtle">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Isolated Overlay State</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
          {name}
        </h1>

        <p className="text-base text-text-secondary leading-relaxed max-w-3xl">
          {description} All CRUD mutations are automatically captured in your private session overlay without requiring an account.
        </p>
      </div>

      {/* 2. Relational Sub-Resources Callout (Users -> Posts -> Comments) */}
      <RelationalSubResourcesCard resource={resource} />

      {/* 3. Endpoints List with ample spacing */}
      <div className="space-y-12">
        {endpoints.map((ep) => (
          <EndpointCard key={ep.id} endpoint={ep} />
        ))}
      </div>
    </div>
  );
}
