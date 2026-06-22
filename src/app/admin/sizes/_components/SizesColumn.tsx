import { Column } from '@/components/common/table/TableManageMent';
import type { ISize } from '@/services/size/size.interface';
import SizeActions from './SizeActions';

const SizesColumn: Column<ISize>[] = [
  {
    header: 'Order',
    accessor: (c) => c.order || 0,
    sortKey: '-order',
  },
  {
    header: 'Name',
    accessor: (c) => (
      <div className="flex items-center gap-2 font-semibold">{c.name}</div>
    ),
    sortKey: 'name',
  },

  {
    header: 'Actions',
    accessor: (c) => <SizeActions size={c} />,
  },
];

export default SizesColumn;
