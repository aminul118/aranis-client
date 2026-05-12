'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { useWishlist } from '@/context/WishlistContext';
import { cn } from '@/lib/utils';
import { IProduct } from '@/services/product/product';
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      layout
      className={cn(
        'group bg-card/30 border-border/50 cursor-pointer overflow-hidden rounded-[2rem] border transition-all duration-500 hover:border-blue-500/30 hover:shadow-[0_20px_50px_rgba(59,130,246,0.1)]',
        isList && 'flex flex-col gap-8 p-5 sm:flex-row',
      )}
      onClick={() => router.push(`/products/${product.slug || product._id}`)}
    >
      <div
        className={cn(
          'relative block overflow-hidden',
          isList
            ? 'aspect-square w-full rounded-2xl sm:w-56'
            : 'aspect-[4/5] w-full',
        )}
      >
        <AnimatePresence mode="wait">
          <div className="absolute inset-0 z-0 bg-slate-900/10 transition-colors group-hover:bg-transparent" />
          <Image
            key="primary-image"
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover transition-all duration-1000 ease-in-out group-hover:scale-110"
          />
          {secondaryImage && (
            <Image
              key="secondary-image"
              src={secondaryImage}
              alt={`${product.name} - Second View`}
              fill
              className="object-cover opacity-0 transition-all duration-1000 ease-in-out group-hover:scale-110 group-hover:opacity-100"
            />
          )}
        </AnimatePresence>

        {/* Badges - Floating Pill Style */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {product.salePrice && product.salePrice > 0 && (
            <span className="rounded-full bg-red-500/90 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-red-500/20 backdrop-blur-md">
              {Math.round((1 - product.salePrice / product.price) * 100)}% OFF
            </span>
          )}
          {product.isOffer && product.offerTag && (
            <span className="rounded-full bg-blue-600/90 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-blue-500/20 backdrop-blur-md">
              {product.offerTag}
            </span>
          )}
          {product.stock < 1 && (
            <span className="rounded-full bg-slate-900/90 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase shadow-lg backdrop-blur-md">
              Out of Stock
            </span>
          )}
        </div>

        {/* Wishlist Button - Glassmorphism */}
        {user && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={cn(
              'absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 backdrop-blur-xl transition-all duration-500',
              wishlisted
                ? 'scale-110 border-none bg-red-500 text-white shadow-xl shadow-red-500/40'
                : 'bg-white/10 text-white hover:scale-110 hover:border-white/30 hover:bg-white/20',
            )}
          >
            <Heart
              size={20}
              className="transition-transform duration-300 group-active:scale-90"
              fill={wishlisted ? 'currentColor' : 'none'}
            />
          </button>
        )}
      </div>

      <div
        className={cn(
          'flex flex-1 flex-col',
          isList ? 'py-4' : 'px-5 pt-5 pb-6 sm:px-7 sm:pt-6 sm:pb-8',
        )}
      >
        <h3 className="text-foreground mb-3 line-clamp-2 min-h-[3.5rem] text-xl leading-tight font-black capitalize transition-colors duration-300 group-hover:text-blue-500">
          {product.name}
        </h3>

        {isList && (
          <p className="text-muted-foreground mb-8 line-clamp-3 flex-1 text-sm leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-4">
          <div className="flex flex-col">
            {product.salePrice && product.salePrice > 0 ? (
              <div className="flex flex-col">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-muted-foreground text-sm font-medium line-through decoration-red-500/50">
                    ৳{product.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-black text-red-500">
                    -{Math.round((1 - product.salePrice / product.price) * 100)}
                    %
                  </span>
                </div>
                <span className="text-3xl font-black tracking-tighter text-blue-500 sm:text-4xl">
                  ৳{product.salePrice.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="text-foreground text-3xl font-black tracking-tighter sm:text-4xl">
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
              toast.success(`${product.name} added to cart!`, {
                icon: <ShoppingCart className="text-blue-500" size={16} />,
                className:
                  'rounded-2xl border-white/10 bg-slate-900/90 backdrop-blur-xl text-white font-bold',
              });
            }}
            className={cn(
              'h-12 w-12 rounded-2xl bg-blue-600 p-0 text-white shadow-xl shadow-blue-500/30 transition-all duration-300 hover:bg-blue-700 hover:shadow-blue-500/50 active:scale-95 sm:h-14 sm:w-14',
              product.stock < 1 && 'bg-slate-800 shadow-none',
            )}
          >
            <ShoppingCart size={22} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
