import { resolveSlugs } from '@/lib/url-slugs';
import { generateCategorizedMeta } from '@/seo/generateDynamicMeta';
import { getCategories } from '@/services/category/category';
import { getColors } from '@/services/color/color';
import { getProductPriceRange, getProducts } from '@/services/product/product';
import { getSizes } from '@/services/size/size';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ShopContent from '../shop/_components/ShopContent';

interface Props {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<Record<string, string>>;
}

const RESTRICTED_SEGMENTS = ['admin', 'api', 'auth', 'dashboard', 'user'];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug.some((s) => RESTRICTED_SEGMENTS.includes(s.toLowerCase()))) {
    return {};
  }
  return await generateCategorizedMeta(slug);
}

const DynamicShopPage = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  // Prevent catch-all from capturing admin or system routes
  if (slug.some((s) => RESTRICTED_SEGMENTS.includes(s.toLowerCase()))) {
    notFound();
  }

  // Fetch live categories to correctly map dynamic slugs back to original DB names
  const [
    { data: dbCategories },
    { data: dbColors },
    { data: dbSizes },
    { data: priceRange },
  ] = await Promise.all([
    getCategories({ limit: '1000' }),
    getColors({ limit: '1000' }),
    getSizes({ limit: '1000' }),
    getProductPriceRange(),
  ]);

  const categories = dbCategories || [];

  const { category, subCategory, type, isValidMatch } = resolveSlugs(
    slug,
    categories,
  );

  // If the slug doesn't match any valid category/subcategory, return 404
  if (!isValidMatch) {
    notFound();
  }

  const initialFilters = {
    category: category === 'All' ? undefined : category,
    subCategory: subCategory || undefined,
    type: type || undefined,
  };

  const page = resolvedSearchParams.page || '1';
  const limit = '12';

  const rawQuery = {
    ...resolvedSearchParams,
    ...initialFilters,
    page,
    limit,
  };

  const query: Record<string, string> = {};
  Object.entries(rawQuery).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query[key] = value as string;
    }
  });

  const { data: products, meta } = await getProducts(query);

  return (
    <ShopContent
      initialFilters={initialFilters}
      products={products || []}
      meta={meta || null}
      dbCategories={dbCategories || []}
      dbColors={dbColors || []}
      dbSizes={dbSizes || []}
      priceRange={priceRange || null}
    />
  );
};

export default DynamicShopPage;
