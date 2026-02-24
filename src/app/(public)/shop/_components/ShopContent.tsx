'use client';

import AppPagination from '@/components/common/pagination/AppPagination';
import { TransitionContext } from '@/context/useTransition';
import { generateShopPath } from '@/lib/url-slugs';
import { cn } from '@/lib/utils';
import { getCategories, ICategory } from '@/services/category/category';
import { getColors, IColor } from '@/services/color/color';
import { getProducts, IProduct } from '@/services/product/product';
import { IMeta } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  useEffect,
  useTransition as useReactTransition,
  useState,
} from 'react';
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
}

const ShopContent = ({ initialFilters }: ShopContentProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useReactTransition();
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);
  const [meta, setMeta] = useState<IMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbColors, setDbColors] = useState<IColor[]>([]);
  const [dbCategories, setDbCategories] = useState<ICategory[]>([]);

  const page = Number(searchParams.get('page')) || 1;
  const limit = 12;

  // Sync state with URL and path params
  const selectedCategory =
    initialFilters?.category || searchParams.get('category') || 'All';
  const selectedSubCategory =
    initialFilters?.subCategory || searchParams.get('subCategory') || '';
  const selectedType = initialFilters?.type || searchParams.get('type') || '';

  const selectedColors = searchParams.get('color')?.split(',') || [];
  const selectedSizes = searchParams.get('sizes')?.split(',') || [];
  const sortBy = searchParams.get('sort') || 'Newest';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load view mode from localStorage on mount
  useEffect(() => {
    const savedView = localStorage.getItem('lumiere_shop_view') as
      | 'grid'
      | 'list';

    if (savedView && (savedView === 'grid' || savedView === 'list')) {
      setViewMode(savedView);
    }
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const query: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          query[key] = value;
        });

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

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [colorRes, catRes] = await Promise.all([
          getColors({ limit: '100' }),
          getCategories({ limit: '100' }),
        ]);

        if (colorRes.data) setDbColors(colorRes.data);
        if (catRes.data) setDbCategories(catRes.data);
      } catch (error) {
        console.error('Failed to fetch filter metadata', error);
      }
    };
    fetchMetadata();
  }, []);

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
        localStorage.setItem('lumiere_shop_view', nextView);
        return; // Don't add to URL params
      }

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

    params.delete('view'); // Final safety check to ensure 'view' is stripped

    if (!newParams.page) {
      params.delete('page');
    }

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

  const handleClearAll = () => {
    updateURL({
      category: 'All',
      subCategory: '',
      type: '',
      color: null,
      sizes: null,
      q: null,
    });
  };

  return (
    <TransitionContext.Provider value={{ startTransition, isPending }}>
      <div
        className={cn(
          'bg-background mt-8 min-h-screen transition-opacity',
          isPending && 'pointer-events-none opacity-50',
        )}
      >
        <div className="container mx-auto px-4">
          <ShopHeader
            dbCategories={dbCategories}
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            selectedType={selectedType}
            totalItems={meta?.total || 0}
            viewMode={viewMode}
            sortBy={sortBy}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            onUpdateURL={updateURL}
          >
            <FilterSection
              dbCategories={dbCategories}
              dbColors={dbColors}
              selectedCategory={selectedCategory}
              selectedSubCategory={selectedSubCategory}
              selectedType={selectedType}
              selectedColors={selectedColors}
              selectedSizes={selectedSizes}
              sortBy={sortBy}
              onUpdateURL={updateURL}
              onToggleMultiFilter={toggleMultiFilter}
              showSort
            />
          </ShopHeader>

          <ActiveFilters
            selectedCategory={selectedCategory}
            selectedColors={selectedColors}
            selectedSizes={selectedSizes}
            selectedQuery={searchParams.get('q') || ''}
            onUpdateURL={updateURL}
            onToggleMultiFilter={toggleMultiFilter}
            onClearAll={handleClearAll}
          />

          <div className="flex items-start gap-12">
            <aside className="sticky top-32 hidden w-64 shrink-0 flex-col gap-10 lg:flex">
              <FilterSection
                dbCategories={dbCategories}
                dbColors={dbColors}
                selectedCategory={selectedCategory}
                selectedSubCategory={selectedSubCategory}
                selectedType={selectedType}
                selectedColors={selectedColors}
                selectedSizes={selectedSizes}
                sortBy={sortBy}
                onUpdateURL={updateURL}
                onToggleMultiFilter={toggleMultiFilter}
                showCategory={false}
              />
            </aside>

            <main className="flex-1">
              <ProductList
                products={allProducts}
                loading={loading}
                viewMode={viewMode}
              />

              {meta && (
                <div className="border-border mt-12 flex justify-center border-t pt-12">
                  <AppPagination meta={meta} />
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </TransitionContext.Provider>
  );
};

export default ShopContent;
