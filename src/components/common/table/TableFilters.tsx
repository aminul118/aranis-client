'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { Filter, Search, XIcon } from 'lucide-react';
import { ReactNode, useState } from 'react';
import RefreshButton from '../button/refresh-button';
import ClearAllFilter from '../filtering/ClearAllFilter';
import PageLimit from '../pagination/PageLimit';
import SearchFilter from '../searching/SearchFilter';
import Sorting, { SortOption } from '../sorting/Sorting';

interface IProps {
  children?: ReactNode;
  sortOptions?: SortOption[];
  pageNumbers?: number[];
}

const TableFilters = ({
  children,
  sortOptions,
  pageNumbers = [10, 20, 30, 40],
}: IProps) => {
  const isMobile = useIsMobile();
  const [showSearch, setShowSearch] = useState(false);

  if (isMobile) {
    return (
      <div className="pb-8">
        <div className="flex items-center justify-between gap-2">
          {showSearch ? (
            <div className="flex w-full items-center gap-2">
              <div className="flex-1">
                <SearchFilter className="w-full" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(false)}
                className="shrink-0"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <RefreshButton
                  variant="outline"
                  size="icon"
                  showLabel={false}
                />
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 px-3">
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-6 px-4 py-6">
                      <Sorting sortOptions={sortOptions} />
                      <PageLimit pageNumbers={pageNumbers} />
                      <ClearAllFilter />
                      {children}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SearchFilter />
        <div className="flex flex-wrap items-center justify-end gap-2">
          <PageLimit pageNumbers={pageNumbers} />
          <Sorting sortOptions={sortOptions} />
          <ClearAllFilter />
          <RefreshButton />
          {children}
        </div>
      </div>
    </div>
  );
};

export default TableFilters;
