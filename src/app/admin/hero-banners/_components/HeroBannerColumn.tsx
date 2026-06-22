'use client';

import { Column } from '@/components/common/table/TableManageMent';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { IHeroBanner } from '@/services/hero-banner/hero-banner.interface';
import Image from 'next/image';
import HeroBannerActions from './HeroBannerActions';

const HeroBannerColumn: Column<IHeroBanner>[] = [
  {
    header: 'Order',
    accessor: (b) => b.order,
    sortKey: '-order',
  },
  {
    header: 'Image',
    accessor: (b) => (
      <Dialog>
        <DialogTrigger asChild>
          <div className="bg-muted relative h-10 w-16 cursor-pointer overflow-hidden rounded transition-opacity hover:opacity-80">
            <Image
              src={b.image}
              alt="Hero Banner"
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        </DialogTrigger>
        <DialogContent
          className="max-w-5xl border-none bg-transparent p-0 shadow-none"
          closeButtonClassName="text-red-500 hover:text-red-700 bg-white hover:bg-white/90 rounded-full"
        >
          <DialogTitle className="sr-only">Banner Image</DialogTitle>
          <div className="relative flex w-full items-center justify-center p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={b.image}
              alt="Hero Banner"
              className="max-h-[85vh] w-auto max-w-full rounded-md object-contain shadow-2xl"
            />
          </div>
        </DialogContent>
      </Dialog>
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
    accessor: (b) => <HeroBannerActions banner={b} />,
  },
];

export default HeroBannerColumn;
