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
  colors: string[];
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

const createProduct = async (payload: IProduct) => {
  const res = await serverFetch.post<ApiResponse<IProduct>>('/products', {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  revalidate('product');
  return res;
};

const updateProduct = async (payload: Partial<IProduct>, id: string) => {
  const res = await serverFetch.patch<ApiResponse<IProduct>>(
    `/products/${id}`,
    {
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
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
    },
  });
};

const getSingleProduct = async (id: string) => {
  return await serverFetch.get<ApiResponse<IProduct>>(`/products/${id}`);
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
    query: { sort: '-rating', limit: '10' },
  });
};

const getBestSellingProducts = async () => {
  return await serverFetch.get<ApiResponse<IProduct[]>>('/products', {
    query: { sort: '-soldCount', limit: '10' },
  });
};

export {
  createProduct,
  deleteProduct,
  getBestSellingProducts,
  getProducts,
  getSingleProduct,
  getTopRatedProducts,
  updateProduct,
};
