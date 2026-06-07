'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';

export interface ICartItemPayload {
  product: string;
  quantity?: number;
  selectedColor?: string;
  selectedSize?: string;
}

export const addToCartService = async (payload: ICartItemPayload) => {
  const res = await serverFetch.post<ApiResponse<any>>('/cart/add', {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  await revalidate('cart');
  return res;
};

export const getMyCart = async () => {
  return await serverFetch.get<ApiResponse<any[]>>('/cart/my-cart', {
    cache: 'no-store',
  });
};

export const removeFromCartService = async (id: string) => {
  const res = await serverFetch.delete<ApiResponse<null>>(`/cart/${id}`);
  await revalidate('cart');
  return res;
};

export const updateCartQuantityService = async (
  id: string,
  quantity: number,
) => {
  const res = await serverFetch.patch<ApiResponse<null>>(
    `/cart/${id}/quantity`,
    {
      body: JSON.stringify({ quantity }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  await revalidate('cart');
  return res;
};

export const updateCartSizeService = async (id: string, newSize: string) => {
  const res = await serverFetch.patch<ApiResponse<null>>(`/cart/${id}/size`, {
    body: JSON.stringify({ newSize }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  await revalidate('cart');
  return res;
};

export const updateCartColorService = async (id: string, newColor: string) => {
  const res = await serverFetch.patch<ApiResponse<null>>(`/cart/${id}/color`, {
    body: JSON.stringify({ newColor }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  await revalidate('cart');
  return res;
};

export const clearCartService = async () => {
  const res = await serverFetch.delete<ApiResponse<null>>('/cart/clear');
  await revalidate('cart');
  return res;
};
