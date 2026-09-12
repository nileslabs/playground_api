'use client';

import React, { useState, useEffect } from 'react';
import { EndpointDef } from '@/config/api-catalog';
import { EndpointCard } from '@/components/docs/EndpointCard';
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
    <div className="space-y-10 w-full max-w-none text-text-primary">
      {/* 1. Resource Clean Header */}
      <div id="overview" className="space-y-2 scroll-mt-20">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
          {name}
        </h1>
        <p className="text-base text-text-secondary leading-relaxed">
          {description} All mutations persist in your isolated session overlay.
        </p>
      </div>

      {/* 2. Endpoints List */}
      <div className="space-y-10">
        {endpoints.map((ep) => (
          <EndpointCard key={ep.id} endpoint={ep} />
        ))}
      </div>
    </div>
  );
}
