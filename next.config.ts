import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
