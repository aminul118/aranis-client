import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
    serverActions: {
      bodySizeLimit: '10mb', // increase limit (you can use 20mb if needed)
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // Enable source maps in production
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
