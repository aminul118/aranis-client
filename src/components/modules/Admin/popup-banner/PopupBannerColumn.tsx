'use client';

import { Column } from '@/components/common/table/TableManageMent';
import { Badge } from '@/components/ui/badge';
import { IPopupBanner } from '@/services/popup-banner/popup-banner';
import Image from 'next/image';
import PopupBannerActions from './PopupBannerActions';

const PopupBannerColumn: Column<IPopupBanner>[] = [
  {
    header: 'SI',
    accessor: (_, i) => i + 1,
  },
  {
    header: 'Image',
    accessor: (b) => (
      <div className="bg-muted relative h-10 w-20 overflow-hidden rounded">
        <Image
          src={b.image}
          alt={b.title || 'Popup Banner'}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>
    ),
  },
  {
    header: 'Title',
    accessor: (b) => (
      <span className="text-sm font-semibold">{b.title || '—'}</span>
    ),
  },
  {
    header: 'Link',
    accessor: (b) => (
      <span className="text-muted-foreground text-xs">{b.link || '—'}</span>
    ),
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
    accessor: (b) => <PopupBannerActions banner={b} />,
  },
];

export default PopupBannerColumn;
