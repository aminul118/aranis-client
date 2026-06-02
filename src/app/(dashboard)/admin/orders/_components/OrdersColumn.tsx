import DateFormat from '@/components/common/formater/date-format';
import { Column } from '@/components/common/table/TableManageMent';
import { IOrder, OrderStatus } from '@/services/order/order.types';
import Link from 'next/link';
import OrderActions from './OrderActions';
import GetStatusBadge from './getStatusBadge';

const OrdersColumn: Column<IOrder>[] = [
  {
    header: 'SI',
    accessor: (_, __, globalIndex) => globalIndex,
  },
  {
    header: 'Order ID',
    accessor: (o) => (
      <Link
        href={`/admin/orders/${o._id}`}
        className="font-semibold text-blue-500 transition-colors hover:underline"
      >
        #{o._id?.slice(-6).toUpperCase() || 'N/A'}
      </Link>
    ),
    sortKey: '_id',
  },
  {
    header: 'Customer',
    accessor: (o) => (
      <div className="flex flex-col">
        <span className="text-foreground font-bold">
          {o.user?.fullName || 'Guest'}
        </span>
        <span className="text-muted-foreground text-xs">
          {o.user?.email || 'N/A'}
        </span>
      </div>
    ),
  },
  {
    header: 'Contact',
    accessor: (o) => (
      <span className="text-sm italic">{o.user?.phone || 'No phone'}</span>
    ),
  },
  {
    header: 'Payment',
    accessor: (o) => (
      <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-black tracking-widest uppercase ${o.paymentMethod === 'CARD' ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-500/10 text-slate-500'}`}
      >
        {o.paymentMethod || 'COD'}
      </span>
    ),
  },
  {
    header: 'Total',
    accessor: (o) => (
      <span className="text-foreground font-black">
        ৳{o.totalPrice?.toFixed(2) || '0.00'}
      </span>
    ),
    sortKey: 'totalPrice',
  },
  {
    header: 'Status',
    accessor: (o) => GetStatusBadge(o.status as OrderStatus),
    sortKey: 'status',
  },
  {
    header: 'Date',
    accessor: (o) => <DateFormat date={o.createdAt as any} />,
    sortKey: 'createdAt',
  },
  {
    header: 'Actions',
    accessor: (o) => <OrderActions order={o} />,
  },
];

export default OrdersColumn;
