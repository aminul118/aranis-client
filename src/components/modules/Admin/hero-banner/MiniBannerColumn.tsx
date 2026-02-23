'use client';

import { Column } from '@/components/common/table/TableManageMent';
import { IMiniBanner } from '@/services/hero-banner/hero-banner';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import MiniBannerActions from './MiniBannerActions';


const MiniBannerColumn: Column<IMiniBanner>[] = [
    {
        header: 'SI',
        accessor: (_, i) => i + 1,
    },
    {
        header: 'Image',
        accessor: (b) => (
            <div className="relative h-10 w-16 rounded overflow-hidden bg-muted">
                <Image src={b.image} alt={b.title} fill className="object-cover" sizes="64px" />
            </div>
        ),
    },
    {
        header: 'Label',
        accessor: (b) => <span className="text-xs text-muted-foreground">{b.label}</span>,
    },
    {
        header: 'Title',
        accessor: (b) => <span className="font-semibold text-sm">{b.title}</span>,
    },
    {
        header: 'Order',
        accessor: (b) => b.order,
    },
    {
        header: 'Status',
        accessor: (b) => (
            <Badge variant={b.isActive ? 'default' : 'secondary'}>
                {b.isActive ? 'Active' : 'Inactive'}
            </Badge>
        ),
    },
    {
        header: 'Actions',
        accessor: (b) => <MiniBannerActions banner={b} />,
    },
];

export default MiniBannerColumn;
