
import OrderDetailsView from '@/components/modules/Admin/orders/OrderDetailsView';
import { getSingleOrder } from '@/services/order/order';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{
        orderId: string;
    }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { orderId } = await params;
    return {
        title: `Order #${orderId.slice(-6).toUpperCase()} | Admin`,
    };
}

export default async function OrderDetailPage({ params }: Props) {
    const { orderId } = await params;
    const { data: order } = await getSingleOrder(orderId);

    if (!order) {
        notFound();
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <OrderDetailsView order={order} />
        </div>
    );
}
