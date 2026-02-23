'use client';

import TableManageMent from '@/components/common/table/TableManageMent';
import CategoriesColumn from './CategoriesColumn';
import { ICategory } from '@/services/category/category';

const CategoriesTable = ({ categories }: { categories: ICategory[] }) => {
    return (
        <TableManageMent
            columns={CategoriesColumn}
            data={categories || []}
            getRowKey={(c) => c._id as string}
            emptyMessage="No category found"
        />
    );
};

export default CategoriesTable;
