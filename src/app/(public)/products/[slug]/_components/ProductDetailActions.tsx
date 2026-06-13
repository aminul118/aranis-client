import { Button } from '@/components/ui/button';
import { BellRing, ShoppingCart } from 'lucide-react';

interface ProductDetailActionsProps {
  currentStock: number;
  isRequesting: boolean;
  handleRestockRequest: () => void;
  handleAddToCart: (shouldRedirect: boolean) => void;
}

export const ProductDetailActions = ({
  currentStock,
  isRequesting,
  handleRestockRequest,
  handleAddToCart,
}: ProductDetailActionsProps) => {
  return (
    <div className="flex flex-col gap-4 pt-6">
      <div className="flex flex-row gap-3">
        {currentStock < 1 ? (
          <div className="flex flex-1 flex-col gap-3 md:flex-row">
            <Button
              disabled
              size="lg"
              className="w-full flex-1 cursor-not-allowed rounded-2xl border-2 border-red-500/30 bg-red-500/10 py-4 text-sm font-black text-red-500 shadow-none"
            >
              STOCK OUT
            </Button>
            <Button
              size="lg"
              onClick={handleRestockRequest}
              disabled={isRequesting}
              variant="outline"
              className="w-full flex-1 rounded-2xl border-2 border-zinc-200 py-4 text-sm font-bold text-zinc-600 transition-all hover:bg-zinc-50 active:scale-[0.98] dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900/50"
            >
              <BellRing className="mr-2 h-4 w-4 animate-pulse text-blue-500" />{' '}
              {isRequesting ? 'Requesting...' : 'Notify Me When Restocked'}
            </Button>
          </div>
        ) : (
          <>
            <Button
              onClick={() => handleAddToCart(false)}
              size="lg"
              variant="outline"
              className="border-primary/50 text-primary hover:bg-primary/5 flex-1 rounded-2xl border-2 py-4 text-sm font-black transition-all active:scale-[0.98]"
            >
              Add to Cart <ShoppingCart className="ml-2 h-4 w-4" />
            </Button>
            <Button
              onClick={() => handleAddToCart(true)}
              size="lg"
              className="shadow-primary/20 flex-1 rounded-2xl py-4 text-sm font-black shadow-xl transition-all active:scale-[0.98]"
            >
              Buy Now
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetailActions;
