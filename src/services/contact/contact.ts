'use server';

import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';
import { ContactPayload, IContact } from './contact.interface';

const contactAction = async (payload: ContactPayload) => {
  return await serverFetch.post<ApiResponse<IContact>>('/contact', {
    body: JSON.stringify(payload),
  });
};

export { contactAction };
