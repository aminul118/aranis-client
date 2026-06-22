'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import type { INavItem } from '@/services/navbar/navbar.interface';
import { ApiResponse } from '@/types';

const createNavbar = async (payload: INavItem) => {
  const res = await serverFetch.post<ApiResponse<INavItem>>('/navbar', {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  await revalidate('navbar');
  return res;
};

const updateNavbar = async (payload: Partial<INavItem>, id: string) => {
  const res = await serverFetch.patch<ApiResponse<INavItem>>(`/navbar/${id}`, {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  await revalidate('navbar');
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
  await revalidate('navbar');
  return res;
};

const deleteNavbarBulk = async (ids: string[]) => {
  const res = await serverFetch.delete<ApiResponse<any>>(
    '/navbar/bulk-delete',
    {
      body: JSON.stringify({ ids }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  await revalidate('navbar');
  return res;
};

export {
  createNavbar,
  deleteNavbar,
  deleteNavbarBulk,
  getNavbars,
  getSingleNavbar,
  updateNavbar,
};
