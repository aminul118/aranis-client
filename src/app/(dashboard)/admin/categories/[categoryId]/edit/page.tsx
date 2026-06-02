import CategoryForm from '@/app/(dashboard)/admin/categories/_components/CategoryForm';
import BackButton from '@/components/common/BackButton';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import { getSingleCategory } from '@/services/category/category';

export default async function EditCategoryPage({
  params,
}: {
  params: { categoryId: string };
}) {
  const { categoryId } = await params;
  const { data } = await getSingleCategory(categoryId);

  return (
    <ClientTableWrapper tableTitle="Edit category" action={<BackButton />}>
      <CategoryForm category={data} />
    </ClientTableWrapper>
  );
}
