import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { siteConfig } from '@/config/site';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { DocWorkflowDiagram } from '@/components/docs/DocWorkflowDiagram';

export const metadata: Metadata = {
  title: 'Auth & Security Architecture — Playground API',
  description:
    'Comprehensive authentication and authorization architecture: JWT login, user registration, silent token refresh, RBAC matrix, password recovery, and cryptographic session security.',
  alternates: {
    canonical: `${siteConfig.url}/docs/auth`,
  },
  openGraph: {
    title: 'Auth & Security Architecture — Playground API',
    description:
      'JWT login, mock user registration, silent token refresh rotation, RBAC permission matrix, and cryptographic session security.',
    url: `${siteConfig.url}/docs/auth`,
  },
};

const AUTH_MODULES = [
  {
    id: 'jwt-flow',
    name: 'JWT Authentication Flow',
    icon: 'ph:key-bold',
    badge: 'HS256',
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    desc: 'Dual-token access & refresh authentication flow. Issue HMAC-SHA256 signed access tokens with custom TTLs, verify claims, and authenticate protected routes.',
    endpoints: ['POST /api/v1/auth/login', 'POST /api/v1/auth/register', 'GET /api/v1/auth/me'],
    href: '/docs/auth/jwt-flow',
  },
  {
    id: 'refresh-rotation',
    name: 'Refresh Token Rotation',
    icon: 'ph:arrows-clockwise-bold',
    badge: 'Mutex Lock',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    desc: 'Silent token refresh with automatic rotation. Guards against token reuse attacks and handles parallel 401 request storms with concurrency mutex locks.',
    endpoints: ['POST /api/v1/auth/refresh'],
    href: '/docs/auth/refresh-rotation',
  },
  {
    id: 'rbac-matrix',
    name: 'RBAC Permission Matrix',
    icon: 'ph:identification-badge-bold',
    badge: '4 Roles',
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    desc: 'Role-Based Access Control and granular scope matching. Test Admin, Editor, Viewer, and Guest personas with simulation headers and 403 Forbidden checks.',
    endpoints: ['GET /api/v1/auth/roles', 'GET /api/v1/auth/permissions'],
    href: '/docs/auth/rbac-matrix',
  },
  {
    id: 'expiry-simulation',
    name: 'Expiry Simulation',
    icon: 'ph:timer-bold',
    badge: 'TTL Control',
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    desc: 'Simulate instant or ultra-short token lifetimes (5s, 10s, 1m) without waiting. Test frontend auto-refresh interceptors and session timeout UX.',
    endpoints: ['Header: X-Simulate-JWT-Expiry'],
    href: '/docs/auth/expiry-simulation',
  },
  {
    id: 'clock-skew',
    name: 'Clock Skew Drift',
    icon: 'ph:clock-countdown-bold',
    badge: 'NTP Drift',
    color: 'text-rose-600 bg-rose-50 border-rose-200',
    desc: 'Model distributed clock drift (+120s, -60s) between client devices and authentication servers to validate token acceptance tolerance windows.',
    endpoints: ['Header: X-Simulate-Clock-Skew'],
    href: '/docs/auth/clock-skew',
  },
  {
    id: 'account-recovery',
    name: 'Password Recovery Loop',
    icon: 'ph:lock-key-open-bold',
    badge: 'OTP & Inbox',
    color: 'text-sky-600 bg-sky-50 border-sky-200',
    desc: 'Full password reset workflow. Trigger forgot-password requests, inspect single-use recovery tokens in your virtual email inbox, and submit new passwords.',
    endpoints: ['POST /api/v1/auth/forgot-password', 'POST /api/v1/auth/reset-password'],
    href: '/docs/auth/account-recovery',
  },
  {
    id: 'dual-sandboxing',
    name: 'Dual-Mode Sandboxing',
    icon: 'ph:intersect-bold',
    badge: 'Isolation',
    color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
    desc: 'Understand how Playground API combines visitor session sandboxes with user-level overlays for multi-tenant simulation without seed cross-talk.',
    endpoints: ['Cookie: pg_identity', 'Header: Authorization'],
    href: '/docs/auth/dual-sandboxing',
  },
];

