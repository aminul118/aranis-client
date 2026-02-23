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
import { Edit, Eye, Loader2, MoreHorizontal, Trash } from 'lucide-react';
import { ReactNode } from 'react';

/* =======================
   Column Type
======================= */
export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T, index: number) => ReactNode);
  className?: string;
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
}

/* =======================
   Component
======================= */
function TableManageMent<T>({
  data,
  columns,
  getRowKey,
  onView,
  onEdit,
  onDelete,
  emptyMessage = 'No records found.',
  isRefreshing = false,
}: TableManageMentProps<T>) {
  const hasActions = Boolean(onView || onEdit || onDelete);

  /*  SAFETY: always work with array */
  const safeData: T[] = Array.isArray(data) ? data : [];

  return (
    <section>
      <div className="relative rounded-lg">
        {/* ===== Refresh Overlay ===== */}
        {isRefreshing && (
          <div className="bg-background/50 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="text-primary h-6 w-6 animate-spin" />
              <p className="text-muted-foreground text-sm">Refreshing...</p>
            </div>
          </div>
        )}

        <Table>
          {/* ===== Header ===== */}
          <TableHeader>
            <TableRow className="bg-muted">
              {columns.map((column, index) => (
                <TableHead key={index} className={column.className}>
                  {column.header}
                </TableHead>
              ))}

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
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="text-muted-foreground py-8 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              safeData.map((item, rowIndex) => (
                <TableRow key={getRowKey(item)}>
                  {columns.map((col, colIndex) => (
                    <TableCell key={colIndex} className={col.className}>
                      {typeof col.accessor === 'function'
                        ? col.accessor(item, rowIndex)
                        : String(item[col.accessor] ?? '')}
                    </TableCell>
                  ))}

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
