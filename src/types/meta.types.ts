export interface MetaProps {
  title: string;
  description: string;
  keywords: string;
  image?: string;
  websitePath?: string;
}

export interface MetaConfig {
  baseUrl: string;
  baseImage: string;
  siteName: string;
  category: string;
  applicationName: string;
  authors_name: string;
  authorPortfolio: string;
  twitter_site: string;
  facebook_app_id: string;
  bookmarks: string;
  verification: {
    google: string;
    microsoft_bing: string;
  };
  publisher: string;
  preventCrawler: string[];
}

export interface Routes {
  url: string;
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: number;
}