const AUTH_ENDPOINTS = [
  {
    method: 'POST',
    path: '/api/v1/auth/login',
    title: 'Authenticate & Receive Tokens',
    desc: 'Authenticate with username/email & password. Returns 15-minute access token and 7-day refresh token. Supports token_ttl and simulation headers.',
    auth: 'None (Public)',
  },
  {
    method: 'POST',
    path: '/api/v1/auth/register',
    title: 'Register Custom Mock User',
    desc: 'Create a new user record in your session overlay and receive immediate signed JWT auth tokens for testing signup workflows.',
    auth: 'None (Public)',
  },
  {
    method: 'POST',
    path: '/api/v1/auth/refresh',
    title: 'Rotate Refresh & Access Tokens',
    desc: 'Exchange a valid refresh token for a fresh access token. Employs token family rotation; consumed tokens trigger REFRESH_TOKEN_REUSED (401).',
    auth: 'Refresh Token',
  },
  {
    method: 'GET',
    path: '/api/v1/auth/me',
    title: 'Get Current User Profile',
    desc: 'Verifies the Bearer JWT access token and returns the current authenticated user profile, assigned role, and granular scopes.',
    auth: 'Bearer <token>',
  },
  {
    method: 'PATCH',
    path: '/api/v1/auth/me',
    title: 'Update Current User Profile',
    desc: 'Applies partial profile updates (name, email, bio, website) for the authenticated user. Diffs persist within your session overlay.',
    auth: 'Bearer <token>',
  },
  {
    method: 'GET',
    path: '/api/v1/auth/roles',
    title: 'Get Supported Roles & Personas',
    desc: 'Discovery endpoint returning all built-in RBAC roles (admin, editor, viewer, guest), persona credentials, and default capability scopes.',
    auth: 'None (Public)',
  },
  {
    method: 'GET',
    path: '/api/v1/auth/permissions',
    title: 'Get Granular Permission Matrix',
    desc: 'Returns the system permission matrix, allowed HTTP verbs per role, and wildcard matching syntax (*:read, posts:*).',
    auth: 'None (Public)',
  },
  {
    method: 'POST',
    path: '/api/v1/auth/forgot-password',
    title: 'Request Password Reset Link',
    desc: 'Dispatches a password recovery token and branded HTML reset link to the simulated virtual mailbox (/inbox/messages).',
    auth: 'None (Public)',
  },
  {
    method: 'POST',
    path: '/api/v1/auth/reset-password',
    title: 'Confirm New Password',
    desc: 'Submits a recovery token with the new password. Invalidates previous tokens and confirms updated password credentials.',
    auth: 'Reset Token',
  },
];

const PERSONAS = [
  { role: 'admin', username: 'admin', email: 'admin@example.com', password: 'Password@123', scopes: ['*'], desc: 'Unrestricted full access to all resources and destructive operations' },
  { role: 'editor', username: 'editor', email: 'editor@example.com', password: 'Password@123', scopes: ['*:read', '*:write'], desc: 'Can read, create, and update records; 403 Forbidden on delete and reset' },
  { role: 'viewer', username: 'viewer', email: 'viewer@example.com', password: 'Password@123', scopes: ['*:read'], desc: 'Strict read-only permissions; 403 Forbidden on any POST, PUT, PATCH, DELETE' },
  { role: 'guest', username: 'anonymous', email: 'guest@example.com', password: '-', scopes: ['public:read'], desc: 'Unauthenticated public visitor; 401 Unauthorized on protected resources' },
];

