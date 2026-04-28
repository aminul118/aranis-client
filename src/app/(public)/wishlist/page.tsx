'use client';

import ProductCard from '@/components/common/ProductCard';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlist, wishlistCount } = useWishlist();

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

  return (
    <div className="container mx-auto px-4 py-12">
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wishlist.map((item, index) => (
          <ProductCard key={item._id} product={item.product} index={index} />
        ))}
      </div>
    </div>
  );
}
