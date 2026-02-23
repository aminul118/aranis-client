import metaConfig from '@/config/meta.config';
import { MetaProps } from '@/types';
import { Metadata } from 'next';

const generateMetaTags = ({
  title,
  description,
  keywords,
  image = metaConfig.baseImage,
  websitePath = '',
}: MetaProps): Metadata => {
  const cleanPath = websitePath.replace(/^\/+/, '').replace(/\/+$/, '');

  const {
    applicationName,
    twitter_site,
    baseUrl,
    siteName,
    facebook_app_id,
    authors_name,
    authorPortfolio,
    category,
    publisher,
    bookmarks,
  } = metaConfig;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords,
    category,
    openGraph: {
      type: 'website',
      url: `${baseUrl}/${cleanPath}`,
      title,
      description,
      siteName,
      images: [{ url: image, alt: title }],
    },
    robots: { index: true, follow: true },
    twitter: {
      card: 'summary_large_image',
      site: twitter_site,
      creator: twitter_site,
      title,
      description,
      images: image,
    },
    applicationName,
    alternates: {
      canonical: `${baseUrl}/${cleanPath}`,
      languages: {
        'en-US': `${baseUrl}/en-US`,
      },
    },
    facebook: {
      appId: facebook_app_id,
    },
    verification: {
      google: metaConfig.verification.google,
      other: {
        'msvalidate.01': metaConfig.verification.microsoft_bing,
      },
    },
    manifest: '/manifest.webmanifest',
    publisher,
    creator: authors_name,
    referrer: 'no-referrer',
    bookmarks,
    abstract: description,
    authors: [
      {
        name: authors_name,
        url: authorPortfolio,
      },
    ],
  };
};

export default generateMetaTags;
