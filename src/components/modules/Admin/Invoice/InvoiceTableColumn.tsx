import DateFormat from '@/components/common/formater/date-format';
import { Column } from '@/components/common/table/TableManageMent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IInvoice } from '@/types';
import { Download } from 'lucide-react';
import Link from 'next/link';
import InvoiceActions from './InvoiceActions';

const InvoiceTableColumn: Column<IInvoice>[] = [
  {
    header: 'SI',
    accessor: (_, index) => index + 1,
  },
  {
    header: 'Company Name',
    accessor: (i) => i.payableTo.name,
  },
  {
    header: 'Invoice No',
    accessor: (i) => i.invoiceNo,
  },
  {
    header: 'Payment Status',
    accessor: (i) => {
      const status = i.status;

      if (status === 'PAID') {
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Paid
          </Badge>
        );
      }

      if (status === 'UNPAID') {
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            Unpaid
          </Badge>
        );
      }

      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          Pending
        </Badge>
      );
    },
  },

  {
    header: 'Download',
    accessor: (i) => (
      <Button variant="outline">
        <Link target="_blank" href={i.pdfUrl!}>
          <Download />
        </Link>
      </Button>
    ),
  },
  {
    header: 'Date & Time',
    accessor: (i) => <DateFormat date={i.createdAt!} />,
  },
  {
    header: 'Actions',
    accessor: (i) => <InvoiceActions invoice={i} />,
  },
];

export default InvoiceTableColumn;
