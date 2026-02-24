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

/**
 * Generates dynamic SEO for categorization routes (e.g. /men/shirts/formal)
 * by matching URL slugs with the navbar hierarchy.
 */
const RESTRICTED_SEGMENTS = ['admin', 'api', 'auth', 'dashboard', 'user'];

export async function generateCategorizedMeta(
  slugs: string[],
): Promise<Metadata> {
  // Guard against capturing admin or system routes
  if (slugs.some((s) => RESTRICTED_SEGMENTS.includes(s.toLowerCase()))) {
    return {};
  }

  const [settingsRes, navItemsRes] = await Promise.all([
    getSiteSettings(),
    getNavbars({}),
  ]);

  const settings = settingsRes?.data;
  const navItems = navItemsRes?.data || [];

  // 1. Find the Category (Primary Nav Item)
  const categorySlug = slugs[0]?.toLowerCase();
  const categoryItem = navItems.find(
    (item) =>
      item.title.toLowerCase() === categorySlug ||
      item.href.replace(/^\//, '').toLowerCase() === categorySlug,
  );

  // 2. Find the Sub-Category
  const subCategorySlug = slugs[1]?.toLowerCase();
  const subCategoryItem = categoryItem?.subItems?.find(
    (sub) =>
      sub.title.toLowerCase() === subCategorySlug ||
      (sub.href &&
        sub.href.split('/').pop()?.toLowerCase() === subCategorySlug),
  );

  // 3. Find the Type/Item
  const typeSlug = slugs[2]?.toLowerCase();
  const typeItem = subCategoryItem?.items.find(
    (item) =>
      item.toLowerCase() === typeSlug ||
      item.replace(/\s+/g, '-').toLowerCase() === typeSlug,
  );

  // Construct Semantic Title & Metadata
  // Hierarchy: SubCategory SEO -> Category SEO -> Semantic Generation -> Fallback
  let finalTitle = '';
  let finalDesc = '';
  let finalKeywords = '';

  if (
    subCategoryItem &&
    (subCategoryItem.seoTitle || subCategoryItem.seoDescription)
  ) {
    finalTitle = subCategoryItem.seoTitle || subCategoryItem.title;
    finalDesc = subCategoryItem.seoDescription || '';
    finalKeywords = subCategoryItem.seoKeywords || '';
  } else if (
    categoryItem &&
    (categoryItem.seoTitle || categoryItem.seoDescription)
  ) {
    finalTitle = categoryItem.seoTitle || categoryItem.title;
    finalDesc = categoryItem.seoDescription || '';
    finalKeywords = categoryItem.seoKeywords || '';
  }

  // Fallback to semantic generation if not manually overridden
  if (!finalTitle) {
    if (typeItem && subCategoryItem && categoryItem) {
      finalTitle = `${typeItem} ${subCategoryItem.title} for ${categoryItem.title}`;
    } else if (subCategoryItem && categoryItem) {
      finalTitle = `${subCategoryItem.title} for ${categoryItem.title}`;
    } else if (categoryItem) {
      finalTitle = categoryItem.title;
    } else {
      finalTitle = slugs
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ');
    }
  }

  return generateMetaTags({
    title: `${finalTitle} | ${settings?.title || 'Lumiere Fashion'}`,
    description:
      finalDesc ||
      settings?.description ||
      `Explore our dynamic collection of ${finalTitle}. Premium quality apparel at Lumiere Fashion.`,
    keywords:
      finalKeywords ||
      `${settings?.keywords || ''}, ${slugs.join(', ')}`.trim(),
    websitePath: `/${slugs.join('/')}`,
    image: settings?.baseImage,
  });
}
