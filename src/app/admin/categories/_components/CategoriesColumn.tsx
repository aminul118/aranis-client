import { Column } from '@/components/common/table/TableManageMent';
import { ICategory } from '@/services/category/category';
import CategoryActions from './CategoryActions';

const CategoriesColumn: Column<ICategory>[] = [
  {
    header: 'SI',
    accessor: (_, __, globalIndex) => globalIndex,
  },
  {
    header: 'Name',
    accessor: (c) => <span className="font-semibold">{c.name}</span>,
    sortKey: 'name',
  },
  {
    header: 'Sub Categories',
    accessor: (c) => {
      const titles = c.subCategories?.map((s) => s.title).filter(Boolean);
      return titles?.length ? titles.join(', ') : '-';
    },
  },
  {
    header: 'Types',
    accessor: (c) => {
      const allTypes = c.subCategories
        ?.flatMap((s) => s.items || [])
        .filter(Boolean);
      return allTypes?.length ? allTypes.join(', ') : '-';
    },
  },
  {
    header: 'Actions',
    accessor: (c) => <CategoryActions category={c} />,
  },
];

export default CategoriesColumn;