export default function AuthOverviewPage() {
  return (
    <div className="space-y-12 w-full text-slate-900 pb-16">
      {/* 1. Hero Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:shield-check-bold" className="w-3.5 h-3.5" />
          <span>Auth &amp; Security Architecture</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Authentication &amp; Cryptographic Security
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Production-grade mock authentication loops with HMAC-SHA256 signed JWTs, copy-on-write profile updates, atomic token rotation with reuse detection, and 4-tier RBAC permission enforcement.
        </p>

        {/* Global Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Signature Algorithm</span>
            <p className="text-2xl font-extrabold text-slate-900 font-mono">HS256</p>
            <span className="text-[11px] text-emerald-600 font-semibold">HMAC-SHA256 tamper-evident</span>
          </div>
          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Token Lifetimes</span>
            <p className="text-2xl font-extrabold text-slate-900 font-mono">15m / 7d</p>
            <span className="text-[11px] text-indigo-600 font-semibold">Access vs Refresh TTL</span>
          </div>
          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">RBAC Tiers</span>
            <p className="text-2xl font-extrabold text-slate-900 font-mono">4 Roles</p>
            <span className="text-[11px] text-purple-600 font-semibold">Admin, Editor, Viewer, Guest</span>
          </div>
          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Rotation Security</span>
            <p className="text-2xl font-extrabold text-slate-900 font-mono">Atomic</p>
            <span className="text-[11px] text-amber-600 font-semibold">Automatic reuse invalidation</span>
          </div>
        </div>

        {/* Workflow Diagram */}
        <DocWorkflowDiagram
          src="/images/docs/workflows/auth-jwt-refresh-rotation.jpg"
          alt="Playground API JWT Authentication and Refresh Token Rotation Workflow Diagram"
          title="JWT Authentication & Refresh Token Rotation Loop"
          subtitle="Dual-token lifecycle: Access token expiry triggers client mutex locks and atomic refresh token family rotation."
          badge="Security Lifecycle"
          steps={[
            {
              number: 1,
              title: 'Login & Token Issuance',
              desc: 'Submitting credentials issues a 15-minute access token and a 7-day refresh token pair.',
              badge: 'Dual Token',
            },
            {
              number: 2,
              title: 'Protected API Access',
              desc: 'Client sends Bearer token. When expired, API responds with 401 Unauthorized.',
              badge: 'Bearer Auth',
            },
            {
              number: 3,
              title: 'Mutex Lock & Token Rotation',
              desc: 'Client queues parallel requests, calls /auth/refresh, rotates token family, and retries.',
              badge: 'Mutex Rotation',
            },
          ]}
        />
      </div>

      {/* 2. Specialized Guides & Modules */}
      <div id="modules" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Authentication Modules &amp; Test Guides
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Select a specialized security guide below to explore interactive testing playgrounds, token decoders, and code interceptors:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AUTH_MODULES.map((m) => (
            <Link
              key={m.id}
              href={m.href}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-xs transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${m.color} shadow-2xs`}>
                    <Icon icon={m.icon} className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {m.badge}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {m.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {m.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{m.endpoints[0]}</span>
                <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Pre-configured Personas & Test Credentials */}
      <div id="personas" className="space-y-4 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Built-in Personas &amp; Test Credentials
          </h2>
          <p className="text-sm text-slate-600">
            Use these built-in test personas to immediately test authentication, token issuance, and RBAC authorization without registering custom accounts:
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <th className="py-3 px-4">Role Tier</th>
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Password</th>
                  <th className="py-3 px-4">Default Scopes</th>
                  <th className="py-3 px-4">Capabilities</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PERSONAS.map((p) => (
                  <tr key={p.role} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                        p.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        p.role === 'editor' ? 'bg-blue-100 text-blue-800' :
                        p.role === 'viewer' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {p.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{p.username}</td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-xs">{p.email}</td>
                    <td className="py-3 px-4 text-indigo-600 font-mono text-xs font-semibold">{p.password}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-xs">{p.scopes.join(', ')}</td>
                    <td className="py-3 px-4 text-slate-600 text-xs">{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Complete Endpoints Reference Table */}
      <div id="endpoints-reference" className="space-y-4 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            REST Authentication API Reference
          </h2>
          <p className="text-sm text-slate-600">
            Complete specification of all available authentication, profile management, and RBAC discovery routes:
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <th className="py-3 px-4">Method &amp; Path</th>
                  <th className="py-3 px-4">Required Auth</th>
                  <th className="py-3 px-4">Operation</th>
                  <th className="py-3 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {AUTH_ENDPOINTS.map((ep) => (
                  <tr key={`${ep.method}-${ep.path}`} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-mono text-xs whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase mr-2 text-[10px] ${
                        ep.method === 'POST' ? 'bg-emerald-100 text-emerald-800' :
                        ep.method === 'PATCH' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {ep.method}
                      </span>
                      <span className="font-semibold text-slate-900">{ep.path}</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-600 whitespace-nowrap">
                      {ep.auth}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 text-xs whitespace-nowrap">
                      {ep.title}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 leading-relaxed">
                      {ep.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. Live Interactive Consoles for Key Endpoints */}
      <div id="interactive-consoles" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Interactive Auth Request Runner
          </h2>
          <p className="text-sm text-slate-600">
            Execute live requests directly against the authentication endpoints:
          </p>
        </div>

        {/* Register Console */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase bg-emerald-100 text-emerald-800">
                POST
              </span>
              <h3 className="font-bold text-base text-slate-900">
                Register New Mock User (/auth/register)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Registers a brand-new user in your session sandbox overlay and returns immediate access &amp; refresh JWTs:
            </p>
          </div>
          <InteractiveConsole
            method="POST"
            path="/auth/register"
            title="Register Mock User"
            initialBody={JSON.stringify(
              {
                name: 'Alice Smith',
                username: 'alice',
                email: 'alice@example.com',
                password: 'Password@123',
                token_ttl: 900
              },
              null,
              2
            )}
          />
        </div>

        {/* Update Profile (PATCH /auth/me) Console */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase bg-amber-100 text-amber-800">
                PATCH
              </span>
              <h3 className="font-bold text-base text-slate-900">
                Update Authenticated Profile (/auth/me)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Apply partial attribute updates for the authenticated user. Pass your issued token in the Authorization header or rely on your active session cookie:
            </p>
          </div>
          <InteractiveConsole
            method="PATCH"
            path="/auth/me"
            title="Update Profile Attributes"
            initialBody={JSON.stringify(
              {
                name: 'System Administrator (Updated)',
                email: 'admin.new@example.com',
                website: 'https://admin-portfolio.dev'
              },
              null,
              2
            )}
          />
        </div>

        {/* Discovery Consoles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase bg-blue-100 text-blue-800">
                  GET
                </span>
                <h3 className="font-bold text-sm text-slate-900">
                  Roles Discovery (/auth/roles)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Inspect built-in personas, descriptions, and default scope arrays:
              </p>
            </div>
            <InteractiveConsole
              method="GET"
              path="/auth/roles"
              title="Query Supported Roles"
            />
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase bg-blue-100 text-blue-800">
                  GET
                </span>
                <h3 className="font-bold text-sm text-slate-900">
                  Permission Matrix (/auth/permissions)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Retrieve the full granular action matrix and wildcard scope definitions:
              </p>
            </div>
            <InteractiveConsole
              method="GET"
              path="/auth/permissions"
              title="Query Permission Matrix"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
