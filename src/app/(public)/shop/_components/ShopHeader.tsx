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
import { ICategory } from '@/services/category/category';
import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
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
  children,
}: ShopHeaderProps) => {
  return (
    <div className="mb-10 flex flex-col items-center justify-between gap-6 lg:flex-row">
      <div className="flex w-full items-center justify-between lg:w-auto">
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

      <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:items-center">
        <div className="flex flex-1 items-center gap-2 sm:flex-none">
          {/* View Toggles */}
          <div className="flex h-12 items-center gap-1 rounded-full border border-black/10 bg-white/70 p-1 shadow-sm backdrop-blur-xl transition-all dark:border-white/10 dark:bg-white/[0.03] dark:shadow-2xl">
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
            >
              <List size={20} />
            </Button>
          </div>

          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button className="h-12 flex-1 items-center gap-3 rounded-full bg-zinc-900 font-bold text-white shadow-md transition-all hover:bg-zinc-800 sm:flex-none lg:hidden dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
                <SlidersHorizontal size={16} />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full border-white/5 bg-[#0f111a] sm:max-w-md"
            >
              <SheetHeader className="mb-6">
                <SheetTitle className="text-left text-2xl font-black text-white">
                  Shop Filters
                </SheetTitle>
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
            <SelectTrigger className="h-12 flex-1 rounded-full border border-black/10 bg-white/70 px-6 font-bold text-zinc-800 shadow-sm ring-offset-0 transition-all hover:bg-white focus:ring-0 sm:w-[200px] sm:flex-none dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:shadow-2xl dark:hover:bg-white/[0.05]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="shadow-3xl rounded-[20px] border-black/10 bg-white text-zinc-800 backdrop-blur-xl dark:border-white/10 dark:bg-[#151722] dark:text-white">
              <SelectItem
                value="Newest"
                className="font-bold focus:bg-black/5 focus:text-zinc-900 dark:focus:bg-white/10 dark:focus:text-white"
              >
                Newest First
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
