import RestockRequestsTable from '@/app/(dashboard)/admin/restock-requests/_components/RestockRequestsTable';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import cleanSearchParams from '@/lib/cleanSearchParams';
import { getRestockRequests } from '@/services/restock/restock';
import { SearchParams } from '@/types';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const RestockRequestsPage = async ({ searchParams }: SearchParams) => {
  const resolvedParams = await cleanSearchParams(searchParams);
  const { data, meta } = (await getRestockRequests(resolvedParams)) as any;

  return (
    <ClientTableWrapper tableTitle="Restock Requests" meta={meta}>
      <RestockRequestsTable requests={data || []} />
    </ClientTableWrapper>
  );
};

export default RestockRequestsPage;

export const metadata: Metadata = {
  title: 'Restock Requests | Admin Portal',
};
