'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';

export interface IProduct {
  _id?: string;
  name: string;
  category: string;
  subCategory: string;
  type: string;
  price: number;
  image: string;
  images?: string[];
  description: string;
  details: string | string[];
  color: string;
  sizes: string[];
  featured: boolean;
  rating: number;
  slug: string;
  stock: number;
  buyPrice: number;
  salePrice?: number;
  soldCount?: number;
  isDeleted?: boolean;
}

export const createProduct = async (
  payload: FormData,
): Promise<ApiResponse<IProduct>> => {
  const res = await serverFetch.post<ApiResponse<IProduct>>('/products', {
    body: payload,
  });
  revalidate('product');
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
  revalidate('product');
  return res;
};

const getProducts = async (query: Record<string, string>) => {
  return await serverFetch.get<ApiResponse<IProduct[]>>('/products', {
    query,
    next: {
      tags: ['product'],
      revalidate: 3600, // Revalidate every hour
    },
  });
};

const getSingleProduct = async (id: string) => {
  return await serverFetch.get<ApiResponse<IProduct>>(`/products/${id}`, {
    next: {
      tags: [`product-${id}`],
      revalidate: 3600,
    },
  });
};

const deleteProduct = async (id: string) => {
  const res = await serverFetch.delete<ApiResponse<IProduct>>(
    `/products/${id}`,
  );
  revalidate('product');
  return res;
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

const getBestSellingProducts = async () => {
  return await serverFetch.get<ApiResponse<IProduct[]>>('/products', {
    query: { sort: '-soldCount', limit: '12' },
    next: {
      tags: ['product', 'best-selling'],
      revalidate: 3600,
    },
  });
};

export {
  deleteProduct,
  getBestSellingProducts,
  getProducts,
  getSingleProduct,
  getTopRatedProducts,
};
