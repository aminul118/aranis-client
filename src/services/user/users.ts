'use server';

import type { FetchOptions } from '@/helpers/serverFetchHelper';
import { getCookie } from '@/lib/jwt';
import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import type { IUser } from '@/services/user/user.interface';
import { ApiResponse } from '@/types';

const getMe = async () => {
  const token = await getCookie('accessToken');
  if (!token) return { success: false, data: null as any };

  return await serverFetch.get<ApiResponse<IUser>>('/user/me', {
    cache: 'no-store',
    next: {
      tags: ['ME'],
    },
  });
};

const getUsers = async (
  query: Record<string, string>,
  options?: FetchOptions,
) => {
  return await serverFetch.get<ApiResponse<IUser[]>>('/user/all-users', {
    query,
    next: {
      tags: ['users'],
      ...options?.next,
    },
    ...options,
    headers: {
      ...options?.headers,
    },
  });
};

const getUserById = async (id: string) => {
  return await serverFetch.get<ApiResponse<IUser>>(`/user/${id}`, {
    next: {
      tags: ['users', `user-${id}`],
    },
  });
};

const updateUser = async (id: string, data: Partial<IUser>) => {
  const res = await serverFetch.put<ApiResponse<IUser>>(`/user/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    next: {
      tags: ['ME'],
    },
  });

  await revalidate(['ME', 'users']);

  return res;
};

const updateUserWithFormData = async (id: string, formData: FormData) => {
  const res = await serverFetch.put<ApiResponse<IUser>>(`/user/${id}`, {
    body: formData,
    next: {
      tags: ['ME'],
    },
  });
  await revalidate(['ME', 'users']);

  return res;
};

const assignUserRole = async (id: string, role: string) => {
  const res = await serverFetch.patch<ApiResponse<IUser>>(
    `/user/update-role/${id}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role }),
      next: {
        tags: ['users'],
      },
    },
  );

  await revalidate(['ME', 'users']);

  return res;
};

const changePassword = async (data: any) => {
  const res = await serverFetch.post<ApiResponse<null>>(
    '/user/change-password',
    {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  await revalidate('ME');

  return res;
};

const deleteUserBulk = async (ids: string[]) => {
  const res = await serverFetch.delete<ApiResponse<any>>('/user/bulk-delete', {
    body: JSON.stringify({ ids }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  await revalidate(['users']);
  return res;
};

export {
  assignUserRole,
  changePassword,
  deleteUserBulk,
  getMe,
  getUserById,
  getUsers,
  updateUser,
  updateUserWithFormData,
};
