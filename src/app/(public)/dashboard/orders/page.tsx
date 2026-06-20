import generateMetaTags from '@/seo/generateMetaTags';
import { getMyOrders } from '@/services/order/order';
import { Metadata } from 'next';
import { Suspense } from 'react';
import UserOrdersContent from './_components/UserOrdersContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = generateMetaTags({
  title: 'My Orders | Dashboard | Aranis Fashion',
  description:
    'View and track your previous orders, review products, and re-order items seamlessly from your dashboard.',
  websitePath: '/dashboard/orders',
  keywords: 'orders, dashboard, history, reorder',
});

export default async function UserOrdersPage() {
  const res = await getMyOrders();
  const initialOrders = res?.data || [];
  return (
    <Suspense fallback={null}>
      <UserOrdersContent initialOrders={initialOrders} />
    </Suspense>
  );
}
