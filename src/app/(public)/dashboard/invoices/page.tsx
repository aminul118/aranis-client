import generateMetaTags from '@/seo/generateMetaTags';
import { getMyOrders } from '@/services/order/order';
import { Metadata } from 'next';
import { Suspense } from 'react';
import InvoicesContent from './_components/InvoicesContent';

export const metadata: Metadata = generateMetaTags({
  title: 'My Invoices | Dashboard | Aranis Fashion',
  description: 'View and download invoices for your past orders securely.',
  websitePath: '/dashboard/invoices',
  keywords: 'invoices, dashboard, history, billing, receipt',
});

export default async function UserInvoicesPage() {
  const res = await getMyOrders();
  const initialOrders = res?.data || [];

  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-gray-500">
          Loading your invoices...
        </div>
      }
    >
      <InvoicesContent initialOrders={initialOrders} />
    </Suspense>
  );
}
