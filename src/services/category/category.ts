'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';

export interface ISubCategory {
  title: string;
  items: string[];
}

export interface ICategory {
  _id?: string;
  name: string;
  subCategories: ISubCategory[];
  colors: string[];
  sizes: string[];
  isDeleted?: boolean;
}

export const createCategory = async (payload: ICategory) => {
  const res = await serverFetch.post<ApiResponse<ICategory>>('/categories', {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  revalidate('category');
  return res;
};

export const updateCategory = async (
  payload: Partial<ICategory>,
  id: string,
) => {
  const res = await serverFetch.patch<ApiResponse<ICategory>>(
    `/categories/${id}`,
    {
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  revalidate('category');
  return res;
};

export const getCategories = async (query: Record<string, string>) => {
  return await serverFetch.get<ApiResponse<ICategory[]>>('/categories', {
    query,
    next: {
      tags: ['category'],
      revalidate: 3600,
    },
  });
};

export const getSingleCategory = async (id: string) => {
  return await serverFetch.get<ApiResponse<ICategory>>(`/categories/${id}`);
};

export const deleteCategory = async (id: string) => {
  const res = await serverFetch.delete<ApiResponse<ICategory>>(
    `/categories/${id}`,
  );
  revalidate('category');
  return res;
};
