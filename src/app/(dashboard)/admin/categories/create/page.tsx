import CategoryForm from '@/app/(dashboard)/admin/categories/_components/CategoryForm';
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
