'use server';

import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';
import { cookies } from 'next/headers';

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

  if (res.success && res.data) {
    const cookieStore = await cookies();
    cookieStore.set('accessToken', res.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    cookieStore.set('refreshToken', res.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  }

  return res;
};
