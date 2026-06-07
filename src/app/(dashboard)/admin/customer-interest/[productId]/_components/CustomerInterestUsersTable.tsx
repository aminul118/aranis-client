'use client';

import TableFilters from '@/components/common/table/TableFilters';
import TableManageMent from '@/components/common/table/TableManageMent';
import { IProductInterestUser } from '@/services/customer-interest/customer-interest';
import CustomerInterestUsersColumn from './CustomerInterestUsersColumn';

interface Props {
  data: IProductInterestUser[];
}

const CustomerInterestUsersTable = ({ data }: Props) => {
  return (
    <div className="space-y-4">
      <TableFilters />
      <TableManageMent
        columns={CustomerInterestUsersColumn}
        data={data}
        getRowKey={(u) => u._id as string}
        emptyMessage="No interested users found."
      />
    </div>
  );
};

export default CustomerInterestUsersTable;
