import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import CategoryForm from '@/components/modules/Admin/categories/CategoryForm';
import { getSingleCategory } from '@/services/category/category';

export default async function EditCategoryPage({ params }: { params: { categoryId: string } }) {
    const { categoryId } = await params;
    const { data } = await getSingleCategory(categoryId);

    return (
        <ClientTableWrapper tableTitle="Edit category">
            <CategoryForm category={data} />
        </ClientTableWrapper>
    );
}
