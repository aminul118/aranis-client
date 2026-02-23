'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import { ApiResponse, IUser } from '@/types';

const registerAction = async (payload: Record<string, string>) => {
  const res = await serverFetch.post<ApiResponse<IUser>>('/user/register', {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  revalidate('users');

  return res;
};

const registerUserFromAdmin = async (payload: Record<string, string>) => {
  const res = await serverFetch.post<ApiResponse<IUser>>(
    '/user/admin/register',
    {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );

  revalidate('users');

  return res;
};

export { registerAction, registerUserFromAdmin };
