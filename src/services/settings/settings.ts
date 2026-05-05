'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';

export interface ISocialLink {
  platform: string;
  url: string;
  isActive: boolean;
}

export interface ISiteSetting {
  _id?: string;
  logo: string;
  socialLinks: ISocialLink[];
  title?: string;
  description?: string;
  keywords?: string;
  baseImage?: string;
  activeOfferTag?: string;
}

const getSiteSettings = async () => {
  return await serverFetch.get<ApiResponse<ISiteSetting>>('/site-settings', {
    next: {
      tags: ['site-settings'],
      revalidate: 3600,
    },
  });
};

const updateSiteSettings = async (
  payload: Partial<ISiteSetting> | FormData,
) => {
  const isFormData = payload instanceof FormData;

  const res = await serverFetch.patch<ApiResponse<ISiteSetting>>(
    '/site-settings',
    {
      body: isFormData ? payload : JSON.stringify(payload),
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    },
  );
  revalidate('site-settings');
  return res;
};

export { getSiteSettings, updateSiteSettings };
