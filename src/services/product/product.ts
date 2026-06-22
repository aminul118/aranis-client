'use server';

import type { FetchOptions } from '@/helpers/serverFetchHelper';
import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import type { IProduct } from '@/services/product/product.interface';
import type { ApiResponse } from '@/types';
import { revalidatePath } from 'next/cache';
import { logger } from '../../lib/logger';

export const createProduct = async (
  payload: FormData,
): Promise<ApiResponse<IProduct>> => {
  const res = await serverFetch.post<ApiResponse<IProduct>>('/products', {
    body: payload,
  });
  try {
    revalidatePath('/', 'layout');
    revalidate('product');
  } catch (e) {
    logger.error(e);
  }
  return res;
};

export const updateProduct = async (
  payload: FormData,
  id: string,
): Promise<ApiResponse<IProduct>> => {
  const res = await serverFetch.patch<ApiResponse<IProduct>>(
    `/products/${id}`,
    {
      body: payload,
    },
  );
  try {
    revalidatePath('/', 'layout');
    revalidate(`product-${id}`);
    revalidate('product');
  } catch (e) {
    logger.error(e);
  }
  return res;
};

const getProducts = async (
  query: Record<string, string>,
  options?: FetchOptions,
) => {
  return await serverFetch.get<ApiResponse<IProduct[]>>('/products', {
    query,
    cache: 'force-cache',
    next: { tags: ['product'], ...options?.next },
    ...options,
    headers: {
      ...options?.headers,
    },
  });
};

const getSingleProduct = async (id: string) => {
  return await serverFetch.get<ApiResponse<IProduct>>(`/products/${id}`, {
    next: {
      tags: [`product-${id}`, 'product'],
      revalidate: 3600,
    },
  });
};

const deleteProduct = async (id: string) => {
  const res = await serverFetch.delete<ApiResponse<IProduct>>(
    `/products/${id}`,
  );
  try {
    revalidatePath('/', 'layout');
  } catch (e) {
    logger.error(e);
  }
  revalidate('product');
  return res;
};

const getBestSellingProducts = async () => {
  return await serverFetch.get<ApiResponse<IProduct[]>>('/products', {
    query: { sort: '-inStock -soldCount -createdAt', limit: '12' },
    next: {
      tags: ['product', 'best-selling'],
      revalidate: 3600,
    },
  });
};

const getNewArrivals = async () => {
  return await serverFetch.get<ApiResponse<IProduct[]>>('/products', {
    query: { sort: '-inStock -createdAt', limit: '12' },
    next: {
      tags: ['product', 'new-arrivals'],
      revalidate: 3600,
    },
  });
};

const getTopRatedProducts = async () => {
  return await serverFetch.get<ApiResponse<IProduct[]>>('/products', {
    query: { sort: '-rating', limit: '12' },
    next: {
      tags: ['product', 'top-rated'],
      revalidate: 3600,
    },
  });
};

const updateProductBulk = async (ids: string[], data: Partial<IProduct>) => {
  const res = await serverFetch.patch<ApiResponse<IProduct[]>>(
    '/products/bulk-update',
    {
      body: JSON.stringify({ ids, data }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  try {
    revalidatePath('/', 'layout');
  } catch (e) {
    logger.error(e);
  }
  revalidate('product');
  return res;
};

const deleteProductBulk = async (ids: string[]) => {
  const res = await serverFetch.delete<ApiResponse<any>>(
    '/products/bulk-delete',
    {
      body: JSON.stringify({ ids }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  try {
    const { revalidatePath } = require('next/cache');
    revalidatePath('/', 'layout');
  } catch (e) {
    logger.error(e);
  }
  revalidate('product');
  return res;
};

const getProductPriceRange = async () => {
  return await serverFetch.get<
    ApiResponse<{ minPrice: number; maxPrice: number }>
  >('/products/price-range', {
    next: {
      tags: ['product-price-range'],
      revalidate: 3600, // Revalidate every hour
    },
  });
};

export {
  deleteProduct,
  deleteProductBulk,
  getBestSellingProducts,
  getNewArrivals,
  getProductPriceRange,
  getProducts,
  getSingleProduct,
  getTopRatedProducts,
  updateProductBulk,
};
