import generateMetaTags from '@/seo/generateMetaTags';
import { getNavbars } from '@/services/navbar/navbar';
import { getSiteSettings } from '@/services/settings/settings';
import { Metadata } from 'next';
import { Suspense } from 'react';
import ShopContent from './_components/ShopContent';

const ShopPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading shop...
        </div>
      }
    >
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
      ? `${shopNavItem.title} | ${settings?.title || 'Lumiere Fashion'}`
      : `Shop | ${settings?.title || 'Lumiere Fashion'}`,
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
