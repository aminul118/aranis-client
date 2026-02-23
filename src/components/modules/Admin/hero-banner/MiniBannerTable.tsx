'use client';

import TableManageMent from '@/components/common/table/TableManageMent';
import { IMiniBanner } from '@/services/hero-banner/hero-banner';
import MiniBannerColumn from './MiniBannerColumn';

const MiniBannerTable = ({ banners }: { banners: IMiniBanner[] }) => {
    return (
        <TableManageMent
            columns={MiniBannerColumn}
            data={banners || []}
            getRowKey={(b) => b._id as string}
            emptyMessage="No mini banner found"
        />
    );
};

export default MiniBannerTable;
