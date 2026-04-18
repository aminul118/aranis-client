'use server';

import serverFetch from '@/lib/server-fetch';
import { ApiResponse, IUser } from '@/types';

export const registerWithOTP = async (payload: Partial<IUser>) => {
  try {
    const res = await serverFetch.post<ApiResponse<IUser>>('/auth/register', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return res;
  } catch (err: any) {
    return {
      success: false,
      message: 'Registration failed',
    };
  }
};
