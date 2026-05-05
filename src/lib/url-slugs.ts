/**
 * Maps SEO-friendly URL slugs back to database-compatible category/subcategory names.
 * This handles common pluralization and capitalization differences.
 */

const DB_TO_SLUG: Record<string, string> = {
  Men: 'men',
  Women: 'women',
  Accessories: 'accessories',
  Phones: 'phones',
  Tablet: 'tablets',
  Laptop: 'laptops',
  'Smart Watch': 'smart-watches',
  Gadget: 'gadgets',
  Sounds: 'sounds',
  'Smart TV': 'smart-tvs',
  'Bengal Thread': 'bengal-thread',
  'Sadabahar (Stitched.)': 'sadabahar-stitched',
};

const SLUG_TO_DB: Record<string, string> = Object.entries(DB_TO_SLUG).reduce(
  (acc, [db, slug]) => ({ ...acc, [slug]: db }),
  {},
);

/**
 * Normalizes a slug to its database-ready equivalent.
 * Falls back to capitalization if no direct mapping exists.
 */
export const normalizeSlug = (slug: string): string => {
  if (!slug) return '';
  const decoded = decodeURIComponent(slug).toLowerCase();

  if (SLUG_TO_DB[decoded]) {
    return SLUG_TO_DB[decoded];
  }

  // Fallback: simple title casing
  return decoded
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Converts a database category name to an SEO-friendly URL slug.
 */
export const toUrlSlug = (name: string): string => {
  if (!name) return '';
  if (DB_TO_SLUG[name]) {
    return DB_TO_SLUG[name];
  }

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
