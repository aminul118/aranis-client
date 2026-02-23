import { Column } from '@/components/common/table/TableManageMent';
import { ICategory } from '@/services/category/category';
import CategoryActions from './CategoryActions';

const CategoriesColumn: Column<ICategory>[] = [
    {
        header: 'SI',
        accessor: (_, i) => i + 1,
    },
    {
        header: 'Name',
        accessor: (c) => <span className="font-semibold">{c.name}</span>,
    },
    {
        header: 'Sub Categories',
        accessor: (c) => c.subCategories?.map(s => s.title).join(', ') || 'N/A',
    },
    {
        header: 'Colors',
        accessor: (c) => c.colors?.join(', ') || 'N/A',
    },
    {
        header: 'Actions',
        accessor: (c) => <CategoryActions category={c} />,
    },
];

export default CategoriesColumn;
