'use client';

import { IProduct } from '@/services/product/product';
import {
  getMyWishlist,
  toggleWishlist as toggleWishlistService,
} from '@/services/wishlist/wishlist';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface WishlistContextType {
  wishlist: any[];
  toggleWishlist: (product: IProduct) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

import { useUser } from '@/context/UserContext';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();
  const [wishlist, setWishlist] = useState<any[]>([]);

  const fetchWishlist = async () => {
    try {
      const res = await getMyWishlist();
      if (res?.success) {
        setWishlist(res.data || []);
      } else {
        setWishlist([]);
      }
    } catch (error) {
      setWishlist([]);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const toggleWishlist = async (product: IProduct) => {
    try {
      const res = await toggleWishlistService(product._id as string);
      if (res.success) {
        if (res.data?.action === 'added') {
          setWishlist((prev) => [...prev, { product }]);
          toast.success(`"${product.name}" added to wishlist`);
        } else {
          setWishlist((prev) =>
            prev.filter((item) => item.product._id !== product._id),
          );
          toast.success(`"${product.name}" removed from wishlist`);
        }
      }
    } catch (error) {
      toast.error('Please login to use wishlist');
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.product._id === productId);
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
