'use client';

import TableManageMent from '@/components/common/table/TableManageMent';
import { IOrder } from '@/services/order/order.types';
import OrdersColumn from './OrdersColumn';

const OrdersTable = ({ orders }: { orders: IOrder[] }) => {
    return (
        <TableManageMent
            columns={OrdersColumn}
            data={orders || []}
            getRowKey={(o) => o._id as string}
            emptyMessage="No order found"
        />
    );
};

export default OrdersTable;
