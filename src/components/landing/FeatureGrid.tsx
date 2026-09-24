'use client';

import React from 'react';
import { Icon } from '@iconify/react';

const features = [
  {
    icon: 'ph:shield-check-bold',
    title: 'Complete CRUD with State Persistence',
    description: 'Perform real POST, PUT, PATCH, and DELETE operations. Your mutations persist across page refreshes in your private session overlay.',
    borderColor: 'hover:border-emerald-500/50',
    iconColor: 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20',
  },
  {
    icon: 'ph:credit-card-bold',
    title: 'Stripe-Parity 3DS Payment Gateway',
    description: 'Simulate end-to-end checkout with deterministic test cards, 3D Secure verification modals, customer profiles, and refund ledgers.',
    borderColor: 'hover:border-violet-500/50',
    iconColor: 'text-violet-400 bg-violet-500/10 border border-violet-500/20',
  },
  {
    icon: 'ph:envelope-simple-open-bold',
    title: 'Virtual Email & SMS Web Inbox',
    description: 'Real-time SSE notification listener, automatic OTP regex extraction with 1-click copy, and responsive email iframe previews.',
    borderColor: 'hover:border-sky-500/50',
    iconColor: 'text-sky-400 bg-sky-500/10 border border-sky-500/20',
  },
  {
    icon: 'ph:cloud-arrow-up-bold',
    title: 'Multipart File Uploads & Cloud CDN',
    description: 'Test single and bulk multipart/form-data uploads with simulated byte progress bars and instant Cloudinary image delivery.',
    borderColor: 'hover:border-teal-500/50',
    iconColor: 'text-teal-400 bg-teal-500/10 border border-teal-500/20',
  },
  {
    icon: 'ph:lightning-bold',
    title: 'Network Chaos & Latency Simulation',
    description: 'Inject artificial latency (?_delay=1500) and stochastic error boundaries (504, 503, 500, 429) using X-Simulate-Chaos headers.',
    borderColor: 'hover:border-amber-500/50',
    iconColor: 'text-amber-400 bg-amber-500/10 border border-amber-500/20',
  },
  {
    icon: 'ph:lock-key-bold',
    title: 'JWT Auth & RBAC Permissions',
    description: 'Simulate complete authentication loops with /auth/login, decoded token inspection, and 4 personas (Admin, Editor, Viewer, Guest).',
    borderColor: 'hover:border-indigo-500/50',
    iconColor: 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20',
  },
  {
    icon: 'simple-icons:graphql',
    title: 'Unified REST & GraphQL Gateway',
    description: 'Query standard REST endpoints under /api/v1 or execute GraphQL queries and mutations against /api/v1/graphql with GraphiQL IDE.',
    borderColor: 'hover:border-pink-500/50',
    iconColor: 'text-pink-400 bg-pink-500/10 border border-pink-500/20',
  },
  {
    icon: 'ph:chats-teardrop-bold',
    title: 'Real-Time WebSockets & Socket.io',
    description: 'Dual-protocol WebSocket (/ws) and Socket.io gateway with live chat rooms, typing indicators, and automated Support Bot simulation.',
    borderColor: 'hover:border-cyan-500/50',
    iconColor: 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20',
  },
  {
    icon: 'ph:database-bold',
    title: 'Dynamic Custom Collections',
    description: 'Create arbitrary collections on the fly like /custom/products or /custom/orders without touching backend code or database schemas.',
    borderColor: 'hover:border-rose-500/50',
    iconColor: 'text-rose-400 bg-rose-500/10 border border-rose-500/20',
  },
  {
    icon: 'ph:download-simple-bold',
    title: 'Postman, Bruno & OpenAPI 3.0 Specs',
    description: 'Download ready-to-use workspace collections for Postman, Bruno, Insomnia, Swagger OpenAPI, and TypeScript .d.ts definitions.',
    borderColor: 'hover:border-brand-primary/50',
    iconColor: 'text-brand-primary bg-brand-primary/10 border border-brand-primary/20',
  },
];

export function FeatureGrid() {
  return (
    <section className="py-20 lg:py-28 bg-bg-surface/50 border-b border-border-default">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold font-mono tracking-wide">
            <Icon icon="ph:sparkle-bold" className="w-3.5 h-3.5" />
            <span>Developer Superpowers</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight">
            Engineered for Real-World Prototyping
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-2xl mx-auto">
            Everything frontend developers, QA suites, and AI model agents need to prototype, test, and ship applications without managing servers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => (
            <div
              key={feat.title}
              className={`p-7 rounded-3xl bg-bg-surface/70 border border-border-default ${feat.borderColor} transition-all duration-300 space-y-4 shadow-sm hover:shadow-xl hover:-translate-y-0.5 group`}
            >
              <div className={`w-12 h-12 rounded-2xl ${feat.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs`}>
                <Icon icon={feat.icon} className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary mt-1.5 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureGrid;
