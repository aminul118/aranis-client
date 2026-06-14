import ProductForm from '@/app/admin/products/_components/ProductForm';
import BackButton from '@/components/common/BackButton';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import { getCategories } from '@/services/category/category';
import { getColors } from '@/services/color/color';
import { getOffers } from '@/services/offer/offer';
import { getAllSizeGuides } from '@/services/size-guide/size-guide';
import { getSizes } from '@/services/size/size';

export const dynamic = 'force-dynamic';

export default async function CreateProductPage() {
  const [categoriesRes, colorsRes, sizesRes, sizeGuidesRes, offersRes] =
    await Promise.all([
      getCategories({ limit: '1000' }),
      getColors({ limit: '1000' }),
      getSizes({ sort: 'order', limit: '1000' }),
      getAllSizeGuides(),
      getOffers({}),
    ]);

  return (
    <ClientTableWrapper tableTitle="Create new product" action={<BackButton />}>
      <ProductForm
        categories={categoriesRes.data || []}
        colors={colorsRes.data || []}
        sizes={sizesRes.data || []}
        sizeGuides={sizeGuidesRes.data || []}
        offers={offersRes.data || []}
      />
    </ClientTableWrapper>
  );
}
