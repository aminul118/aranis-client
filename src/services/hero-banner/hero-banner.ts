'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';

export interface IHeroBanner {
  _id?: string;
  image: string;
  tag: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
  accentColor: string;
  bgGlow: string;
  order: number;
  isActive: boolean;
  isDeleted?: boolean;
}

export interface IMiniBanner {
  _id?: string;
  image: string;
  label: string;
  title: string;
  href: string;
  accent: string;
  order: number;
  isActive: boolean;
  isDeleted?: boolean;
}

// ─── Hero Banner ─────────────────────────────────────────────────────────────

const getHeroBanners = async (query: Record<string, string> = {}) => {
  return await serverFetch.get<ApiResponse<IHeroBanner[]>>('/hero-banners', {
    query,
    next: { tags: ['hero-banners'], revalidate: 3600 },
  });
};

const getSingleHeroBanner = async (id: string) => {
  return await serverFetch.get<ApiResponse<IHeroBanner>>(`/hero-banners/${id}`);
};

const createHeroBanner = async (payload: IHeroBanner) => {
  const res = await serverFetch.post<ApiResponse<IHeroBanner>>(
    '/hero-banners',
    {
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    },
  );
  revalidate('hero-banners');
  return res;
};

const updateHeroBanner = async (payload: Partial<IHeroBanner>, id: string) => {
  const res = await serverFetch.patch<ApiResponse<IHeroBanner>>(
    `/hero-banners/${id}`,
    {
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    },
  );
  revalidate('hero-banners');
  return res;
};

const deleteHeroBanner = async (id: string) => {
  const res = await serverFetch.delete<ApiResponse<IHeroBanner>>(
    `/hero-banners/${id}`,
  );
  revalidate('hero-banners');
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
  revalidate('hero-banners');
  return res;
};

// ─── Mini Banner ─────────────────────────────────────────────────────────────

const getMiniBanners = async (query: Record<string, string> = {}) => {
  return await serverFetch.get<ApiResponse<IMiniBanner[]>>('/mini-banners', {
    query,
    next: { tags: ['mini-banners'], revalidate: 3600 },
  });
};

const getSingleMiniBanner = async (id: string) => {
  return await serverFetch.get<ApiResponse<IMiniBanner>>(`/mini-banners/${id}`);
};

const createMiniBanner = async (payload: IMiniBanner) => {
  const res = await serverFetch.post<ApiResponse<IMiniBanner>>(
    '/mini-banners',
    {
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    },
  );
  revalidate('mini-banners');
  return res;
};

const updateMiniBanner = async (payload: Partial<IMiniBanner>, id: string) => {
  const res = await serverFetch.patch<ApiResponse<IMiniBanner>>(
    `/mini-banners/${id}`,
    {
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    },
  );
  revalidate('mini-banners');
  return res;
};

const deleteMiniBanner = async (id: string) => {
  const res = await serverFetch.delete<ApiResponse<IMiniBanner>>(
    `/mini-banners/${id}`,
  );
  revalidate('mini-banners');
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
  revalidate('mini-banners');
  return res;
};

export {
  createHeroBanner,
  createMiniBanner,
  deleteHeroBanner,
  deleteHeroBannerBulk,
  deleteMiniBanner,
  deleteMiniBannerBulk,
  getHeroBanners,
  getMiniBanners,
  getSingleHeroBanner,
  getSingleMiniBanner,
  updateHeroBanner,
  updateMiniBanner,
};
