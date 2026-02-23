'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';

export interface IColor {
  _id?: string;
  name: string;
  hex?: string;
  isDeleted?: boolean;
}

const createColor = async (payload: IColor) => {
  const res = await serverFetch.post<ApiResponse<IColor>>('/colors', {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  revalidate('color');
  return res;
};

const updateColor = async (payload: Partial<IColor>, id: string) => {
  const res = await serverFetch.patch<ApiResponse<IColor>>(`/colors/${id}`, {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  revalidate('color');
  return res;
};

const getColors = async (query: Record<string, string>) => {
  return await serverFetch.get<ApiResponse<IColor[]>>('/colors', {
    query,
    next: {
      tags: ['color'],
    },
  });
};

const getSingleColor = async (id: string) => {
  return await serverFetch.get<ApiResponse<IColor>>(`/colors/${id}`);
};

const deleteColor = async (id: string) => {
  const res = await serverFetch.delete<ApiResponse<IColor>>(`/colors/${id}`);
  revalidate('color');
  return res;
};

export { createColor, deleteColor, getColors, getSingleColor, updateColor };
