'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import { ApiResponse, IProduct } from '@/types';

export interface IWishlistItem {
  _id: string;
  user: string;
  product: IProduct;
  createdAt: string;
}

export const toggleWishlist = async (productId: string) => {
  const res = await serverFetch.post<
    ApiResponse<{ action: 'added' | 'removed' }>
  >('/wishlist/toggle', {
    body: JSON.stringify({ productId }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  revalidate('wishlist');
  return res;
};

export const getMyWishlist = async () => {
  return await serverFetch.get<ApiResponse<IWishlistItem[]>>(
    '/wishlist/my-wishlist',
    {
      next: { tags: ['wishlist'] },
    },
  );
};

export const removeFromWishlist = async (id: string) => {
  const res = await serverFetch.delete<ApiResponse<null>>(`/wishlist/${id}`);
  revalidate('wishlist');
  return res;
};
