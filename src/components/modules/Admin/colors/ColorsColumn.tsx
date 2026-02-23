import { Column } from '@/components/common/table/TableManageMent';
import { IColor } from '@/services/color/color';
import ColorActions from './ColorActions';

const ColorsColumn: Column<IColor>[] = [
    {
        header: 'SI',
        accessor: (_, i) => i + 1,
    },
    {
        header: 'Name',
        accessor: (c) => <div className="flex items-center gap-2 font-semibold">
            {c.hex && <div className="h-4 w-4 rounded-full border border-white/10" style={{ backgroundColor: c.hex }} />}
            {c.name}
        </div>,
    },
    {
        header: 'Hex Code',
        accessor: (c) => c.hex || 'N/A',
    },
    {
        header: 'Actions',
        accessor: (c) => <ColorActions color={c} />,
    },
];

export default ColorsColumn;
