import { Column } from '@/components/common/table/TableManageMent';
import { INavItem } from '@/services/navbar/navbar';
import NavbarActions from './NavbarActions';

const NavbarColumn: Column<INavItem>[] = [
    {
        header: 'SI',
        accessor: (_, i) => i + 1,
    },
    {
        header: 'Title',
        accessor: (n) => <span className="font-semibold">{n.title}</span>,
    },
    {
        header: 'Href',
        accessor: (n) => n.href,
    },
    {
        header: 'Sub Items',
        accessor: (n) => n.subItems?.map(s => s.title).join(', ') || 'None',
    },
    {
        header: 'Order',
        accessor: (n) => n.order,
    },
    {
        header: 'Actions',
        accessor: (n) => <NavbarActions navbar={n} />,
    },
];

export default NavbarColumn;
