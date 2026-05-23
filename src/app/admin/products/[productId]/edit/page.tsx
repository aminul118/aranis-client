import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import ProductForm from '@/components/modules/Admin/products/ProductForm';
import { getCategories } from '@/services/category/category';
import { getColors } from '@/services/color/color';
import { getOffers } from '@/services/offer/offer';
import { getSingleProduct } from '@/services/product/product';
import { getAllSizeGuides } from '@/services/size-guide/size-guide';
import { getSizes } from '@/services/size/size';

export default async function EditProductPage({
  params,
}: {
  params: { productId: string };
}) {
  const { productId } = await params;
  const [
    categoriesRes,
    colorsRes,
    productRes,
    sizesRes,
    sizeGuidesRes,
    offersRes,
  ] = await Promise.all([
    getCategories({ limit: '1000' }),
    getColors({}),
    getSingleProduct(productId),
    getSizes({ sort: 'order' }),
    getAllSizeGuides(),
    getOffers({}),
  ]);

  return (
    <ClientTableWrapper tableTitle="Edit product">
      <ProductForm
        product={productRes.data}
        categories={categoriesRes.data || []}
        colors={colorsRes.data || []}
        sizes={sizesRes.data || []}
        sizeGuides={sizeGuidesRes.data || []}
        offers={offersRes.data || []}
      />
    </ClientTableWrapper>
  );
}
