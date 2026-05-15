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
        setWishlist(res.data || []);
      } else {
        setWishlist([]);
      }
    } catch (error) {
      setWishlist([]);
    }
  };

  // Sync Guest Wishlist to Server on Login
  const syncWishlist = async (localItems: IWishlistItem[]) => {
    try {
      // First fetch current server wishlist to avoid toggling off existing items
      const res = await getMyWishlist();
      const serverItems = res?.data || [];
      const serverProductIds = new Set(
        serverItems.map((item) => item.product._id),
      );

      for (const item of localItems) {
        if (!serverProductIds.has(item.product._id)) {
          await toggleWishlistService(item.product._id as string);
        }
      }
      localStorage.removeItem(GUEST_WISHLIST_KEY);
      await fetchWishlist();
      toast.success('Your saved items have been synced!');
    } catch (error) {
      console.error('Failed to sync wishlist', error);
    }
  };

  useEffect(() => {
    if (user) {
      const localData = localStorage.getItem(GUEST_WISHLIST_KEY);
      if (localData) {
        const localItems = JSON.parse(localData);
        if (localItems.length > 0) {
          syncWishlist(localItems);
        } else {
          fetchWishlist();
        }
      } else {
        fetchWishlist();
      }
    } else {
      const localData = localStorage.getItem(GUEST_WISHLIST_KEY);
      if (localData) {
        setWishlist(JSON.parse(localData));
      } else {
        setWishlist([]);
      }
    }
  }, [user]);

  const toggleWishlist = async (product: IProduct) => {
    if (user) {
      try {
        const res = await toggleWishlistService(product._id as string);
        if (res.success) {
          await fetchWishlist();
          const action =
            res.data?.action === 'added' ? 'added to' : 'removed from';
          toast.success(`"${product.name}" ${action} wishlist`);
        } else {
          toast.error(res.message || 'Failed to update wishlist');
        }
      } catch (error) {
        toast.error('Something went wrong');
      }
    } else {
      // Guest Toggle
      const isExist = wishlist.some((item) => item.product._id === product._id);
      let updatedWishlist: IWishlistItem[];

      if (isExist) {
        updatedWishlist = wishlist.filter(
          (item) => item.product._id !== product._id,
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
    return wishlist.some((item) => item.product._id === productId);
  };

  // Calculate total count based on unique items
  const wishlistCount = wishlist.length;

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
