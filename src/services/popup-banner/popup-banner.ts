'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import type { IPopupBanner } from '@/services/popup-banner/popup-banner.interface';
import { ApiResponse } from '@/types';

const getActivePopupBanner = async () => {
  return await serverFetch.get<ApiResponse<IPopupBanner>>(
    '/popup-banners/active',
    {
      cache: 'no-store',
      next: { tags: ['popup-banners'] },
    },
  );
};

const getPopupBanners = async (query: Record<string, string> = {}) => {
  return await serverFetch.get<ApiResponse<IPopupBanner[]>>('/popup-banners', {
    query,
    cache: 'no-store',
    next: { tags: ['popup-banners'] },
  });
};

const getSinglePopupBanner = async (id: string) => {
  return await serverFetch.get<ApiResponse<IPopupBanner>>(
    `/popup-banners/${id}`,
  );
};

const createPopupBanner = async (payload: IPopupBanner) => {
  const res = await serverFetch.post<ApiResponse<IPopupBanner>>(
    '/popup-banners',
    {
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    },
  );
  revalidate('popup-banners');
  return res;
};

const updatePopupBanner = async (
  payload: Partial<IPopupBanner>,
  id: string,
) => {
  const res = await serverFetch.patch<ApiResponse<IPopupBanner>>(
    `/popup-banners/${id}`,
    {
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    },
  );
  revalidate('popup-banners');
  return res;
};

const deletePopupBanner = async (id: string) => {
  const res = await serverFetch.delete<ApiResponse<IPopupBanner>>(
    `/popup-banners/${id}`,
  );
  revalidate('popup-banners');
  return res;
};

export {
  createPopupBanner,
  deletePopupBanner,
  getActivePopupBanner,
  getPopupBanners,
  getSinglePopupBanner,
  updatePopupBanner,
};
