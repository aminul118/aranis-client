import generateSitemapEntries from '@/seo/generateSitemapEntries';
import { staticRoutes } from '@/seo/staticRoutes';
import { MetadataRoute } from 'next';

const sitemap = (): MetadataRoute.Sitemap => {
  return [...generateSitemapEntries(staticRoutes)];
};

export default sitemap;
