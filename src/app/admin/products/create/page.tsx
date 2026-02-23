import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import ProductForm from '@/components/modules/Admin/products/ProductForm';
import { getCategories } from '@/services/category/category';
import { getColors } from '@/services/color/color';

export default async function CreateProductPage() {
    const [categoriesRes, colorsRes] = await Promise.all([
        getCategories({}),
        getColors({}),
    ]);

    return (
        <ClientTableWrapper tableTitle="Create new product">
            <ProductForm
                categories={categoriesRes.data || []}
                colors={colorsRes.data || []}
            />
        </ClientTableWrapper>
    );
}
