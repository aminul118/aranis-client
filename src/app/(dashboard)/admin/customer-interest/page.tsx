import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import cleanSearchParams from '@/lib/cleanSearchParams';
import { getCustomerInterestStats } from '@/services/customer-interest/customer-interest';
import { SearchParams } from '@/types';
import { Metadata } from 'next';
import CustomerInterestTable from './_components/CustomerInterestTable';

const CustomerInterestPage = async ({ searchParams }: SearchParams) => {
  const params = await cleanSearchParams(searchParams);

  const res = await getCustomerInterestStats({
    ...params,
    cache: 'no-store',
  } as any);

  return (
    <ClientTableWrapper
      tableTitle="Customer Interest (Cart & Wishlist)"
      meta={res?.meta}
    >
      <CustomerInterestTable data={res?.data || []} />
    </ClientTableWrapper>
  );
};

export default CustomerInterestPage;

export const metadata: Metadata = {
  title: 'Customer Interest | Admin Portal',
};
