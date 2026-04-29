'use client';

import { IProduct } from '@/services/product/product';
import {
  getMyWishlist,
  IWishlistItem,
  removeFromWishlist as removeFromWishlistService,
  toggleWishlist as toggleWishlistService,
  updateWishlistQuantity,
} from '@/services/wishlist/wishlist';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface WishlistContextType {
  wishlist: IWishlistItem[];
  toggleWishlist: (product: IProduct) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
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
  const [wishlist, setWishlist] = useState<IWishlistItem[]>([]);

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
        await fetchWishlist(); // Refetch to get updated quantity or new item
        toast.success(`"${product.name}" added to wishlist`);
      }
    } catch (error) {
      toast.error('Please login to use wishlist');
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      // Optimistic update
      setWishlist((prev) =>
        prev.map((item) => (item._id === id ? { ...item, quantity } : item)),
      );
      const res = await updateWishlistQuantity(id, quantity);
      if (!res.success) {
        await fetchWishlist(); // Revert on failure
        toast.error('Failed to update quantity');
      }
    } catch (error) {
      await fetchWishlist();
      toast.error('Something went wrong');
    }
  };

  const removeFromWishlist = async (id: string) => {
    try {
      // Optimistic update
      setWishlist((prev) => prev.filter((item) => item._id !== id));
      const res = await removeFromWishlistService(id);
      if (!res.success) {
        await fetchWishlist(); // Revert on failure
        toast.error('Failed to remove item');
      } else {
        toast.success('Removed from wishlist');
      }
    } catch (error) {
      await fetchWishlist();
      toast.error('Something went wrong');
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.product._id === productId);
  };

  // Calculate total count based on quantities
  const wishlistCount = wishlist.reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        updateQuantity,
        removeFromWishlist,
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
