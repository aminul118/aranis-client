'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTransition } from '@/context/useTransition';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Edit,
  Eye,
  MoreHorizontal,
  Trash,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReactNode } from 'react';
import TableLoader from '../loader/TableLoader';

/* =======================
   Column Type
======================= */
export interface Column<T> {
  header: string;
  accessor:
    | keyof T
    | ((row: T, index: number, globalIndex: number) => ReactNode);
  className?: string;
  sortKey?: string;
}

/* =======================
   Props Type
======================= */
interface TableManageMentProps<T> {
  data?: T[] | unknown; // 👈 unknown added for safety
  columns: Column<T>[];
  getRowKey: (row: T) => string;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  emptyMessage?: string;
  isRefreshing?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  page?: number;
  limit?: number;
}

/* =======================
   Component
======================= */
function TableManageMent<T>(props: TableManageMentProps<T>) {
  const {
    data,
    columns,
    getRowKey,
    onView,
    onEdit,
    onDelete,
    emptyMessage = 'No records found.',
    isRefreshing = false,
    selectedIds = [],
    onSelectionChange,
  } = props;

  const router = useRouter();
  const searchParams = useSearchParams();
  const { isPending, startTransition, pendingAction, setPendingAction } =
    useTransition();

  const page = props.page ?? (Number(searchParams.get('page')) || 1);
  const limit = props.limit ?? (Number(searchParams.get('limit')) || 10);

  const hasActions = Boolean(onView || onEdit || onDelete);

  const handleSort = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentSort = params.get('sort');

    let newSort = key;
    if (currentSort === key) {
      newSort = `-${key}`;
    } else if (currentSort === `-${key}`) {
      newSort = '';
    }

    if (newSort) {
      params.set('sort', newSort);
    } else {
      params.delete('sort');
    }
    params.set('page', '1');

    setPendingAction('Sorting');
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const getSortIcon = (key: string) => {
    const currentSort = searchParams.get('sort');
    if (currentSort === key) return <ArrowUp className="ml-1 h-3 w-3" />;
    if (currentSort === `-${key}`)
      return <ArrowDown className="ml-1 h-3 w-3" />;
    return <ArrowUpDown className="ml-1 h-3 w-3 opacity-30" />;
  };

  /*  SAFETY: always work with array */
  const safeData: T[] = Array.isArray(data) ? data : [];

  const isLoading = isRefreshing || isPending;

  return (
    <section>
      <div className="border-border/50 bg-card/50 relative overflow-hidden rounded-xl border shadow-sm backdrop-blur-sm transition-all duration-500">
        {/* Loading Progress Bar */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              initial={{ width: '0%', opacity: 0 }}
              animate={{ width: '100%', opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 right-0 left-0 z-60 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-500"
            />
          )}
        </AnimatePresence>

        {/* ===== Loading Overlay ===== */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute top-[48px] right-0 bottom-0 left-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm dark:bg-black/40"
            >
              <TableLoader
                text={isRefreshing ? 'Refreshing' : pendingAction || 'Syncing'}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Table
          className={cn(
            'transition-all duration-500 ease-in-out',
            isLoading && 'pointer-events-none',
          )}
        >
          {/* ... rest of the table ... */}
          {/* ===== Header ===== */}
          <TableHeader>
            <TableRow className="bg-muted">
              {onSelectionChange && (
                <TableHead className="w-[40px] px-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                    checked={
                      safeData.length > 0 &&
                      selectedIds.length === safeData.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        onSelectionChange(
                          safeData.map((item) => getRowKey(item)),
                        );
                      } else {
                        onSelectionChange([]);
                      }
                    }}
                  />
                </TableHead>
              )}
              {columns.map((column, index) => {
                const sortKey =
                  column.sortKey ||
                  (typeof column.accessor === 'string'
                    ? (column.accessor as string)
                    : undefined);

                return (
                  <TableHead
                    key={index}
                    className={cn(
                      column.className,
                      sortKey &&
                        'hover:text-foreground cursor-pointer transition-colors select-none hover:bg-black/5 dark:hover:bg-white/5',
                    )}
                    onClick={() => sortKey && handleSort(sortKey)}
                  >
                    <div className="flex items-center gap-1">
                      {column.header}
                      {sortKey && (
                        <div className="flex shrink-0 items-center">
                          {getSortIcon(sortKey)}
                        </div>
                      )}
                    </div>
                  </TableHead>
                );
              })}

              {hasActions && (
                <TableHead className="w-[70px] text-center">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>

          {/* ===== Body ===== */}
          <TableBody>
            {safeData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (hasActions ? 1 : 0) +
                    (onSelectionChange ? 1 : 0)
                  }
                  className="text-muted-foreground py-8 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              safeData.map((item, rowIndex) => (
                <TableRow
                  key={getRowKey(item)}
                  className={
                    selectedIds.includes(getRowKey(item)) ? 'bg-blue-50/30' : ''
                  }
                >
                  {onSelectionChange && (
                    <TableCell className="w-[40px] px-4">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                        checked={selectedIds.includes(getRowKey(item))}
                        onChange={(e) => {
                          const id = getRowKey(item);
                          if (e.target.checked) {
                            onSelectionChange([...selectedIds, id]);
                          } else {
                            onSelectionChange(
                              selectedIds.filter((sid) => sid !== id),
                            );
                          }
                        }}
                      />
                    </TableCell>
                  )}
                  {columns.map((col, colIndex) => {
                    const globalIndex = (page - 1) * limit + rowIndex + 1;
                    return (
                      <TableCell key={colIndex} className={col.className}>
                        {typeof col.accessor === 'function'
                          ? col.accessor(item, rowIndex, globalIndex)
                          : String(item[col.accessor] ?? '')}
                      </TableCell>
                    );
                  })}

                  {hasActions && (
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          {onView && (
                            <DropdownMenuItem onClick={() => onView(item)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                          )}

                          {onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(item)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          )}

                          {onDelete && (
                            <DropdownMenuItem
                              onClick={() => onDelete(item)}
                              className="text-destructive"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

export default TableManageMent;
