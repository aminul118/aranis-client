'use server';

import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';
import { setAccessToken, setRefreshToken } from './cookie-token';

export const loginWithPassword = async (data: any) => {
  const res = await serverFetch.post<ApiResponse<any>>(
    '/auth/login-with-password',
    {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (res.success && res.data && res.data.accessToken) {
    await setAccessToken(res.data.accessToken);
    if (res.data.refreshToken) {
      await setRefreshToken(res.data.refreshToken);
    }
  }

  return res;
};
