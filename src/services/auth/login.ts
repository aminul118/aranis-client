'use server';

import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';
import { ILogin } from '@/types/api.types';
import { setAccessToken, setRefreshToken } from './cookie-token';

export const loginAction = async (payload: Record<string, string>) => {
  try {
    const res = await serverFetch.post<ApiResponse<ILogin>>('/auth/login', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res?.success) {
      return { success: false, message: res.message || 'Something went wrong' };
    }

    const { accessToken, refreshToken, user } = res.data;

    await setAccessToken(accessToken);
    await setRefreshToken(refreshToken);

    return {
      success: true,
      message: 'Login Successfully',
      user,
    };
  } catch (err: any) {
    return {
      success: false,
      message: 'Login failed',
      user: null,
    };
  }
};
