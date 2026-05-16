import { Column } from '@/components/common/table/TableManageMent';
import { Badge } from '@/components/ui/badge';
import { ICoupon } from '@/services/coupon/coupon';
import CouponActions from './CouponActions';

const CouponColumns: Column<ICoupon>[] = [
  {
    header: 'SI',
    accessor: (_, __, globalIndex) => (
      <span className="text-muted-foreground font-medium">
        {globalIndex.toString().padStart(2, '0')}
      </span>
    ),
  },
  {
    header: 'Name',
    accessor: (c) => <span className="font-semibold text-white">{c.name}</span>,
    sortKey: 'name',
  },
  {
    header: 'Code',
    accessor: (c) => (
      <Badge
        variant="outline"
        className="border-blue-500/20 bg-blue-500/5 px-2 py-0.5 font-mono text-blue-500"
      >
        {c.code}
      </Badge>
    ),
    sortKey: 'code',
  },
  {
    header: 'Discount',
    accessor: (c) => (
      <div className="flex items-center gap-1">
        <span className="text-lg font-bold text-white">{c.discount}%</span>
        <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
          Off
        </span>
      </div>
    ),
    sortKey: 'discount',
  },
  {
    header: 'Expiry Date',
    accessor: (c) => (
      <span className="text-muted-foreground whitespace-nowrap">
        {new Date(c.expiryDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </span>
    ),
    sortKey: 'expiryDate',
  },
  {
    header: 'Status',
    accessor: (c) => {
      const isExpired = new Date(c.expiryDate) < new Date();
      return isExpired ? (
        <Badge
          variant="destructive"
          className="border-red-500/20 bg-red-500/10 text-red-500"
        >
          Expired
        </Badge>
      ) : (
        <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
          Active
        </Badge>
      );
    },
  },
  {
    header: 'Actions',
    accessor: (c) => <CouponActions coupon={c} />,
  },
];

export default CouponColumns;
