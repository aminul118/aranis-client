'use client';

import AppPagination from '@/components/common/pagination/AppPagination';
import { TransitionContext } from '@/context/useTransition';
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
import FilterSection from '../../shop/_components/FilterSection';
import ProductList from '../../shop/_components/ProductList';
import ShopHeader from '../../shop/_components/ShopHeader';

const OffersContent = () => {
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

  const selectedOfferTag = searchParams.get('tag') || 'All';
  const selectedCategory = searchParams.get('category') || 'All';
  const selectedColors = searchParams.get('color')?.split(',') || [];
  const selectedSizes = searchParams.get('sizes')?.split(',') || [];
  const sortBy = searchParams.get('sort') || 'Newest';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const query: Record<string, string> = {
          isOffer: 'true',
        };
        searchParams.forEach((value, key) => {
          if (key === 'tag') {
            query.offerTag = value;
          } else {
            query[key] = value;
          }
        });

        if (!query.limit) query.limit = limit.toString();
        if (!query.page) query.page = page.toString();

        const { data, meta: productMeta } = await getProducts(query);
        setAllProducts(data || []);
        setMeta(productMeta || null);
      } catch (error) {
        console.error('Failed to fetch offer products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [searchParams, page]);

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

    Object.entries(newParams).forEach(([key, value]) => {
      if (key === 'view') {
        const nextView = value as 'grid' | 'list';
        setViewMode(nextView);
        return;
      }

      if (value === null || value === 'All' || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    if (!newParams.page) {
      params.delete('page');
    }

    const queryStr = params.toString() ? `?${params.toString()}` : '';

    startTransition(() => {
      router.push(`/offers${queryStr}`, { scroll: false });
    });
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
          'bg-background mt-8 min-h-screen transition-opacity',
          isPending && 'pointer-events-none opacity-50',
        )}
      >
        <div className="container mx-auto px-4">
          <div className="mb-8 rounded-3xl border border-blue-500/20 bg-blue-600/10 p-8">
            <h1 className="mb-2 text-4xl font-black tracking-tighter text-blue-600 uppercase italic">
              Exclusive Offers
            </h1>
            <p className="text-muted-foreground font-medium">
              Grab your favorites at unbeatable prices. Limited time only!
            </p>
          </div>

          <ShopHeader
            dbCategories={dbCategories}
            selectedCategory={selectedCategory}
            selectedSubCategory=""
            selectedType=""
            totalItems={meta?.total || 0}
            viewMode={viewMode}
            sortBy={sortBy}
            isSidebarOpen={false}
            setIsSidebarOpen={() => {}}
            onUpdateURL={updateURL}
          >
            <div className="flex flex-col gap-4">
              <div className="mb-4 flex flex-wrap gap-2">
                {[
                  'All',
                  'Pakistani dress',
                  'Indian dress',
                  'Eid offer',
                  'Normal discount',
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() =>
                      updateURL({ tag: tag === 'All' ? null : tag })
                    }
                    className={cn(
                      'rounded-full border-2 px-6 py-2 text-xs font-black tracking-widest uppercase transition-all',
                      selectedOfferTag === tag ||
                        (tag === 'All' && selectedOfferTag === 'All')
                        ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                        : 'border-border bg-card text-muted-foreground hover:border-blue-500/50',
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <FilterSection
                dbCategories={dbCategories}
                dbColors={dbColors}
                selectedCategory={selectedCategory}
                selectedSubCategory=""
                selectedType=""
                selectedColors={selectedColors}
                selectedSizes={selectedSizes}
                sortBy={sortBy}
                onUpdateURL={updateURL}
                onToggleMultiFilter={toggleMultiFilter}
                showSort
              />
            </div>
          </ShopHeader>

          <div className="mt-8 flex items-start gap-12">
            <aside className="sticky top-32 hidden w-64 shrink-0 flex-col gap-10 lg:flex">
              <FilterSection
                dbCategories={dbCategories}
                dbColors={dbColors}
                selectedCategory={selectedCategory}
                selectedSubCategory=""
                selectedType=""
                selectedColors={selectedColors}
                selectedSizes={selectedSizes}
                sortBy={sortBy}
                onUpdateURL={updateURL}
                onToggleMultiFilter={toggleMultiFilter}
                showCategory={true}
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

export default OffersContent;
