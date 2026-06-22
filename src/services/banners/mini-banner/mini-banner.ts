'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';
import { revalidatePath } from 'next/cache';
import { IMiniBanner } from './mini-banner.interface';

const getMiniBanners = async (query: Record<string, string> = {}) => {
  return await serverFetch.get<ApiResponse<IMiniBanner[]>>('/mini-banners', {
    query,
    next: { tags: ['mini-banners'] },
  });
};

const getSingleMiniBanner = async (id: string) => {
  return await serverFetch.get<ApiResponse<IMiniBanner>>(`/mini-banners/${id}`);
};

const createMiniBanner = async (payload: FormData) => {
  const res = await serverFetch.post<ApiResponse<IMiniBanner>>(
    '/mini-banners',
    {
      body: payload,
    },
  );
  try {
    await revalidate('mini-banners');
  } catch (e) {
    console.error(e);
  }
  return res;
};

const updateMiniBanner = async (payload: FormData, id: string) => {
  const res = await serverFetch.patch<ApiResponse<IMiniBanner>>(
    `/mini-banners/${id}`,
    {
      body: payload,
    },
  );
  try {
    revalidatePath('/', 'layout');
    revalidate('mini-banners');
  } catch (e) {
    console.error(e);
  }
  return res;
};

const deleteMiniBanner = async (id: string) => {
  const res = await serverFetch.delete<ApiResponse<IMiniBanner>>(
    `/mini-banners/${id}`,
  );
  try {
    await revalidate('mini-banners');
  } catch (e) {
    console.error(e);
  }
  return res;
};

const deleteMiniBannerBulk = async (ids: string[]) => {
  const res = await serverFetch.delete<ApiResponse<any>>(
    '/mini-banners/bulk-delete',
    {
      body: JSON.stringify({ ids }),
      headers: { 'Content-Type': 'application/json' },
    },
  );
  try {
    await revalidate('mini-banners');
  } catch (e) {
    console.error(e);
  }
  return res;
};

export {
  createMiniBanner,
  deleteMiniBanner,
  deleteMiniBannerBulk,
  getMiniBanners,
  getSingleMiniBanner,
  updateMiniBanner,
};
