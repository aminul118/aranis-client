'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import type { IWishlistItem } from '@/services/wishlist/wishlist.interface';
import { ApiResponse } from '@/types';

export const toggleWishlist = async (
  productId: string,
  selectedColor?: string,
  selectedSize?: string,
) => {
  const res = await serverFetch.post<
    ApiResponse<{ action: 'added' | 'removed' }>
  >('/wishlist/toggle', {
    body: JSON.stringify({ productId, selectedColor, selectedSize }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  await revalidate('wishlist');
  return res;
};

export const getMyWishlist = async () => {
  return await serverFetch.get<ApiResponse<IWishlistItem[]>>(
    '/wishlist/my-wishlist',
    {
      cache: 'no-store',
    },
  );
};

export const removeFromWishlist = async (id: string) => {
  const res = await serverFetch.delete<ApiResponse<null>>(`/wishlist/${id}`);
  await revalidate('wishlist');
  return res;
};

export const updateWishlistQuantity = async (id: string, quantity: number) => {
  const res = await serverFetch.patch<ApiResponse<null>>(
    `/wishlist/${id}/quantity`,
    {
      body: JSON.stringify({ quantity }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  await revalidate('wishlist');
  return res;
};
