import CategoryForm from '@/app/admin/categories/_components/CategoryForm';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';

export default function CreateCategoryPage() {
  return (
    <ClientTableWrapper tableTitle="Create new category">
      <CategoryForm />
    </ClientTableWrapper>
  );
}
