'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';

export interface IVariantSize {
  size: string;
  stock: number;
}

export interface IVariant {
  color: string;
  images: string[];
  sizes: IVariantSize[];
  sku?: string;
}

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
  variants?: IVariant[];
  sizes: string[];
  featured: boolean;
  rating: number;
  slug: string;
  sku?: string;
  stock: number;
  sizeStock?: IVariantSize[];
  buyPrice: number;
  salePrice?: number;
  discountPercentage?: number;
  isOffer?: boolean;
  offerTag?: string;
  soldCount?: number;
  videoUrl?: string;
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
      revalidate: 0, // Revalidate immediately
    },
  });
};

const getSingleProduct = async (id: string) => {
  return await serverFetch.get<ApiResponse<IProduct>>(`/products/${id}`, {
    next: {
      tags: [`product-${id}`],
      revalidate: 0,
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
  revalidate('product');
  return res;
};

export {
  deleteProduct,
  deleteProductBulk,
  getBestSellingProducts,
  getProducts,
  getSingleProduct,
  getTopRatedProducts,
  updateProductBulk,
};
