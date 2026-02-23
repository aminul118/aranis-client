import TableFilters from '@/components/common/table/TableFilters';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import MiniBannerTable from '@/components/modules/Admin/hero-banner/MiniBannerTable';
import { Button } from '@/components/ui/button';
import cleanSearchParams from '@/lib/cleanSearchParams';
import { getMiniBanners } from '@/services/hero-banner/hero-banner';
import { SearchParams } from '@/types';
import { Plus } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

const MiniBannersAdminPage = async ({ searchParams }: SearchParams) => {
    const params = await cleanSearchParams(searchParams);
    const { data, meta } = await getMiniBanners(params);

    return (
        <ClientTableWrapper tableTitle="Mini Banners" meta={meta} action={<Actions />}>
            <TableFilters />
            <MiniBannerTable banners={data} />
        </ClientTableWrapper>
    );
};

export default MiniBannersAdminPage;

const Actions = () => (
    <Link href="/admin/mini-banners/create">
        <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Mini Banner
        </Button>
    </Link>
);

export const metadata: Metadata = {
    title: 'Mini Banners | Admin Portal',
};
