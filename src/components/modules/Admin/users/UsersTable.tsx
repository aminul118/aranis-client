'use client';

import TableManageMent from '@/components/common/table/TableManageMent';
import { IUser } from '@/types/api.types';
import UsersColumn from './UsersColumn';

const UsersTable = ({ users }: { users: IUser[] }) => {
  return (
    <TableManageMent
      columns={UsersColumn}
      data={users}
      getRowKey={(u) => u._id}
    />
  );
};

export default UsersTable;
