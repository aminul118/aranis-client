import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import ProductForm from '@/components/modules/Admin/products/ProductForm';
import { getCategories } from '@/services/category/category';
import { getColors } from '@/services/color/color';
import { getOffers } from '@/services/offer/offer';
import { getAllSizeGuides } from '@/services/size-guide/size-guide';

export default async function CreateProductPage() {
  const [categoriesRes, colorsRes, sizeGuidesRes, offersRes] =
    await Promise.all([
      getCategories({}),
      getColors({}),
      getAllSizeGuides(),
      getOffers({}),
    ]);

  return (
    <ClientTableWrapper tableTitle="Create new product">
      <ProductForm
        categories={categoriesRes.data || []}
        colors={colorsRes.data || []}
        sizeGuides={sizeGuidesRes.data || []}
        offers={offersRes.data || []}
      />
    </ClientTableWrapper>
  );
}
