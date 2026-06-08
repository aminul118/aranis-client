'use client';

import TableFilters from '@/components/common/table/TableFilters';
import TableManageMent from '@/components/common/table/TableManageMent';
import { ICustomerInterestItem } from '@/services/customer-interest/customer-interest';
import CustomerInterestColumn from './CustomerInterestColumn';

const CustomerInterestTable = ({ data }: { data: ICustomerInterestItem[] }) => {
  return (
    <div className="space-y-4">
      <TableFilters searchPlaceholder="Search by product Name" />
      <TableManageMent
        columns={CustomerInterestColumn}
        data={data}
        getRowKey={(p) => p._id as string}
        emptyMessage="No customer interest records found."
      />
    </div>
  );
};

export default CustomerInterestTable;
