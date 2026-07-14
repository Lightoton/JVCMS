import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  experimental: {
    serverActions: {
      allowedOrigins: [
        'cms-api-fitness.viktor-dev.de',
        'cms-api-fitness.viktor-dev.de.',
        'localhost:3001',
        'localhost:3000'
      ]
    }
  }
};

export default nextConfig;