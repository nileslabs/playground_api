import React from 'react';
import type { Metadata } from 'next';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';
import { siteConfig } from '@/config/site';
import { LiveRbacStudio } from '@/components/docs/LiveRbacStudio';

export const metadata: Metadata = {
  title: 'Role-Based Access Control (RBAC) & Scope Permissions Simulation — Playground API',
  description:
    'Simulate Admin, Editor, Viewer, and Guest roles with realistic 403 Forbidden envelopes, granular OAuth scopes, developer headers, and Next.js / React route guards.',
  keywords: [
    'mock rbac api',
    'role based access control simulator',
    '403 forbidden testing',
    'mock jwt roles',
    'oauth scope simulation',
    'react route guard test api',
    'nextjs auth middleware testing',
    'playwright rbac e2e test'
  ],
  alternates: {
    canonical: `${siteConfig.url}/docs/rbac`,
  },
  openGraph: {
    title: 'RBAC & Scope Permissions Simulation — Playground API',
    description:
      'Test multi-tenant permissions, 403 Forbidden handling, test personas (Admin/Editor/Viewer/Guest), and fine-grained OAuth scopes without setting up backend identity servers.',
    url: `${siteConfig.url}/docs/rbac`,
    type: 'article',
  },
};

export default function RbacDocsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const headerSimulationCode = `// 1. Header-based simulation (instant, no login required)
fetch('${publicApiUrl}/posts/1', {
  method: 'DELETE',
  headers: {
    'X-Simulate-Role': 'viewer',        // Force viewer role
    'X-Simulate-Scopes': 'posts:read',   // Only read permission
    'X-Enforce-RBAC': 'true'
  }
})
.then(res => {
  console.log('Status:', res.status); // 403 Forbidden
  return res.json();
})
.then(error => {
  console.error('RBAC Error:', error);
  /* Output:
  {
    "error": "Forbidden: Insufficient role permissions",
    "code": "RBAC_ROLE_FORBIDDEN",
    "requiredRole": ["admin"],
    "currentRole": "viewer",
    "resource": "posts",
    "action": "delete"
  }
  */
});`;

  const querySimulationCode = `// 2. Query param simulation (ideal for image tags & simple GETs)
const res = await fetch('${publicApiUrl}/posts?_role=guest&_scopes=public:read');
console.log(res.status); // 200 OK for public feed

const createRes = await fetch('${publicApiUrl}/posts?_role=viewer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'New Article', body: '...' })
});
console.log(createRes.status); // 403 Forbidden!`;

  const sdkCode = `// 3. Official TypeScript SDK with RBAC & Scope Simulation
import { PlaygroundClient } from 'playground-api';

const client = new PlaygroundClient({
  identityToken: 'your_sandbox_token'
});

// A. Log in with a built-in preconfigured persona
await client.auth.login({
  username: 'editor',
  password: 'editor123'
});

// B. Or explicitly simulate a role / scopes on any request
client.setRole('viewer');
client.setScopes(['posts:read', 'users:read']);

try {
  // Attempting to delete a post as a viewer will throw a 403 PlaygroundError
  await client.posts.delete(1);
} catch (err: any) {
  console.log(err.status); // 403
  console.log(err.data.code); // 'RBAC_ROLE_FORBIDDEN'
  console.log(err.data.requiredRole); // ['admin']
}`;

  const reactRouteGuardCode = `// 4. React / Next.js Client Component Route Guard Pattern
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function AdminOnlyFeature() {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check permission against Playground API
    fetch('${publicApiUrl}/auth/me', {
      headers: {
        'X-Simulate-Role': 'viewer' // Simulating viewer for testing
      }
    })
    .then(res => res.json())
    .then(user => {
      if (user.role !== 'admin') {
        setHasAccess(false);
      } else {
        setHasAccess(true);
      }
    });
  }, []);

  if (hasAccess === null) return <div>Checking security clearance...</div>;
  if (hasAccess === false) return <div className="text-red-500">403: Admin clearance required.</div>;

  return <div>Welcome to the Admin Command Center!</div>;
}`;

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3.5 py-1 text-xs font-semibold text-purple-400">
          <Icon icon="ph:shield-check-bold" className="h-3.5 w-3.5" />
          Enterprise Simulation Feature
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
          Role-Based Access Control (RBAC) & Scope Permissions
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Simulate realistic multi-tenant authorization workflows, test custom OAuth scopes, inspect descriptive <code className="text-purple-300 font-mono">403 Forbidden</code> payloads, and validate frontend permission guards without running complicated identity servers.
        </p>
      </div>

      {/* Live Interactive Studio */}
      <section>
        <LiveRbacStudio />
      </section>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <Icon icon="ph:shield-chevron-fill" className="h-4 w-4" />
            Admin Persona
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Full root access. Can read, create, update, delete any entity, and reset isolated session sandboxes.
          </p>
          <div className="text-[11px] font-mono text-muted-foreground pt-1">
            <code>admin</code> / <code>admin123</code>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-2">
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
            <Icon icon="ph:pencil-simple-bold" className="h-4 w-4" />
            Editor Persona
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Can read, create, and modify posts, comments, and todos. Destructive deletes return 403 Forbidden.
          </p>
          <div className="text-[11px] font-mono text-muted-foreground pt-1">
            <code>editor</code> / <code>editor123</code>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <Icon icon="ph:eye-bold" className="h-4 w-4" />
            Viewer Persona
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Strictly read-only access. Any mutating request (POST, PUT, PATCH, DELETE) yields a 403 Forbidden.
          </p>
          <div className="text-[11px] font-mono text-muted-foreground pt-1">
            <code>viewer</code> / <code>viewer123</code>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
            <Icon icon="ph:user-minus-bold" className="h-4 w-4" />
            Guest Persona
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Unauthenticated or public-only caller. Protected endpoints (like <code>/auth/me</code>) return 401 Unauthorized.
          </p>
          <div className="text-[11px] font-mono text-muted-foreground pt-1">
            <code>guest</code> / <code>(no token)</code>
          </div>
        </div>
      </div>

      {/* Role Permission Matrix Table */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Icon icon="ph:table-bold" className="h-5 w-5 text-purple-400" />
          Default Permission Matrix
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border/60 bg-card/40">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-muted/40 text-muted-foreground font-semibold">
              <tr>
                <th className="py-3 px-4">Action / Resource</th>
                <th className="py-3 px-4 text-emerald-400">Admin</th>
                <th className="py-3 px-4 text-blue-400">Editor</th>
                <th className="py-3 px-4 text-amber-400">Viewer</th>
                <th className="py-3 px-4 text-rose-400">Guest</th>
                <th className="py-3 px-4">Required Scope</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono">
              <tr>
                <td className="py-3 px-4 font-semibold text-foreground">GET /posts, /users, etc.</td>
                <td className="py-3 px-4 text-emerald-400">✅ Allowed</td>
                <td className="py-3 px-4 text-emerald-400">✅ Allowed</td>
                <td className="py-3 px-4 text-emerald-400">✅ Allowed</td>
                <td className="py-3 px-4 text-emerald-400">✅ Allowed</td>
                <td className="py-3 px-4 text-muted-foreground">*:read, posts:read</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-foreground">POST /posts, /comments</td>
                <td className="py-3 px-4 text-emerald-400">✅ Allowed</td>
                <td className="py-3 px-4 text-emerald-400">✅ Allowed</td>
                <td className="py-3 px-4 text-rose-400">❌ 403 Forbidden</td>
                <td className="py-3 px-4 text-rose-400">❌ 403 Forbidden</td>
                <td className="py-3 px-4 text-muted-foreground">*:write, posts:write</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-foreground">PATCH /posts/:id</td>
                <td className="py-3 px-4 text-emerald-400">✅ Allowed</td>
                <td className="py-3 px-4 text-emerald-400">✅ Allowed</td>
                <td className="py-3 px-4 text-rose-400">❌ 403 Forbidden</td>
                <td className="py-3 px-4 text-rose-400">❌ 403 Forbidden</td>
                <td className="py-3 px-4 text-muted-foreground">*:write, posts:update</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-foreground">DELETE /posts/:id</td>
                <td className="py-3 px-4 text-emerald-400">✅ Allowed</td>
                <td className="py-3 px-4 text-rose-400">❌ 403 Forbidden</td>
                <td className="py-3 px-4 text-rose-400">❌ 403 Forbidden</td>
                <td className="py-3 px-4 text-rose-400">❌ 403 Forbidden</td>
                <td className="py-3 px-4 text-muted-foreground">posts:delete, admin</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-foreground">DELETE /session/reset</td>
                <td className="py-3 px-4 text-emerald-400">✅ Allowed</td>
                <td className="py-3 px-4 text-rose-400">❌ 403 Forbidden</td>
                <td className="py-3 px-4 text-rose-400">❌ 403 Forbidden</td>
                <td className="py-3 px-4 text-rose-400">❌ 403 Forbidden</td>
                <td className="py-3 px-4 text-muted-foreground">admin only</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-foreground">GET /auth/me</td>
                <td className="py-3 px-4 text-emerald-400">✅ Allowed</td>
                <td className="py-3 px-4 text-emerald-400">✅ Allowed</td>
                <td className="py-3 px-4 text-emerald-400">✅ Allowed</td>
                <td className="py-3 px-4 text-amber-400">❌ 401 Unauthorized</td>
                <td className="py-3 px-4 text-muted-foreground">authenticated</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Simulation Methods & Code Examples */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Icon icon="ph:code-bold" className="h-5 w-5 text-purple-400" />
          Integration Recipes & Usage
        </h2>

        {/* 1. Header simulation */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">1. Simulation Headers (Zero Login Required)</h3>
          <p className="text-xs text-muted-foreground">
            Pass <code className="text-purple-300 font-mono">X-Simulate-Role</code> and optional <code className="text-purple-300 font-mono">X-Simulate-Scopes</code> directly in your fetch or Axios requests to instantly simulate unauthorized behavior.
          </p>
          <CodeBlock code={headerSimulationCode} language="javascript" />
        </div>

        {/* 2. Query simulation */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">2. Query Parameter Overrides</h3>
          <p className="text-xs text-muted-foreground">
            Append <code className="text-purple-300 font-mono">?_role=viewer&_scopes=posts:read</code> to any URL for simple GET requests, browser testing, or image tags.
          </p>
          <CodeBlock code={querySimulationCode} language="javascript" />
        </div>

        {/* 3. TypeScript SDK */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">3. Official TypeScript SDK</h3>
          <p className="text-xs text-muted-foreground">
            Use <code className="text-purple-300 font-mono">client.setRole()</code> or login with built-in personas in test suites.
          </p>
          <CodeBlock code={sdkCode} language="typescript" />
        </div>

        {/* 4. React Route Guard */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">4. React & Next.js Route Guard Testing</h3>
          <p className="text-xs text-muted-foreground">
            Validate that your UI conditionally hides buttons (e.g. &quot;Delete Article&quot;) or renders access denied banners when the user lacks required capabilities.
          </p>
          <CodeBlock code={reactRouteGuardCode} language="tsx" />
        </div>
      </section>

      {/* Discovery Endpoints */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Icon icon="ph:compass-bold" className="h-5 w-5 text-purple-400" />
          Programmatic RBAC Discovery Endpoints
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-emerald-400">GET /auth/roles</span>
              <span className="text-[10px] rounded bg-purple-500/10 text-purple-400 px-2 py-0.5 border border-purple-500/20">Discovery</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Returns all supported roles, their descriptions, default scopes, and test credentials.
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-emerald-400">GET /auth/permissions</span>
              <span className="text-[10px] rounded bg-purple-500/10 text-purple-400 px-2 py-0.5 border border-purple-500/20">Matrix</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Returns the granular permission matrix, allowed HTTP actions per role, and wildcard matching patterns.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
