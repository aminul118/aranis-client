'use client';

import TableSkeleton from '@/components/common/loader/TableSkeleton';

const UsersLoading = () => {
  return (
    <TableSkeleton
      hasFilter
      hasPagination
      tableColumns={[
        { width: '40', height: '10' }, // User (Img + Info)
        { width: '48', height: '4' }, // Email
        { width: '20', height: '4' }, // Role
        { width: '16', height: '6', rounded: 'rounded-full' }, // Status
        { width: '24', height: '4' }, // Joined Date
        { width: '12', height: '8' }, // Actions
      ]}
    />
  );
};

export default UsersLoading;
