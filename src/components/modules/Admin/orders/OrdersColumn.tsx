import DateFormat from '@/components/common/formater/date-format';
import { Column } from '@/components/common/table/TableManageMent';
import { IOrder, OrderStatus } from '@/services/order/order.types';
import OrderActions from './OrderActions';
import Link from 'next/link';

const OrdersColumn: Column<IOrder>[] = [
    {
        header: 'SI',
        accessor: (_, i) => i + 1,
    },
    {
        header: 'Order ID',
        accessor: (o) => (
            <Link href={`/admin/orders/${o._id}`} className="hover:underline text-blue-500 font-semibold transition-colors">
                #{o._id?.slice(-6).toUpperCase() || 'N/A'}
            </Link>
        ),
    },
    {
        header: 'Customer',
        accessor: (o) => (
            <div className="flex flex-col">
                <span className="font-bold text-foreground">{o.user?.fullName || 'Guest'}</span>
                <span className="text-xs text-muted-foreground">{o.user?.email || 'N/A'}</span>
            </div>
        ),
    },
    {
        header: 'Contact',
        accessor: (o) => <span className="text-sm italic">{o.user?.phone || 'No phone'}</span>,
    },
    {
        header: 'Payment',
        accessor: (o) => (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${o.paymentMethod === 'CARD' ? 'text-blue-500 bg-blue-500/10' : 'text-slate-500 bg-slate-500/10'}`}>
                {o.paymentMethod || 'COD'}
            </span>
        ),
    },
    {
        header: 'Total',
        accessor: (o) => <span className="font-black text-foreground">${o.totalPrice?.toFixed(2) || '0.00'}</span>,
    },
    {
        header: 'Status',
        accessor: (o) => (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${o.status === OrderStatus.DELIVERED ? 'text-green-500 bg-green-500/10' : 'text-amber-500 bg-amber-500/10'}`}>
                {o.status}
            </span>
        ),
    },
    {
        header: 'Date',
        accessor: (o) => <DateFormat date={o.createdAt as any} />,
    },
    {
        header: 'Actions',
        accessor: (o) => <OrderActions order={o} />,
    },
];

export default OrdersColumn;
