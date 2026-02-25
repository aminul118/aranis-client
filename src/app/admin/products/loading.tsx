'use client';

import TableSkeleton from '@/components/common/loader/TableSkeleton';

const ProductsLoading = () => {
  return (
    <TableSkeleton
      hasFilter
      hasPagination
      tableColumns={[
        { width: '48', height: '10' }, // Product (Img + Text)
        { width: '24', height: '4' }, // Price
        { width: '20', height: '6', rounded: 'rounded-full' }, // Stock Badge
        { width: '16', height: '4' }, // Rating
        { width: '12', height: '4' }, // Sold
        { width: '16', height: '6', rounded: 'rounded-full' }, // Featured
        { width: '20', height: '8' }, // Actions
      ]}
    />
  );
};

export default ProductsLoading;
