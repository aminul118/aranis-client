import { Column } from '@/components/common/table/TableManageMent';
import type { ICustomerInterestItem } from '@/services/customer-interest/customer-interest.interface';
import { Heart, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import CustomerInterestActions from './CustomerInterestActions';

const CustomerInterestColumn: Column<ICustomerInterestItem>[] = [
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
    header: 'Product',
    accessor: (p) => (
      <div className="flex items-center gap-3 transition-opacity hover:opacity-80">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-white/10">
          <Image
            src={(p.thumbnails?.[0] as string) || '/placeholder.jpg'}
            alt={p.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="max-w-[160px] truncate font-medium">{p.name}</span>
          <span className="text-muted-foreground text-xs">
            {p.articleNo || 'N/A'}
          </span>
        </div>
      </div>
    ),
    sortKey: 'name',
  },
  {
    header: 'Price',
    accessor: (p) => (
      <div className="flex flex-col">
        <span className="font-bold">৳{p.price.toFixed(2)}</span>
        {p.salePrice && p.salePrice > 0 ? (
          <span className="text-xs font-bold text-emerald-500">
            Sale: ৳{p.salePrice.toFixed(2)}
          </span>
        ) : null}
      </div>
    ),
    sortKey: 'price',
  },
  {
    header: 'Stock',
    accessor: (p) => (
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${
          p.stock > 10
            ? 'bg-emerald-500/10 text-emerald-500'
            : p.stock > 0
              ? 'bg-amber-500/10 text-amber-500'
              : 'bg-red-500/10 text-red-500'
        }`}
      >
        {p.stock > 0 ? `${p.stock} in stock` : 'Out of Stock'}
      </span>
    ),
    sortKey: 'stock',
  },
  {
    header: 'In Carts',
    accessor: (p) => (
      <div className="flex items-center gap-2 font-medium text-blue-500">
        <ShoppingCart size={16} />
        {p.cartCount}
      </div>
    ),
    sortKey: 'cartCount',
  },
  {
    header: 'In Wishlists',
    accessor: (p) => (
      <div className="flex items-center gap-2 font-medium text-rose-500">
        <Heart size={16} />
        {p.wishlistCount}
      </div>
    ),
    sortKey: 'wishlistCount',
  },
  {
    header: 'Total Interest',
    accessor: (p) => (
      <span className="text-foreground font-bold">{p.totalInterest}</span>
    ),
    sortKey: 'totalInterest',
  },
  {
    header: 'Actions',
    accessor: (p) => <CustomerInterestActions product={p} />,
  },
];

export default CustomerInterestColumn;
