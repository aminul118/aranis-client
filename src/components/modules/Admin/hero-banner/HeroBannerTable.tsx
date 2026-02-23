'use client';

import TableManageMent from '@/components/common/table/TableManageMent';
import { IHeroBanner } from '@/services/hero-banner/hero-banner';
import HeroBannerColumn from './HeroBannerColumn';

const HeroBannerTable = ({ banners }: { banners: IHeroBanner[] }) => {
    return (
        <TableManageMent
            columns={HeroBannerColumn}
            data={banners || []}
            getRowKey={(b) => b._id as string}
            emptyMessage="No hero banner found"
        />
    );
};

export default HeroBannerTable;
