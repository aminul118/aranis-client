/**
 * Converts a database category/subcategory name to an SEO-friendly URL slug.
 * This is fully dynamic and works for any category name created in the admin panel.
 */
export const toUrlSlug = (name: string): string => {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
};

/**
 * Generates a clean shop path based on category, subcategory, and type.
 */
export const generateShopPath = (
  category?: string,
  subCategory?: string,
  type?: string,
) => {
  const parts = [];
  if (category && category !== 'All') parts.push(toUrlSlug(category));
  if (subCategory) parts.push(toUrlSlug(subCategory));
  if (type) parts.push(toUrlSlug(type));

  if (parts.length === 0) return '/shop';
  return `/${parts.join('/')}`;
};

/**
 * Dynamically resolves URL slugs back to their exact database category names.
 */
export const resolveSlugs = (slugs: string[], categories: any[]) => {
  let resolvedCategory: string | undefined;
  let resolvedSubCategory: string | undefined;
  let resolvedType: string | undefined;

  const categorySlug = slugs[0];
  const subCategorySlug = slugs[1];
  const typeSlug = slugs[2];

  if (categorySlug) {
    const matchedCat = categories.find(
      (c) => toUrlSlug(c.name) === categorySlug,
    );

    if (matchedCat) {
      resolvedCategory = matchedCat.name;

      if (subCategorySlug) {
        const matchedSub = matchedCat.subCategories?.find(
          (s: any) => toUrlSlug(s.title) === subCategorySlug,
        );

        if (matchedSub) {
          resolvedSubCategory = matchedSub.title;

          if (typeSlug) {
            const matchedItem = matchedSub.items?.find(
              (i: string) => toUrlSlug(i) === typeSlug,
            );
            resolvedType = matchedItem;
          }
        }
      }
    } else if (slugs.length === 1) {
      // If it's a single slug and didn't match a top-level category,
      // search for a subcategory or item across all categories
      let found = false;
      for (const cat of categories) {
        const matchedSub = cat.subCategories?.find(
          (s: any) => toUrlSlug(s.title) === categorySlug,
        );
        if (matchedSub) {
          resolvedCategory = cat.name;
          resolvedSubCategory = matchedSub.title;
          found = true;
          break;
        }

        for (const sub of cat.subCategories || []) {
          const matchedItem = sub.items?.find(
            (i: string) => toUrlSlug(i) === categorySlug,
          );
          if (matchedItem) {
            resolvedCategory = cat.name;
            resolvedSubCategory = sub.title;
            resolvedType = matchedItem;
            found = true;
            break;
          }
        }
        if (found) break;
      }
    }
  }

  // Fallback to title-casing if no exact match is found (e.g. for "All")
  const fallback = (slug: string) =>
    slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  return {
    category:
      resolvedCategory || (categorySlug ? fallback(categorySlug) : 'All'),
    subCategory:
      resolvedSubCategory ||
      (subCategorySlug ? fallback(subCategorySlug) : undefined),
    type: resolvedType || (typeSlug ? fallback(typeSlug) : undefined),
  };
};
