'use server';

import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';

const requestOTP = async (identifier: string) => {
  try {
    const res = await serverFetch.post<ApiResponse<null>>('/auth/request-otp', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier }),
    });
    return res;
  } catch {
    return { success: false, message: 'Failed to request OTP' };
  }
};

export { requestOTP };
