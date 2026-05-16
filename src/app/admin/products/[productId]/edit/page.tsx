import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import ProductForm from '@/components/modules/Admin/products/ProductForm';
import { getCategories } from '@/services/category/category';
import { getColors } from '@/services/color/color';
import { getSingleProduct } from '@/services/product/product';
import { getAllSizeGuides } from '@/services/size-guide/size-guide';

export default async function EditProductPage({
  params,
}: {
  params: { productId: string };
}) {
  const { productId } = await params;
  const [categoriesRes, colorsRes, productRes, sizeGuidesRes] =
    await Promise.all([
      getCategories({}),
      getColors({}),
      getSingleProduct(productId),
      getAllSizeGuides(),
    ]);

  return (
    <ClientTableWrapper tableTitle="Edit product">
      <ProductForm
        product={productRes.data}
        categories={categoriesRes.data || []}
        colors={colorsRes.data || []}
        sizeGuides={sizeGuidesRes.data || []}
      />
    </ClientTableWrapper>
  );
}
