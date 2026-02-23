import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import CategoryForm from '@/components/modules/Admin/categories/CategoryForm';

export default function CreateCategoryPage() {
    return (
        <ClientTableWrapper tableTitle="Create new category">
            <CategoryForm />
        </ClientTableWrapper>
    );
}
