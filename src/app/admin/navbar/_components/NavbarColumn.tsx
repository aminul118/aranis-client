import { Column } from '@/components/common/table/TableManageMent';
import type { INavItem } from '@/services/navbar/navbar.interface';
import NavbarActions from './NavbarActions';

const NavbarColumn: Column<INavItem>[] = [
  {
    header: 'Order',
    accessor: (n) => n.order,
    sortKey: 'order',
  },

  {
    header: 'Title',
    accessor: (n) => <span className="font-semibold">{n.title}</span>,
    sortKey: 'title',
  },
  {
    header: 'Href',
    accessor: (n) => n.href,
    sortKey: 'href',
  },
  {
    header: 'Sub Items',
    accessor: (n) => n.subItems?.map((s) => s.title).join(', ') || '-',
  },

  {
    header: 'Actions',
    accessor: (n) => <NavbarActions navbar={n} />,
  },
];

export default NavbarColumn;
