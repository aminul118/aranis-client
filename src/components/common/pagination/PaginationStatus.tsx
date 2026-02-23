'use client';

import { cn } from '@/lib/utils';
import { IMeta } from '@/types';
import { useSearchParams } from 'next/navigation';

interface PaginationStatusProps {
  meta: IMeta;
  className?: string;
}

const PaginationStatus = ({ meta, className }: PaginationStatusProps) => {
  const searchParams = useSearchParams();

  // Always cast query params to numbers
  const limit = Number(searchParams.get('limit') || 10);
  const page = Number(searchParams.get('page') || 1);

  // Calculate item ranges
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, meta.total);

  if (meta.totalPage <= 1) return null;

  return (
    <p className={cn('hidden text-sm whitespace-nowrap lg:block', className)}>
      Showing <span className="font-medium">{start}</span> – <span>{end}</span>{' '}
      of <span>{meta.total}</span> results ( Page <span>{meta.page}</span> of
      <span> {meta.totalPage} </span>)
    </p>
  );
};

export default PaginationStatus;
