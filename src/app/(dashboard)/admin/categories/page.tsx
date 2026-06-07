import CategoriesTable from '@/app/(dashboard)/admin/categories/_components/CategoriesTable';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import { Button } from '@/components/ui/button';
import cleanSearchParams from '@/lib/cleanSearchParams';
import { getCategories } from '@/services/category/category';
import { SearchParams } from '@/types';
import { Plus } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const CategoryPage = async ({ searchParams }: SearchParams) => {
  const params = await cleanSearchParams(searchParams);
  const { data, meta } = await getCategories(params);
  return (
    <>
      <ClientTableWrapper
        tableTitle="Categories"
        meta={meta}
        action={<Actions />}
      >
        <CategoriesTable categories={data} />
      </ClientTableWrapper>
    </>
  );
};

export default CategoryPage;

const Actions = () => {
  return (
    <Link href="/admin/categories/create">
      <Button>
        <Plus className="mr-2 h-4 w-4" /> Add Category
      </Button>
    </Link>
  );
};

export const metadata: Metadata = {
  title: 'Categories | Admin Portal',
};
