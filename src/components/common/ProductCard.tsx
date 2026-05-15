'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { useWishlist } from '@/context/WishlistContext';
import { cn } from '@/lib/utils';
import { IProduct } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ProductCardProps {
  product: IProduct;
  index?: number;
  viewMode?: 'grid' | 'list';
}

const ProductCard = ({
  product,
  index = 0,
  viewMode = 'grid',
}: ProductCardProps) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useUser();
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
      return 'https://placehold.co/600x800?text=No+Image';
    }
    return src;
  };

  const primaryImage = getValidImage(product.image);
  const secondaryImage = product.images?.find(
    (img) => img !== product.image && img !== '[]' && img !== '',
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.05,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        'group relative cursor-pointer overflow-hidden bg-white transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] dark:bg-zinc-900/50 dark:hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)]',
        isList && 'flex flex-row gap-8',
      )}
      onClick={() => router.push(`/products/${product.slug || product._id}`)}
    >
      {/* Image Container */}
      <div
        className={cn(
          'relative overflow-hidden bg-zinc-100 dark:bg-zinc-800',
          isList
            ? 'aspect-square w-40 shrink-0 sm:w-64'
            : 'aspect-[3.8/5] w-full',
        )}
      >
        <AnimatePresence mode="wait">
          <Image
            key="primary-image"
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
          />
          {secondaryImage && (
            <Image
              key="secondary-image"
              src={secondaryImage}
              alt={`${product.name} - View 2`}
              fill
              className="object-cover opacity-0 transition-all duration-1000 ease-out group-hover:scale-110 group-hover:opacity-100"
            />
          )}
        </AnimatePresence>

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
          {(product.salePrice ?? 0) > 0 && (
            <div className="rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-black tracking-tight text-red-500 uppercase shadow-sm backdrop-blur-sm dark:bg-black/80">
              {Math.round((1 - (product.salePrice ?? 0) / product.price) * 100)}
              % OFF
            </div>
          )}
          {product.isOffer && product.offerTag && (
            <div className="rounded-full bg-blue-500 px-2.5 py-1 text-[9px] font-black tracking-tight text-white uppercase shadow-sm">
              {product.offerTag}
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
          <p className="text-muted-foreground/60 text-[10px] font-bold tracking-[0.15em] uppercase">
            {product.category || 'Collection'}
          </p>
        </div>

        <h3 className="mb-3 line-clamp-1 text-sm font-bold tracking-tight text-zinc-900 transition-colors group-hover:text-blue-500 dark:text-white">
          {product.name}
        </h3>

        {isList && (
          <p className="text-muted-foreground mb-6 line-clamp-2 text-xs leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="flex flex-col">
            {(product.salePrice ?? 0) > 0 || product.isOffer ? (
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">
                  ৳{(product.salePrice ?? product.price).toLocaleString()}
                </span>
                <span className="text-muted-foreground/50 text-[11px] font-medium line-through">
                  ৳{product.price.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">
                ৳{product.price.toLocaleString()}
              </span>
            )}
          </div>

          <Button
            size="icon"
            disabled={product.stock < 1}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product as any);
              toast.success(`${product.name} added!`, {
                className: 'rounded-full bg-zinc-900 text-white font-bold',
              });
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
    </motion.div>
  );
};

export default ProductCard;
