import metaConfig from '@/config/meta.config';
import { MetaProps } from '@/types';
import { Metadata } from 'next';

const generateMetaTags = ({
  title,
  description,
  keywords,
  image,
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
    publisher,
    bookmarks,
  } = metaConfig;

  const finalTitle = title || siteName;
  const finalDescription = description || metaConfig.category;
  const finalImage = image || metaConfig.baseImage;

  return {
    metadataBase: new URL(baseUrl),
    title: finalTitle,
    description: finalDescription,
    keywords,
    category: metaConfig.category,
    openGraph: {
      type: 'website',
      url: `${baseUrl}/${cleanPath}`,
      title: finalTitle,
      description: finalDescription,
      siteName,
      images: [{ url: finalImage, alt: finalTitle }],
    },
    robots: { index: true, follow: true },
    twitter: {
      card: 'summary_large_image',
      site: twitter_site,
      creator: twitter_site,
      title: finalTitle,
      description: finalDescription,
      images: finalImage,
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
