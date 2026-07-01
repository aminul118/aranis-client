import { Column } from '@/components/common/table/TableManageMent';
import type { ICategory } from '@/services/category/category.interface';
import CategoryActions from './CategoryActions';

const CategoriesColumn: Column<ICategory>[] = [
  {
    header: 'SI',
    accessor: (_, __, globalIndex) => globalIndex,
  },
  {
    header: 'Name',
    accessor: (c: ICategory) => <span className="font-semibold">{c.name}</span>,
    sortKey: 'name',
  },
  {
    header: 'Sub Categories',
    accessor: (c: ICategory) => {
      const titles = c.subCategories?.map((s) => s.title).filter(Boolean);
      return titles?.length ? titles.join(', ') : '-';
    },
  },
  {
    header: 'Category Types',
    accessor: (c: ICategory) => {
      const allTypes = c.subCategories
        ?.flatMap((s) => s.items || [])
        .filter(Boolean);
      return allTypes?.length ? allTypes.join(', ') : '-';
    },
  },
  {
    header: 'Actions',
    accessor: (c: ICategory) => <CategoryActions category={c} />,
  },
];

export default CategoriesColumn;
