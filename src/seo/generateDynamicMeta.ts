import { getNavbars } from '@/services/navbar/navbar';
import { getSiteSettings } from '@/services/settings/settings';
import { Metadata } from 'next';
import generateMetaTags from './generateMetaTags';

export async function generateDynamicMeta(
  path: string,
  fallbackTitle: string,
  fallbackDesc?: string,
): Promise<Metadata> {
  const [settingsRes, navItemsRes] = await Promise.all([
    getSiteSettings(),
    getNavbars({}),
  ]);

  const settings = settingsRes?.data;
  const navItem = navItemsRes?.data?.find(
    (item) => item.href === path || item.href === `/${path}`,
  );

  return generateMetaTags({
    title: navItem
      ? `${navItem.title} | ${settings?.title || 'Lumiere Fashion'}`
      : `${fallbackTitle} | ${settings?.title || 'Lumiere Fashion'}`,
    description:
      settings?.description ||
      fallbackDesc ||
      'Lumiere Fashion - Premium contemporary apparel and accessories.',
    keywords: settings?.keywords || 'Lumiere Fashion, Clothing, Premium',
    websitePath: path,
    image: settings?.baseImage,
  });
}
