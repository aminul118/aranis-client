import generateMetaTags from '@/seo/generateMetaTags';
import { getNavbars } from '@/services/navbar/navbar';
import { getSiteSettings } from '@/services/settings/settings';
import { Metadata } from 'next';
import { Suspense } from 'react';
import ShopContent from './_components/ShopContent';
import ShopSkeleton from './_components/ShopSkeleton';

const ShopPage = () => {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopContent />
    </Suspense>
  );
};

export default ShopPage;

export async function generateMetadata(): Promise<Metadata> {
  const [settingsRes, navItemsRes] = await Promise.all([
    getSiteSettings(),
    getNavbars({}),
  ]);

  const settings = settingsRes?.data;
  const shopNavItem = navItemsRes?.data?.find((item) => item.href === '/shop');

  return generateMetaTags({
    title: shopNavItem
      ? `${shopNavItem.title} | ${settings?.title || 'Aranis Fashion'}`
      : `Shop | ${settings?.title || 'Aranis Fashion'}`,
    description:
      settings?.description ||
      'Explore our curated collections of premium contemporary apparel.',
    keywords:
      settings?.keywords || 'Shop, Collection, Premium Clothing, Fashion',
    websitePath: '/shop',
    image: settings?.baseImage,
  });
}

export const dynamic = 'force-dynamic';
