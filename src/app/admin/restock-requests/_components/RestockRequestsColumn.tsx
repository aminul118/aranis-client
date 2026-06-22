import { Column } from '@/components/common/table/TableManageMent';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { IRestockRequest } from '@/services/restock/restock.interface';
import { User } from 'lucide-react';
import Image from 'next/image';
import RestockRequestActions from './RestockRequestActions';

const RestockRequestsColumn: Column<IRestockRequest>[] = [
  {
    header: 'Product',
    accessor: (c) => (
      <div className="flex items-center gap-4">
        <div className="border-border bg-muted relative flex h-12 w-10 items-center justify-center overflow-hidden rounded-md border">
          {c.product ? (
            <Image
              src={c.product.thumbnails?.[0] || '/placeholder.png'}
              alt={c.product.name}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-muted-foreground text-[10px]">N/A</span>
          )}
        </div>
        <div>
          <p className="font-bold">{c.product?.name || 'Deleted Product'}</p>
          <p className="text-muted-foreground text-xs">
            {c.product?.category || 'N/A'}
          </p>
        </div>
      </div>
    ),
  },
  {
    header: 'Customer',
    accessor: (c) => (
      <div className="flex items-center gap-2">
        <User size={14} className="text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">
            {c.user ? `${c.user.firstName} ${c.user.lastName}` : 'Deleted User'}
          </p>
          <p className="text-muted-foreground text-[10px]">
            {c.user?.email || 'N/A'}
          </p>
        </div>
      </div>
    ),
  },
  {
    header: 'Date',
    accessor: (c) => (
      <span className="text-muted-foreground text-sm">
        {new Date(c.createdAt).toLocaleDateString()}
      </span>
    ),
    sortKey: 'createdAt',
  },
  {
    header: 'Status',
    accessor: (c) => (
      <Badge
        className={cn(
          'rounded-full px-2 py-0.5 text-[10px] font-black tracking-widest uppercase',
          c.status === 'Pending'
            ? 'border border-amber-500/20 bg-amber-500/10 text-amber-600'
            : 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-600',
        )}
      >
        {c.status}
      </Badge>
    ),
    sortKey: 'status',
  },
  {
    header: 'Actions',
    accessor: (c) => <RestockRequestActions request={c} />,
  },
];

export default RestockRequestsColumn;
