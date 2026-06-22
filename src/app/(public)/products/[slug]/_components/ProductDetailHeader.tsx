import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { IProduct } from '@/services/product/product.interface';
import { Copy, Facebook, Heart, MessageCircle, Share2 } from 'lucide-react';

interface ProductDetailHeaderProps {
  product: IProduct;
  currentVariant: any;
  isWishlisted: boolean;
  toggleWishlist: (product: IProduct, color: string, size: string) => void;
  handleShare: (platform: 'facebook' | 'messenger' | 'copy') => void;
  currentSelectedColor: string;
  selectedSize: string;
}

export const ProductDetailHeader = ({
  product,
  currentVariant,
  isWishlisted,
  toggleWishlist,
  handleShare,
  currentSelectedColor,
  selectedSize,
}: ProductDetailHeaderProps) => {
  return (
    <>
      {/* Brand & Stats */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              toggleWishlist(product, currentSelectedColor, selectedSize)
            }
            aria-label="Toggle wishlist"
            className={`border-border/50 hover:bg-muted rounded-full border p-3.5 transition-all ${isWishlisted ? 'bg-red-50 text-red-500' : 'text-muted-foreground'}`}
          >
            <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Share product"
                className="border-border/50 text-muted-foreground hover:bg-muted rounded-full border p-3.5 transition-all outline-none"
              >
                <Share2 size={20} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="border-border bg-card w-56 rounded-2xl p-2 shadow-2xl"
            >
              <DropdownMenuItem
                onClick={() => handleShare('facebook')}
                className="flex cursor-pointer items-center gap-3 rounded-xl p-3 focus:bg-blue-500/10 focus:text-blue-600"
              >
                <Facebook size={18} />
                <span className="font-bold">Share on Facebook</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleShare('messenger')}
                className="flex cursor-pointer items-center gap-3 rounded-xl p-3 focus:bg-blue-500/10 focus:text-blue-600"
              >
                <MessageCircle size={18} />
                <span className="font-bold">Send in Messenger</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleShare('copy')}
                className="focus:bg-muted flex cursor-pointer items-center gap-3 rounded-xl p-3"
              >
                <Copy size={18} />
                <span className="font-bold">Copy Product Link</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Title & Price */}
      <div>
        <h1 className="text-foreground mb-6 text-2xl leading-[1.3] font-bold capitalize md:text-3xl">
          {product.name}
        </h1>
        <div className="flex items-center gap-6">
          {(product.salePrice ?? 0) > 0 || product.isOffer ? (
            <div className="flex items-center gap-4">
              <span className="text-primary text-3xl font-bold md:text-4xl">
                ৳{(product.salePrice ?? product.price).toLocaleString('en-IN')}
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-lg font-medium text-zinc-600 line-through md:text-xl dark:text-zinc-400">
                  ৳{product.price.toLocaleString('en-IN')}
                </span>
                {(product.salePrice ?? 0) > 0 && (
                  <span className="w-fit rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-bold text-red-700">
                    Save ৳
                    {(product.price - (product.salePrice ?? 0)).toLocaleString(
                      'en-IN',
                    )}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-foreground text-2xl font-bold">
              ৳{product.price.toLocaleString('en-IN')}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-muted-foreground text-xs font-black tracking-widest uppercase">
          SKU:
        </span>
        <span className="text-foreground text-sm font-bold tracking-tight">
          {currentVariant?.sku || product.sku || 'N/A'}
        </span>
      </div>

      <div className="from-border/50 via-border h-px bg-linear-to-r to-transparent" />
    </>
  );
};

export default ProductDetailHeader;
