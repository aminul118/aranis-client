'use client';

import { Column } from '@/components/common/table/TableManageMent';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { IProductInterestUser } from '@/services/customer-interest/customer-interest.interface';
import { Heart, ShoppingCart } from 'lucide-react';

const CustomerInterestUsersColumn: Column<IProductInterestUser>[] = [
  {
    header: 'SI',
    accessor: (row, index, globalIndex) => (
      <span className="text-muted-foreground text-xs font-bold">
        {globalIndex}
      </span>
    ),
    className: 'w-[50px]',
  },
  {
    header: 'User',
    accessor: (u) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border dark:border-white/10">
          {u.image && (
            <AvatarImage
              src={u.image}
              alt={u.firstName}
              className="object-cover"
            />
          )}
          <AvatarFallback className="font-bold">
            {u.firstName?.[0]?.toUpperCase() || ''}
            {u.lastName?.[0]?.toUpperCase() || ''}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
          <span className="text-foreground font-semibold">
            {u.firstName} {u.lastName}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: 'Phone',
    accessor: (u) => (
      <span className="text-muted-foreground text-sm">{u.phone || '-'}</span>
    ),
  },
  {
    header: 'Email',
    accessor: (u) => (
      <span className="text-muted-foreground text-sm">{u.email || '-'}</span>
    ),
  },
  {
    header: 'Status',
    accessor: (u) => (
      <div className="flex flex-wrap gap-2">
        {u.inCart && (
          <span className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-500">
            <ShoppingCart className="h-3 w-3" /> Cart
          </span>
        )}
        {u.inWishlist && (
          <span className="flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-500">
            <Heart className="h-3 w-3" /> Wishlist
          </span>
        )}
      </div>
    ),
  },
];

export default CustomerInterestUsersColumn;
