'use client';

import TableManageMent from '@/components/common/table/TableManageMent';
import { IColor } from '@/services/color/color';
import ColorsColumn from './ColorsColumn';

const ColorsTable = ({ colors }: { colors: IColor[] }) => {
    return (
        <TableManageMent
            columns={ColorsColumn}
            data={colors || []}
            getRowKey={(c) => c._id as string}
            emptyMessage="No color found"
        />
    );
};

export default ColorsTable;
