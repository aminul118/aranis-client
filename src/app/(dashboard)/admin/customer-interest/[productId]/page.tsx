import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import { getProductInterestUsers } from '@/services/customer-interest/customer-interest';
import { Metadata } from 'next';
import CustomerInterestUsersTable from './_components/CustomerInterestUsersTable';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductInterestUsersPage({ params }: PageProps) {
  const { productId } = await params;

  const res = await getProductInterestUsers(productId);

  return (
    <div className="flex flex-col gap-6 p-6">
      <ClientTableWrapper tableTitle="Interested Users">
        <CustomerInterestUsersTable data={res?.data || []} />
      </ClientTableWrapper>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Interested Users | Admin Portal',
};
