'use client';

import GradientTitle from '@/components/ui/gradientTitle';
import { TransitionContext } from '@/context/useTransition';
import { cn } from '@/lib/utils';
import { IMeta } from '@/types';
import { ReactNode, useTransition } from 'react';
import CenterSpinner from '../loader/CenterSpinner';
import TablePagination from '../table/TablePagination';

interface Props {
  tableTitle: string;
  description?: string;
  filters?: ReactNode;
  children: ReactNode;
  meta?: IMeta;
  className?: string;
  loader?: ReactNode;
  action?: ReactNode;
}

const ClientTableWrapper = ({
  action,
  tableTitle,
  description,
  filters,
  children,
  meta,
  className,
  loader = <CenterSpinner />,
}: Props) => {
  const [isPending, startTransition] = useTransition();

  return (
    <TransitionContext.Provider value={{ startTransition, isPending }}>
      <section className={cn('relative mx-auto w-11/12 py-8', className)}>
        <div className="flex justify-between gap-6">
          <div className="mb-12 flex justify-start">
            <GradientTitle title={tableTitle} description={description} />
          </div>
          {action}
        </div>
        <>{filters}</>
        <div className="relative">
          <div className={cn(isPending && 'opacity-20')}>{children}</div>

          {/* Centered Loader OVER content */}
          {isPending && (
            <div className="absolute inset-0 z-50 flex items-center justify-center">
              {loader}
            </div>
          )}
        </div>

        {/* Pagination */}
        {meta && <TablePagination meta={meta} />}
      </section>
    </TransitionContext.Provider>
  );
};

export default ClientTableWrapper;
