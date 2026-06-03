'use client';

import Image from '@/components/common/SafeImage';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/context/WishlistContext';
import { cn, extractPlainText } from '@/lib/utils';
import { IProduct } from '@/types';
import { Heart, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: IProduct;
  index?: number;
  viewMode?: 'grid' | 'list';
  selectedColors?: string[];
}

const ProductCard = ({
  product,
  viewMode = 'grid',
  selectedColors = [],
}: ProductCardProps) => {
  const router = useRouter();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isList = viewMode === 'list';
  const wishlisted = isInWishlist(product._id as string);

  const getValidImage = (src: any) => {
    if (
      !src ||
      typeof src !== 'string' ||
      src === '[]' ||
      src === 'null' ||
      src === ''
    ) {
      return '';
    }
    return src;
  };

  // Find matching variant based on selected colors
  const matchedVariant = product.variants?.find((variant) =>
    selectedColors.some((color) => {
      const sColor = color.toLowerCase();
      const vColor = variant.color?.toLowerCase();
      return vColor
        ? vColor === sColor ||
            vColor.includes(sColor) ||
            sColor.includes(vColor)
        : false;
    }),
  );

  const primaryThumbnail = getValidImage(
    matchedVariant?.thumbnails?.[0] || product.thumbnails?.[0],
  );
  const secondaryThumbnail = getValidImage(
    matchedVariant?.thumbnails?.[1] || product.thumbnails?.[1],
  );

  const productUrl = `/products/${product.slug || product._id}${
    matchedVariant ? `?color=${encodeURIComponent(matchedVariant.color)}` : ''
  }`;

  return (
    <div
      className={cn(
        'group relative cursor-pointer overflow-hidden bg-white transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] dark:bg-zinc-900/50 dark:hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)]',
        isList && 'flex flex-row gap-8',
      )}
      onClick={() => router.push(productUrl)}
    >
      {/* Image Container */}
      <div
        className={cn(
          'relative overflow-hidden bg-zinc-100 dark:bg-zinc-800',
          isList
            ? 'aspect-square w-40 shrink-0 sm:w-64'
            : 'aspect-[4/5] w-full',
        )}
      >
        <Image
          key="primary-image"
          src={primaryThumbnail}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        />
        {secondaryThumbnail && (
          <Image
            key="secondary-image"
            src={secondaryThumbnail}
            alt={`${product.name} - View 2`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover opacity-0 transition-all duration-1000 ease-out group-hover:scale-110 group-hover:opacity-100"
          />
        )}

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
          {(product.salePrice ?? 0) > 0 && (
            <div className="rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-black tracking-tight text-red-500 uppercase shadow-sm backdrop-blur-sm dark:bg-black/80">
              {Math.round((1 - (product.salePrice ?? 0) / product.price) * 100)}
              % OFF
            </div>
          )}
        </div>

        {/* Wishlist - Heart floating with soft glow */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={cn(
            'absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-500 active:scale-90',
            wishlisted
              ? 'bg-red-500 text-white shadow-[0_8px_20px_rgba(239,68,68,0.4)]'
              : 'bg-white/90 text-zinc-900 shadow-sm hover:bg-white dark:bg-zinc-900/90 dark:text-white dark:hover:bg-zinc-800',
          )}
        >
          <Heart
            size={16}
            className="transition-all duration-300"
            fill={wishlisted ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      {/* Content */}
      <div
        className={cn(
          'flex flex-1 flex-col',
          isList ? 'py-4 pr-4' : 'p-5 pt-4',
        )}
      >
        <div className="mb-1 flex items-center justify-between">
          <p className="text-muted-foreground/80 text-[10px] font-bold tracking-[0.15em] uppercase">
            {product.category || 'Collection'}
          </p>
        </div>

        <h2 className="mb-3 line-clamp-1 text-sm font-bold tracking-tight text-zinc-900 transition-colors group-hover:text-blue-500 dark:text-white">
          {product.name}
        </h2>

        {isList && (
          <p className="text-muted-foreground mb-6 line-clamp-2 text-xs leading-relaxed">
            {extractPlainText(product.description)}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="flex flex-col">
            {(product.salePrice ?? 0) > 0 || product.isOffer ? (
              <div className="flex flex-col gap-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">
                    ৳
                    {(product.salePrice ?? product.price).toLocaleString(
                      'en-IN',
                    )}
                  </span>
                  <span className="text-muted-foreground/50 text-[11px] font-medium line-through">
                    ৳{product.price.toLocaleString('en-IN')}
                  </span>
                </div>
                {(product.salePrice ?? 0) > 0 &&
                  product.price > (product.salePrice ?? 0) && (
                    <span className="text-[10px] font-bold tracking-tight text-red-500">
                      Save ৳
                      {(
                        product.price - (product.salePrice ?? 0)
                      ).toLocaleString('en-IN')}
                    </span>
                  )}
              </div>
            ) : (
              <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">
                ৳{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <Button
            size="icon"
            aria-label="Add to cart"
            disabled={product.stock < 1}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(productUrl);
            }}
            className={cn(
              'h-10 w-10 rounded-full border-none transition-all duration-500 active:scale-95',
              product.stock < 1
                ? 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800'
                : 'bg-zinc-900 text-white shadow-xl shadow-zinc-900/10 hover:-translate-y-1 dark:bg-white dark:text-zinc-900 dark:shadow-white/5',
            )}
          >
            <ShoppingCart size={16} strokeWidth={2.5} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
