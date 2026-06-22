'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import type { ICategory } from '@/services/category/category.interface';
import { ApiResponse } from '@/types';

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
    cache: 'force-cache',
    next: {
      tags: ['category'],
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

export const deleteCategoryBulk = async (ids: string[]) => {
  const res = await serverFetch.delete<ApiResponse<any>>(
    '/categories/bulk-delete',
    {
      body: JSON.stringify({ ids }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  revalidate('category');
  return res;
};
