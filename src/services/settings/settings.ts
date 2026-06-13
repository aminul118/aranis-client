'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';
import { revalidatePath } from 'next/cache';

export interface ISocialLink {
  platform: string;
  url: string;
  isActive: boolean;
}

export interface ISiteSetting {
  _id?: string;
  logo: string;
  socialLinks: ISocialLink[];
  contactNumber?: string;
  email?: string;
  location?: string;
}

const getSiteSettings = async () => {
  return await serverFetch.get<ApiResponse<ISiteSetting>>('/site-settings', {
    next: {
      tags: ['site-settings'],
      revalidate: false,
    },
  });
};

const updateSiteSettings = async (
  payload: Partial<ISiteSetting> | FormData,
) => {
  const isFormData = payload instanceof FormData;

  // eslint-disable-next-line no-console
  console.log(
    'UPDATE SITE SETTINGS ACTION RECEIVED:',
    isFormData ? 'FormData Object' : payload,
  );

  const res = await serverFetch.patch<ApiResponse<ISiteSetting>>(
    '/site-settings',
    {
      body: isFormData ? payload : JSON.stringify(payload),
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    },
  );
  await revalidate('site-settings');
  revalidatePath('/', 'layout');
  return res;
};

export { getSiteSettings, updateSiteSettings };
