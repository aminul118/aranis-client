import ProductsTable from '@/app/admin/products/_components/ProductsTable';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import { Button } from '@/components/ui/button';
import cleanSearchParams from '@/lib/cleanSearchParams';
import { getCategories } from '@/services/category/category';
import { getColors } from '@/services/color/color';
import { getOffers } from '@/services/offer/offer';
import { getProducts } from '@/services/product/product';
import { getAllSizeGuides } from '@/services/size-guide/size-guide';
import { SearchParams } from '@/types';
import { Plus } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const ProductPage = async ({ searchParams }: SearchParams) => {
  const params = await cleanSearchParams(searchParams);
  const [productsRes, categoriesRes, colorsRes, sizeGuidesRes, offersRes] =
    await Promise.all([
      getProducts(params, {
        cache: 'no-store',
        headers: { 'x-bypass-cache': 'true' },
      }),
      getCategories({ limit: '1000' }),
      getColors({ limit: '1000' }),
      getAllSizeGuides(),
      getOffers({}),
    ]);

  return (
    <ClientTableWrapper
      tableTitle="Products"
      meta={productsRes.meta}
      action={<Actions />}
    >
      <ProductsTable
        products={productsRes.data || []}
        categories={categoriesRes.data || []}
        colors={colorsRes.data || []}
        sizeGuides={sizeGuidesRes.data || []}
        offers={offersRes.data || []}
      />
    </ClientTableWrapper>
  );
};

export default ProductPage;

const Actions = () => {
  return (
    <Link href="/admin/products/create">
      <Button>
        <Plus className="mr-2 h-4 w-4" /> Add Product
      </Button>
    </Link>
  );
};

export const metadata: Metadata = {
  title: 'Products | Admin Portal',
};
