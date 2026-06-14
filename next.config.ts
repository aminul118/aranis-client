import envVars from '@/config/env.config';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compiler: {
    removeConsole:
      envVars.nodeEnv === 'production' ? { exclude: ['error'] } : false,
  },
  experimental: {
    authInterrupts: true,
    serverActions: {
      bodySizeLimit: '10mb',
    },
    staleTimes: {
      dynamic: 0,
      static: 30,
    },
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.thearanis.com',
      },
    ],
  },

  productionBrowserSourceMaps: true,

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
};

export default nextConfig;
