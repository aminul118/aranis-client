import generateMetaTags from '@/seo/generateMetaTags';
import { getCategories } from '@/services/category/category';
import { getColors } from '@/services/color/color';
import { getNavbars } from '@/services/navbar/navbar';
import { getProductPriceRange, getProducts } from '@/services/product/product';
import { getSiteSettings } from '@/services/settings/settings';
import { getSizes } from '@/services/size/size';
import { Metadata } from 'next';
import { Suspense } from 'react';
import ShopContent from './_components/ShopContent';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<Record<string, string>>;
}

const ShopPage = async ({ searchParams }: Props) => {
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page || '1';
  const limit = '12';

  const query = {
    ...resolvedSearchParams,
    page,
    limit,
  };

  const [
    { data: products, meta },
    { data: dbCategories },
    { data: dbColors },
    { data: dbSizes },
    { data: priceRange },
  ] = await Promise.all([
    getProducts(query),
    getCategories({ limit: '1000' }),
    getColors({ limit: '1000' }),
    getSizes({ limit: '1000' }),
    getProductPriceRange(),
  ]);

  return (
    <Suspense fallback={null}>
      <ShopContent
        products={products || []}
        meta={meta || null}
        dbCategories={dbCategories || []}
        dbColors={dbColors || []}
        dbSizes={dbSizes || []}
        priceRange={priceRange || null}
      />
    </Suspense>
  );
};

export default ShopPage;

export async function generateMetadata(): Promise<Metadata> {
  const [settingsRes, navItemsRes] = await Promise.all([
    getSiteSettings(),
    getNavbars({ limit: '1000' }),
  ]);

  const settings = settingsRes?.data;
  const shopNavItem = navItemsRes?.data?.find((item) => item.href === '/shop');

  return generateMetaTags({
    title: shopNavItem
      ? `${shopNavItem.title} | Aranis Fashion`
      : `Shop | Aranis Fashion`,
    description:
      'Explore our curated collections of premium contemporary apparel.',
    keywords: 'Shop, Collection, Premium Clothing, Fashion',
    websitePath: '/shop',
  });
}
