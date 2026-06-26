import NewUserModal from '@/app/admin/users/_components/NewUserModal';
import UsersTable from '@/app/admin/users/_components/UsersTable';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import cleanSearchParams from '@/lib/cleanSearchParams';
import { getUsers } from '@/services/user/users';
import { SearchParams } from '@/types/react.types';

import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const UsersPage = async ({ searchParams }: SearchParams) => {
  const params = await cleanSearchParams(searchParams);
  const { data, meta } = await getUsers(params, {
    cache: 'no-store',
    headers: { 'x-bypass-cache': 'true' },
  });

  return (
    <>
      <ClientTableWrapper
        tableTitle="All Registered Users"
        meta={meta}
        action={<NewUserModal />}
      >
        <UsersTable users={data} />
      </ClientTableWrapper>
    </>
  );
};

export default UsersPage;

//  SEO
export const metadata: Metadata = {
  title: 'Registered Users | SHRL',
};
