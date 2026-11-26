import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "standalone",
  // فحص TypeScript عند البناء مفروض — لا أخطاء مخفية في منصة صحية
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    const baseHeaders: Array<{ key: string; value: string }> = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=()" },
      { key: "X-DNS-Prefetch-Control", value: "off" },
      // CSP frame-ancestors تُضبط في middleware.ts وقت التشغيل (تتغير من .env)
      ...(isProd
        ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
        : []),
    ];
    return [
      { source: "/:path*", headers: baseHeaders },
      { source: "/api/reports/:path*/file", headers: [{ key: "Cache-Control", value: "no-store, private" }] },
    ];
  },
};

export default nextConfig;
