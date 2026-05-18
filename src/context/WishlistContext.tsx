'use client';

import {
  getMyWishlist,
  IWishlistItem,
  removeFromWishlist as removeFromWishlistService,
  toggleWishlist as toggleWishlistService,
  updateWishlistQuantity,
} from '@/services/wishlist/wishlist';
import { IProduct } from '@/types';
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

const GUEST_WISHLIST_KEY = 'aranis_guest_wishlist';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();
  const [wishlist, setWishlist] = useState<IWishlistItem[]>([]);

  const fetchWishlist = async () => {
    if (!user) return;
    try {
      const res = await getMyWishlist();
      if (res?.success) {
        const validItems = (res.data || []).filter(
          (item) => item && item.product,
        );
        setWishlist(validItems);
      } else {
        setWishlist([]);
      }
    } catch (error) {
      setWishlist([]);
    }
  };

  const syncWishlist = async (localItems: IWishlistItem[]) => {
    try {
      const res = await getMyWishlist();
      const serverItems = res?.data || [];
      const serverProductIds = new Set(
        serverItems
          .filter((item) => item && item.product)
          .map((item) => item.product._id),
      );

      for (const item of localItems) {
        if (item && item.product && !serverProductIds.has(item.product._id)) {
          await toggleWishlistService(item.product._id as string);
        }
      }
      localStorage.removeItem(GUEST_WISHLIST_KEY);
      await fetchWishlist();
      toast.success('Your saved items have been synced!');
    } catch (error) {
      console.error('Failed to sync wishlist', error);
      // Fall back: clean up storage and fetch to proceed safely
      localStorage.removeItem(GUEST_WISHLIST_KEY);
      await fetchWishlist();
    }
  };

  useEffect(() => {
    if (user) {
      const localData = localStorage.getItem(GUEST_WISHLIST_KEY);
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          const localItems = (Array.isArray(parsed) ? parsed : []).filter(
            (item) => item && item.product,
          );
          if (localItems.length > 0) {
            syncWishlist(localItems);
          } else {
            fetchWishlist();
          }
        } catch {
          fetchWishlist();
        }
      } else {
        fetchWishlist();
      }
    } else {
      const localData = localStorage.getItem(GUEST_WISHLIST_KEY);
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          const validItems = (Array.isArray(parsed) ? parsed : []).filter(
            (item) => item && item.product,
          );
          setWishlist(validItems);
        } catch {
          setWishlist([]);
        }
      } else {
        setWishlist([]);
      }
    }
  }, [user]);

  const toggleWishlist = async (product: IProduct) => {
    if (user) {
      // Optimistic Update: instantly add/remove from local state
      const isExist = wishlist.some(
        (item) => item?.product?._id === product._id,
      );
      const originalWishlist = [...wishlist];

      let updatedWishlist: IWishlistItem[];
      if (isExist) {
        updatedWishlist = wishlist.filter(
          (item) => item?.product?._id !== product._id,
        );
      } else {
        const newItem: IWishlistItem = {
          _id: `temp_${Date.now()}`,
          user: user._id as string,
          product,
          quantity: 1,
          createdAt: new Date().toISOString(),
        };
        updatedWishlist = [...wishlist, newItem];
      }

      // Set state immediately for zero-lag UI
      setWishlist(updatedWishlist);

      try {
        const res = await toggleWishlistService(product._id as string);
        if (res.success) {
          await fetchWishlist();
          const action =
            res.data?.action === 'added' ? 'added to' : 'removed from';
          toast.success(`"${product.name}" ${action} wishlist`);
        } else {
          // Rollback on server failure
          setWishlist(originalWishlist);
          toast.error(res.message || 'Failed to update wishlist');
        }
      } catch (error) {
        // Rollback on network failure
        setWishlist(originalWishlist);
        toast.error('Something went wrong');
      }
    } else {
      // Guest Toggle
      const isExist = wishlist.some(
        (item) => item && item.product && item.product._id === product._id,
      );
      let updatedWishlist: IWishlistItem[];

      if (isExist) {
        updatedWishlist = wishlist.filter(
          (item) => item && item.product && item.product._id !== product._id,
        );
        toast.success(`"${product.name}" removed from wishlist`);
      } else {
        const newItem: IWishlistItem = {
          _id: product._id as string, // use product id as item id for guest
          user: 'guest',
          product,
          quantity: 1,
          createdAt: new Date().toISOString(),
        };
        updatedWishlist = [...wishlist, newItem];
        toast.success(`"${product.name}" added to wishlist`);
      }

      setWishlist(updatedWishlist);
      localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(updatedWishlist));
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (user) {
      try {
        setWishlist((prev) =>
          prev.map((item) => (item._id === id ? { ...item, quantity } : item)),
        );
        const res = await updateWishlistQuantity(id, quantity);
        if (!res.success) {
          await fetchWishlist();
          toast.error('Failed to update quantity');
        }
      } catch (error) {
        await fetchWishlist();
        toast.error('Something went wrong');
      }
    } else {
      const updatedWishlist = wishlist.map((item) =>
        item._id === id ? { ...item, quantity } : item,
      );
      setWishlist(updatedWishlist);
      localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(updatedWishlist));
    }
  };

  const removeFromWishlist = async (id: string) => {
    if (user) {
      try {
        setWishlist((prev) => prev.filter((item) => item._id !== id));
        const res = await removeFromWishlistService(id);
        if (!res.success) {
          await fetchWishlist();
          toast.error('Failed to remove item');
        } else {
          toast.success('Removed from wishlist');
        }
      } catch (error) {
        await fetchWishlist();
        toast.error('Something went wrong');
      }
    } else {
      const updatedWishlist = wishlist.filter((item) => item._id !== id);
      setWishlist(updatedWishlist);
      localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(updatedWishlist));
      toast.success('Removed from wishlist');
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(
      (item) => item && item.product && item.product._id === productId,
    );
  };

  // Calculate total count based only on items with valid products
  const wishlistCount = wishlist.filter((item) => item && item.product).length;

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
