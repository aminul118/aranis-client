import TableSkeleton from '@/components/common/loader/TableSkeleton';

const UserPageLoading = () => {
  return <TableSkeleton rows={10} hasFilter hasPagination />;
};

export default UserPageLoading;
