import OrderDetailsView from '@/app/(dashboard)/admin/orders/[orderId]/_components/OrderDetailsView';
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
    <div className="container mx-auto max-w-6xl p-6">
      <OrderDetailsView order={order} />
    </div>
  );
}
