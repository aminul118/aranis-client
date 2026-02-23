'use client';

import TableManageMent from '@/components/common/table/TableManageMent';
import { IInvoice } from '@/types';
import InvoiceTableColumn from './InvoiceTableColumn';

interface Props {
  invoice: IInvoice[];
}

const InvoiceTable = ({ invoice }: Props) => {
  console.log(invoice);
  return (
    <>
      <TableManageMent
        columns={InvoiceTableColumn}
        data={invoice}
        getRowKey={(i) => i._id!}
        emptyMessage="No invoice found"
      />
    </>
  );
};

export default InvoiceTable;
