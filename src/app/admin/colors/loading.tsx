'use client';

import TableSkeleton from '@/components/common/loader/TableSkeleton';

const ColorsLoading = () => {
  return (
    <TableSkeleton
      hasFilter
      tableColumns={[
        { width: '20', height: '10', rounded: 'rounded-full' }, // Color Circle
        { width: '40', height: '4' }, // Name
        { width: '32', height: '4' }, // Hex Code
        { width: '12', height: '8' }, // Actions
      ]}
    />
  );
};

export default ColorsLoading;
