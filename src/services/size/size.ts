'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';

export interface ISize {
  _id?: string;
  name: string;
  order?: number;
  isDeleted?: boolean;
}

export const createSize = async (payload: ISize) => {
  const res = await serverFetch.post<ApiResponse<ISize>>('/sizes', {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  revalidate('size');
  return res;
};

export const updateSize = async (payload: Partial<ISize>, id: string) => {
  const res = await serverFetch.patch<ApiResponse<ISize>>(`/sizes/${id}`, {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  revalidate('size');
  return res;
};

export const getSizes = async (query?: Record<string, string>) => {
  return await serverFetch.get<ApiResponse<ISize[]>>('/sizes', {
    query,
    cache: 'force-cache',
    next: {
      tags: ['size'],
    },
  });
};

export const getSingleSize = async (id: string) => {
  return await serverFetch.get<ApiResponse<ISize>>(`/sizes/${id}`);
};

export const deleteSize = async (id: string) => {
  const res = await serverFetch.delete<ApiResponse<ISize>>(`/sizes/${id}`);
  revalidate('size');
  return res;
};

export const deleteSizeBulk = async (ids: string[]) => {
  const res = await serverFetch.delete<ApiResponse<any>>('/sizes/bulk-delete', {
    body: JSON.stringify({ ids }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  revalidate('size');
  return res;
};
