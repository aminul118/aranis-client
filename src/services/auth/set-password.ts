/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import serverFetch from '@/lib/server-fetch';
import { ActionError } from '@/lib/serverResponse';
import { ApiResponse } from '@/types';

const setPassword = async (formData: FormData) => {
  try {
    const payload = {
      newPassword: formData.get('newPassword'),
    };
    return await serverFetch.post<ApiResponse<null>>('/auth/set-password', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error: any) {
    ActionError(false, null, error.message);
  }
};

export { setPassword };
