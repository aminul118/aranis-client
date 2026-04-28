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
          <div className="flex h-11 items-center gap-1 rounded-2xl bg-[#151722] p-1.5 shadow-2xl">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-full w-10 rounded-xl p-0 transition-all duration-300',
                viewMode === 'grid'
                  ? 'bg-[#0a0b10] text-white shadow-xl'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white',
              )}
              onClick={() => onUpdateURL({ view: 'grid' })}
            >
              <LayoutGrid size={20} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-full w-10 rounded-xl p-0 transition-all duration-300',
                viewMode === 'list'
                  ? 'bg-[#0a0b10] text-white shadow-xl'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white',
              )}
              onClick={() => onUpdateURL({ view: 'list' })}
            >
              <List size={20} />
            </Button>
          </div>

          <div className="hidden sm:block">
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                onUpdateURL({ category: value, subCategory: '', type: '' });
              }}
            >
              <SelectTrigger className="h-11 w-[160px] rounded-2xl border-none bg-[#151722] px-6 font-bold text-white shadow-2xl ring-offset-0 focus:ring-0">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="shadow-3xl rounded-2xl border-white/5 bg-[#151722] text-white">
                <SelectItem
                  value="All"
                  className="font-bold focus:bg-white/10 focus:text-white"
                >
                  All Categories
                </SelectItem>
                {dbCategories.map((cat) => (
                  <SelectItem
                    key={cat._id}
                    value={cat.name}
                    className="font-bold focus:bg-white/10 focus:text-white"
                  >
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button className="h-11 flex-1 items-center gap-3 rounded-2xl bg-[#151722] px-6 font-bold text-white hover:bg-[#1a1c2e] sm:flex-none lg:hidden">
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
            <SelectTrigger className="h-11 flex-1 rounded-2xl border-none bg-[#151722] px-6 font-bold text-white shadow-2xl ring-offset-0 focus:ring-0 sm:w-[200px] sm:flex-none">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="shadow-3xl rounded-2xl border-white/5 bg-[#151722] text-white">
              <SelectItem
                value="Newest"
                className="font-bold focus:bg-white/10 focus:text-white"
              >
                Newest First
              </SelectItem>
              <SelectItem
                value="price"
                className="font-bold focus:bg-white/10 focus:text-white"
              >
                Price: Low-High
              </SelectItem>
              <SelectItem
                value="-price"
                className="font-bold focus:bg-white/10 focus:text-white"
              >
                Price: High-Low
              </SelectItem>
              <SelectItem
                value="-rating"
                className="font-bold focus:bg-white/10 focus:text-white"
              >
                Top Rated
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ShopHeader;
