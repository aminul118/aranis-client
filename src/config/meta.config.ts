import { MetaConfig } from '@/types';

const metaConfig: MetaConfig = {
  baseUrl: 'https://lumiere-fashion.vercel.app', // Update with actual domain if known
  baseImage: '/og-image.png',
  siteName: 'Lumiere Fashion',
  category: 'Premium Contemporary Clothing',
  applicationName: 'Lumiere Fashion Store',
  facebook_app_id: '',
  authors_name: 'Lumiere Fashion Team',
  authorPortfolio: 'https://lumiere-fashion.vercel.app',
  twitter_site: '@lumierefashion',
  bookmarks: '/logo.png',
  verification: {
    google: '',
    microsoft_bing: '',
  },
  publisher: 'Lumiere Fashion',
  preventCrawler: ['/dashboard', '/admin'],
};

export default metaConfig;
