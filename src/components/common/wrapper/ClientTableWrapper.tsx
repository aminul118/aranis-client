'use client';

import GradientTitle from '@/components/ui/gradientTitle';
import { TransitionContext } from '@/context/useTransition';
import { cn } from '@/lib/utils';
import { IMeta } from '@/types';
import NProgress from 'nprogress';
import { ReactNode, useEffect, useState, useTransition } from 'react';
import TablePagination from '../table/TablePagination';

// Configure NProgress
NProgress.configure({ showSpinner: false });

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
}: Props) => {
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  useEffect(() => {
    if (isPending) {
      NProgress.start();
    } else {
      NProgress.done();
      setPendingAction(null); // Clear action when finished
    }
  }, [isPending]);

  return (
    <TransitionContext.Provider
      value={{ startTransition, isPending, pendingAction, setPendingAction }}
    >
      <section className={cn('relative mx-auto w-11/12 py-8', className)}>
        <div className="flex justify-between gap-4">
          <div className="mb-8 flex justify-start">
            <GradientTitle
              title={tableTitle}
              description={description}
              className="text-left"
            />
          </div>
          {action}
        </div>
        <>{filters}</>
        <div className="relative">{children}</div>

        {/* Pagination */}
        {meta && <TablePagination meta={meta} />}
      </section>
    </TransitionContext.Provider>
  );
};

export default ClientTableWrapper;
