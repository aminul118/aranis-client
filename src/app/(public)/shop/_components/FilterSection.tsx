'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ICategory } from '@/services/category/category';
import { IColor } from '@/services/color/color';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

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
}

const card =
  'rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-xl';

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
}: FilterSectionProps) => {
  const currentCategoryData = dbCategories.find(
    (c) => c.name === selectedCategory,
  );

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const sortOptions = [
    { label: 'Newest First', value: 'Newest' },
    { label: 'Price: Low-High', value: 'price' },
    { label: 'Price: High-Low', value: '-price' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-6"
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
                      'w-full justify-between rounded-2xl px-4 py-6 text-left font-semibold',
                      active
                        ? 'bg-primary/15 text-foreground shadow-[0_0_0_1px_rgba(99,102,241,0.35)]'
                        : 'bg-transparent hover:bg-white/5',
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
            <SelectTrigger className="text-foreground h-12 w-full rounded-2xl border-white/10 bg-white/[0.04] px-5 font-semibold shadow-sm ring-offset-0 focus:ring-0">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>

            <SelectContent className="bg-background/95 rounded-2xl border-white/10 backdrop-blur-xl">
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
                      'w-full justify-between rounded-2xl px-4 py-6 font-semibold',
                      active
                        ? 'bg-primary/15 shadow-[0_0_0_1px_rgba(99,102,241,0.35)]'
                        : 'bg-transparent hover:bg-white/5',
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
                          'rounded-2xl px-4',
                          active
                            ? 'bg-primary/15 shadow-[0_0_0_1px_rgba(99,102,241,0.35)]'
                            : 'bg-white/[0.04] hover:bg-white/[0.07]',
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

      {/* COLORS */}
      <div className={cn(card, 'p-5')}>
        <div className={heading}>Colors</div>

        <div className="grid grid-cols-4 gap-3">
          {dbColors.map((color) => {
            const active = selectedColors.includes(color.name);
            const bg = color.hex || color.name.toLowerCase().replace(/\s/g, '');

            return (
              <motion.button
                key={color.name}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  onToggleMultiFilter('color', color.name, selectedColors)
                }
                className={cn(
                  'relative grid h-11 w-11 place-items-center rounded-full border shadow-sm transition',
                  active
                    ? 'border-primary ring-primary ring-offset-background ring-2 ring-offset-4'
                    : 'border-white/10 hover:border-white/20',
                )}
                style={{ backgroundColor: bg }}
                title={color.name}
              >
                {/* glossy highlight */}
                <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/25 to-transparent" />

                {active && (
                  <span className="relative grid h-6 w-6 place-items-center rounded-full bg-white/70 backdrop-blur">
                    <Check className="h-4 w-4 text-black" />
                  </span>
                )}
              </motion.button>
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
                    'w-full rounded-2xl font-semibold',
                    active
                      ? 'bg-primary/15 shadow-[0_0_0_1px_rgba(99,102,241,0.35)]'
                      : 'bg-white/[0.04] hover:bg-white/[0.07]',
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
