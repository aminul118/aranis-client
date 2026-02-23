'use server';

import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';

const changePassword = async (data: {
  oldPassword: string;
  newPassword: string;
}) => {
  return await serverFetch.post<ApiResponse<null>>('/auth/change-password', {
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export { changePassword };
