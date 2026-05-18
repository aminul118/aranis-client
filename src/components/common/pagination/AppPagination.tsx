'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
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

  const getPaginationItems = () => {
    const items: (number | 'ellipsis')[] = [];
    const delta = 1; // Number of pages to show on each side of the current page

    for (let i = 1; i <= totalPage; i++) {
      if (
        i === 1 || // Always show first page
        i === totalPage || // Always show last page
        (i >= page - delta && i <= page + delta) // Show pages around current page
      ) {
        items.push(i);
      } else if (
        (i === page - delta - 1 && i > 1) ||
        (i === page + delta + 1 && i < totalPage)
      ) {
        items.push('ellipsis');
      }
    }

    // Filter out consecutive ellipses (shouldn't happen with above logic but just in case)
    return items.filter((item, index) => {
      if (item === 'ellipsis' && items[index - 1] === 'ellipsis') return false;
      return true;
    });
  };

  const paginationItems = getPaginationItems();

  return (
    <Pagination className={cn('py-4', className)}>
      <PaginationContent className="gap-2">
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            className={cn(
              (page <= 1 || isPending) && 'pointer-events-none opacity-50',
              'h-10 cursor-pointer rounded-full border-none px-4 font-bold transition-all duration-300',
              'bg-black/[0.03] text-zinc-700 hover:bg-black/[0.06] hover:text-zinc-900 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:bg-white/[0.07] dark:hover:text-white',
            )}
            onClick={() => page > 1 && handlePageChange(page - 1)}
            aria-disabled={page <= 1 || isPending}
          />
        </PaginationItem>

        {/* Pages */}
        {paginationItems.map((item, index) => (
          <PaginationItem key={index}>
            {item === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={item === page}
                onClick={() => handlePageChange(item as number)}
                className={cn(
                  isPending && 'pointer-events-none',
                  'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none! font-bold transition-all duration-300',
                  item === page
                    ? 'bg-zinc-900 font-extrabold text-white shadow-md hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100'
                    : 'bg-transparent text-zinc-500 hover:bg-black/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white',
                )}
              >
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            className={cn(
              (page >= totalPage || isPending) &&
                'pointer-events-none opacity-50',
              'h-10 cursor-pointer rounded-full border-none px-4 font-bold transition-all duration-300',
              'bg-black/[0.03] text-zinc-700 hover:bg-black/[0.06] hover:text-zinc-900 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:bg-white/[0.07] dark:hover:text-white',
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
