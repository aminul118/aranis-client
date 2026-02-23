import TableFilters from '@/components/common/table/TableFilters';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import NewUserModal from '@/components/modules/Admin/users/NewUserModal';
import UsersTable from '@/components/modules/Admin/users/UsersTable';
import cleanSearchParams from '@/lib/cleanSearchParams';
import { getUsers } from '@/services/user/users';
import { SearchParams } from '@/types/react.types';

import { Metadata } from 'next';

const UsersPage = async ({ searchParams }: SearchParams) => {
  const params = await cleanSearchParams(searchParams);
  const { data, meta } = await getUsers(params);

  return (
    <>
      <ClientTableWrapper
        tableTitle="All Registered Users"
        meta={meta}
        action={<NewUserModal />}
      >
        <TableFilters />
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
