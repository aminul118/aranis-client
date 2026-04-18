'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import { ApiResponse, IUser } from '@/types';

const getMe = async () => {
  return await serverFetch.get<ApiResponse<IUser>>('/user/me', {
    next: {
      tags: ['ME'],
    },
  });
};

const getUsers = async (query: Record<string, string>) => {
  return await serverFetch.get<ApiResponse<IUser[]>>('/user/all-users', {
    query,
    next: {
      tags: ['users'],
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

  revalidate('ME');

  return res;
};

const updateUserWithFormData = async (id: string, formData: FormData) => {
  const res = await serverFetch.put<ApiResponse<IUser>>(`/user/${id}`, {
    body: formData,
    next: {
      tags: ['ME'],
    },
  });
  revalidate('ME');
  revalidate('users');

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

  revalidate('users');

  return res;
};

export {
  assignUserRole,
  getMe,
  getUserById,
  getUsers,
  updateUser,
  updateUserWithFormData,
};
