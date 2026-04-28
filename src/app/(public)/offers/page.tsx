import generateMetaTags from '@/seo/generateMetaTags';
import { getSiteSettings } from '@/services/settings/settings';
import { Metadata } from 'next';
import { Suspense } from 'react';
import ShopSkeleton from '../shop/_components/ShopSkeleton';
import OffersContent from './_components/OffersContent';

const OffersPage = () => {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <OffersContent />
    </Suspense>
  );
};

export default OffersPage;

export async function generateMetadata(): Promise<Metadata> {
  const settingsRes = await getSiteSettings();
  const settings = settingsRes?.data;

  return generateMetaTags({
    title: `Special Offers | ${settings?.title || 'Aranis Fashion'}`,
    description:
      'Check out our exclusive offers and discounts on premium contemporary apparel.',
    keywords: 'Offers, Discounts, Sale, Fashion Deals',
    websitePath: '/offers',
    image: settings?.baseImage,
  });
}

export const dynamic = 'force-dynamic';
