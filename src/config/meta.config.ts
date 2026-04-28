import { MetaConfig } from '@/types';

const metaConfig: MetaConfig = {
  baseUrl: 'https://Aranis-fashion.vercel.app', // Update with actual domain if known
  baseImage: '/og-image.png',
  siteName: 'Aranis Fashion',
  category: 'Premium Contemporary Clothing',
  applicationName: 'The Aranis Store',
  facebook_app_id: '',
  authors_name: 'The Aranis Team',
  authorPortfolio: 'https://Aranis-fashion.vercel.app',
  twitter_site: '@Aranisfashion',
  bookmarks: '/logo.png',
  verification: {
    google: '',
    microsoft_bing: '',
  },
  publisher: 'Aranis Fashion',
  preventCrawler: ['/dashboard', '/admin'],
};

export default metaConfig;
