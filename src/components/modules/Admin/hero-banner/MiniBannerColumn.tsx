'use client';

import { Column } from '@/components/common/table/TableManageMent';
import { Badge } from '@/components/ui/badge';
import { IMiniBanner } from '@/services/hero-banner/hero-banner';
import Image from 'next/image';
import MiniBannerActions from './MiniBannerActions';

const MiniBannerColumn: Column<IMiniBanner>[] = [
  {
    header: 'SI',
    accessor: (_, __, globalIndex) => globalIndex,
  },
  {
    header: 'Image',
    accessor: (b) => (
      <div className="bg-muted relative h-10 w-16 overflow-hidden rounded">
        <Image
          src={b.image}
          alt="Mini Banner"
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
    ),
  },
  {
    header: 'Link',
    accessor: (b) => (
      <span className="text-sm font-semibold">{b.link || 'N/A'}</span>
    ),
    sortKey: 'link',
  },
  {
    header: 'Order',
    accessor: (b) => b.order,
    sortKey: 'order',
  },
  {
    header: 'Status',
    accessor: (b) => (
      <Badge variant={b.isActive ? 'default' : 'secondary'}>
        {b.isActive ? 'Active' : 'Inactive'}
      </Badge>
    ),
    sortKey: 'isActive',
  },
  {
    header: 'Actions',
    accessor: (b) => <MiniBannerActions banner={b} />,
  },
];

export default MiniBannerColumn;
