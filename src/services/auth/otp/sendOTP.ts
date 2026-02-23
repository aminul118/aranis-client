'use server';

import serverFetch from '@/lib/server-fetch';
import { ActionError } from '@/lib/serverResponse';
import { ApiResponse } from '@/types';

const sendOTP = async (email: string | null) => {
  try {
    const payload = {
      email,
    };

    const res = await serverFetch.post<ApiResponse<null>>('/otp/re-send', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return res;
  } catch {
    return ActionError(false, null, 'Wrong OTP');
  }
};

export { sendOTP };
