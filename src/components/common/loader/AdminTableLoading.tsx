'use client';

import TableSkeleton from '@/components/common/loader/TableSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminTableLoadingProps {
  title?: string;
  description?: string;
  columns?: number;
  rows?: number;
  hasAction?: boolean;
}

const AdminTableLoading = ({
  columns = 5,
  rows = 10,
  hasAction = true,
}: AdminTableLoadingProps) => {
  return (
    <section className="relative mx-auto w-11/12 py-8">
      {/* Header Skeleton */}
      <div className="mb-12 flex justify-between gap-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64 bg-white/5" />
          <Skeleton className="h-4 w-96 bg-white/5 opacity-50" />
        </div>
        {hasAction && <Skeleton className="h-10 w-32 rounded-xl bg-white/5" />}
      </div>

      {/* Table Skeleton */}
      <TableSkeleton
        columns={columns}
        rows={rows}
        className="!m-0 w-full !p-0"
      />

      {/* Pagination Skeleton */}
      <div className="mt-8 flex items-center justify-between">
        <Skeleton className="h-10 w-40 bg-white/5" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10 rounded-md bg-white/5" />
          <Skeleton className="h-10 w-10 rounded-md bg-white/5" />
          <Skeleton className="h-10 w-10 rounded-md bg-white/5" />
        </div>
      </div>
    </section>
  );
};

export default AdminTableLoading;
