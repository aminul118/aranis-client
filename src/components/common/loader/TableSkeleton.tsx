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

interface ColumnConfig {
  width?: string;
  height?: string;
  rounded?: string;
}

interface TableSkeletonProps {
  tableColumns?: ColumnConfig[];
  rows?: number;
  hasFilter?: boolean;
  hasPagination?: boolean;
  filterColumns?: ColumnConfig[];
  className?: string;
}

const TableSkeleton = ({
  tableColumns = [
    { width: '6', height: '4' },
    { width: '10', height: '10', rounded: 'rounded-full' },
    { width: '24', height: '4' },
    { width: '40', height: '4' },
    { width: '16', height: '4' },
    { width: '20', height: '6', rounded: 'rounded-md' },
    { width: '28', height: '4' },
    { width: '8', height: '8', rounded: 'rounded-md' },
  ],
  filterColumns = [
    { width: '20', height: '10' },
    { width: '32', height: '10' },
    { width: '20', height: '10' },
    { width: '20', height: '10' },
  ],
  rows = 10,
  hasFilter = false,
  hasPagination = false,
  className,
}: TableSkeletonProps) => {
  return (
    <section
      className={cn('mx-auto w-11/12 overflow-x-hidden py-8', className)}
    >
      {/* Title */}
      <Skeleton className="mb-8 h-10 w-96 rounded-md" />

      {/* -------- FILTERS -------- */}
      {hasFilter && <Filters filterColumns={filterColumns} />}

      {/* -------- TABLE -------- */}
      <Table>
        {/* Header */}
        <TableHeader className="bg-muted">
          <TableRow>
            {tableColumns.map((col, idx) => (
              <TableHead key={idx}>
                <Skeleton
                  className={`h-${col.height || '4'} w-${
                    col.width || '20'
                  } ${col.rounded ?? 'rounded-md'}`}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* Body */}
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {tableColumns.map((col, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton
                    className={`h-${col.height || '4'} w-${
                      col.width || '20'
                    } ${col.rounded ?? 'rounded-md'}`}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* -------- PAGINATION -------- */}
      {hasPagination && <PaginationSkeleton />}
    </section>
  );
};

/* ---------------- Filters ---------------- */
const Filters = ({ filterColumns }: { filterColumns: ColumnConfig[] }) => {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
      {/* Search */}
      <Skeleton className="h-10 w-64 rounded-md" />

      {/* Right actions */}
      <div className="flex flex-wrap items-center gap-2">
        {filterColumns.map((col, index) => (
          <Skeleton
            key={index}
            className={`h-${col.height || '10'} w-${
              col.width || '20'
            } ${col.rounded ?? 'rounded-md'}`}
          />
        ))}
      </div>
    </div>
  );
};

/* ---------------- PAGINATION ---------------- */
const PaginationSkeleton = () => {
  return (
    <div className="mt-4 flex flex-col items-center gap-4 lg:flex-row lg:justify-between">
      <Skeleton className="h-10 w-40 rounded-md" />

      <div className="flex items-center gap-4">
        <Skeleton className="h-5 w-32 rounded-md" />

        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;
