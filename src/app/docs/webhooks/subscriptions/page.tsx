'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function WebhookSubscriptionsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:link-bold" className="w-3.5 h-3.5" />
          <span>Outgoing Webhooks</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Webhook Subscriptions
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Register HTTP callback URLs to receive real-time webhook dispatches whenever resources change in your session (e.g. <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">posts.created</code>, <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">payment.succeeded</code>).
        </p>
      </div>

      {/* 2. Step 1: Register Webhook */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Step 1: Register Target Webhook URL</h3>
          <p className="text-xs text-slate-500">
            Submit a callback URL and the event topics you want to subscribe to:
          </p>
        </div>

        <InteractiveConsole
          method="POST"
          path="/webhooks/subscriptions"
          title="Register Webhook Endpoint"
          initialBody={JSON.stringify(
            {
              url: 'https://webhook.site/sample-uuid',
              events: ['posts.created', 'payment.succeeded'],
              description: 'Production Order Sync',
            },
            null,
            2
          )}
        />
      </div>

      {/* 3. Step 2: List Subscriptions */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Step 2: List Registered Subscriptions</h3>
          <p className="text-xs text-slate-500">
            Fetch all webhook destinations registered in your visitor session:
          </p>
        </div>

        <InteractiveConsole
          method="GET"
          path="/webhooks/subscriptions"
          title="List Subscriptions"
        />
      </div>
    </div>
  );
}
