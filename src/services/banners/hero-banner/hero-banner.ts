'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import type { IHeroBanner } from '@/services/banners/hero-banner/hero-banner.interface';
import { ApiResponse } from '@/types';

const getHeroBanners = async (query: Record<string, string> = {}) => {
  return await serverFetch.get<ApiResponse<IHeroBanner[]>>('/hero-banners', {
    query,
    next: { tags: ['hero-banners'] },
  });
};

const getSingleHeroBanner = async (id: string) => {
  return await serverFetch.get<ApiResponse<IHeroBanner>>(`/hero-banners/${id}`);
};

const createHeroBanner = async (payload: FormData) => {
  const res = await serverFetch.post<ApiResponse<IHeroBanner>>(
    '/hero-banners',
    {
      body: payload,
    },
  );
  try {
    await revalidate('hero-banners');
  } catch (e) {
    console.error(e);
  }
  return res;
};

const updateHeroBanner = async (payload: FormData, id: string) => {
  const res = await serverFetch.patch<ApiResponse<IHeroBanner>>(
    `/hero-banners/${id}`,
    {
      body: payload,
    },
  );
  try {
    await revalidate('hero-banners');
  } catch (e) {
    console.error(e);
  }
  return res;
};

const deleteHeroBanner = async (id: string) => {
  const res = await serverFetch.delete<ApiResponse<IHeroBanner>>(
    `/hero-banners/${id}`,
  );
  try {
    await revalidate('hero-banners');
  } catch (e) {
    console.error(e);
  }
  return res;
};

const deleteHeroBannerBulk = async (ids: string[]) => {
  const res = await serverFetch.delete<ApiResponse<any>>(
    '/hero-banners/bulk-delete',
    {
      body: JSON.stringify({ ids }),
      headers: { 'Content-Type': 'application/json' },
    },
  );
  try {
    await revalidate('hero-banners');
  } catch (e) {
    console.error(e);
  }
  return res;
};

export {
  createHeroBanner,
  deleteHeroBanner,
  deleteHeroBannerBulk,
  getHeroBanners,
  getSingleHeroBanner,
  updateHeroBanner,
};
