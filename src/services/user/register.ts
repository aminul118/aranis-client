'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import { ApiResponse, IUser } from '@/types';

export const registerUserFromAdmin = async (payload: Partial<IUser>) => {
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
