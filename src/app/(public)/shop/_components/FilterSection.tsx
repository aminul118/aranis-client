'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { ICategory } from '@/services/category/category';
import { IColor } from '@/services/color/color';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FilterSectionProps {
  dbCategories: ICategory[];
  dbColors: IColor[];
  selectedCategory: string;
  selectedSubCategory: string;
  selectedType: string;
  selectedColors: string[];
  selectedSizes: string[];
  sortBy: string;
  onUpdateURL: (params: Record<string, string | null>) => void;
  onToggleMultiFilter: (key: string, value: string, current: string[]) => void;
  showSort?: boolean;
  showCategory?: boolean;
  priceRange?: { minPrice: number; maxPrice: number } | null;
  selectedMinPrice: string;
  selectedMaxPrice: string;
}

const card =
  'rounded-3xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] shadow-[0_8px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-300';

const heading =
  'mb-4 text-xs font-extrabold tracking-[0.22em] uppercase text-muted-foreground';

const FilterSection = ({
  dbCategories,
  dbColors,
  selectedCategory,
  selectedSubCategory,
  selectedType,
  selectedColors,
  selectedSizes,
  sortBy,
  onUpdateURL,
  onToggleMultiFilter,
  showSort = false,
  showCategory = true,
  priceRange,
  selectedMinPrice,
  selectedMaxPrice,
}: FilterSectionProps) => {
  const currentCategoryData = dbCategories.find(
    (c) => c.name === selectedCategory,
  );

  let globalMin = priceRange?.minPrice ?? 0;
  let globalMax = priceRange?.maxPrice ?? 10000;
  if (globalMin === globalMax) {
    globalMin = 0;
    if (globalMax === 0) {
      globalMax = 10000;
    }
  }

  const activeMin = selectedMinPrice ? Number(selectedMinPrice) : globalMin;
  const activeMax = selectedMaxPrice ? Number(selectedMaxPrice) : globalMax;

  const [localRange, setLocalRange] = useState<[number, number]>([
    activeMin,
    activeMax,
  ]);

  // Sync local range with active filters (e.g., when filters are cleared)
  useEffect(() => {
    setLocalRange([activeMin, activeMax]);
  }, [activeMin, activeMax, globalMin, globalMax]);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const sortOptions = [
    { label: 'Newest First', value: '-createdAt' },
    { label: 'Most Popular', value: '-soldCount' },
    { label: 'Price: Low-High', value: 'price' },
    { label: 'Price: High-Low', value: '-price' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-6 pb-24"
    >
      {/* SORT */}
      {showSort && (
        <div className={cn(card, 'p-5')}>
          <div className={heading}>Sort By</div>

          <div className="flex flex-col gap-2">
            {sortOptions.map((item) => {
              const active = sortBy === item.value;

              return (
                <motion.div
                  key={item.value}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    className={cn(
                      'w-full justify-between rounded-2xl px-4 py-6 text-left font-semibold transition-all duration-300',
                      active
                        ? 'bg-primary/10 dark:bg-primary/20 text-primary shadow-[0_0_0_1px_rgba(99,102,241,0.35)]'
                        : 'bg-transparent text-zinc-700 hover:bg-black/5 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white',
                    )}
                    variant="ghost"
                    onClick={() => onUpdateURL({ sort: item.value })}
                  >
                    <span>{item.label}</span>

                    {active && (
                      <span className="text-primary flex items-center gap-2 text-xs">
                        Active
                        <span className="bg-primary h-2 w-2 rounded-full" />
                      </span>
                    )}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* CATEGORY */}
      {showCategory && (
        <div className={cn(card, 'p-5')}>
          <div className={heading}>Category</div>

          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              onUpdateURL({ category: value, subCategory: '', type: '' });
            }}
          >
            <SelectTrigger className="h-12 w-full rounded-2xl border-black/10 bg-black/[0.02] px-5 font-semibold text-zinc-700 shadow-sm ring-offset-0 focus:ring-0 dark:border-white/10 dark:bg-white/[0.04] dark:text-white">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>

            <SelectContent className="dark:bg-background/95 rounded-2xl border-black/10 bg-white/95 backdrop-blur-xl dark:border-white/10">
              <SelectItem value="All" className="font-semibold">
                All Categories
              </SelectItem>

              {dbCategories.map((cat) => (
                <SelectItem
                  key={cat._id}
                  value={cat.name}
                  className="font-semibold"
                >
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* SUBCATEGORY */}
      {currentCategoryData && currentCategoryData.subCategories.length > 0 && (
        <div className={cn(card, 'p-5')}>
          <div className={heading}>Sub Category</div>

          <div className="flex flex-col gap-2">
            {currentCategoryData.subCategories.map((sub) => {
              const active = selectedSubCategory === sub.title;

              return (
                <motion.div
                  key={sub.title}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    className={cn(
                      'w-full justify-between rounded-2xl px-4 py-6 font-semibold transition-all duration-300',
                      active
                        ? 'bg-primary/10 dark:bg-primary/20 text-primary shadow-[0_0_0_1px_rgba(99,102,241,0.35)]'
                        : 'bg-transparent text-zinc-700 hover:bg-black/5 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white',
                    )}
                    variant="ghost"
                    onClick={() =>
                      onUpdateURL({ subCategory: sub.title, type: '' })
                    }
                  >
                    <span>{sub.title}</span>
                    {active && (
                      <span className="bg-primary h-2 w-2 rounded-full" />
                    )}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* TYPES */}
      {selectedSubCategory &&
        currentCategoryData?.subCategories.find(
          (s) => s.title === selectedSubCategory,
        ) && (
          <div className={cn(card, 'p-5')}>
            <div className={heading}>Collection Type</div>

            <div className="flex flex-wrap gap-2">
              {currentCategoryData.subCategories
                .find((s) => s.title === selectedSubCategory)
                ?.items.map((type) => {
                  const active = selectedType === type;

                  return (
                    <motion.div
                      key={type}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        className={cn(
                          'rounded-2xl px-4 font-semibold transition-all duration-300',
                          active
                            ? 'bg-primary/10 dark:bg-primary/20 text-primary shadow-[0_0_0_1px_rgba(99,102,241,0.35)]'
                            : 'bg-black/[0.03] text-zinc-700 hover:bg-black/[0.06] hover:text-zinc-900 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:bg-white/[0.07] dark:hover:text-white',
                        )}
                        variant="ghost"
                        onClick={() => onUpdateURL({ type })}
                      >
                        {type}
                      </Button>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        )}

      {/* PRICE RANGE */}
      {globalMax >= globalMin && (
        <div className={cn(card, 'p-5')}>
          <div className={heading}>Price Range</div>

          <div className="px-2 pt-2">
            <Slider
              min={globalMin}
              max={globalMax}
              step={50}
              value={localRange}
              onValueChange={(val) => setLocalRange(val as [number, number])}
              onValueCommit={(val) => {
                const [newMin, newMax] = val as [number, number];
                onUpdateURL({
                  minPrice: newMin === globalMin ? null : String(newMin),
                  maxPrice: newMax === globalMax ? null : String(newMax),
                });
              }}
              className="my-6"
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-muted-foreground text-[9px] font-bold tracking-wider uppercase">
                Min Price
              </label>
              <input
                type="number"
                min={globalMin}
                max={globalMax}
                value={localRange[0]}
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), localRange[1]);
                  setLocalRange([val, localRange[1]]);
                }}
                onBlur={() => {
                  onUpdateURL({
                    minPrice:
                      localRange[0] === globalMin
                        ? null
                        : String(localRange[0]),
                    maxPrice:
                      localRange[1] === globalMax
                        ? null
                        : String(localRange[1]),
                  });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onUpdateURL({
                      minPrice:
                        localRange[0] === globalMin
                          ? null
                          : String(localRange[0]),
                      maxPrice:
                        localRange[1] === globalMax
                          ? null
                          : String(localRange[1]),
                    });
                  }
                }}
                className="focus:border-primary/50 w-full rounded-xl border border-black/10 bg-white/50 px-3 py-2 text-xs font-bold text-zinc-800 shadow-sm transition-all focus:outline-none dark:border-white/10 dark:bg-[#0e1017] dark:text-white dark:shadow-none"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-muted-foreground text-[9px] font-bold tracking-wider uppercase">
                Max Price
              </label>
              <input
                type="number"
                min={globalMin}
                max={globalMax}
                value={localRange[1]}
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), localRange[0]);
                  setLocalRange([localRange[0], val]);
                }}
                onBlur={() => {
                  onUpdateURL({
                    minPrice:
                      localRange[0] === globalMin
                        ? null
                        : String(localRange[0]),
                    maxPrice:
                      localRange[1] === globalMax
                        ? null
                        : String(localRange[1]),
                  });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onUpdateURL({
                      minPrice:
                        localRange[0] === globalMin
                          ? null
                          : String(localRange[0]),
                      maxPrice:
                        localRange[1] === globalMax
                          ? null
                          : String(localRange[1]),
                    });
                  }
                }}
                className="focus:border-primary/50 w-full rounded-xl border border-black/10 bg-white/50 px-3 py-2 text-xs font-bold text-zinc-800 shadow-sm transition-all focus:outline-none dark:border-white/10 dark:bg-[#0e1017] dark:text-white dark:shadow-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* COLORS */}
      <div className={cn(card, 'p-5')}>
        <div className={heading}>Colors</div>

        <div className="grid grid-cols-4 gap-3">
          {dbColors.map((color) => {
            const active = selectedColors.includes(color.name);
            const bg = color.hex || color.name.toLowerCase().replace(/\s/g, '');

            return (
              <div
                key={color.name}
                className="group relative flex justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    onToggleMultiFilter('color', color.name, selectedColors)
                  }
                  className={cn(
                    'relative grid h-11 w-11 place-items-center rounded-full border shadow-sm transition',
                    active
                      ? 'border-primary ring-primary ring-offset-background ring-2 ring-offset-4'
                      : 'border-black/10 hover:border-black/20 dark:border-white/10 dark:hover:border-white/20',
                  )}
                  style={{ backgroundColor: bg }}
                >
                  {/* glossy highlight */}
                  <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/25 to-transparent" />

                  {active && (
                    <span className="relative grid h-6 w-6 place-items-center rounded-full bg-white/70 backdrop-blur">
                      <Check className="h-4 w-4 text-black" />
                    </span>
                  )}
                </motion.button>

                {/* Premium Custom Tooltip */}
                <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2.5 origin-bottom -translate-x-1/2 scale-75 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
                  <div className="rounded-lg border border-white/10 bg-[#0e1017]/95 px-2.5 py-1.5 text-[10px] font-bold tracking-wide whitespace-nowrap text-white uppercase shadow-xl backdrop-blur-md">
                    {color.name}
                  </div>
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 z-40 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-r border-b border-white/10 bg-[#0e1017]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SIZES */}
      <div className={cn(card, 'p-5')}>
        <div className={heading}>Sizes</div>

        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => {
            const active = selectedSizes.includes(size);

            return (
              <motion.div
                key={size}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className={cn(
                    'w-full rounded-2xl font-semibold transition-all duration-300',
                    active
                      ? 'bg-primary/10 dark:bg-primary/20 text-primary shadow-[0_0_0_1px_rgba(99,102,241,0.35)]'
                      : 'bg-black/[0.03] text-zinc-700 hover:bg-black/[0.06] hover:text-zinc-900 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:bg-white/[0.07] dark:hover:text-white',
                  )}
                  variant="ghost"
                  onClick={() =>
                    onToggleMultiFilter('sizes', size, selectedSizes)
                  }
                >
                  {size}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default FilterSection;
