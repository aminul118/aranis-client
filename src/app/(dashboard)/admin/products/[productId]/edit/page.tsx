import ProductForm from '@/app/(dashboard)/admin/products/_components/ProductForm';
import BackButton from '@/components/common/BackButton';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import { getCategories } from '@/services/category/category';
import { getColors } from '@/services/color/color';
import { getOffers } from '@/services/offer/offer';
import { getSingleProduct } from '@/services/product/product';
import { getAllSizeGuides } from '@/services/size-guide/size-guide';
import { getSizes } from '@/services/size/size';

export const dynamic = 'force-dynamic';

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
    getColors({ limit: '1000' }),
    getSingleProduct(productId),
    getSizes({ sort: 'order', limit: '1000' }),
    getAllSizeGuides(),
    getOffers({}),
  ]);

  return (
    <ClientTableWrapper tableTitle="Edit product" action={<BackButton />}>
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
