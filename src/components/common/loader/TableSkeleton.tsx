'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
  hasSelection?: boolean;
  hasActions?: boolean;
  className?: string;
}

const TableSkeleton = ({
  columns = 5,
  rows = 5,
  hasSelection = true,
  hasActions = true,
  className,
}: TableSkeletonProps) => {
  return (
    <div className={cn('w-full space-y-4', className)}>
      <div className="border-border/50 bg-card/50 overflow-hidden rounded-xl border shadow-sm backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {hasSelection && (
                <TableHead className="w-[40px] px-4">
                  <Skeleton className="h-4 w-4 rounded" />
                </TableHead>
              )}
              {Array.from({ length: columns }).map((_, idx) => (
                <TableHead key={idx}>
                  <Skeleton className="h-4 w-24 rounded" />
                </TableHead>
              ))}
              {hasActions && (
                <TableHead className="w-[70px] text-center">
                  <Skeleton className="mx-auto h-4 w-12 rounded" />
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow key={rowIndex} className="border-border/50">
                {hasSelection && (
                  <TableCell className="w-[40px] px-4">
                    <Skeleton className="h-4 w-4 rounded" />
                  </TableCell>
                )}
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton
                      className={cn(
                        'h-4 rounded',
                        rowIndex % 2 === 0 ? 'w-24' : 'w-32',
                      )}
                    />
                  </TableCell>
                ))}
                {hasActions && (
                  <TableCell className="text-center">
                    <Skeleton className="mx-auto h-8 w-8 rounded-full" />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TableSkeleton;
