'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';

export interface INavSubItem {
  title: string;
  items: string[];
}

export interface INavItem {
  _id?: string;
  title: string;
  href: string;
  subItems?: INavSubItem[];
  order: number;
  isDeleted?: boolean;
}

const createNavbar = async (payload: INavItem) => {
  const res = await serverFetch.post<ApiResponse<INavItem>>('/navbar', {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  revalidate('navbar');
  return res;
};

const updateNavbar = async (payload: Partial<INavItem>, id: string) => {
  const res = await serverFetch.patch<ApiResponse<INavItem>>(`/navbar/${id}`, {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  revalidate('navbar');
  return res;
};

const getNavbars = async (query: Record<string, string>) => {
  return await serverFetch.get<ApiResponse<INavItem[]>>('/navbar', {
    query,
    next: {
      tags: ['navbar'],
    },
  });
};

const getSingleNavbar = async (id: string) => {
  return await serverFetch.get<ApiResponse<INavItem>>(`/navbar/${id}`);
};

const deleteNavbar = async (id: string) => {
  const res = await serverFetch.delete<ApiResponse<INavItem>>(`/navbar/${id}`);
  revalidate('navbar');
  return res;
};

export {
  createNavbar,
  deleteNavbar,
  getNavbars,
  getSingleNavbar,
  updateNavbar,
};
