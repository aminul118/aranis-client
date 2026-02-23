import metaConfig from '@/config/meta.config';
import type { MetadataRoute } from 'next';

const robots = (): MetadataRoute.Robots => {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: ['/user', '/admin'],
      },
      {
        userAgent: ['Applebot', 'Bingbot'],
        allow: ['/'],
        disallow: ['/admin'],
      },
    ],
    sitemap: [`${metaConfig.baseUrl}/sitemap.xml`],
  };
};

export default robots;
