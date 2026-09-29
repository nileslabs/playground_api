const backendUrl =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:3001";

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {},
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https: http: ws: wss:; frame-ancestors 'none';",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/socket.io/:path*",
        destination: `${backendUrl}/socket.io/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      // Legacy main branch routes
      { source: '/docs/studio', destination: '/docs/toolkit/studio', permanent: true },
      { source: '/docs/posts', destination: '/docs/resources/posts', permanent: true },
      { source: '/docs/users', destination: '/docs/resources/users', permanent: true },
      { source: '/docs/comments', destination: '/docs/resources/comments', permanent: true },
      { source: '/docs/todos', destination: '/docs/resources/todos', permanent: true },
      { source: '/docs/auth', destination: '/docs/auth/jwt-flow', permanent: true },
      { source: '/docs/payments', destination: '/docs/payments/hosted-checkout', permanent: true },
      { source: '/docs/inbox', destination: '/docs/inbox/email-mailbox', permanent: true },
      { source: '/docs/chat', destination: '/docs/realtime/native-ws', permanent: true },
      { source: '/docs/simulation', destination: '/docs/chaos/latency', permanent: true },
      { source: '/docs/sandbox', destination: '/docs/sandbox/dashboard', permanent: true },
      { source: '/docs/stats', destination: '/docs/sandbox/dashboard', permanent: true },
      { source: '/docs/export-import', destination: '/docs/sandbox/snapshots', permanent: true },
      { source: '/docs/sandbox-sync', destination: '/docs/sandbox/mobile-qr-sync', permanent: true },
      { source: '/docs/rbac', destination: '/docs/auth/rbac-matrix', permanent: true },
      { source: '/docs/sdk', destination: '/docs/toolkit/typescript-sdk', permanent: true },
      { source: '/docs/devtools', destination: '/docs/toolkit/devtools-extension', permanent: true },
      { source: '/docs/filtering', destination: '/docs/query/filtering', permanent: true },
      { source: '/docs/getting-started/quickstart', destination: '/docs/quickstart', permanent: true },

      // Category parent routes without index
      { source: '/docs/query', destination: '/docs/query/filtering', permanent: true },
      { source: '/docs/realtime', destination: '/docs/realtime/native-ws', permanent: true },
      { source: '/docs/webhooks', destination: '/docs/webhooks/subscriptions', permanent: true },
      { source: '/docs/chaos', destination: '/docs/chaos/latency', permanent: true },
      { source: '/docs/media', destination: '/docs/media/svg-avatars', permanent: true },
      { source: '/docs/graphql', destination: '/docs/graphql/ide', permanent: true },
      { source: '/docs/collections', destination: '/docs/collections/openapi', permanent: true },
      { source: '/docs/toolkit', destination: '/docs/toolkit/studio', permanent: true },
      { source: '/docs/resources', destination: '/docs/resources/users', permanent: true },
    ];
  },
};

export default nextConfig;
