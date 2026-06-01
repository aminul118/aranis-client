import { toUrlSlug } from '@/lib/url-slugs';
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
    getNavbars({ limit: '1000' }),
  ]);

  const settings = settingsRes?.data;
  const navItem = navItemsRes?.data?.find(
    (item) => item.href === path || item.href === `/${path}`,
  );

  return generateMetaTags({
    title: navItem
      ? `${navItem.title} | ${settings?.title || 'Aranis Fashion'}`
      : `${fallbackTitle} | ${settings?.title || 'Aranis Fashion'}`,
    description:
      settings?.description ||
      fallbackDesc ||
      'The Aranis - Premium contemporary apparel and accessories.',
    keywords: settings?.keywords || 'Aranis Fashion, Clothing, Premium',
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
    getNavbars({ limit: '1000' }),
  ]);

  const settings = settingsRes?.data;
  const navItems = navItemsRes?.data || [];

  // 1. Find the Category (Primary Nav Item)
  const categorySlug = slugs[0]?.toLowerCase();
  let categoryItem = navItems.find(
    (item) =>
      toUrlSlug(item.title) === categorySlug ||
      item.href.replace(/^\//, '').toLowerCase() === categorySlug,
  );

  let subCategoryItem: any;
  let typeItem: any;

  if (categoryItem) {
    // 2. Find the Sub-Category
    const subCategorySlug = slugs[1]?.toLowerCase();
    subCategoryItem = categoryItem?.subItems?.find(
      (sub: any) =>
        (sub.title && toUrlSlug(sub.title) === subCategorySlug) ||
        (sub.href &&
          sub.href.split('/').pop()?.toLowerCase() === subCategorySlug),
    );

    // 3. Find the Type/Item
    const typeSlug = slugs[2]?.toLowerCase();
    typeItem = subCategoryItem?.items.find(
      (item: any) => toUrlSlug(item.label) === typeSlug,
    );
  } else if (slugs.length === 1) {
    // Search subItems across all navItems
    let found = false;
    for (const item of navItems) {
      const matchedSub = item.subItems?.find(
        (sub: any) =>
          (sub.title && toUrlSlug(sub.title) === categorySlug) ||
          (sub.href &&
            sub.href.split('/').pop()?.toLowerCase() === categorySlug),
      );

      if (matchedSub) {
        categoryItem = item;
        subCategoryItem = matchedSub;
        found = true;
        break;
      }

      for (const sub of item.subItems || []) {
        const matchedType = sub.items?.find(
          (i: any) => toUrlSlug(i.label) === categorySlug,
        );
        if (matchedType) {
          categoryItem = item;
          subCategoryItem = sub;
          typeItem = matchedType;
          found = true;
          break;
        }
      }
      if (found) break;
    }
  }

  // Construct Semantic Title & Metadata
  // Hierarchy: SubCategory SEO -> Category SEO -> Semantic Generation -> Fallback
  let finalTitle = '';
  let finalDesc = '';
  let finalKeywords = '';

  // Fallback to semantic generation if not manually overridden
  if (!finalTitle) {
    if (typeItem && subCategoryItem && categoryItem) {
      finalTitle = `${typeItem.label} ${subCategoryItem.title || ''} for ${categoryItem.title}`;
    } else if (subCategoryItem && categoryItem) {
      finalTitle = `${subCategoryItem.title || ''} for ${categoryItem.title}`;
    } else if (categoryItem) {
      finalTitle = categoryItem.title;
    } else {
      finalTitle = slugs
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ');
    }
  }

  return generateMetaTags({
    title: `${finalTitle} | ${settings?.title || 'Aranis Fashion'}`,
    description:
      finalDesc ||
      settings?.description ||
      `Explore our dynamic collection of ${finalTitle}. Premium quality apparel at Aranis Fashion.`,
    keywords:
      finalKeywords ||
      `${settings?.keywords || ''}, ${slugs.join(', ')}`.trim(),
    websitePath: `/${slugs.join('/')}`,
    image: settings?.baseImage,
  });
}
