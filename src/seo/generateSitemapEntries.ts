import metaConfig from '@/config/meta.config';
import { Routes } from '@/types';
import { MetadataRoute } from 'next';

const generateSitemapEntries = (routes: Routes[]): MetadataRoute.Sitemap => {
  return routes.map((route) => ({
    url: `${metaConfig.baseUrl}/${route?.url}`.replace(/\/+$/, ''),
    lastModified: new Date(),
    changeFrequency: route?.changeFrequency,
    priority: route?.priority,
  }));
};

export default generateSitemapEntries;
