import envVars from '@/config/env.config';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // --- Compiler Options ---
  compiler: {
    // Automatically remove console.log statements in production, but keep console.error
    removeConsole:
      envVars.nodeEnv === 'production' ? { exclude: ['error'] } : false,
  },

  // --- Experimental Features ---
  experimental: {
    authInterrupts: true,
    serverActions: {
      // Increase the maximum request body size limit for server actions (useful for large file uploads)
      bodySizeLimit: '10mb',
    },
    // Customize stale-time behavior for the client-side router cache
    staleTimes: {
      dynamic: 0,
      static: 30,
    },
  },

  // --- Image Optimization ---
  images: {
    // Prefer modern image formats if the browser supports them
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 100],
    // Allow external images to be optimized and served from our specific CDN
    remotePatterns: [
      {
        protocol: 'https',
        // cspell:disable-next-line
        hostname: 'cdn.thearanis.com',
      },
    ],
  },

  // Generate source maps in production to help with debugging (these are usually restricted publicly by the hosting provider)
  productionBrowserSourceMaps: true,

  // --- URL Routing Redirects ---
  redirects: async () => {
    return [
      {
        source: '/admin/settings/:path*',
        destination: '/settings/:path*',
        permanent: true,
      },
      {
        source: '/user/settings/:path*',
        destination: '/settings/:path*',
        permanent: true,
      },
    ];
  },

  // --- Custom HTTP Headers ---
  headers: async () => {
    return [
      {
        // Apply aggressive caching headers to static media assets for performance optimization
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|woff|woff2|ttf|otf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
