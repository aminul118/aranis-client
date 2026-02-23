import DateFormat from '@/components/common/formater/date-format';
import { Column } from '@/components/common/table/TableManageMent';
import { IOrder, OrderStatus } from '@/services/order/order.types';
import OrderActions from './OrderActions';

const OrdersColumn: Column<IOrder>[] = [
    {
        header: 'SI',
        accessor: (_, i) => i + 1,
    },
    {
        header: 'Order ID',
        accessor: (o) => <span className="font-semibold">#{o._id?.slice(-6).toUpperCase() || 'N/A'}</span>,
    },
    {
        header: 'Total',
        accessor: (o) => `$${o.totalPrice?.toFixed(2) || '0.00'}`,
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
