'use client';

import { useWishlist } from '@/context/WishlistContext';
import { Heart, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlist, wishlistCount, updateQuantity, removeFromWishlist } =
    useWishlist();

  if (wishlistCount === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="bg-muted mb-6 flex h-24 w-24 items-center justify-center rounded-full">
          <Heart size={40} className="text-muted-foreground" />
        </div>
        <h1 className="mb-2 text-3xl font-bold">Your wishlist is empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Save your favorite items here to order them later. Start exploring our
          collections to find something you love!
        </p>
        <Link
          href="/shop"
          className="bg-primary text-primary-foreground rounded-full px-8 py-3 font-bold transition-transform hover:scale-105"
        >
          Explore Shop
        </Link>
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
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-3 text-4xl font-black tracking-tighter uppercase">
            My Wishlist
            <span className="bg-primary/10 text-primary rounded-full px-4 py-1 text-sm font-bold tracking-normal">
              {wishlistCount} {wishlistCount === 1 ? 'Item' : 'Items'}
            </span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Items you've saved to buy later.
          </p>
        </div>
        <Link
          href="/shop"
          className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
        >
          Continue Shopping <ShoppingBag size={16} />
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        {wishlist.map((item) => {
          const product = item.product;
          const currentPrice = product.salePrice || product.price;
          const qty = item.quantity || 1;

          return (
            <div
              key={item._id}
              className="border-border bg-card flex flex-col items-center gap-6 rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md sm:flex-row"
            >
              <Link href={`/products/${product.slug}`} className="shrink-0">
                <div className="bg-muted relative h-24 w-24 overflow-hidden rounded-xl">
                  <Image
                    src={product.images?.[0] || '/placeholder.png'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>

              <div className="flex flex-1 flex-col justify-center text-center sm:text-left">
                <Link
                  href={`/products/${product.slug}`}
                  className="line-clamp-1 text-lg font-bold hover:underline"
                >
                  {product.name}
                </Link>
                <div className="mt-1 flex items-center justify-center gap-2 sm:justify-start">
                  <span className="text-primary font-bold">
                    ৳{currentPrice.toLocaleString()}
                  </span>
                  {product.salePrice && product.salePrice < product.price && (
                    <span className="text-muted-foreground text-sm line-through">
                      ৳{product.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="border-border bg-background flex items-center rounded-full border p-1">
                  <button
                    onClick={() => handleDecrement(item._id, qty)}
                    disabled={qty <= 1}
                    className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-8 w-8 items-center justify-center rounded-full transition-colors disabled:opacity-50"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-bold">
                    {qty}
                  </span>
                  <button
                    onClick={() => handleIncrement(item._id, qty)}
                    className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="w-24 text-right text-lg font-black">
                  ৳{(currentPrice * qty).toLocaleString()}
                </div>

                <button
                  onClick={() => removeFromWishlist(item._id)}
                  className="text-destructive/70 hover:bg-destructive/10 hover:text-destructive flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
