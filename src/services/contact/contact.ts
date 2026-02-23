'use server';

import serverFetch from '@/lib/server-fetch';
import { ApiResponse, IContact } from '@/types';

type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const contactAction = async (payload: ContactPayload) => {
  const res = await serverFetch.post<ApiResponse<IContact>>('/contact', {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return res;
};

export { contactAction };
