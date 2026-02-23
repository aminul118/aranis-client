import TableFilters from '@/components/common/table/TableFilters';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import CategoriesTable from '@/components/modules/Admin/categories/CategoriesTable';
import { Button } from '@/components/ui/button';
import cleanSearchParams from '@/lib/cleanSearchParams';
import { getCategories } from '@/services/category/category';
import { SearchParams } from '@/types';
import { Plus } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

const CategoryPage = async ({ searchParams }: SearchParams) => {
    const params = await cleanSearchParams(searchParams);
    const { data, meta } = await getCategories(params);
    return (
        <>
            <ClientTableWrapper tableTitle="Categories" meta={meta} action={<Actions />}>
                <TableFilters />
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
