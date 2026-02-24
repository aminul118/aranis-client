'use client';

import AppPagination from '@/components/common/pagination/AppPagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { TransitionContext } from '@/context/useTransition';
import { generateShopPath } from '@/lib/url-slugs';
import { cn } from '@/lib/utils';
import { getProducts, IProduct } from '@/services/product/product';
import { IMeta } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  useEffect,
  useTransition as useReactTransition,
  useState,
} from 'react';
import { toast } from 'sonner';

interface ShopContentProps {
  initialFilters?: {
    category?: string;
    subCategory?: string;
    type?: string;
  };
}

const ShopContent = ({ initialFilters }: ShopContentProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [isPending, startTransition] = useReactTransition();
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);
  const [meta, setMeta] = useState<IMeta | null>(null);
  const [loading, setLoading] = useState(true);

  const page = Number(searchParams.get('page')) || 1;
  const limit = 12;

  // Sync state with URL and path params
  const searchQuery = searchParams.get('q') || '';
  const selectedCategory =
    initialFilters?.category || searchParams.get('category') || 'All';
  const selectedSubCategory =
    initialFilters?.subCategory || searchParams.get('subCategory') || '';
  const selectedType = initialFilters?.type || searchParams.get('type') || '';

  const selectedColors = searchParams.get('color')?.split(',') || [];
  const selectedSizes = searchParams.get('sizes')?.split(',') || [];
  const sortBy = searchParams.get('sort') || 'Newest';
  const viewModeParam = searchParams.get('view') || 'grid';
  const viewMode = viewModeParam === 'list' ? 'list' : 'grid';

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const categories = ['All', 'Men', 'Women', 'Accessories'];
  const colors = [
    'Black',
    'Blue',
    'White',
    'Beige',
    'Red',
    'Emerald',
    'Gold',
    'Silver',
    'Purple',
    'Orange',
    'Green',
    'Indigo',
    'Violet',
    'Cyan',
    'Teal',
    'Lime',
    'Yellow',
    'Amber',
    'Deep Orange',
    'Brown',
    'Grey',
    'Blue Grey',
  ];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const query: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          query[key] = value;
        });

        // Overlay initial filters from path
        if (initialFilters?.category) query.category = initialFilters.category;
        if (initialFilters?.subCategory)
          query.subCategory = initialFilters.subCategory;
        if (initialFilters?.type) query.type = initialFilters.type;

        if (!query.limit) query.limit = limit.toString();
        if (!query.page) query.page = page.toString();

        const { data, meta: productMeta } = await getProducts(query);
        setAllProducts(data || []);
        setMeta(productMeta || null);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [searchParams, page, initialFilters]);

  const updateURL = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Separate structural params (path segments) from query params
    const structuralKeys = ['category', 'subCategory', 'type', 'item'];
    const hasStructuralChange = Object.keys(newParams).some((key) =>
      structuralKeys.includes(key),
    );

    let nextCategory = selectedCategory;
    let nextSubCategory = selectedSubCategory;
    let nextType = selectedType;

    Object.entries(newParams).forEach(([key, value]) => {
      if (key === 'category') nextCategory = value || 'All';
      else if (key === 'subCategory') nextSubCategory = value || '';
      else if (key === 'type' || key === 'item') nextType = value || '';
      else {
        if (value === null || value === 'All' || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
    });

    if (!newParams.page) {
      params.delete('page');
    }

    // Clean up structural params from query string since they'll be in the path
    params.delete('category');
    params.delete('subCategory');
    params.delete('type');
    params.delete('item');

    const searchStr = params.toString();
    const queryStr = searchStr ? `?${searchStr}` : '';

    if (hasStructuralChange || initialFilters) {
      const nextPath = generateShopPath(
        nextCategory,
        nextSubCategory,
        nextType,
      );
      router.push(`${nextPath}${queryStr}`);
    } else {
      router.push(`${queryStr}`, { scroll: false });
    }
  };

  const toggleMultiFilter = (key: string, value: string, current: string[]) => {
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateURL({ [key]: updated.length > 0 ? updated.join(',') : null });
  };

  return (
    <TransitionContext.Provider value={{ startTransition, isPending }}>
      <div
        className={cn(
          'bg-background min-h-screen pt-28 pb-20 transition-opacity',
          isPending && 'pointer-events-none opacity-50',
        )}
      >
        <div className="container mx-auto px-4">
          <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <h1 className="text-foreground mb-2 text-4xl font-bold">
                {selectedCategory !== 'All'
                  ? `${selectedCategory} ${selectedSubCategory} ${selectedType}`.trim()
                  : 'Lumiere Shop'}
              </h1>
              <p className="text-muted-foreground">
                Discover excellence ({meta?.total || 0} items)
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateURL({ q: localSearch });
              }}
              className="flex w-full items-center gap-4 md:w-auto"
            >
              <div className="relative flex-1 md:w-80">
                <Search
                  className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2"
                  size={18}
                />
                <Input
                  placeholder="Search products..."
                  className="bg-card border-border text-foreground rounded-full py-6 pl-12 focus:border-blue-500/50"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                className="border-border rounded-full px-6 py-6 lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <SlidersHorizontal size={20} />
              </Button>
            </form>
          </div>

          <div className="flex items-start gap-12">
            <aside className="sticky top-32 hidden w-64 flex-col gap-10 lg:flex">
              <div>
                <h3 className="text-foreground mb-6 text-sm font-bold tracking-widest uppercase">
                  Category
                </h3>
                <div className="flex flex-col gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        updateURL({ category: cat, subCategory: '', type: '' });
                      }}
                      className={cn(
                        'text-left text-base transition-colors',
                        selectedCategory === cat
                          ? 'font-bold text-blue-500'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-foreground mb-6 text-sm font-bold tracking-widest uppercase">
                  Colors
                </h3>
                <div className="flex flex-wrap gap-3">
                  {colors.slice(0, 12).map((color) => (
                    <button
                      key={color}
                      onClick={() =>
                        toggleMultiFilter('color', color, selectedColors)
                      }
                      className={cn(
                        'border-border h-8 w-8 rounded-full border transition-transform hover:scale-110',
                        selectedColors.includes(color) &&
                          'ring-offset-background ring-2 ring-blue-500 ring-offset-4',
                      )}
                      style={{
                        backgroundColor: color.toLowerCase().replace(/\s/g, ''),
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-foreground mb-6 text-sm font-bold tracking-widest uppercase">
                  Sizes
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() =>
                        toggleMultiFilter('sizes', size, selectedSizes)
                      }
                      className={cn(
                        'rounded-lg border py-2 text-sm font-bold transition-all',
                        selectedSizes.includes(size)
                          ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-card border-border text-muted-foreground hover:border-foreground/20',
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground justify-start p-0"
                onClick={() => router.push('/shop')}
              >
                Clear all filters
              </Button>
            </aside>

            <main className="flex-1">
              {loading ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  <div className="border-border mb-8 flex items-center justify-between border-b pb-8">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          'rounded-md',
                          viewMode === 'grid'
                            ? 'bg-muted text-foreground'
                            : 'text-muted-foreground',
                        )}
                        onClick={() => updateURL({ view: 'grid' })}
                      >
                        <LayoutGrid size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          'rounded-md',
                          viewMode === 'list'
                            ? 'bg-muted text-foreground'
                            : 'text-muted-foreground',
                        )}
                        onClick={() => updateURL({ view: 'list' })}
                      >
                        <List size={18} />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground hidden text-sm sm:block">
                        Sort by:
                      </span>
                      <select
                        className="text-foreground cursor-pointer bg-transparent text-sm font-bold focus:outline-none"
                        value={sortBy}
                        onChange={(e) => updateURL({ sort: e.target.value })}
                      >
                        <option value="Newest">Newest</option>
                        <option value="price">Price: Low-High</option>
                        <option value="-price">Price: High-Low</option>
                        <option value="-rating">Top Rated</option>
                      </select>
                    </div>
                  </div>

                  {allProducts.length > 0 ? (
                    <div
                      className={cn(
                        'grid gap-8',
                        viewMode === 'grid'
                          ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                          : 'grid-cols-1',
                      )}
                    >
                      {allProducts.map((product) => (
                        <motion.div
                          key={product._id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={cn(
                            'group bg-card/40 border-border overflow-hidden rounded-3xl border transition-all hover:border-blue-500/20',
                            viewMode === 'list' &&
                              'flex flex-col gap-6 p-4 sm:flex-row',
                          )}
                        >
                          <Link
                            href={`/products/${product.slug}`}
                            className={cn(
                              'relative block overflow-hidden',
                              viewMode === 'grid'
                                ? 'aspect-4/5'
                                : 'aspect-square w-full rounded-2xl sm:w-48',
                            )}
                          >
                            {product.salePrice && product.salePrice > 0 && (
                              <div className="absolute top-4 left-4 z-10">
                                <div className="rounded-full bg-red-500 px-3 py-1 text-[10px] font-black tracking-tighter text-white uppercase shadow-lg">
                                  Sale{' '}
                                  {Math.round(
                                    (1 - product.salePrice / product.price) *
                                      100,
                                  )}
                                  % OFF
                                </div>
                              </div>
                            )}
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </Link>

                          <div className="flex flex-1 flex-col p-6">
                            <div className="mb-2 flex items-start justify-between">
                              <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                                {product.subCategory}
                              </span>
                              <div className="flex items-center gap-1 text-xs text-amber-500">
                                <Star size={12} fill="currentColor" />
                                <span>{product.rating}</span>
                              </div>
                            </div>
                            <Link href={`/products/${product.slug}`}>
                              <h3 className="text-foreground mb-2 truncate text-xl font-bold capitalize transition-colors group-hover:text-blue-500">
                                {product.name}
                              </h3>
                            </Link>
                            <p className="text-muted-foreground mb-6 line-clamp-2 flex-1 text-sm">
                              {product.description}
                            </p>
                            <div className="mt-auto flex items-center justify-between">
                              <div className="flex flex-col">
                                {product.salePrice && product.salePrice > 0 ? (
                                  <>
                                    <span className="text-muted-foreground text-sm line-through">
                                      ৳{product.price.toFixed(2)}
                                    </span>
                                    <span className="text-2xl font-black text-blue-500">
                                      ৳{product.salePrice.toFixed(2)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-foreground text-2xl font-bold">
                                    ৳{product.price.toFixed(2)}
                                  </span>
                                )}
                              </div>
                              <Button
                                size="sm"
                                onClick={() => {
                                  addToCart(product as any);
                                  toast.success(
                                    `${product.name} added to cart!`,
                                  );
                                }}
                                className="rounded-full bg-blue-600 px-6 font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700"
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center">
                      <p className="text-muted-foreground text-xl font-medium">
                        No products match your filters.
                      </p>
                      <Button
                        variant="link"
                        onClick={() => router.push('/shop')}
                        className="mt-2 text-blue-500"
                      >
                        Reset all filters
                      </Button>
                    </div>
                  )}
                  {meta && (
                    <div className="border-border mt-12 flex justify-center border-t pt-12">
                      <AppPagination meta={meta} />
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-background/80 fixed inset-0 z-50 backdrop-blur-sm lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-card fixed top-0 right-0 z-50 flex h-full w-4/5 max-w-sm flex-col gap-10 overflow-y-auto p-8 lg:hidden"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-foreground text-2xl font-bold">Filters</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-muted-foreground"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-8">
                <div>
                  <h3 className="text-foreground mb-6 text-sm font-bold tracking-widest uppercase">
                    Category
                  </h3>
                  <div className="flex flex-col gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          updateURL({
                            category: cat,
                            subCategory: '',
                            type: '',
                          });
                          setIsSidebarOpen(false);
                        }}
                        className={cn(
                          'text-left text-base transition-colors',
                          selectedCategory === cat
                            ? 'font-bold text-blue-500'
                            : 'text-muted-foreground hover:text-foreground',
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-foreground mb-6 text-sm font-bold tracking-widest uppercase">
                    Colors
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {colors.slice(0, 15).map((color) => (
                      <button
                        key={color}
                        onClick={() =>
                          toggleMultiFilter('color', color, selectedColors)
                        }
                        className={cn(
                          'border-border h-10 w-10 rounded-full border transition-transform',
                          selectedColors.includes(color) &&
                            'ring-offset-background ring-2 ring-blue-500 ring-offset-4',
                        )}
                        style={{
                          backgroundColor: color
                            .toLowerCase()
                            .replace(/\s/g, ''),
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
};

export default ShopContent;
