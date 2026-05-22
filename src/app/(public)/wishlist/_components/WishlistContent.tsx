'use client';

import Image from '@/components/common/SafeImage';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { motion } from 'framer-motion';
import { Heart, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function WishlistContent() {
  const { wishlist, wishlistCount, updateQuantity, removeFromWishlist } =
    useWishlist();
  const { addToCart } = useCart();

  if (wishlistCount === 0) {
    return (
      <div className="bg-background flex min-h-[70vh] flex-col items-center justify-center px-4 pt-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-pink-50/80 text-pink-400 dark:bg-pink-900/20"
          >
            <Heart
              size={48}
              strokeWidth={1.5}
              fill="currentColor"
              className="opacity-20"
            />
            <Heart size={48} strokeWidth={1.5} className="absolute" />
          </motion.div>

          <h1 className="text-foreground mb-3 text-3xl font-bold tracking-tight">
            Nothing here yet
          </h1>

          <p className="text-muted-foreground mb-10 max-w-[280px] text-base leading-relaxed">
            Tap the heart on any item to save it here for later!
          </p>

          <Link
            href="/shop"
            className="flex h-14 items-center justify-center rounded-2xl bg-pink-500 px-10 text-sm font-bold text-white shadow-lg shadow-pink-500/20 transition-all hover:bg-pink-600 active:scale-95"
          >
            Explore Collections
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleDecrement = (id: string, currentQty: number) => {
    if (currentQty > 1) {
      updateQuantity(id, currentQty - 1);
    }
  };

  const handleIncrement = (id: string, currentQty: number) => {
    updateQuantity(id, currentQty + 1);
  };

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-2">
            <h1 className="flex items-center gap-4 text-5xl font-black tracking-tighter uppercase">
              My Wishlist
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/10 text-sm font-black tracking-normal text-blue-600 backdrop-blur-sm">
                {wishlistCount}
              </span>
            </h1>
            <p className="text-muted-foreground/60 text-lg font-medium">
              Items you've saved to buy later.
            </p>
          </div>
          <Link
            href="/shop"
            className="group flex items-center gap-3 rounded-full border border-blue-600/20 bg-blue-600/5 px-8 py-3 text-sm font-black tracking-widest text-blue-600 uppercase transition-all hover:bg-blue-600 hover:text-white"
          >
            Continue Shopping{' '}
            <ShoppingBag
              size={18}
              className="transition-transform group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          {wishlist
            .filter((item) => item && item.product)
            .map((item) => {
              const product = item.product;
              const currentPrice = product.salePrice || product.price;
              const qty = item.quantity || 1;

              return (
                <div
                  key={item._id}
                  className="border-border bg-card/40 group relative flex flex-col items-center gap-8 overflow-hidden rounded-[32px] border p-5 backdrop-blur-xl transition-all hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5 sm:flex-row"
                >
                  <Link href={`/products/${product.slug}`} className="shrink-0">
                    <div className="bg-muted relative h-32 w-32 overflow-hidden rounded-2xl">
                      <Image
                        src={product.thumbnails?.[0] || '/placeholder.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {product.salePrice &&
                        product.salePrice < product.price && (
                          <div className="absolute top-2 left-2 rounded-full bg-red-500 px-2 py-0.5 text-[8px] font-black text-white uppercase">
                            Sale
                          </div>
                        )}
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col justify-center text-center sm:text-left">
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-foreground line-clamp-1 text-xl font-black tracking-tight transition-colors group-hover:text-blue-600"
                    >
                      {product.name}
                    </Link>
                    <div className="mt-2 flex items-center justify-center gap-3 sm:justify-start">
                      <span className="text-foreground text-2xl font-black tracking-tighter">
                        ৳{currentPrice.toLocaleString()}
                      </span>
                      {product.salePrice &&
                        product.salePrice < product.price && (
                          <span className="text-muted-foreground/40 font-medium line-through">
                            ৳{product.price.toLocaleString()}
                          </span>
                        )}
                    </div>
                  </div>

                  <div className="flex w-full flex-col items-center gap-6 sm:w-auto sm:flex-row">
                    {/* Qty and Total */}
                    <div className="flex items-center gap-8">
                      <div className="bg-muted/30 border-border flex items-center gap-4 rounded-full border p-1">
                        <button
                          onClick={() => handleDecrement(item._id, qty)}
                          disabled={qty <= 1}
                          className="text-muted-foreground hover:bg-background hover:text-foreground flex h-8 w-8 items-center justify-center rounded-full transition-all disabled:opacity-30"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-foreground min-w-[20px] text-center text-sm font-black">
                          {qty}
                        </span>
                        <button
                          onClick={() => handleIncrement(item._id, qty)}
                          className="text-muted-foreground hover:bg-background hover:text-foreground flex h-8 w-8 items-center justify-center rounded-full transition-all"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="min-w-[100px] text-right">
                        <p className="text-foreground text-xl font-black tracking-tighter">
                          ৳{(currentPrice * qty).toLocaleString()}
                        </p>
                        <p className="text-muted-foreground/40 text-[10px] font-bold tracking-widest uppercase">
                          Subtotal
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          addToCart(product, undefined, product.sizes?.[0]);
                          toast.success(`"${product.name}" added to cart`);
                        }}
                        className="flex h-12 items-center gap-2 rounded-full bg-blue-600 px-8 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-blue-500/40 active:scale-95"
                      >
                        <ShoppingBag size={16} />
                        <span>Add to Bag</span>
                      </button>

                      <button
                        onClick={() => removeFromWishlist(item._id)}
                        className="text-muted-foreground/30 flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-all hover:bg-red-500/10 hover:text-red-500 active:scale-90"
                        title="Remove"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
