'use server';

import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';

export const changePassword = async (data: any) => {
  const res = await serverFetch.post<ApiResponse<any>>(
    '/user/change-password',
    {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return res;
};
