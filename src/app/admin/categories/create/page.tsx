import CategoryForm from '@/app/admin/categories/_components/CategoryForm';
import BackButton from '@/components/common/BackButton';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';

export default function CreateCategoryPage() {
  return (
    <ClientTableWrapper
      tableTitle="Create new category"
      action={<BackButton />}
    >
      <CategoryForm />
    </ClientTableWrapper>
  );
}
