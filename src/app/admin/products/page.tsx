import TableFilters from '@/components/common/table/TableFilters';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import ProductsTable from '@/components/modules/Admin/products/ProductsTable';
import { Button } from '@/components/ui/button';
import cleanSearchParams from '@/lib/cleanSearchParams';
import { getProducts } from '@/services/product/product';
import { SearchParams } from '@/types';
import { Plus } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

const ProductPage = async ({ searchParams }: SearchParams) => {
    const params = await cleanSearchParams(searchParams);
    const { data, meta } = await getProducts(params);
    return (
        <>
            <ClientTableWrapper tableTitle="Products" meta={meta} action={<Actions />}>
                <TableFilters />
                <ProductsTable products={data} />
            </ClientTableWrapper>
        </>
    );
};

export default ProductPage;

const Actions = () => {
    return (
        <Link href="/admin/products/create">
            <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
        </Link>
    );
};

export const metadata: Metadata = {
    title: 'Products | Admin Portal',
};
