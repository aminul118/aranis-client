'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { ICategory } from '@/services/category/category.interface';
import {
  FilterX,
  LayoutGrid,
  List,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { ReactNode } from 'react';

interface ShopHeaderProps {
  dbCategories: ICategory[];
  selectedCategory: string;
  selectedSubCategory: string;
  selectedType: string;
  totalItems: number;
  viewMode: 'grid' | 'list';
  sortBy: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  onUpdateURL: (params: Record<string, string | null>) => void;
  onClearAll?: () => void;
  activeFiltersNode?: ReactNode;
  children: ReactNode; // This will be the FilterSection inside the Sheet
}

const ShopHeader = ({
  dbCategories,
  selectedCategory,
  selectedSubCategory,
  selectedType,
  totalItems,
  viewMode,
  sortBy,
  isSidebarOpen,
  setIsSidebarOpen,
  onUpdateURL,
  onClearAll,
  activeFiltersNode,
  children,
}: ShopHeaderProps) => {
  return (
    <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
      <div className="flex w-full min-w-0 flex-col gap-4 lg:w-auto">
        <div className="flex w-full shrink-0 items-center justify-between lg:w-auto">
          <div>
            <h1 className="text-foreground mb-1 text-3xl font-black tracking-tighter md:text-4xl">
              {selectedCategory !== 'All'
                ? `${selectedCategory} ${selectedSubCategory} ${selectedType}`.trim()
                : 'Aranis Shop'}
            </h1>
            <p className="text-muted-foreground text-xs font-medium">
              Discover excellence ({totalItems} items)
            </p>
          </div>
        </div>
        {activeFiltersNode && (
          <div className="hidden min-w-0 flex-1 lg:block">
            {activeFiltersNode}
          </div>
        )}
      </div>

      <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row lg:w-auto lg:items-start">
        <div className="flex flex-1 items-center gap-2 sm:flex-none">
          {/* View Toggles */}
          <div className="flex !h-12 items-center gap-1 rounded-full border border-black/10 bg-white/70 p-1 shadow-sm backdrop-blur-xl transition-all dark:border-white/10 dark:bg-white/[0.03] dark:shadow-2xl">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-10 w-10 rounded-full p-0 transition-all duration-300',
                viewMode === 'grid'
                  ? 'text-primary border border-black/5 bg-white font-bold shadow-md dark:border-white/10 dark:bg-white/10 dark:text-white'
                  : 'text-zinc-500 hover:bg-black/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white',
              )}
              onClick={() => onUpdateURL({ view: 'grid' })}
              aria-label="Grid view"
            >
              <LayoutGrid size={20} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-10 w-10 rounded-full p-0 transition-all duration-300',
                viewMode === 'list'
                  ? 'text-primary border border-black/5 bg-white font-bold shadow-md dark:border-white/10 dark:bg-white/10 dark:text-white'
                  : 'text-zinc-500 hover:bg-black/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white',
              )}
              onClick={() => onUpdateURL({ view: 'list' })}
              aria-label="List view"
            >
              <List size={20} />
            </Button>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            {onClearAll && (
              <Button
                variant="outline"
                onClick={onClearAll}
                className="h-12 rounded-full border-dashed border-red-500/50 bg-red-50/50 px-5 font-bold text-red-500 shadow-sm transition-all hover:bg-red-500 hover:text-white dark:border-red-500/30 dark:bg-red-500/10 dark:hover:bg-red-500"
              >
                <FilterX className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                window.location.href = window.location.pathname;
              }}
              className="h-12 rounded-full border border-black/10 bg-white/70 px-5 font-bold text-zinc-800 shadow-sm transition-all hover:bg-black/5 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:hover:bg-white/[0.05]"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button className="h-12 flex-1 items-center justify-center gap-3 rounded-full border border-black/10 bg-white/70 px-6 font-bold text-zinc-800 shadow-sm transition-all outline-none hover:bg-white sm:flex-none lg:hidden dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:hover:bg-white/[0.05]">
                <SlidersHorizontal size={16} />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full border-white/5 bg-[#0f111a] sm:max-w-md"
            >
              <SheetHeader className="mb-6 flex flex-row items-center justify-between space-y-0 border-b border-white/5 pb-4">
                <SheetTitle className="text-left text-2xl font-black text-white">
                  Shop Filters
                </SheetTitle>
                <div className="mt-0 flex items-center gap-2">
                  {onClearAll && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        onClearAll();
                        setIsSidebarOpen(false);
                      }}
                      className="h-8 rounded-full bg-red-500/10 px-3 text-xs font-bold text-red-400 hover:bg-red-500/20 hover:text-red-300"
                    >
                      <FilterX className="mr-1.5 h-3.5 w-3.5" />
                      Clear
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      window.location.href = window.location.pathname;
                    }}
                    className="h-8 rounded-full bg-white/10 px-3 text-xs font-bold text-white hover:bg-white/20"
                  >
                    <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                    Refresh
                  </Button>
                </div>
              </SheetHeader>
              <div className="flex flex-col gap-10 overflow-y-auto pr-2 pb-32">
                {children}
              </div>
              <div className="absolute right-0 bottom-0 left-0 border-t border-white/5 bg-[#0f111a] p-6 pb-12">
                <Button
                  className="w-full rounded-2xl bg-blue-600 py-7 text-lg font-black text-white hover:bg-blue-700"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Show {totalItems} Results
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Select
            value={sortBy}
            onValueChange={(value) => onUpdateURL({ sort: value })}
          >
            <SelectTrigger
              aria-label="Sort options"
              className="!h-12 flex-1 rounded-full border border-black/10 bg-white/70 px-6 font-bold text-zinc-800 shadow-sm ring-offset-0 transition-all hover:bg-white focus:ring-0 sm:w-[200px] sm:flex-none dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:shadow-2xl dark:hover:bg-white/[0.05]"
            >
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="shadow-3xl rounded-[20px] border-black/10 bg-white text-zinc-800 backdrop-blur-xl dark:border-white/10 dark:bg-[#151722] dark:text-white">
              <SelectItem
                value="-createdAt"
                className="font-bold focus:bg-black/5 focus:text-zinc-900 dark:focus:bg-white/10 dark:focus:text-white"
              >
                Newest First
              </SelectItem>
              <SelectItem
                value="-soldCount"
                className="font-bold focus:bg-black/5 focus:text-zinc-900 dark:focus:bg-white/10 dark:focus:text-white"
              >
                Most Popular
              </SelectItem>
              <SelectItem
                value="price"
                className="font-bold focus:bg-black/5 focus:text-zinc-900 dark:focus:bg-white/10 dark:focus:text-white"
              >
                Price: Low-High
              </SelectItem>
              <SelectItem
                value="-price"
                className="font-bold focus:bg-black/5 focus:text-zinc-900 dark:focus:bg-white/10 dark:focus:text-white"
              >
                Price: High-Low
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ShopHeader;
