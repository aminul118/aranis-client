'use server';

import serverFetch from '@/lib/server-fetch';
import { ApiResponse, IUser } from '@/types';
import { setAccessToken, setRefreshToken } from '../cookie-token';

interface IOtp {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

const verifyOTP = async (payload: { identifier: string; otp: string }) => {
  try {
    const res = await serverFetch.post<ApiResponse<IOtp | null>>(
      '/auth/verify-otp',
      {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );

    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Invalid OTP' };
    }

    const { accessToken, refreshToken, user } = res.data;

    if (accessToken && refreshToken) {
      await setAccessToken(accessToken);
      await setRefreshToken(refreshToken);
    }

    return {
      success: true,
      user,
      message: res.message || 'Successful',
    };
  } catch (err: any) {
    return { success: false, message: 'OTP verification failed' };
  }
};

export { verifyOTP };
