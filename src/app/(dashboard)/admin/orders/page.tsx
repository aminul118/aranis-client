import OrdersTable from '@/app/(dashboard)/admin/orders/_components/OrdersTable';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import cleanSearchParams from '@/lib/cleanSearchParams';
import { getAllOrders } from '@/services/order/order';
import { SearchParams } from '@/types';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const OrdersAdminPage = async ({ searchParams }: SearchParams) => {
  const params = await cleanSearchParams(searchParams);
  const { data, meta } = await getAllOrders(params, {
    cache: 'no-store',
    headers: { 'x-bypass-cache': 'true' },
  });
  return (
    <>
      <ClientTableWrapper tableTitle="Orders" meta={meta}>
        <OrdersTable orders={data} />
      </ClientTableWrapper>
    </>
  );
};

export default OrdersAdminPage;

export const metadata: Metadata = {
  title: 'Orders | Admin Portal',
};
