'use client';

import AnimatedSection from '@/components/common/AnimatedSection';
import ProductCard from '@/components/common/ProductCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { IProduct } from '@/services/product/product.interface';
import { useRouter } from 'next/navigation';

interface ProductListProps {
  products: IProduct[];
  loading: boolean;
  viewMode: 'grid' | 'list';
  selectedColors?: string[];
}

const ProductList = ({
  products,
  loading,
  viewMode,
  selectedColors,
}: ProductListProps) => {
  const router = useRouter();

  const filteredProducts = products.filter((product) => {
    if (!selectedColors || selectedColors.length === 0) return true;

    return selectedColors.some((selectedColor) => {
      const sColor = selectedColor.toLowerCase();
      const matchMain = product.color
        ? product.color.toLowerCase() === sColor ||
          product.color.toLowerCase().includes(sColor) ||
          sColor.includes(product.color.toLowerCase())
        : false;

      const matchVariant = product.variants?.some((v) => {
        const vColor = v.color?.toLowerCase();
        return vColor
          ? vColor === sColor ||
              vColor.includes(sColor) ||
              sColor.includes(vColor)
          : false;
      });

      return matchMain || matchVariant;
    });
  });

  if (loading && filteredProducts.length === 0) {
    return <div className="h-96 w-full" />;
  }

  if (filteredProducts.length === 0) {
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
          ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
          : 'grid-cols-1',
      )}
    >
      {filteredProducts.map((product, index) => (
        <AnimatedSection key={product._id} variant="fadeUp">
          <ProductCard
            product={product}
            index={index}
            viewMode={viewMode}
            selectedColors={selectedColors}
          />
        </AnimatedSection>
      ))}
    </div>
  );
};

export default ProductList;
