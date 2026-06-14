import CategoryForm from '@/app/admin/categories/_components/CategoryForm';
import BackButton from '@/components/common/BackButton';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';

export const dynamic = 'force-dynamic';

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
