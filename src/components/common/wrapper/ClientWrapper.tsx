'use client';

import AppPagination from '@/components/common/pagination/AppPagination';
import { TransitionContext } from '@/context/useTransition';
import { cn } from '@/lib/utils';
import { IMeta } from '@/types';
import { ReactNode, useTransition } from 'react';
import CenterSpinner from '../loader/CenterSpinner';

interface Props {
  children: ReactNode;
  meta?: IMeta;
  loader?: ReactNode;
}

const ClientWrapper = ({
  children,
  meta,
  loader = <CenterSpinner />,
}: Props) => {
  const [isPending, startTransition] = useTransition();

  return (
    <TransitionContext.Provider value={{ isPending, startTransition }}>
      <section className="relative">
        {/* Content */}
        <div className="relative">
          <div className={cn(isPending && 'opacity-20')}>{children}</div>

          {isPending && (
            <div className="absolute inset-0 z-50 flex items-center justify-center">
              {loader}
            </div>
          )}
        </div>

        {/* Pagination */}
        {meta && (
          <div
            className={cn(
              'mt-4',
              isPending && 'pointer-events-none opacity-50',
            )}
          >
            <AppPagination meta={meta} />
          </div>
        )}
      </section>
    </TransitionContext.Provider>
  );
};

export default ClientWrapper;
