'use client';

import TableSkeleton from '@/components/common/loader/TableSkeleton';

const OrdersLoading = () => {
  return (
    <TableSkeleton
      hasFilter
      hasPagination
      tableColumns={[
        { width: '24', height: '4' }, // Order Number
        { width: '32', height: '4' }, // Date
        { width: '20', height: '6', rounded: 'rounded-full' }, // Status
        { width: '40', height: '4' }, // Customer
        { width: '24', height: '4' }, // Total
        { width: '16', height: '8' }, // Actions
      ]}
    />
  );
};

export default OrdersLoading;
