'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export default function GraphqlSubscriptionsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const clientRecipe = `import { createClient } from 'graphql-ws';

const client = createClient({
  url: 'ws://localhost:5000/graphql',
  connectionParams: {
    // Session identity credentials
  },
});

// Subscribe to new posts in real-time
client.subscribe(
  {
    query: \`subscription OnPostCreated {
      postCreated {
        id
        title
        user {
          name
        }
      }
    }\`,
  },
  {
    next: (data) => console.log('Live post created:', data),
    error: (err) => console.error(err),
    complete: () => console.log('Subscription completed'),
  }
);`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:waveform-bold" className="w-3.5 h-3.5" />
          <span>GraphQL Gateway</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Real-Time GraphQL Subscriptions
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Listen to live resource mutation events over WebSockets using the industry-standard <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">graphql-ws</code> protocol.
        </p>
      </div>

      {/* 2. Client Setup Recipe */}
      <div id="setup-recipe" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Client Integration (graphql-ws)
        </h2>
        <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 shadow-inner">
          <pre className="font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto leading-relaxed">
            {clientRecipe}
          </pre>
        </div>
      </div>

      {/* 3. Available Subscription Channels */}
      <div id="channels" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Supported Subscription Topics
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-4">Subscription</th>
                <th className="py-3 px-4">Trigger Event</th>
                <th className="py-3 px-4">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">postCreated</td>
                <td className="py-3 px-4">Fires whenever a post is created via REST or GraphQL.</td>
                <td className="py-3 px-4 font-mono text-xs">Post</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">commentAdded</td>
                <td className="py-3 px-4">Fires whenever a new comment is posted on any thread.</td>
                <td className="py-3 px-4 font-mono text-xs">Comment</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">notificationReceived</td>
                <td className="py-3 px-4">Fires on order confirmation, payment receipt, or OTP SMS.</td>
                <td className="py-3 px-4 font-mono text-xs">Notification</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
