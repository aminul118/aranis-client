'use client';

import { TransitionContext } from '@/context/useTransition';
import { generateShopPath } from '@/lib/url-slugs';
import { cn } from '@/lib/utils';
import type { ICategory } from '@/services/category/category.interface';
import type { IColor } from '@/services/color/color.interface';
import { getProducts } from '@/services/product/product';
import type { IProduct } from '@/services/product/product.interface';
import type { ISize } from '@/services/size/size.interface';
import { IMeta } from '@/types';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  useEffect,
  useTransition as useReactTransition,
  useState,
} from 'react';
import { useInView } from 'react-intersection-observer';
import ActiveFilters from './ActiveFilters';
import FilterSection from './FilterSection';
import ProductList from './ProductList';
import ShopHeader from './ShopHeader';

interface ShopContentProps {
  initialFilters?: {
    category?: string;
    subCategory?: string;
    type?: string;
  };
  isOfferPage?: boolean;
  offerTag?: string;
  offerName?: string;
  products: IProduct[];
  meta: IMeta | null;
  dbCategories: ICategory[];
  dbColors: IColor[];
  dbSizes: ISize[];
  priceRange: { minPrice: number; maxPrice: number } | null;
}

const ShopContent = ({
  initialFilters,
  isOfferPage = false,
  offerTag,
  offerName,
  products = [],
  meta = null,
  dbCategories = [],
  dbColors = [],
  dbSizes = [],
  priceRange = null,
}: ShopContentProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useReactTransition();
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Infinite Scroll State
  const [allProducts, setAllProducts] = useState<IProduct[]>(products);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [localMeta, setLocalMeta] = useState<IMeta | null>(meta);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '400px',
  });

  // Sync state when filters change (server components pass new props)
  useEffect(() => {
    setAllProducts(products);
    setCurrentPage(1);
    setLocalMeta(meta);
  }, [products, meta, searchParams]);

  // Load more function
  const loadMore = async () => {
    if (!localMeta || currentPage >= localMeta.totalPage || isLoadingMore)
      return;

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;

    const query: Record<string, string> = {};
    searchParams.forEach((val, key) => {
      if (key !== 'page') query[key] = val;
    });
    query.page = nextPage.toString();
    query.limit = '20';

    try {
      const res = await getProducts(query);
      if (res?.data) {
        setAllProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p._id));
          const newProducts = res.data.filter((p) => !existingIds.has(p._id));
          return [...prev, ...newProducts];
        });
        setCurrentPage(nextPage);
        if (res.meta) {
          setLocalMeta(res.meta);
        }
      }
    } catch (err) {
      console.error('Failed to load more products:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (
      inView &&
      !isLoadingMore &&
      !isPending &&
      localMeta &&
      currentPage < localMeta.totalPage
    ) {
      loadMore();
    }
  }, [inView, isLoadingMore, isPending, localMeta, currentPage]);

  // Load view mode from localStorage on mount
  useEffect(() => {
    const savedView = localStorage.getItem('Aranis_shop_view') as
      | 'grid'
      | 'list';
    if (savedView && (savedView === 'grid' || savedView === 'list')) {
      setViewMode(savedView);
    }
  }, []);

  const selectedCategory =
    initialFilters?.category || searchParams.get('category') || 'All';
  const selectedSubCategory =
    initialFilters?.subCategory || searchParams.get('subCategory') || '';
  const selectedType = initialFilters?.type || searchParams.get('type') || '';

  const selectedColors = searchParams.get('color')?.split(',') || [];
  const selectedSizes = searchParams.get('sizes')?.split(',') || [];
  const selectedMinPrice = searchParams.get('minPrice') || '';
  const selectedMaxPrice = searchParams.get('maxPrice') || '';
  const sortBy = searchParams.get('sort') || '-createdAt';

  // Check if we are in an empty state prior to filtering (used for offers page)
  const isQueryEmpty =
    !searchParams.get('color') &&
    !searchParams.get('sizes') &&
    !searchParams.get('minPrice') &&
    !searchParams.get('maxPrice') &&
    !searchParams.get('q') &&
    !searchParams.get('sort');

  const hasInitialProducts = (products?.length || 0) > 0 || !isQueryEmpty;

  const updateURL = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    const structuralKeys = ['category', 'subCategory', 'type', 'item'];
    const hasStructuralChange = Object.keys(newParams).some((key) =>
      structuralKeys.includes(key),
    );

    let nextCategory = selectedCategory;
    let nextSubCategory = selectedSubCategory;
    let nextType = selectedType;

    Object.entries(newParams).forEach(([key, value]) => {
      if (key === 'view') {
        const nextView = value as 'grid' | 'list';
        setViewMode(nextView);
        localStorage.setItem('Aranis_shop_view', nextView);
        return; // Don't add to URL params
      }

      if (!isOfferPage) {
        if (key === 'category') nextCategory = value || 'All';
        else if (key === 'subCategory') nextSubCategory = value || '';
        else if (key === 'type' || key === 'item') nextType = value || '';
      }

      if (
        isOfferPage ||
        !['category', 'subCategory', 'type', 'item'].includes(key)
      ) {
        if (value === null || value === 'All' || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
    });

    params.delete('view'); // Final safety check to ensure 'view' is stripped

    if (!newParams.page) {
      params.delete('page');
    }

    if (!isOfferPage) {
      params.delete('category');
      params.delete('subCategory');
      params.delete('type');
      params.delete('item');
    }

    const searchStr = params.toString();
    const queryStr = searchStr ? `?${searchStr}` : '';

    startTransition(() => {
      if (isOfferPage) {
        router.push(`${pathname}${queryStr}`);
      } else if (hasStructuralChange) {
        const nextPath = generateShopPath(
          nextCategory,
          nextSubCategory,
          nextType,
        );
        router.push(`${nextPath}${queryStr}`);
      } else {
        router.push(`${pathname}${queryStr}`, { scroll: false });
      }
    });
  };

  const toggleMultiFilter = (key: string, value: string, current: string[]) => {
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateURL({ [key]: updated.length > 0 ? updated.join(',') : null });
  };

  const handleClearAll = () => {
    const clearParams: Record<string, string | null> = {
      color: null,
      sizes: null,
      minPrice: null,
      maxPrice: null,
      q: null,
    };

    if (!initialFilters) {
      clearParams.category = 'All';
      clearParams.subCategory = '';
      clearParams.type = '';
    }

    updateURL(clearParams);
  };

  return (
    <TransitionContext.Provider
      value={{ startTransition, isPending, pendingAction, setPendingAction }}
    >
      <div
        className={cn(
          'bg-background min-h-screen transition-opacity duration-300',
          isPending && 'pointer-events-none opacity-60',
        )}
      >
        <div className="container mx-auto px-4 py-8 md:py-12">
          {isOfferPage && !hasInitialProducts ? (
            <div className="flex min-h-[50vh] flex-col items-center justify-center py-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50/80 text-red-400 dark:bg-red-900/20"
                >
                  <Gift size={38} strokeWidth={1.5} />
                </motion.div>

                <h1 className="text-foreground mb-2 text-2xl font-bold tracking-tight">
                  No Active Offers Found
                </h1>

                <p className="text-muted-foreground mb-8 max-w-[280px] text-sm leading-relaxed">
                  We're currently preparing our next seasonal curation. Stay
                  tuned!
                </p>

                <div className="h-1 w-12 rounded-full bg-red-500/10" />
              </motion.div>
            </div>
          ) : (
            <>
              {isOfferPage && (
                <div className="container mx-auto mb-10 px-4 text-center">
                  <h1 className="text-foreground text-3xl font-black tracking-tight uppercase md:text-5xl">
                    {offerName ? (
                      <span className="text-red-500">{offerName}</span>
                    ) : (
                      <>
                        {offerTag || 'Special'}{' '}
                        <span className="text-red-500">Offers</span>
                      </>
                    )}
                  </h1>
                  <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-sm md:text-base">
                    Discover our premium collections at exclusive, temporary
                    pricing.
                  </p>
                </div>
              )}
              <ShopHeader
                dbCategories={dbCategories}
                selectedCategory={selectedCategory}
                selectedSubCategory={selectedSubCategory}
                selectedType={selectedType}
                totalItems={localMeta?.total || 0}
                viewMode={viewMode}
                sortBy={sortBy}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                onUpdateURL={updateURL}
                onClearAll={handleClearAll}
                activeFiltersNode={
                  <ActiveFilters
                    selectedCategory={selectedCategory}
                    selectedColors={selectedColors}
                    selectedSizes={selectedSizes}
                    selectedQuery={searchParams.get('q') || ''}
                    selectedMinPrice={selectedMinPrice}
                    selectedMaxPrice={selectedMaxPrice}
                    onUpdateURL={updateURL}
                    onToggleMultiFilter={toggleMultiFilter}
                    onClearAll={handleClearAll}
                    isCategoryFixed={!!initialFilters}
                  />
                }
              >
                <FilterSection
                  dbCategories={dbCategories}
                  dbColors={dbColors}
                  dbSizes={dbSizes}
                  selectedCategory={selectedCategory}
                  selectedSubCategory={selectedSubCategory}
                  selectedType={selectedType}
                  selectedColors={selectedColors}
                  selectedSizes={selectedSizes}
                  sortBy={sortBy}
                  onUpdateURL={updateURL}
                  onToggleMultiFilter={toggleMultiFilter}
                  showSort
                  priceRange={priceRange}
                  selectedMinPrice={selectedMinPrice}
                  selectedMaxPrice={selectedMaxPrice}
                />
              </ShopHeader>

              <div className="block lg:hidden">
                <ActiveFilters
                  selectedCategory={selectedCategory}
                  selectedColors={selectedColors}
                  selectedSizes={selectedSizes}
                  selectedQuery={searchParams.get('q') || ''}
                  selectedMinPrice={selectedMinPrice}
                  selectedMaxPrice={selectedMaxPrice}
                  onUpdateURL={updateURL}
                  onToggleMultiFilter={toggleMultiFilter}
                  onClearAll={handleClearAll}
                  isCategoryFixed={!!initialFilters}
                />
              </div>

              <div className="flex items-start gap-12">
                <aside className="hidden w-64 shrink-0 flex-col gap-10 lg:flex">
                  <FilterSection
                    dbCategories={dbCategories}
                    dbColors={dbColors}
                    dbSizes={dbSizes}
                    selectedCategory={selectedCategory}
                    selectedSubCategory={selectedSubCategory}
                    selectedType={selectedType}
                    selectedColors={selectedColors}
                    selectedSizes={selectedSizes}
                    sortBy={sortBy}
                    onUpdateURL={updateURL}
                    onToggleMultiFilter={toggleMultiFilter}
                    showCategory={false}
                    priceRange={priceRange}
                    selectedMinPrice={selectedMinPrice}
                    selectedMaxPrice={selectedMaxPrice}
                  />
                </aside>

                <main className="flex-1">
                  <ProductList
                    products={allProducts}
                    loading={isPending}
                    viewMode={viewMode}
                    selectedColors={selectedColors}
                  />

                  {localMeta && currentPage < localMeta.totalPage && (
                    <div
                      ref={ref}
                      className={cn(
                        'mt-12 grid gap-6 md:gap-8',
                        viewMode === 'grid'
                          ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
                          : 'grid-cols-1',
                      )}
                    >
                      {/* Premium Skeleton Loaders */}
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex flex-col gap-3 opacity-60">
                          <div className="aspect-[4/5] w-full animate-pulse overflow-hidden bg-zinc-200 dark:bg-zinc-800" />
                          <div className="px-1 py-2">
                            <div className="mb-2 h-3 w-1/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                            <div className="mb-4 h-4 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                            <div className="h-5 w-1/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {localMeta &&
                    currentPage >= localMeta.totalPage &&
                    allProducts.length > 0 && (
                      <div className="mt-16 flex flex-col items-center justify-center py-10 opacity-60">
                        <div className="mb-4 h-1 w-12 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                        <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                          End of Collection
                        </p>
                      </div>
                    )}
                </main>
              </div>
            </>
          )}
        </div>
      </div>
    </TransitionContext.Provider>
  );
};

export default ShopContent;
