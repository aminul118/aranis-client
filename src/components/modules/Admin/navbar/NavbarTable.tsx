'use client';

import TableManageMent from '@/components/common/table/TableManageMent';
import { INavItem } from '@/services/navbar/navbar';
import NavbarColumn from './NavbarColumn';

const NavbarTable = ({ navbars }: { navbars: INavItem[] }) => {
    return (
        <TableManageMent
            columns={NavbarColumn}
            data={navbars || []}
            getRowKey={(n) => n._id as string}
            emptyMessage="No navbar item found"
        />
    );
};

export default NavbarTable;
