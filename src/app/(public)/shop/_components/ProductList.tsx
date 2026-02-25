'use client';

import ProductCard from '@/components/common/ProductCard';
import ProductCardSkeleton from '@/components/common/loader/ProductCardSkeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IProduct } from '@/services/product/product';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface ProductListProps {
  products: IProduct[];
  loading: boolean;
  viewMode: 'grid' | 'list';
}

const ProductList = ({ products, loading, viewMode }: ProductListProps) => {
  const router = useRouter();

  if (loading) {
    return (
      <div
        className={cn(
          'grid gap-6 md:gap-8',
          viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
            : 'grid-cols-1',
        )}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} viewMode={viewMode} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
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
    );
  }

  return (
    <div
      className={cn(
        'grid gap-6 md:gap-8',
        viewMode === 'grid'
          ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
          : 'grid-cols-1',
      )}
    >
      {products.map((product) => (
        <motion.div
          key={product._id}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <ProductCard product={product} viewMode={viewMode} />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductList;
