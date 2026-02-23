'use server';

import serverFetch from '@/lib/server-fetch';
import { ActionError } from '@/lib/serverResponse';
import { ApiResponse, IUser } from '@/types';
import { setAccessToken, setRefreshToken } from '../cookie-token';

interface IOtp {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

const verifyOTP = async (formData: FormData) => {
  try {
    const payload = {
      email: formData.get('email'),
      otp: formData.get('otp'),
    };

    const res = await serverFetch.post<ApiResponse<IOtp | null>>(
      '/otp/verify',
      {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );

    if (!res.success || !res.data) {
      return ActionError(false, null, res.message || 'Invalid OTP');
    }

    const { accessToken, refreshToken, user } = res.data;

    await setAccessToken(accessToken);
    await setRefreshToken(refreshToken);

    return {
      success: true,
      user,
      message: 'Login successful',
    };
  } catch {
    return ActionError(false, null, 'Wrong OTP');
  }
};

export { verifyOTP };
