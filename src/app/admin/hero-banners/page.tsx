import TableFilters from '@/components/common/table/TableFilters';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import HeroBannerTable from '@/components/modules/Admin/hero-banner/HeroBannerTable';
import { Button } from '@/components/ui/button';
import cleanSearchParams from '@/lib/cleanSearchParams';
import { getHeroBanners } from '@/services/hero-banner/hero-banner';
import { SearchParams } from '@/types';
import { Plus } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

const HeroBannersAdminPage = async ({ searchParams }: SearchParams) => {
    const params = await cleanSearchParams(searchParams);
    const { data, meta } = await getHeroBanners(params);

    return (
        <ClientTableWrapper tableTitle="Hero Banners" meta={meta} action={<Actions />}>
            <TableFilters />
            <HeroBannerTable banners={data} />
        </ClientTableWrapper>
    );
};

export default HeroBannersAdminPage;

const Actions = () => (
    <Link href="/admin/hero-banners/create">
        <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Hero Banner
        </Button>
    </Link>
);

export const metadata: Metadata = {
    title: 'Hero Banners | Admin Portal',
};
