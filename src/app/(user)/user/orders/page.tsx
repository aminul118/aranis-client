import { getMyOrders } from '@/services/order/order';
import { IOrder } from '@/services/order/order.types';
import { Metadata } from 'next';
import { OrderStatus } from '@/services/order/order.types';

export const metadata: Metadata = { title: 'My Orders | Lumiere' };

const statusColor: Record<string, string> = {
    [OrderStatus.PENDING]: 'text-amber-500 bg-amber-500/10',
    [OrderStatus.PROCESSING]: 'text-blue-500 bg-blue-500/10',
    [OrderStatus.SHIPPED]: 'text-indigo-500 bg-indigo-500/10',
    [OrderStatus.DELIVERED]: 'text-green-500 bg-green-500/10',
    [OrderStatus.CANCELLED]: 'text-red-500 bg-red-500/10',
};

const UserOrdersPage = async () => {
    const { data: orders } = await getMyOrders({});
    const list: IOrder[] = Array.isArray(orders) ? orders : [];

    return (
        <div className="container mx-auto px-6 py-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">My Orders</h1>
                <p className="text-muted-foreground mt-1">Track and manage your purchases.</p>
            </div>

            {list.length === 0 ? (
                <div className="text-center py-24 text-muted-foreground">
                    <p className="text-lg">You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {list.map((order) => (
                        <div
                            key={order._id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border rounded-xl p-5 bg-card"
                        >
                            <div className="space-y-1">
                                <p className="font-semibold text-sm">
                                    Order #{order._id?.slice(-8).toUpperCase()}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {order.items?.length ?? 0} item(s) • ${order.totalPrice?.toFixed(2)}
                                </p>
                                <p className="text-xs text-muted-foreground">{order.shippingAddress}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span
                                    className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[order.status] ?? 'text-slate-500 bg-slate-500/10'}`}
                                >
                                    {order.status}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {order.createdAt
                                        ? new Date(order.createdAt).toLocaleDateString()
                                        : ''}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserOrdersPage;
