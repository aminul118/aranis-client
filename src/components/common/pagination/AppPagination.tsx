'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useTransition } from '@/context/useTransition';
import { cn } from '@/lib/utils';
import { IMeta } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';

interface IPaginationProps {
  meta: IMeta;
  className?: string;
}

const AppPagination = ({ meta, className }: IPaginationProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { startTransition, isPending } = useTransition();

  const { page, totalPage } = meta;

  const handlePageChange = (newPage: number) => {
    if (newPage === page) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  if (totalPage <= 1) return null;

  return (
    <Pagination className={cn('py-6 md:py-8 lg:py-12', className)}>
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            className={cn(
              (page <= 1 || isPending) && 'pointer-events-none opacity-50',
            )}
            onClick={() => page > 1 && handlePageChange(page - 1)}
            aria-disabled={page <= 1 || isPending}
          />
        </PaginationItem>

        {/* Pages */}
        {Array.from({ length: totalPage }).map((_, i) => {
          const pageIndex = i + 1;

          return (
            <PaginationItem key={pageIndex}>
              <PaginationLink
                isActive={pageIndex === page}
                onClick={() => handlePageChange(pageIndex)}
                className={cn(isPending && 'pointer-events-none')}
              >
                {pageIndex}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            className={cn(
              (page >= totalPage || isPending) &&
                'pointer-events-none opacity-50',
            )}
            onClick={() => page < totalPage && handlePageChange(page + 1)}
            aria-disabled={page >= totalPage || isPending}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default AppPagination;
