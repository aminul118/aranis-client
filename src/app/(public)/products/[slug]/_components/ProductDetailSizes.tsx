import Image from '@/components/common/SafeImage';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { IProduct, IVariantSize } from '@/types';
import { Ruler } from 'lucide-react';

interface ProductDetailSizesProps {
  product: IProduct;
  selectedVariantIndex: number;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
}

export const ProductDetailSizes = ({
  product,
  selectedVariantIndex,
  selectedSize,
  setSelectedSize,
}: ProductDetailSizesProps) => {
  if (!product.sizes || product.sizes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-sm font-black tracking-widest uppercase">
          Select Size
        </h2>
      </div>
      <div className="flex flex-wrap gap-3">
        {product.sizes.map((size) => {
          const sizeStock = (() => {
            if (selectedVariantIndex >= 0) {
              const variant = product.variants?.[selectedVariantIndex];
              const sizeObj = variant?.sizes?.find(
                (s: IVariantSize) => s.size === size,
              );
              return sizeObj ? sizeObj.stock : 0;
            } else {
              const sizeObj = product.sizeStock?.find(
                (s: IVariantSize) => s.size === size,
              );
              return sizeObj ? sizeObj.stock : 0;
            }
          })();

          const isStockOut = sizeStock === 0;

          return (
            <button
              key={size}
              onClick={() => !isStockOut && setSelectedSize(size)}
              disabled={isStockOut}
              className={cn(
                'group relative flex min-w-16 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-lg border-2 px-5 py-3 transition-all duration-300',
                isStockOut
                  ? 'cursor-not-allowed border-transparent bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                  : selectedSize === size
                    ? 'border-blue-600 bg-blue-600 text-white shadow-md dark:border-blue-500 dark:bg-blue-600'
                    : 'border-blue-600 bg-transparent text-slate-800 hover:bg-blue-50 dark:border-blue-500 dark:text-slate-200 dark:hover:bg-blue-900/30',
              )}
            >
              <span className="text-sm font-black tracking-widest uppercase">
                {size}
              </span>
            </button>
          );
        })}
      </div>

      {/* Size Guide Button */}
      {product.sizeGuide && (
        <div className="mt-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full rounded-xl border-2 border-zinc-200 font-bold text-zinc-600 transition-all hover:bg-zinc-50 sm:w-auto dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
              >
                <Ruler size={16} className="mr-2 text-blue-500" />
                {(product.sizeGuide as any).name || 'View Size Guide'}
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-5xl overflow-hidden border-none bg-transparent p-0 shadow-none sm:max-w-5xl">
              <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-zinc-950">
                <div className="flex items-center gap-3 border-b border-zinc-100 p-4 dark:border-zinc-800">
                  <Ruler size={16} className="text-blue-500" />
                  <DialogTitle className="m-0 text-sm font-bold tracking-widest uppercase">
                    {(product.sizeGuide as any).name || 'Size Guide'}
                  </DialogTitle>
                </div>
                <div className="relative max-h-[85vh] w-full overflow-auto">
                  <Image
                    src={(product.sizeGuide as any).image}
                    alt={(product.sizeGuide as any).name || 'Size Guide'}
                    width={1600}
                    height={1600}
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className="h-auto w-full min-w-[600px] object-contain p-2 md:min-w-full md:p-6"
                    priority
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default ProductDetailSizes;
