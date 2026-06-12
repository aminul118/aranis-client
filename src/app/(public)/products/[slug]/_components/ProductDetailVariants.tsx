import Image from '@/components/common/SafeImage';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { IProduct } from '@/types';
import { Check } from 'lucide-react';

interface ProductDetailVariantsProps {
  product: IProduct;
  selectedVariantIndex: number;
  setSelectedVariantIndex: (idx: number) => void;
}

export const ProductDetailVariants = ({
  product,
  selectedVariantIndex,
  setSelectedVariantIndex,
}: ProductDetailVariantsProps) => {
  if (!product.variants || product.variants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-sm font-black tracking-[0.2em] uppercase">
          Select Color
        </h2>
        <Badge
          variant="secondary"
          className="rounded-lg px-3 py-1 text-[10px] font-black tracking-tighter uppercase"
        >
          {selectedVariantIndex === -1
            ? product.color
            : product.variants[selectedVariantIndex].color}
        </Badge>
      </div>
      <div className="flex flex-wrap gap-4">
        {/* Default/Main Product Variant */}
        <button
          onClick={() => setSelectedVariantIndex(-1)}
          className={cn(
            'group relative h-24 w-20 overflow-hidden rounded-2xl border-2 transition-all duration-500',
            selectedVariantIndex === -1
              ? 'border-primary shadow-primary/20 z-10 scale-110 shadow-2xl'
              : 'border-border/40 hover:border-primary/50 opacity-70 hover:scale-105 hover:opacity-100',
          )}
        >
          <Image
            src={product.thumbnails?.[0] || '/placeholder.jpg'}
            alt={product.color}
            fill
            sizes="80px"
            quality={100}
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div
            className={cn(
              'absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500',
              selectedVariantIndex === -1
                ? 'opacity-100'
                : 'opacity-0 group-hover:opacity-100',
            )}
          />
          <span className="absolute inset-x-0 bottom-2 text-center text-[9px] font-black tracking-tighter text-white uppercase drop-shadow-md">
            {product.color}
          </span>
          {selectedVariantIndex === -1 && (
            <div className="bg-primary absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full shadow-lg">
              <Check
                className="text-primary-foreground h-2.5 w-2.5"
                strokeWidth={4}
              />
            </div>
          )}
        </button>

        {/* Other Variants */}
        {product.variants.map((variant, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedVariantIndex(idx)}
            className={cn(
              'group relative h-24 w-20 overflow-hidden rounded-2xl border-2 transition-all duration-500',
              selectedVariantIndex === idx
                ? 'border-primary shadow-primary/20 z-10 scale-110 shadow-2xl'
                : 'border-border/40 hover:border-primary/50 opacity-70 hover:scale-105 hover:opacity-100',
            )}
          >
            <Image
              src={variant.thumbnails?.[0] || product.thumbnails?.[0]}
              alt={variant.color}
              fill
              sizes="80px"
              quality={100}
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div
              className={cn(
                'absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500',
                selectedVariantIndex === idx
                  ? 'opacity-100'
                  : 'opacity-0 group-hover:opacity-100',
              )}
            />
            <span className="absolute inset-x-0 bottom-2 text-center text-[9px] font-black tracking-tighter text-white uppercase drop-shadow-md">
              {variant.color}
            </span>
            {selectedVariantIndex === idx && (
              <div className="bg-primary absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full shadow-lg">
                <Check
                  className="text-primary-foreground h-2.5 w-2.5"
                  strokeWidth={4}
                />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductDetailVariants;
