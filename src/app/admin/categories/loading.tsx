'use client';

import TableSkeleton from '@/components/common/loader/TableSkeleton';

const CategoriesLoading = () => {
  return (
    <TableSkeleton
      hasFilter
      tableColumns={[
        { width: '40', height: '10' }, // Category Name/Img
        { width: '48', height: '4' }, // Description
        { width: '20', height: '4' }, // Subcategories
        { width: '12', height: '8' }, // Actions
      ]}
    />
  );
};

export default CategoriesLoading;
