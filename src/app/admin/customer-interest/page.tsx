import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import cleanSearchParams from '@/lib/cleanSearchParams';
import { getCustomerInterestStats } from '@/services/customer-interest/customer-interest';
import { SearchParams } from '@/types';
import { Metadata } from 'next';
import CustomerInterestTable from './_components/CustomerInterestTable';

export const dynamic = 'force-dynamic';

const CustomerInterestPage = async ({ searchParams }: SearchParams) => {
  const params = await cleanSearchParams(searchParams);

  const res = await getCustomerInterestStats({
    ...params,
    cache: 'no-store',
  } as any);

  if (res && !res.success) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-500">
        <p className="font-semibold">Error loading data: {res.message}</p>
        <p className="mt-2 text-sm opacity-80">
          This usually means the backend endpoint is failing or not deployed
          yet.
        </p>
      </div>
    );
  }

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
