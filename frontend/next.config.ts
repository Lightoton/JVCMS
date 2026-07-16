import type { NextConfig } from "next";

const allowedDomainsStr = process.env.ALLOWED_DOMAINS || '';
const allowedDomains = allowedDomainsStr.split(',').map(d => d.trim()).filter(Boolean);
const allowedOrigins = ['localhost:3000', 'localhost:3001', '127.0.0.1:3000', ...allowedDomains];

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins,
    },
  },
  async headers() {
    return [
      {
        
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'none';",
          }
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8080',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
      }
    ],
  },
};

export default nextConfig;