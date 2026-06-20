'use server';

import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';
import { cookies } from 'next/headers';

export const forgotPassword = async (
  identifier: string,
  turnstileToken?: string,
) => {
  try {
    const res = await serverFetch.post<ApiResponse<any>>(
      `/auth/forgot-password`,
      {
        body: JSON.stringify({ identifier, turnstileToken }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Something went wrong',
    };
  }
};

export const resetPassword = async (payload: any) => {
  try {
    const res = await serverFetch.post<ApiResponse<any>>(
      `/auth/reset-password`,
      {
        body: JSON.stringify(payload),
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
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Something went wrong',
    };
  }
};
